import { createHmac, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/supabase/admin";
import { refLabel } from "@/lib/format";
import type { Cobranca } from "@/lib/cobranca/status";

const API = "https://api.mercadopago.com";

function token() {
  const t = process.env.MP_ACCESS_TOKEN;
  if (!t) throw new Error("MP_ACCESS_TOKEN não configurado.");
  return t;
}

function appUrl() {
  return (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

export type PagamentoMP = {
  id: number;
  status: string;
  external_reference: string | null;
  transaction_amount: number;
  payment_type_id: string | null;
  date_approved: string | null;
};

/** Cria a preferência do Checkout Pro e devolve o link de pagamento. */
export async function criarPreferencia(cobranca: Cobranca) {
  const base = appUrl();
  const https = base.startsWith("https://");
  const corpo: Record<string, unknown> = {
    items: [
      {
        id: cobranca.id,
        title: `Mensalidade BR Solar Editor – ${refLabel(cobranca.referencia)}`,
        quantity: 1,
        unit_price: cobranca.valor,
        currency_id: "BRL",
      },
    ],
    external_reference: cobranca.id,
    statement_descriptor: "BR SOLAR",
    back_urls: { success: `${base}/pagamentos`, pending: `${base}/pagamentos`, failure: `${base}/pagamentos` },
  };
  // O Mercado Pago só aceita notificação/retorno automático em URL pública https.
  if (https) {
    corpo.notification_url = `${base}/api/mercadopago/webhook`;
    corpo.auto_return = "approved";
  }
  const r = await fetch(`${API}/checkout/preferences`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`Mercado Pago (${r.status}): ${await r.text()}`);
  const pref = (await r.json()) as { id: string; init_point: string };
  await db().from("cobrancas").update({ mp_preference_id: pref.id }).eq("id", cobranca.id);
  return pref.init_point;
}

export async function buscarPagamento(id: string | number): Promise<PagamentoMP | null> {
  const r = await fetch(`${API}/v1/payments/${encodeURIComponent(String(id))}`, {
    headers: { Authorization: `Bearer ${token()}` },
    cache: "no-store",
    signal: new AbortController().signal, // sem memoização do Next na renderização
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`Mercado Pago (${r.status}): ${await r.text()}`);
  return (await r.json()) as PagamentoMP;
}

/**
 * Conciliação: para cada cobrança pendente cujo checkout já foi aberto, pergunta ao Mercado Pago
 * se existe pagamento aprovado com aquele external_reference. Garante a baixa mesmo sem webhook
 * e sem o redirecionamento de volta (localhost, aba fechada, Pix pago depois). Não lança erro:
 * se o Mercado Pago estiver fora do ar, a página simplesmente segue com o que já está no banco.
 */
export async function conciliarPendentes(cobrancas: Cobranca[]): Promise<boolean> {
  let mudou = false;
  for (const c of cobrancas) {
    if (c.status !== "pendente" || !c.mp_preference_id) continue;
    try {
      const r = await fetch(
        `${API}/v1/payments/search?external_reference=${encodeURIComponent(c.id)}&sort=date_created&criteria=desc&limit=10`,
        { headers: { Authorization: `Bearer ${token()}` }, cache: "no-store", signal: new AbortController().signal },
      );
      if (!r.ok) continue;
      const { results } = (await r.json()) as { results?: PagamentoMP[] };
      const aprovado = results?.find((p) => p.status === "approved");
      if (aprovado && (await registrarPagamento(aprovado))) mudou = true;
    } catch (e) {
      console.error("conciliação mercadopago:", e);
    }
  }
  return mudou;
}

/** Valida o cabeçalho x-signature do webhook (HMAC-SHA256 com a assinatura secreta). */
export function validarAssinatura(req: Request, dataId: string | null): boolean {
  const segredo = process.env.MP_WEBHOOK_SECRET;
  const assinatura = req.headers.get("x-signature");
  const requestId = req.headers.get("x-request-id");
  if (!segredo || !assinatura || !requestId || !dataId) return false;

  const partes = Object.fromEntries(
    assinatura.split(",").map((p) => {
      const [k, ...v] = p.trim().split("=");
      return [k, v.join("=")];
    }),
  );
  if (!partes.ts || !partes.v1) return false;

  const manifesto = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${partes.ts};`;
  const esperado = createHmac("sha256", segredo).update(manifesto).digest("hex");
  const a = Buffer.from(esperado);
  const b = Buffer.from(partes.v1);
  return a.length === b.length && timingSafeEqual(a, b);
}

const METODOS: Record<string, string> = {
  bank_transfer: "Pix",
  credit_card: "Cartão de crédito",
  debit_card: "Cartão de débito",
  ticket: "Boleto",
  account_money: "Saldo Mercado Pago",
};

/** Marca a cobrança como paga se o pagamento foi aprovado. Idempotente. */
export async function registrarPagamento(p: PagamentoMP): Promise<boolean> {
  if (p.status !== "approved" || !p.external_reference) return false;

  const { data: cobranca } = await db().from("cobrancas").select("id, valor, status").eq("id", p.external_reference).maybeSingle();
  if (!cobranca || cobranca.status !== "pendente") return false;
  if (Number(p.transaction_amount) < Number(cobranca.valor)) return false;

  const { error } = await db()
    .from("cobrancas")
    .update({
      status: "pago",
      pago_em: p.date_approved ?? new Date().toISOString(),
      metodo: METODOS[p.payment_type_id ?? ""] ?? p.payment_type_id,
      mp_payment_id: String(p.id),
      baixa_manual: false,
    })
    .eq("id", cobranca.id)
    .eq("status", "pendente");
  if (error) throw new Error("registrarPagamento: " + error.message);
  return true;
}

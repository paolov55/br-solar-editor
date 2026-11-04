import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
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

/**
 * Cria o pedido (API de Pedidos, Checkout Pro) e devolve o link de pagamento.
 * O id do pedido fica na coluna `mp_preference_id` (nome herdado da API antiga de preferências,
 * mantido para não exigir nova migration) e é o que a conciliação consulta depois.
 */
export async function criarPedido(cobranca: Cobranca) {
  const base = appUrl();
  const titulo = `Mensalidade BR Solar Editor – ${refLabel(cobranca.referencia)}`;
  const valor = cobranca.valor.toFixed(2);
  // E-mail do pagador (campo exigido na avaliação de qualidade do Mercado Pago).
  const email = process.env.USUARIO_EMAIL?.trim();

  const corpo = {
    type: "online",
    processing_mode: "manual",
    total_amount: valor,
    external_reference: cobranca.id,
    description: titulo,
    items: [{ title: titulo, unit_price: valor, quantity: 1 }],
    ...(email ? { payer: { email } } : {}),
    config: {
      statement_descriptor: "BR SOLAR", // texto na fatura do cartão
      online: {
        success_url: `${base}/pagamentos`,
        failure_url: `${base}/pagamentos`,
        pending_url: `${base}/pagamentos`,
        auto_return: "approved",
      },
    },
  };
  const r = await fetch(`${API}/v1/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": randomUUID(),
    },
    body: JSON.stringify(corpo),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`Mercado Pago (${r.status}): ${await r.text()}`);
  const pedido = (await r.json()) as { id: string; checkout_url: string };
  await db().from("cobrancas").update({ mp_preference_id: pedido.id }).eq("id", cobranca.id);
  return pedido.checkout_url;
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

type PedidoMP = {
  id: string;
  status: string;
  external_reference: string | null;
  total_amount?: string;
  transactions?: {
    payments?: {
      id: string | number;
      status?: string;
      amount?: string | number;
      paid_amount?: string | number;
      payment_method?: { id?: string; type?: string };
    }[];
  };
};

export async function buscarPedido(id: string): Promise<PedidoMP | null> {
  const r = await fetch(`${API}/v1/orders/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${token()}` },
    cache: "no-store",
    signal: new AbortController().signal, // sem memoização do Next na renderização
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`Mercado Pago (${r.status}): ${await r.text()}`);
  return (await r.json()) as PedidoMP;
}

// status de pagamento dentro de um pedido que significam "aprovado"
const PAGO_NO_PEDIDO = new Set(["processed", "approved", "accredited"]);

/** Consulta o pedido no Mercado Pago e, se houver pagamento aprovado, dá baixa na cobrança. */
export async function conciliarPedido(pedidoId: string): Promise<boolean> {
  const pedido = await buscarPedido(pedidoId);
  if (!pedido?.external_reference) return false;

  for (const t of pedido.transactions?.payments ?? []) {
    // Preferimos os dados do pagamento em si (data, forma, valor); se a consulta falhar,
    // usamos o que veio dentro do pedido.
    let pagamento = await buscarPagamento(t.id).catch(() => null);
    if (!pagamento) {
      if (!PAGO_NO_PEDIDO.has(t.status ?? "")) continue;
      pagamento = {
        id: Number(t.id),
        status: "approved",
        external_reference: pedido.external_reference,
        transaction_amount: Number(t.paid_amount ?? t.amount ?? 0),
        payment_type_id: t.payment_method?.type ?? null,
        date_approved: null,
      };
    }
    // pagamentos criados por pedido podem não repetir o external_reference
    pagamento.external_reference ??= pedido.external_reference;
    if (await registrarPagamento(pagamento)) return true;
  }
  return false;
}

/**
 * Conciliação: para cada cobrança pendente cujo checkout já foi aberto, consulta o pedido no
 * Mercado Pago. Garante a baixa mesmo sem webhook e sem o redirecionamento de volta
 * (localhost, aba fechada, Pix pago depois). Não lança erro: se o Mercado Pago estiver fora do
 * ar, a página simplesmente segue com o que já está no banco.
 */
export async function conciliarPendentes(cobrancas: Cobranca[]): Promise<boolean> {
  let mudou = false;
  for (const c of cobrancas) {
    // só pedidos novos (ORD...); ids antigos de preferência são ignorados
    if (c.status !== "pendente" || !c.mp_preference_id?.startsWith("ORD")) continue;
    try {
      if (await conciliarPedido(c.mp_preference_id)) mudou = true;
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

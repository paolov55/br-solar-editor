"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exigirSessao } from "@/lib/auth/sessao";
import { dataValida, hoje, primeiroDoMes, vencimentoDoMes } from "@/lib/cobranca/datas";
import { db } from "@/lib/supabase/admin";

async function alterar(id: string, campos: Record<string, unknown>) {
  const { error } = await db().from("cobrancas").update(campos).eq("id", id);
  if (error) throw new Error("cobrancas: " + error.message);
  revalidatePath("/admin");
}

const idDe = (f: FormData) => String(f.get("id") ?? "");

export async function darBaixa(formData: FormData) {
  await exigirSessao("admin");
  await alterar(idDe(formData), {
    status: "pago",
    pago_em: new Date().toISOString(),
    metodo: "Baixa manual",
    baixa_manual: true,
  });
}

export async function isentar(formData: FormData) {
  await exigirSessao("admin");
  await alterar(idDe(formData), { status: "isento", pago_em: null, metodo: null, baixa_manual: false });
}

/**
 * Desfaz baixa manual/isenção/pagamento lançado por engano.
 * Descarta também o pedido do Mercado Pago (`mp_preference_id`): senão a conciliação, que roda ao
 * carregar a página, encontraria o pagamento aprovado e daria baixa de novo na hora.
 */
export async function reabrir(formData: FormData) {
  await exigirSessao("admin");
  await alterar(idDe(formData), {
    status: "pendente",
    pago_em: null,
    metodo: null,
    mp_payment_id: null,
    mp_preference_id: null,
    baixa_manual: false,
  });
}

export async function alterarVencimento(formData: FormData) {
  await exigirSessao("admin");
  const data = String(formData.get("vencimento") ?? "");
  if (!dataValida(data)) return;
  await alterar(idDe(formData), { vencimento: data });
}

/** Lê um valor em reais (aceita vírgula). Retorna null se vazio, inválido ou <= 0. */
function valorDe(f: FormData, campo: string): number | null {
  const bruto = String(f.get(campo) ?? "").trim().replace(",", ".");
  if (!bruto) return null;
  const n = Math.round(Number(bruto) * 100) / 100;
  return Number.isFinite(n) && n > 0 && n < 100000 ? n : null;
}

/** Altera o valor de uma cobrança pendente. O pedido antigo no Mercado Pago (preço velho) é descartado. */
export async function alterarValor(formData: FormData) {
  await exigirSessao("admin");
  const valor = valorDe(formData, "valor");
  if (valor === null) return;
  const { error } = await db()
    .from("cobrancas")
    .update({ valor, mp_preference_id: null })
    .eq("id", idDe(formData))
    .eq("status", "pendente");
  if (error) throw new Error("cobrancas: " + error.message);
  revalidatePath("/admin");
}

export async function salvarConfig(formData: FormData) {
  await exigirSessao("admin");
  const valor = valorDe(formData, "valor");
  const dia = Number(formData.get("dia_vencimento"));
  const lembrete = Number(formData.get("lembrete_dias"));
  const mesInicio = String(formData.get("inicio") ?? ""); // <input type="month"> → YYYY-MM
  if (valor === null) redirect("/admin?erro=valor");
  if (!Number.isInteger(dia) || dia < 1 || dia > 28) redirect("/admin?erro=dia");
  if (!Number.isInteger(lembrete) || lembrete < 0 || lembrete > 30) redirect("/admin?erro=lembrete");
  if (!/^\d{4}-\d{2}$/.test(mesInicio)) redirect("/admin?erro=inicio");

  const { error } = await db()
    .from("config_cobranca")
    .update({ valor, dia_vencimento: dia, lembrete_dias: lembrete, inicio: primeiroDoMes(mesInicio + "-01") })
    .eq("id", true);
  if (error) throw new Error("config_cobranca: " + error.message);

  // Atualiza valor e vencimento das pendentes que ainda não venceram (as vencidas ficam como estão).
  const { data: pendentes } = await db().from("cobrancas").select("id, referencia, vencimento, valor").eq("status", "pendente");
  for (const c of pendentes ?? []) {
    if (c.vencimento < hoje()) continue;
    const campos: Record<string, unknown> = {};
    const novo = vencimentoDoMes(c.referencia, dia);
    // não empurra para o passado: mudar o dia não pode bloquear o usuário de repente
    if (novo !== c.vencimento && novo >= hoje()) campos.vencimento = novo;
    if (Number(c.valor) !== valor) {
      campos.valor = valor;
      campos.mp_preference_id = null;
    }
    if (Object.keys(campos).length) await db().from("cobrancas").update(campos).eq("id", c.id);
  }

  revalidatePath("/admin");
  redirect("/admin?salvo=1");
}

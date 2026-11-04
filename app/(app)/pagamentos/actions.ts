"use server";

import { redirect } from "next/navigation";
import { exigirSessao } from "@/lib/auth/sessao";
import { garantirCobrancas, obterConfig } from "@/lib/cobranca/status";
import { conciliarPendentes, criarPreferencia } from "@/lib/mercadopago";

/** Gera o checkout do Mercado Pago para uma cobrança pendente e redireciona o usuário. */
export async function pagar(formData: FormData) {
  await exigirSessao("usuario");
  const id = String(formData.get("id") ?? "");

  const cobrancas = await garantirCobrancas(await obterConfig());
  const cobranca = cobrancas.find((c) => c.id === id && c.status === "pendente");
  if (!cobranca) redirect("/pagamentos");

  // Se ela já foi paga num checkout anterior, só registra e volta (evita pagar duas vezes).
  if (await conciliarPendentes([cobranca])) redirect("/pagamentos");

  const link = await criarPreferencia(cobranca);
  redirect(link);
}

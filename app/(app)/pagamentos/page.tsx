import { Suspense } from "react";
import { exigirSessao } from "@/lib/auth/sessao";
import { dataEmBrasilia } from "@/lib/cobranca/datas";
import { calcularSituacao, garantirCobrancas, obterConfig, type Cobranca } from "@/lib/cobranca/status";
import { buscarPagamento, conciliarPendentes, registrarPagamento } from "@/lib/mercadopago";
import { brl, dataBr, refLabel } from "@/lib/format";
import { redirect } from "next/navigation";
import { pagar } from "./actions";

type Busca = { [chave: string]: string | string[] | undefined };

const um = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const STATUS = {
  pendente: { texto: "Pendente", cor: "bg-[#fff1de] text-[#a85a00]" },
  pago: { texto: "Pago", cor: "bg-[#e3f5e8] text-[#1b7a39]" },
  isento: { texto: "Isento", cor: "bg-[#eee] text-[#666]" },
} as const;

function BotaoPagar({ c, rotulo, destaque }: { c: Cobranca; rotulo: string; destaque?: boolean }) {
  return (
    <form action={pagar}>
      <input type="hidden" name="id" value={c.id} />
      <button
        className={
          "cursor-pointer rounded-lg font-bold " +
          (destaque
            ? "bg-brand text-ink px-5 py-3 text-[15px] hover:bg-[#ffa133]"
            : "bg-[#f3f3f5] border border-line px-3 py-1.5 text-[13px] hover:bg-[#e9e9ec]")
        }
      >
        {rotulo}
      </button>
    </form>
  );
}

async function Conteudo({ busca }: { busca: Promise<Busca> }) {
  const sessao = await exigirSessao();
  if (sessao.papel === "admin") redirect("/admin");

  const params = await busca;
  const paymentId = um(params.payment_id) ?? um(params.collection_id);
  let confirmacao: string | null = null;

  // Volta do checkout: confirma o pagamento direto na API (não depende do webhook chegar antes).
  if (paymentId && /^\d+$/.test(paymentId)) {
    const pagamento = await buscarPagamento(paymentId);
    if (pagamento) {
      const registrado = await registrarPagamento(pagamento);
      // "approved" sem baixa ainda: a conciliação abaixo (pelo pedido) decide se mostra a confirmação
      if (registrado) confirmacao = "ok";
      else if (pagamento.status === "pending" || pagamento.status === "in_process") confirmacao = "pendente";
      else if (pagamento.status !== "approved") confirmacao = "recusado";
    }
  }

  const cfg = await obterConfig();
  let cobrancas = await garantirCobrancas(cfg);
  // Confere no Mercado Pago se algum checkout já aberto foi pago (não depende de webhook nem do retorno).
  if (await conciliarPendentes(cobrancas)) {
    cobrancas = await garantirCobrancas(cfg);
    confirmacao ??= "ok";
  }
  const sit = calcularSituacao(cobrancas, cfg);
  const bloqueado = um(params.bloqueado) === "1" || sit.estado === "vencida";
  const historico = [...cobrancas].reverse();
  const totalPago = cobrancas.filter((c) => c.status === "pago").reduce((s, c) => s + c.valor, 0);

  const titulo =
    sit.estado === "vencida"
      ? "Mensalidade vencida"
      : sit.estado === "a_vencer"
        ? "Mensalidade a vencer"
        : "Tudo em dia";
  const detalhe =
    sit.estado === "em_dia"
      ? sit.aberta
        ? `Próxima mensalidade: ${brl(sit.aberta.valor)} com vencimento em ${dataBr(sit.aberta.vencimento)}.`
        : "Nenhuma mensalidade em aberto."
      : sit.aberta
        ? `${refLabel(sit.aberta.referencia)} — ${brl(sit.aberta.valor)}, vencimento em ${dataBr(sit.aberta.vencimento)}.`
        : "";

  return (
    <div className="max-w-3xl w-full mx-auto px-5 py-8 flex flex-col gap-5">
      <h1 className="font-cond text-4xl font-extrabold leading-none m-0">Pagamentos</h1>

      {confirmacao === "ok" && (
        <div className="rounded-xl border border-[#bfe5ca] bg-[#e3f5e8] text-[#1b7a39] px-4 py-3 text-[14.5px] font-semibold">
          Pagamento confirmado. Obrigado!
        </div>
      )}
      {confirmacao === "pendente" && (
        <div className="rounded-xl border border-[#f3d9b0] bg-[#fff1de] text-[#a85a00] px-4 py-3 text-[14.5px] font-semibold">
          Pagamento em processamento. O acesso é liberado assim que o Mercado Pago confirmar (boleto pode levar até 3 dias úteis).
        </div>
      )}
      {confirmacao === "recusado" && (
        <div className="rounded-xl border border-[#f1c4c4] bg-[#fdeaea] text-[#b42323] px-4 py-3 text-[14.5px] font-semibold">
          O pagamento não foi aprovado. Tente novamente ou use outra forma de pagamento.
        </div>
      )}
      {bloqueado && confirmacao !== "ok" && (
        <div className="rounded-xl border border-[#f1c4c4] bg-[#fdeaea] text-[#b42323] px-4 py-3 text-[14.5px] font-semibold">
          O acesso à plataforma está bloqueado por mensalidade em atraso. Regularize o pagamento abaixo para liberar.
        </div>
      )}

      <section className="bg-white border border-line rounded-2xl p-6 flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={
              "block w-2.5 h-2.5 rounded-full " +
              (sit.estado === "vencida" ? "bg-red-600" : sit.estado === "a_vencer" ? "bg-brand" : "bg-green-600")
            }
          />
          <h2 className="font-cond text-2xl font-extrabold leading-none m-0">{titulo}</h2>
        </div>
        <p className="m-0 text-[15px] text-[#555]">{detalhe}</p>
        {sit.aberta && (
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <BotaoPagar c={sit.aberta} rotulo={`Pagar ${brl(sit.aberta.valor)}`} destaque />
            <span className="text-[13px] text-[#777]">Pix, cartão ou boleto, pelo Mercado Pago.</span>
          </div>
        )}
      </section>

      <section className="bg-white border border-line rounded-2xl overflow-hidden">
        <div className="px-6 py-4 flex items-baseline justify-between border-b border-line">
          <h2 className="font-cond text-2xl font-extrabold leading-none m-0">Histórico</h2>
          <span className="text-[13px] text-[#777]">Total pago: {brl(totalPago)}</span>
        </div>
        {historico.length === 0 ? (
          <p className="m-0 px-6 py-5 text-[14.5px] text-[#777]">Nenhuma cobrança gerada ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[14px] border-collapse">
              <thead>
                <tr className="text-left text-[12px] uppercase tracking-wide text-[#888]">
                  <th className="px-6 py-2.5 font-semibold">Referência</th>
                  <th className="px-3 py-2.5 font-semibold">Vencimento</th>
                  <th className="px-3 py-2.5 font-semibold">Valor</th>
                  <th className="px-3 py-2.5 font-semibold">Status</th>
                  <th className="px-3 py-2.5 font-semibold">Pago em</th>
                  <th className="px-3 py-2.5 font-semibold">Forma</th>
                  <th className="px-6 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {historico.map((c) => (
                  <tr key={c.id} className="border-t border-line">
                    <td className="px-6 py-3 font-semibold">{refLabel(c.referencia)}</td>
                    <td className="px-3 py-3">{dataBr(c.vencimento)}</td>
                    <td className="px-3 py-3">{brl(c.valor)}</td>
                    <td className="px-3 py-3">
                      <span className={"rounded-full px-2.5 py-0.5 text-[12px] font-bold " + STATUS[c.status].cor}>
                        {STATUS[c.status].texto}
                      </span>
                    </td>
                    <td className="px-3 py-3">{c.pago_em ? dataBr(dataEmBrasilia(c.pago_em)) : "—"}</td>
                    <td className="px-3 py-3">{c.baixa_manual ? "Baixa manual" : (c.metodo ?? "—")}</td>
                    <td className="px-6 py-3 text-right">
                      {c.status === "pendente" && <BotaoPagar c={c} rotulo="Pagar" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default function PagamentosPage({ searchParams }: { searchParams: Promise<Busca> }) {
  return (
    <main className="flex-1">
      <Suspense fallback={<div className="p-8 text-[14px] text-[#777]">Carregando…</div>}>
        <Conteudo busca={searchParams} />
      </Suspense>
    </main>
  );
}

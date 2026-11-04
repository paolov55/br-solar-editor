import { Suspense } from "react";
import { exigirSessao } from "@/lib/auth/sessao";
import { hoje } from "@/lib/cobranca/datas";
import { calcularSituacao, garantirCobrancas, obterConfig } from "@/lib/cobranca/status";
import { conciliarPendentes } from "@/lib/mercadopago";
import { db } from "@/lib/supabase/admin";
import { brl, dataBr, refLabel } from "@/lib/format";
import { alterarVencimento, darBaixa, isentar, reabrir, salvarConfig } from "./actions";

type Busca = { [chave: string]: string | string[] | undefined };
const um = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const STATUS = {
  pendente: { texto: "Pendente", cor: "bg-[#fff1de] text-[#a85a00]" },
  pago: { texto: "Pago", cor: "bg-[#e3f5e8] text-[#1b7a39]" },
  isento: { texto: "Isento", cor: "bg-[#eee] text-[#666]" },
} as const;

const ERROS: Record<string, string> = {
  dia: "O dia de vencimento deve estar entre 1 e 28.",
  lembrete: "A antecedência do lembrete deve estar entre 0 e 30 dias.",
  inicio: "Informe o mês de início.",
};

const botao = "cursor-pointer rounded-md bg-[#f3f3f5] border border-line px-2.5 py-1 text-[12.5px] font-semibold hover:bg-[#e9e9ec]";
const campo = "border border-[#ddd] rounded-lg px-3 py-2 text-[14.5px] outline-none focus:border-brand bg-white";

function Card({ rotulo, valor, detalhe, cor }: { rotulo: string; valor: string; detalhe?: string; cor?: string }) {
  return (
    <div className="bg-white border border-line rounded-2xl p-5 flex flex-col gap-1">
      <span className="text-[12px] uppercase tracking-wide text-[#888] font-semibold">{rotulo}</span>
      <span className={"font-cond text-3xl font-extrabold leading-none " + (cor ?? "")}>{valor}</span>
      {detalhe && <span className="text-[13px] text-[#777]">{detalhe}</span>}
    </div>
  );
}

async function Conteudo({ busca }: { busca: Promise<Busca> }) {
  await exigirSessao("admin");
  const params = await busca;

  const cfg = await obterConfig();
  let cobrancas = await garantirCobrancas(cfg);
  if (await conciliarPendentes(cobrancas)) cobrancas = await garantirCobrancas(cfg);
  const sit = calcularSituacao(cobrancas, cfg);

  const loginUsuario = (process.env.USUARIO_LOGIN ?? "").toLowerCase();
  const { data: aceite } = await db()
    .from("termos_aceites")
    .select("versao, aceito_em, ip")
    .eq("login", loginUsuario)
    .order("aceito_em", { ascending: false })
    .limit(1)
    .maybeSingle();

  const recebido = cobrancas.filter((c) => c.status === "pago").reduce((s, c) => s + c.valor, 0);
  const emAtraso = cobrancas.filter((c) => c.status === "pendente" && c.vencimento < hoje()).length;
  const lista = [...cobrancas].reverse();
  const erro = ERROS[um(params.erro) ?? ""];

  const situacaoTxt = { em_dia: "Em dia", a_vencer: "A vencer", vencida: "Bloqueado" }[sit.estado];
  const situacaoCor = { em_dia: "text-green-700", a_vencer: "text-[#c96a00]", vencida: "text-red-600" }[sit.estado];

  return (
    <div className="max-w-5xl w-full mx-auto px-5 py-8 flex flex-col gap-5">
      <h1 className="font-cond text-4xl font-extrabold leading-none m-0">Painel do administrador</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card
          rotulo={`Situação de ${loginUsuario || "usuário"}`}
          valor={situacaoTxt}
          cor={situacaoCor}
          detalhe={sit.estado === "vencida" ? "Acesso bloqueado até pagar" : sit.estado === "a_vencer" ? "Lembrete exibido" : "Sem pendências"}
        />
        <Card
          rotulo="Próximo vencimento"
          valor={sit.aberta ? dataBr(sit.aberta.vencimento) : "—"}
          detalhe={sit.aberta ? `${refLabel(sit.aberta.referencia)} · ${brl(sit.aberta.valor)}` : "Nada em aberto"}
        />
        <Card rotulo="Total recebido" valor={brl(recebido)} detalhe={emAtraso ? `${emAtraso} em atraso` : "Nenhuma em atraso"} />
        <Card
          rotulo="Termos de uso"
          valor={aceite ? "Aceito" : "Pendente"}
          cor={aceite ? "text-green-700" : "text-[#c96a00]"}
          detalhe={aceite ? `v${aceite.versao} · ${dataBr(String(aceite.aceito_em).slice(0, 10))} · IP ${aceite.ip ?? "—"}` : "Ainda não aceitou"}
        />
      </div>

      <section className="bg-white border border-line rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-line">
          <h2 className="font-cond text-2xl font-extrabold leading-none m-0">Cobranças</h2>
        </div>
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
                <th className="px-6 py-2.5 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((c) => {
                const atrasada = c.status === "pendente" && c.vencimento < hoje();
                return (
                  <tr key={c.id} className="border-t border-line align-middle">
                    <td className="px-6 py-3 font-semibold">{refLabel(c.referencia)}</td>
                    <td className={"px-3 py-3 " + (atrasada ? "text-red-600 font-semibold" : "")}>{dataBr(c.vencimento)}</td>
                    <td className="px-3 py-3">{brl(c.valor)}</td>
                    <td className="px-3 py-3">
                      <span className={"rounded-full px-2.5 py-0.5 text-[12px] font-bold " + STATUS[c.status].cor}>
                        {atrasada ? "Atrasada" : STATUS[c.status].texto}
                      </span>
                    </td>
                    <td className="px-3 py-3">{c.pago_em ? dataBr(c.pago_em.slice(0, 10)) : "—"}</td>
                    <td className="px-3 py-3">{c.metodo ?? "—"}</td>
                    <td className="px-6 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {c.status === "pendente" ? (
                          <>
                            <form action={darBaixa}>
                              <input type="hidden" name="id" value={c.id} />
                              <button className={botao}>Dar baixa</button>
                            </form>
                            <form action={isentar}>
                              <input type="hidden" name="id" value={c.id} />
                              <button className={botao}>Isentar</button>
                            </form>
                            <form action={alterarVencimento} className="flex items-center gap-1">
                              <input type="hidden" name="id" value={c.id} />
                              <input type="date" name="vencimento" defaultValue={c.vencimento} required className={campo + " !py-0.5 !px-2 !text-[12.5px]"} />
                              <button className={botao}>Alterar</button>
                            </form>
                          </>
                        ) : (
                          <form action={reabrir}>
                            <input type="hidden" name="id" value={c.id} />
                            <button className={botao}>Reabrir</button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white border border-line rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="font-cond text-2xl font-extrabold leading-none m-0">Configuração da cobrança</h2>
        {erro && <div className="text-sm text-red-600">{erro}</div>}
        {um(params.salvo) && <div className="text-sm text-green-700 font-semibold">Configuração salva.</div>}
        <form action={salvarConfig} className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1.5 text-[13px] text-[#666] font-semibold">
            Dia de vencimento (1–28)
            <input type="number" name="dia_vencimento" min={1} max={28} defaultValue={cfg.dia_vencimento} required className={campo + " w-36"} />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] text-[#666] font-semibold">
            Lembrete (dias antes)
            <input type="number" name="lembrete_dias" min={0} max={30} defaultValue={cfg.lembrete_dias} required className={campo + " w-36"} />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] text-[#666] font-semibold">
            Primeira cobrança em
            <input type="month" name="inicio" defaultValue={cfg.inicio.slice(0, 7)} required className={campo} />
          </label>
          <button className="bg-brand text-ink font-bold rounded-lg px-5 py-2.5 text-[14.5px] cursor-pointer hover:bg-[#ffa133]">
            Salvar
          </button>
        </form>
        <p className="m-0 text-[13px] text-[#777]">
          Valor da mensalidade: {brl(cfg.valor)}. Mudar o dia recalcula só as cobranças pendentes que ainda não venceram.
        </p>
      </section>
    </div>
  );
}

export default function AdminPage({ searchParams }: { searchParams: Promise<Busca> }) {
  return (
    <main className="flex-1">
      <Suspense fallback={<div className="p-8 text-[14px] text-[#777]">Carregando…</div>}>
        <Conteudo busca={searchParams} />
      </Suspense>
    </main>
  );
}

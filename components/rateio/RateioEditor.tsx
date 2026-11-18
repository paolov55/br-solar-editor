"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFeedback } from "@/components/ui/feedback";
import { nomeArquivoPdf } from "@/lib/pdf/exportar";
import {
  ErroModelo,
  MAX_LINHAS,
  UC_COMPENSACAO,
  UC_GERADORA,
  UC_VAZIA,
  gerarPdf,
  lerFormulario,
  lerNumero,
  validar,
  type DadosRateio,
  type LinhaRateio,
  type TipoRateio,
  type TipoUc,
} from "@/lib/rateio/neoenergia";

const ACEITES = [
  "Informações verdadeiras; solicitação clara e conforme a Resolução 1.000/2021 da ANEEL.",
  "Sou o representante legal (titular ou procurador) e estou anexando a documentação que outorga poderes.",
  "Estou anexando os demais documentos obrigatórios (sob pena de reenvio).",
  "Ciente de que a solicitação poderá ser indeferida se faltar informação ou documento obrigatório.",
  "Concordo com a coleta, armazenamento e tratamento dos dados pessoais (LGPD).",
];

const campo =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-[15px] outline-none focus:border-brand focus:ring-2 focus:ring-brand/25";
const rotulo = "block text-[12.5px] font-bold uppercase tracking-wide text-[#5A5A62] mb-1";

export default function RateioEditor() {
  const { toast, modal } = useFeedback();
  const [original, setOriginal] = useState<Uint8Array | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [dados, setDados] = useState<DadosRateio | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [gerando, setGerando] = useState(false);
  const [arrastando, setArrastando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const receber = useCallback(
    async (arquivo: File | undefined) => {
      if (!arquivo) return;
      if (arquivo.type !== "application/pdf" && !/\.pdf$/i.test(arquivo.name)) {
        toast("Envie um arquivo PDF.");
        return;
      }
      try {
        const bytes = new Uint8Array(await arquivo.arrayBuffer());
        const lido = await lerFormulario(bytes);
        setOriginal(bytes);
        setNomeArquivo(arquivo.name);
        setDados(lido);
      } catch (e) {
        toast(e instanceof ErroModelo ? e.message : "Não foi possível abrir este PDF.");
      }
    },
    [toast],
  );

  // Preview: regenera o PDF 600ms depois da última edição.
  const seq = useRef(0);
  useEffect(() => {
    if (!original || !dados) return;
    const id = ++seq.current;
    const t = setTimeout(async () => {
      setGerando(true);
      try {
        const bytes = await gerarPdf(original, dados);
        if (id !== seq.current) return;
        const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
        setPreviewUrl((antigo) => {
          if (antigo) URL.revokeObjectURL(antigo);
          return url;
        });
      } catch {
        if (id === seq.current) toast("Não foi possível atualizar o preview.");
      } finally {
        if (id === seq.current) setGerando(false);
      }
    }, 600);
    return () => clearTimeout(t);
  }, [original, dados, toast]);

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const baixar = useCallback(async () => {
    if (!original || !dados) return;
    try {
      const bytes = await gerarPdf(original, dados);
      const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = nomeArquivoPdf("Rateio", dados.cliente.codigo);
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast("PDF gerado.");
    } catch {
      toast("Não foi possível gerar o PDF.");
    }
  }, [original, dados, toast]);

  const pedirDownload = () => {
    if (!dados) return;
    const avisos = validar(dados);
    if (!avisos.length) return void baixar();
    modal({
      titulo: "Conferir antes de baixar",
      texto: avisos.map((a) => "• " + a).join("\n"),
      acoes: [
        { label: "Voltar e corrigir", onClick: () => {} },
        { label: "Baixar assim mesmo", primario: true, onClick: () => void baixar() },
      ],
    });
  };

  const trocar = () => {
    setOriginal(null);
    setDados(null);
    setPreviewUrl("");
    setNomeArquivo("");
  };

  // ───────── etapa 1: envio ─────────
  if (!original || !dados) {
    return (
      <main className="no-print flex-1 px-6 pt-10 pb-20 max-w-[760px] w-full mx-auto">
        <Link href="/" className="text-[14px] font-semibold text-brand-ink no-underline">
          ← Início
        </Link>
        <h1 className="font-cond text-[clamp(32px,5vw,44px)] font-extrabold leading-[1.05] mt-4 mb-2">
          Rateio
        </h1>
        <p className="text-[#666] text-[16px] leading-relaxed mb-8 max-w-[56ch]">
          Envie o formulário de alteração de rateio da Neoenergia em PDF. Você edita aqui, vê o resultado
          ao lado e baixa o PDF preenchido. O arquivo não sai do seu computador.
        </p>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setArrastando(true);
          }}
          onDragLeave={() => setArrastando(false)}
          onDrop={(e) => {
            e.preventDefault();
            setArrastando(false);
            void receber(e.dataTransfer.files[0]);
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
          className={
            "cursor-pointer rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors " +
            (arrastando ? "border-brand bg-[#FFF6EA]" : "border-[#C9C9CE] bg-white hover:border-brand")
          }
        >
          <div className="font-cond text-[26px] font-extrabold mb-1">Arraste o PDF aqui</div>
          <div className="text-[#666] text-[15px]">ou clique para escolher o arquivo</div>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              void receber(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
      </main>
    );
  }

  // ───────── etapa 2: edição ─────────
  const mudar = (p: Partial<DadosRateio>) => setDados({ ...dados, ...p });
  const mudarLinha = (i: number, p: Partial<LinhaRateio>) =>
    mudar({ linhas: dados.linhas.map((l, j) => (j === i ? { ...l, ...p } : l)) });
  const mudarCliente = (p: Partial<DadosRateio["cliente"]>) => mudar({ cliente: { ...dados.cliente, ...p } });

  const pct = dados.tipo === "percentual";
  const soma = dados.linhas.reduce((a, l) => a + (lerNumero(l.valor) ?? 0), 0);
  const somaOk = Math.abs(soma - 100) < 0.001;
  const linhasUsadas = dados.linhas.reduce((n, l, i) => (l.conta || l.uc || l.valor ? i + 1 : n), 0);
  const visiveis = Math.min(MAX_LINHAS, Math.max(linhasUsadas + 1, 5));

  return (
    <main className="no-print flex-1 w-full max-w-[1400px] mx-auto px-6 pt-6 pb-10">
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <Link href="/" className="text-[14px] font-semibold text-brand-ink no-underline">
          ← Início
        </Link>
        <h1 className="font-cond text-[30px] font-extrabold leading-none m-0">Rateio</h1>
        <span className="text-[13px] text-[#8A8A8A] truncate max-w-[40ch]">{nomeArquivo}</span>
        <div className="flex-1" />
        <button
          onClick={trocar}
          className="cursor-pointer rounded-lg px-4 py-2.5 text-[14.5px] font-semibold border bg-[#f3f3f5] border-line"
        >
          Trocar PDF
        </button>
        <button
          onClick={pedirDownload}
          className="cursor-pointer rounded-lg px-4 py-2.5 text-[14.5px] font-bold border bg-brand text-ink border-brand"
        >
          Baixar PDF
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start">
        <div className="flex flex-col gap-6">
          <section className="bg-white border border-line rounded-2xl p-5">
            <h2 className="font-cond text-[22px] font-extrabold m-0 mb-3">Tipo de solicitação</h2>
            <div className="flex gap-2">
              {(["percentual", "prioridade"] as TipoRateio[]).map((t) => (
                <button
                  key={t}
                  onClick={() => mudar({ tipo: t, linhas: dados.linhas.map((l) => ({ ...l, valor: "" })) })}
                  className={
                    "cursor-pointer rounded-lg px-4 py-2 text-[14.5px] font-semibold border " +
                    (dados.tipo === t ? "bg-brand text-ink border-brand font-bold" : "bg-[#f3f3f5] border-line")
                  }
                >
                  {t === "percentual" ? "Percentual" : "Prioridade"}
                </button>
              ))}
            </div>
            <p className="text-[13px] text-[#777] mt-2 mb-0">
              Trocar o tipo limpa a coluna de {pct ? "percentual" : "prioridade"}.
            </p>
          </section>

          <section className="bg-white border border-line rounded-2xl p-5">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-cond text-[22px] font-extrabold m-0">Unidades consumidoras</h2>
              {pct && (
                <span
                  className={
                    "text-[13px] font-bold rounded-full px-2.5 py-1 " +
                    (somaOk ? "bg-[#E6F6EA] text-[#1B7F3B]" : "bg-[#FFF3E3] text-brand-ink")
                  }
                >
                  Soma: {soma.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%
                </span>
              )}
            </div>
            <div className="grid grid-cols-[1fr_1.1fr_90px_32px] gap-2 mb-1">
              <span className={rotulo}>Conta contrato</span>
              <span className={rotulo}>Unidade</span>
              <span className={rotulo}>{pct ? "%" : "Ordem"}</span>
              <span />
            </div>
            <div className="flex flex-col gap-2">
              {dados.linhas.slice(0, visiveis).map((l, i) => (
                <div key={i} className="grid grid-cols-[1fr_1.1fr_90px_32px] gap-2">
                  <input
                    className={campo}
                    inputMode="numeric"
                    value={l.conta}
                    onChange={(e) => mudarLinha(i, { conta: e.target.value.replace(/\D/g, "") })}
                    aria-label={`Conta contrato, linha ${i + 1}`}
                  />
                  <select
                    className={campo}
                    value={l.uc}
                    onChange={(e) => mudarLinha(i, { uc: e.target.value as TipoUc })}
                    aria-label={`Unidade, linha ${i + 1}`}
                  >
                    <option value={UC_VAZIA}>—</option>
                    <option value={UC_GERADORA}>{UC_GERADORA}</option>
                    <option value={UC_COMPENSACAO}>{UC_COMPENSACAO}</option>
                  </select>
                  <input
                    className={campo}
                    inputMode="decimal"
                    value={l.valor}
                    onChange={(e) => mudarLinha(i, { valor: e.target.value.replace(pct ? /[^\d.,]/g : /\D/g, "") })}
                    aria-label={`${pct ? "Percentual" : "Prioridade"}, linha ${i + 1}`}
                  />
                  <button
                    onClick={() => mudarLinha(i, { conta: "", uc: UC_VAZIA, valor: "" })}
                    className="cursor-pointer text-[#999] hover:text-ink"
                    aria-label={`Limpar linha ${i + 1}`}
                    title="Limpar linha"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {visiveis < MAX_LINHAS && (
              <p className="text-[13px] text-[#777] mt-3 mb-0">
                Novas linhas aparecem conforme você preenche (máx. {MAX_LINHAS}). Acima disso, anexe uma
                planilha complementar, como pede o formulário.
              </p>
            )}
          </section>

          {!pct && (
            <section className="bg-white border border-line rounded-2xl p-5">
              <h2 className="font-cond text-[22px] font-extrabold m-0 mb-3">Unidade do excedente</h2>
              <label className={rotulo} htmlFor="excedente">
                Código do cliente que receberá o crédito remanescente
              </label>
              <input
                id="excedente"
                className={campo}
                inputMode="numeric"
                value={dados.excedente}
                onChange={(e) => mudar({ excedente: e.target.value.replace(/\D/g, "") })}
              />
            </section>
          )}

          <section className="bg-white border border-line rounded-2xl p-5">
            <h2 className="font-cond text-[22px] font-extrabold m-0 mb-3">Dados do cliente</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={rotulo} htmlFor="cod">Código do cliente (conta contrato)</label>
                <input id="cod" className={campo} inputMode="numeric" value={dados.cliente.codigo}
                  onChange={(e) => mudarCliente({ codigo: e.target.value.replace(/\D/g, "") })} />
              </div>
              <div>
                <label className={rotulo} htmlFor="cpf">CPF / CNPJ</label>
                <input id="cpf" className={campo} inputMode="numeric" value={dados.cliente.cpfCnpj}
                  onChange={(e) => mudarCliente({ cpfCnpj: e.target.value.replace(/[^\d.\-/]/g, "") })} />
              </div>
              <div>
                <label className={rotulo} htmlFor="tel">Celular para contato</label>
                <input id="tel" className={campo} inputMode="tel" value={dados.cliente.telefone}
                  onChange={(e) => mudarCliente({ telefone: e.target.value.replace(/[^\d()\- ]/g, "") })} />
              </div>
              <div>
                <label className={rotulo} htmlFor="mail">E-mail</label>
                <input id="mail" type="email" className={campo} value={dados.cliente.email}
                  onChange={(e) => mudarCliente({ email: e.target.value })} />
              </div>
            </div>
          </section>

          <section className="bg-white border border-line rounded-2xl p-5">
            <h2 className="font-cond text-[22px] font-extrabold m-0 mb-3">Declarações</h2>
            <div className="flex flex-col gap-2.5">
              {ACEITES.map((t, i) => (
                <label key={i} className="flex gap-3 items-start text-[14.5px] leading-snug cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 accent-[#ff8d02] w-4 h-4"
                    checked={dados.aceites[i]}
                    onChange={(e) => mudar({ aceites: dados.aceites.map((a, j) => (j === i ? e.target.checked : a)) })}
                  />
                  {t}
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:sticky lg:top-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12.5px] font-bold uppercase tracking-wide text-[#5A5A62]">Pré-visualização</span>
            <span className="text-[12.5px] text-[#8A8A8A]">{gerando ? "Atualizando…" : "Atualizado"}</span>
          </div>
          {previewUrl ? (
            <iframe
              src={previewUrl}
              title="Pré-visualização do PDF"
              className="w-full h-[80vh] min-h-[560px] rounded-2xl border border-line bg-white"
            />
          ) : (
            <div className="w-full h-[80vh] min-h-[560px] rounded-2xl border border-line bg-white flex items-center justify-center text-[#8A8A8A]">
              Gerando pré-visualização…
            </div>
          )}
          <p className="text-[12.5px] text-[#777] mt-2">
            Alguns leitores (como o Preview do macOS) mostram o percentual como fração (0.1 = 10%). É o
            comportamento do próprio formulário da Neoenergia.
          </p>
        </div>
      </div>
    </main>
  );
}

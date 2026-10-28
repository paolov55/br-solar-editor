import Link from "next/link";
import { Contagem } from "@/components/home-contagem";

const icone = {
  fatura: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  docs: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  proposta: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
};

const cards = [
  {
    href: "/faturas",
    titulo: "Fatura",
    icone: icone.fatura,
    texto: "Cobrança mensal por consumo ou valor fixo, com cálculo automático de desconto e economia.",
    itens: ["Consumo", "Valor fixo", "Em lote"],
    // sem nada salvo ainda, o editor abre com 5 faturas de exemplo
    rodape: <Contagem chave="brsolar.faturas.v1" campo="faturas" padrao="5" sufixo="salvas" />,
  },
  {
    href: "/documentos",
    titulo: "Documentação",
    icone: icone.docs,
    texto: "Contrato, procuração e termo de adesão gerados a partir de uma única qualificação do cliente.",
    itens: ["Contrato", "Procuração", "Termo de adesão"],
    rodape: <Contagem chave="brsolar.pacotes.v1" campo="pacotes" sufixo="pacotes" />,
  },
  {
    href: "/propostas",
    titulo: "Proposta",
    icone: icone.proposta,
    texto: "Sistema solar, carregador veicular ou serviço diverso, com seções ligáveis e desligáveis.",
    itens: ["Sistema solar", "Carregador", "Serviço"],
    rodape: <Contagem chave="brsolar.propostas.v1" campo="propostas" sufixo="salvas" />,
  },
];

export default function Home() {
  return (
    <main className="no-print flex-1 px-6 pt-14 pb-20 max-w-[1080px] w-full mx-auto">
      <div className="flex items-center gap-2.5 text-[13px] tracking-[0.16em] uppercase text-brand-ink font-bold">
        <span className="block w-6 h-[3px] rounded-full bg-brand" />
        BR Solar
      </div>
      <h1 className="font-cond text-[clamp(36px,6vw,52px)] font-extrabold leading-[1.05] mt-3 mb-3 tracking-tight">
        O que você quer gerar hoje?
      </h1>
      <p className="mb-10 text-[#666] text-[17px] leading-relaxed max-w-[52ch] text-pretty">
        Escolha o tipo de documento. Depois você parte de um arquivo anterior ou começa do zero.
      </p>
      <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group no-underline text-ink bg-white border border-line rounded-2xl p-6 flex flex-col gap-4 min-h-[300px] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-1 hover:border-brand hover:shadow-[0_18px_40px_-18px_rgba(201,106,0,0.45)] focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FFF3E3] text-brand-ink flex items-center justify-center transition-colors duration-200 group-hover:bg-brand group-hover:text-ink">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {c.icone}
              </svg>
            </div>
            <div>
              <div className="font-cond text-[30px] font-extrabold leading-none mb-2.5 text-ink">{c.titulo}</div>
              <div className="text-[#666] text-[15px] leading-snug text-pretty">{c.texto}</div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {c.itens.map((i) => (
                <span key={i} className="text-[12.5px] font-semibold text-[#5A5A62] bg-[#F3F3F5] rounded-full px-2.5 py-1">
                  {i}
                </span>
              ))}
            </div>
            <div className="flex-1" />
            <div className="flex items-center justify-between border-t border-line pt-4 text-[14.5px]">
              <span className="text-[#8A8A8A] font-semibold">{c.rodape}</span>
              <span className="flex items-center gap-1.5 font-bold text-brand-ink">
                Abrir
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

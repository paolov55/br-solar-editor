import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function contar(tabela: "faturas" | "pacotes" | "propostas") {
  const { count } = await (await createClient()).from(tabela).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function Home() {
  const [faturas, pacotes, propostas] = await Promise.all([contar("faturas"), contar("pacotes"), contar("propostas")]);
  const cards = [
    { href: "/faturas", titulo: "Fatura", texto: "Cobrança mensal por consumo ou valor fixo, com cálculo automático de desconto e economia.", rodape: `${faturas} salvas` },
    { href: "/documentos", titulo: "Documentação", texto: "Contrato, procuração e termo de adesão gerados a partir de uma única qualificação do cliente.", rodape: `${pacotes} pacotes` },
    { href: "/propostas", titulo: "Proposta", texto: "Sistema solar, carregador veicular ou serviço diverso, com seções ligáveis e desligáveis.", rodape: `${propostas} salvas` },
  ];
  return (
    <main className="no-print flex-1 px-6 pt-14 pb-20 max-w-[1000px] w-full mx-auto">
      <div className="text-[13px] tracking-[0.16em] uppercase text-brand font-bold">BR Solar</div>
      <h1 className="font-cond text-[46px] font-extrabold mt-1.5 mb-1.5 tracking-tight">O que você quer gerar hoje?</h1>
      <p className="mb-8 text-[#666] text-[17px] max-w-[46ch] text-pretty">
        Escolha o tipo de documento. Depois você parte de um arquivo anterior ou começa do zero.
      </p>
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="no-underline text-ink bg-white border border-line border-l-[5px] border-l-brand rounded-[14px] px-[22px] pt-6 pb-[22px] flex flex-col gap-2.5 hover:shadow-lg transition-shadow"
          >
            <div className="text-xs tracking-[0.18em] uppercase text-brand font-bold">Disponível</div>
            <div className="font-cond text-[30px] font-extrabold leading-none">{c.titulo}</div>
            <div className="text-[#666] text-[15px] leading-snug text-pretty">{c.texto}</div>
            <div className="flex-1" />
            <div className="flex items-center gap-2.5 text-[15px] font-bold">
              <span>{c.rodape}</span>
              <span className="text-brand">→</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

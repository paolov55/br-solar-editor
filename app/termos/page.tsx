import { Suspense } from "react";
import { exigirSessao } from "@/lib/auth/sessao";
import { TERMOS, TERMOS_DATA_LABEL } from "@/lib/termos";
import { aceitarTermos } from "./actions";
import { BotaoAceitar } from "./botao-aceitar";

async function Conteudo() {
  await exigirSessao("usuario");
  return (
    <form
      action={aceitarTermos}
      className="w-full max-w-2xl bg-white border border-line rounded-2xl p-7 flex flex-col gap-4"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/logo.png" alt="BR Solar" className="h-6 w-auto self-start invert" />
      <div>
        <h1 className="font-cond text-3xl font-extrabold leading-none m-0">Termos de uso</h1>
        <p className="text-[13px] text-[#777] mt-1.5 mb-0">
          Versão de {TERMOS_DATA_LABEL}. Leia até o final para continuar.
        </p>
      </div>
      <div className="border border-line rounded-xl bg-[#fafafb] p-5 max-h-[52vh] overflow-y-auto flex flex-col gap-4 text-[14.5px] leading-relaxed text-[#333]">
        {TERMOS.map((s) => (
          <section key={s.titulo} className="flex flex-col gap-1.5">
            <h2 className="font-cond text-xl font-extrabold leading-none m-0 text-ink">{s.titulo}</h2>
            {s.paragrafos.map((p, i) => (
              <p key={i} className="m-0">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
      <BotaoAceitar />
    </form>
  );
}

export default function TermosPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <Suspense fallback={<div className="text-[14px] text-[#777]">Carregando…</div>}>
        <Conteudo />
      </Suspense>
    </main>
  );
}

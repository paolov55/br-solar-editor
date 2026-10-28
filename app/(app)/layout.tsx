import Link from "next/link";
import { FeedbackProvider } from "@/components/ui/feedback";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LOGIN_ATIVO, TESTE_FIM_LABEL } from "@/lib/trial";

async function sair() {
  "use server";
  await (await createClient()).auth.signOut();
  redirect("/login");
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FeedbackProvider>
      <div className="min-h-screen flex flex-col">
        <header className="no-print sticky top-0 z-30 bg-ink text-white flex items-center gap-4 px-5 h-[58px] shrink-0">
          <Link href="/" className="flex">
            {/* o "SOLAR" do arquivo é preto e some na barra escura: deixa a logo toda branca */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="BR Solar" className="h-[22px] w-auto block brightness-0 invert" />
          </Link>
          <div className="w-px h-[22px] bg-[#3a3a3a]" />
          <div className="text-[13px] tracking-[0.14em] uppercase font-semibold text-[#9c9c9c]">Editor de documentos</div>
          <div className="flex-1" />
          <div className="flex items-center gap-2 bg-[#222] border border-[#333] rounded-full py-[5px] pl-[9px] pr-3">
            <span className="block w-[7px] h-[7px] rounded-full bg-[#FF8D02]" />
            <span className="text-[13px] text-[#c9c9c9]">Versão de testes válida até {TESTE_FIM_LABEL}</span>
          </div>
          {LOGIN_ATIVO && (
            <form action={sair}>
              <button className="cursor-pointer bg-[#222] border border-[#333] rounded-full px-3.5 py-1.5 text-[13px] text-[#c9c9c9] hover:text-white">
                Sair
              </button>
            </form>
          )}
        </header>
        {children}
      </div>
    </FeedbackProvider>
  );
}

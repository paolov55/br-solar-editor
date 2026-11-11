import Link from "next/link";
import { Suspense } from "react";
import { FeedbackProvider } from "@/components/ui/feedback";
import { MenuSessao } from "@/components/menu-sessao";
import { AvisoPagamento } from "@/components/aviso-pagamento";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FeedbackProvider>
      <div className="min-h-screen flex flex-col">
        <header className="no-print sticky top-0 z-30 bg-ink text-white flex items-center gap-4 px-5 h-[58px] shrink-0">
          <Link href="/" className="flex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-fundo-escuro.png" alt="BR Solar" className="h-9 w-auto block" />
          </Link>
          <div className="w-px h-[22px] bg-[#3a3a3a]" />
          <div className="text-[13px] tracking-[0.14em] uppercase font-semibold text-[#9c9c9c]">Editor de documentos</div>
          <div className="flex-1" />
          <Suspense fallback={null}>
            <MenuSessao />
          </Suspense>
        </header>
        <Suspense fallback={null}>
          <AvisoPagamento />
        </Suspense>
        {children}
      </div>
    </FeedbackProvider>
  );
}

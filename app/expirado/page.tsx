import { TESTE_FIM_LABEL } from "@/lib/trial";

export default function ExpiradoPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white border border-line rounded-2xl p-7 flex flex-col gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo.png" alt="BR Solar" className="h-6 w-auto self-start invert" />
        <h1 className="font-cond text-3xl font-extrabold leading-none">Período de testes encerrado</h1>
        <p className="text-[15px] text-[#666]">
          A versão de demonstração foi válida até {TESTE_FIM_LABEL}. Entre em contato com o responsável para ativar sua
          assinatura.
        </p>
      </div>
    </main>
  );
}

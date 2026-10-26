"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro("");
    const { error } = await createClient().auth.signInWithPassword({ email, password: senha });
    if (error) {
      setErro("E-mail ou senha inválidos.");
      setCarregando(false);
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={entrar} className="w-full max-w-sm bg-white border border-line rounded-2xl p-7 flex flex-col gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo.png" alt="BR Solar" className="h-6 w-auto self-start invert" />
        <h1 className="font-cond text-3xl font-extrabold leading-none">Entrar</h1>
        <label className="flex flex-col gap-1.5 text-[13px] text-[#666] font-semibold">
          E-mail
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#ddd] rounded-lg px-3 py-2.5 text-[15px] outline-none focus:border-brand"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-[13px] text-[#666] font-semibold">
          Senha
          <input
            type="password"
            required
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="border border-[#ddd] rounded-lg px-3 py-2.5 text-[15px] outline-none focus:border-brand"
          />
        </label>
        {erro && <div className="text-sm text-red-600">{erro}</div>}
        <button
          disabled={carregando}
          className="bg-brand text-ink font-bold rounded-lg py-3 text-[15px] disabled:opacity-60 cursor-pointer hover:bg-[#ffa133]"
        >
          {carregando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}

"use client";

import { useActionState } from "react";
import { entrar, type EstadoLogin } from "./actions";

const inicial: EstadoLogin = {};

export default function LoginPage() {
  const [estado, acao, pendente] = useActionState(entrar, inicial);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form action={acao} className="w-full max-w-sm bg-white border border-line rounded-2xl p-7 flex flex-col gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo.png" alt="BR Solar" className="h-6 w-auto self-start invert" />
        <h1 className="font-cond text-3xl font-extrabold leading-none">Entrar</h1>
        <label className="flex flex-col gap-1.5 text-[13px] text-[#666] font-semibold">
          Usuário
          <input
            name="login"
            type="text"
            required
            autoComplete="username"
            autoCapitalize="none"
            className="border border-[#ddd] rounded-lg px-3 py-2.5 text-[15px] outline-none focus:border-brand"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-[13px] text-[#666] font-semibold">
          Senha
          <input
            name="senha"
            type="password"
            required
            autoComplete="current-password"
            className="border border-[#ddd] rounded-lg px-3 py-2.5 text-[15px] outline-none focus:border-brand"
          />
        </label>
        <label className="flex items-center gap-2 text-[14px] text-[#444] cursor-pointer select-none">
          <input name="lembrar" type="checkbox" defaultChecked className="w-4 h-4 accent-brand cursor-pointer" />
          Permanecer conectado
        </label>
                {estado.erro && <div className="text-sm text-red-600">{estado.erro}</div>}
        <button
          disabled={pendente}
          className="bg-brand text-ink font-bold rounded-lg py-3 text-[15px] disabled:opacity-60 cursor-pointer hover:bg-[#ffa133]"
        >
          {pendente ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}

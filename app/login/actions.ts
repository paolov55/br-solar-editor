"use server";

import { redirect } from "next/navigation";
import { criarSessao, verificarCredenciais } from "@/lib/auth/sessao";

export type EstadoLogin = { erro?: string };

export async function entrar(_anterior: EstadoLogin, formData: FormData): Promise<EstadoLogin> {
  const login = String(formData.get("login") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");
  const lembrar = formData.get("lembrar") === "on";

  const papel = verificarCredenciais(login, senha);
  if (!papel) {
    // atraso fixo para dificultar tentativas em série
    await new Promise((r) => setTimeout(r, 800));
    return { erro: "Usuário ou senha inválidos." };
  }

  await criarSessao({ login: login.toLowerCase(), papel, lembrar });
  redirect("/");
}

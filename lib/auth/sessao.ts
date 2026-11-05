import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_SESSAO, assinar, opcoesCookie, verificar, type Papel, type Sessao } from "./token";

export type { Papel, Sessao };

// Compara em tempo constante (o hash iguala o tamanho das duas entradas).
function iguais(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/** Confere usuário/senha contra as variáveis de ambiente. Devolve o papel ou null. */
export function verificarCredenciais(login: string, senha: string): Papel | null {
  const contas: { papel: Papel; login?: string; senha?: string }[] = [
    { papel: "admin", login: process.env.ADMIN_LOGIN, senha: process.env.ADMIN_SENHA },
    { papel: "usuario", login: process.env.USUARIO_LOGIN, senha: process.env.USUARIO_SENHA },
  ];
  let encontrado: Papel | null = null;
  for (const c of contas) {
    // sem senha configurada a conta fica desativada
    if (!c.login || !c.senha) continue;
    const okLogin = iguais(login.toLowerCase(), c.login.toLowerCase());
    const okSenha = iguais(senha, c.senha);
    if (okLogin && okSenha) encontrado = c.papel;
  }
  return encontrado;
}

export async function criarSessao(sessao: Sessao) {
  const token = await assinar(sessao);
  (await cookies()).set(COOKIE_SESSAO, token, opcoesCookie(sessao.lembrar));
}

export async function encerrarSessao() {
  (await cookies()).delete(COOKIE_SESSAO);
}

export async function lerSessao(): Promise<Sessao | null> {
  const lida = await verificar((await cookies()).get(COOKIE_SESSAO)?.value);
  return lida && { login: lida.login, papel: lida.papel, lembrar: lida.lembrar };
}

/** Camada de acesso: use em páginas e server actions. Redireciona se não houver sessão/papel. */
export async function exigirSessao(papel?: Papel): Promise<Sessao> {
  const sessao = await lerSessao();
  if (!sessao) redirect("/login");
  if (papel && sessao.papel !== papel) redirect("/");
  return sessao;
}

// Assinatura/verificação do cookie de sessão (JWT HS256). Sem dependências do Next,
// para poder ser usado tanto pelo proxy quanto por Server Components e actions.
import { SignJWT, jwtVerify } from "jose";

export const COOKIE_SESSAO = "sessao";
/** Sem "permanecer conectado": o cookie some ao fechar o navegador e o token vale no máximo 1 dia. */
export const SESSAO_CURTA_DIAS = 1;
/** Com "permanecer conectado": 30 dias, renovados a cada uso (ver `precisaRenovar`). */
export const SESSAO_LONGA_DIAS = 30;
const RENOVAR_APOS_SEG = 24 * 60 * 60;

export type Papel = "admin" | "usuario";
export type Sessao = { login: string; papel: Papel; lembrar?: boolean };
export type SessaoLida = Sessao & { emitidaEm: number };

function chave() {
  const segredo = process.env.AUTH_SECRET;
  if (!segredo || segredo.length < 16) throw new Error("AUTH_SECRET ausente ou curto demais (mín. 16 caracteres).");
  return new TextEncoder().encode(segredo);
}

export async function assinar(sessao: Sessao) {
  const { login, papel, lembrar } = sessao;
  return new SignJWT({ login, papel, lembrar: !!lembrar })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${lembrar ? SESSAO_LONGA_DIAS : SESSAO_CURTA_DIAS}d`)
    .sign(chave());
}

/** Opções do cookie de sessão. Sem `maxAge` ele é um cookie de sessão do navegador. */
export function opcoesCookie(lembrar: boolean | undefined) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(lembrar ? { maxAge: SESSAO_LONGA_DIAS * 24 * 60 * 60 } : {}),
  };
}

/** Sessões lembradas são reemitidas uma vez por dia, para não expirarem enquanto houver uso. */
export function precisaRenovar(sessao: SessaoLida) {
  return !!sessao.lembrar && Date.now() / 1000 - sessao.emitidaEm > RENOVAR_APOS_SEG;
}

export async function verificar(token: string | undefined): Promise<SessaoLida | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, chave(), { algorithms: ["HS256"] });
    const { login, papel, lembrar } = payload as Partial<Sessao>;
    if (typeof login !== "string" || (papel !== "admin" && papel !== "usuario")) return null;
    return { login, papel, lembrar: lembrar === true, emitidaEm: payload.iat ?? 0 };
  } catch {
    return null;
  }
}

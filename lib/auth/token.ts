// Assinatura/verificação do cookie de sessão (JWT HS256). Sem dependências do Next,
// para poder ser usado tanto pelo proxy quanto por Server Components e actions.
import { SignJWT, jwtVerify } from "jose";

export const COOKIE_SESSAO = "sessao";
export const SESSAO_DIAS = 7;

export type Papel = "admin" | "usuario";
export type Sessao = { login: string; papel: Papel };

function chave() {
  const segredo = process.env.AUTH_SECRET;
  if (!segredo || segredo.length < 16) throw new Error("AUTH_SECRET ausente ou curto demais (mín. 16 caracteres).");
  return new TextEncoder().encode(segredo);
}

export async function assinar(sessao: Sessao) {
  return new SignJWT({ ...sessao })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSAO_DIAS}d`)
    .sign(chave());
}

export async function verificar(token: string | undefined): Promise<Sessao | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, chave(), { algorithms: ["HS256"] });
    const { login, papel } = payload as Partial<Sessao>;
    if (typeof login !== "string" || (papel !== "admin" && papel !== "usuario")) return null;
    return { login, papel };
  } catch {
    return null;
  }
}

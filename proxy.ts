import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESSAO, assinar, opcoesCookie, precisaRenovar, verificar } from "@/lib/auth/token";
import { situacao, termosAceitos } from "@/lib/cobranca/status";

// Portão de toda navegação: sessão → papel → termos de uso → mensalidade em dia.
// (Server actions e páginas também revalidam a sessão; aqui é a primeira barreira.)
export async function proxy(request: NextRequest) {
  const sessao = await verificar(request.cookies.get(COOKIE_SESSAO)?.value);
  const resposta = await portao(request, sessao);
  // "permanecer conectado": estende a validade enquanto o sistema estiver em uso
  if (sessao && precisaRenovar(sessao)) {
    resposta.cookies.set(COOKIE_SESSAO, await assinar(sessao), opcoesCookie(true));
  }
  return resposta;
}

async function portao(request: NextRequest, sessao: Awaited<ReturnType<typeof verificar>>) {
  const { pathname } = request.nextUrl;
  const ir = (destino: string) => NextResponse.redirect(new URL(destino, request.url));
  const em = (prefixo: string) => pathname === prefixo || pathname.startsWith(prefixo + "/");

  if (!sessao) return em("/login") ? NextResponse.next() : ir("/login");
  if (em("/login")) return ir("/");

  // O admin nunca é bloqueado e não precisa aceitar termos.
  if (sessao.papel === "admin") return NextResponse.next();

  if (em("/admin")) return ir("/");

  const [aceitou, sit] = await Promise.all([termosAceitos(sessao.login), situacao()]);

  if (!aceitou) return em("/termos") ? NextResponse.next() : ir("/termos");
  if (em("/termos")) return ir("/");

  if (sit.estado === "vencida" && !em("/pagamentos")) return ir("/pagamentos?bloqueado=1");

  return NextResponse.next();
}

export const config = {
  matcher: [
    // fora do portão: arquivos estáticos e o webhook do Mercado Pago (autenticado por assinatura)
    "/((?!_next/static|_next/image|favicon.ico|assets/|api/mercadopago/webhook|.*\\.(?:png|jpg|svg|ico)$).*)",
  ],
};

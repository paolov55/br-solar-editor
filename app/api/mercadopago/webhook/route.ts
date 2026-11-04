import { NextResponse, type NextRequest } from "next/server";
import { buscarPagamento, registrarPagamento, validarAssinatura } from "@/lib/mercadopago";

// Notificações do Mercado Pago. Não passa pelo proxy; a autenticação é a assinatura (x-signature).
export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  let corpo: { type?: string; action?: string; data?: { id?: string | number } } = {};
  try {
    corpo = await request.json();
  } catch {
    // alguns avisos antigos (IPN) vêm só na query string
  }
  const dataId = url.searchParams.get("data.id") ?? (corpo.data?.id != null ? String(corpo.data.id) : null);

  if (!validarAssinatura(request, dataId)) {
    return NextResponse.json({ erro: "assinatura inválida" }, { status: 401 });
  }

  const tipo = url.searchParams.get("type") ?? corpo.type ?? "";
  if (tipo !== "payment" || !dataId) return NextResponse.json({ ok: true, ignorado: true });

  try {
    // nunca confia no corpo da notificação: consulta o pagamento direto na API do Mercado Pago
    const pagamento = await buscarPagamento(dataId);
    if (pagamento) await registrarPagamento(pagamento);
  } catch (e) {
    console.error("webhook mercadopago:", e);
    // 500 faz o Mercado Pago tentar de novo mais tarde
    return NextResponse.json({ erro: "falha ao processar" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

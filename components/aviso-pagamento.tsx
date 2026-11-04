import Link from "next/link";
import { lerSessao } from "@/lib/auth/sessao";
import { situacao } from "@/lib/cobranca/status";
import { brl, dataBr } from "@/lib/format";

/** Faixa de lembrete: aparece para o usuário quando a mensalidade está perto de vencer. */
export async function AvisoPagamento() {
  const sessao = await lerSessao();
  if (sessao?.papel !== "usuario") return null;

  const { estado, aberta, dias } = await situacao();
  if (estado !== "a_vencer" || !aberta || dias === null) return null;

  const quando = dias === 0 ? "vence hoje" : dias === 1 ? "vence amanhã" : `vence em ${dias} dias`;
  return (
    <div className="no-print bg-brand text-ink px-5 py-2 text-[14px] font-semibold flex flex-wrap items-center gap-x-3 gap-y-1">
      <span>
        Sua mensalidade de {brl(aberta.valor)} {quando} ({dataBr(aberta.vencimento)}). Depois do vencimento o acesso é bloqueado.
      </span>
      <Link href="/pagamentos" className="underline font-bold" style={{ color: "inherit" }}>
        Pagar agora →
      </Link>
    </div>
  );
}

import { db } from "@/lib/supabase/admin";
import { TERMOS_VERSAO } from "@/lib/termos";
import { diasEntre, hoje, primeiroDoMes, somarDias, somarMeses, vencimentoDoMes } from "./datas";

export type Config = { valor: number; dia_vencimento: number; lembrete_dias: number; inicio: string };

export type Cobranca = {
  id: string;
  referencia: string;
  vencimento: string;
  valor: number;
  status: "pendente" | "pago" | "isento";
  pago_em: string | null;
  metodo: string | null;
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  baixa_manual: boolean;
};

export type Situacao = {
  estado: "em_dia" | "a_vencer" | "vencida";
  /** cobrança pendente mais antiga (a que vence primeiro) */
  aberta: Cobranca | null;
  /** dias até o vencimento da cobrança aberta (negativo = atrasada) */
  dias: number | null;
};

export async function obterConfig(): Promise<Config> {
  const { data, error } = await db().from("config_cobranca").select("*").single();
  if (error) throw new Error("config_cobranca: " + error.message);
  return {
    valor: Number(data.valor),
    dia_vencimento: data.dia_vencimento,
    lembrete_dias: data.lembrete_dias,
    inicio: data.inicio,
  };
}

const norm = (c: Cobranca): Cobranca => ({ ...c, valor: Number(c.valor) });

/**
 * Cria (de forma idempotente) as cobranças de `inicio` até o mês em que cai
 * hoje + antecedência do lembrete, e devolve todas, da mais antiga à mais nova.
 */
export async function garantirCobrancas(cfg: Config): Promise<Cobranca[]> {
  const { data, error } = await db().from("cobrancas").select("*").order("referencia");
  if (error) throw new Error("cobrancas: " + error.message);
  const existentes = (data ?? []).map(norm);

  const ultima = primeiroDoMes(somarDias(hoje(), cfg.lembrete_dias));
  const tem = new Set(existentes.map((c) => c.referencia));
  const novas: Omit<Cobranca, "id">[] = [];
  for (let ref = primeiroDoMes(cfg.inicio); ref <= ultima; ref = somarMeses(ref, 1)) {
    if (tem.has(ref)) continue;
    novas.push({
      referencia: ref,
      vencimento: vencimentoDoMes(ref, cfg.dia_vencimento),
      valor: cfg.valor,
      status: "pendente",
      pago_em: null,
      metodo: null,
      mp_preference_id: null,
      mp_payment_id: null,
      baixa_manual: false,
    });
  }
  if (!novas.length) return existentes;

  const { error: e2 } = await db().from("cobrancas").upsert(novas, { onConflict: "referencia", ignoreDuplicates: true });
  if (e2) throw new Error("cobrancas upsert: " + e2.message);
  const { data: todas, error: e3 } = await db().from("cobrancas").select("*").order("referencia");
  if (e3) throw new Error("cobrancas: " + e3.message);
  return (todas ?? []).map(norm);
}

export function calcularSituacao(cobrancas: Cobranca[], cfg: Config): Situacao {
  const aberta = cobrancas.filter((c) => c.status === "pendente").sort((a, b) => a.vencimento.localeCompare(b.vencimento))[0] ?? null;
  if (!aberta) return { estado: "em_dia", aberta: null, dias: null };
  const dias = diasEntre(hoje(), aberta.vencimento);
  if (dias < 0) return { estado: "vencida", aberta, dias };
  if (dias <= cfg.lembrete_dias) return { estado: "a_vencer", aberta, dias };
  return { estado: "em_dia", aberta, dias };
}

export async function situacao(): Promise<Situacao> {
  const cfg = await obterConfig();
  return calcularSituacao(await garantirCobrancas(cfg), cfg);
}

export async function termosAceitos(login: string): Promise<boolean> {
  const { data, error } = await db()
    .from("termos_aceites")
    .select("id")
    .eq("login", login.toLowerCase())
    .eq("versao", TERMOS_VERSAO)
    .maybeSingle();
  if (error) throw new Error("termos_aceites: " + error.message);
  return !!data;
}

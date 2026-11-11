// Datas de cobrança como strings "YYYY-MM-DD" (comparáveis lexicograficamente),
// sempre no fuso de Brasília — o servidor da Vercel roda em UTC.

export function hoje(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
}

/** Data "YYYY-MM-DD" no fuso de Brasília de um timestamp (ex.: `timestamptz` vindo do banco em UTC). */
export function dataEmBrasilia(ts: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date(ts));
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Dia 1 do mês de uma data qualquer. */
export function primeiroDoMes(data: string) {
  return data.slice(0, 7) + "-01";
}

export function somarDias(data: string, dias: number) {
  const [a, m, d] = data.split("-").map(Number);
  const dt = new Date(Date.UTC(a, m - 1, d + dias));
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

export function somarMeses(referencia: string, meses: number) {
  const [a, m] = referencia.split("-").map(Number);
  const dt = new Date(Date.UTC(a, m - 1 + meses, 1));
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-01`;
}

/** Dias de `de` até `ate` (positivo se `ate` é depois). */
export function diasEntre(de: string, ate: string) {
  const t = (s: string) => {
    const [a, m, d] = s.split("-").map(Number);
    return Date.UTC(a, m - 1, d);
  };
  return Math.round((t(ate) - t(de)) / 86_400_000);
}

/** Vencimento de um mês de referência (dia limitado a 28 para existir em todo mês). */
export function vencimentoDoMes(referencia: string, dia: number) {
  return referencia.slice(0, 7) + "-" + pad(Math.min(Math.max(dia, 1), 28));
}

export function dataValida(s: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  return somarDias(s, 0) === s;
}

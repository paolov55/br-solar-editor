export const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
export const MESES_EXT = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export function brl(n: unknown) {
  const v = Number(n) || 0;
  return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
export function intBr(n: unknown) {
  return (Number(n) || 0).toLocaleString("pt-BR");
}
export function soDigitos(s: unknown) {
  return String(s || "").replace(/\D/g, "");
}
export function mascaraDoc(s: unknown) {
  const d = soDigitos(s);
  if (d.length === 11) return "CPF: " + d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  if (d.length === 14) return "CNPJ: " + d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  return d ? d : "";
}
export function numeroDoc(s: unknown) {
  const m = mascaraDoc(s);
  return m.indexOf(": ") > -1 ? m.split(": ")[1] : "";
}
export function iso(dt: Date) {
  return dt.toISOString().slice(0, 10);
}
export function dataBr(s: string | null | undefined) {
  if (!s) return "";
  const [a, m, d] = String(s).slice(0, 10).split("-");
  return d + "/" + m + "/" + a;
}
/** "2026-08" ou "2026-08-01" → "AGO/2026" */
export function refLabel(mes: string | null | undefined) {
  if (!mes) return "";
  const [a, m] = String(mes).split("-");
  return MESES[Number(m) - 1] + "/" + a;
}
export function arredondaEconomia(v: number) {
  if (v >= 1000) return Math.floor(v / 1000) * 1000;
  if (v >= 100) return Math.floor(v / 100) * 100;
  return Math.floor(v / 10) * 10;
}
export function dataCurta(ts: string | number | null | undefined) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}
export function dataExtenso(dt: Date) {
  return (
    "Recife, " + String(dt.getDate()).padStart(2, "0") + " de " + MESES_EXT[dt.getMonth()] + " de " + dt.getFullYear()
  );
}
/** "1.234,50" → 1234.5 */
export function numeroBr(v: unknown) {
  return Number(String(v ?? "").replace(/\./g, "").replace(",", ".")) || 0;
}
/** 1234.5 | "1.234,5" → "1.234,50" */
export function moedaBr(v: unknown) {
  return numeroBr(v).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
export function juntar(partes: Array<string | null | undefined>) {
  return partes.filter((x) => x && String(x).trim()).join(", ");
}

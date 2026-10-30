import { arredondaEconomia, brl, iso } from "@/lib/format";

export type TipoCobranca = "consumo" | "fixa";

export type Cliente = {
  id: string;
  nome: string;
  doc: string;
  endereco: string;
  tipo: TipoCobranca;
  tarifa: number;
  desconto: number;
  diaVenc: number;
  concessionaria: string;
  contratado: number;
  taxaMinima: number;
};

export type ContaPagamento = {
  id: string;
  apelido: string;
  padrao: boolean;
  pix: string;
  favorecido: string;
  banco: string;
  agencia: string;
  conta: string;
  tipoConta: string;
};

/** Conta (unidade consumidora) de um cliente com várias contas na mesma fatura. */
export type ContaConsumo = {
  kwh: number | string;
  valorRef: number | string;
};

export type Fatura = {
  id: string; // "" enquanto não salva
  clienteId: string;
  pagamentoId: string;
  nome: string;
  doc: string;
  endereco: string;
  mes: string; // "YYYY-MM"
  vencimento: string; // "YYYY-MM-DD"
  tipo: TipoCobranca;
  kwh: number;
  tarifa: number;
  valorRef: number | null; // null → kwh × tarifa
  contas?: ContaConsumo[]; // 2+ contas → kwh e valorRef acima são a soma delas
  desconto: number;
  concessionaria: string;
  contratado: number;
  taxaMinima: number;
  pix: string;
  favorecido: string;
  banco: string;
  agencia: string;
  conta: string;
  tipoConta: string;
  criada: string | null;
  alterada: string | null;
};

export const BANCO_PADRAO = {
  pix: "67.146.854/0001-51",
  favorecido: "BRF ENERGY SOLUCOES EM ENERGIA RENOVÁVEL",
  banco: "Banco Santander - 033",
  agencia: "3749",
  conta: "13.005862-8",
  tipoConta: "Conta Corrente",
};

export function refDe(f: Pick<Fatura, "valorRef" | "kwh" | "tarifa">) {
  if (f.valorRef !== null && f.valorRef !== undefined) return Number(f.valorRef) || 0;
  return (Number(f.kwh) || 0) * (Number(f.tarifa) || 0);
}

export function totalDe(f: Fatura) {
  if (f.tipo === "fixa") return (Number(f.contratado) || 0) + (Number(f.taxaMinima) || 0);
  return refDe(f) * (1 - (Number(f.desconto) || 0) / 100);
}

export function calcular(f: Fatura | null) {
  if (!f) return { valorRef: 0, descontoValor: 0, total: 0 };
  if (f.tipo === "fixa") return { valorRef: 0, descontoValor: 0, total: totalDe(f) };
  const valorRef = refDe(f);
  const total = valorRef * (1 - (Number(f.desconto) || 0) / 100);
  return { valorRef, descontoValor: valorRef - total, total };
}

export function msgEconomia(f: Fatura | null) {
  if (!f) return "";
  if (f.tipo === "fixa") return "Parabéns! Você economizou bastante esse mês!";
  const c = calcular(f);
  const eco = arredondaEconomia(Math.max(0, c.valorRef - c.total));
  return `Parabéns! Sua economia em relação ao valor da ${f.concessionaria || "Neoenergia"} foi de mais de ${brl(eco)}.`;
}

export function mesAtual() {
  const dt = new Date();
  return dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0");
}

/** Vencimento = dia `diaVenc` do mês seguinte à referência. */
export function vencimentoDe(mes: string, diaVenc: number) {
  const [a, m] = mes.split("-").map(Number);
  const prox = m === 12 ? `${a + 1}-01` : `${a}-${String(m + 1).padStart(2, "0")}`;
  return `${prox}-${String(diaVenc).padStart(2, "0")}`;
}

export function novaFatura(pag: ContaPagamento): Fatura {
  const mes = mesAtual();
  return {
    id: "",
    clienteId: "",
    pagamentoId: pag.id,
    nome: "",
    doc: "",
    endereco: "",
    mes,
    vencimento: vencimentoDe(mes, 10),
    tipo: "consumo",
    kwh: 0,
    tarifa: 1.37,
    valorRef: null,
    desconto: 30,
    concessionaria: "Neoenergia",
    contratado: 0,
    taxaMinima: 0,
    pix: pag.pix,
    favorecido: pag.favorecido,
    banco: pag.banco,
    agencia: pag.agencia,
    conta: pag.conta,
    tipoConta: pag.tipoConta,
    criada: null,
    alterada: null,
  };
}

export function faturaDeCliente(c: Cliente, mes: string, pag: ContaPagamento, extras: Partial<Fatura> = {}): Fatura {
  return {
    ...novaFatura(pag),
    clienteId: c.id,
    nome: c.nome,
    doc: c.doc,
    endereco: c.endereco,
    mes,
    vencimento: vencimentoDe(mes, c.diaVenc),
    tipo: c.tipo,
    tarifa: c.tarifa,
    desconto: c.desconto,
    concessionaria: c.concessionaria,
    contratado: c.contratado,
    taxaMinima: c.taxaMinima,
    ...extras,
  };
}

export { iso };

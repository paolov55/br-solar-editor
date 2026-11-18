// Leitura e escrita do "Formulário de solicitações para clientes geração
// distribuída – Alteração de rateio" (Neoenergia). Lógica pura, sem React:
// roda no navegador e em scripts de teste. O pdf-lib é carregado sob demanda.
import type { PDFDocument, PDFField, PDFTextField } from "pdf-lib";

export const MAX_LINHAS = 15;
export const UC_VAZIA = "";
export const UC_GERADORA = "Principal (Geradora)";
export const UC_COMPENSACAO = "Compensação";
export type TipoUc = typeof UC_VAZIA | typeof UC_GERADORA | typeof UC_COMPENSACAO;
export type TipoRateio = "percentual" | "prioridade";

export type LinhaRateio = {
  conta: string;
  uc: TipoUc;
  /** Percentual em pontos (10 = 10%) ou ordem de prioridade (1, 2, 3…), como texto. */
  valor: string;
};

export type DadosRateio = {
  tipo: TipoRateio;
  linhas: LinhaRateio[]; // sempre MAX_LINHAS itens
  excedente: string; // UC que recebe o excedente (modo prioridade)
  cliente: { codigo: string; cpfCnpj: string; telefone: string; email: string };
  aceites: boolean[]; // 5 itens
};

export class ErroModelo extends Error {}

const CAMPOS_OBRIGATORIOS = [
  "codigo_cliente",
  "02_cpf_cnpj",
  "05_telefone_cliente",
  "06_email_cliente",
  "codigo_excedente",
  "campo_informativo",
  "Group1",
  "aceite1",
  "aceite2",
  "aceite3",
  "aceite4",
  "aceite5",
];

const VISIVEL = 4; // flag Print
const OCULTO = 6; // Print + Hidden
const TOL_Y = 3;

type Linha = { conta: PDFTextField; uc: PDFField; pct: PDFTextField; pri: PDFTextField; y: number };

// ───────────── utilidades de texto ─────────────

export const soDigitos = (s: string) => s.replace(/\D/g, "");

export function mascaraCpfCnpj(v: string): string {
  const d = soDigitos(v);
  if (d.length === 11)
    return d.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  if (d.length === 14)
    return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  return v;
}

export function mascaraTelefone(v: string): string {
  const d = soDigitos(v);
  if (d.length === 10) return d.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  if (d.length === 11) return d.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  return v;
}

/** "10", "10,5" ou "10.5" → 10.5; vazio/inválido → null. */
export function lerNumero(s: string): number | null {
  const t = s.trim().replace("%", "").replace(",", ".");
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

const fmtPct = (n: number) =>
  `${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;

// ───────────── validações ─────────────

export function validarCpfCnpj(v: string): boolean {
  const d = soDigitos(v);
  if (/^(\d)\1+$/.test(d)) return false;
  const dv = (base: string, pesos: number[]) => {
    const soma = pesos.reduce((a, p, i) => a + Number(base[i]) * p, 0);
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
  };
  if (d.length === 11) {
    const a = dv(d, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
    const b = dv(d, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
    return a === Number(d[9]) && b === Number(d[10]);
  }
  if (d.length === 14) {
    const a = dv(d, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    const b = dv(d, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    return a === Number(d[12]) && b === Number(d[13]);
  }
  return false;
}

/** Avisos (não bloqueiam o download). */
export function validar(d: DadosRateio): string[] {
  const av: string[] = [];
  const ativas = d.linhas.filter((l) => l.conta.trim() || l.uc || l.valor.trim());

  if (!ativas.length) av.push("Nenhuma unidade consumidora preenchida.");
  for (const l of ativas) {
    if (!l.conta.trim() || !l.uc)
      av.push(`Linha incompleta${l.conta ? ` (conta ${l.conta})` : ""}: informe conta contrato e unidade consumidora.`);
  }
  if (ativas.filter((l) => l.uc === UC_GERADORA).length !== 1)
    av.push('Deve haver exatamente uma linha "Principal (Geradora)".');

  const comValor = ativas.filter((l) => l.uc !== UC_GERADORA);
  if (d.tipo === "percentual") {
    const nums = comValor.map((l) => lerNumero(l.valor));
    if (nums.some((n) => n === null || n <= 0))
      av.push("Informe o percentual de todas as unidades de compensação.");
    const soma = nums.reduce<number>((a, n) => a + (n ?? 0), 0);
    if (Math.abs(soma - 100) > 0.001)
      av.push(`A soma dos percentuais é ${fmtPct(soma)}; deveria ser 100,00%.`);
  } else {
    const nums = comValor.map((l) => lerNumero(l.valor));
    if (nums.some((n) => n === null || !Number.isInteger(n) || n < 1))
      av.push("Informe a ordem de prioridade (1, 2, 3…) de todas as unidades de compensação.");
    else if (new Set(nums).size !== nums.length) av.push("Há ordens de prioridade repetidas.");
    if (!d.excedente.trim()) av.push("Informe a unidade consumidora que receberá o excedente.");
  }

  const c = d.cliente;
  if (!c.codigo.trim()) av.push("Informe o código do cliente (conta contrato).");
  if (!validarCpfCnpj(c.cpfCnpj)) av.push("CPF/CNPJ inválido.");
  if (soDigitos(c.telefone).length < 10) av.push("Telefone deve ter DDD + número (mín. 10 dígitos).");
  if (c.email && !/^\S+@\S+\.\S+$/.test(c.email)) av.push("E-mail inválido.");
  if (d.aceites.some((a) => !a)) av.push("Nem todas as declarações foram marcadas.");
  return av;
}

// ───────────── acesso ao PDF ─────────────

async function carregar(bytes: Uint8Array): Promise<{ lib: typeof import("pdf-lib"); doc: PDFDocument }> {
  const lib = await import("pdf-lib");
  let doc: PDFDocument;
  try {
    doc = await lib.PDFDocument.load(bytes, { ignoreEncryption: false });
  } catch {
    throw new ErroModelo("Não foi possível ler o arquivo. Ele é um PDF válido e sem senha?");
  }
  return { lib, doc };
}

function mapearLinhas(form: ReturnType<PDFDocument["getForm"]>): Linha[] {
  const dropdowns = form
    .getFields()
    .filter((f) => /^Dropdown1\.\d+$/.test(f.getName()))
    .map((f) => ({ f, y: f.acroField.getWidgets()[0].getRectangle().y }))
    .sort((a, b) => b.y - a.y);
  if (dropdowns.length !== MAX_LINHAS)
    throw new ErroModelo("Este PDF não parece ser o formulário de alteração de rateio da Neoenergia.");

  const textos = form.getFields().filter((f): f is PDFTextField => f.constructor.name === "PDFTextField");
  const pos = textos.map((t) => {
    const r = t.acroField.getWidgets()[0].getRectangle();
    return { t, x: r.x, y: r.y, nome: t.getName() };
  });

  return dropdowns.map(({ f, y }) => {
    const daLinha = pos.filter((p) => Math.abs(p.y - y) <= TOL_Y && p.nome.startsWith("Text4."));
    const conta = daLinha.find((p) => p.x < 100);
    const col3 = daLinha.filter((p) => p.x > 300);
    const pri = col3.find((p) => /^Text4\.0\.2\.1\.\d+$/.test(p.nome));
    const pct = col3.find((p) => p !== pri);
    if (!conta || !pri || !pct)
      throw new ErroModelo("A tabela de unidades consumidoras deste PDF não está no formato esperado.");
    return { conta: conta.t, uc: f, pct: pct.t, pri: pri.t, y };
  });
}

function validarModelo(form: ReturnType<PDFDocument["getForm"]>) {
  const nomes = new Set(form.getFields().map((f) => f.getName()));
  if (CAMPOS_OBRIGATORIOS.some((n) => !nomes.has(n)))
    throw new ErroModelo("Este PDF não parece ser o formulário de alteração de rateio da Neoenergia.");
}

const txt = (form: ReturnType<PDFDocument["getForm"]>, nome: string) =>
  form.getTextField(nome).getText() ?? "";

/** Lê um PDF do modelo e devolve os dados que ele já traz preenchidos. */
export async function lerFormulario(bytes: Uint8Array): Promise<DadosRateio> {
  const { doc } = await carregar(bytes);
  const form = doc.getForm();
  validarModelo(form);
  const linhas = mapearLinhas(form);
  const tipo: TipoRateio = form.getRadioGroup("Group1").getSelected() === "Choice2" ? "prioridade" : "percentual";

  return {
    tipo,
    linhas: linhas.map((l) => {
      const sel = l.uc.constructor.name === "PDFDropdown" ? (l.uc as import("pdf-lib").PDFDropdown).getSelected()[0] : "";
      const uc: TipoUc = sel === UC_GERADORA || sel === UC_COMPENSACAO ? sel : UC_VAZIA;
      const bruto = (tipo === "percentual" ? l.pct : l.pri).getText() ?? "";
      let valor = bruto.trim();
      if (tipo === "percentual" && valor) {
        const n = lerNumero(valor);
        valor = n === null ? "" : String(Math.round(n * 100 * 1e6) / 1e6).replace(".", ",");
      }
      return { conta: (l.conta.getText() ?? "").trim(), uc, valor };
    }),
    excedente: txt(form, "codigo_excedente").trim(),
    cliente: {
      codigo: txt(form, "codigo_cliente").trim(),
      cpfCnpj: txt(form, "02_cpf_cnpj").trim(),
      telefone: txt(form, "05_telefone_cliente").trim(),
      email: txt(form, "06_email_cliente").trim(),
    },
    aceites: [1, 2, 3, 4, 5].map((i) => form.getCheckBox(`aceite${i}`).isChecked()),
  };
}

/**
 * Gera o PDF preenchido a partir do original. Os campos continuam editáveis.
 * A aparência é regerada (percentual "10,00%", CPF/CNPJ e telefone com máscara)
 * para leitores que usam o desenho do campo (Chrome, Acrobat). O valor interno
 * do percentual segue o formato do Acrobat (fração, 0.1): leitores que mostram
 * o valor interno (Preview do macOS) exibem 0.1, como no PDF original.
 */
export async function gerarPdf(bytesOriginais: Uint8Array, d: DadosRateio): Promise<Uint8Array> {
  const { lib, doc } = await carregar(bytesOriginais);
  const { PDFName, PDFNumber, PDFHexString, StandardFonts } = lib;
  const form = doc.getForm();
  validarModelo(form);
  const linhas = mapearLinhas(form);

  const brutos: [PDFTextField, string][] = []; // valor real a restaurar após gerar a aparência
  const setar = (campo: PDFTextField, exibido: string, real: string = exibido) => {
    campo.setMaxLength(undefined as unknown as number);
    campo.setText(exibido);
    if (real !== exibido) brutos.push([campo, real]);
  };
  const flag = (f: PDFField, f4: number) =>
    f.acroField.getWidgets().forEach((w) => w.dict.set(PDFName.of("F"), PDFNumber.of(f4)));

  const pct = d.tipo === "percentual";
  form.getRadioGroup("Group1").select(pct ? "Choice1" : "Choice2");

  linhas.forEach((l, i) => {
    const li = d.linhas[i] ?? { conta: "", uc: UC_VAZIA, valor: "" };
    const conta = li.conta.trim();
    setar(l.conta, conta);
    const dd = l.uc as import("pdf-lib").PDFDropdown;
    if (li.uc) dd.select(li.uc);
    else dd.select(" ");

    const n = lerNumero(li.valor);
    const temValor = li.uc !== UC_GERADORA && n !== null;
    setar(l.pct, temValor && pct ? fmtPct(n!) : "", temValor && pct ? String(Math.round(n! * 1e4) / 1e6) : "");
    setar(l.pri, temValor && !pct ? String(Math.trunc(n!)) : "");
    flag(l.pct, pct ? VISIVEL : OCULTO);
    flag(l.pri, pct ? OCULTO : VISIVEL);
  });

  // UC do excedente (modo prioridade) ocupa o lugar da caixa cinza.
  setar(form.getTextField("codigo_excedente"), pct ? "" : d.excedente.trim());
  flag(form.getTextField("codigo_excedente"), pct ? OCULTO : VISIVEL);
  flag(form.getTextField("campo_informativo"), pct ? VISIVEL : OCULTO);

  setar(form.getTextField("codigo_cliente"), d.cliente.codigo.trim());
  setar(form.getTextField("02_cpf_cnpj"), mascaraCpfCnpj(d.cliente.cpfCnpj.trim()));
  setar(form.getTextField("05_telefone_cliente"), mascaraTelefone(d.cliente.telefone.trim()));
  setar(form.getTextField("06_email_cliente"), d.cliente.email.trim());

  d.aceites.forEach((a, i) => {
    const cb = form.getCheckBox(`aceite${i + 1}`);
    if (a) cb.check();
    else cb.uncheck();
  });

  // Aparências com Helvetica (cobre acentos do português); depois restaura /V.
  const fonte = await doc.embedFont(StandardFonts.Helvetica);
  form.updateFieldAppearances(fonte);
  for (const [campo, real] of brutos) campo.acroField.dict.set(PDFName.of("V"), PDFHexString.fromText(real));

  return doc.save();
}

/* eslint-disable */
// @ts-nocheck
// Port direto da lógica do mockup (design/BR Solar - Editor.dc.html). O estado e o renderVals()
// seguem o original; as views em ./views foram geradas a partir do template do mockup.
"use client";

import { Component } from "react";
import { useRouter } from "next/navigation";
import {
  MESES_EXT, arredondaEconomia, brl, dataBr, dataCurta, dataExtenso, intBr, iso, juntar,
  mascaraDoc, moedaBr, numeroBr, numeroDoc, refLabel, soDigitos,
} from "@/lib/format";
import { BANCO_PADRAO } from "@/lib/faturas/calc";
import { BR_SOLAR_ASSIN, CONTRATO_PAGINAS, OUTORGADOS, TEXTOS_TERMO } from "@/lib/docs/textos";
import {
  FIN_PADRAO, GARANTIAS_PADRAO, ITENS_PADRAO, ITENS_SERVICO_PADRAO, REND_PADRAO, TIPOS_ITEM,
} from "@/lib/propostas/padroes";
import "./hover.css";
import { Docs } from "./views/Docs";
import { DocsWizard } from "./views/DocsWizard";
import { Lista } from "./views/Lista";
import { Lote } from "./views/Lote";
import { Modal } from "./views/Modal";
import { Props } from "./views/Props";
import { PropsWizard } from "./views/PropsWizard";
import { Toast } from "./views/Toast";
import { Wizard } from "./views/Wizard";

export type Modulo = "faturas" | "documentos" | "propostas";

function hoje() { return new Date(); }
function refDe(inv) {
  if (inv.valorRef !== undefined && inv.valorRef !== '' && inv.valorRef !== null) return Number(inv.valorRef) || 0;
  return (Number(inv.kwh) || 0) * (Number(inv.tarifa) || 0);
}
function totalDe(inv) {
  if (inv.tipo === 'fixa') return (Number(inv.contratado) || 0) + (Number(inv.taxaMinima) || 0);
  return refDe(inv) * (1 - (Number(inv.desconto) || 0) / 100);
}

const CLIENTES_SEED = [
  { id: 'c1', nome: 'Condomínio Edf. Paço Atlântico', doc: '', endereco: 'Rua José Nunes da Cunha, 530\nJaboatão dos Guararapes – PE', tipo: 'consumo', tarifa: 1.37, desconto: 30, diaVenc: 10, concessionaria: 'Neoenergia' },
  { id: 'c2', nome: 'Abmael Epitacio da Silva', doc: '42064007415', endereco: 'Rua Sa e Souza, 925, AP-1401, Boa Viagem,\nRecife, CEP 51030-065', tipo: 'fixa', contratado: 800, taxaMinima: 95.11, diaVenc: 5 },
  { id: 'c3', nome: 'Condomínio Residencial Vila Verde', doc: '19284736000188', endereco: 'Av. Bernardo Vieira de Melo, 1420\nJaboatão dos Guararapes – PE', tipo: 'consumo', tarifa: 1.37, desconto: 25, diaVenc: 10, concessionaria: 'Neoenergia' },
  { id: 'c4', nome: 'Mercadinho São Jorge LTDA', doc: '08472910000164', endereco: 'Rua da Aurora, 88, Santo Amaro\nRecife – PE', tipo: 'consumo', tarifa: 1.37, desconto: 20, diaVenc: 15, concessionaria: 'Neoenergia' },
  { id: 'c5', nome: 'Maria Fernanda Albuquerque', doc: '10938475620', endereco: 'Rua Setúbal, 340, AP-703, Boa Viagem\nRecife – PE', tipo: 'fixa', contratado: 450, taxaMinima: 62.4, diaVenc: 5 }
];

const PAGAMENTOS_SEED = [
  Object.assign({ id: 'p1', apelido: 'Santander — BRF Energy', padrao: true }, BANCO_PADRAO)
];

function faturaSeed(cliente, mes, extras, pagamento) {
  const dia = String(cliente.diaVenc).padStart(2, '0');
  const [a, m] = mes.split('-');
  const prox = Number(m) === 12 ? (Number(a) + 1) + '-01' : a + '-' + String(Number(m) + 1).padStart(2, '0');
  const ex = extras || {};
  const valorRef = ex.valorRef !== undefined
    ? ex.valorRef
    : (Number(ex.kwh) || 0) * (cliente.tarifa || 1.37);
  const pag = pagamento || PAGAMENTOS_SEED[0];
  return Object.assign({
    id: 'f' + Math.random().toString(36).slice(2, 9),
    clienteId: cliente.id,
    nome: cliente.nome,
    doc: cliente.doc,
    endereco: cliente.endereco,
    mes: mes,
    vencimento: prox + '-' + dia,
    tipo: cliente.tipo,
    kwh: 0,
    tarifa: cliente.tarifa || 1.37,
    valorRef: valorRef,
    desconto: cliente.desconto || 0,
    concessionaria: cliente.concessionaria || 'Neoenergia',
    contratado: cliente.contratado || 0,
    taxaMinima: cliente.taxaMinima || 0,
    criada: Date.now(),
    alterada: Date.now()
  }, {
    pagamentoId: pag.id, pix: pag.pix, favorecido: pag.favorecido,
    banco: pag.banco, agencia: pag.agencia, conta: pag.conta, tipoConta: pag.tipoConta
  }, ex);
}

function bloco(def) {
  const tipo = def[0];
  const base = { ehTitulo: false, ehSecao: false, ehPara: false, ehParaColado: false, ehCaixa: false, ehData: false, ehAssin: false, ehEsp: false, texto: '', pre: '', forte: '', pos: '', forte2: '', pos2: '', nome: '', docLinha: '' };
  if (tipo === 'esp') return Object.assign(base, { ehEsp: true });
  if (tipo === 't') return Object.assign(base, { ehTitulo: true, texto: def[1] });
  if (tipo === 's') return Object.assign(base, { ehSecao: true, texto: def[1] });
  if (tipo === 'caixa') return Object.assign(base, { ehCaixa: true, texto: def[1] });
  if (tipo === 'data') return Object.assign(base, { ehData: true, texto: def[1] });
  if (tipo === 'assin') return Object.assign(base, { ehAssin: true, nome: def[1], docLinha: def[2] });
  if (tipo === 'pf') return Object.assign(base, { ehPara: true, pre: def[5] || '', forte: def[1] || '', pos: def[2] || '', forte2: def[3] || '', pos2: def[4] || '' });
  if (tipo === 'pfc') return Object.assign(base, { ehParaColado: true, forte: def[1] || '', pos: def[2] || '', forte2: def[3] || '', pos2: def[4] || '' });
  if (tipo === 'pc') return Object.assign(base, { ehParaColado: true, pre: def[1] });
  return Object.assign(base, { ehPara: true, pre: def[1] });
}

class EditorClass extends Component<{ modulo: Modulo; onHome: () => void }, any> {
  state = {
    montado: false,
    view: this.props.modulo === 'faturas' ? 'lista' : this.props.modulo === 'documentos' ? 'docs' : 'props',
    step: 1,
    clientes: CLIENTES_SEED,
    faturas: [],
    draft: null,
    filtro: 'todas',
    busca: '',
    clienteSel: '',
    salvarBanco: true,
    loteMes: '2026-09',
    lote: {},
    loteOff: {},
    toast: '',
    modal: null,
    colW: 0,
    winW: 1200,
    previewAberta: false,
    pagamentos: PAGAMENTOS_SEED,
    pagForm: null,
    pacotes: [],
    docDraft: null,
    docStep: 'inicio',
    docAba: 'procuracao',
    docBusca: '',
    propostas: [],
    propDraft: null,
    propStep: 'capa',
    propAba: 'capa',
    propBusca: '',
    gerentes: ['Carla Silva'],
    novoGerente: '',
    garantiasPadrao: GARANTIAS_PADRAO,
    rendPadrao: REND_PADRAO,
    imprimindo: false
  };

  imprimirProposta() {
    this.setState({ imprimindo: true });
    setTimeout(() => {
      window.print();
      this.setState({ imprimindo: false });
    }, 300);
  }

  patchProp(campo, valor) {
    this.setState(s => ({ propDraft: Object.assign({}, s.propDraft, { [campo]: valor, alterada: Date.now() }) }));
  }

  novaPropostaObj(tipo) {
    return {
      id: 'p' + Math.random().toString(36).slice(2, 9),
      tipo: tipo || 'sistema',
      cliente: '', gerente: this.state.gerentes[0] || 'Carla Silva',
      potencia: '6,10', geracao: '700', areaUtil: '50',
      itens: ITENS_PADRAO.map(x => Object.assign({}, x)),
      mostrarImagemDim: true,
      incContracapa: true, incPortfolio: true, incClientes: true, incEconomia: true, incFinanciamento: true,
      finBanco: 'BANCO BV', finOpcoes: FIN_PADRAO.map(x => Object.assign({}, x)),
      garantias: this.state.garantiasPadrao.map(x => Object.assign({}, x)),
      payback: '1 ano e 6 meses',
      rend: Object.assign({}, this.state.rendPadrao),
      aVista: true, valorVista: '17.654,88',
      cartao: false, valorCartao: '',
      outraAtiva: false, outraRotulo: '', valorOutra: '',
      validadeDias: '05',
      numDocumento: '', estado: 'Pernambuco', descricaoAtividades: '',
      itensServico: ITENS_SERVICO_PADRAO.map(x => Object.assign({}, x)),
      criada: Date.now(), alterada: Date.now()
    };
  }

  salvarProposta(pp) {
    const existe = this.state.propostas.some(x => x.id === pp.id);
    const propostas = existe ? this.state.propostas.map(x => (x.id === pp.id ? pp : x)) : [pp].concat(this.state.propostas);
    this.setState({ propostas: propostas });
    try {
      localStorage.setItem('brsolar.propostas.v1', JSON.stringify({
        propostas: propostas, gerentes: this.state.gerentes,
        garantiasPadrao: this.state.garantiasPadrao, rendPadrao: this.state.rendPadrao
      }));
    } catch (e) { /* sem storage */ }
    return propostas;
  }

  patchDoc(campo, valor) {
    this.setState(s => ({ docDraft: Object.assign({}, s.docDraft, { [campo]: valor, alterada: Date.now() }) }));
  }

  salvarPacote(dd) {
    const existe = this.state.pacotes.some(p => p.id === dd.id);
    const pacotes = existe ? this.state.pacotes.map(p => (p.id === dd.id ? dd : p)) : [dd].concat(this.state.pacotes);
    this.setState({ pacotes: pacotes });
    try {
      localStorage.setItem('brsolar.pacotes.v1', JSON.stringify({ pacotes: pacotes }));
    } catch (e) { /* sem storage */ }
    return pacotes;
  }

  patchForm(campo, valor) {
    this.setState(s => ({ pagForm: Object.assign({}, s.pagForm, { [campo]: valor }) }));
  }

  patchMany(obj) {
    this.setState(s => ({ draft: Object.assign({}, s.draft, obj, { alterada: Date.now() }) }));
  }

  medir = () => {
    const el = this._previewEl;
    const w = el ? el.clientWidth : 0;
    if (w !== this.state.colW || window.innerWidth !== this.state.winW) {
      this.setState({ colW: w, winW: window.innerWidth });
    }
  };

  setPreviewEl = el => {
    const alvo = el || document.querySelector('.preview-col');
    if (!alvo || alvo === this._previewEl) return;
    this._previewEl = alvo;
    if (typeof ResizeObserver !== 'undefined') {
      if (this._ro) this._ro.disconnect();
      this._ro = new ResizeObserver(this.medir);
      this._ro.observe(alvo);
    }
    this.medir();
    requestAnimationFrame(this.medir);
  };

  componentDidUpdate() {
    this.setPreviewEl(null);
    this.medir();
  }

  componentWillUnmount() {
    if (this._ro) this._ro.disconnect();
    window.removeEventListener('resize', this.medir);
  }

  componentDidMount() {
    window.addEventListener('resize', this.medir);
    try {
      const pk = JSON.parse(localStorage.getItem('brsolar.pacotes.v1') || 'null');
      if (pk && pk.pacotes) this.setState({ pacotes: pk.pacotes });
      const pr = JSON.parse(localStorage.getItem('brsolar.propostas.v1') || 'null');
      if (pr) {
        this.setState({
          propostas: pr.propostas || [],
          gerentes: (pr.gerentes && pr.gerentes.length) ? pr.gerentes : ['Carla Silva'],
          garantiasPadrao: pr.garantiasPadrao || GARANTIAS_PADRAO,
          rendPadrao: pr.rendPadrao || REND_PADRAO
        });
      }
    } catch (e) { /* sem storage */ }
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem('brsolar.faturas.v1') || 'null'); } catch (e) { saved = null; }
    if (saved && saved.faturas && saved.faturas.length) {
      this.setState({
        faturas: saved.faturas,
        clientes: saved.clientes || CLIENTES_SEED,
        pagamentos: (saved.pagamentos && saved.pagamentos.length) ? saved.pagamentos : PAGAMENTOS_SEED
      });
    } else {
      const c = this.state.clientes;
      const f1 = faturaSeed(c[0], '2026-08', { kwh: 2712, criada: Date.parse('2026-08-31'), alterada: Date.parse('2026-09-01') });
      const f2 = faturaSeed(c[1], '2026-08', { criada: Date.parse('2026-08-31'), alterada: Date.parse('2026-08-31') });
      const f3 = faturaSeed(c[2], '2026-08', { kwh: 1840, criada: Date.parse('2026-08-31'), alterada: Date.parse('2026-08-31') });
      const f4 = faturaSeed(c[3], '2026-07', { kwh: 960, criada: Date.parse('2026-07-30'), alterada: Date.parse('2026-07-30') });
      const f5 = faturaSeed(c[4], '2026-08', { criada: Date.parse('2026-08-31'), alterada: Date.parse('2026-08-31') });
      this.setState({ faturas: [f1, f2, f3, f4, f5] });
    }
    this.setState({ montado: true });
  }

  persist(faturas, clientes, pagamentos) {
    try {
      localStorage.setItem('brsolar.faturas.v1', JSON.stringify({
        faturas: faturas || this.state.faturas,
        clientes: clientes || this.state.clientes,
        pagamentos: pagamentos || this.state.pagamentos
      }));
    } catch (e) { /* sem storage */ }
  }

  flash(msg) {
    this.setState({ toast: msg });
    clearTimeout(this._t);
    this._t = setTimeout(() => this.setState({ toast: '' }), 2600);
  }

  patch(campo, valor) {
    this.setState(s => ({ draft: Object.assign({}, s.draft, { [campo]: valor, alterada: Date.now() }) }));
  }

  pagamentoPadrao() {
    const lista = this.state.pagamentos || PAGAMENTOS_SEED;
    return lista.find(p => p.padrao) || lista[0] || PAGAMENTOS_SEED[0];
  }

  novoDraft() {
    const dt = hoje();
    const mes = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0');
    const pag = this.pagamentoPadrao();
    return Object.assign({
      id: 'f' + Math.random().toString(36).slice(2, 9),
      clienteId: '', nome: '', doc: '', endereco: '',
      mes: mes, vencimento: iso(new Date(dt.getFullYear(), dt.getMonth() + 1, 10)),
      tipo: 'consumo', kwh: 0, tarifa: 1.37, valorRef: 0, desconto: 30, concessionaria: 'Neoenergia',
      contratado: 0, taxaMinima: 0, criada: Date.now(), alterada: Date.now()
    }, {
      pagamentoId: pag.id, pix: pag.pix, favorecido: pag.favorecido,
      banco: pag.banco, agencia: pag.agencia, conta: pag.conta, tipoConta: pag.tipoConta
    });
  }

  salvar(draft) {
    const d = draft || this.state.draft;
    const existe = this.state.faturas.some(f => f.id === d.id);
    const faturas = existe
      ? this.state.faturas.map(f => (f.id === d.id ? d : f))
      : [d].concat(this.state.faturas);
    this.setState({ faturas: faturas });
    this.persist(faturas);
    return faturas;
  }

  calcular(d) {
    if (!d) return { valorRef: 0, descontoValor: 0, total: 0 };
    if (d.tipo === 'fixa') {
      const total = (Number(d.contratado) || 0) + (Number(d.taxaMinima) || 0);
      return { valorRef: 0, descontoValor: 0, total: total };
    }
    const valorRef = refDe(d);
    const total = valorRef * (1 - (Number(d.desconto) || 0) / 100);
    return { valorRef: valorRef, descontoValor: valorRef - total, total: total };
  }

  msgEconomia(d) {
    if (!d) return '';
    if (d.tipo === 'fixa') return 'Parabéns! Você economizou bastante esse mês!';
    const c = this.calcular(d);
    const eco = arredondaEconomia(Math.max(0, c.valorRef - c.total));
    return 'Parabéns! Sua economia em relação ao valor da ' + (d.concessionaria || 'Neoenergia') + ' foi de mais de ' + brl(eco) + '.';
  }

  imprimir() {
    setTimeout(() => window.print(), 120);
  }

  novoPacote() {
    return {
      id: 'd' + Math.random().toString(36).slice(2, 9),
      nome: '', doc: '', endereco: '', rg: '', profissao: '',
      nacionalidade: '', estadoCivil: '',
      representante: '', repCpf: '', repCargo: 'síndico',
      assinaturaPor: 'cliente',
      incProcuracao: true, incTermo: true, incContrato: true,
      valorMensal: TEXTOS_TERMO.valorMensal,
      explicativo: TEXTOS_TERMO.explicativo,
      simplificadora: TEXTOS_TERMO.simplificadora,
      criada: Date.now(), alterada: Date.now()
    };
  }

  assinaturaDe(dd) {
    const ehPJ = soDigitos(dd.doc).length === 14;
    if (dd.assinaturaPor === 'representante' && dd.representante) {
      return { nome: dd.representante.toUpperCase(), docLinha: numeroDoc(dd.repCpf) ? 'CPF ' + numeroDoc(dd.repCpf) : '' };
    }
    const num = numeroDoc(dd.doc);
    return { nome: (dd.nome || 'NOME DO CLIENTE').toUpperCase(), docLinha: num ? (ehPJ ? 'CNPJ ' : 'CPF ') + num : '' };
  }

  paginasProcuracao(dd, dataStr) {
    const ehPJ = soDigitos(dd.doc).length === 14;
    const num = numeroDoc(dd.doc);
    const nome = (dd.nome || 'NOME DO CLIENTE').toUpperCase();
    let pos = '', forte2 = '', pos2 = '';
    if (ehPJ) {
      pos = (num ? ', inscrito sob CNPJ n° ' + num : '') + (dd.endereco ? ', localizado na ' + dd.endereco : '');
      if (dd.representante) {
        pos += ', sob representação do ' + (dd.repCargo || 'representante legal') + ' ';
        forte2 = dd.representante.toUpperCase();
        pos2 = (numeroDoc(dd.repCpf) ? ', CPF nº ' + numeroDoc(dd.repCpf) : '') + '.';
      } else { pos += '.'; }
    } else {
      const det = juntar([dd.nacionalidade, dd.estadoCivil, dd.profissao, dd.rg ? 'RG nº ' + dd.rg : '']);
      pos = (det ? ', ' + det : '') + (num ? ', inscrito sob CPF n° ' + num : '') + (dd.endereco ? ', residente e domiciliado na ' + dd.endereco : '') + '.';
    }
    const assin = this.assinaturaDe(dd);
    const blocos = [
      ['s', ehPJ ? 'PROCURAÇÃO - PESSOA JURÍDICA' : 'PROCURAÇÃO - PESSOA FÍSICA'],
      ['s', 'OUTORGANTE:'],
      ['pf', nome, pos, forte2, pos2],
      ['s', 'OUTORGADOS:'],
      ['pf', OUTORGADOS[0].forte, OUTORGADOS[0].pos, '', ''],
      ['pf', OUTORGADOS[1].forte, OUTORGADOS[1].pos, '', ''],
      ['s', 'PODERES:'],
      ['p', 'Representá-la junto à Companhia Energética de Pernambuco – CELPE, com poderes para requerer/solicitar todos os processos, assinar papéis e documentos, análises e aprovações junto a essa concessionária.'],
      ['data', dataStr + '.'],
      ['assin', assin.nome, assin.docLinha]
    ];
    return [{ blocos: blocos.map(bloco) }];
  }

  paginasTermo(dd, dataStr) {
    const ehPJ = soDigitos(dd.doc).length === 14;
    const num = numeroDoc(dd.doc);
    const nome = (dd.nome || 'NOME DO CLIENTE').toUpperCase();
    let posContratante;
    if (ehPJ) {
      posContratante = (num ? ', pessoa jurídica inscrita sob CNPJ nº ' + num : '')
        + (dd.endereco ? ', com sede na ' + dd.endereco : '')
        + (dd.representante ? ', representada pelo ' + (dd.repCargo || 'representante legal') + ' ' + dd.representante.toUpperCase() + (numeroDoc(dd.repCpf) ? ', CPF nº ' + numeroDoc(dd.repCpf) : '') : '') + '.';
    } else {
      const det = juntar([dd.nacionalidade, dd.estadoCivil, dd.profissao]);
      posContratante = (det ? ', ' + det : '') + (num ? ', inscrita sob CPF nº ' + num : '')
        + (dd.rg ? ', RG nº ' + dd.rg : '')
        + (dd.endereco ? ', residente e domiciliado na ' + dd.endereco : '') + '.';
    }
    const assin = this.assinaturaDe(dd);
    const p1 = [
      ['t', 'TERMO DE ADESÃO'],
      ['t', 'LOCAÇÃO DE CENTRAL DE GERAÇÃO FOTOVOLTAICA'],
      ['t', 'BR SOLAR'],
      ['s', '1. DAS PARTES'],
      ['pf', 'Contratante: ' + nome, posContratante, '', ''],
      ['pf', 'Contratada: BRENO RUFINO ENERGIA RENOVAVEL E PRODUCAO ARTISTICAS. ("Br Solar")', ', pessoa jurídica de direito privado, inscrita no CNPJ/ME nº 27.786.322/0001-64, com sede na Rua Mata Grande, 1111, Jaboatão dos Guararapes-PE, CEP 54340-002, legalmente representada por ', 'BRENO FERREIRA RUFINO', ', brasileiro, solteiro, empresário, portador da cédula de identidade RG nº 9.532.484 SDS/PE, inscrito no CPF sob o nº 703.036.134-24, com e-mail brsolarpe@gmail.com.'],
      ['s', '2. DO RESUMO DA LOCAÇÃO'],
      ['pf', 'Objeto:', ' Aluguel de usina solar para geração de créditos de energia em favor do cliente para redução no custo mensal com energia elétrica pelo prazo de 24 meses.', '', ''],
      ['pfc', 'Distribuidora de Energia:', ' Neoenergia Pernambuco', '', ''],
      ['pfc', 'Modalidade:', ' Geração Compartilhada, por meio de veículo de compensação.', '', ''],
      ['pfc', 'Objetivo e Prazo:', ' Aluguel de usina solar para geração de créditos de energia em favor do cliente para redução no custo mensal com energia elétrica pelo prazo de 24 (vinte e quatro) meses.', '', ''],
      ['pfc', 'Valor Mensal:', ' ' + (dd.valorMensal || ''), '', ''],
      ['pfc', 'Explicativo:', ' ' + (dd.explicativo || ''), '', ''],
      ['pfc', 'Simplificadora:', ' ' + (dd.simplificadora || ''), '', ''],
      ['s', '3. DAS CONDIÇÕES COMERCIAIS E VANTAGENS'],
      ['pc', 'A partir da assinatura deste Termo de Adesão, o Cliente Contratante poderá usufruir dos seguintes benefícios, de acordo com as Condições Gerais de Locação:'],
      ['pc', 'I.  Desconto no custo mensal com energia elétrica ativa compensada de 30% (trinta por cento);'],
      ['pc', 'II.  Pagamento único, do custo mensal com energia elétrica, em favor do veículo de compensação;'],
      ['pc', 'III. Flexibilidade, com a possibilidade de encerramento do contrato, mediante comunicação prévia;']
    ];
    const p2 = [
      ['s', '4. DOS COMPROMISSOS'],
      ['pc', 'A partir da assinatura deste Termo de Adesão:'],
      ['pc', 'I.  O Cliente Contratante declara estar ciente e de acordo com os termos das Condições Gerais de Locação; e'],
      ['pc', 'II. O Cliente Contratante compromete-se a assinar os instrumentos necessários à sua vinculação ao veículo de compensação a ser utilizado, que serão fornecidos pela Contratada.'],
      ['data', dataStr],
      ['assin', BR_SOLAR_ASSIN.nome, BR_SOLAR_ASSIN.docLinha],
      ['assin', assin.nome, assin.docLinha]
    ];
    return [{ blocos: p1.map(bloco) }, { blocos: p2.map(bloco) }];
  }

  paginasContrato(dd, dataStr) {
    const assin = this.assinaturaDe(dd);
    return CONTRATO_PAGINAS.map((defs, i) => {
      let lista = defs.slice();
      if (i === CONTRATO_PAGINAS.length - 1) {
        lista = lista.concat([
          ['data', dataStr],
          ['assin', BR_SOLAR_ASSIN.nome, BR_SOLAR_ASSIN.docLinha],
          ['assin', assin.nome, assin.docLinha]
        ]);
      }
      return { blocos: lista.map(bloco) };
    });
  }

  documentosDe(dd) {
    const dataStr = dataExtenso(hoje());
    const out = [];
    if (dd.incProcuracao) out.push({ chave: 'procuracao', titulo: 'Procuração', paginas: this.paginasProcuracao(dd, dataStr) });
    if (dd.incTermo) out.push({ chave: 'termo', titulo: 'Termo de Adesão', paginas: this.paginasTermo(dd, dataStr) });
    if (dd.incContrato) out.push({ chave: 'contrato', titulo: 'Contrato', paginas: this.paginasContrato(dd, dataStr) });
    return out;
  }

  renderVals() {
    const s = this.state;
    const d = s.draft || this.novoDraft();
    const calc = this.calcular(d);

    const clientesPorId = {};
    s.clientes.forEach(c => { clientesPorId[c.id] = c; });

    // --- lista ---
    const termo = s.busca.trim().toLowerCase();
    const lista = s.faturas
      .filter(f => (s.filtro === 'todas' ? true : f.tipo === s.filtro))
      .filter(f => (termo ? f.nome.toLowerCase().includes(termo) : true))
      .map(f => {
        const t = totalDe(f);
        return {
          nome: f.nome,
          docLinha: mascaraDoc(f.doc) || 'Sem CPF/CNPJ informado',
          tag: f.tipo === 'fixa' ? 'Fixa' : 'Consumo',
          tagBg: f.tipo === 'fixa' ? '#EDE7F6' : '#FFF0DC',
          tagFg: f.tipo === 'fixa' ? '#5A3E9B' : '#A65A00',
          totalStr: brl(t),
          refLabel: refLabel(f.mes),
          venc: dataBr(f.vencimento),
          consumoLabel: f.tipo === 'fixa' ? 'Valor fixo contratado' : intBr(f.kwh) + ' kWh · −' + f.desconto + '%',
          criada: dataCurta(f.criada),
          alterada: dataCurta(f.alterada),
          onAbrir: () => this.setState({ draft: Object.assign({}, f), view: 'wizard', step: 1 }),
          onDuplicar: () => {
            const dt = hoje();
            const copia = Object.assign({}, f, {
              id: 'f' + Math.random().toString(36).slice(2, 9),
              mes: dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0'),
              criada: Date.now(), alterada: Date.now()
            });
            this.setState({ draft: copia, view: 'wizard', step: 1 });
            this.flash('Fatura duplicada — revise o consumo do mês.');
          },
          onPdf: () => this.setState({
            modal: {
              titulo: 'Atualizar a data?',
              texto: 'Esta fatura é de ' + refLabel(f.mes) + '. Quer atualizar o vencimento e a referência para hoje antes de exportar?',
              simLabel: 'Atualizar e exportar',
              naoLabel: 'Exportar como está',
              sim: () => {
                const dt = hoje();
                const atual = Object.assign({}, f, {
                  mes: dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0'),
                  vencimento: iso(new Date(dt.getFullYear(), dt.getMonth() + 1, Number(String(f.vencimento).slice(-2)))),
                  alterada: Date.now()
                });
                this.setState({ draft: atual, view: 'wizard', step: 4, modal: null });
                this.imprimir();
              },
              nao: () => {
                this.setState({ draft: Object.assign({}, f), view: 'wizard', step: 4, modal: null });
                this.imprimir();
              }
            }
          })
        };
      });

    const filtros = [
      { key: 'todas', label: 'Todas' },
      { key: 'consumo', label: 'Por consumo' },
      { key: 'fixa', label: 'Fixas' }
    ].map(f => ({
      label: f.label,
      bg: s.filtro === f.key ? '#fff' : 'transparent',
      fg: s.filtro === f.key ? '#151515' : '#6B6B6B',
      onClick: () => this.setState({ filtro: f.key })
    }));

    // --- lote ---
    const loteLinhas = s.clientes.map(c => {
      const kwh = s.lote[c.id] === undefined ? '' : s.lote[c.id];
      const incluir = !s.loteOff[c.id];
      const total = c.tipo === 'fixa'
        ? (c.contratado || 0) + (c.taxaMinima || 0)
        : (Number(kwh) || 0) * (c.tarifa || 0) * (1 - (c.desconto || 0) / 100);
      return {
        nome: c.nome,
        detalhe: c.tipo === 'fixa'
          ? 'Fixa · ' + brl(c.contratado) + ' + taxa ' + brl(c.taxaMinima)
          : 'Consumo · −' + c.desconto + '% · vence dia ' + c.diaVenc,
        barra: c.tipo === 'fixa' ? '#7E57C2' : '#FF8D02',
        pedeConsumo: c.tipo === 'consumo',
        kwh: kwh,
        incluir: incluir,
        totalStr: incluir ? brl(total) : '—',
        onToggle: () => this.setState(st => ({ loteOff: Object.assign({}, st.loteOff, { [c.id]: !st.loteOff[c.id] }) })),
        onKwh: e => {
          const v = e.target.value;
          this.setState(st => ({ lote: Object.assign({}, st.lote, { [c.id]: v }) }));
        }
      };
    });
    const loteAtivos = s.clientes.filter(c => !s.loteOff[c.id]);
    const loteTotalNum = loteAtivos.reduce((acc, c) => {
      if (c.tipo === 'fixa') return acc + (c.contratado || 0) + (c.taxaMinima || 0);
      return acc + (Number(s.lote[c.id]) || 0) * (c.tarifa || 0) * (1 - (c.desconto || 0) / 100);
    }, 0);

    // --- passos ---
    const labels = ['Cliente', 'Valores', 'Pagamento', 'Revisar'];
    const passos = labels.map((label, i) => ({
      label: label,
      barra: s.step >= i + 1 ? '#FF8D02' : '#D6D6DA',
      cor: s.step === i + 1 ? '#151515' : '#8A8A8A',
      onClick: () => this.setState({ step: i + 1 })
    }));

    // --- página da fatura ---
    const isConsumo = d.tipo === 'consumo';
    const linhas = String(d.endereco || '').split('\n').filter(l => l.trim());
    const rows = isConsumo
      ? [
          { label: 'Consumo ' + intBr(d.kwh) + ' kWh', sub: 'Valor referência ' + (d.concessionaria || 'Neoenergia'), valor: brl(calc.valorRef), temPill: false, pill: '' },
          { label: 'Desconto cliente', sub: '', valor: brl(calc.total), temPill: true, pill: '-' + (Number(d.desconto) || 0) + '%' }
        ]
      : [
          { label: 'Contratado', sub: '', valor: brl(d.contratado), temPill: false, pill: '' },
          { label: 'Taxa mínima', sub: '', valor: brl(d.taxaMinima), temPill: false, pill: '' }
        ];

    const p = {
      ref: refLabel(d.mes),
      total: brl(calc.total),
      venc: dataBr(d.vencimento),
      nome: d.nome || 'Nome do cliente',
      temDoc: !!mascaraDoc(d.doc),
      docLinha: mascaraDoc(d.doc),
      linhas: linhas,
      isConsumo: isConsumo,
      kwh: intBr(d.kwh),
      detTop: isConsumo ? '548px' : '404px',
      rows: rows,
      notaTotal: isConsumo ? '' : '(desconto especial para o cliente)',
      ecoTop: isConsumo ? '739px' : '645px',
      ecoLeft: isConsumo ? '33px' : '177px',
      ecoWidth: isConsumo ? '728px' : '440px',
      economia: this.msgEconomia(d),
      pix: d.pix,
      favorecido: d.favorecido,
      bancoRows: [
        { k: 'Banco', v: d.banco },
        { k: 'Agência', v: d.agencia },
        { k: 'Conta', v: d.conta },
        { k: 'Tipo', v: d.tipoConta || 'Conta Corrente' }
      ]
    };

    // --- documentos ---
    const dd = s.docDraft || this.novoPacote();
    const ehPJ = soDigitos(dd.doc).length === 14;
    const docsGerados0 = this.documentosDe(dd);
    const abaAtiva = docsGerados0.some(x => x.chave === s.docAba) ? s.docAba : (docsGerados0[0] || {}).chave;
    const docVisivel = docsGerados0.find(x => x.chave === abaAtiva);
    const nPaginas = docVisivel ? docVisivel.paginas.length : 0;

    const termoDentro = !!dd.incTermo;
    const passosDoc = [{ k: 'inicio', label: 'Início' }, { k: 'qualificacao', label: 'Qualificação' }]
      .concat(termoDentro ? [{ k: 'termo', label: 'Termo' }] : [])
      .concat([{ k: 'revisar', label: 'Revisar' }]);
    const idxDoc = Math.max(0, passosDoc.findIndex(p => p.k === s.docStep));

    const termoBusca = s.docBusca.trim().toLowerCase();
    const listaPacotes = s.pacotes
      .filter(pk => (termoBusca ? pk.nome.toLowerCase().includes(termoBusca) : true))
      .map(pk => ({
        nome: pk.nome || 'Sem nome',
        docLinha: mascaraDoc(pk.doc) || 'Sem CPF/CNPJ',
        tipoTag: soDigitos(pk.doc).length === 14 ? 'Pessoa jurídica' : 'Pessoa física',
        inclusos: [pk.incProcuracao ? 'Procuração' : '', pk.incTermo ? 'Termo' : '', pk.incContrato ? 'Contrato' : ''].filter(Boolean).join(' · '),
        criada: dataCurta(pk.criada),
        alterada: dataCurta(pk.alterada),
        onAbrir: () => this.setState({ docDraft: Object.assign({}, pk), view: 'docsWizard', docStep: 'inicio' }),
        onDuplicar: () => {
          this.setState({
            docDraft: Object.assign({}, pk, { id: 'd' + Math.random().toString(36).slice(2, 9), criada: Date.now(), alterada: Date.now() }),
            view: 'docsWizard', docStep: 'inicio'
          });
          this.flash('Pacote duplicado — troque o cliente.');
        },
        onPdf: () => {
          this.setState({ docDraft: Object.assign({}, pk), view: 'docsWizard', docStep: 'revisar' });
          this.imprimir();
        }
      }));

    // --- propostas ---
    const pp = s.propDraft || this.novaPropostaObj();
    const ehSistema = pp.tipo === 'sistema';
    const hojeDt = hoje();
    const dataCurtaBr = String(hojeDt.getDate()).padStart(2, '0') + '/' + String(hojeDt.getMonth() + 1).padStart(2, '0') + '/' + hojeDt.getFullYear();
    const dataPorExtenso = String(hojeDt.getDate()).padStart(2, '0') + ' de ' + MESES_EXT[hojeDt.getMonth()] + ' de ' + hojeDt.getFullYear();

    const totalServico = (pp.itensServico || []).reduce((a, it) => a + numeroBr(it.valor), 0);
    const fluxoCaixa = '-' + moedaBr(pp.valorVista);

    const rendNums = {
      poupanca: numeroBr(String(pp.rend.poupanca).replace('%', '')),
      rendaFixa: numeroBr(String(pp.rend.rendaFixa).replace('%', '')),
      solar: numeroBr(String(pp.rend.solar).replace('%', ''))
    };
    const maxRend = Math.max(rendNums.poupanca, rendNums.rendaFixa, rendNums.solar, 1);
    const barra = v => Math.round((v / maxRend) * 205) + 'px';

    const incFin = pp.incFinanciamento !== false;
    const finOpcoes = pp.finOpcoes || FIN_PADRAO;
    const patchFin = (i, campo, v) => this.patchProp('finOpcoes', finOpcoes.map((x, j) => (j === i ? Object.assign({}, x, { [campo]: v }) : x)));
    const passosProp = ehSistema
      ? [{ k: 'capa', label: 'Capa' }, { k: 'secoes', label: 'Seções' }]
        .concat(pp.incPortfolio ? [{ k: 'garantias', label: 'Garantias' }] : [])
        .concat([{ k: 'dimensionamento', label: 'Sistema' }])
        .concat(pp.incEconomia ? [{ k: 'economia', label: 'Economia' }] : [])
        .concat(incFin ? [{ k: 'financiamento', label: 'Financiamento' }] : [])
        .concat([{ k: 'condicoes', label: 'Condições' }, { k: 'revisar', label: 'Revisar' }])
      : [{ k: 'capa', label: 'Capa' }, { k: 'servico', label: 'Serviço' }, { k: 'valores', label: 'Valores' }, { k: 'condicoes', label: 'Considerações' }, { k: 'revisar', label: 'Revisar' }];
    const idxProp = Math.max(0, passosProp.findIndex(x => x.k === s.propStep));

    const abasProp = ehSistema
      ? [{ k: 'capa', label: 'Capa' }]
        .concat(pp.incContracapa ? [{ k: 'contracapa', label: 'Contracapa' }] : [])
        .concat(pp.incPortfolio ? [{ k: 'portfolio', label: 'Portfólio' }] : [])
        .concat(pp.incClientes ? [{ k: 'clientes', label: 'Clientes' }] : [])
        .concat([{ k: 'dimensionamento', label: 'Sistema' }])
        .concat(pp.incEconomia ? [{ k: 'economia', label: 'Economia' }] : [])
        .concat(incFin ? [{ k: 'financiamento', label: 'Financiamento' }] : [])
        .concat([{ k: 'condicoes', label: 'Condições' }])
      : [{ k: 'capa', label: 'Capa' }, { k: 'institucional', label: 'Institucional' }, { k: 'servico', label: 'Serviço' }, { k: 'condicoes', label: 'Considerações' }];
    const abaProp = abasProp.some(x => x.k === s.propAba) ? s.propAba : 'capa';
    const disp = k => (k === abaProp ? 'flex' : 'none');

    const garantiasMudaram = JSON.stringify(pp.garantias) !== JSON.stringify(s.garantiasPadrao);
    const rendMudou = JSON.stringify(pp.rend) !== JSON.stringify(s.rendPadrao);

    const termoBuscaProp = s.propBusca.trim().toLowerCase();
    const listaPropostas = s.propostas
      .filter(x => (termoBuscaProp ? (x.cliente || '').toLowerCase().includes(termoBuscaProp) : true))
      .map(x => ({
        cliente: x.cliente || 'Sem cliente',
        tipoLabel: x.tipo === 'sistema' ? 'Sistema solar' : (x.tipo === 'carregador' ? 'Carregador veicular' : 'Serviço diverso'),
        tagBg: x.tipo === 'sistema' ? '#FFF0DC' : '#E7F0FA',
        tagFg: x.tipo === 'sistema' ? '#A65A00' : '#20527F',
        potencia: x.tipo === 'sistema' ? x.potencia + ' kWp' : ((x.itensServico || []).length + ' itens'),
        valor: 'R$ ' + (x.tipo === 'sistema' ? moedaBr(x.valorVista) : moedaBr((x.itensServico || []).reduce((a, it) => a + numeroBr(it.valor), 0))),
        gerente: x.gerente,
        criada: dataCurta(x.criada),
        alterada: dataCurta(x.alterada),
        onAbrir: () => this.setState({ propDraft: Object.assign({}, x), view: 'propsWizard', propStep: 'capa', propAba: 'capa' }),
        onDuplicar: () => {
          this.setState({
            propDraft: Object.assign({}, x, { id: 'p' + Math.random().toString(36).slice(2, 9), criada: Date.now(), alterada: Date.now() }),
            view: 'propsWizard', propStep: 'capa', propAba: 'capa'
          });
          this.flash('Proposta duplicada.');
        },
        onPdf: () => {
          this.setState({ propDraft: Object.assign({}, x), view: 'propsWizard', propStep: 'revisar' });
          this.imprimirProposta();
        }
      }));

    const clienteAtual = clientesPorId[s.clienteSel];

    const isNarrow = s.winW < 760;
    const disponivel = Math.max(240, (s.colW || 596) - 40);
    const escala = Math.min(0.7, disponivel / 794);
    const mostrarPreview = !isNarrow || s.previewAberta;

    return {
      previewDisplay: mostrarPreview ? 'flex' : 'none',
      scalerW: Math.round(794 * escala) + 'px',
      scalerH: Math.round(1123 * escala) + 'px',
      scaleCss: 'scale(' + escala + ')',
      isNarrow: isNarrow,
      previewBotao: s.previewAberta ? 'Ocultar prévia do PDF' : 'Ver prévia do PDF',
      togglePreview: () => this.setState(st => ({ previewAberta: !st.previewAberta })),

      isHome: s.view === 'home',
      isLista: s.view === 'lista',
      isWizard: s.view === 'wizard',
      isLote: s.view === 'lote',
      totalFaturas: s.faturas.length,
      totalPacotes: s.pacotes.length,
      goDocs: () => this.setState({ view: 'docs' }),
      novoPacoteDoc: () => this.setState({ docDraft: this.novoPacote(), view: 'docsWizard', docStep: 'inicio', docAba: 'procuracao' }),
      goHome: () => this.props.onHome(),
      goFaturas: () => this.setState({ view: 'lista' }),
      goLote: () => this.setState({ view: 'lote' }),
      novaFatura: () => this.setState({ draft: this.novoDraft(), clienteSel: '', view: 'wizard', step: 1 }),

      listaFaturas: lista,
      listaVazia: lista.length === 0,
      filtros: filtros,
      busca: s.busca,
      onBusca: e => this.setState({ busca: e.target.value }),

      loteMes: s.loteMes,
      onLoteMes: e => this.setState({ loteMes: e.target.value }),
      loteLinhas: loteLinhas,
      loteTotal: brl(loteTotalNum),
      loteBotao: 'Gerar ' + loteAtivos.length + ' faturas',
      gerarLote: () => {
        const pag = this.pagamentoPadrao();
        const novas = loteAtivos.map(c => faturaSeed(c, s.loteMes, c.tipo === 'consumo' ? { kwh: Number(s.lote[c.id]) || 0 } : {}, pag));
        const faturas = novas.concat(s.faturas);
        this.setState({ faturas: faturas, view: 'lista', lote: {} });
        this.persist(faturas);
        this.flash(novas.length + ' faturas geradas para ' + refLabel(s.loteMes) + '.');
      },

      passos: passos,
      isStep1: s.step === 1,
      isStep2: s.step === 2,
      isStep3: s.step === 3,
      isStep4: s.step === 4,
      temProximo: s.step < 4,
      voltarPasso: () => (s.step > 1 ? this.setState({ step: s.step - 1 }) : this.setState({ view: 'lista' })),
      proximoPasso: () => this.setState({ step: Math.min(4, s.step + 1) }),

      d: {
        nome: d.nome, doc: d.doc, endereco: d.endereco, mes: d.mes, vencimento: d.vencimento,
        kwh: d.kwh, tarifa: d.tarifa, desconto: d.desconto,
        valorRef: (d.valorRef === undefined || d.valorRef === '' || d.valorRef === null)
          ? Math.round(refDe(d) * 100) / 100
          : d.valorRef,
        contratado: d.contratado, taxaMinima: d.taxaMinima,
        pix: d.pix, favorecido: d.favorecido, banco: d.banco, agencia: d.agencia, conta: d.conta
      },
      calc: { valorRef: brl(calc.valorRef), descontoValor: brl(calc.descontoValor), total: brl(calc.total) },
      concessionaria: d.concessionaria || 'Neoenergia',
      docHint: mascaraDoc(d.doc)
        ? 'Detectado: ' + mascaraDoc(d.doc).split(':')[0]
        : 'Digite 11 dígitos para CPF ou 14 para CNPJ.',

      clientes: s.clientes.map(c => ({ id: c.id, nome: c.nome })),
      clienteSel: s.clienteSel,
      memoriaTexto: clienteAtual
        ? 'Preenchido do cadastro: endereço, CPF/CNPJ, tipo de fatura, desconto e dia de vencimento.'
        : 'Escolha um cliente para trazer endereço, documento, desconto e vencimento automaticamente.',
      onCliente: e => {
        const id = e.target.value;
        const c = clientesPorId[id];
        if (!c) { this.setState({ clienteSel: '' }); return; }
        const base = faturaSeed(c, d.mes || s.loteMes, null, {
          id: d.pagamentoId, pix: d.pix, favorecido: d.favorecido,
          banco: d.banco, agencia: d.agencia, conta: d.conta, tipoConta: d.tipoConta
        });
        this.setState({ clienteSel: id, draft: Object.assign({}, base, { id: d.id }) });
      },
      onNome: e => this.patch('nome', e.target.value),
      onDoc: e => this.patch('doc', e.target.value),
      onEndereco: e => this.patch('endereco', e.target.value),
      onMes: e => this.patch('mes', e.target.value),
      onVencimento: e => this.patch('vencimento', e.target.value),
      onKwh: e => {
        const kwh = e.target.value;
        this.patchMany({ kwh: kwh, valorRef: Math.round((Number(kwh) || 0) * (Number(d.tarifa) || 1.37) * 100) / 100 });
      },
      onValorRef: e => this.patch('valorRef', e.target.value),
      onTarifa: e => this.patch('tarifa', e.target.value),
      onDesconto: e => this.patch('desconto', e.target.value),
      onContratado: e => this.patch('contratado', e.target.value),
      onTaxa: e => this.patch('taxaMinima', e.target.value),
      onPix: e => this.patch('pix', e.target.value),
      onFavorecido: e => this.patch('favorecido', e.target.value),
      onBanco: e => this.patch('banco', e.target.value),
      onAgencia: e => this.patch('agencia', e.target.value),
      onConta: e => this.patch('conta', e.target.value),
      pagamentos: (s.pagamentos || []).map(pg => {
        const ativo = (d.pagamentoId || (this.pagamentoPadrao() || {}).id) === pg.id;
        return {
          apelido: pg.apelido,
          favorecido: pg.favorecido,
          linhaBanco: pg.banco + ' · Ag. ' + pg.agencia + ' · C/C ' + pg.conta,
          pix: pg.pix,
          ehPadrao: !!pg.padrao,
          borda: ativo ? '#FF8D02' : '#E2E2E5',
          radioBorda: ativo ? '#FF8D02' : '#C4C4C8',
          radioBg: ativo ? '#FF8D02' : '#fff',
          onSelect: () => this.patchMany({
            pagamentoId: pg.id, pix: pg.pix, favorecido: pg.favorecido,
            banco: pg.banco, agencia: pg.agencia, conta: pg.conta, tipoConta: pg.tipoConta
          }),
          onEditar: e => { e.stopPropagation(); this.setState({ pagForm: Object.assign({}, pg) }); }
        };
      }),
      semFormPag: !s.pagForm,
      temFormPag: !!s.pagForm,
      formPagTitulo: s.pagForm && s.pagForm.id ? 'Editar dados de pagamento' : 'Novos dados de pagamento',
      form: {
        apelido: s.pagForm ? s.pagForm.apelido : '',
        pix: s.pagForm ? s.pagForm.pix : '',
        favorecido: s.pagForm ? s.pagForm.favorecido : '',
        banco: s.pagForm ? s.pagForm.banco : '',
        agencia: s.pagForm ? s.pagForm.agencia : '',
        conta: s.pagForm ? s.pagForm.conta : '',
        padrao: s.pagForm ? !!s.pagForm.padrao : false
      },
      onFormApelido: e => this.patchForm('apelido', e.target.value),
      onFormPix: e => this.patchForm('pix', e.target.value),
      onFormFavorecido: e => this.patchForm('favorecido', e.target.value),
      onFormBanco: e => this.patchForm('banco', e.target.value),
      onFormAgencia: e => this.patchForm('agencia', e.target.value),
      onFormConta: e => this.patchForm('conta', e.target.value),
      onFormPadrao: e => this.patchForm('padrao', e.target.checked),
      novoPagamento: () => this.setState({
        pagForm: { apelido: '', pix: '', favorecido: '', banco: '', agencia: '', conta: '', tipoConta: 'Conta Corrente', padrao: false }
      }),
      cancelarPagamento: () => this.setState({ pagForm: null }),
      podeExcluirPag: !!(s.pagForm && s.pagForm.id && s.pagamentos.length > 1),
      excluirPagamento: () => {
        const lista = s.pagamentos.filter(p => p.id !== s.pagForm.id);
        this.setState({ pagamentos: lista, pagForm: null });
        this.persist(null, null, lista);
        this.flash('Dados de pagamento removidos.');
      },
      salvarPagamento: () => {
        const f = s.pagForm;
        const novo = Object.assign({ tipoConta: 'Conta Corrente' }, f, {
          id: f.id || 'p' + Math.random().toString(36).slice(2, 8),
          apelido: (f.apelido || '').trim() || (f.banco || 'Dados de pagamento')
        });
        let lista = f.id ? s.pagamentos.map(p => (p.id === f.id ? novo : p)) : s.pagamentos.concat([novo]);
        if (novo.padrao) lista = lista.map(p => Object.assign({}, p, { padrao: p.id === novo.id }));
        this.setState({ pagamentos: lista, pagForm: null });
        this.persist(null, null, lista);
        this.patchMany({
          pagamentoId: novo.id, pix: novo.pix, favorecido: novo.favorecido,
          banco: novo.banco, agencia: novo.agencia, conta: novo.conta, tipoConta: novo.tipoConta
        });
        this.flash('Dados de pagamento salvos.');
      },

      isConsumo: isConsumo,
      isFixa: !isConsumo,
      tabConsumoBg: isConsumo ? '#fff' : 'transparent',
      tabConsumoFg: isConsumo ? '#151515' : '#6B6B6B',
      tabFixaBg: isConsumo ? 'transparent' : '#fff',
      tabFixaFg: isConsumo ? '#6B6B6B' : '#151515',
      setConsumo: () => this.patch('tipo', 'consumo'),
      setFixa: () => this.patch('tipo', 'fixa'),

      resumo: [
        { k: 'Cliente', v: d.nome || '—' },
        { k: 'Documento', v: mascaraDoc(d.doc) || '—' },
        { k: 'Referência', v: refLabel(d.mes) },
        { k: 'Vencimento', v: dataBr(d.vencimento) },
        { k: 'Tipo', v: isConsumo ? 'Por consumo' : 'Valor fixo' },
        { k: 'Total a pagar', v: brl(calc.total) }
      ],
      economiaMsg: this.msgEconomia(d),
      baixarPdf: () => { this.salvar(d); this.imprimir(); },
      salvarFatura: () => { this.salvar(d); this.setState({ view: 'lista' }); this.flash('Fatura salva.'); },

      p: p,

      temModal: !!s.modal,
      modalTitulo: s.modal ? s.modal.titulo : '',
      modalTexto: s.modal ? s.modal.texto : '',
      modalSimLabel: s.modal ? s.modal.simLabel : '',
      modalNaoLabel: s.modal ? s.modal.naoLabel : '',
      modalSim: () => { if (s.modal) s.modal.sim(); },
      modalNao: () => { if (s.modal) s.modal.nao(); },

      isDocs: s.view === 'docs',
      isDocsWizard: s.view === 'docsWizard',
      docBusca: s.docBusca,
      onDocBusca: e => this.setState({ docBusca: e.target.value }),
      listaPacotes: listaPacotes,
      pacotesVazio: listaPacotes.length === 0,

      docPassos: passosDoc.map((pp, i) => ({
        label: pp.label,
        barra: i <= idxDoc ? '#FF8D02' : '#D6D6DA',
        cor: i === idxDoc ? '#151515' : '#8A8A8A',
        onClick: () => this.setState({ docStep: pp.k })
      })),
      isDocInicio: s.docStep === 'inicio',
      isDocQualif: s.docStep === 'qualificacao',
      isDocTermo: s.docStep === 'termo' && termoDentro,
      isDocRevisar: s.docStep === 'revisar',
      temDocProximo: idxDoc < passosDoc.length - 1,
      docProximo: () => this.setState({ docStep: passosDoc[Math.min(passosDoc.length - 1, idxDoc + 1)].k }),
      docVoltar: () => (idxDoc > 0 ? this.setState({ docStep: passosDoc[idxDoc - 1].k }) : this.setState({ view: 'docs' })),

      dd: {
        nome: dd.nome, doc: dd.doc, endereco: dd.endereco, rg: dd.rg, profissao: dd.profissao,
        nacionalidade: dd.nacionalidade, estadoCivil: dd.estadoCivil,
        representante: dd.representante, repCpf: dd.repCpf, repCargo: dd.repCargo,
        valorMensal: dd.valorMensal, explicativo: dd.explicativo, simplificadora: dd.simplificadora,
        incProcuracao: dd.incProcuracao, incTermo: dd.incTermo, incContrato: dd.incContrato
      },
      docEhPJ: ehPJ,
      docTipoTexto: soDigitos(dd.doc).length === 14
        ? 'CNPJ detectado — o sistema vai gerar a procuração de pessoa jurídica.'
        : (soDigitos(dd.doc).length === 11
          ? 'CPF detectado — procuração de pessoa física.'
          : 'Digite 11 dígitos para CPF ou 14 para CNPJ.'),
      onDocNome: e => this.patchDoc('nome', e.target.value),
      onDocDoc: e => this.patchDoc('doc', e.target.value),
      onDocEndereco: e => this.patchDoc('endereco', e.target.value),
      onDocRg: e => this.patchDoc('rg', e.target.value),
      onDocProfissao: e => this.patchDoc('profissao', e.target.value),
      onDocNacionalidade: e => this.patchDoc('nacionalidade', e.target.value),
      onDocEstadoCivil: e => this.patchDoc('estadoCivil', e.target.value),
      onDocRepresentante: e => this.patchDoc('representante', e.target.value),
      onDocRepCpf: e => this.patchDoc('repCpf', e.target.value),
      onDocRepCargo: e => this.patchDoc('repCargo', e.target.value),
      onIncProcuracao: e => this.patchDoc('incProcuracao', e.target.checked),
      onIncTermo: e => this.patchDoc('incTermo', e.target.checked),
      onIncContrato: e => this.patchDoc('incContrato', e.target.checked),
      onValorMensal: e => this.patchDoc('valorMensal', e.target.value),
      onExplicativo: e => this.patchDoc('explicativo', e.target.value),
      onSimplificadora: e => this.patchDoc('simplificadora', e.target.value),
      temRepresentante: !!dd.representante,
      assinClienteBg: dd.assinaturaPor === 'cliente' ? '#fff' : 'transparent',
      assinClienteFg: dd.assinaturaPor === 'cliente' ? '#151515' : '#6B6B6B',
      assinRepBg: dd.assinaturaPor === 'representante' ? '#fff' : 'transparent',
      assinRepFg: dd.assinaturaPor === 'representante' ? '#151515' : '#6B6B6B',
      setAssinCliente: () => this.patchDoc('assinaturaPor', 'cliente'),
      setAssinRep: () => this.patchDoc('assinaturaPor', 'representante'),

      docAbas: docsGerados0.map(x => ({
        label: x.titulo,
        bg: x.chave === abaAtiva ? '#151515' : 'transparent',
        fg: x.chave === abaAtiva ? '#fff' : '#4A4A4A',
        onClick: () => this.setState({ docAba: x.chave })
      })),
      docsGerados: docsGerados0.map(x => ({
        paginas: x.paginas,
        display: x.chave === abaAtiva ? 'flex' : 'none'
      })),
      docScalerH: Math.round(nPaginas * 1123 * escala + Math.max(0, nPaginas - 1) * 18) + 'px',
      semDocumentos: docsGerados0.length === 0,

      docResumo: [
        { k: 'Cliente', v: dd.nome || '—' },
        { k: 'Documento', v: mascaraDoc(dd.doc) || '—' },
        { k: 'Tipo', v: ehPJ ? 'Pessoa jurídica' : 'Pessoa física' },
        { k: 'Representante', v: dd.representante ? dd.representante + (numeroDoc(dd.repCpf) ? ' (CPF ' + numeroDoc(dd.repCpf) + ')' : '') : '—' },
        { k: 'Assinatura', v: dd.assinaturaPor === 'representante' && dd.representante ? 'Do representante' : 'Do cliente' },
        { k: 'Documentos', v: docsGerados0.map(x => x.titulo).join(', ') || 'Nenhum' },
        { k: 'Data', v: dataExtenso(hoje()).replace('Recife, ', '') }
      ],
      baixarDocs: () => { this.salvarPacote(dd); this.imprimir(); },
      salvarDocs: () => { this.salvarPacote(dd); this.setState({ view: 'docs' }); this.flash('Pacote salvo.'); },

      isProps: s.view === 'props',
      isPropsWizard: s.view === 'propsWizard',
      totalPropostas: s.propostas.length,
      goProps: () => this.setState({ view: 'props' }),
      propBusca: s.propBusca,
      onPropBusca: e => this.setState({ propBusca: e.target.value }),
      listaPropostas: listaPropostas,
      propostasVazio: listaPropostas.length === 0,
      novaPropSistema: () => this.setState({ propDraft: this.novaPropostaObj('sistema'), view: 'propsWizard', propStep: 'capa', propAba: 'capa' }),
      novaPropCarregador: () => this.setState({ propDraft: this.novaPropostaObj('carregador'), view: 'propsWizard', propStep: 'capa', propAba: 'capa' }),
      novaPropServico: () => this.setState({ propDraft: this.novaPropostaObj('servico'), view: 'propsWizard', propStep: 'capa', propAba: 'capa' }),

      propPassos: passosProp.map((x, i) => ({
        label: x.label,
        barra: i <= idxProp ? '#FF8D02' : '#D6D6DA',
        cor: i === idxProp ? '#151515' : '#8A8A8A',
        onClick: () => this.setState({ propStep: x.k })
      })),
      isPropCapa: s.propStep === 'capa',
      isPropSecoes: s.propStep === 'secoes',
      isPropGarantias: s.propStep === 'garantias',
      isPropDim: s.propStep === 'dimensionamento',
      isPropEconomia: s.propStep === 'economia',
      isPropFinanciamento: s.propStep === 'financiamento',
      isPropCondicoes: s.propStep === 'condicoes',
      isPropRevisar: s.propStep === 'revisar',
      isPropServico: s.propStep === 'servico',
      isPropValores: s.propStep === 'valores',
      temPropProximo: idxProp < passosProp.length - 1,
      propVoltar: () => (idxProp > 0 ? this.setState({ propStep: passosProp[idxProp - 1].k }) : this.setState({ view: 'props' })),
      propProximo: () => {
        const proximo = passosProp[Math.min(passosProp.length - 1, idxProp + 1)].k;
        if (s.propStep === 'garantias' && garantiasMudaram) {
          this.setState({
            modal: {
              titulo: 'Guardar os novos prazos?',
              texto: 'Você mudou os prazos de garantia. Isso vale só para esta proposta ou passa a ser o padrão das próximas?',
              simLabel: 'Virar padrão',
              naoLabel: 'Só nesta proposta',
              sim: () => { this.setState({ garantiasPadrao: pp.garantias.map(x => Object.assign({}, x)), modal: null, propStep: proximo }); this.flash('Prazos salvos como padrão.'); },
              nao: () => this.setState({ modal: null, propStep: proximo })
            }
          });
          return;
        }
        if (s.propStep === 'economia' && rendMudou) {
          this.setState({
            modal: {
              titulo: 'Guardar os novos percentuais?',
              texto: 'Você mudou o rendimento do primeiro ano. Isso vale só para esta proposta ou passa a ser o padrão das próximas?',
              simLabel: 'Virar padrão',
              naoLabel: 'Só nesta proposta',
              sim: () => { this.setState({ rendPadrao: Object.assign({}, pp.rend), modal: null, propStep: proximo }); this.flash('Percentuais salvos como padrão.'); },
              nao: () => this.setState({ modal: null, propStep: proximo })
            }
          });
          return;
        }
        this.setState({ propStep: proximo });
      },

      pp: {
        cliente: pp.cliente, gerente: pp.gerente, potencia: pp.potencia, geracao: pp.geracao, areaUtil: pp.areaUtil,
        mostrarImagemDim: pp.mostrarImagemDim,
        incContracapa: pp.incContracapa, incPortfolio: pp.incPortfolio, incClientes: pp.incClientes, incEconomia: pp.incEconomia, incFinanciamento: incFin,
        finBanco: pp.finBanco === undefined ? 'BANCO BV' : pp.finBanco,
        payback: pp.payback, validadeDias: pp.validadeDias,
        aVista: pp.aVista, valorVista: pp.valorVista,
        cartao: pp.cartao, valorCartao: pp.valorCartao,
        outraAtiva: pp.outraAtiva, outraRotulo: pp.outraRotulo, valorOutra: pp.valorOutra,
        poupanca: pp.rend.poupanca, rendaFixa: pp.rend.rendaFixa, solar: pp.rend.solar,
        numDocumento: pp.numDocumento, estado: pp.estado, descricaoAtividades: pp.descricaoAtividades
      },
      propEhSistema: ehSistema,
      propTipoLabel: ehSistema ? 'Sistema solar' : (pp.tipo === 'carregador' ? 'Carregador veicular' : 'Serviço diverso'),
      onPropCliente: e => this.patchProp('cliente', e.target.value),
      onPropPotencia: e => this.patchProp('potencia', e.target.value),
      onPropGeracao: e => this.patchProp('geracao', e.target.value),
      onPropArea: e => this.patchProp('areaUtil', e.target.value),
      onPropPayback: e => this.patchProp('payback', e.target.value),
      onPropValidade: e => this.patchProp('validadeDias', e.target.value),
      onPropNumDoc: e => this.patchProp('numDocumento', e.target.value),
      onPropEstado: e => this.patchProp('estado', e.target.value),
      onPropDescricao: e => this.patchProp('descricaoAtividades', e.target.value),
      onIncContracapa: e => this.patchProp('incContracapa', e.target.checked),
      onIncPortfolio: e => this.patchProp('incPortfolio', e.target.checked),
      onIncClientes: e => this.patchProp('incClientes', e.target.checked),
      onIncEconomia: e => this.patchProp('incEconomia', e.target.checked),
      onIncFinanciamento: e => this.patchProp('incFinanciamento', e.target.checked),
      onFinBanco: e => this.patchProp('finBanco', e.target.value),
      finEdit: finOpcoes.map((op, i) => ({
        titulo: 'Opção ' + (i + 1),
        carencia: op.carencia, entrada: op.entrada, parcelas: op.parcelas, valor: op.valor,
        onCarencia: e => patchFin(i, 'carencia', e.target.value),
        onEntrada: e => patchFin(i, 'entrada', e.target.value),
        onParcelas: e => patchFin(i, 'parcelas', e.target.value),
        onValor: e => patchFin(i, 'valor', e.target.value),
        onRemover: () => this.patchProp('finOpcoes', finOpcoes.filter((x, j) => j !== i))
      })),
      addFinOpcao: () => this.patchProp('finOpcoes', finOpcoes.concat([{ carencia: '90', entrada: '0,00', parcelas: '', valor: '' }])),
      finDoc: finOpcoes.map((op, i) => ({
        titulo: 'Opção ' + (i + 1),
        carencia: op.carencia,
        entrada: 'R$ ' + moedaBr(op.entrada),
        parcelas: (op.parcelas || '—') + 'x',
        valor: 'R$ ' + moedaBr(op.valor)
      })),
      docFinBanco: (pp.finBanco === undefined ? 'BANCO BV' : pp.finBanco) || 'BANCO',
      onImagemDim: e => this.patchProp('mostrarImagemDim', e.target.checked),
      onAVista: e => this.patchProp('aVista', e.target.checked),
      onValorVista: e => this.patchProp('valorVista', e.target.value),
      onCartao: e => this.patchProp('cartao', e.target.checked),
      onValorCartao: e => this.patchProp('valorCartao', e.target.value),
      onOutraAtiva: e => this.patchProp('outraAtiva', e.target.checked),
      onOutraRotulo: e => this.patchProp('outraRotulo', e.target.value),
      onValorOutra: e => this.patchProp('valorOutra', e.target.value),
      onRendPoupanca: e => this.patchProp('rend', Object.assign({}, pp.rend, { poupanca: e.target.value })),
      onRendFixa: e => this.patchProp('rend', Object.assign({}, pp.rend, { rendaFixa: e.target.value })),
      onRendSolar: e => this.patchProp('rend', Object.assign({}, pp.rend, { solar: e.target.value })),

      gerentes: s.gerentes.map(g => ({ nome: g })),
      onGerente: e => this.patchProp('gerente', e.target.value),
      novoGerente: s.novoGerente,
      onNovoGerente: e => this.setState({ novoGerente: e.target.value }),
      addGerente: () => {
        const nome = s.novoGerente.trim();
        if (!nome || s.gerentes.indexOf(nome) > -1) return;
        this.setState({ gerentes: s.gerentes.concat([nome]), novoGerente: '' });
        this.patchProp('gerente', nome);
        this.flash('Gerente adicionado.');
      },

      garantiasEdit: pp.garantias.map((g, i) => ({
        label: g.label,
        prazo: g.prazo,
        onPrazo: e => {
          const v = e.target.value;
          this.patchProp('garantias', pp.garantias.map((x, j) => (j === i ? Object.assign({}, x, { prazo: v }) : x)));
        }
      })),
      garantiasDoc: pp.garantias.map(g => ({ texto: g.label + ' - ' + g.prazo, grupo: g.grupo, temGrupo: !!g.grupo })),

      itensEdit: (pp.itens || []).map((it, i) => ({
        tipo: it.tipo, modelo: it.modelo, qtd: it.qtd,
        onTipo: e => { const v = e.target.value; this.patchProp('itens', pp.itens.map((x, j) => (j === i ? Object.assign({}, x, { tipo: v }) : x))); },
        onModelo: e => { const v = e.target.value; this.patchProp('itens', pp.itens.map((x, j) => (j === i ? Object.assign({}, x, { modelo: v }) : x))); },
        onQtd: e => { const v = e.target.value; this.patchProp('itens', pp.itens.map((x, j) => (j === i ? Object.assign({}, x, { qtd: v }) : x))); },
        onRemover: () => this.patchProp('itens', pp.itens.filter((x, j) => j !== i))
      })),
      tiposItem: TIPOS_ITEM.map(t => ({ valor: t })),
      addItem: () => this.patchProp('itens', (pp.itens || []).concat([{ tipo: 'Componentes', modelo: '', qtd: '1' }])),
      itensDoc: (pp.itens || []).map(it => ({ tipo: it.tipo, modelo: it.modelo, qtd: it.qtd })),

      servicoEdit: (pp.itensServico || []).map((it, i) => ({
        descricao: it.descricao, valor: it.valor,
        onDescricao: e => { const v = e.target.value; this.patchProp('itensServico', pp.itensServico.map((x, j) => (j === i ? Object.assign({}, x, { descricao: v }) : x))); },
        onValor: e => { const v = e.target.value; this.patchProp('itensServico', pp.itensServico.map((x, j) => (j === i ? Object.assign({}, x, { valor: v }) : x))); },
        onRemover: () => this.patchProp('itensServico', pp.itensServico.filter((x, j) => j !== i))
      })),
      addServico: () => this.patchProp('itensServico', (pp.itensServico || []).concat([{ descricao: '', valor: '' }])),
      servicoDoc: (pp.itensServico || []).map(it => ({ descricao: it.descricao, valor: 'R$ ' + moedaBr(it.valor) })),
      totalServicoStr: 'R$ ' + moedaBr(String(totalServico).replace('.', ',')),

      propAbas: abasProp.map(x => ({
        label: x.label,
        bg: x.k === abaProp ? '#151515' : 'transparent',
        fg: x.k === abaProp ? '#fff' : '#4A4A4A',
        onClick: () => this.setState({ propAba: x.k })
      })),
      showCapa: s.imprimindo || abaProp === 'capa',
      showContracapa: s.imprimindo ? (ehSistema && !!pp.incContracapa) : abaProp === 'contracapa',
      showPortfolio: s.imprimindo ? (ehSistema && !!pp.incPortfolio) : abaProp === 'portfolio',
      showClientes: s.imprimindo ? (ehSistema && !!pp.incClientes) : abaProp === 'clientes',
      showDim: s.imprimindo ? ehSistema : abaProp === 'dimensionamento',
      showEconomia: s.imprimindo ? (ehSistema && !!pp.incEconomia) : abaProp === 'economia',
      showFinanciamento: s.imprimindo ? (ehSistema && incFin) : abaProp === 'financiamento',
      showCondicoes: ehSistema && (s.imprimindo || abaProp === 'condicoes'),
      showInstitucional: !ehSistema && (s.imprimindo || abaProp === 'institucional'),
      showServico: !ehSistema && (s.imprimindo || abaProp === 'servico'),
      showConsideracoes: !ehSistema && (s.imprimindo || abaProp === 'condicoes'),
      propEhServico: !ehSistema,
      propScalerH: Math.round(1123 * escala) + 'px',

      capaFundo: ehSistema ? "url('assets/capa-solar.png')" : "url('assets/capa-carregador.png')",
      capaLinha1: ehSistema ? 'Proposta do Sistema' : 'Energia Renovável e',
      capaLinha2: ehSistema ? pp.potencia + ' kWp' : 'Mobilidade Elétrica',
      docCliente: pp.cliente || 'Nome do cliente',
      docClienteCaps: (pp.cliente || 'Nome do cliente').toUpperCase(),
      docGerente: pp.gerente,
      docPotencia: pp.potencia + ' kWp',
      docGeracao: pp.geracao + ' kWh/mês',
      docArea: pp.areaUtil + 'm²',
      docFluxo: fluxoCaixa,
      docPayback: pp.payback,
      docPoupanca: pp.rend.poupanca,
      docRendaFixa: pp.rend.rendaFixa,
      docSolar: pp.rend.solar,
      barPoupanca: barra(rendNums.poupanca),
      barRendaFixa: barra(rendNums.rendaFixa),
      barSolar: barra(rendNums.solar),
      docValidade: pp.validadeDias + ' dias corridos',
      docDataCurta: dataCurtaBr,
      docDataExtenso: dataPorExtenso,
      docValorVista: 'R$ ' + moedaBr(pp.valorVista),
      docValorCartao: 'R$ ' + moedaBr(pp.valorCartao),
      docValorOutra: 'R$ ' + moedaBr(pp.valorOutra),
      docOutraRotulo: (pp.outraRotulo || 'OUTRA CONDIÇÃO').toUpperCase(),
      docNumDocumento: pp.numDocumento || '—',
      docEstado: pp.estado,
      docDescricao: pp.descricaoAtividades || 'Descrição do serviço a ser executado.',
      temAVista: !!pp.aVista,
      temCartao: !!pp.cartao,
      temOutra: !!pp.outraAtiva,
      temImagemDim: !!pp.mostrarImagemDim,
      incContracapaDoc: !!pp.incContracapa,
      incPortfolioDoc: !!pp.incPortfolio,
      incClientesDoc: !!pp.incClientes,
      incEconomiaDoc: !!pp.incEconomia,

      propResumo: [
        { k: 'Tipo', v: ehSistema ? 'Sistema solar' : (pp.tipo === 'carregador' ? 'Carregador veicular' : 'Serviço diverso') },
        { k: 'Cliente', v: pp.cliente || '—' },
        { k: 'Gerente comercial', v: pp.gerente },
        { k: ehSistema ? 'Potência' : 'Itens', v: ehSistema ? pp.potencia + ' kWp' : String((pp.itensServico || []).length) },
        { k: 'Valor', v: ehSistema ? 'R$ ' + moedaBr(pp.valorVista) : 'R$ ' + moedaBr(String(totalServico).replace('.', ',')) },
        { k: 'Validade', v: pp.validadeDias + ' dias corridos' },
        { k: 'Data', v: dataCurtaBr }
      ],
      baixarProposta: () => { this.salvarProposta(pp); this.imprimirProposta(); },
      salvarPropostaBtn: () => { this.salvarProposta(pp); this.setState({ view: 'props' }); this.flash('Proposta salva.'); },

      temToast: !!s.toast,
      toast: s.toast
    };
  }

  render() {
    if (!this.state.montado) return null;
    const v = this.renderVals();
    return (
      <>
        {v.isLista && <Lista v={v} />}
        {v.isLote && <Lote v={v} />}
        {v.isWizard && <Wizard v={v} previewRef={this.setPreviewEl} />}
        {v.isDocs && <Docs v={v} />}
        {v.isDocsWizard && <DocsWizard v={v} />}
        {v.isProps && <Props v={v} />}
        {v.isPropsWizard && <PropsWizard v={v} />}
        {v.temModal && <Modal v={v} />}
        {v.temToast && <Toast v={v} />}
      </>
    );
  }
}


export default function Editor({ modulo }: { modulo: Modulo }) {
  const router = useRouter();
  return <EditorClass modulo={modulo} onHome={() => router.push("/")} />;
}

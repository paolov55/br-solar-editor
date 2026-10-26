/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
import { Fragment } from "react";
import { ImageSlot } from "../ImageSlot";
import type { Vals } from "../types";

export function PropsWizard({ v }: { v: Vals }) {
  return (
    <main style={{ flex: "1", display: "flex", flexWrap: "wrap", alignItems: "flex-start" }}>
      <section className="no-print" style={{ flex: "1 1 420px", minWidth: "320px", padding: "24px 24px 90px", maxWidth: "620px", margin: "0 auto" }}>
        <button className="hv1" onClick={v.goProps} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", fontSize: "14px", padding: "0 0 14px", display: "flex", alignItems: "center", gap: "6px" }}>← Propostas</button>
        <div style={{ fontSize: "12px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#FF8D02", fontWeight: "700", marginBottom: "10px" }}>{v.propTipoLabel}</div>
        <div style={{ display: "flex", gap: "5px", marginBottom: "26px" }}>
          {(v.propPassos as any[]).map((p: any, i5: number) => (
            <Fragment key={i5}>
              <button onClick={p.onClick} style={{ flex: "1 1 0", minWidth: "0", cursor: "pointer", textAlign: "left", border: "none", background: "none", padding: "0" }}>
                <div style={{ height: "4px", borderRadius: "3px", background: p.barra }}></div>
                <div style={{ fontSize: "11px", fontWeight: "600", marginTop: "7px", color: p.cor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={p.label}>{p.label}</div>
              </button>
            </Fragment>
          ))}
        </div>
        {v.isPropCapa && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "32px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Capa</h2>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                Nome do cliente
                <input value={v.pp.cliente ?? ""} onChange={v.onPropCliente} placeholder="Nome que aparece na capa" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                Gerente comercial
                <select value={v.pp.gerente ?? ""} onChange={v.onGerente} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", background: "#fff", outline: "none" }}>
                  {(v.gerentes as any[]).map((g: any, i9: number) => (
                    <Fragment key={i9}>
                      <option value={g.nome}>{g.nome}</option>
                    </Fragment>
                  ))}
                </select>
              </label>
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                <label style={{ flex: "1", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                  Adicionar outro gerente
                  <input value={v.novoGerente ?? ""} onChange={v.onNovoGerente} placeholder="Nome completo" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                </label>
                <button className="hv5" onClick={v.addGerente} style={{ cursor: "pointer", background: "#F3F3F5", border: "1px solid #E2E2E5", borderRadius: "9px", padding: "11px 16px", fontSize: "14.5px", fontWeight: "600" }}>Adicionar</button>
              </div>
            </div>
            {v.propEhSistema && (
              <div style={{ fontSize: "13.5px", color: "#8A8A8A", lineHeight: "1.4" }}>A potência que aparece na capa vem do passo Sistema.</div>
            )}
          </div>
        )}
        {v.isPropSecoes && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "32px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Seções da proposta</h2>
            <p style={{ margin: "-10px 0 0", color: "#666", fontSize: "15px" }}>Capa, Sistema e Condições comerciais são obrigatórias.</p>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "13px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                <input type="checkbox" checked={!!(v.pp.incContracapa)} onChange={v.onIncContracapa} style={{ width: "18px", height: "18px", accentColor: "#FF8D02", cursor: "pointer" }} />
                Contracapa — propósito, benefícios e como funciona
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                <input type="checkbox" checked={!!(v.pp.incPortfolio)} onChange={v.onIncPortfolio} style={{ width: "18px", height: "18px", accentColor: "#FF8D02", cursor: "pointer" }} />
                Portfólio e garantias
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                <input type="checkbox" checked={!!(v.pp.incClientes)} onChange={v.onIncClientes} style={{ width: "18px", height: "18px", accentColor: "#FF8D02", cursor: "pointer" }} />
                Clientes
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                <input type="checkbox" checked={!!(v.pp.incEconomia)} onChange={v.onIncEconomia} style={{ width: "18px", height: "18px", accentColor: "#FF8D02", cursor: "pointer" }} />
                Economia gerada com o projeto
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                <input type="checkbox" checked={!!(v.pp.incFinanciamento)} onChange={v.onIncFinanciamento} style={{ width: "18px", height: "18px", accentColor: "#FF8D02", cursor: "pointer" }} />
                Financiamento
              </label>
            </div>
          </div>
        )}
        {v.isPropGarantias && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "32px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Garantias</h2>
            <p style={{ margin: "-10px 0 0", color: "#666", fontSize: "15px" }}>Mudou algum prazo? No fim do passo eu pergunto se vira padrão.</p>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {(v.garantiasEdit as any[]).map((g: any, i7: number) => (
                <Fragment key={i7}>
                  <label style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14.5px", fontWeight: "600" }}>
                    <span style={{ flex: "1", minWidth: "0" }}>{g.label}</span>
                    <input value={g.prazo ?? ""} onChange={g.onPrazo} style={{ width: "150px", border: "1px solid #DDD", borderRadius: "9px", padding: "9px 11px", fontSize: "15px", outline: "none" }} />
                  </label>
                </Fragment>
              ))}
            </div>
          </div>
        )}
        {v.isPropDim && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "32px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Dimensionamento</h2>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexWrap: "wrap", gap: "14px" }}>
              <label style={{ flex: "1", minWidth: "120px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                Potência (kWp)
                <input value={v.pp.potencia ?? ""} onChange={v.onPropPotencia} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "17px", fontWeight: "700", outline: "none" }} />
              </label>
              <label style={{ flex: "1", minWidth: "120px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                Geração (kWh/mês)
                <input value={v.pp.geracao ?? ""} onChange={v.onPropGeracao} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "17px", fontWeight: "700", outline: "none" }} />
              </label>
              <label style={{ flex: "1", minWidth: "120px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                Área útil (m²)
                <input value={v.pp.areaUtil ?? ""} onChange={v.onPropArea} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "17px", fontWeight: "700", outline: "none" }} />
              </label>
            </div>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "13px", color: "#666", fontWeight: "600" }}>Equipamentos e serviços</div>
              {(v.itensEdit as any[]).map((it: any, i7: number) => (
                <Fragment key={i7}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", borderBottom: "1px solid #F0F0F2", paddingBottom: "12px" }}>
                    <select value={it.tipo ?? ""} onChange={it.onTipo} style={{ flex: "1", minWidth: "150px", border: "1px solid #DDD", borderRadius: "9px", padding: "9px 10px", fontSize: "14px", background: "#fff", outline: "none" }}>
                      {(v.tiposItem as any[]).map((t: any, i11: number) => (
                        <Fragment key={i11}>
                          <option value={t.valor}>{t.valor}</option>
                        </Fragment>
                      ))}
                    </select>
                    <input value={it.modelo ?? ""} onChange={it.onModelo} placeholder="Modelo" style={{ flex: "2", minWidth: "160px", border: "1px solid #DDD", borderRadius: "9px", padding: "9px 10px", fontSize: "14px", outline: "none" }} />
                    <input value={it.qtd ?? ""} onChange={it.onQtd} style={{ width: "62px", border: "1px solid #DDD", borderRadius: "9px", padding: "9px 10px", fontSize: "14px", textAlign: "center", outline: "none" }} />
                    <button className="hv7" onClick={it.onRemover} style={{ cursor: "pointer", background: "none", border: "none", color: "#B03030", fontSize: "18px", padding: "4px 8px", fontWeight: "700" }}>×</button>
                  </div>
                </Fragment>
              ))}
              <button className="hv5" onClick={v.addItem} style={{ alignSelf: "flex-start", cursor: "pointer", background: "#F3F3F5", border: "1px solid #E2E2E5", borderRadius: "9px", padding: "9px 15px", fontSize: "14.5px", fontWeight: "600" }}>+ Adicionar item</button>
              <label style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "14px", color: "#444", fontWeight: "600", cursor: "pointer", borderTop: "1px solid #F0F0F2", paddingTop: "13px" }}>
                <input type="checkbox" checked={!!(v.pp.mostrarImagemDim)} onChange={v.onImagemDim} style={{ width: "17px", height: "17px", accentColor: "#FF8D02", cursor: "pointer" }} />
                Incluir a imagem do sistema abaixo da tabela
              </label>
            </div>
          </div>
        )}
        {v.isPropEconomia && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "32px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Economia</h2>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                Payback esperado
                <input value={v.pp.payback ?? ""} onChange={v.onPropPayback} placeholder="1 ano e 6 meses" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "17px", fontWeight: "700", outline: "none" }} />
              </label>
              <div style={{ fontSize: "13px", color: "#666", fontWeight: "600", borderTop: "1px solid #F0F0F2", paddingTop: "13px" }}>Rendimento no primeiro ano</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                <label style={{ flex: "1", minWidth: "100px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                  Poupança
                  <input value={v.pp.poupanca ?? ""} onChange={v.onRendPoupanca} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                </label>
                <label style={{ flex: "1", minWidth: "100px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                  Renda fixa
                  <input value={v.pp.rendaFixa ?? ""} onChange={v.onRendFixa} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                </label>
                <label style={{ flex: "1", minWidth: "100px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                  Solar
                  <input value={v.pp.solar ?? ""} onChange={v.onRendSolar} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                </label>
              </div>
              <div style={{ fontSize: "13px", color: "#8A8A8A", lineHeight: "1.4" }}>A tabela do topo desta seção usa o valor à vista em negativo nas duas células finais.</div>
            </div>
          </div>
        )}
        {v.isPropFinanciamento && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "32px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Financiamento</h2>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                Banco
                <input value={v.pp.finBanco ?? ""} onChange={v.onFinBanco} placeholder="BANCO BV" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
              </label>
            </div>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "13px", color: "#666", fontWeight: "600" }}>Opções de parcelamento</div>
              {(v.finEdit as any[]).map((op: any, i7: number) => (
                <Fragment key={i7}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "flex-end", borderBottom: "1px solid #F0F0F2", paddingBottom: "12px" }}>
                    <div style={{ width: "100%", fontSize: "14px", fontWeight: "700", color: "#151515" }}>{op.titulo}</div>
                    <label style={{ flex: "1", minWidth: "80px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                      Carência (dias)
                      <input value={op.carencia ?? ""} onChange={op.onCarencia} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "9px 10px", fontSize: "14px", outline: "none" }} />
                    </label>
                    <label style={{ flex: "1", minWidth: "90px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                      Entrada (R$)
                      <input value={op.entrada ?? ""} onChange={op.onEntrada} placeholder="0,00" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "9px 10px", fontSize: "14px", outline: "none", textAlign: "right" }} />
                    </label>
                    <label style={{ flex: "1", minWidth: "70px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                      Parcelas
                      <input value={op.parcelas ?? ""} onChange={op.onParcelas} placeholder="18" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "9px 10px", fontSize: "14px", outline: "none" }} />
                    </label>
                    <label style={{ flex: "1", minWidth: "100px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                      Prestação (R$)
                      <input value={op.valor ?? ""} onChange={op.onValor} placeholder="0,00" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "9px 10px", fontSize: "14px", outline: "none", textAlign: "right" }} />
                    </label>
                    <button className="hv7" onClick={op.onRemover} style={{ cursor: "pointer", background: "none", border: "none", color: "#B03030", fontSize: "18px", padding: "8px", fontWeight: "700" }}>×</button>
                  </div>
                </Fragment>
              ))}
              <button className="hv5" onClick={v.addFinOpcao} style={{ alignSelf: "flex-start", cursor: "pointer", background: "#F3F3F5", border: "1px solid #E2E2E5", borderRadius: "9px", padding: "9px 15px", fontSize: "14.5px", fontWeight: "600" }}>+ Adicionar opção</button>
              <div style={{ fontSize: "13px", color: "#8A8A8A", lineHeight: "1.4" }}>As notas sobre IOF e Score saem sempre abaixo da tabela.</div>
            </div>
          </div>
        )}
        {v.isPropServico && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "32px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Serviço</h2>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                <label style={{ flex: "1", minWidth: "150px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                  Nº do documento
                  <input value={v.pp.numDocumento ?? ""} onChange={v.onPropNumDoc} placeholder="202589039" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                </label>
                <label style={{ flex: "1", minWidth: "150px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                  Estado
                  <input value={v.pp.estado ?? ""} onChange={v.onPropEstado} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                </label>
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                Descrição de atividades
                <textarea rows={4} value={v.pp.descricaoAtividades ?? ""} onChange={v.onPropDescricao} placeholder="Projeto: inspeção em carregador veicular elétrico e troca de cabos do sistema." style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none", resize: "vertical", lineHeight: "1.4" }}></textarea>
              </label>
            </div>
          </div>
        )}
        {v.isPropValores && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "32px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Descrição de valores</h2>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {(v.servicoEdit as any[]).map((it: any, i7: number) => (
                <Fragment key={i7}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", borderBottom: "1px solid #F0F0F2", paddingBottom: "12px" }}>
                    <input value={it.descricao ?? ""} onChange={it.onDescricao} placeholder="Descrição do item" style={{ flex: "2", minWidth: "180px", border: "1px solid #DDD", borderRadius: "9px", padding: "9px 10px", fontSize: "14px", outline: "none" }} />
                    <input value={it.valor ?? ""} onChange={it.onValor} placeholder="0,00" style={{ width: "110px", border: "1px solid #DDD", borderRadius: "9px", padding: "9px 10px", fontSize: "14px", textAlign: "right", outline: "none" }} />
                    <button className="hv7" onClick={it.onRemover} style={{ cursor: "pointer", background: "none", border: "none", color: "#B03030", fontSize: "18px", padding: "4px 8px", fontWeight: "700" }}>×</button>
                  </div>
                </Fragment>
              ))}
              <button className="hv5" onClick={v.addServico} style={{ alignSelf: "flex-start", cursor: "pointer", background: "#F3F3F5", border: "1px solid #E2E2E5", borderRadius: "9px", padding: "9px 15px", fontSize: "14.5px", fontWeight: "600" }}>+ Adicionar item</button>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid #EEE", paddingTop: "12px" }}>
                <span style={{ fontWeight: "700" }}>Total</span>
                <strong style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "26px", fontWeight: "800", color: "#FF8D02" }}>{v.totalServicoStr}</strong>
              </div>
            </div>
          </div>
        )}
        {v.isPropCondicoes && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "32px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Condições comerciais</h2>
            {v.propEhSistema && (
              <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ fontSize: "13px", color: "#666", fontWeight: "600" }}>Formas de pagamento</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                  <label style={{ flex: "1", minWidth: "150px", display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                    <input type="checkbox" checked={!!(v.pp.aVista)} onChange={v.onAVista} style={{ width: "18px", height: "18px", accentColor: "#FF8D02", cursor: "pointer" }} />
                    À vista
                  </label>
                  <input value={v.pp.valorVista ?? ""} onChange={v.onValorVista} placeholder="0,00" style={{ width: "140px", border: "1px solid #DDD", borderRadius: "9px", padding: "10px 12px", fontSize: "15px", textAlign: "right", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                  <label style={{ flex: "1", minWidth: "150px", display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                    <input type="checkbox" checked={!!(v.pp.cartao)} onChange={v.onCartao} style={{ width: "18px", height: "18px", accentColor: "#FF8D02", cursor: "pointer" }} />
                    Cartão de crédito
                  </label>
                  <input value={v.pp.valorCartao ?? ""} onChange={v.onValorCartao} placeholder="0,00" style={{ width: "140px", border: "1px solid #DDD", borderRadius: "9px", padding: "10px 12px", fontSize: "15px", textAlign: "right", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                    <input type="checkbox" checked={!!(v.pp.outraAtiva)} onChange={v.onOutraAtiva} style={{ width: "18px", height: "18px", accentColor: "#FF8D02", cursor: "pointer" }} />
                    Outra
                  </label>
                  <input value={v.pp.outraRotulo ?? ""} onChange={v.onOutraRotulo} placeholder="Ex: 12x no boleto" style={{ flex: "1", minWidth: "140px", border: "1px solid #DDD", borderRadius: "9px", padding: "10px 12px", fontSize: "15px", outline: "none" }} />
                  <input value={v.pp.valorOutra ?? ""} onChange={v.onValorOutra} placeholder="0,00" style={{ width: "140px", border: "1px solid #DDD", borderRadius: "9px", padding: "10px 12px", fontSize: "15px", textAlign: "right", outline: "none" }} />
                </div>
              </div>
            )}
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "flex-end" }}>
              <label style={{ flex: "1", minWidth: "150px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                Validade (dias corridos)
                <input value={v.pp.validadeDias ?? ""} onChange={v.onPropValidade} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
              </label>
              <div style={{ flex: "1", minWidth: "150px", fontSize: "13.5px", color: "#8A8A8A", lineHeight: "1.4" }}>A data de emissão é sempre a data em que a proposta é gerada:{" "}{v.docDataCurta}.</div>
            </div>
          </div>
        )}
        {v.isPropRevisar && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "32px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Revisar e exportar</h2>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "11px" }}>
              {(v.propResumo as any[]).map((r: any, i7: number) => (
                <Fragment key={i7}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", fontSize: "15px", borderBottom: "1px solid #F0F0F2", paddingBottom: "9px" }}>
                    <span style={{ color: "#777" }}>{r.k}</span>
                    <strong style={{ fontWeight: "700", textAlign: "right" }}>{r.v}</strong>
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button className="hv3" onClick={v.baixarProposta} style={{ cursor: "pointer", background: "#FF8D02", color: "#151515", border: "none", borderRadius: "10px", padding: "14px 22px", fontSize: "16px", fontWeight: "700" }}>Baixar PDF</button>
              <button className="hv8" onClick={v.salvarPropostaBtn} style={{ cursor: "pointer", background: "#fff", border: "1px solid #DDD", borderRadius: "10px", padding: "14px 22px", fontSize: "16px", fontWeight: "600" }}>Salvar e voltar</button>
            </div>
          </div>
        )}
        {v.isNarrow && (
          <button className="hv8" onClick={v.togglePreview} style={{ width: "100%", marginTop: "22px", cursor: "pointer", background: "#fff", border: "1px dashed #C9C9CE", borderRadius: "10px", padding: "13px", fontSize: "15px", fontWeight: "600", color: "#444" }}>{v.previewBotao}</button>
        )}
        <div style={{ display: "flex", gap: "10px", marginTop: "26px" }}>
          <button className="hv8" onClick={v.propVoltar} style={{ cursor: "pointer", background: "#fff", border: "1px solid #DDD", borderRadius: "10px", padding: "12px 20px", fontSize: "15px", fontWeight: "600" }}>Voltar</button>
          {v.temPropProximo && (
            <button className="hv2" onClick={v.propProximo} style={{ cursor: "pointer", background: "#151515", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 24px", fontSize: "15px", fontWeight: "600" }}>Continuar</button>
          )}
        </div>
      </section>
      <section className="preview-col" style={{ flex: "1 1 480px", minWidth: "0", background: "#DEDEE2", padding: "20px", alignSelf: "stretch", overflow: "hidden", flexDirection: "column", alignItems: "center", gap: "14px", display: v.previewDisplay }}>
        <div className="no-print" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "5px", background: "#CACAD0", padding: "4px", borderRadius: "10px" }}>
          {(v.propAbas as any[]).map((ab: any, i5: number) => (
            <Fragment key={i5}>
              <button onClick={ab.onClick} style={{ cursor: "pointer", border: "none", borderRadius: "7px", padding: "7px 12px", fontSize: "13px", fontWeight: "700", background: ab.bg, color: ab.fg }}>{ab.label}</button>
            </Fragment>
          ))}
        </div>
        <div className="print-scaler" style={{ flex: "0 0 auto", width: v.scalerW, height: v.propScalerH }}>
          <div style={{ transformOrigin: "top left", display: "flex", flexDirection: "column", gap: "18px", transform: v.scaleCss }}>
            {v.showCapa && (
              <>
              {v.propEhSistema && (
                <div className="doc-page" style={{ position: "relative", width: "794px", height: "1123px", flex: "0 0 auto", backgroundColor: "#151515", backgroundImage: "url('/assets/capa-solar.png')", backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", boxShadow: "0 14px 40px rgba(0,0,0,0.22)", overflow: "hidden", fontFamily: "var(--font-barlow), sans-serif" }}>
                  <div style={{ position: "absolute", left: "72px", top: "576px", width: "512px", background: "rgba(0,0,0,0.55)", borderRadius: "28px", padding: "32px 36px", display: "flex", flexDirection: "column", gap: "26px", color: "#fff" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
                      <img src="/assets/prop/ico-proposta.png" alt="" style={{ width: "44px", height: "50px", objectFit: "contain", flex: "0 0 auto" }} />
                      <div style={{ minWidth: "0" }}>
                        <div style={{ fontSize: "23px", fontWeight: "500", lineHeight: "1.15" }}>{v.capaLinha1}</div>
                        <div style={{ fontSize: "26px", fontWeight: "700", lineHeight: "1.15" }}>{v.capaLinha2}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
                      <img src="/assets/prop/ico-cliente.png" alt="" style={{ width: "44px", height: "50px", objectFit: "contain", flex: "0 0 auto" }} />
                      <div style={{ minWidth: "0" }}>
                        <div style={{ fontSize: "23px", fontWeight: "500", lineHeight: "1.15" }}>Cliente</div>
                        <div style={{ fontSize: "26px", fontWeight: "700", lineHeight: "1.15", textWrap: "pretty" }}>{v.docCliente}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
                      <img src="/assets/prop/ico-gerente.png" alt="" style={{ width: "44px", height: "50px", objectFit: "contain", flex: "0 0 auto" }} />
                      <div style={{ minWidth: "0" }}>
                        <div style={{ fontSize: "23px", fontWeight: "500", lineHeight: "1.15" }}>Gerente Comercial</div>
                        <div style={{ fontSize: "26px", fontWeight: "700", lineHeight: "1.15" }}>{v.docGerente}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {v.propEhServico && (
                <div className="doc-page" style={{ position: "relative", width: "794px", height: "1123px", flex: "0 0 auto", backgroundColor: "#151515", backgroundImage: "url('/assets/capa-carregador.png')", backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", boxShadow: "0 14px 40px rgba(0,0,0,0.22)", overflow: "hidden", fontFamily: "var(--font-barlow), sans-serif" }}>
                  <div style={{ position: "absolute", left: "96px", top: "588px", width: "520px", background: "rgba(0,0,0,0.55)", borderRadius: "28px", padding: "32px 36px", display: "flex", flexDirection: "column", gap: "26px", color: "#fff" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
                      <img src="/assets/prop/ico-proposta.png" alt="" style={{ width: "44px", height: "52px", objectFit: "contain", flex: "0 0 auto" }} />
                      <div style={{ minWidth: "0" }}>
                        <div style={{ fontSize: "24px", fontWeight: "500", lineHeight: "1.15" }}>{v.capaLinha1}</div>
                        <div style={{ fontSize: "27px", fontWeight: "700", lineHeight: "1.15" }}>{v.capaLinha2}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
                      <img src="/assets/prop/ico-cliente.png" alt="" style={{ width: "44px", height: "52px", objectFit: "contain", flex: "0 0 auto" }} />
                      <div style={{ minWidth: "0" }}>
                        <div style={{ fontSize: "24px", fontWeight: "500", lineHeight: "1.15" }}>Cliente</div>
                        <div style={{ fontSize: "27px", fontWeight: "700", lineHeight: "1.15", textWrap: "pretty" }}>{v.docCliente}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
                      <img src="/assets/prop/ico-gerente.png" alt="" style={{ width: "44px", height: "52px", objectFit: "contain", flex: "0 0 auto" }} />
                      <div style={{ minWidth: "0" }}>
                        <div style={{ fontSize: "24px", fontWeight: "500", lineHeight: "1.15" }}>Gerente Comercial</div>
                        <div style={{ fontSize: "27px", fontWeight: "700", lineHeight: "1.15" }}>{v.docGerente}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </>
            )}
            {v.showContracapa && (
              <div className="doc-page" style={{ position: "relative", width: "794px", height: "1123px", flex: "0 0 auto", backgroundColor: "#fff", backgroundImage: "url('/assets/fundo-proposta.png')", backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", boxShadow: "0 14px 40px rgba(0,0,0,0.22)", overflow: "hidden", fontFamily: "var(--font-barlow), sans-serif", color: "#151515" }}>
                <div style={{ position: "absolute", top: "96px", left: "73px", right: "80px", bottom: "50px", display: "flex", flexDirection: "column" }}>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "22px", fontWeight: "700", letterSpacing: "0.02em", padding: "7px 30px", borderRadius: "7px" }}>NOSSO PROPÓSITO</span>
                  </div>
                  <p style={{ margin: "18px 0 0", fontSize: "16px", lineHeight: "1.32", textAlign: "center", fontStyle: "italic", color: "#2A2A2A" }}>
                    “Em um mundo repleto de tecnologias e novidades, precisamos nos reinventar a todo momento. As suas escolhas refletem diretamente em sua vida, em seu negócio, no meio ambiente e no mundo. O maior objetivo da{" "}
                    <strong style={{ fontStyle: "normal", fontWeight: "700" }}>BR SOLAR</strong>
                    {" "}é encontrar a melhor alternativa para você. Juntos, vamos revolucionar o seu empreendimento!”
                  </p>
                  <div style={{ marginTop: "12px", textAlign: "right" }}>
                    <div style={{ fontSize: "16px", fontWeight: "700" }}>Breno Rufino</div>
                    <div style={{ fontSize: "13px", color: "#555" }}>CEO BR SOLAR</div>
                  </div>
                  <div style={{ marginTop: "24px", textAlign: "center" }}>
                    <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "22px", fontWeight: "700", letterSpacing: "0.02em", padding: "7px 30px", borderRadius: "7px" }}>BENEFÍCIOS DA BR SOLAR</span>
                  </div>
                  <div style={{ marginTop: "16px", background: "#151515", borderRadius: "20px", padding: "24px 26px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", color: "#fff" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <img src="/assets/prop/ico-rapidez.png" alt="" style={{ height: "50px", width: "auto", objectFit: "contain" }} />
                      <div style={{ fontSize: "14.5px", fontWeight: "600", textAlign: "center", lineHeight: "1.25" }}>Rapidez na entrega e execução de projetos</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <img src="/assets/prop/ico-excelencia.png" alt="" style={{ height: "50px", width: "auto", objectFit: "contain" }} />
                      <div style={{ fontSize: "14.5px", fontWeight: "600", textAlign: "center", lineHeight: "1.25" }}>Excelência em qualidade de produtos e serviços</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <img src="/assets/prop/ico-economia.png" alt="" style={{ height: "50px", width: "auto", objectFit: "contain" }} />
                      <div style={{ fontSize: "14.5px", fontWeight: "600", textAlign: "center", lineHeight: "1.25" }}>Economia de até 95% na sua conta</div>
                    </div>
                  </div>
                  <div style={{ flex: "1", minHeight: "22px" }}></div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "22px", fontWeight: "700", letterSpacing: "0.02em", padding: "7px 30px", borderRadius: "7px" }}>ALGUNS DE NOSSOS CLIENTES</span>
                  </div>
                  <div style={{ marginTop: "18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "18px" }}>
                    <img src="/assets/prop/logo-casa-porto.png" alt="Casa Porto" style={{ height: "62px", width: "auto", objectFit: "contain" }} />
                    <img src="/assets/prop/logo-efas.png" alt="Escola Efas" style={{ height: "58px", width: "auto", objectFit: "contain" }} />
                    <img src="/assets/prop/logo-paletizar.png" alt="Paletizar" style={{ height: "54px", width: "auto", objectFit: "contain" }} />
                    <img src="/assets/prop/logo-belo-vale.png" alt="Belo Vale Pneus" style={{ height: "30px", width: "auto", objectFit: "contain" }} />
                    <img src="/assets/prop/logo-fruta-pao.png" alt="Fruta Pão" style={{ height: "62px", width: "auto", objectFit: "contain" }} />
                    <img src="/assets/prop/logo-abc.png" alt="ABC Borracha" style={{ height: "46px", width: "auto", objectFit: "contain" }} />
                  </div>
                  <div style={{ flex: "1", minHeight: "22px" }}></div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "22px", fontWeight: "700", letterSpacing: "0.02em", padding: "7px 30px", borderRadius: "7px" }}>COMO FUNCIONA A ENERGIA SOLAR?</span>
                  </div>
                  <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "262px 1fr", gap: "22px", alignItems: "center" }}>
                    <img src="/assets/prop/diagrama.png" alt="Diagrama de funcionamento da energia solar" style={{ width: "262px", height: "auto", display: "block" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <span style={{ flex: "0 0 auto", width: "23px", height: "23px", borderRadius: "50%", background: "#151515", color: "#fff", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px" }}>A</span>
                        <div style={{ fontSize: "14px", lineHeight: "1.26" }}>
                          <strong style={{ fontWeight: "700" }}>Painéis Solares:</strong>
                          {" "}Os painéis instalados no telhado captam a energia do Sol e a transformam em energia elétrica.
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <span style={{ flex: "0 0 auto", width: "23px", height: "23px", borderRadius: "50%", background: "#151515", color: "#fff", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px" }}>B</span>
                        <div style={{ fontSize: "14px", lineHeight: "1.26" }}>
                          <strong style={{ fontWeight: "700" }}>Inversor:</strong>
                          {" "}Converte a energia elétrica gerada pelos painéis em um formato idêntico ao fornecido pela distribuidora de energia.
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <span style={{ flex: "0 0 auto", width: "23px", height: "23px", borderRadius: "50%", background: "#151515", color: "#fff", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px" }}>C</span>
                        <div style={{ fontSize: "14px", lineHeight: "1.26" }}>
                          <strong style={{ fontWeight: "700" }}>Quadro de Distribuição:</strong>
                          {" "}A energia é conectada ao quadro de distribuição para que possa ser utilizada em qualquer equipamento interno.
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <span style={{ flex: "0 0 auto", width: "23px", height: "23px", borderRadius: "50%", background: "#151515", color: "#fff", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px" }}>D</span>
                        <div style={{ fontSize: "14px", lineHeight: "1.26" }}>
                          <strong style={{ fontWeight: "700" }}>Medidor de Energia Bidirecional:</strong>
                          {" "}O medidor mede tanto o consumo do local como a energia injetada na rede.
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <span style={{ flex: "0 0 auto", width: "23px", height: "23px", borderRadius: "50%", background: "#151515", color: "#fff", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px" }}>E</span>
                        <div style={{ fontSize: "14px", lineHeight: "1.26" }}>
                          <strong style={{ fontWeight: "700" }}>Rede de Distribuição:</strong>
                          {" "}Absorve qualquer excedente de energia injetada e fornece energia à noite e nos momentos de geração baixa.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {v.showPortfolio && (
              <div className="doc-page" style={{ position: "relative", width: "794px", height: "1123px", flex: "0 0 auto", backgroundColor: "#fff", backgroundImage: "url('/assets/fundo-proposta.png')", backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", boxShadow: "0 14px 40px rgba(0,0,0,0.22)", overflow: "hidden", fontFamily: "var(--font-barlow), sans-serif", color: "#151515" }}>
                <div style={{ position: "absolute", top: "96px", left: "73px", right: "80px", bottom: "50px", display: "flex", flexDirection: "column" }}>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "22px", fontWeight: "700", letterSpacing: "0.02em", padding: "7px 30px", borderRadius: "7px" }}>NOSSOS PROJETOS</span>
                  </div>
                  <div style={{ marginTop: "18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <img src="/assets/prop/projeto-1.png" alt="Projeto Belo Vale Pneus" style={{ width: "100%", height: "152px", objectFit: "cover", borderRadius: "10px", display: "block" }} />
                      <img src="/assets/prop/projeto-3.png" alt="Projeto Belo Vale Pneus" style={{ width: "100%", height: "152px", objectFit: "cover", borderRadius: "10px", display: "block" }} />
                      <div style={{ fontSize: "13px", textAlign: "center", lineHeight: "1.3" }}>
                        <div style={{ fontWeight: "700" }}>156 painéis</div>
                        <div>Potência do sistema: 94 kWp</div>
                        <div style={{ color: "#555" }}>Belo Vale Pneus — Fábrica de pneus em Jaboatão dos Guararapes-PE</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <img src="/assets/prop/projeto-2.png" alt="Projeto Gravatá" style={{ width: "100%", height: "152px", objectFit: "cover", borderRadius: "10px", display: "block" }} />
                      <img src="/assets/prop/projeto-4.png" alt="Projeto Gravatá" style={{ width: "100%", height: "152px", objectFit: "cover", borderRadius: "10px", display: "block" }} />
                      <div style={{ fontSize: "13px", textAlign: "center", lineHeight: "1.3" }}>
                        <div style={{ fontWeight: "700" }}>238 painéis de 405 W</div>
                        <div>Potência do sistema: 96,36 kWp</div>
                        <div style={{ color: "#555" }}>Fábrica de garrafões em Gravatá-PE</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: "1", minHeight: "26px" }}></div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "22px", fontWeight: "700", letterSpacing: "0.02em", padding: "7px 30px", borderRadius: "7px" }}>DIFERENCIAIS BR SOLAR</span>
                  </div>
                  <p style={{ margin: "16px 0 0", fontSize: "17px", lineHeight: "1.3" }}>
                    <strong style={{ fontWeight: "700" }}>Soluções Financeiras — Financiamento:</strong>
                    {" "}Temos parcerias com diversos bancos como Santander, BV Financeira, Sol Fácil, Caixa, Sicoob, Itaú, Banco do Brasil, Sicredi, dentre outros.
                  </p>
                  <div style={{ marginTop: "12px", textAlign: "center", fontSize: "17px", fontWeight: "600" }}>Faça uma análise de sua taxa real com a gente.</div>
                  <div style={{ flex: "1", minHeight: "26px" }}></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "26px" }}>
                    <div>
                      <div>
                        <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "17px", fontWeight: "700", letterSpacing: "0.02em", padding: "6px 16px", borderRadius: "6px" }}>GARANTIAS INCLUSAS</span>
                      </div>
                      <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        {(v.garantiasDoc as any[]).map((g: any, i12: number) => (
                          <Fragment key={i12}>
                            <div>
                              {g.temGrupo && (
                                <div style={{ fontSize: "17px", fontWeight: "700" }}>{g.grupo}</div>
                              )}
                              <div style={{ fontSize: "17px" }}>{g.texto}</div>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                      <div style={{ marginTop: "16px", fontSize: "13px", lineHeight: "1.3", color: "#444" }}>
                        <strong style={{ fontWeight: "700" }}>OBS:</strong>
                        {" "}após 1 ano de instalação a garantia dos equipamentos é de responsabilidade dos fabricantes.
                      </div>
                    </div>
                    <div>
                      <div>
                        <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "17px", fontWeight: "700", letterSpacing: "0.02em", padding: "6px 16px", borderRadius: "6px" }}>COMO É GERADA SUA PROPOSTA?</span>
                      </div>
                      <p style={{ margin: "14px 0 0", fontSize: "17px", lineHeight: "1.3" }}>Nós calculamos a sua média de consumo energético mensal e, por meio de um software de engenharia, o número de placas necessárias para suprir a sua demanda.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {v.showClientes && (
              <div className="doc-page" style={{ position: "relative", width: "794px", height: "1123px", flex: "0 0 auto", backgroundColor: "#fff", backgroundImage: "url('/assets/fundo-proposta.png')", backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", boxShadow: "0 14px 40px rgba(0,0,0,0.22)", overflow: "hidden", fontFamily: "var(--font-barlow), sans-serif", color: "#151515" }}>
                <div style={{ position: "absolute", top: "96px", left: "73px", right: "80px", bottom: "50px", display: "flex", flexDirection: "column" }}>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "22px", fontWeight: "700", letterSpacing: "0.02em", padding: "7px 30px", borderRadius: "7px" }}>CLIENTE NA BR SOLAR FICA ASSIM</span>
                  </div>
                  <p style={{ margin: "18px 0 0", fontSize: "18px", lineHeight: "1.3", textAlign: "center" }}>
                    Satisfação garantida com nota{" "}
                    <strong style={{ fontWeight: "700" }}>5/5</strong>
                    {" "}na avaliação geral do Google. Cliente Feliz é{" "}
                    <strong style={{ fontWeight: "700" }}>BR SOLAR!</strong>
                  </p>
                  <div style={{ flex: "1", minHeight: "20px" }}></div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                    <img src="/assets/prop/cliente-1.png" alt="Cliente BR Solar" style={{ width: "100%", height: "226px", objectFit: "cover", borderRadius: "10px", display: "block" }} />
                    <img src="/assets/prop/cliente-2.png" alt="Cliente BR Solar" style={{ width: "100%", height: "226px", objectFit: "cover", borderRadius: "10px", display: "block" }} />
                    <img src="/assets/prop/cliente-3.png" alt="Cliente BR Solar" style={{ width: "100%", height: "226px", objectFit: "cover", borderRadius: "10px", display: "block" }} />
                    <img src="/assets/prop/cliente-4.png" alt="Cliente BR Solar" style={{ width: "100%", height: "226px", objectFit: "cover", borderRadius: "10px", display: "block" }} />
                    <img src="/assets/prop/cliente-5.png" alt="Cliente BR Solar" style={{ width: "100%", height: "226px", objectFit: "cover", borderRadius: "10px", display: "block" }} />
                    <img src="/assets/prop/cliente-6.png" alt="Cliente BR Solar" style={{ width: "100%", height: "226px", objectFit: "cover", borderRadius: "10px", display: "block" }} />
                    <img src="/assets/prop/cliente-7.png" alt="Cliente BR Solar" style={{ gridColumn: "2", width: "100%", height: "226px", objectFit: "cover", borderRadius: "10px", display: "block" }} />
                  </div>
                  <div style={{ flex: "1", minHeight: "20px" }}></div>
                </div>
              </div>
            )}
            {v.showDim && (
              <div className="doc-page" style={{ position: "relative", width: "794px", height: "1123px", flex: "0 0 auto", backgroundColor: "#fff", backgroundImage: "url('/assets/fundo-proposta.png')", backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", boxShadow: "0 14px 40px rgba(0,0,0,0.22)", overflow: "hidden", fontFamily: "var(--font-barlow), sans-serif", color: "#151515" }}>
                <div style={{ position: "absolute", top: "120px", left: "73px", right: "80px", bottom: "50px", display: "flex", flexDirection: "column" }}>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "22px", fontWeight: "700", letterSpacing: "0.02em", padding: "7px 30px", borderRadius: "7px" }}>DIMENSIONAMENTO DO SISTEMA</span>
                  </div>
                  <p style={{ margin: "22px 0 0", fontSize: "18px", lineHeight: "1.3", textAlign: "center" }}>O sistema foi dimensionado baseando-se em análise das imagens por satélite e adotando-se como premissa que a área disponível é adequada para a instalação.</p>
                  <div style={{ marginTop: "52px", background: "#151515", borderRadius: "22px", padding: "0 26px 28px", display: "flex", flexDirection: "column", color: "#fff" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px", textAlign: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "9px" }}>
                        <img src="/assets/prop/ico-potencia.png" alt="" style={{ width: "36px", height: "36px", objectFit: "contain", marginTop: "-18px" }} />
                        <div style={{ fontSize: "25px", fontWeight: "700", lineHeight: "1" }}>{v.docPotencia}</div>
                        <div style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em" }}>POTÊNCIA PROPOSTA</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "9px" }}>
                        <img src="/assets/prop/ico-geracao.png" alt="" style={{ width: "36px", height: "36px", objectFit: "contain", marginTop: "-18px" }} />
                        <div style={{ fontSize: "25px", fontWeight: "700", lineHeight: "1" }}>{v.docGeracao}</div>
                        <div style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em" }}>GERAÇÃO ESTIMADA</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "9px" }}>
                        <img src="/assets/prop/ico-area.png" alt="" style={{ width: "36px", height: "36px", objectFit: "contain", marginTop: "-18px" }} />
                        <div style={{ fontSize: "25px", fontWeight: "700", lineHeight: "1" }}>{v.docArea}</div>
                        <div style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em" }}>ÁREA ÚTIL</div>
                      </div>
                    </div>
                    <div style={{ marginTop: "30px", textAlign: "center" }}>
                      <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "17px", fontWeight: "700", letterSpacing: "0.02em", padding: "6px 22px", borderRadius: "6px" }}>PRINCIPAIS EQUIPAMENTOS E SERVIÇOS INCLUSOS</span>
                    </div>
                    <div style={{ marginTop: "18px", border: "1px solid rgba(255,255,255,0.22)", borderRadius: "10px", overflow: "hidden" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.6fr 0.6fr", background: "rgba(255,255,255,0.1)", fontSize: "13px", fontWeight: "700", letterSpacing: "0.06em" }}>
                        <div style={{ padding: "10px 14px" }}>ITEM</div>
                        <div style={{ padding: "10px 14px" }}>MODELO</div>
                        <div style={{ padding: "10px 14px", textAlign: "center" }}>QUANTIDADE</div>
                      </div>
                      {(v.itensDoc as any[]).map((it: any, i11: number) => (
                        <Fragment key={i11}>
                          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.6fr 0.6fr", borderTop: "1px solid rgba(255,255,255,0.16)", fontSize: "13.5px" }}>
                            <div style={{ padding: "11px 14px" }}>{it.tipo}</div>
                            <div style={{ padding: "11px 14px" }}>{it.modelo}</div>
                            <div style={{ padding: "11px 14px", textAlign: "center" }}>{it.qtd}</div>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  {v.temImagemDim && (
                    <>
                    <div style={{ height: "34px", flex: "0 0 auto" }}></div>
                    <ImageSlot id="prop-dim-imagem" placeholder="Gráfico Consumo x Geração (print da planilha)" radius={8} style={{ width: "100%", height: "226px" }} />
                    </>
                  )}
                </div>
              </div>
            )}
            {v.showEconomia && (
              <div className="doc-page" style={{ position: "relative", width: "794px", height: "1123px", flex: "0 0 auto", backgroundColor: "#fff", backgroundImage: "url('/assets/fundo-proposta.png')", backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", boxShadow: "0 14px 40px rgba(0,0,0,0.22)", overflow: "hidden", fontFamily: "var(--font-barlow), sans-serif", color: "#151515" }}>
                <div style={{ position: "absolute", top: "96px", left: "73px", right: "80px", bottom: "50px", display: "flex", flexDirection: "column" }}>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "22px", fontWeight: "700", letterSpacing: "0.02em", padding: "7px 30px", borderRadius: "7px" }}>ECONOMIA GERADA COM O PROJETO</span>
                  </div>
                  <div style={{ marginTop: "20px", position: "relative" }}>
                    <ImageSlot id="prop-tabela-fluxo" placeholder="Tabela de fluxo de caixa (print da planilha)" radius={8} style={{ width: "100%", height: "300px" }} />
                    <div style={{ position: "absolute", top: "84px", right: "21px", display: "flex", gap: "26px", fontSize: "14px", fontWeight: "700", color: "#151515" }}>
                      <span>{v.docFluxo}</span>
                      <span>{v.docFluxo}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: "28px", textAlign: "center" }}>
                    <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "22px", fontWeight: "700", letterSpacing: "0.02em", padding: "7px 30px", borderRadius: "7px" }}>ANÁLISE FINANCEIRA DO INVESTIMENTO</span>
                  </div>
                  <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "26px", alignItems: "stretch", flex: "1", minHeight: "0" }}>
                    <div style={{ background: "#151515", borderRadius: "20px", padding: "26px 24px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px", color: "#fff" }}>
                      <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "44px", fontWeight: "800", lineHeight: "1", color: "#FF8D02" }}>{v.docPayback}</div>
                      <div style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "0.04em" }}>PAYBACK</div>
                      <div style={{ fontSize: "12px", lineHeight: "1.35", color: "#D6D6D9", marginTop: "12px" }}>Payback significa quanto tempo você tem o retorno do valor investido uma vez que não paga mais energia.</div>
                    </div>
                    <div style={{ border: "1px solid #E2E2E5", borderRadius: "20px", padding: "18px 20px 14px", display: "flex", flexDirection: "column" }}>
                      <div style={{ textAlign: "center", fontSize: "19px", fontWeight: "700" }}>Rendimento no Primeiro Ano</div>
                      <div style={{ flex: "1", minHeight: "0", display: "flex", alignItems: "flex-end", justifyContent: "space-around", gap: "16px", borderBottom: "2px solid #151515", marginTop: "14px" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                          <div style={{ fontSize: "17px", fontWeight: "700" }}>{v.docPoupanca}</div>
                          <div style={{ width: "62px", background: "#C9C9CE", borderRadius: "5px 5px 0 0", height: v.barPoupanca }}></div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                          <div style={{ fontSize: "17px", fontWeight: "700" }}>{v.docRendaFixa}</div>
                          <div style={{ width: "62px", background: "#8A8A92", borderRadius: "5px 5px 0 0", height: v.barRendaFixa }}></div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                          <div style={{ fontSize: "17px", fontWeight: "700", color: "#C96A00" }}>{v.docSolar}</div>
                          <div style={{ width: "62px", background: "#FF8D02", borderRadius: "5px 5px 0 0", height: v.barSolar }}></div>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-around", gap: "16px", paddingTop: "8px", fontSize: "15px", fontWeight: "600" }}>
                        <span>Poupança</span>
                        <span>Renda Fixa</span>
                        <span>Solar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {v.showFinanciamento && (
              <div className="doc-page" style={{ position: "relative", width: "794px", height: "1123px", flex: "0 0 auto", backgroundColor: "#fff", backgroundImage: "url('/assets/fundo-proposta.png')", backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", boxShadow: "0 14px 40px rgba(0,0,0,0.22)", overflow: "hidden", fontFamily: "var(--font-barlow), sans-serif", color: "#151515" }}>
                <div style={{ position: "absolute", top: "192px", left: "80px", right: "82px", bottom: "50px", display: "flex", flexDirection: "column" }}>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "27px", fontWeight: "700", letterSpacing: "0.02em", padding: "7px 14px", borderRadius: "8px" }}>FINANCIAMENTO</span>
                  </div>
                  <div style={{ marginTop: "32px", borderTop: "2px solid #151515", borderLeft: "2px solid #151515" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "162fr 135fr 136fr 212fr", height: "68px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", borderRight: "2px solid #151515", borderBottom: "2px solid #151515", background: "#FF8D02", color: "#fff", fontSize: "24px", fontWeight: "600", padding: "0 8px" }}>{v.docFinBanco}</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", borderRight: "2px solid #151515", borderBottom: "2px solid #151515", fontSize: "18px", fontWeight: "700" }}>CARÊNCIA</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", borderRight: "2px solid #151515", borderBottom: "2px solid #151515", fontSize: "18px", fontWeight: "700" }}>ENTRADA</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", borderRight: "2px solid #151515", borderBottom: "2px solid #151515", fontSize: "18px", fontWeight: "700" }}>PRESTAÇÃO</div>
                    </div>
                    {(v.finDoc as any[]).map((op: any, i10: number) => (
                      <Fragment key={i10}>
                        <div style={{ display: "grid", gridTemplateColumns: "162fr 135fr 136fr 212fr", height: "73px", fontSize: "16px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", borderRight: "2px solid #151515", borderBottom: "2px solid #151515" }}>{op.titulo}</div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", borderRight: "2px solid #151515", borderBottom: "2px solid #151515" }}>{op.carencia}</div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", borderRight: "2px solid #151515", borderBottom: "2px solid #151515" }}>{op.entrada}</div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", borderRight: "2px solid #151515", borderBottom: "2px solid #151515", flexDirection: "column", lineHeight: "1.3" }}>
                            <span>{op.parcelas}</span>
                            <span>{op.valor}</span>
                          </div>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ marginTop: "30px", fontSize: "13px", fontStyle: "italic", lineHeight: "1.35" }}>
                    <div>¹Os valores podem sofrer alterações de acordo com o IOF</div>
                    <div>²Os valores podem sofrer alterações conforme o Score</div>
                  </div>
                </div>
              </div>
            )}
            {v.showCondicoes && (
              <div className="doc-page" style={{ position: "relative", width: "794px", height: "1123px", flex: "0 0 auto", backgroundColor: "#fff", backgroundImage: "url('/assets/fundo-proposta.png')", backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", boxShadow: "0 14px 40px rgba(0,0,0,0.22)", overflow: "hidden", fontFamily: "var(--font-barlow), sans-serif", color: "#151515" }}>
                <div style={{ position: "absolute", top: "100px", left: "78px", right: "80px", bottom: "44px", display: "flex", flexDirection: "column" }}>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "27px", fontWeight: "700", letterSpacing: "0.02em", padding: "10px 40px", borderRadius: "8px" }}>CONDIÇÕES COMERCIAIS</span>
                  </div>
                  <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "26px", alignItems: "center" }}>
                    {v.temAVista && (
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <div style={{ position: "absolute", left: "11px", top: "11px", right: "-11px", bottom: "-11px", background: "#151515", borderRadius: "12px" }}></div>
                        <div style={{ position: "relative", display: "inline-flex", alignItems: "baseline", gap: "18px", background: "#FF8D02", color: "#fff", borderRadius: "12px", padding: "18px 46px" }}>
                          <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "46px", fontWeight: "800", lineHeight: "1" }}>{v.docValorVista}</div>
                          <div style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "0.06em" }}>À VISTA</div>
                        </div>
                      </div>
                    )}
                    {v.temCartao && (
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <div style={{ position: "absolute", left: "11px", top: "11px", right: "-11px", bottom: "-11px", background: "#151515", borderRadius: "12px" }}></div>
                        <div style={{ position: "relative", display: "inline-flex", alignItems: "baseline", gap: "18px", background: "#FF8D02", color: "#fff", borderRadius: "12px", padding: "18px 46px" }}>
                          <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "46px", fontWeight: "800", lineHeight: "1" }}>{v.docValorCartao}</div>
                          <div style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "0.06em" }}>CARTÃO DE CRÉDITO</div>
                        </div>
                      </div>
                    )}
                    {v.temOutra && (
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <div style={{ position: "absolute", left: "11px", top: "11px", right: "-11px", bottom: "-11px", background: "#151515", borderRadius: "12px" }}></div>
                        <div style={{ position: "relative", display: "inline-flex", alignItems: "baseline", gap: "18px", background: "#FF8D02", color: "#fff", borderRadius: "12px", padding: "18px 46px" }}>
                          <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "46px", fontWeight: "800", lineHeight: "1" }}>{v.docValorOutra}</div>
                          <div style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "0.06em" }}>{v.docOutraRotulo}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: "46px", border: "1px solid #E2E2E5", borderLeft: "5px solid #FF8D02", borderRadius: "16px", padding: "30px 34px" }}>
                    <div style={{ fontSize: "25px", fontWeight: "700", letterSpacing: "0.04em" }}>VALIDADE</div>
                    <div style={{ marginTop: "10px", fontSize: "20px" }}>
                      Emissão da Proposta em{" "}
                      <strong style={{ fontWeight: "700" }}>{v.docDataCurta}</strong>
                    </div>
                    <p style={{ margin: "20px 0 0", fontSize: "20px", lineHeight: "1.5", textAlign: "justify" }}>
                      Esta proposta é válida em todos seus termos por{" "}
                      <strong style={{ fontWeight: "700" }}>{v.docValidade}</strong>
                      {" "}contados a partir da data de envio, sujeita a alterações após sua validade e após troca de mês vigente. Crédito sujeito a aprovação. Não inclui adaptações de padrão de entrada, laudo estrutural e adaptações de estrutura de telhado.
                    </p>
                    <div style={{ marginTop: "22px", fontSize: "20px" }}>
                      Jaboatão dos Guararapes,{" "}
                      <strong style={{ fontWeight: "700" }}>{v.docDataExtenso}</strong>
                    </div>
                  </div>
                  <div style={{ flex: "1", minHeight: "40px" }}></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "46px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ borderTop: "1px solid #151515", marginBottom: "7px" }}></div>
                      <div style={{ fontSize: "20px", fontWeight: "700" }}>BR SOLAR</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ borderTop: "1px solid #151515", marginBottom: "7px" }}></div>
                      <div style={{ fontSize: "20px", fontWeight: "700", lineHeight: "1.2", textWrap: "balance" }}>{v.docClienteCaps}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", borderTop: "1px solid #D8D8DC", paddingTop: "18px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
                        <img src="/assets/prop/ico-contato.png" alt="" style={{ width: "30px", height: "30px", objectFit: "contain" }} />
                        <div style={{ fontSize: "22px", fontWeight: "700" }}>CONTATO</div>
                      </div>
                      <div style={{ marginTop: "12px", fontSize: "17px", fontWeight: "700" }}>RESPONSÁVEL COMERCIAL</div>
                      <div style={{ fontSize: "15px", marginTop: "3px" }}>BRENO RUFINO</div>
                      <div style={{ fontSize: "15px" }}>(81) 9 8177-1818</div>
                      <div style={{ fontSize: "15px" }}>brenoferreirarufino@outlook.com</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "9px", marginTop: "12px" }}>
                        <img src="/assets/prop/ico-instagram.png" alt="" style={{ width: "19px", height: "19px", objectFit: "contain" }} />
                        <div style={{ fontSize: "15px", color: "#C96A00", fontWeight: "600" }}>@brsolar_energiasolar</div>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
                        <img src="/assets/prop/ico-localizacao.png" alt="" style={{ width: "30px", height: "30px", objectFit: "contain" }} />
                        <div style={{ fontSize: "22px", fontWeight: "700" }}>ENDEREÇO</div>
                      </div>
                      <div style={{ marginTop: "12px", fontSize: "15px", lineHeight: "1.4" }}>
                        Rua Mata Grande 1111, Prazeres — Jaboatão dos Guararapes - PE
                        <br />
                        CEP: 54.340-002
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {v.showInstitucional && (
              <div className="doc-page" style={{ position: "relative", width: "794px", height: "1123px", flex: "0 0 auto", backgroundColor: "#fff", backgroundImage: "url('/assets/fundo-proposta.png')", backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", boxShadow: "0 14px 40px rgba(0,0,0,0.22)", overflow: "hidden", fontFamily: "var(--font-barlow), sans-serif", color: "#151515" }}>
                <div style={{ position: "absolute", top: "110px", left: "73px", right: "80px", bottom: "50px", display: "flex", flexDirection: "column" }}>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "22px", fontWeight: "700", letterSpacing: "0.02em", padding: "7px 30px", borderRadius: "7px" }}>O FUTURO CHEGOU NA BR SOLAR!</span>
                  </div>
                  <p style={{ margin: "20px 0 0", fontSize: "16px", lineHeight: "1.32", textAlign: "center" }}>
                    Prepare-se para uma revolução na forma como você carrega seu veículo! A{" "}
                    <strong style={{ fontWeight: "700" }}>BR SOLAR</strong>
                    {" "}agora também é especialista em instalação de carregadores para carros elétricos!
                  </p>
                  <p style={{ margin: "14px 0 0", fontSize: "16px", lineHeight: "1.32", textAlign: "center" }}>Seja na sua casa ou no seu condomínio, oferecemos soluções completas e eficientes para você ter a comodidade de carregar seu carro com segurança e rapidez.</p>
                  <div style={{ marginTop: "30px", textAlign: "center" }}>
                    <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "22px", fontWeight: "700", letterSpacing: "0.02em", padding: "7px 30px", borderRadius: "7px" }}>NOSSOS PROJETOS</span>
                  </div>
                  <div style={{ marginTop: "18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
                    <ImageSlot id="prop-carregador-1" placeholder="Foto de instalação 1" radius={10} style={{ width: "100%", height: "235px" }} />
                    <ImageSlot id="prop-carregador-2" placeholder="Foto de instalação 2" radius={10} style={{ width: "100%", height: "235px" }} />
                  </div>
                  <div style={{ flex: "1", minHeight: "26px" }}></div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "22px", fontWeight: "700", letterSpacing: "0.02em", padding: "7px 30px", borderRadius: "7px" }}>ALGUNS DE NOSSOS CLIENTES</span>
                  </div>
                  <div style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "18px" }}>
                    <img src="/assets/prop/logo-casa-porto.png" alt="Casa Porto" style={{ height: "62px", width: "auto", objectFit: "contain" }} />
                    <img src="/assets/prop/logo-efas.png" alt="Escola Efas" style={{ height: "58px", width: "auto", objectFit: "contain" }} />
                    <img src="/assets/prop/logo-paletizar.png" alt="Paletizar" style={{ height: "54px", width: "auto", objectFit: "contain" }} />
                    <img src="/assets/prop/logo-belo-vale.png" alt="Belo Vale Pneus" style={{ height: "30px", width: "auto", objectFit: "contain" }} />
                    <img src="/assets/prop/logo-fruta-pao.png" alt="Fruta Pão" style={{ height: "62px", width: "auto", objectFit: "contain" }} />
                    <img src="/assets/prop/logo-abc.png" alt="ABC Borracha" style={{ height: "46px", width: "auto", objectFit: "contain" }} />
                  </div>
                </div>
              </div>
            )}
            {v.showServico && (
              <div className="doc-page" style={{ position: "relative", width: "794px", height: "1123px", flex: "0 0 auto", backgroundColor: "#fff", backgroundImage: "url('/assets/fundo-proposta.png')", backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", boxShadow: "0 14px 40px rgba(0,0,0,0.22)", overflow: "hidden", fontFamily: "var(--font-barlow), sans-serif", color: "#151515" }}>
                <div style={{ position: "absolute", top: "120px", left: "78px", right: "80px", bottom: "50px", display: "flex", flexDirection: "column" }}>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "22px", fontWeight: "700", letterSpacing: "0.02em", padding: "7px 30px", borderRadius: "7px" }}>PROPOSTA DE SERVIÇO</span>
                  </div>
                  <div style={{ marginTop: "36px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "16px" }}>
                      <div>
                        <strong style={{ fontWeight: "700" }}>Cliente:</strong>
                        {v.docCliente}
                      </div>
                      <div>
                        <strong style={{ fontWeight: "700" }}>Nº do Documento:</strong>
                        {v.docNumDocumento}
                      </div>
                      <div>
                        <strong style={{ fontWeight: "700" }}>Data do Documento:</strong>
                        {v.docDataCurta}
                      </div>
                      <div>
                        <strong style={{ fontWeight: "700" }}>Estado:</strong>
                        {v.docEstado}
                      </div>
                    </div>
                    <div style={{ fontSize: "16px" }}>
                      <div style={{ fontWeight: "700" }}>Descrição de Atividades</div>
                      <div style={{ marginTop: "4px", lineHeight: "1.32" }}>{v.docDescricao}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: "44px", textAlign: "center" }}>
                    <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "18px", fontWeight: "700", letterSpacing: "0.02em", padding: "6px 22px", borderRadius: "6px" }}>DESCRIÇÃO DE VALORES</span>
                  </div>
                  <div style={{ marginTop: "18px", border: "1px solid #D8D8DC", borderRadius: "6px", overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", background: "#151515", color: "#fff", fontSize: "14px", fontWeight: "700", letterSpacing: "0.06em" }}>
                      <div style={{ padding: "10px 16px" }}>ITEM</div>
                      <div style={{ padding: "10px 16px", textAlign: "right" }}>VALOR</div>
                    </div>
                    {(v.servicoDoc as any[]).map((it: any, i10: number) => (
                      <Fragment key={i10}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", borderTop: "1px solid #E6E6EA", fontSize: "15px" }}>
                          <div style={{ padding: "12px 16px", lineHeight: "1.25" }}>{it.descricao}</div>
                          <div style={{ padding: "12px 16px", textAlign: "right", fontWeight: "600" }}>{it.valor}</div>
                        </div>
                      </Fragment>
                    ))}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", borderTop: "2px solid #151515", fontSize: "17px", fontWeight: "800", background: "#F7F7F9" }}>
                      <div style={{ padding: "13px 16px" }}>TOTAL</div>
                      <div style={{ padding: "13px 16px", textAlign: "right" }}>{v.totalServicoStr}</div>
                    </div>
                  </div>
                  <div style={{ flex: "1" }}></div>
                  <div style={{ textAlign: "center", fontSize: "19px", fontWeight: "600" }}>Condições especiais no cartão de crédito</div>
                </div>
              </div>
            )}
            {v.showConsideracoes && (
              <div className="doc-page" style={{ position: "relative", width: "794px", height: "1123px", flex: "0 0 auto", backgroundColor: "#fff", backgroundImage: "url('/assets/fundo-proposta.png')", backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", boxShadow: "0 14px 40px rgba(0,0,0,0.22)", overflow: "hidden", fontFamily: "var(--font-barlow), sans-serif", color: "#151515" }}>
                <div style={{ position: "absolute", top: "100px", left: "78px", right: "80px", bottom: "44px", display: "flex", flexDirection: "column" }}>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-block", background: "#FF8D02", color: "#fff", fontSize: "24px", fontWeight: "700", letterSpacing: "0.02em", padding: "8px 34px", borderRadius: "7px" }}>CONSIDERAÇÕES FINAIS</span>
                  </div>
                  <div style={{ marginTop: "32px", fontSize: "21px", fontWeight: "700" }}>GARANTIA DO SERVIÇO</div>
                  <p style={{ margin: "6px 0 0", fontSize: "18px", lineHeight: "1.3", textAlign: "justify" }}>A Br Solar Energia Renovável garante que todos os serviços serão realizados de acordo com as normas técnicas e padrões de qualidade exigidos.</p>
                  <div style={{ marginTop: "26px", fontSize: "21px", fontWeight: "700" }}>VALIDADE</div>
                  <div style={{ marginTop: "6px", fontSize: "18px" }}>
                    Emissão da Proposta em{" "}
                    <strong style={{ fontWeight: "700" }}>{v.docDataCurta}</strong>
                  </div>
                  <div style={{ marginTop: "14px", fontSize: "18px" }}>
                    Esta proposta é válida em todos seus termos por{" "}
                    <strong style={{ fontWeight: "700" }}>{v.docValidade}</strong>
                    .
                  </div>
                  <div style={{ marginTop: "26px", fontSize: "21px", fontWeight: "700" }}>CONSIDERAÇÕES FINAIS</div>
                  <p style={{ margin: "6px 0 0", fontSize: "18px", lineHeight: "1.3", textAlign: "justify" }}>Esta proposta está aberta a negociações e foi elaborada com base em uma visão preliminar do projeto. Os valores apresentados poderão ser ajustados, para mais ou para menos, conforme houver maior detalhamento técnico e operacional.</p>
                  <p style={{ margin: "14px 0 0", fontSize: "18px", lineHeight: "1.3" }}>Estamos à disposição para adequações e alinhamentos necessários.</p>
                  <div style={{ marginTop: "20px", fontSize: "18px" }}>
                    Jaboatão dos Guararapes,{" "}
                    <strong style={{ fontWeight: "700" }}>{v.docDataExtenso}</strong>
                  </div>
                  <div style={{ flex: "1", minHeight: "40px" }}></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "40px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ borderTop: "1px solid #151515", marginBottom: "7px" }}></div>
                      <div style={{ fontSize: "20px", fontWeight: "700" }}>BR SOLAR</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ borderTop: "1px solid #151515", marginBottom: "7px" }}></div>
                      <div style={{ fontSize: "20px", fontWeight: "700", lineHeight: "1.2", textWrap: "balance" }}>{v.docClienteCaps}</div>
                    </div>
                  </div>
                  <div style={{ flex: "1", minHeight: "40px" }}></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", borderTop: "1px solid #D8D8DC", paddingTop: "18px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
                        <img src="/assets/prop/ico-contato.png" alt="" style={{ width: "30px", height: "30px", objectFit: "contain" }} />
                        <div style={{ fontSize: "22px", fontWeight: "700" }}>CONTATO</div>
                      </div>
                      <div style={{ marginTop: "12px", fontSize: "17px", fontWeight: "700" }}>RESPONSÁVEL COMERCIAL</div>
                      <div style={{ fontSize: "15px", marginTop: "3px" }}>BRENO RUFINO</div>
                      <div style={{ fontSize: "15px" }}>(81) 9 8177-1818</div>
                      <div style={{ fontSize: "15px" }}>brenoferreirarufino@outlook.com</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "9px", marginTop: "12px" }}>
                        <img src="/assets/prop/ico-instagram.png" alt="" style={{ width: "19px", height: "19px", objectFit: "contain" }} />
                        <div style={{ fontSize: "15px", color: "#C96A00", fontWeight: "600" }}>@brsolar_energiasolar</div>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
                        <img src="/assets/prop/ico-localizacao.png" alt="" style={{ width: "30px", height: "30px", objectFit: "contain" }} />
                        <div style={{ fontSize: "22px", fontWeight: "700" }}>ENDEREÇO</div>
                      </div>
                      <div style={{ marginTop: "12px", fontSize: "15px", lineHeight: "1.4" }}>
                        Rua Mata Grande 1111, Prazeres — Jaboatão dos Guararapes - PE
                        <br />
                        CEP: 54.340-002
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

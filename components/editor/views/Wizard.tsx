/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, type Ref } from "react";
import type { Vals } from "../types";

export function Wizard({ v, previewRef }: { v: Vals; previewRef?: Ref<HTMLElement> }) {
  return (
    <main style={{ flex: "1", display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "0" }}>
      <section className="no-print" style={{ flex: "1 1 420px", minWidth: "320px", padding: "24px 24px 90px", maxWidth: "620px", margin: "0 auto" }}>
        <button className="hv1" onClick={v.goFaturas} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", fontSize: "14px", padding: "0 0 14px", display: "flex", alignItems: "center", gap: "6px" }}>← Faturas</button>
        <div style={{ display: "flex", gap: "6px", marginBottom: "26px" }}>
          {(v.passos as any[]).map((p: any, i5: number) => (
            <Fragment key={i5}>
              <button onClick={p.onClick} style={{ flex: "1", cursor: "pointer", textAlign: "left", border: "none", background: "none", padding: "0" }}>
                <div style={{ height: "4px", borderRadius: "3px", background: p.barra }}></div>
                <div style={{ fontSize: "12.5px", fontWeight: "600", marginTop: "7px", color: p.cor }}>{p.label}</div>
              </button>
            </Fragment>
          ))}
        </div>
        {v.isStep1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "32px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Cliente e período</h2>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                Cliente cadastrado
                <select value={v.clienteSel ?? ""} onChange={v.onCliente} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", background: "#fff", outline: "none" }}>
                  <option value="">— novo cliente —</option>
                  {(v.clientes as any[]).map((c: any, i9: number) => (
                    <Fragment key={i9}>
                      <option value={c.id}>{c.nome}</option>
                    </Fragment>
                  ))}
                </select>
              </label>
              <div style={{ fontSize: "13px", color: "#8A8A8A", lineHeight: "1.4", marginTop: "-6px" }}>{v.memoriaTexto}</div>
            </div>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                Nome do cliente / unidade consumidora
                <input value={v.d.nome ?? ""} onChange={v.onNome} placeholder="Condomínio Edf. …" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                CPF ou CNPJ
                <input value={v.d.doc ?? ""} onChange={v.onDoc} placeholder="Só os números" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                <span style={{ fontSize: "12.5px", color: "#8A8A8A", fontWeight: "500" }}>{v.docHint}</span>
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                Endereço
                <textarea rows={2} value={v.d.endereco ?? ""} onChange={v.onEndereco} placeholder="Rua, número — Bairro, Cidade – UF" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none", resize: "vertical", lineHeight: "1.35" }}></textarea>
                <span style={{ fontSize: "12.5px", color: "#8A8A8A", fontWeight: "500" }}>Uma linha por quebra de linha.</span>
              </label>
            </div>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexWrap: "wrap", gap: "14px" }}>
              <label style={{ flex: "1", minWidth: "150px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                Mês de referência
                <input type="month" value={v.d.mes ?? ""} onChange={v.onMes} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "10px 12px", fontSize: "15px", outline: "none" }} />
              </label>
              <label style={{ flex: "1", minWidth: "150px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                Vencimento
                <input type="date" value={v.d.vencimento ?? ""} onChange={v.onVencimento} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "10px 12px", fontSize: "15px", outline: "none" }} />
              </label>
            </div>
          </div>
        )}
        {v.isStep2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "32px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Valores</h2>
            <div style={{ display: "flex", gap: "8px", background: "#E4E4E7", padding: "4px", borderRadius: "11px" }}>
              <button onClick={v.setConsumo} style={{ flex: "1", cursor: "pointer", border: "none", borderRadius: "8px", padding: "11px", fontSize: "15px", fontWeight: "700", background: v.tabConsumoBg, color: v.tabConsumoFg }}>Por consumo</button>
              <button onClick={v.setFixa} style={{ flex: "1", cursor: "pointer", border: "none", borderRadius: "8px", padding: "11px", fontSize: "15px", fontWeight: "700", background: v.tabFixaBg, color: v.tabFixaFg }}>Valor fixo</button>
            </div>
            {v.isConsumo && (
              <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {!v.multi && (
                  <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                    Consumo do mês (kWh)
                    <input type="number" value={v.d.kwh ?? ""} onChange={v.onKwh} placeholder="0" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "20px", fontWeight: "700", outline: "none" }} />
                  </label>
                )}
                {!v.multi && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                    <label style={{ flex: "1", minWidth: "140px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                      Valor de referência (R$)
                      <input type="number" step="0.01" value={v.d.valorRef ?? ""} onChange={v.onValorRef} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                    </label>
                    <label style={{ flex: "1", minWidth: "140px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                      Desconto do cliente (%)
                      <input type="number" value={v.d.desconto ?? ""} onChange={v.onDesconto} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                    </label>
                  </div>
                )}
                {v.multi && (v.contasForm as any[]).map((c: any, ic: number) => (
                  <Fragment key={ic}>
                    <div style={{ border: "1px solid #E2E2E5", borderRadius: "11px", padding: "13px 14px", display: "flex", flexDirection: "column", gap: "11px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "15px", fontWeight: "700" }}>{c.titulo}</span>
                        <button className="hv11" onClick={c.onRemover} style={{ cursor: "pointer", background: "none", border: "none", color: "#A33", fontSize: "13.5px", fontWeight: "600" }}>Remover</button>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                        <label style={{ flex: "1", minWidth: "140px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                          Consumo (kWh)
                          <input type="number" value={c.kwh ?? ""} onChange={c.onKwh} placeholder="0" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "18px", fontWeight: "700", outline: "none" }} />
                        </label>
                        <label style={{ flex: "1", minWidth: "140px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                          Valor de referência (R$)
                          <input type="number" step="0.01" value={c.valorRef ?? ""} onChange={c.onValorRef} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                        </label>
                      </div>
                    </div>
                  </Fragment>
                ))}
                {v.podeAddConta && (
                  <button className="hv10" onClick={v.addConta} style={{ cursor: "pointer", background: "#fff", border: "1px dashed #C9C9CE", borderRadius: "11px", padding: "12px", fontSize: "14.5px", fontWeight: "600", color: "#444" }}>+ Adicionar outra conta</button>
                )}
                {v.multi && (
                  <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                    Desconto do cliente (%) — vale para todas as contas
                    <input type="number" value={v.d.desconto ?? ""} onChange={v.onDesconto} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                  </label>
                )}
                <div style={{ borderTop: "1px solid #EEE", paddingTop: "13px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "14.5px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#666" }}>
                    <span>Valor referência{" "}{v.concessionaria}</span>
                    <strong style={{ color: "#151515", fontWeight: "700" }}>{v.calc.valorRef}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#666" }}>
                    <span>Desconto aplicado</span>
                    <strong style={{ color: "#3E8E3E", fontWeight: "700" }}>−{" "}{v.calc.descontoValor}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid #EEE", paddingTop: "8px", marginTop: "3px" }}>
                    <span style={{ fontWeight: "700" }}>Total da fatura</span>
                    <strong style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "26px", fontWeight: "800", color: "#FF8D02" }}>{v.calc.total}</strong>
                  </div>
                </div>
              </div>
            )}
            {v.isFixa && (
              <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                  <label style={{ flex: "1", minWidth: "150px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                    Valor contratado (R$)
                    <input type="number" step="0.01" value={v.d.contratado ?? ""} onChange={v.onContratado} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "18px", fontWeight: "700", outline: "none" }} />
                  </label>
                  <label style={{ flex: "1", minWidth: "150px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                    Taxa mínima (R$)
                    <input type="number" step="0.01" value={v.d.taxaMinima ?? ""} onChange={v.onTaxa} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "18px", fontWeight: "700", outline: "none" }} />
                  </label>
                </div>
                <div style={{ borderTop: "1px solid #EEE", paddingTop: "13px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: "700" }}>Total da fatura</span>
                  <strong style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "26px", fontWeight: "800", color: "#FF8D02" }}>{v.calc.total}</strong>
                </div>
              </div>
            )}
          </div>
        )}
        {v.isStep3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "32px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Dados para pagamento</h2>
            <p style={{ margin: "-10px 0 0", color: "#666", fontSize: "15px" }}>Escolha um dos dados cadastrados ou adicione outro.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {(v.pagamentos as any[]).map((pg: any, i7: number) => (
                <Fragment key={i7}>
                  <div onClick={pg.onSelect} style={{ cursor: "pointer", background: "#fff", border: `2px solid ${pg.borda}`, borderRadius: "13px", padding: "14px 16px", display: "flex", gap: "13px", alignItems: "flex-start" }}>
                    <span style={{ flex: "0 0 auto", marginTop: "2px", width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${pg.radioBorda}`, background: pg.radioBg, boxShadow: "inset 0 0 0 3px #fff" }}></span>
                    <div style={{ flex: "1", minWidth: "0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "16px", fontWeight: "700" }}>{pg.apelido}</span>
                        {pg.ehPadrao && (
                          <span style={{ fontSize: "10.5px", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: "700", background: "#FFF0DC", color: "#A65A00", borderRadius: "999px", padding: "3px 8px" }}>Padrão</span>
                        )}
                      </div>
                      <div style={{ fontSize: "13.5px", color: "#666", marginTop: "3px", lineHeight: "1.45" }}>{pg.favorecido}</div>
                      <div style={{ fontSize: "13.5px", color: "#666", lineHeight: "1.45" }}>{pg.linhaBanco}</div>
                      <div style={{ fontSize: "13.5px", color: "#666", lineHeight: "1.45" }}>PIX{" "}{pg.pix}</div>
                    </div>
                    <button className="hv9" onClick={pg.onEditar} style={{ flex: "0 0 auto", cursor: "pointer", background: "none", border: "none", color: "#C96A00", fontSize: "13.5px", fontWeight: "700", padding: "2px 4px" }}>Editar</button>
                  </div>
                </Fragment>
              ))}
              {v.semFormPag && (
                <button className="hv10" onClick={v.novoPagamento} style={{ cursor: "pointer", background: "#fff", border: "1px dashed #C9C9CE", borderRadius: "13px", padding: "15px", fontSize: "15px", fontWeight: "600", color: "#444" }}>+ Adicionar dados de pagamento</button>
              )}
            </div>
            {v.temFormPag && (
              <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "23px", fontWeight: "800", lineHeight: "1" }}>{v.formPagTitulo}</div>
                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                  Apelido
                  <input value={v.form.apelido ?? ""} onChange={v.onFormApelido} placeholder="Ex.: Santander — BRF Energy" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                  Chave PIX
                  <input value={v.form.pix ?? ""} onChange={v.onFormPix} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                  Favorecido
                  <input value={v.form.favorecido ?? ""} onChange={v.onFormFavorecido} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                  <label style={{ flex: "2", minWidth: "150px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                    Banco
                    <input value={v.form.banco ?? ""} onChange={v.onFormBanco} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                  </label>
                  <label style={{ flex: "1", minWidth: "110px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                    Agência
                    <input value={v.form.agencia ?? ""} onChange={v.onFormAgencia} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                  </label>
                  <label style={{ flex: "1", minWidth: "110px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                    Conta
                    <input value={v.form.conta ?? ""} onChange={v.onFormConta} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                  </label>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "14px", color: "#444", fontWeight: "600", cursor: "pointer" }}>
                  <input type="checkbox" checked={!!(v.form.padrao)} onChange={v.onFormPadrao} style={{ width: "17px", height: "17px", accentColor: "#FF8D02", cursor: "pointer" }} />
                  Usar como padrão nas próximas faturas
                </label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button className="hv2" onClick={v.salvarPagamento} style={{ cursor: "pointer", background: "#151515", color: "#fff", border: "none", borderRadius: "9px", padding: "11px 20px", fontSize: "15px", fontWeight: "600" }}>Salvar</button>
                  <button className="hv8" onClick={v.cancelarPagamento} style={{ cursor: "pointer", background: "#fff", border: "1px solid #DDD", borderRadius: "9px", padding: "11px 20px", fontSize: "15px", fontWeight: "600" }}>Cancelar</button>
                  <div style={{ flex: "1" }}></div>
                  {v.podeExcluirPag && (
                    <button className="hv11" onClick={v.excluirPagamento} style={{ cursor: "pointer", background: "none", border: "none", color: "#A33", fontSize: "14px", fontWeight: "600" }}>Excluir</button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {v.isStep4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "32px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Revisar e exportar</h2>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "11px" }}>
              {(v.resumo as any[]).map((r: any, i7: number) => (
                <Fragment key={i7}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", fontSize: "15px", borderBottom: "1px solid #F0F0F2", paddingBottom: "9px" }}>
                    <span style={{ color: "#777" }}>{r.k}</span>
                    <strong style={{ fontWeight: "700", textAlign: "right" }}>{r.v}</strong>
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ background: "#E4F2D4", borderRadius: "13px", padding: "14px 18px" }}>
              <div style={{ fontSize: "11.5px", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: "700", color: "#4A6B2F" }}>Mensagem de economia</div>
              <div style={{ fontSize: "15px", marginTop: "3px", color: "#1F3010", textWrap: "pretty" }}>{v.economiaMsg}</div>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button className="hv3" onClick={v.baixarPdf} disabled={v.pdfBotao !== "Baixar PDF"}style={{ cursor: "pointer", background: "#FF8D02", color: "#151515", border: "none", borderRadius: "10px", padding: "14px 22px", fontSize: "16px", fontWeight: "700" }}>{v.pdfBotao}</button>
              <button className="hv8" onClick={v.salvarFatura} style={{ cursor: "pointer", background: "#fff", border: "1px solid #DDD", borderRadius: "10px", padding: "14px 22px", fontSize: "16px", fontWeight: "600" }}>Salvar e voltar</button>
            </div>
          </div>
        )}
        {v.isNarrow && (
          <button className="hv8" onClick={v.togglePreview} style={{ width: "100%", marginTop: "22px", cursor: "pointer", background: "#fff", border: "1px dashed #C9C9CE", borderRadius: "10px", padding: "13px", fontSize: "15px", fontWeight: "600", color: "#444" }}>{v.previewBotao}</button>
        )}
        <div style={{ display: "flex", gap: "10px", marginTop: "26px" }}>
          <button className="hv8" onClick={v.voltarPasso} style={{ cursor: "pointer", background: "#fff", border: "1px solid #DDD", borderRadius: "10px", padding: "12px 20px", fontSize: "15px", fontWeight: "600" }}>Voltar</button>
          {v.temProximo && (
            <button className="hv2" onClick={v.proximoPasso} style={{ cursor: "pointer", background: "#151515", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 24px", fontSize: "15px", fontWeight: "600" }}>Continuar</button>
          )}
        </div>
      </section>
      <section className="preview-col" ref={previewRef} style={{ flex: "1 1 480px", minWidth: "0", background: "#DEDEE2", padding: "24px 20px", justifyContent: "center", alignSelf: "stretch", overflow: "hidden", display: v.previewDisplay }}>
        <div className="print-scaler" style={{ flex: "0 0 auto", width: v.scalerW, height: v.scalerH }}>
          <div style={{ transformOrigin: "top left", transform: v.scaleCss }}>
            <div className="fatura-page" style={{ position: "relative", width: "794px", height: "1123px", backgroundColor: "#fff", backgroundImage: "url('/assets/fundo-fatura.png')", backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", boxShadow: "0 14px 40px rgba(0,0,0,0.22)", overflow: "hidden", fontFamily: "var(--font-barlow-semi), sans-serif", color: "#151515" }}>
              <div style={{ position: "absolute", top: "17px", right: "32px", textAlign: "right", lineHeight: "1" }}>
                <div style={{ fontSize: "19px", fontWeight: "600", letterSpacing: "0.26em", color: "#fff" }}>FATURA</div>
                <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "30px", fontWeight: "800", color: "#FF8D02", marginTop: "5px", letterSpacing: "0.02em" }}>{v.p.ref}</div>
              </div>
              <div style={{ position: "absolute", top: "94px", left: "0", width: "794px", height: "91px", background: "#FF8D02", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 31px" }}>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "600", letterSpacing: "0.22em" }}>TOTAL A PAGAR</div>
                  <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "39px", fontWeight: "800", lineHeight: "1.05", letterSpacing: "-0.005em" }}>{v.p.total}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "15px", fontWeight: "600", letterSpacing: "0.22em" }}>VENCIMENTO</div>
                  <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "28px", fontWeight: "800", lineHeight: "1.1" }}>{v.p.venc}</div>
                </div>
              </div>
              <div style={{ position: "absolute", top: "203px", left: "31px", right: "31px" }}>
                <div style={{ fontSize: "15px", fontWeight: "600", letterSpacing: "0.22em" }}>CLIENTE / UNIDADE CONSUMIDORA</div>
                <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "29px", fontWeight: "800", lineHeight: "1.15", marginTop: "4px" }}>{v.p.nome}</div>
                {v.p.temDoc && (
                  <div style={{ fontSize: "19px", fontWeight: "400", marginTop: "2px" }}>{v.p.docLinha}</div>
                )}
                {(v.p.linhas as any[]).map((linha: any, i8: number) => (
                  <Fragment key={i8}>
                    <div style={{ fontSize: "16px", fontWeight: "400", lineHeight: "1.3", color: "#2A2A2A" }}>{linha}</div>
                  </Fragment>
                ))}
              </div>
              {v.p.mostraConsumo && (
                <div style={{ position: "absolute", top: "324px", left: "247px", width: "299px", height: "142px", border: "2.5px solid #FF8D02", borderRadius: "13px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "9px" }}>
                  <div style={{ fontSize: "15px", fontWeight: "600", letterSpacing: "0.2em" }}>CONSUMO DO MÊS</div>
                  <div style={{ fontSize: "15px", fontWeight: "600", letterSpacing: "0.2em", color: "#FF8D02" }}>ENERGIA GERADA</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "39px", fontWeight: "800", color: "#FF8D02", lineHeight: "1" }}>{v.p.kwh}</span>
                    <span style={{ fontSize: "16px", fontWeight: "600", letterSpacing: "0.08em" }}>kWh</span>
                  </div>
                </div>
              )}
              <div style={{ position: "absolute", top: v.p.detTop, left: "31px", right: "31px" }}>
                <div style={{ fontSize: "15px", fontWeight: "600", letterSpacing: "0.22em" }}>DETALHAMENTO DO VALOR</div>
                <div style={{ margin: "24px 0 0 49px" }}>
                  {(v.p.rows as any[]).map((row: any, i9: number) => (
                    <Fragment key={i9}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", padding: row.compacta ? "5px 0 4px" : "9px 0 8px", borderBottom: "1px solid #CFCFCF" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div>
                            <div style={{ fontSize: "17px", fontWeight: "600", lineHeight: "1.15" }}>{row.label}</div>
                            <div style={{ fontSize: "11px", fontWeight: "400", color: "#7A7A7A", letterSpacing: "0.04em" }}>{row.sub}</div>
                          </div>
                          {row.temPill && (
                            <span style={{ background: "#8CC63F", color: "#fff", fontSize: "12px", fontWeight: "700", borderRadius: "4px", padding: "2px 7px", letterSpacing: "0.03em" }}>{row.pill}</span>
                          )}
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: "600", letterSpacing: "0.1em", color: row.valorCor }}>{row.valor}</div>
                      </div>
                    </Fragment>
                  ))}
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "14px", padding: "11px 0 9px", borderBottom: "1px solid #CFCFCF" }}>
                    <div style={{ fontSize: "19px", fontWeight: "800" }}>Total da Fatura</div>
                    <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", color: "#151515" }}>{v.p.notaTotal}</div>
                    <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "24px", fontWeight: "800", color: "#FF8D02" }}>{v.p.total}</div>
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", top: v.p.ecoTop, left: v.p.ecoLeft, width: v.p.ecoWidth, background: "#E4F2D4", borderRadius: "13px", padding: "12px 20px", display: "flex", alignItems: "center", gap: "13px" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ flex: "0 0 auto" }}>
                  <path d="M12 21c0-6 3.2-9.6 8-10.4-.4 5.6-3.6 9.2-8 10.4Z" fill="#7CB342"></path>
                  <path d="M12 21C8.5 17.4 4.6 16 3 15.6 3.8 20 7.4 21.6 12 21Z" fill="#AED581"></path>
                </svg>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.18em", color: "#3E3E3E" }}>SUA ECONOMIA ESTE MÊS</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#151515", marginTop: "1px", textWrap: "pretty" }}>{v.p.economia}</div>
                </div>
              </div>
              <div style={{ position: "absolute", top: "851px", left: "31px", width: "300px" }}>
                <div style={{ fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em" }}>PAGAMENTO VIA PIX</div>
                <div style={{ marginTop: "27px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.06em" }}>Chave PIX:</div>
                <div style={{ marginTop: "5px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.1em", color: "#FF8D02" }}>{v.p.pix}</div>
              </div>
              <div style={{ position: "absolute", top: "851px", left: "397px", width: "366px" }}>
                <div style={{ fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em" }}>DADOS BANCÁRIOS</div>
                <div style={{ marginTop: "22px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", paddingBottom: "7px", borderBottom: "1px solid #CFCFCF" }}>
                    <span style={{ fontSize: "13px", fontWeight: "500", color: "#444" }}>Favorecido</span>
                    <span style={{ fontSize: "13px", fontWeight: "600", letterSpacing: "0.04em", textAlign: "right", lineHeight: "1.25" }}>{v.p.favorecido}</span>
                  </div>
                  {(v.p.bancoRows as any[]).map((b: any, i9: number) => (
                    <Fragment key={i9}>
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", padding: "7px 0", borderBottom: "1px solid #CFCFCF" }}>
                        <span style={{ fontSize: "13px", fontWeight: "500", color: "#444" }}>{b.k}</span>
                        <span style={{ fontSize: "13px", fontWeight: "600", letterSpacing: "0.04em" }}>{b.v}</span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

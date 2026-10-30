/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from "react";
import type { Vals } from "../types";

export function DocsWizard({ v }: { v: Vals }) {
  return (
    <main style={{ flex: "1", display: "flex", flexWrap: "wrap", alignItems: "flex-start" }}>
      <section className="no-print" style={{ flex: "1 1 420px", minWidth: "320px", padding: "24px 24px 90px", maxWidth: "620px", margin: "0 auto" }}>
        <button className="hv1" onClick={v.goDocs} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", fontSize: "14px", padding: "0 0 14px", display: "flex", alignItems: "center", gap: "6px" }}>← Documentação</button>
        <div style={{ display: "flex", gap: "6px", marginBottom: "26px" }}>
          {(v.docPassos as any[]).map((p: any, i5: number) => (
            <Fragment key={i5}>
              <button onClick={p.onClick} style={{ flex: "1", cursor: "pointer", textAlign: "left", border: "none", background: "none", padding: "0" }}>
                <div style={{ height: "4px", borderRadius: "3px", background: p.barra }}></div>
                <div style={{ fontSize: "12.5px", fontWeight: "600", marginTop: "7px", color: p.cor }}>{p.label}</div>
              </button>
            </Fragment>
          ))}
        </div>
        {v.isDocInicio && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "32px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Início</h2>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                Nome do cliente
                <input value={v.dd.nome ?? ""} onChange={v.onDocNome} placeholder="Nome completo ou razão social" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                CPF ou CNPJ
                <input value={v.dd.doc ?? ""} onChange={v.onDocDoc} placeholder="Só os números" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                <span style={{ fontSize: "12.5px", color: "#8A8A8A", fontWeight: "500" }}>{v.docTipoTexto}</span>
              </label>
            </div>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "13px", color: "#666", fontWeight: "600" }}>Documentos deste pacote</div>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                <input type="checkbox" checked={!!(v.dd.incProcuracao)} onChange={v.onIncProcuracao} style={{ width: "18px", height: "18px", accentColor: "#FF8D02", cursor: "pointer" }} />
                Procuração
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                <input type="checkbox" checked={!!(v.dd.incTermo)} onChange={v.onIncTermo} style={{ width: "18px", height: "18px", accentColor: "#FF8D02", cursor: "pointer" }} />
                Termo de Adesão
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                <input type="checkbox" checked={!!(v.dd.incContrato)} onChange={v.onIncContrato} style={{ width: "18px", height: "18px", accentColor: "#FF8D02", cursor: "pointer" }} />
                Contrato
              </label>
            </div>
          </div>
        )}
        {v.isDocQualif && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "32px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Qualificação</h2>
            <p style={{ margin: "-10px 0 0", color: "#666", fontSize: "15px" }}>Deixe em branco o que não se aplica — campos vazios são ignorados no texto.</p>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                Endereço completo
                <textarea rows={2} value={v.dd.endereco ?? ""} onChange={v.onDocEndereco} placeholder="Rua, nº, bairro, cidade – UF, CEP" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none", resize: "vertical", lineHeight: "1.35" }}></textarea>
              </label>
              {v.docEhPJ && (
                <div style={{ fontSize: "13px", color: "#8A8A8A", lineHeight: "1.4", background: "#F7F7F9", borderRadius: "9px", padding: "10px 12px" }}>Pessoa jurídica: RG e profissão não se aplicam. Preencha o representante abaixo.</div>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                <label style={{ flex: "1", minWidth: "140px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                  RG
                  <input value={v.dd.rg ?? ""} onChange={v.onDocRg} placeholder="0.000.000 SDS/PE" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                </label>
                <label style={{ flex: "1", minWidth: "140px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                  Profissão
                  <input value={v.dd.profissao ?? ""} onChange={v.onDocProfissao} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                </label>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                <label style={{ flex: "1", minWidth: "140px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                  Nacionalidade
                  <input value={v.dd.nacionalidade ?? ""} onChange={v.onDocNacionalidade} placeholder="brasileiro(a)" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                </label>
                <label style={{ flex: "1", minWidth: "140px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                  Estado civil
                  <input value={v.dd.estadoCivil ?? ""} onChange={v.onDocEstadoCivil} placeholder="solteiro(a)" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                </label>
              </div>
            </div>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ fontSize: "13px", color: "#666", fontWeight: "600" }}>Representante (se houver)</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                <label style={{ flex: "2", minWidth: "160px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                  Nome
                  <input value={v.dd.representante ?? ""} onChange={v.onDocRepresentante} placeholder="Nome do síndico / sócio" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
                </label>
                <label style={{ flex: "1", minWidth: "140px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                  Cargo
                  <select value={v.dd.repCargo ?? ""} onChange={v.onDocRepCargo} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", background: "#fff", outline: "none" }}>
                    <option value="síndico">síndico</option>
                    <option value="sócio administrador">sócio administrador</option>
                    <option value="procurador">procurador</option>
                    <option value="representante legal">representante legal</option>
                  </select>
                </label>
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                CPF do representante
                <input value={v.dd.repCpf ?? ""} onChange={v.onDocRepCpf} placeholder="Só os números" style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none" }} />
              </label>
              {v.temRepresentante && (
                <div>
                  <div style={{ fontSize: "13px", color: "#666", fontWeight: "600", marginBottom: "7px" }}>Quem assina os documentos?</div>
                  <div style={{ display: "flex", gap: "8px", background: "#E4E4E7", padding: "4px", borderRadius: "11px" }}>
                    <button onClick={v.setAssinCliente} style={{ flex: "1", cursor: "pointer", border: "none", borderRadius: "8px", padding: "10px", fontSize: "14.5px", fontWeight: "700", background: v.assinClienteBg, color: v.assinClienteFg }}>O cliente</button>
                    <button onClick={v.setAssinRep} style={{ flex: "1", cursor: "pointer", border: "none", borderRadius: "8px", padding: "10px", fontSize: "14.5px", fontWeight: "700", background: v.assinRepBg, color: v.assinRepFg }}>O representante</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {v.isDocTermo && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "32px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Textos do termo</h2>
            <p style={{ margin: "-10px 0 0", color: "#666", fontSize: "15px" }}>Os três trechos variáveis do resumo da locação.</p>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                Valor Mensal
                <textarea rows={2} value={v.dd.valorMensal ?? ""} onChange={v.onValorMensal} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none", resize: "vertical", lineHeight: "1.4" }}></textarea>
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                Explicativo
                <textarea rows={4} value={v.dd.explicativo ?? ""} onChange={v.onExplicativo} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none", resize: "vertical", lineHeight: "1.4" }}></textarea>
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                Simplificadora
                <textarea rows={3} value={v.dd.simplificadora ?? ""} onChange={v.onSimplificadora} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "11px 12px", fontSize: "15px", outline: "none", resize: "vertical", lineHeight: "1.4" }}></textarea>
              </label>
            </div>
          </div>
        )}
        {v.isDocRevisar && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "32px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Revisar e exportar</h2>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "11px" }}>
              {(v.docResumo as any[]).map((r: any, i7: number) => (
                <Fragment key={i7}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", fontSize: "15px", borderBottom: "1px solid #F0F0F2", paddingBottom: "9px" }}>
                    <span style={{ color: "#777" }}>{r.k}</span>
                    <strong style={{ fontWeight: "700", textAlign: "right" }}>{r.v}</strong>
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button className="hv3" onClick={v.baixarDocs} disabled={v.pdfBotao !== "Baixar PDF"}style={{ cursor: "pointer", background: "#FF8D02", color: "#151515", border: "none", borderRadius: "10px", padding: "14px 22px", fontSize: "16px", fontWeight: "700" }}>{v.pdfBotao}</button>
              <button className="hv8" onClick={v.salvarDocs} style={{ cursor: "pointer", background: "#fff", border: "1px solid #DDD", borderRadius: "10px", padding: "14px 22px", fontSize: "16px", fontWeight: "600" }}>Salvar e voltar</button>
            </div>
          </div>
        )}
        {v.isNarrow && (
          <button className="hv8" onClick={v.togglePreview} style={{ width: "100%", marginTop: "22px", cursor: "pointer", background: "#fff", border: "1px dashed #C9C9CE", borderRadius: "10px", padding: "13px", fontSize: "15px", fontWeight: "600", color: "#444" }}>{v.previewBotao}</button>
        )}
        <div style={{ display: "flex", gap: "10px", marginTop: "26px" }}>
          <button className="hv8" onClick={v.docVoltar} style={{ cursor: "pointer", background: "#fff", border: "1px solid #DDD", borderRadius: "10px", padding: "12px 20px", fontSize: "15px", fontWeight: "600" }}>Voltar</button>
          {v.temDocProximo && (
            <button className="hv2" onClick={v.docProximo} style={{ cursor: "pointer", background: "#151515", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 24px", fontSize: "15px", fontWeight: "600" }}>Continuar</button>
          )}
        </div>
      </section>
      <section className="preview-col" style={{ flex: "1 1 480px", minWidth: "0", background: "#DEDEE2", padding: "20px", alignSelf: "stretch", overflow: "hidden", flexDirection: "column", alignItems: "center", gap: "14px", display: v.previewDisplay }}>
        <div className="no-print" style={{ display: "flex", gap: "6px", background: "#CACAD0", padding: "4px", borderRadius: "10px" }}>
          {(v.docAbas as any[]).map((ab: any, i5: number) => (
            <Fragment key={i5}>
              <button onClick={ab.onClick} style={{ cursor: "pointer", border: "none", borderRadius: "7px", padding: "8px 14px", fontSize: "13.5px", fontWeight: "700", background: ab.bg, color: ab.fg }}>{ab.label}</button>
            </Fragment>
          ))}
        </div>
        <div className="print-scaler" style={{ flex: "0 0 auto", width: v.scalerW, height: v.docScalerH }}>
          <div style={{ transformOrigin: "top left", display: "flex", flexDirection: "column", gap: "18px", transform: v.scaleCss }}>
            {(v.docsGerados as any[]).map((doc: any, i6: number) => (
              <Fragment key={i6}>
                <div className="doc-bloco" style={{ flexDirection: "column", gap: "18px", display: doc.display }}>
                  {(doc.paginas as any[]).map((pg: any, i9: number) => (
                    <Fragment key={i9}>
                      <div className="doc-page" style={{ position: "relative", width: "794px", height: "1123px", flex: "0 0 auto", backgroundColor: "#fff", backgroundImage: "url('/assets/fundo-documentos.png')", backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", boxShadow: "0 14px 40px rgba(0,0,0,0.22)", overflow: "hidden", fontFamily: "var(--font-barlow), sans-serif", color: "#151515" }}>
                        <div style={{ position: "absolute", top: "96px", left: "55px", right: "55px", bottom: "96px" }}>
                          {(pg.blocos as any[]).map((b: any, i13: number) => (
                            <Fragment key={i13}>
                              {b.ehTitulo && (
                                <div style={{ textAlign: "center", fontSize: "19px", fontWeight: "700", lineHeight: "1.3" }}>{b.texto}</div>
                              )}
                              {b.ehSecao && (
                                <div style={{ fontSize: "19px", fontWeight: "700", lineHeight: "1.3", margin: "22px 0 5px" }}>{b.texto}</div>
                              )}
                              {b.ehEsp && (
                                <div style={{ height: "16px" }}></div>
                              )}
                              {b.ehPara && (
                                <p style={{ fontSize: "16px", lineHeight: "1.27", textAlign: "justify", margin: "0 0 18px" }}>
                                  {b.pre}
                                  <strong style={{ fontWeight: "700" }}>{b.forte}</strong>
                                  {b.pos}
                                  <strong style={{ fontWeight: "700" }}>{b.forte2}</strong>
                                  {b.pos2}
                                </p>
                              )}
                              {b.ehParaColado && (
                                <p style={{ fontSize: "16px", lineHeight: "1.27", textAlign: "justify", margin: "0" }}>
                                  {b.pre}
                                  <strong style={{ fontWeight: "700" }}>{b.forte}</strong>
                                  {b.pos}
                                  <strong style={{ fontWeight: "700" }}>{b.forte2}</strong>
                                  {b.pos2}
                                </p>
                              )}
                              {b.ehCaixa && (
                                <div style={{ margin: "16px auto 22px", maxWidth: "560px", border: "1px solid #151515", borderRadius: "4px", padding: "12px 18px", textAlign: "center", fontSize: "16px", lineHeight: "1.3" }}>{b.texto}</div>
                              )}
                              {b.ehData && (
                                <p style={{ fontSize: "16px", lineHeight: "1.27", margin: "24px 0 0" }}>{b.texto}</p>
                              )}
                              {b.ehAssin && (
                                <div style={{ marginTop: "58px", textAlign: "center" }}>
                                  <div style={{ width: "430px", margin: "0 auto 7px", borderTop: "1px solid #151515" }}></div>
                                  <div style={{ fontSize: "18px", fontWeight: "700", lineHeight: "1.2", maxWidth: "560px", margin: "0 auto", textWrap: "balance" }}>{b.nome}</div>
                                  <div style={{ fontSize: "16px", marginTop: "2px" }}>{b.docLinha}</div>
                                </div>
                              )}
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        {v.semDocumentos && (
          <div style={{ background: "#fff", borderRadius: "12px", padding: "30px", color: "#777", fontSize: "15px" }}>Selecione ao menos um documento no passo Início.</div>
        )}
      </section>
    </main>
  );
}

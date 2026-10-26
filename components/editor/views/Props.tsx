/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from "react";
import type { Vals } from "../types";

export function Props({ v }: { v: Vals }) {
  return (
    <main className="no-print" style={{ flex: "1", padding: "28px 24px 80px", maxWidth: "1180px", width: "100%", margin: "0 auto" }}>
      <button className="hv1" onClick={v.goHome} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", fontSize: "14px", padding: "0 0 12px", display: "flex", alignItems: "center", gap: "6px" }}>← Início</button>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "16px", marginBottom: "20px" }}>
        <div style={{ flex: "1", minWidth: "240px" }}>
          <h1 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "38px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Propostas</h1>
          <p style={{ margin: "4px 0 0", color: "#666", fontSize: "15px" }}>Abra uma anterior para duplicar, ou comece do zero por tipo.</p>
        </div>
        <input value={v.propBusca ?? ""} onChange={v.onPropBusca} placeholder="Buscar cliente…" style={{ minWidth: "190px", border: "1px solid #DDD", background: "#fff", borderRadius: "10px", padding: "11px 14px", fontSize: "15px", outline: "none" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "12px", marginBottom: "26px" }}>
        <button className="hv2" onClick={v.novaPropSistema} style={{ textAlign: "left", cursor: "pointer", background: "#151515", color: "#fff", border: "none", borderRadius: "12px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "3px" }}>
          <span style={{ fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#FF8D02", fontWeight: "700" }}>Nova</span>
          <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "24px", fontWeight: "800", lineHeight: "1.05" }}>Sistema de energia solar</span>
        </button>
        <button className="hv6" onClick={v.novaPropCarregador} style={{ textAlign: "left", cursor: "pointer", background: "#fff", border: "1px solid #E2E2E5", borderRadius: "12px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "3px" }}>
          <span style={{ fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#A65A00", fontWeight: "700" }}>Nova</span>
          <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "24px", fontWeight: "800", lineHeight: "1.05" }}>Carregador veicular</span>
        </button>
        <button className="hv6" onClick={v.novaPropServico} style={{ textAlign: "left", cursor: "pointer", background: "#fff", border: "1px solid #E2E2E5", borderRadius: "12px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "3px" }}>
          <span style={{ fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#A65A00", fontWeight: "700" }}>Nova</span>
          <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "24px", fontWeight: "800", lineHeight: "1.05" }}>Serviço diverso</span>
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "14px" }}>
        {(v.listaPropostas as any[]).map((pr: any, i4: number) => (
          <Fragment key={i4}>
            <article className="hv4" style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 16px 13px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ flex: "1", minWidth: "0" }}>
                  <div style={{ fontFamily: "var(--font-barlow-semi), sans-serif", fontSize: "20px", fontWeight: "700", lineHeight: "1.15", textWrap: "pretty" }}>{pr.cliente}</div>
                  <div style={{ fontSize: "13px", color: "#777", marginTop: "2px" }}>{pr.potencia}</div>
                </div>
                <span style={{ flex: "0 0 auto", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: "700", borderRadius: "999px", padding: "4px 9px", background: pr.tagBg, color: pr.tagFg }}>{pr.tipoLabel}</span>
              </div>
              <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "27px", fontWeight: "800", lineHeight: "1" }}>{pr.valor}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", fontSize: "12.5px", color: "#6B6B6B", borderTop: "1px solid #EEE", paddingTop: "9px" }}>
                <div>Gerente{" "}{pr.gerente}</div>
                <div></div>
                <div>Criada{" "}{pr.criada}</div>
                <div>Alterada{" "}{pr.alterada}</div>
              </div>
              <div style={{ display: "flex", gap: "7px", marginTop: "2px" }}>
                <button className="hv5" onClick={pr.onDuplicar} style={{ flex: "1", cursor: "pointer", background: "#F3F3F5", border: "1px solid #E2E2E5", borderRadius: "8px", padding: "8px", fontSize: "13.5px", fontWeight: "600" }}>Duplicar</button>
                <button className="hv5" onClick={pr.onAbrir} style={{ flex: "1", cursor: "pointer", background: "#F3F3F5", border: "1px solid #E2E2E5", borderRadius: "8px", padding: "8px", fontSize: "13.5px", fontWeight: "600" }}>Abrir</button>
                <button className="hv2" onClick={pr.onPdf} style={{ flex: "1", cursor: "pointer", background: "#151515", color: "#fff", border: "none", borderRadius: "8px", padding: "8px", fontSize: "13.5px", fontWeight: "600" }}>PDF</button>
              </div>
            </article>
          </Fragment>
        ))}
      </div>
      {v.propostasVazio && (
        <div style={{ background: "#fff", border: "1px dashed #D6D6DA", borderRadius: "13px", padding: "44px 20px", textAlign: "center", color: "#777" }}>Nenhuma proposta ainda. Escolha um tipo acima.</div>
      )}
    </main>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from "react";
import type { Vals } from "../types";

export function Lista({ v }: { v: Vals }) {
  return (
    <main className="no-print" style={{ flex: "1", padding: "28px 24px 80px", maxWidth: "1180px", width: "100%", margin: "0 auto" }}>
      <button className="hv1" onClick={v.goHome} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", fontSize: "14px", padding: "0 0 12px", display: "flex", alignItems: "center", gap: "6px" }}>← Início</button>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "16px", marginBottom: "22px" }}>
        <div style={{ flex: "1", minWidth: "240px" }}>
          <h1 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "38px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Faturas</h1>
          <p style={{ margin: "4px 0 0", color: "#666", fontSize: "15px" }}>Abra uma anterior para duplicar, ou comece do zero.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button className="hv2" onClick={v.goLote} style={{ cursor: "pointer", background: "#151515", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 18px", fontSize: "15px", fontWeight: "600" }}>Gerar lote do mês</button>
          <button className="hv3" onClick={v.novaFatura} style={{ cursor: "pointer", background: "#FF8D02", color: "#151515", border: "none", borderRadius: "10px", padding: "12px 18px", fontSize: "15px", fontWeight: "700" }}>+ Nova fatura</button>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", marginBottom: "18px" }}>
        <input value={v.busca ?? ""} onChange={v.onBusca} placeholder="Buscar cliente…" style={{ flex: "1", minWidth: "200px", maxWidth: "320px", border: "1px solid #DDD", background: "#fff", borderRadius: "10px", padding: "11px 14px", fontSize: "15px", outline: "none" }} />
        <div style={{ display: "flex", gap: "6px", background: "#E4E4E7", padding: "4px", borderRadius: "10px" }}>
          {(v.filtros as any[]).map((f: any, i5: number) => (
            <Fragment key={i5}>
              <button onClick={f.onClick} style={{ cursor: "pointer", border: "none", borderRadius: "7px", padding: "8px 14px", fontSize: "14px", fontWeight: "600", background: f.bg, color: f.fg }}>{f.label}</button>
            </Fragment>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "14px" }}>
        {(v.listaFaturas as any[]).map((inv: any, i4: number) => (
          <Fragment key={i4}>
            <article className="hv4" style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 16px 13px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ flex: "1", minWidth: "0" }}>
                  <div style={{ fontFamily: "var(--font-barlow-semi), sans-serif", fontSize: "20px", fontWeight: "700", lineHeight: "1.15", textWrap: "pretty" }}>{inv.nome}</div>
                  <div style={{ fontSize: "13px", color: "#777", marginTop: "2px" }}>{inv.docLinha}</div>
                </div>
                <span style={{ flex: "0 0 auto", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "700", borderRadius: "999px", padding: "4px 9px", background: inv.tagBg, color: inv.tagFg }}>{inv.tag}</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "27px", fontWeight: "800", lineHeight: "1" }}>{inv.totalStr}</div>
                <div style={{ fontSize: "13px", color: "#777" }}>{inv.refLabel}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", fontSize: "12.5px", color: "#6B6B6B", borderTop: "1px solid #EEE", paddingTop: "9px" }}>
                <div>
                  Vence{" "}
                  <strong style={{ color: "#151515", fontWeight: "600" }}>{inv.venc}</strong>
                </div>
                <div>{inv.consumoLabel}</div>
                <div>Criada{" "}{inv.criada}</div>
                <div>Alterada{" "}{inv.alterada}</div>
              </div>
              <div style={{ display: "flex", gap: "7px", marginTop: "2px" }}>
                <button className="hv5" onClick={inv.onDuplicar} style={{ flex: "1", cursor: "pointer", background: "#F3F3F5", border: "1px solid #E2E2E5", borderRadius: "8px", padding: "8px", fontSize: "13.5px", fontWeight: "600" }}>Duplicar</button>
                <button className="hv5" onClick={inv.onAbrir} style={{ flex: "1", cursor: "pointer", background: "#F3F3F5", border: "1px solid #E2E2E5", borderRadius: "8px", padding: "8px", fontSize: "13.5px", fontWeight: "600" }}>Abrir</button>
                <button className="hv2" onClick={inv.onPdf} style={{ flex: "1", cursor: "pointer", background: "#151515", color: "#fff", border: "none", borderRadius: "8px", padding: "8px", fontSize: "13.5px", fontWeight: "600" }}>PDF</button>
              </div>
            </article>
          </Fragment>
        ))}
      </div>
      {v.listaVazia && (
        <div style={{ background: "#fff", border: "1px dashed #D6D6DA", borderRadius: "13px", padding: "44px 20px", textAlign: "center", color: "#777" }}>Nenhuma fatura encontrada com esse filtro.</div>
      )}
    </main>
  );
}

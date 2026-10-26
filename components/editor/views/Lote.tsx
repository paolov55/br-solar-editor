/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from "react";
import type { Vals } from "../types";

export function Lote({ v }: { v: Vals }) {
  return (
    <main className="no-print" style={{ flex: "1", padding: "28px 24px 80px", maxWidth: "880px", width: "100%", margin: "0 auto" }}>
      <button className="hv1" onClick={v.goFaturas} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", fontSize: "14px", padding: "0 0 12px", display: "flex", alignItems: "center", gap: "6px" }}>← Faturas</button>
      <h1 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "38px", fontWeight: "800", margin: "0 0 4px", lineHeight: "1" }}>Lote do mês</h1>
      <p style={{ margin: "0 0 22px", color: "#666", fontSize: "15px" }}>Endereço, tipo, desconto e vencimento vêm do cadastro. Você só informa o consumo.</p>
      <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 18px", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end", marginBottom: "16px" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
          Mês de referência
          <input type="month" value={v.loteMes ?? ""} onChange={v.onLoteMes} style={{ border: "1px solid #DDD", borderRadius: "9px", padding: "10px 12px", fontSize: "15px", outline: "none" }} />
        </label>
        <div style={{ flex: "1" }}></div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", fontWeight: "700" }}>Total do lote</div>
          <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "30px", fontWeight: "800", lineHeight: "1" }}>{v.loteTotal}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
        {(v.loteLinhas as any[]).map((row: any, i4: number) => (
          <Fragment key={i4}>
            <div style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "12px", padding: "13px 16px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px", borderLeft: `4px solid ${row.barra}` }}>
              <input type="checkbox" checked={!!(row.incluir)} onChange={row.onToggle} style={{ width: "18px", height: "18px", accentColor: "#FF8D02", cursor: "pointer" }} />
              <div style={{ flex: "1", minWidth: "170px" }}>
                <div style={{ fontFamily: "var(--font-barlow-semi), sans-serif", fontSize: "18px", fontWeight: "700", lineHeight: "1.2" }}>{row.nome}</div>
                <div style={{ fontSize: "12.5px", color: "#777" }}>{row.detalhe}</div>
              </div>
              {row.pedeConsumo && (
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#666", fontWeight: "600" }}>
                  Consumo
                  <input type="number" value={row.kwh ?? ""} onChange={row.onKwh} placeholder="0" style={{ width: "104px", border: "1px solid #DDD", borderRadius: "9px", padding: "9px 11px", fontSize: "15px", textAlign: "right", outline: "none" }} />
                  <span style={{ color: "#888", fontWeight: "500" }}>kWh</span>
                </label>
              )}
              <div style={{ minWidth: "104px", textAlign: "right", fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "22px", fontWeight: "800" }}>{row.totalStr}</div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
        <button className="hv3" onClick={v.gerarLote} style={{ cursor: "pointer", background: "#FF8D02", color: "#151515", border: "none", borderRadius: "10px", padding: "14px 22px", fontSize: "16px", fontWeight: "700" }}>{v.loteBotao}</button>
        <button className="hv8" onClick={v.goFaturas} style={{ cursor: "pointer", background: "#fff", border: "1px solid #DDD", borderRadius: "10px", padding: "14px 22px", fontSize: "16px", fontWeight: "600" }}>Cancelar</button>
      </div>
    </main>
  );
}

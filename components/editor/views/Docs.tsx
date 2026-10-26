/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from "react";
import type { Vals } from "../types";

export function Docs({ v }: { v: Vals }) {
  return (
    <main className="no-print" style={{ flex: "1", padding: "28px 24px 80px", maxWidth: "1180px", width: "100%", margin: "0 auto" }}>
      <button className="hv1" onClick={v.goHome} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", fontSize: "14px", padding: "0 0 12px", display: "flex", alignItems: "center", gap: "6px" }}>← Início</button>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "16px", marginBottom: "22px" }}>
        <div style={{ flex: "1", minWidth: "240px" }}>
          <h1 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "38px", fontWeight: "800", margin: "0", lineHeight: "1" }}>Documentação</h1>
          <p style={{ margin: "4px 0 0", color: "#666", fontSize: "15px" }}>Um cliente, um pacote: procuração, termo de adesão e contrato.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input value={v.docBusca ?? ""} onChange={v.onDocBusca} placeholder="Buscar cliente…" style={{ minWidth: "190px", border: "1px solid #DDD", background: "#fff", borderRadius: "10px", padding: "11px 14px", fontSize: "15px", outline: "none" }} />
          <button className="hv3" onClick={v.novoPacoteDoc} style={{ cursor: "pointer", background: "#FF8D02", color: "#151515", border: "none", borderRadius: "10px", padding: "12px 18px", fontSize: "15px", fontWeight: "700" }}>+ Novo pacote</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "14px" }}>
        {(v.listaPacotes as any[]).map((pk: any, i4: number) => (
          <Fragment key={i4}>
            <article className="hv4" style={{ background: "#fff", border: "1px solid #E2E2E5", borderRadius: "13px", padding: "16px 16px 13px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ flex: "1", minWidth: "0" }}>
                  <div style={{ fontFamily: "var(--font-barlow-semi), sans-serif", fontSize: "20px", fontWeight: "700", lineHeight: "1.15", textWrap: "pretty" }}>{pk.nome}</div>
                  <div style={{ fontSize: "13px", color: "#777", marginTop: "2px" }}>{pk.docLinha}</div>
                </div>
                <span style={{ flex: "0 0 auto", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: "700", borderRadius: "999px", padding: "4px 9px", background: "#F1F1F4", color: "#5A5A62" }}>{pk.tipoTag}</span>
              </div>
              <div style={{ fontSize: "14px", color: "#151515", fontWeight: "600" }}>{pk.inclusos}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", fontSize: "12.5px", color: "#6B6B6B", borderTop: "1px solid #EEE", paddingTop: "9px" }}>
                <div>Criado{" "}{pk.criada}</div>
                <div>Alterado{" "}{pk.alterada}</div>
              </div>
              <div style={{ display: "flex", gap: "7px", marginTop: "2px" }}>
                <button className="hv5" onClick={pk.onDuplicar} style={{ flex: "1", cursor: "pointer", background: "#F3F3F5", border: "1px solid #E2E2E5", borderRadius: "8px", padding: "8px", fontSize: "13.5px", fontWeight: "600" }}>Duplicar</button>
                <button className="hv5" onClick={pk.onAbrir} style={{ flex: "1", cursor: "pointer", background: "#F3F3F5", border: "1px solid #E2E2E5", borderRadius: "8px", padding: "8px", fontSize: "13.5px", fontWeight: "600" }}>Abrir</button>
                <button className="hv2" onClick={pk.onPdf} style={{ flex: "1", cursor: "pointer", background: "#151515", color: "#fff", border: "none", borderRadius: "8px", padding: "8px", fontSize: "13.5px", fontWeight: "600" }}>PDF</button>
              </div>
            </article>
          </Fragment>
        ))}
      </div>
      {v.pacotesVazio && (
        <div style={{ background: "#fff", border: "1px dashed #D6D6DA", borderRadius: "13px", padding: "44px 20px", textAlign: "center", color: "#777" }}>Nenhum pacote ainda. Crie o primeiro com o botão acima.</div>
      )}
    </main>
  );
}

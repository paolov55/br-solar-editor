import type { Vals } from "../types";

export function Modal({ v }: { v: Vals }) {
  return (
    <div className="no-print" style={{ position: "fixed", inset: "0", background: "rgba(21,21,21,0.5)", zIndex: "60", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "15px", padding: "26px 26px 22px", maxWidth: "420px", width: "100%", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
        <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "26px", fontWeight: "800", lineHeight: "1.1" }}>{v.modalTitulo}</div>
        <p style={{ margin: "8px 0 20px", color: "#666", fontSize: "15px", lineHeight: "1.4", textWrap: "pretty" }}>{v.modalTexto}</p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
          <button className="hv8" onClick={v.modalNao} style={{ cursor: "pointer", background: "#fff", border: "1px solid #DDD", borderRadius: "9px", padding: "11px 18px", fontSize: "15px", fontWeight: "600" }}>{v.modalNaoLabel}</button>
          <button className="hv3" onClick={v.modalSim} style={{ cursor: "pointer", background: "#FF8D02", color: "#151515", border: "none", borderRadius: "9px", padding: "11px 18px", fontSize: "15px", fontWeight: "700" }}>{v.modalSimLabel}</button>
        </div>
      </div>
    </div>
  );
}

import type { Vals } from "../types";

export function Toast({ v }: { v: Vals }) {
  return (
    <div className="no-print" style={{ position: "fixed", left: "50%", bottom: "26px", transform: "translateX(-50%)", zIndex: "70", background: "#151515", color: "#fff", borderRadius: "10px", padding: "13px 20px", fontSize: "15px", fontWeight: "600", boxShadow: "0 12px 30px rgba(0,0,0,0.3)" }}>{v.toast}</div>
  );
}

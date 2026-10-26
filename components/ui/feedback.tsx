"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type ModalDef = {
  titulo: string;
  texto?: string;
  acoes: { label: string; primario?: boolean; onClick: () => void }[];
};

type Ctx = { toast: (msg: string) => void; modal: (m: ModalDef) => void; fechar: () => void };
const FeedbackCtx = createContext<Ctx | null>(null);

export function useFeedback() {
  const c = useContext(FeedbackCtx);
  if (!c) throw new Error("useFeedback fora do FeedbackProvider");
  return c;
}

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState("");
  const [m, setM] = useState<ModalDef | null>(null);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);

  const toast = useCallback((texto: string) => {
    setMsg(texto);
    clearTimeout(t.current);
    t.current = setTimeout(() => setMsg(""), 2600);
  }, []);

  return (
    <FeedbackCtx.Provider value={{ toast, modal: setM, fechar: () => setM(null) }}>
      {children}
      {m && (
        <div className="no-print fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full flex flex-col gap-3">
            <h3 className="font-cond text-[26px] font-extrabold leading-none m-0">{m.titulo}</h3>
            {m.texto && <p className="m-0 text-[15px] text-[#555] leading-snug">{m.texto}</p>}
            <div className="flex gap-2 justify-end mt-2">
              {m.acoes.map((a) => (
                <button
                  key={a.label}
                  onClick={() => {
                    setM(null);
                    a.onClick();
                  }}
                  className={
                    "cursor-pointer rounded-lg px-4 py-2.5 text-[14.5px] font-semibold border " +
                    (a.primario ? "bg-brand text-ink border-brand font-bold" : "bg-[#f3f3f5] border-line")
                  }
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {msg && (
        <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink text-white rounded-full px-5 py-3 text-[14.5px] shadow-lg">
          {msg}
        </div>
      )}
    </FeedbackCtx.Provider>
  );
}

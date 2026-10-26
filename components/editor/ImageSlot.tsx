"use client";

import { useRef, useState, useSyncExternalStore, type CSSProperties } from "react";

const CHAVE = (id: string) => `brsolar.img.${id}`;
const MAX = 1600;

// Imagens ficam no localStorage; `memoria` cobre o caso de o storage estar indisponível ou cheio.
const memoria = new Map<string, string>();
const ouvintes = new Set<() => void>();
const assinar = (cb: () => void) => {
  ouvintes.add(cb);
  return () => void ouvintes.delete(cb);
};
function ler(id: string) {
  try {
    return localStorage.getItem(CHAVE(id)) || memoria.get(id) || "";
  } catch {
    return memoria.get(id) || "";
  }
}
function gravar(id: string, dados: string) {
  if (dados) memoria.set(id, dados);
  else memoria.delete(id);
  try {
    if (dados) localStorage.setItem(CHAVE(id), dados);
    else localStorage.removeItem(CHAVE(id));
  } catch {
    /* sem storage, ou imagem grande demais: vale só nesta sessão */
  }
  ouvintes.forEach((cb) => cb());
}

/** Reduz a imagem para caber no localStorage. */
function reduzir(arquivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(arquivo);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, MAX / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.88));
    };
    img.onerror = reject;
    img.src = url;
  });
}

/** Espaço para uma imagem que o usuário escolhe, arrasta ou cola (ex.: print da planilha). */
export function ImageSlot({
  id,
  placeholder,
  radius = 0,
  style,
}: {
  id: string;
  placeholder: string;
  radius?: number;
  style?: CSSProperties;
}) {
  const src = useSyncExternalStore(assinar, () => ler(id), () => "");
  const [sobre, setSobre] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  async function receber(arquivo?: File | null) {
    if (!arquivo || !arquivo.type.startsWith("image/")) return;
    gravar(id, await reduzir(arquivo));
  }

  return (
    <div
      className={src ? "" : "slot-vazio"}
      style={{ position: "relative", borderRadius: radius, overflow: "hidden", ...style }}
      onDragOver={(e) => {
        e.preventDefault();
        setSobre(true);
      }}
      onDragLeave={() => setSobre(false)}
      onDrop={(e) => {
        e.preventDefault();
        setSobre(false);
        receber(e.dataTransfer.files[0]);
      }}
      onPaste={(e) => receber(Array.from(e.clipboardData.files)[0])}
      tabIndex={0}
    >
      {src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <button
            type="button"
            className="no-print"
            onClick={() => gravar(id, "")}
            style={{
              position: "absolute", top: 6, right: 6, cursor: "pointer", border: "none", borderRadius: 6,
              background: "rgba(21,21,21,0.75)", color: "#fff", fontSize: 12, fontWeight: 600, padding: "4px 8px",
            }}
          >
            Trocar
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          style={{
            width: "100%", height: "100%", cursor: "pointer", borderRadius: radius,
            border: `1.5px dashed ${sobre ? "#FF8D02" : "#C9C9CE"}`,
            background: sobre ? "#FFF6EA" : "#F6F6F8", color: "#8A8A8A", fontSize: 13, fontWeight: 600,
            padding: 12, textAlign: "center",
          }}
        >
          {placeholder}
          <div style={{ fontWeight: 500, fontSize: 12, marginTop: 4 }}>Clique, arraste ou cole a imagem</div>
        </button>
      )}
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          receber(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

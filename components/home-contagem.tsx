"use client";

import { useSyncExternalStore } from "react";

const semAssinatura = () => () => {};

function contar(chave: string, campo: string, padrao: string) {
  try {
    const salvo = JSON.parse(localStorage.getItem(chave) || "null");
    const n = salvo?.[campo]?.length;
    return n ? String(n) : padrao;
  } catch {
    return padrao;
  }
}

/** Quantos itens o editor guardou neste navegador (o localStorage só existe no cliente). */
export function Contagem({ chave, campo, padrao = "0", sufixo }: { chave: string; campo: string; padrao?: string; sufixo: string }) {
  const n = useSyncExternalStore(semAssinatura, () => contar(chave, campo, padrao), () => "…");
  return (
    <span>
      {n} {sufixo}
    </span>
  );
}

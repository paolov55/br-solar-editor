"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

export function BotaoAceitar() {
  const [aceito, setAceito] = useState(false);
  const { pending } = useFormStatus();

  return (
    <>
      <label className="flex items-start gap-2.5 text-[14.5px] cursor-pointer">
        <input
          type="checkbox"
          name="aceito"
          checked={aceito}
          onChange={(e) => setAceito(e.target.checked)}
          className="mt-1 w-4 h-4 accent-[#ff8d02]"
        />
        <span>Li e aceito os Termos de uso da plataforma BR Solar Editor.</span>
      </label>
      <button
        disabled={!aceito || pending}
        className="bg-brand text-ink font-bold rounded-lg py-3 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-[#ffa133]"
      >
        {pending ? "Salvando…" : "Aceitar e continuar"}
      </button>
    </>
  );
}

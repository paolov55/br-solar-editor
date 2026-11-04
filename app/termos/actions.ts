"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { exigirSessao } from "@/lib/auth/sessao";
import { db } from "@/lib/supabase/admin";
import { TERMOS_VERSAO } from "@/lib/termos";

export async function aceitarTermos(formData: FormData) {
  const sessao = await exigirSessao("usuario");
  if (formData.get("aceito") !== "on") redirect("/termos");

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null;

  const { error } = await db()
    .from("termos_aceites")
    .upsert(
      { login: sessao.login, versao: TERMOS_VERSAO, ip, user_agent: h.get("user-agent") },
      { onConflict: "login,versao", ignoreDuplicates: true },
    );
  if (error) throw new Error("termos_aceites: " + error.message);

  redirect("/");
}

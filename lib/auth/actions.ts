"use server";

import { redirect } from "next/navigation";
import { encerrarSessao } from "./sessao";

export async function sair() {
  await encerrarSessao();
  redirect("/login");
}

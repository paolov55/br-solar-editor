import Link from "next/link";
import { lerSessao } from "@/lib/auth/sessao";
import { sair } from "@/lib/auth/actions";

const pilula =
  "bg-[#222] border border-[#333] rounded-full px-3.5 py-1.5 text-[13px] text-[#c9c9c9] hover:text-white";

export async function MenuSessao() {
  const sessao = await lerSessao();
  if (!sessao) return null;
  return (
    <nav className="flex items-center gap-2">
      <Link href={sessao.papel === "admin" ? "/admin" : "/pagamentos"} className={pilula} style={{ color: "#c9c9c9" }}>
        {sessao.papel === "admin" ? "Admin" : "Pagamentos"}
      </Link>
      <form action={sair}>
        <button className={pilula + " cursor-pointer"}>Sair</button>
      </form>
    </nav>
  );
}

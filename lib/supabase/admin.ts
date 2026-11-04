import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Acesso apenas pelo servidor, com a service role key (ignora RLS).
// Nunca importe este arquivo em componentes "use client".
let cliente: SupabaseClient | undefined;

export function db() {
  if (!cliente) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !chave) throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY não configurados.");
    cliente = createClient(url, chave, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        // O Next memoiza GETs idênticos dentro de uma mesma renderização, e o Supabase lê por GET:
        // sem isto, reler uma cobrança logo depois de gravá-la devolveria o valor antigo.
        // Passar um AbortSignal é a forma documentada de desligar a memoização.
        fetch: (input, init) => fetch(input, { ...init, cache: "no-store", signal: init?.signal ?? new AbortController().signal }),
      },
    });
  }
  return cliente;
}

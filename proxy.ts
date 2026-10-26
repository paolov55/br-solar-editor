import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { LOGIN_ATIVO, testeExpirado } from "@/lib/trial";

export async function proxy(request: NextRequest) {
  const expirado = request.nextUrl.pathname.startsWith("/expirado");
  if (testeExpirado() !== expirado) {
    const url = request.nextUrl.clone();
    url.pathname = expirado ? "/" : "/expirado";
    return NextResponse.redirect(url);
  }
  if (expirado) return NextResponse.next({ request });

  if (!LOGIN_ATIVO) {
    if (!request.nextUrl.pathname.startsWith("/login")) return NextResponse.next({ request });
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const noLogin = request.nextUrl.pathname.startsWith("/login");
  if (!user && !noLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  if (user && noLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:png|jpg|svg|ico)$).*)"],
};

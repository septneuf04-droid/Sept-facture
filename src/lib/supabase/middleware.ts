import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;

  // 1. Protection absolue : laisser passer immédiatement les fichiers statiques et assets internes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/fonts") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return response;
  }

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isVerifyEmailRoute = pathname.startsWith("/verify-email");
  const isCallback = pathname.startsWith("/auth/callback") || pathname.startsWith("/auth/confirm");
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/privacy") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml";

  if (isCallback) {
    return response;
  }

  // Ne jamais bloquer les requêtes de prefetch RSC
  const isPrefetch =
    request.headers.get("next-router-prefetch") === "1" ||
    request.headers.get("purpose") === "prefetch";

  if (isPrefetch) {
    return response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("your-project-id")) {
    return response;
  }

  // Vérifier rapidement la présence d'un cookie d'authentification Supabase
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (c) => c.name.includes("-auth-token") || c.name.startsWith("sb-")
  );

  // Si aucun cookie d'authentification n'existe
  if (!hasAuthCookie) {
    if (isAuthRoute || isPublicRoute || isVerifyEmailRoute) {
      return response;
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Un cookie d'authentification existe : validation cryptographique du jeton
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: "",
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: "",
          ...options,
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Utilisateur non valide ou session expirée
  if (!user && !isAuthRoute && !isPublicRoute && !isVerifyEmailRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Utilisateur connecté mais email NON confirmé
  if (user && !user.email_confirmed_at) {
    if (!isVerifyEmailRoute && !isPublicRoute && !isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/verify-email";
      return NextResponse.redirect(url);
    }
  }

  // Utilisateur connecté ET confirmé tentant d'accéder aux pages de login/signup
  if (user && user.email_confirmed_at && (isAuthRoute || isVerifyEmailRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

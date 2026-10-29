import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  if (token_hash && type) {
    const supabase = createServerSupabaseClient();
    if (supabase) {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });

      if (!error) {
        redirectTo.searchParams.set("verified", "true");
        return NextResponse.redirect(redirectTo);
      }
    }
  }

  // En cas d'erreur, token expiré ou lien déjà utilisé
  redirectTo.pathname = "/login";
  redirectTo.searchParams.set("error", "invalid_or_expired_token");
  return NextResponse.redirect(redirectTo);
}


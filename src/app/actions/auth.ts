"use server";

import crypto from "crypto";
import { headers } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { registerSchema, RegisterInput } from "@/lib/validation/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "yopmail.com",
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "trashmail.com",
  "10minutemail.com",
  "sharklasers.com",
  "getnada.com",
  "dispostable.com",
]);

/**
 * Vérification HaveIBeenPwned en k-anonymity.
 * Envoie uniquement les 5 premiers caractères du hash SHA-1 (aucune divulgation du mot de passe).
 */
async function isPasswordPwned(password: string): Promise<boolean> {
  try {
    const sha1 = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { "Add-Padding": "true" },
      cache: "no-store",
    });

    if (!res.ok) return false;

    const text = await res.text();
    const regex = new RegExp(`^${suffix}:`, "m");
    return regex.test(text);
  } catch (err) {
    console.error("[HIBP_CHECK_ERROR]", err);
    return false;
  }
}

export type AuthActionResult = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function registerUserAction(input: RegisterInput): Promise<AuthActionResult> {
  const reqHeaders = headers();
  const ip =
    reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    reqHeaders.get("x-real-ip") ||
    "127.0.0.1";

  // 1. Rate limiting par IP (max 5 tentatives par minute)
  const rateLimit = checkRateLimit(`register_${ip}`, 5, 60_000);
  if (!rateLimit.allowed) {
    return {
      success: false,
      message: `Trop de tentatives de création de compte. Veuillez patienter ${rateLimit.retryAfter} secondes.`,
    };
  }

  // 2. Validation Zod côté serveur
  const validation = registerSchema.safeParse(input);
  if (!validation.success) {
    const fieldErrors: Record<string, string> = {};
    validation.error.errors.forEach((err) => {
      const field = err.path[0] as string;
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = err.message;
      }
    });
    return {
      success: false,
      message: "Veuillez corriger les informations saisies.",
      fieldErrors,
    };
  }

  const { email, password, fullName, companyName } = validation.data;

  // 3. Blocage des domaines d'emails jetables
  const domain = email.split("@")[1];
  if (domain && DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      success: false,
      fieldErrors: {
        email: "Les adresses emails temporaires ou jetables ne sont pas autorisées.",
      },
    };
  }

  // 4. Contrôle HaveIBeenPwned (k-anonymity)
  const pwned = await isPasswordPwned(password);
  if (pwned) {
    return {
      success: false,
      fieldErrors: {
        password:
          "Ce mot de passe figure dans des bases de données compromises connues. Veuillez en choisir un autre.",
      },
    };
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: "Configuration d'authentification indisponible.",
    };
  }

  const origin = reqHeaders.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // 5. Inscription via Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
      data: {
        full_name: fullName,
        company_name: companyName,
      },
    },
  });

  if (error) {
    return {
      success: true,
      message: "Si cette adresse est valide, un email de confirmation vient de vous être envoyé.",
    };
  }

  // Protection contre l'énumération de comptes si l'email existe déjà
  if (data?.user?.identities && data.user.identities.length === 0) {
    return {
      success: true,
      message: "Si cette adresse est valide, un email de confirmation vient de vous être envoyé.",
    };
  }

  return {
    success: true,
    message: "Votre compte a été initialisé. Veuillez vérifier votre boîte mail pour confirmer votre inscription.",
  };
}

export async function resendVerificationEmailAction(email: string): Promise<AuthActionResult> {
  const reqHeaders = headers();
  const ip =
    reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    reqHeaders.get("x-real-ip") ||
    "127.0.0.1";

  // Rate limiting strict : 1 renvoi toutes les 60 secondes par IP/email
  const rateLimit = checkRateLimit(`resend_${ip}_${email.toLowerCase().trim()}`, 2, 60_000);
  if (!rateLimit.allowed) {
    return {
      success: false,
      message: `Veuillez patienter ${rateLimit.retryAfter}s avant de demander un nouvel email.`,
    };
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return { success: false, message: "Service indisponible." };
  }

  const origin = reqHeaders.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  await supabase.auth.resend({
    type: "signup",
    email: email.trim().toLowerCase(),
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  return {
    success: true,
    message: "Si cette adresse est enregistrée, un nouvel email de confirmation a été envoyé.",
  };
}


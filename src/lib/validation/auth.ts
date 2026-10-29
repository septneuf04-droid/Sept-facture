import { z } from "zod";

const FORBIDDEN_PASSWORDS = [
  "password1234",
  "motdepasse123",
  "azertyuiop12",
  "septfacture123",
  "123456789012",
  "adminadmin12",
];

export const passwordSchema = z
  .string()
  .min(12, "Le mot de passe doit comporter au moins 12 caractères")
  .max(128, "Le mot de passe ne doit pas dépasser 128 caractères")
  .regex(/[a-z]/, "Au moins une lettre minuscule requise")
  .regex(/[A-Z]/, "Au moins une lettre majuscule requise")
  .regex(/[0-9]/, "Au moins un chiffre requis")
  .regex(/[^a-zA-Z0-9]/, "Au moins un symbole spécial requis (@, #, $, %, etc.)");

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Le nom complet est obligatoire (min 2 caractères)")
      .max(100, "Nom trop long"),
    companyName: z
      .string()
      .trim()
      .min(2, "Le nom de l'entreprise est obligatoire")
      .max(100, "Nom d'entreprise trop long"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Format d'adresse email invalide")
      .max(255, "Email trop long"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Les deux mots de passe ne correspondent pas",
      });
    }

    const emailPrefix = data.email.split("@")[0]?.toLowerCase();
    if (emailPrefix && emailPrefix.length >= 3 && data.password.toLowerCase().includes(emailPrefix)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Le mot de passe ne doit pas contenir votre identifiant email",
      });
    }

    if (data.password.toLowerCase().includes("septfacture")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Le mot de passe ne doit pas contenir le nom du service",
      });
    }

    if (FORBIDDEN_PASSWORDS.includes(data.password.toLowerCase())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Ce mot de passe est trop vulnérable et figure dans les listes courantes",
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;


"use client";

import React, { useState, useMemo } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordFieldProps {
  id?: string;
  name?: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  autoComplete?: "new-password" | "current-password";
  error?: string;
  showStrengthMeter?: boolean;
}

export function PasswordField({
  id = "password",
  name = "password",
  label,
  value,
  onChange,
  autoComplete = "new-password",
  error,
  showStrengthMeter = false,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Critères de conformité OWASP / NIST
  const criteria = useMemo(() => {
    return [
      { id: "len", label: "12 caractères minimum", valid: value.length >= 12 },
      { id: "upper", label: "Une lettre majuscule (A-Z)", valid: /[A-Z]/.test(value) },
      { id: "lower", label: "Une lettre minuscule (a-z)", valid: /[a-z]/.test(value) },
      { id: "num", label: "Un chiffre (0-9)", valid: /[0-9]/.test(value) },
      { id: "sym", label: "Un symbole spécial (@, #, $, etc.)", valid: /[^a-zA-Z0-9]/.test(value) },
    ];
  }, [value]);

  const score = criteria.filter((c) => c.valid).length;

  const strengthColor = useMemo(() => {
    if (score <= 2) return "bg-rose-500";
    if (score <= 4) return "bg-amber-500";
    return "bg-emerald-500";
  }, [score]);

  return (
    <div className="space-y-1.5">
      <div className="notched-input-group relative">
        <label htmlFor={id} className="notched-label">
          {label} *
        </label>
        <div className="relative">
          <input
            id={id}
            name={name}
            type={showPassword ? "text" : "password"}
            required
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoComplete={autoComplete}
            aria-invalid={Boolean(error)}
            aria-describedby={`${id}-feedback`}
            className="notched-input pr-10 text-neutral-900 dark:text-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Jauge de robustesse réactive */}
      {showStrengthMeter && value.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden flex gap-1">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <div
                key={lvl}
                className={cn(
                  "h-full flex-1 transition-all duration-300",
                  score >= lvl ? strengthColor : "bg-transparent"
                )}
              />
            ))}
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]" aria-live="polite">
            {criteria.map((c) => (
              <li
                key={c.id}
                className={cn(
                  "flex items-center gap-1.5 transition-colors",
                  c.valid ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-neutral-400"
                )}
              >
                {c.valid ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
                <span>{c.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <p id={`${id}-feedback`} className="text-xs text-rose-500 font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}


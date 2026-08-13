"use client";

import { useState } from "react";
import { Mail, ArrowRight, Loader2 } from "lucide-react";

interface LoginFormProps {
  locale: string;
  onSignIn: (formData: FormData) => Promise<void>;
  t: (en: string, es: string) => string;
}

export default function LoginForm({ locale, onSignIn, t }: LoginFormProps) {
  const [pending, setPending] = useState(false);

  return (
    <form
      action={async (fd) => {
        setPending(true);
        await onSignIn(fd);
        setPending(false);
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
          {t("Email address", "Correo electrónico")}
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {t(
            "Sign in with the email you use on QRcasas.",
            "Inicia sesión con el correo que usas en QRcasas."
          )}
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t("Signing in…", "Iniciando sesión…")}
          </>
        ) : (
          <>
            {t("Sign in", "Iniciar sesión")}
            <ArrowRight className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}
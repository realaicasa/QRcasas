"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

interface ForgotPasswordFormProps {
  locale: string;
  onReset: (formData: FormData) => Promise<void>;
  t: (en: string, es: string) => string;
}

export default function ForgotPasswordForm({ locale, onReset, t }: ForgotPasswordFormProps) {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <form
      action={async (fd) => {
        setPending(true);
        await onReset(fd);
        setPending(false);
        setSent(true);
      }}
      className="space-y-4"
    >
      {sent ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center">
          <CheckCircle2 className="mx-auto mb-2 size-8 text-emerald-600" />
          <p className="text-sm font-medium text-emerald-800">
            {t(
              "If an account exists for that email, a password reset link has been sent.",
              "Si existe una cuenta para ese correo, se ha enviado un enlace para restablecer la contraseña."
            )}
          </p>
        </div>
      ) : (
        <>
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
          </div>

          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t("Sending…", "Enviando…")}
              </>
            ) : (
              <>
                {t("Send reset link", "Enviar enlace de recuperación")}
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </>
      )}

      <p className="pt-2 text-center text-sm text-muted-foreground">
        <Link href={`/${locale}/login`} className="font-medium text-primary hover:underline">
          {t("Back to sign in", "Volver a iniciar sesión")}
        </Link>
      </p>
    </form>
  );
}
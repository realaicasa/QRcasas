"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  locale: string;
  onSignIn: (formData: FormData) => Promise<void>;
}

export default function LoginForm({ locale, onSignIn }: LoginFormProps) {
  const [pending, setPending] = useState(false);
  const t = (en: string, es: string) => (locale === "es" ? es : en);
  const [showPassword, setShowPassword] = useState(false);

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
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
          {t("Password", "Contraseña")}
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" name="remember" className="size-3.5 rounded border-border text-primary" />
          {t("Remember me", "Recordarme")}
        </label>
        <Link
          href={`/${locale}/forgot-password`}
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("Forgot password?", "¿Olvidaste tu contraseña?")}
        </Link>
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

      <p className="pt-2 text-center text-sm text-muted-foreground">
        {t("Don't have an account?", "¿No tienes una cuenta?")}{" "}
        <Link href={`/${locale}/register`} className="font-medium text-primary hover:underline">
          {t("Create one", "Crea una")}
        </Link>
      </p>
    </form>
  );
}
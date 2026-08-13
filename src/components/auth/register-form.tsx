"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";

interface RegisterFormProps {
  locale: string;
  onRegister: (formData: FormData) => Promise<void>;
}

export default function RegisterForm({ locale, onRegister }: RegisterFormProps) {
  const [pending, setPending] = useState(false);
  const t = (en: string, es: string) => (locale === "es" ? es : en);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <form
      action={async (fd) => {
        setPending(true);
        await onRegister(fd);
        setPending(false);
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
          {t("Full name", "Nombre completo")}
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder={t("John Smith", "Juan Pérez")}
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

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
            minLength={8}
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

      <div>
        <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-foreground">
          {t("Confirm password", "Confirmar contraseña")}
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            required
            minLength={8}
            placeholder="••••••••"
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            aria-label="Toggle password visibility"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
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
            {t("Creating account…", "Creando cuenta…")}
          </>
        ) : (
          <>
            {t("Create account", "Crear cuenta")}
            <ArrowRight className="size-4" />
          </>
        )}
      </button>

      <p className="pt-2 text-center text-sm text-muted-foreground">
        {t("Already have an account?", "¿Ya tienes una cuenta?")}{" "}
        <Link href={`/${locale}/login`} className="font-medium text-primary hover:underline">
          {t("Sign in", "Iniciar sesión")}
        </Link>
      </p>
    </form>
  );
}
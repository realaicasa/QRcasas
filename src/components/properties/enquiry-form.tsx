"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import type { Locale } from "@/lib/i18n";

interface EnquiryFormProps {
  locale: Locale;
  propertyId: string;
  propertyName: string;
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

type FormState = "idle" | "submitting" | "success" | "error";

export default function EnquiryForm({ locale, propertyId, propertyName, customerInfo }: EnquiryFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<{
    name: string;
    email: string;
    phone: string;
    message: string;
    preferredChannel: string;
    enquiryType: string;
  }>({
    name: customerInfo?.name ?? "",
    email: customerInfo?.email ?? "",
    phone: customerInfo?.phone ?? "",
    message: "",
    preferredChannel: "Email",
    enquiryType: "Ask a Question",
  });

  const t = (en: string, es: string) => locale === "es" ? es : en;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("submitting");
    setErrorMsg(null);
    setSuccessMsg(null);

    const { name, email, phone, message, preferredChannel, enquiryType } = formValues;
    const consent = true; // We'll get this from the form

    if (!consent) {
      setErrorMsg(t("You must agree to the terms.", "Debes aceptar los términos."));
      setState("error");
      return;
    }

    const payload = {
      propertyId,
      leadName: name,
      email,
      phone,
      message,
      preferredChannel,
      enquiryType,
      consent,
      source: "Website",
    };

    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }
      setState("success");
      setSuccessMsg(data.message || t("Your enquiry has been submitted.", "Tu consulta ha sido enviada."));
      // Reset form except for pre-filled customer info
      setFormValues({
        name: customerInfo?.name ?? "",
        email: customerInfo?.email ?? "",
        phone: customerInfo?.phone ?? "",
        message: "",
        preferredChannel: "Email",
        enquiryType: "Ask a Question",
      });
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : t("Something went wrong.", "Ocurrió un error."));
    }
  };

  const handleInputChange = (field: keyof typeof formValues, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  if (state === "success") {
    return (
      <section className="mt-8 border-t pt-6">
        <div className="flex items-start gap-3 rounded-md bg-green-50 p-4 text-green-800">
          <CheckCircle className="mt-0.5 size-5 shrink-0" />
          <div>
            <h3 className="font-semibold">{t("Thank you!", "¡Gracias!")}</h3>
            <p className="text-sm">{successMsg}</p>
            <button
              type="button"
              onClick={() => setState("idle")}
              className="mt-2 text-xs underline hover:text-primary"
            >
              {t("Send another enquiry", "Enviar otra consulta")}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 border-t pt-6">
      <h2 className="text-lg font-semibold mb-2">
        {t("Send an enquiry", "Enviar una consulta")} — {propertyName}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        {t(
          "Fill in your details and we'll forward your enquiry to the advertiser.",
          "Completa tus datos y enviaremos tu consulta al anunciante.",
        )}
      </p>

      {state === "error" && errorMsg && (
        <div className="mb-3 flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form ref={undefined} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-xs font-medium">
              {t("Your name", "Tu nombre")} *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={200}
              value={formValues.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-medium">
              {t("Email", "Correo")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formValues.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-xs font-medium">
              {t("Phone", "Teléfono")}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder={t("e.g. +52 998 123 4567", "ej. +52 998 123 4567")}
              value={formValues.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="preferredChannel" className="block text-xs font-medium">
              {t("Preferred contact", "Contacto preferido")}
            </label>
            <select
              id="preferredChannel"
              name="preferredChannel"
              defaultValue="Email"
              value={formValues.preferredChannel}
              onChange={(e) => handleInputChange("preferredChannel", e.target.value)}
              className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="WhatsApp">{t("WhatsApp", "WhatsApp")}</option>
              <option value="Email">{t("Email", "Correo")}</option>
              <option value="Phone">{t("Phone call", "Llamada")}</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="enquiryType" className="block text-xs font-medium">
            {t("Enquiry type", "Tipo de consulta")}
          </label>
            <select
              id="enquiryType"
              name="enquiryType"
              defaultValue="Ask a Question"
              value={formValues.enquiryType}
              onChange={(e) => handleInputChange("enquiryType", e.target.value)}
              className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="Request Viewing">{t("Request viewing", "Solicitar visita")}</option>
              <option value="Ask a Question">{t("Ask a question", "Hacer una pregunta")}</option>
              <option value="Request Brochure">{t("Request brochure", "Solicitar folleto")}</option>
              <option value="Price Updates">{t("Price updates", "Actualizaciones de precio")}</option>
              <option value="Callback">{t("Callback", "Llamarme")}</option>
            </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-medium">
            {t("Message", "Mensaje")}
          </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder={t("Your message...", "Tu mensaje...")}
              value={formValues.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              maxLength={2000}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
        </div>

        <div className="flex items-start gap-2">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            className="mt-0.5 size-4 rounded border"
          />
          <label htmlFor="consent" className="text-xs">
            {t(
              "I agree to my data being used to process this enquiry in accordance with the Privacy Policy.",
              "Acepto que mis datos se usen para procesar esta consulta conforme a la Política de Privacidad."
            )}
          </label>
        </div>

        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {state === "submitting" ? (
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Send className="size-4" />
          )}
          {state === "submitting" ? t("Sending...", "Enviando...") : t("Submit enquiry", "Enviar consulta")}
        </button>
      </form>
    </section>
  );
}

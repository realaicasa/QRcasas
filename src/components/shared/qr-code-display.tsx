"use client";

import { useState, useCallback } from "react";
import { Download, Copy, ExternalLink, QrCode } from "lucide-react";
import type { Locale } from "@/lib/i18n";

interface QrCodeDisplayProps {
  url: string;
  label: string;
  locale: Locale;
}

export default function QrCodeDisplay({ url, label, locale }: QrCodeDisplayProps) {
  const t = (en: string, es: string) => (locale === "es" ? es : en);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1024x1024&ecc=H&data=${encodeURIComponent(url)}`;
  const previewUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&ecc=H&data=${encodeURIComponent(url)}`;

  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(qrApiUrl);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `qrcasas-qr-${label.toLowerCase().replace(/\s+/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch {
      window.open(qrApiUrl, "_blank");
    }
  }, [qrApiUrl, label]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [url]);

  const handleOpen = useCallback(() => {
    window.open(url, "_blank");
  }, [url]);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <QrCode className="size-5 text-primary" />
        <h4 className="text-sm font-semibold">{label}</h4>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* QR Preview */}
        <div className="shrink-0">
          {showQr ? (
            <img
              src={previewUrl}
              alt={`QR code for ${label}`}
              className="size-32 rounded-lg border border-border"
            />
          ) : (
            <button
              onClick={() => setShowQr(true)}
              className="flex size-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <QrCode className="size-8" />
            </button>
          )}
        </div>

        {/* URL + Actions */}
        <div className="flex-1 space-y-2">
          <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground break-all">
            {url}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Download className="size-3.5" />
              {t("Download PNG", "Descargar PNG")}
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Copy className="size-3.5" />
              {copied ? t("Copied!", "¡Copiado!") : t("Copy URL", "Copiar URL")}
            </button>
            <button
              onClick={handleOpen}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <ExternalLink className="size-3.5" />
              {t("Open", "Abrir")}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {t(
              "1024×1024 PNG, high error correction. Print on business cards, flyers, or signs.",
              "PNG 1024×1024, alta corrección de errores. Imprime en tarjetas, flyers o letreros."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

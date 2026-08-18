"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Phone, Mail, Globe, BadgeCheck, Award } from "lucide-react";
import type { AgentProfile } from "@/lib/data/agents";
import type { Locale } from "@/lib/i18n";

interface AgentDetailModalProps {
  agent: AgentProfile;
  locale: Locale;
  t: (en: string, es: string) => string;
}

export default function AgentDetailModal({ agent, locale, t }: AgentDetailModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const photoUrl = agent.profilePhoto?.url || agent.logoImage?.url;
  const displayName = agent.displayName;
  const agentRef = agent.agentReference;
  const specialist = agent.specialistVocation;
  const verified = agent.identityVerificationStatus;
  const publicWhatsApp = agent.publicWhatsApp;
  const publicEmail = agent.publicEmail;
  const tagline = agent.tagline;

  const contactItems: Array<{ icon: typeof Phone; label: string; value: string; href?: string }> = [];
  if (publicWhatsApp) {
    contactItems.push({
      icon: Phone,
      label: "WhatsApp",
      value: publicWhatsApp,
      href: `https://wa.me/${publicWhatsApp.replace(/[^0-9]/g, "")}`,
    });
  }
  if (publicEmail) {
    contactItems.push({ icon: Mail, label: "Email", value: publicEmail, href: `mailto:${publicEmail}` });
  }
  if (agent.primaryContactValue && !publicWhatsApp && !publicEmail) {
    contactItems.push({ icon: Phone, label: agent.primaryContactChannel, value: agent.primaryContactValue });
  }
  if (agent.websiteUrl) {
    contactItems.push({
      icon: Globe,
      label: "Website",
      value: agent.websiteUrl,
      href: agent.websiteUrl,
    });
  }
  if (agent.socialInstagram) {
    contactItems.push({
      icon: Globe,
      label: "Instagram",
      value: agent.socialInstagram,
      href: `https://instagram.com/${agent.socialInstagram}`,
    });
  }
  if (agent.socialFacebook) {
    contactItems.push({
      icon: Globe,
      label: "Facebook",
      value: agent.socialFacebook,
      href: agent.socialFacebook,
    });
  }
  if (agent.socialLinkedIn) {
    contactItems.push({
      icon: Globe,
      label: "LinkedIn",
      value: agent.socialLinkedIn,
      href: `https://linkedin.com/in/${agent.socialLinkedIn}`,
    });
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with photo */}
            <div className="relative">
              <div className="h-24 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-t-2xl" />
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 rounded-full bg-black/30 p-1.5 text-white transition-colors hover:bg-black/50"
                aria-label={t("Close", "Cerrar")}
              >
                <X className="size-5" />
              </button>
              <div className="px-6 pb-6">
                <div className="-mt-12 mb-4 flex items-end gap-3">
                  <div className="size-24 shrink-0 overflow-hidden rounded-xl border-4 border-card bg-muted shadow-lg">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={agent.businessName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-primary">
                        {agent.businessName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-xl font-bold leading-tight">
                        {displayName || agent.businessName}
                      </h2>
                      {verified === "Verified" && (
                        <BadgeCheck className="size-5 shrink-0 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{agent.businessName}</p>
                    {tagline && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{tagline}</p>
                    )}
                  </div>
                </div>

                {/* Agent ID + Specialist */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {agentRef && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      ID: {agentRef}
                    </span>
                  )}
                  {specialist && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      <Award className="size-3" />
                      {specialist}
                    </span>
                  )}
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {agent.tierLevel === "Pro_Plus" ? "Pro Plus" : agent.tierLevel}
                  </span>
                </div>

                {/* Bio */}
                {agent.bioDescription && (
                  <div className="mb-4">
                    <h3 className="mb-1 text-sm font-semibold">
                      {t("About", "Acerca de")}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {agent.bioDescription}
                    </p>
                  </div>
                )}

                {/* Contact info */}
                <div className="mb-4">
                  <h3 className="mb-2 text-sm font-semibold">
                    {t("Contact", "Contacto")}
                  </h3>
                  <div className="space-y-2">
                    {contactItems.length > 0 ? (
                      contactItems.map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Icon className="size-4 shrink-0 text-muted-foreground" />
                            {item.href ? (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {item.value}
                              </a>
                            ) : (
                              <span>{item.value}</span>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {t(
                          "No contact information available.",
                          "Sin información de contacto disponible."
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* Back link */}
                <Link
                  href={`/${locale}/directory`}
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  &larr; {t("Back to directory", "Volver al directorio")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

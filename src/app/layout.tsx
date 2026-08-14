import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import InstallPrompt from "@/components/install-prompt";

export const metadata: Metadata = {
  title: "QRcasas | Real Estate in Quintana Roo",
  description:
    "Bilingual real estate advertising and introduction platform focused on Quintana Roo, Mexico.",
  manifest: "/manifest.webmanifest",
  applicationName: "QRcasas",
  icons: {
    icon: "/icons/icon-192.png",
    shortcut: "/favicon.ico",
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "QRcasas",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e7490",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}
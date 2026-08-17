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
    icon: "https://assets.cdn.filesafe.space/oeYXQCzN3HPGG5vykVUG/media/6a837df9270e1f545777782d.png",
    shortcut: "https://assets.cdn.filesafe.space/oeYXQCzN3HPGG5vykVUG/media/6a837df9fe4291bd10e988f0.png",
    apple: [{ url: "https://assets.cdn.filesafe.space/oeYXQCzN3HPGG5vykVUG/media/6a837df9270e1f545777782d.png", sizes: "180x180", type: "image/png" }],
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
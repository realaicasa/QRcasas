import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "QRcasas | Real Estate in Quintana Roo",
  description:
    "Bilingual real estate advertising and introduction platform focused on Quintana Roo, Mexico.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
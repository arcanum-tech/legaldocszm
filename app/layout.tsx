import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LegalDocs ZM — Zambian Legal Documents",
  description: "Generate affidavits, contracts, sale agreements and more. Powered by AI. Zambia-specific.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

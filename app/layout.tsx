import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nusabook - SaaS & Marketplace Tour & Travel Indonesia",
  description: "Platform digitalisasi operasional dan etalase online untuk UMKM Tour and Travel di Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}

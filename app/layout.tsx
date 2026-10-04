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
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-body-regular text-body-regular text-on-surface bg-background">
        {children}
      </body>
    </html>
  );
}

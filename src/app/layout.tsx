import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Oh! Buenos Aires | Luxury Shopping Experience",
    template: "%s | Oh! Buenos Aires"
  },
  description: "El epicentro del Luxury Shopping en Recoleta. Descubrí boutiques internacionales, gastronomía de autor y experiencias exclusivas en Buenos Aires.",
  keywords: ["Shopping", "Luxury", "Buenos Aires", "Recoleta", "Moda", "Gastronomía", "Experiencias", "Boutiques"],
  authors: [{ name: "LDE-System" }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://ohbuenosaires.com",
    title: "Oh! Buenos Aires | Luxury Shopping Experience",
    description: "Viví la exclusividad en el corazón de Recoleta. Marcas internacionales y gastronomía gourmet.",
    siteName: "Oh! Buenos Aires",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oh! Buenos Aires | Luxury Shopping",
    description: "Descubrí el shopping más exclusivo de Recoleta.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

import CustomerServiceChatbot from "@/src/components/CustomerServiceChatbot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          {children}
          <CustomerServiceChatbot />
        </Providers>
      </body>
    </html>
  );
}

import { supabase } from "@/src/lib/infrastructure/supabase-client";

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await supabase
    .from("site_settings")
    .select("key, value");

  const s = (settings || []).reduce((acc: any, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});

  const title = s.site_title || "Oh! Buenos Aires | Luxury Shopping Experience";
  const description = s.site_description || "El epicentro del Luxury Shopping en Recoleta. Descubrí boutiques internacionales, gastronomía de autor y experiencias exclusivas.";

  return {
    title: {
      default: title,
      template: `%s | ${title.split('|')[0].trim()}`
    },
    description: description,
    keywords: ["Shopping", "Luxury", "Buenos Aires", "Recoleta", "Moda", "Gastronomía"],
    authors: [{ name: "LDE-System" }],
    openGraph: {
      title,
      description,
      type: "website",
      locale: "es_AR",
      siteName: "Oh! Buenos Aires",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

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

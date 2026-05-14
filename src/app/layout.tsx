import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";

export const metadata: Metadata = {
  title: {
    default: "The Essential Data — Geopolitical Intelligence",
    template: "%s | The Essential Data",
  },
  description:
    "Cartes interactives mondiales : PIB par pays 2025, épidémies, empires historiques. Données FMI, Banque mondiale, OMS. The Essential Data — data journalism géopolitique.",
  keywords: [
    "carte PIB monde 2025",
    "PIB par pays 2025",
    "dette publique par pays",
    "carte chômage monde",
    "world GDP map 2025",
    "country GDP comparison",
    "carte empire romain interactif",
    "Roman Empire interactive map",
    "carte épidémies mondiales",
    "COVID-19 carte mondiale",
    "données économiques pays 2025",
    "comparaison économique pays",
    "geopolitical data map",
    "carte géopolitique interactive",
    "données FMI 2025",
    "world economic data",
    "carte hantavirus",
    "carte VIH monde",
    "empire romain carte",
    "Black Death map",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    siteName: "The Essential Data",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    url: siteUrl,
    title: "The Essential Data — Cartes géopolitiques interactives",
    description:
      "PIB par pays 2025, épidémies mondiales, empires historiques. Données FMI & Banque mondiale visualisées en cartes interactives.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Essential Data — Cartes géopolitiques interactives",
    description:
      "PIB par pays 2025, épidémies mondiales, empires historiques. Données FMI & Banque mondiale.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌍</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "The Essential Data",
    description:
      "Cartes interactives mondiales : PIB par pays 2025, épidémies, empires historiques. Données FMI et Banque mondiale.",
    url: siteUrl,
    inLanguage: ["fr", "en"],
    publisher: {
      "@type": "Organization",
      name: "The Essential Data",
      url: siteUrl,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/map/{theme}`,
      },
      "query-input": "required name=theme",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#FAFAFA" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}

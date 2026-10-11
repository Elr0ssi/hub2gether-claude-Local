import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { jsonLdString } from "@/lib/schema";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

import { SITE_URL as siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "Visualize · L'économie et la démographie du monde, en données",
    template: "%s | Visualize",
  },
  description:
    "PIB, dette, chômage, population, natalité et mortalité de plus de 200 pays, de 1960 à aujourd'hui, sur un globe interactif. Comparez deux pays. Sources : Banque mondiale, FMI, Nations Unies.",
  keywords: [
    "PIB par pays",
    "population par pays",
    "comparer deux pays",
    "dette publique par pays",
    "inflation par pays",
    "taux de chômage par pays",
    "classement des pays",
    "carte du monde interactive",
    "globe interactif",
    "données économiques mondiales",
    "données démographiques",
    "évolution du PIB depuis 1960",
    "population mondiale en temps réel",
    "statistiques par pays",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName: "Visualize",
    locale: "fr_FR",
    url: siteUrl,
    title: "Visualize · L'économie et la démographie du monde, en données",
    description:
      "Plus de 200 pays, de 1960 à aujourd'hui, sur un globe interactif. Sources : Banque mondiale, FMI, Nations Unies.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Visualize · L'économie et la démographie du monde, en données",
    description: "Plus de 200 pays, de 1960 à aujourd'hui, sur un globe interactif.",
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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Visualize",
    description:
      "L'économie et la démographie du monde en données : classements, cartes et dossiers sourcés.",
    url: siteUrl,
    inLanguage: "fr",
    publisher: {
      "@type": "Organization",
      name: "Visualize",
      url: siteUrl,
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Visualize",
    url: siteUrl,
    description:
      "Média de données : économie et démographie du monde, classements, cartes interactives et dossiers sourcés.",
    sameAs: [],
  };

  return (
    <html lang="fr" suppressHydrationWarning className={inter.variable}>
      <head>
        <meta name="theme-color" content="#FAFAFA" />
        {/* Le thème des pages Visualize, posé avant le premier rendu. Sans
            ce passage, une page choisie en clair apparaîtrait noire le temps
            d'une image, puis basculerait : c'est le défaut que tout le monde
            connaît et que personne ne pardonne. Il ne fait rien d'autre que
            relire un choix déjà pris, et se tait si le stockage est fermé. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(localStorage.getItem("visualize-theme")==="clair")document.documentElement.dataset.concept="clair"}catch(e){}',
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(organizationSchema) }}
        />
      </head>
      <body style={{ fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}

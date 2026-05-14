import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";

export const metadata: Metadata = {
  title: {
    default: "The Essential Data — Geopolitical Intelligence",
    template: "%s | The Essential Data",
  },
  description:
    "Explore history's greatest empires, conflicts, and economic powers through interactive maps and data journalism. Premium geopolitical intelligence.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName: "The Essential Data",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
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
    description: "Premium geopolitical data journalism and interactive historical maps.",
    url: siteUrl,
    publisher: {
      "@type": "Organization",
      name: "The Essential Data",
      url: siteUrl,
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

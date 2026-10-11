import type { Metadata } from "next";
import { ComparerPage } from "@/components/comparer/ComparerPage";
import { BlocComparer } from "@/components/seo/BlocComparer";
import SOCLE from "@/data/economy/genere/socle-economie.json";

/* ═══════════════════════════════════════════════════════════════════════════
   /comparer — LA PAGE DE COMPARAISON

   Jusqu'à quatre pays, soixante-six ans de données : un face-à-face chiffré, une
   courbe commune, un profil. Tout se lit dans la base du site et se partage
   par l'adresse.
   ═══════════════════════════════════════════════════════════════════════════ */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";

export const metadata: Metadata = {
  title: { absolute: "Comparer des pays : PIB, population, dette, inflation | Visualize" },
  description:
    "Comparez jusqu'à quatre pays sur le PIB, la population, la dette, l'inflation ou le chômage, de 1960 à aujourd'hui : face-à-face, évolution et profil.",
  alternates: { canonical: "/comparer" },
  openGraph: {
    type: "website",
    url: `${siteUrl}/comparer`,
    title: "Comparer des pays",
    description: "Jusqu'à quatre pays, soixante-six ans de données, une seule lecture.",
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  const pays = SOCLE.pays as Record<string, { iso2?: string }>;
  const iso2: Record<string, string> = {};
  for (const [nom, p] of Object.entries(pays)) if (p.iso2) iso2[nom] = p.iso2;
  return <ComparerPage iso2={iso2} apres={<BlocComparer />} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnTete, Pied } from "@/components/concept/pieces";
import { Fil, JsonLd, schemaFaq, schemaFil } from "@/components/seo/Elements";
import { AnalyseDette } from "@/components/dettes/AnalyseDette";
import { ANALYSES, analyseParSlug } from "@/data/dettes/analyses";
import { tousLesDossiers } from "@/data/dettes/dossiers";
import { nf } from "@/data/seo/francais";
import { SITE_URL, urlAbs } from "@/lib/site";
import "@/components/concept/concept.css";
import "@/components/seo/seo.css";

export const revalidate = 2592000;

/** Le rendu serveur et les données structurées sont en euros, la monnaie d'origine de la base. */
const euros = { m: (v: number) => `${nf(v, v >= 100 ? 0 : 1)} Md€`, u: (v: number) => `${nf(v, 0)} €` };

export function generateStaticParams() {
  return ANALYSES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = analyseParSlug(slug);
  if (!a) return {};
  const description = a.description(tousLesDossiers(), euros);
  const url = urlAbs(`/dette-publique/analyses/${a.slug}`);
  return {
    title: { absolute: `${a.titre} | Visualize` },
    description,
    alternates: { canonical: `/dette-publique/analyses/${a.slug}` },
    openGraph: { type: "article", url, title: a.titre, description, siteName: "Visualize", locale: "fr_FR" },
    twitter: { card: "summary_large_image", title: a.titre, description },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = analyseParSlug(slug);
  if (!a) notFound();
  const dossiers = tousLesDossiers();
  const c = a.contenu(dossiers, euros);
  const url = urlAbs(`/dette-publique/analyses/${a.slug}`);
  return (
    <div className="cg sg">
      <EnTete />
      <JsonLd
        data={[
          schemaFil([{ label: "Accueil", url: SITE_URL }, { label: "Dette publique", url: urlAbs("/dette-publique") }, { label: a.titre, url }]),
          schemaFaq(c.faq),
          {
            "@type": "Article",
            headline: a.titre,
            description: a.description(dossiers, euros),
            url,
            inLanguage: "fr",
            author: { "@type": "Organization", name: "Visualize" },
            publisher: { "@type": "Organization", name: "Visualize", url: SITE_URL },
            datePublished: "2026-10-12",
            dateModified: "2026-10-12",
            mainEntityOfPage: url,
          },
        ]}
      />
      <main className="sg-page">
        <Fil items={[{ label: "Accueil", href: "/" }, { label: "Dette publique", href: "/dette-publique" }, { label: a.h1.join(" ") }]} />
        <AnalyseDette slug={a.slug} dossiers={dossiers} />
        <p className="sg-note">
          Sources : base de dette de Visualize (2000, 2014, 2024, en milliards d’euros), Nations Unies (population). Montants publiés en euros, convertibles au taux moyen de chaque année. Aucune projection n’est faite.
        </p>
      </main>
      <Pied />
    </div>
  );
}

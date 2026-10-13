import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { EnTete, Pied } from "@/components/concept/pieces";
import { Fil, JsonLd, schemaFaq, schemaFil } from "@/components/seo/Elements";
import { DossierDette } from "@/components/dettes/DossierDette";
import { PageArticleDette } from "@/articles/dette/rendu";
import { articleRedige } from "@/articles/dette/registre";
import { CATALOGUE_DETTE, estRedige } from "@/articles/dette/catalogue";
import { dossierParSlug, tousLesDossiers } from "@/data/dettes/dossiers";
import { descriptionDossier, faqDossier, titreDossier } from "@/data/dettes/textes";
import { nf } from "@/data/seo/francais";
import { SITE_URL, urlAbs } from "@/lib/site";
import "@/components/concept/concept.css";
import "@/components/seo/seo.css";

export const revalidate = 2592000;

/** Le rendu serveur et les données structurées sont en euros, la monnaie d'origine. */
const euros = { m: (v: number) => `${nf(v, v >= 100 ? 0 : 1)} Md€`, u: (v: number) => `${nf(v, 0)} €` };

/* Deux sortes de pages sous /dette-publique/<pays> :
     - l'article écrit à la main, s'il existe (voir src/articles/LISEZ-MOI.md) ;
     - sinon le dossier généré à partir de la base de dette.
   Un article dont l'adresse canonique est ailleurs (la France) redirige vers elle. */
export function generateStaticParams() {
  const redigesIci = CATALOGUE_DETTE.filter((a) => a.url === `/dette-publique/${a.slug}`).map((a) => ({ slug: a.slug }));
  const generes = tousLesDossiers().filter((d) => !estRedige(d.slug)).map((d) => ({ slug: d.slug }));
  return [...redigesIci, ...generes];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const redige = articleRedige(slug);
  if (redige) return redige.url === `/dette-publique/${slug}` ? redige.metadata : {};
  const d = dossierParSlug(slug);
  if (!d) return {};
  const url = urlAbs(`/dette-publique/${d.slug}`);
  return {
    title: { absolute: titreDossier(d) },
    description: descriptionDossier(d, euros),
    alternates: { canonical: `/dette-publique/${d.slug}` },
    openGraph: { type: "article", url, title: `Dette publique : ${d.fr}`, description: descriptionDossier(d, euros), siteName: "Visualize", locale: "fr_FR" },
    twitter: { card: "summary_large_image", title: `Dette publique : ${d.fr}`, description: descriptionDossier(d, euros) },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const redige = articleRedige(slug);
  if (redige) {
    if (redige.url !== `/dette-publique/${slug}`) permanentRedirect(redige.url);
    return <PageArticleDette article={redige} />;
  }
  const d = dossierParSlug(slug);
  if (!d) notFound();
  const url = urlAbs(`/dette-publique/${d.slug}`);
  const faq = faqDossier(d, euros);
  return (
    <div className="cg sg">
      <EnTete />
      <JsonLd
        data={[
          schemaFil([{ label: "Accueil", url: SITE_URL }, { label: "Dette publique", url: urlAbs("/dette-publique") }, { label: d.fr, url }]),
          schemaFaq(faq),
          {
            "@type": "Article",
            headline: titreDossier(d).replace(" | Visualize", ""),
            description: descriptionDossier(d, euros),
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
        <Fil items={[{ label: "Accueil", href: "/" }, { label: "Dette publique", href: "/dette-publique" }, { label: d.fr }]} />
        <DossierDette d={d} />
        <p className="sg-note">
          Sources : base de dette de Visualize (2000, 2014, 2024, en milliards d&apos;euros), Nations Unies (population). Les montants sont publiés en euros et convertis, au choix, au taux moyen de chaque année (BCE, BRI).
          PIB implicite = dette ÷ ratio. Les dates et valeurs sont celles de la base ; aucune projection n&apos;est faite.
        </p>
      </main>
      <Pied />
    </div>
  );
}

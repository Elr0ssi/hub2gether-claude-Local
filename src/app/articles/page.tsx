import type { Metadata } from "next";
import { EnTete, Pied } from "@/components/concept/pieces";
import { Fil, JsonLd, schemaFil } from "@/components/seo/Elements";
import { HubArticles } from "@/components/seo/HubArticles";
import { UneArticles } from "@/components/seo/UneArticles";
import { tousLesArticles } from "@/data/articles-catalogue";
import { SITE_URL, urlAbs } from "@/lib/site";
import "@/components/concept/concept.css";
import "@/components/seo/seo.css";

export const metadata: Metadata = {
  title: { absolute: "Tous les articles : dette publique, économie, démographie | Datlas" },
  description:
    "Tous les articles de Datlas, rangés par thématique, par pays et par type : dossiers de dette publique, analyses comparatives, lectures sur l'économie, les épidémies et l'histoire.",
  alternates: { canonical: "/articles" },
  openGraph: { type: "website", url: urlAbs("/articles"), title: "Tous les articles de Datlas", description: "Dette publique, économie, démographie : tous les articles, par thématique et par pays." },
};

export default function Page() {
  const articles = tousLesArticles();
  const liste = {
    "@type": "CollectionPage",
    name: "Tous les articles de Datlas",
    url: urlAbs("/articles"),
    inLanguage: "fr",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: articles.length,
      itemListElement: articles.slice(0, 100).map((a, i) => ({ "@type": "ListItem", position: i + 1, name: a.titre, url: urlAbs(a.href) })),
    },
  };
  return (
    <div className="cg sg">
      <EnTete />
      <JsonLd data={[schemaFil([{ label: "Accueil", url: SITE_URL }, { label: "Articles", url: urlAbs("/articles") }]), liste]} />
      <main className="sg-page">
        <Fil items={[{ label: "Accueil", href: "/" }, { label: "Articles" }]} />
        <h1 className="sg-h1">Les <span>articles</span></h1>
        <p className="sg-intro">
          {`${articles.length} articles, ${new Set(articles.flatMap((a) => a.pays.map((p) => p.slug))).size} pays, ${new Set(articles.map((a) => a.rubrique)).size} thématiques.`}
        </p>
        <UneArticles articles={articles} />
        <HubArticles articles={articles} />
      </main>
      <Pied />
    </div>
  );
}

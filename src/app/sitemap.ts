import type { MetadataRoute } from "next";
import { ARTICLES } from "@/data/articles";
import { tousLesDossiers } from "@/data/dettes/dossiers";
import { pairesVedettes, paysVedettes, slugPaire, tousLesPays } from "@/data/seo/pays";
import { SITE_URL as siteUrl } from "@/lib/site";

const LAST_MODIFIED_STATIC = new Date("2025-07-01");

export default function sitemap(): MetadataRoute.Sitemap {
  const articlePages = ARTICLES.map((article) => ({
    url: `${siteUrl}/articles/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  /* L'article « dette publique française » : une page à part entière, donc
     une entrée à part entière. */
  const dette = {
    url: `${siteUrl}/france/economie/dette-publique`,
    lastModified: new Date("2026-09-21"),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  };

  /* Les pages de rubrique et les pages de confiance. Elles n'étaient pas
     déclarées : deux d'entre elles n'existaient même pas, alors que le fil
     d'Ariane de l'article dette les annonçait. */
  const rubriques = [
    { url: `${siteUrl}/economie`, priority: 0.95, changeFrequency: "weekly" as const },
    { url: `${siteUrl}/demographie`, priority: 0.95, changeFrequency: "weekly" as const },
    { url: `${siteUrl}/forum`, priority: 0.7, changeFrequency: "daily" as const },
    { url: `${siteUrl}/france`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${siteUrl}/france/economie`, priority: 0.85, changeFrequency: "monthly" as const },
    { url: `${siteUrl}/methodologie-donnees`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${siteUrl}/confidentialite`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${siteUrl}/cgu`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${siteUrl}/a-propos`, priority: 0.6, changeFrequency: "monthly" as const },
  ].map((r) => ({ ...r, lastModified: new Date("2026-09-22") }));

  /* Une page par pays, et les comparaisons les plus recherchées. Les autres
     paires existent aussi (toute combinaison se construit à la demande) ;
     on déclare ici celles qui comptent. */
  const aujourdhui = new Date();
  const pays = tousLesPays().map((p) => ({
    url: `${siteUrl}/pays/${p.slug}`,
    lastModified: aujourdhui,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const vus = new Set<string>();
  const paires: MetadataRoute.Sitemap = [];
  const ajoute = (a: Parameters<typeof slugPaire>[0], b: Parameters<typeof slugPaire>[1]) => {
    const s = slugPaire(a, b);
    if (vus.has(s)) return;
    vus.add(s);
    paires.push({ url: `${siteUrl}/comparer/${s}`, lastModified: aujourdhui, changeFrequency: "monthly", priority: 0.6 });
  };
  for (const [a, b] of pairesVedettes(36)) ajoute(a, b);
  const grands = paysVedettes(8);
  for (const p of tousLesPays()) for (const g of grands) if (p.nom !== g.nom) ajoute(p, g);

  const dettes = [
    { url: `${siteUrl}/dette-publique`, priority: 0.85, changeFrequency: "monthly" as const, lastModified: aujourdhui },
    ...tousLesDossiers().filter((d) => d.slug !== "france").map((d) => ({
      url: `${siteUrl}/dette-publique/${d.slug}`,
      priority: 0.65,
      changeFrequency: "monthly" as const,
      lastModified: aujourdhui,
    })),
  ];
  const outils = [
    { url: `${siteUrl}/comparer`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${siteUrl}/pays`, priority: 0.85, changeFrequency: "weekly" as const },
  ].map((r) => ({ ...r, lastModified: aujourdhui }));

  return [
    ...outils,
    ...dettes,
    ...pays,
    ...paires,
    dette,
    ...rubriques,
    {
      url: siteUrl,
      lastModified: LAST_MODIFIED_STATIC,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/comparaison`,
      lastModified: LAST_MODIFIED_STATIC,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/articles`,
      lastModified: LAST_MODIFIED_STATIC,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/methodology`,
      lastModified: LAST_MODIFIED_STATIC,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/sources`,
      lastModified: LAST_MODIFIED_STATIC,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...articlePages,
  ];
}

import type { MetadataRoute } from "next";
import { ROMAN_TIMELINE } from "@/data/timeline";
import { ARTICLES } from "@/data/articles";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";

const LAST_MODIFIED_STATIC = new Date("2025-07-01");

export default function sitemap(): MetadataRoute.Sitemap {
  const entityPages = ROMAN_TIMELINE.map((entry) => ({
    url: `${siteUrl}/map/empires/roman-empire-${entry.slug}`,
    lastModified: LAST_MODIFIED_STATIC,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

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
    { url: `${siteUrl}/france`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${siteUrl}/france/economie`, priority: 0.85, changeFrequency: "monthly" as const },
    { url: `${siteUrl}/methodologie-donnees`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${siteUrl}/a-propos`, priority: 0.6, changeFrequency: "monthly" as const },
  ].map((r) => ({ ...r, lastModified: new Date("2026-09-22") }));

  return [
    dette,
    ...rubriques,
    {
      url: siteUrl,
      lastModified: LAST_MODIFIED_STATIC,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/map/economy`,
      lastModified: LAST_MODIFIED_STATIC,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/map/epidemics`,
      lastModified: LAST_MODIFIED_STATIC,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/map/empires`,
      lastModified: LAST_MODIFIED_STATIC,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/map/politics`,
      lastModified: LAST_MODIFIED_STATIC,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/map/military`,
      lastModified: LAST_MODIFIED_STATIC,
      changeFrequency: "monthly",
      priority: 0.85,
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
    ...entityPages,
    ...articlePages,
  ];
}

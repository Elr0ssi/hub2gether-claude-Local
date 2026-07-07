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

  return [
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

import type { MetadataRoute } from "next";
import { ROMAN_TIMELINE } from "@/data/timeline";
import { ARTICLES } from "@/data/articles";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const entityPages = ROMAN_TIMELINE.map((entry) => ({
    url: `${siteUrl}/map/empires/roman-empire-${entry.slug}`,
    lastModified: new Date(),
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
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/map/empires`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...entityPages,
    ...articlePages,
  ];
}

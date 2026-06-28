// Central aggregator — add articles in the per-theme files:
//   src/data/economy/articles.ts   → economy articles
//   src/data/epidemics/articles.ts → epidemics articles
//   src/data/empires/articles.ts   → empires articles
//   src/data/military/articles.ts  → military articles
//   src/data/politics/articles.ts  → politics articles
import type { Article } from "@/types";
import { ECONOMY_ARTICLES } from "./economy/articles";
import { EPIDEMICS_ARTICLES } from "./epidemics/articles";
import { EMPIRES_ARTICLES } from "./empires/articles";
import { MILITARY_ARTICLES } from "./military/articles";
import { POLITICS_ARTICLES } from "./politics/articles";

export { ECONOMY_ARTICLES, EPIDEMICS_ARTICLES, EMPIRES_ARTICLES, MILITARY_ARTICLES, POLITICS_ARTICLES };

export const ARTICLES: Article[] = [
  ...EMPIRES_ARTICLES,
  ...EPIDEMICS_ARTICLES,
  ...ECONOMY_ARTICLES,
  ...MILITARY_ARTICLES,
  ...POLITICS_ARTICLES,
];

export function getArticlesByTheme(theme: string): Article[] {
  return ARTICLES.filter((a) => a.theme === theme);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getFeaturedArticles(theme: string, limit = 3): Article[] {
  return ARTICLES.filter((a) => a.theme === theme)
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, limit);
}

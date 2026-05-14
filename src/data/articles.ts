import type { Article } from "@/types";

export const ARTICLES: Article[] = [
  {
    slug: "roman-empire-peak-117-ad",
    title: "Why the Roman Empire Reached Its Maximum Extent in 117 AD",
    excerpt:
      "Under Emperor Trajan, Rome controlled 5 million km² — from Scotland to Mesopotamia. What drove this extraordinary expansion, and why did it immediately reverse?",
    theme: "empires",
    publishedAt: "2025-01-15",
    readingTime: 8,
    tags: ["Roman Empire", "Trajan", "Expansion", "Military"],
    featured: true,
  },
  {
    slug: "how-rome-built-pan-mediterranean-economy",
    title: "How Rome Built the First Pan-Mediterranean Economy",
    excerpt:
      "The Roman Empire was not just a military phenomenon — it was the ancient world's most sophisticated economic system, connecting 70 million people across three continents.",
    theme: "empires",
    publishedAt: "2025-01-08",
    readingTime: 10,
    tags: ["Roman Empire", "Economy", "Trade", "Infrastructure"],
    featured: true,
  },
  {
    slug: "why-did-rome-fall",
    title: "Why Did Rome Fall? The Five Competing Theories",
    excerpt:
      "Gibbon blamed Christianity. Economists point to debasement. Climate scientists cite pandemics. The fall of Rome remains the most debated collapse in history.",
    theme: "empires",
    publishedAt: "2024-12-20",
    readingTime: 12,
    tags: ["Roman Empire", "Decline", "History", "Analysis"],
    featured: false,
  },
  {
    slug: "logistics-trajans-army",
    title: "The Logistics of Trajan's Army: Feeding an Empire",
    excerpt:
      "Moving 100,000 soldiers across the Danube required a supply chain that modern militaries would recognise. How Rome solved the most complex logistics problem of the ancient world.",
    theme: "empires",
    publishedAt: "2024-12-10",
    readingTime: 7,
    tags: ["Roman Empire", "Military", "Logistics", "Trajan"],
    featured: false,
  },
  {
    slug: "byzantine-empire-survival",
    title: "How Byzantium Survived for 1,000 Years After Rome's Fall",
    excerpt:
      "When the Western Empire collapsed in 476 AD, its Eastern half endured for another millennium. The secret was a combination of geography, diplomacy, and relentless administrative efficiency.",
    theme: "empires",
    publishedAt: "2024-11-28",
    readingTime: 9,
    tags: ["Byzantine Empire", "Constantinople", "Survival", "Medieval"],
    featured: false,
  },
  {
    slug: "fall-of-constantinople-1453",
    title: "The Fall of Constantinople: The Day the Ancient World Ended",
    excerpt:
      "On 29 May 1453, Ottoman cannons breached the walls that had held for a thousand years. The event that ended antiquity and launched the early modern world.",
    theme: "empires",
    publishedAt: "2024-11-15",
    readingTime: 11,
    tags: ["Constantinople", "Ottoman Empire", "Byzantine", "1453"],
    featured: false,
  },
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

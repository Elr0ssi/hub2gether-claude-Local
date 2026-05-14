import type { Article } from "@/types";

export const ARTICLES: Article[] = [
  // Empires articles
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

  // Epidemics articles
  {
    slug: "covid-mondialisation-90-jours",
    title: "COVID-19 et mondialisation : comment le virus a fait le tour du monde en 90 jours",
    excerpt:
      "Identifié à Wuhan en décembre 2019, le SARS-CoV-2 atteignait 114 pays le 11 mars 2020 — date de la déclaration de pandémie par l'OMS. Une propagation sans précédent dans l'histoire humaine.",
    theme: "epidemics",
    publishedAt: "2025-02-10",
    readingTime: 9,
    tags: ["COVID-19", "SARS-CoV-2", "Pandémie", "Mondialisation"],
    featured: true,
  },
  {
    slug: "peste-noire-europe-medievale",
    title: "La Peste Noire : comment une pandémie a reconfiguré l'Europe médiévale",
    excerpt:
      "Entre 1347 et 1353, la Yersinia pestis tua entre un tiers et la moitié de la population européenne. Au-delà du choc démographique, elle déclencha une révolution sociale, économique et religieuse sans précédent.",
    theme: "epidemics",
    publishedAt: "2025-02-03",
    readingTime: 12,
    tags: ["Peste Noire", "Moyen Âge", "Démographie", "Europe"],
    featured: true,
  },
  {
    slug: "vih-sida-afrique-subsaharienne",
    title: "VIH/SIDA : 40 ans d'épidémie et l'Afrique subsaharienne toujours en première ligne",
    excerpt:
      "L'Afrique subsaharienne concentre 67% des personnes vivant avec le VIH dans le monde. Pourquoi la géographie de cette épidémie est-elle si inégalement distribuée ?",
    theme: "epidemics",
    publishedAt: "2025-01-27",
    readingTime: 11,
    tags: ["VIH", "SIDA", "Afrique", "Santé mondiale", "ONUSIDA"],
    featured: false,
  },
  {
    slug: "hantavirus-rongeurs-vecteurs-silencieux",
    title: "Hantavirus : les rongeurs, vecteurs silencieux d'une maladie méconnue",
    excerpt:
      "Contrairement aux autres grandes épidémies, l'hantavirus ne se transmet pas d'homme à homme. Une spécificité qui explique sa géographie morcelée et les défis de sa surveillance.",
    theme: "epidemics",
    publishedAt: "2025-01-20",
    readingTime: 7,
    tags: ["Hantavirus", "Zoonose", "Rongeurs", "SPH", "FHSR"],
    featured: false,
  },
  {
    slug: "epidemies-geopolitique-frontieres",
    title: "Épidémies et géopolitique : quand les pandémies reconfigurent les alliances",
    excerpt:
      "COVID-19 a révélé les fractures du système international de santé : compétition vaccinale, effondrement des chaînes d'approvisionnement, nationalisme sanitaire.",
    theme: "epidemics",
    publishedAt: "2025-01-13",
    readingTime: 10,
    tags: ["Géopolitique", "COVID-19", "Diplomatie", "OMS", "Vaccins"],
    featured: false,
  },
  {
    slug: "inegalites-vaccinales-monde",
    title: "L'injustice vaccinale : comment les pays riches ont accaparé 80% des doses COVID",
    excerpt:
      "En 2021, les pays à hauts revenus représentant 16% de la population mondiale avaient reçu 60% des doses. Une asymétrie qui a prolongé la pandémie et alimenté l'émergence de nouveaux variants.",
    theme: "epidemics",
    publishedAt: "2025-01-06",
    readingTime: 8,
    tags: ["Vaccins", "COVID-19", "Inégalités", "COVAX", "Santé mondiale"],
    featured: false,
  },

  // ── Economy articles ───────────────────────────────────────────────────────
  {
    slug: "pib-mondial-geopolitique-puissance",
    title: "Le PIB comme outil de puissance géopolitique",
    excerpt:
      "La richesse économique n'est pas qu'un chiffre — c'est un vecteur de pouvoir diplomatique, militaire et culturel. Décryptage de la manière dont le PIB façonne l'ordre mondial.",
    theme: "economy",
    publishedAt: "2025-03-10",
    readingTime: 10,
    tags: ["PIB", "Géopolitique", "Puissance", "États-Unis", "Chine"],
    featured: true,
  },
  {
    slug: "dette-publique-comparaison-internationale",
    title: "La dette publique mondiale : qui doit quoi, et à qui ?",
    excerpt:
      "Le Japon dépasse 260% de dette/PIB, l'Italie 140%, les États-Unis 123%. Pourtant tous empruntent encore. Comprendre pourquoi le ratio dette/PIB ne dit pas tout.",
    theme: "economy",
    publishedAt: "2025-03-03",
    readingTime: 9,
    tags: ["Dette publique", "FMI", "Obligations", "Crise financière", "Souveraineté"],
    featured: false,
  },
  {
    slug: "chomage-inegalites-marches-travail",
    title: "Chômage mondial : les grandes fractures du marché du travail",
    excerpt:
      "Afrique du Sud à 32%, Europe du Nord sous 3% : les disparités de chômage révèlent des structures économiques et sociales radicalement différentes.",
    theme: "economy",
    publishedAt: "2025-02-24",
    readingTime: 8,
    tags: ["Chômage", "Marché du travail", "Inégalités", "OCDE", "OIT"],
    featured: false,
  },
  {
    slug: "chine-usa-guerre-economique-decennie",
    title: "Chine vs États-Unis : la grande rivalité économique de notre siècle",
    excerpt:
      "En 2000, la Chine représentait 12% du PIB américain. En 2023, 65%. Cette ascension fulgurante a redessiné les alliances mondiales et déclenché une guerre technologique sans précédent.",
    theme: "economy",
    publishedAt: "2025-02-17",
    readingTime: 12,
    tags: ["Chine", "États-Unis", "Guerre économique", "Technologie", "Géopolitique"],
    featured: false,
  },
  {
    slug: "entreprises-geants-economie-mondiale",
    title: "Les géants technologiques et leur poids sur l'économie mondiale",
    excerpt:
      "Apple, Microsoft, Amazon : les 10 plus grandes entreprises mondiales pèsent autant que le PIB de plusieurs continents réunis. Leur puissance redéfinit les règles du capitalisme.",
    theme: "economy",
    publishedAt: "2025-02-10",
    readingTime: 9,
    tags: ["Entreprises", "Big Tech", "Capitalisme", "Monopoles", "Régulation"],
    featured: false,
  },
  {
    slug: "covid-impact-economique-cartographie",
    title: "COVID-19 : cartographie de l'impact économique mondial en 2020",
    excerpt:
      "La contraction de -3,5% du PIB mondial en 2020 masque des réalités très hétérogènes : certains pays ont rebondi en quelques mois, d'autres s'en remettent encore.",
    theme: "economy",
    publishedAt: "2025-02-03",
    readingTime: 8,
    tags: ["COVID-19", "Récession", "PIB", "Politique économique", "Relance"],
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

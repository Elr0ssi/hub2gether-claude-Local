export type ThemeId = "economy" | "conflicts" | "military" | "epidemics" | "empires" | "politics";

export interface Theme {
  id: ThemeId;
  label: string;
  description: string;
  slug: string;
  available: boolean;
  icon: string;
  comingSoonLabel?: string;
}

export interface EmpireStats {
  areaSqKm: number;
  populationEstimate: number;
  capitalCity: string;
  politicalSystem: string;
  keyFacts: string[];
}

export interface TimelineEntry {
  year: number;
  label: string;
  slug: string;
  era: string;
  description: string;
  analysis: string;
  geojsonFile: string;
  stats: EmpireStats;
}

export interface EmpireEntity {
  id: string;
  name: string;
  theme: ThemeId;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  timeline: TimelineEntry[];
}

// ── Article rich body ─────────────────────────────────────────────────────────

export type ArticleSection =
  | { type: "lead"; content: string }
  | { type: "text"; heading?: string; content: string }
  | { type: "stats"; items: { value: string; label: string; note?: string }[] }
  | {
      type: "carousel";
      title: string;
      items: { name: string; emoji?: string; detail: string; subdetail?: string }[];
    }
  | {
      type: "image-text";
      heading: string;
      content: string;
      imageUrl: string;
      imageAlt: string;
      flip?: boolean;
    }
  | {
      type: "timeline";
      title: string;
      items: { date: string; title: string; description: string }[];
    }
  | { type: "highlight"; content: string }
  | { type: "quote"; text: string; source: string }
  // ── NEW rich types ─────────────────────────────────────────────────────────
  | {
      type: "chart";
      title: string;
      subtitle?: string;
      unit?: string;
      bars: { label: string; flag?: string; value: number; color?: string; note?: string }[];
    }
  | {
      type: "gallery";
      title?: string;
      images: { url: string; caption: string; credit?: string }[];
    }
  | {
      type: "map-highlight";
      title: string;
      subtitle?: string;
      /** ISO 2-letter code → display config */
      countries: Record<string, { color: string; label?: string }>;
      legend?: { color: string; label: string }[];
    }
  | {
      type: "comparison-table";
      title: string;
      headers: string[];
      rows: { label: string; flag?: string; cells: string[] }[];
    }
  | {
      type: "list";
      heading?: string;
      style?: "bullet" | "number" | "check";
      items: { text: string; note?: string }[];
    };

export interface ArticleSource {
  title: string;
  outlet?: string;
  year?: string;
  url?: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  theme: ThemeId;
  publishedAt: string;
  readingTime: number;
  tags: string[];
  featured?: boolean;
  heroImage?: string;
  heroCaption?: string;
  body?: ArticleSection[];
  sources?: ArticleSource[];
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ── Economy ───────────────────────────────────────────────────────────────────

export type EconomyMetricId = "gdp" | "debt_ratio" | "unemployment" | "companies";

export interface TopCompany {
  name: string;
  sector: string;
  revenue_bn: number;
}

export interface CountryEconomyData {
  gdp: number;
  debt_ratio: number;
  unemployment: number;
  companies: number;
  top_companies?: TopCompany[];
}

export interface EconomyYear {
  year: number;
  label: string;
  dataNote: string;
  countries: Record<string, CountryEconomyData>;
}

export interface EconomyMetric {
  id: EconomyMetricId;
  label: string;
  shortLabel: string;
  unit: string;
  description: string;
}

// ── Epidemics ─────────────────────────────────────────────────────────────────

export type EpidemicDiseaseId = "black-death" | "covid" | "hiv" | "hantavirus" | "hmpv";

export interface CountryEpidemicData {
  infected: number;
  deaths: number;
  deaths_per_year?: number; // annual rate (most recent full year) for YTD prorata
}

export interface EpidemicDisease {
  id: EpidemicDiseaseId;
  label: string;
  period: string;
  pathogen: string;
  description: string;
  globalCases: string;
  globalDeaths: string;
  dataNote: string;
  ongoing?: boolean; // true = active disease, enables YTD mode
  countries: Record<string, CountryEpidemicData>;
}

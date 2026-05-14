export type ThemeId = "economy" | "conflicts" | "military" | "epidemics" | "empires";

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

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  theme: ThemeId;
  publishedAt: string;
  readingTime: number;
  tags: string[];
  featured?: boolean;
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

export type EpidemicDiseaseId = "black-death" | "covid" | "hiv" | "hantavirus";

export interface CountryEpidemicData {
  infected: number;
  deaths: number;
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
  countries: Record<string, CountryEpidemicData>;
}

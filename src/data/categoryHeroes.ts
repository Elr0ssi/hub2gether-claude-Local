import {
  BarChart3,
  Coins,
  Cpu,
  DollarSign,
  Droplet,
  Euro,
  Factory,
  JapaneseYen,
  Landmark,
  PieChart,
  Sprout,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { FloatingIcon } from "@/components/category/FloatingIconField";
import { ECONOMY_YEARS } from "@/data/economy/economy";
import { getPopulationMillions } from "@/data/economy/populationData";
import { TRADE_DATA } from "@/data/economy/tradeData";

/**
 * Configuration for `<CategoryHero />`.
 *
 * Adding a category means adding one entry to `CATEGORY_HEROES` below — colour,
 * icons, copy and figures. No component code changes.
 */
export interface CategoryHeroStat {
  id: string;
  icon: LucideIcon;
  label: string;
  /** Real figure, counted up on mount. */
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Signed variation against the previous snapshot year, when one exists. */
  delta?: string;
  /** Scope of the figure, so a cumulated total is never read as a world total. */
  note?: string;
}

export interface CategoryHeroConfig {
  eyebrow: string;
  /** Leading words of the H1, in ink. */
  title: string;
  /** Trailing word(s) of the H1, in the category colour. */
  titleAccent: string;
  subtitle: string;
  /** Category colour — globe, curves, badges and highlights. */
  accent: string;
  /** Darker sibling used for text, where the accent alone lacks contrast. */
  accentInk: string;
  /** Icon badges scattered around the globe, positioned in % of the hero. */
  icons: FloatingIcon[];
  stats: CategoryHeroStat[];
  sourceNote: string;
}

// ── Économie ────────────────────────────────────────────────────────────────
// Every figure below is summed from the datasets already shipping on
// /map/economy, so the hero can never drift from the map underneath it.

const LATEST = 2025;
const PREVIOUS = 2023;

function yearCountries(year: number) {
  return ECONOMY_YEARS.find((y) => y.year === year)?.countries ?? {};
}

type CountryMetric = (name: string, year: number) => number;

const gdpOf: CountryMetric = (name, year) => yearCountries(year)[name]?.gdp ?? 0;

const debtOf: CountryMetric = (name, year) => {
  const c = yearCountries(year)[name];
  if (!c) return 0;
  return c.debt_amount ?? (c.gdp * c.debt_ratio) / 100;
};

const populationOf: CountryMetric = (name, year) => getPopulationMillions(name, year) ?? 0;

function sumFor(metric: CountryMetric, year: number, names: string[]): number {
  return names.reduce((total, name) => total + metric(name, year), 0);
}

const LATEST_COUNTRIES = Object.keys(yearCountries(LATEST));
const COUNTRY_COUNT = LATEST_COUNTRIES.length;

// Snapshot years don't cover exactly the same countries, so variations are
// computed on the intersection only — otherwise a widening panel would read as
// growth (or, for population, as a decline).
const COMPARABLE_COUNTRIES = LATEST_COUNTRIES.filter((name) => name in yearCountries(PREVIOUS));

/** "+3,2 % vs 2023" — like-for-like variation between the two latest snapshots. */
function growth(metric: CountryMetric): string {
  const latest = sumFor(metric, LATEST, COMPARABLE_COUNTRIES);
  const previous = sumFor(metric, PREVIOUS, COMPARABLE_COUNTRIES);
  if (!previous) return "";
  const pct = ((latest - previous) / previous) * 100;
  const formatted = Math.abs(pct).toLocaleString("fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return `${pct >= 0 ? "+" : "−"}${formatted} % vs ${PREVIOUS}`;
}

const GDP_LATEST = sumFor(gdpOf, LATEST, LATEST_COUNTRIES);
const DEBT_LATEST = sumFor(debtOf, LATEST, LATEST_COUNTRIES);
const POP_LATEST = sumFor(populationOf, LATEST, LATEST_COUNTRIES);
const EXPORTS = TRADE_DATA.reduce((total, e) => total + e.exports_bn, 0);

const ECONOMY_HERO: CategoryHeroConfig = {
  eyebrow: "Économie",
  title: "Économie",
  titleAccent: "mondiale",
  subtitle: "Données économiques mondiales, comparables et actualisées en temps réel.",
  accent: "#10B981",
  accentInk: "#0C8F5F",
  // Laid out around the globe, clear of the title block and of the panel.
  icons: [
    { id: "usd", icon: DollarSign, x: 10, y: 34 },
    { id: "eur", icon: Euro, x: 7.5, y: 54 },
    { id: "gold", icon: Coins, x: 15.5, y: 70 },
    { id: "bank", icon: Landmark, x: 21.5, y: 46 },
    { id: "markets", icon: BarChart3, x: 37, y: 39 },
    { id: "population", icon: Users, x: 50, y: 37 },
    { id: "tech", icon: Cpu, x: 64, y: 40 },
    { id: "jpy", icon: JapaneseYen, x: 81, y: 36 },
    { id: "energy", icon: Droplet, x: 77.5, y: 53 },
    { id: "industry", icon: Factory, x: 93, y: 43 },
    { id: "agriculture", icon: Sprout, x: 85, y: 66 },
  ],
  stats: [
    {
      id: "gdp",
      icon: BarChart3,
      label: "PIB cumulé",
      value: GDP_LATEST / 1000,
      decimals: 1,
      suffix: " T€",
      delta: growth(gdpOf),
      note: `${COUNTRY_COUNT} pays suivis`,
    },
    {
      id: "debt",
      icon: Landmark,
      label: "Dette publique cumulée",
      value: DEBT_LATEST / 1000,
      decimals: 1,
      suffix: " T€",
      delta: growth(debtOf),
      note: "Dette brute des administrations",
    },
    {
      id: "population",
      icon: Users,
      label: "Population couverte",
      value: POP_LATEST / 1000,
      decimals: 2,
      suffix: " Md",
      delta: growth(populationOf),
      note: "Habitants des pays suivis",
    },
    {
      id: "trade",
      icon: PieChart,
      label: "Exportations cumulées",
      value: EXPORTS / 1000,
      decimals: 1,
      suffix: " T€",
      note: `${TRADE_DATA.length} pays · dernier exercice`,
    },
  ],
  sourceNote: `Sources : FMI (WEO), Banque mondiale, OIT, OMC — projections ${LATEST}.`,
};

// ── Registry ────────────────────────────────────────────────────────────────

const CATEGORY_HEROES: Record<string, CategoryHeroConfig> = {
  economy: ECONOMY_HERO,
};

export function getCategoryHero(themeId: string): CategoryHeroConfig | undefined {
  return CATEGORY_HEROES[themeId];
}

/** Cheap check for server components — avoids sending config over the boundary. */
export function hasCategoryHero(themeId: string): boolean {
  return themeId in CATEGORY_HEROES;
}

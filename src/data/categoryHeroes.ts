import {
  BarChart3,
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
import type { FlowIcon } from "@/components/category/DataFlowCurves";
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
  /** Leading words of the H1, in ink. */
  title: string;
  /** Trailing word(s) of the H1, in the category colour. */
  titleAccent: string;
  subtitle: string;
  /** Category colour — globe, curves, badges and highlights. */
  accent: string;
  /** Darker sibling used for text, where the accent alone lacks contrast. */
  accentInk: string;
  /** Icon badges pinned onto the flow strands arcing above the globe. */
  icons: FlowIcon[];
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
  title: "Économie",
  titleAccent: "mondiale",
  subtitle: "Données économiques mondiales, comparables et actualisées en temps réel.",
  accent: "#10B981",
  accentInk: "#0C8F5F",
  // Each badge rides a strand of the sheaf: `u` is its position across the
  // width, `curve` the strand it rests on — index 0 hugs the globe, higher
  // indices run further above it. Badges near the shoulders sit on the upper
  // strands so they stay clear of the panel as the flow dives away.
  icons: [
    { id: "eur", icon: Euro, curve: 6, u: 0.235 },
    { id: "usd", icon: DollarSign, curve: 4, u: 0.3 },
    { id: "bank", icon: Landmark, curve: 5, u: 0.37 },
    { id: "markets", icon: BarChart3, curve: 2, u: 0.435 },
    { id: "population", icon: Users, curve: 6, u: 0.5 },
    { id: "energy", icon: Droplet, curve: 3, u: 0.565 },
    { id: "jpy", icon: JapaneseYen, curve: 5, u: 0.63 },
    { id: "industry", icon: Factory, curve: 2, u: 0.7 },
    { id: "agriculture", icon: Sprout, curve: 6, u: 0.765 },
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
  sourceNote: `Sources : FMI (WEO), Banque mondiale, OIT, OMC · projections ${LATEST}.`,
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

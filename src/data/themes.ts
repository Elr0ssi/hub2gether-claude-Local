import type { Theme } from "@/types";

export const THEMES: Theme[] = [
  {
    id: "empires",
    label: "Empires",
    description:
      "Trace the rise and fall of history's greatest empires across centuries. From Rome to the Mongols, explore territorial expansion, collapse, and legacy.",
    slug: "empires",
    available: true,
    icon: "Crown",
  },
  {
    id: "economy",
    label: "Economy",
    description:
      "Map global debt, GDP, trade flows, and economic inequality. Understand how finance reshapes geopolitical power in the 21st century.",
    slug: "economy",
    available: false,
    icon: "TrendingUp",
    comingSoonLabel: "Q3 2025",
  },
  {
    id: "conflicts",
    label: "Conflicts",
    description:
      "Track active conflict zones, frozen wars, and territorial disputes. See how armed conflict reshapes borders and alliances in real time.",
    slug: "conflicts",
    available: false,
    icon: "Swords",
    comingSoonLabel: "Q3 2025",
  },
  {
    id: "military",
    label: "Military",
    description:
      "Compare defense budgets, military capabilities, and nuclear arsenals. Understand the balance of power through hard numbers.",
    slug: "military",
    available: false,
    icon: "Shield",
    comingSoonLabel: "Q4 2025",
  },
  {
    id: "epidemics",
    label: "Epidemics",
    description:
      "Explore how pandemics spread across borders, which regions face the highest exposure, and how health crises rewrite global priorities.",
    slug: "epidemics",
    available: true,
    icon: "Activity",
  },
];

export function getThemeById(id: string): Theme | undefined {
  return THEMES.find((t) => t.id === id);
}

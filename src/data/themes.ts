import type { Theme } from "@/types";

export const THEMES: Theme[] = [
  {
    id: "empires",
    label: "Empires",
    description:
      "Retracez l'ascension et la chute des plus grands empires de l'histoire. De Rome aux Mongols, explorez l'expansion territoriale, les effondrements et l'héritage laissé.",
    slug: "empires",
    available: true,
    icon: "Crown",
  },
  {
    id: "economy",
    label: "Économie",
    description:
      "Cartographiez la dette mondiale, le PIB, les flux commerciaux et les inégalités économiques. Comprenez comment la finance redessine les équilibres géopolitiques au XXIe siècle.",
    slug: "economy",
    available: true,
    icon: "TrendingUp",
  },
  {
    id: "politics",
    label: "Politique",
    description:
      "Visualisez les régimes politiques de chaque pays depuis 1900 — démocraties, dictatures, monarchies. Explorez les orientations politiques et les transitions historiques sur une frise chronologique.",
    slug: "politics",
    available: true,
    icon: "Vote",
  },
  {
    id: "conflicts",
    label: "Conflits",
    description:
      "Suivez les zones de conflit actives, les guerres gelées et les disputes territoriales. Observez comment les conflits armés remodèlent frontières et alliances en temps réel.",
    slug: "conflicts",
    available: false,
    icon: "Swords",
    comingSoonLabel: "T3 2025",
  },
  {
    id: "military",
    label: "Militaire",
    description:
      "Comparez les budgets de défense, les capacités militaires et les arsenaux nucléaires. Appréhendez l'équilibre des forces à travers des données concrètes.",
    slug: "military",
    available: false,
    icon: "Shield",
    comingSoonLabel: "T4 2025",
  },
  {
    id: "epidemics",
    label: "Épidémies",
    description:
      "Explorez comment les pandémies franchissent les frontières, quelles régions subissent la plus forte exposition et comment les crises sanitaires redéfinissent les priorités mondiales.",
    slug: "epidemics",
    available: true,
    icon: "Activity",
  },
];

export function getThemeById(id: string): Theme | undefined {
  return THEMES.find((t) => t.id === id);
}

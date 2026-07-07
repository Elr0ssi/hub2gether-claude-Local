export interface CountryEntry {
  economy?: { gdp: string; gdpPC?: string; rank?: number };
  politics?: { regime: string; score?: number };
  epidemics?: { covid?: string; main?: string };
  military?: { spend?: string; rank?: number };
}

export const COUNTRIES: Record<string, CountryEntry> = {
  "United States of America": {
    economy: { gdp: "$28.8T", gdpPC: "$85,373", rank: 1 },
    politics: { regime: "Démocratie imparfaite", score: 7.85 },
    epidemics: { covid: "1 191 564 décès", main: "COVID-19" },
    military: { spend: "$916 Mds", rank: 1 },
  },
  "China": {
    economy: { gdp: "$18.5T", gdpPC: "$13,136", rank: 2 },
    politics: { regime: "Régime autoritaire", score: 1.94 },
    epidemics: { covid: "122 404 décès", main: "COVID-19" },
    military: { spend: "$296 Mds", rank: 2 },
  },
  "Germany": {
    economy: { gdp: "$4.59T", gdpPC: "$54,291", rank: 3 },
    politics: { regime: "Démocratie complète", score: 8.80 },
    epidemics: { covid: "174 979 décès", main: "COVID-19" },
    military: { spend: "$66.8 Mds", rank: 7 },
  },
  "Japan": {
    economy: { gdp: "$4.21T", gdpPC: "$33,138", rank: 4 },
    politics: { regime: "Démocratie complète", score: 8.40 },
    epidemics: { covid: "74 694 décès", main: "COVID-19" },
    military: { spend: "$47.0 Mds", rank: 11 },
  },
  "India": {
    economy: { gdp: "$3.94T", gdpPC: "$2,731", rank: 5 },
    politics: { regime: "Démocratie imparfaite", score: 7.18 },
    epidemics: { covid: "533 333 décès", main: "COVID-19" },
    military: { spend: "$83.6 Mds", rank: 4 },
  },
  "United Kingdom": {
    economy: { gdp: "$3.34T", gdpPC: "$49,100", rank: 6 },
    politics: { regime: "Démocratie complète", score: 8.28 },
    epidemics: { covid: "232 112 décès", main: "COVID-19" },
    military: { spend: "$74.9 Mds", rank: 6 },
  },
  "France": {
    economy: { gdp: "$3.14T", gdpPC: "$47,360", rank: 7 },
    politics: { regime: "Démocratie imparfaite", score: 7.99 },
    epidemics: { covid: "168 091 décès", main: "COVID-19" },
    military: { spend: "$60.9 Mds", rank: 9 },
  },
  "Brazil": {
    economy: { gdp: "$2.33T", gdpPC: "$10,992", rank: 8 },
    politics: { regime: "Démocratie imparfaite", score: 6.86 },
    epidemics: { covid: "711 405 décès", main: "COVID-19" },
    military: { spend: "$20.7 Mds", rank: 20 },
  },
  "Italy": {
    economy: { gdp: "$2.34T", gdpPC: "$39,617", rank: 9 },
    politics: { regime: "Démocratie imparfaite", score: 7.78 },
    epidemics: { covid: "197 521 décès", main: "COVID-19" },
    military: { spend: "$35.8 Mds", rank: 12 },
  },
  "Canada": {
    economy: { gdp: "$2.31T", gdpPC: "$58,398", rank: 10 },
    politics: { regime: "Démocratie complète", score: 8.65 },
    epidemics: { covid: "57 742 décès", main: "COVID-19" },
    military: { spend: "$26.9 Mds", rank: 14 },
  },
  "Russia": {
    economy: { gdp: "$2.24T", gdpPC: "$15,349", rank: 11 },
    politics: { regime: "Régime autoritaire", score: 2.22 },
    epidemics: { covid: "399 050 décès", main: "COVID-19" },
    military: { spend: "$109 Mds", rank: 3 },
  },
  "South Korea": {
    economy: { gdp: "$1.89T", gdpPC: "$36,131", rank: 12 },
    politics: { regime: "Démocratie complète", score: 8.09 },
    epidemics: { covid: "35 934 décès", main: "COVID-19" },
    military: { spend: "$47.9 Mds", rank: 10 },
  },
  "Australia": {
    economy: { gdp: "$1.77T", gdpPC: "$66,408", rank: 13 },
    politics: { regime: "Démocratie complète", score: 8.71 },
    epidemics: { covid: "26 396 décès", main: "COVID-19" },
    military: { spend: "$32.3 Mds", rank: 13 },
  },
  "Mexico": {
    economy: { gdp: "$1.79T", gdpPC: "$13,636", rank: 14 },
    politics: { regime: "Régime hybride", score: 5.45 },
    epidemics: { covid: "334 336 décès", main: "COVID-19" },
    military: { spend: "$11.5 Mds", rank: 28 },
  },
  "Spain": {
    economy: { gdp: "$1.71T", gdpPC: "$35,290", rank: 15 },
    politics: { regime: "Démocratie imparfaite", score: 7.94 },
    epidemics: { covid: "121 852 décès", main: "COVID-19" },
    military: { spend: "$20.3 Mds", rank: 21 },
  },
  "Indonesia": {
    economy: { gdp: "$1.47T", gdpPC: "$5,310", rank: 16 },
    politics: { regime: "Démocratie imparfaite", score: 6.53 },
    epidemics: { covid: "160 952 décès", main: "COVID-19" },
    military: { spend: "$9.4 Mds", rank: 32 },
  },
  "Netherlands": {
    economy: { gdp: "$1.18T", gdpPC: "$66,288", rank: 17 },
    politics: { regime: "Démocratie complète", score: 9.00 },
    epidemics: { covid: "23 045 décès", main: "COVID-19" },
    military: { spend: "$20.4 Mds", rank: 18 },
  },
  "Saudi Arabia": {
    economy: { gdp: "$1.13T", gdpPC: "$30,436", rank: 18 },
    politics: { regime: "Régime autoritaire", score: 1.84 },
    epidemics: { covid: "9 653 décès", main: "COVID-19" },
    military: { spend: "$75.8 Mds", rank: 5 },
  },
  "Turkey": {
    economy: { gdp: "$1.12T", gdpPC: "$13,135", rank: 19 },
    politics: { regime: "Régime autoritaire", score: 3.14 },
    epidemics: { covid: "101 672 décès", main: "COVID-19" },
    military: { spend: "$18.5 Mds", rank: 23 },
  },
  "Switzerland": {
    economy: { gdp: "$0.89T", gdpPC: "$99,996", rank: 20 },
    politics: { regime: "Démocratie complète", score: 9.14 },
    epidemics: { covid: "14 127 décès", main: "COVID-19" },
    military: { spend: "$5.8 Mds", rank: 44 },
  },
  "Poland": {
    economy: { gdp: "$0.81T", gdpPC: "$21,364", rank: 21 },
    politics: { regime: "Démocratie imparfaite", score: 6.80 },
    epidemics: { covid: "119 638 décès", main: "COVID-19" },
    military: { spend: "$31.6 Mds", rank: 17 },
  },
  "Argentina": {
    economy: { gdp: "$0.64T", gdpPC: "$13,736", rank: 22 },
    politics: { regime: "Démocratie imparfaite", score: 6.68 },
    epidemics: { covid: "130 472 décès", main: "COVID-19" },
    military: { spend: "$2.5 Mds", rank: 58 },
  },
  "Sweden": {
    economy: { gdp: "$0.60T", gdpPC: "$56,213", rank: 23 },
    politics: { regime: "Démocratie complète", score: 9.17 },
    epidemics: { covid: "23 540 décès", main: "COVID-19" },
    military: { spend: "$8.7 Mds", rank: 35 },
  },
  "Belgium": {
    economy: { gdp: "$0.63T", gdpPC: "$53,533", rank: 24 },
    politics: { regime: "Démocratie complète", score: 8.01 },
    epidemics: { covid: "35 040 décès", main: "COVID-19" },
    military: { spend: "$6.6 Mds", rank: 41 },
  },
  "Norway": {
    economy: { gdp: "$0.55T", gdpPC: "$98,462", rank: 25 },
    politics: { regime: "Démocratie complète", score: 9.81 },
    epidemics: { covid: "4 106 décès", main: "COVID-19" },
    military: { spend: "$10.0 Mds", rank: 30 },
  },
  "Iran": {
    economy: { gdp: "$0.70T", gdpPC: "$8,025", rank: 26 },
    politics: { regime: "Régime autoritaire", score: 1.20 },
    epidemics: { covid: "146 291 décès", main: "COVID-19" },
    military: { spend: "$6.8 Mds", rank: 40 },
  },
  "Thailand": {
    economy: { gdp: "$0.53T", gdpPC: "$7,445", rank: 27 },
    politics: { regime: "Régime hybride", score: 4.30 },
    epidemics: { covid: "34 017 décès", main: "COVID-19" },
    military: { spend: "$7.3 Mds", rank: 38 },
  },
  "United Arab Emirates": {
    economy: { gdp: "$0.51T", gdpPC: "$50,858", rank: 28 },
    politics: { regime: "Régime autoritaire", score: 2.55 },
    epidemics: { covid: "2 348 décès", main: "COVID-19" },
    military: { spend: "$22.8 Mds", rank: 16 },
  },
  "Austria": {
    economy: { gdp: "$0.52T", gdpPC: "$57,074", rank: 29 },
    politics: { regime: "Démocratie complète", score: 8.20 },
    epidemics: { covid: "23 219 décès", main: "COVID-19" },
    military: { spend: "$4.3 Mds", rank: 48 },
  },
  "Nigeria": {
    economy: { gdp: "$0.39T", gdpPC: "$1,726", rank: 30 },
    politics: { regime: "Régime hybride", score: 4.02 },
    epidemics: { covid: "3 155 décès", main: "COVID-19" },
    military: { spend: "$3.1 Mds", rank: 55 },
  },
  "Israel": {
    economy: { gdp: "$0.52T", gdpPC: "$52,166", rank: 31 },
    politics: { regime: "Démocratie imparfaite", score: 7.10 },
    epidemics: { covid: "12 239 décès", main: "COVID-19" },
    military: { spend: "$27.5 Mds", rank: 15 },
  },
  "South Africa": {
    economy: { gdp: "$0.37T", gdpPC: "$6,003", rank: 32 },
    politics: { regime: "Démocratie imparfaite", score: 7.05 },
    epidemics: { covid: "102 595 décès", main: "COVID-19" },
    military: { spend: "$2.5 Mds", rank: 57 },
  },
  "Egypt": {
    economy: { gdp: "$0.35T", gdpPC: "$3,228", rank: 33 },
    politics: { regime: "Régime autoritaire", score: 2.93 },
    epidemics: { covid: "24 922 décès", main: "COVID-19" },
    military: { spend: "$4.6 Mds", rank: 47 },
  },
  "Denmark": {
    economy: { gdp: "$0.41T", gdpPC: "$69,273", rank: 34 },
    politics: { regime: "Démocratie complète", score: 9.07 },
    epidemics: { covid: "7 706 décès", main: "COVID-19" },
    military: { spend: "$5.8 Mds", rank: 43 },
  },
  "Philippines": {
    economy: { gdp: "$0.44T", gdpPC: "$3,852", rank: 35 },
    politics: { regime: "Régime hybride", score: 5.96 },
    epidemics: { covid: "66 651 décès", main: "COVID-19" },
    military: { spend: "$4.2 Mds", rank: 50 },
  },
  "Singapore": {
    economy: { gdp: "$0.50T", gdpPC: "$84,734", rank: 36 },
    politics: { regime: "Régime hybride", score: 6.27 },
    epidemics: { covid: "1 738 décès", main: "COVID-19" },
    military: { spend: "$12.2 Mds", rank: 27 },
  },
  "Malaysia": {
    economy: { gdp: "$0.44T", gdpPC: "$12,952", rank: 37 },
    politics: { regime: "Démocratie imparfaite", score: 7.41 },
    epidemics: { covid: "36 930 décès", main: "COVID-19" },
    military: { spend: "$4.6 Mds", rank: 46 },
  },
  "Vietnam": {
    economy: { gdp: "$0.43T", gdpPC: "$4,324", rank: 38 },
    politics: { regime: "Régime autoritaire", score: 2.58 },
    epidemics: { covid: "43 186 décès", main: "COVID-19" },
    military: { spend: "$6.1 Mds", rank: 42 },
  },
  "Colombia": {
    economy: { gdp: "$0.33T", gdpPC: "$6,380", rank: 39 },
    politics: { regime: "Démocratie imparfaite", score: 6.80 },
    epidemics: { covid: "140 426 décès", main: "COVID-19" },
    military: { spend: "$5.3 Mds", rank: 45 },
  },
  "Pakistan": {
    economy: { gdp: "$0.37T", gdpPC: "$1,631", rank: 40 },
    politics: { regime: "Régime autoritaire", score: 3.57 },
    epidemics: { covid: "30 632 décès", main: "COVID-19" },
    military: { spend: "$10.3 Mds", rank: 29 },
  },
  "Chile": {
    economy: { gdp: "$0.34T", gdpPC: "$17,066", rank: 41 },
    politics: { regime: "Démocratie imparfaite", score: 7.89 },
    epidemics: { covid: "64 479 décès", main: "COVID-19" },
    military: { spend: "$5.3 Mds", rank: 46 },
  },
  "Finland": {
    economy: { gdp: "$0.31T", gdpPC: "$55,800", rank: 42 },
    politics: { regime: "Démocratie complète", score: 9.30 },
    epidemics: { covid: "8 023 décès", main: "COVID-19" },
    military: { spend: "$5.8 Mds", rank: 43 },
  },
  "Romania": {
    economy: { gdp: "$0.35T", gdpPC: "$18,238", rank: 43 },
    politics: { regime: "Démocratie imparfaite", score: 6.43 },
    epidemics: { covid: "68 139 décès", main: "COVID-19" },
    military: { spend: "$7.5 Mds", rank: 37 },
  },
  "Portugal": {
    economy: { gdp: "$0.29T", gdpPC: "$28,087", rank: 44 },
    politics: { regime: "Démocratie complète", score: 8.26 },
    epidemics: { covid: "26 234 décès", main: "COVID-19" },
    military: { spend: "$3.8 Mds", rank: 52 },
  },
  "Czech Republic": {
    economy: { gdp: "$0.33T", gdpPC: "$30,834", rank: 45 },
    politics: { regime: "Démocratie complète", score: 8.38 },
    epidemics: { covid: "42 645 décès", main: "COVID-19" },
    military: { spend: "$6.3 Mds", rank: 41 },
  },
  "New Zealand": {
    economy: { gdp: "$0.25T", gdpPC: "$47,706", rank: 46 },
    politics: { regime: "Démocratie complète", score: 9.61 },
    epidemics: { covid: "3 556 décès", main: "COVID-19" },
    military: { spend: "$3.5 Mds", rank: 54 },
  },
  "Peru": {
    economy: { gdp: "$0.27T", gdpPC: "$7,866", rank: 47 },
    politics: { regime: "Régime hybride", score: 5.20 },
    epidemics: { covid: "221 252 décès", main: "COVID-19" },
    military: { spend: "$3.1 Mds", rank: 56 },
  },
  "Greece": {
    economy: { gdp: "$0.23T", gdpPC: "$21,908", rank: 48 },
    politics: { regime: "Démocratie imparfaite", score: 7.72 },
    epidemics: { covid: "37 660 décès", main: "COVID-19" },
    military: { spend: "$9.3 Mds", rank: 33 },
  },
  "Hungary": {
    economy: { gdp: "$0.23T", gdpPC: "$23,831", rank: 49 },
    politics: { regime: "Régime hybride", score: 3.67 },
    epidemics: { covid: "48 825 décès", main: "COVID-19" },
    military: { spend: "$4.8 Mds", rank: 46 },
  },
  "Morocco": {
    economy: { gdp: "$0.14T", gdpPC: "$3,751", rank: 50 },
    politics: { regime: "Régime hybride", score: 4.46 },
    epidemics: { covid: "16 377 décès", main: "COVID-19" },
    military: { spend: "$5.4 Mds", rank: 45 },
  },
  "Ukraine": {
    economy: { gdp: "$0.17T", gdpPC: "$4,802", rank: 51 },
    politics: { regime: "Démocratie imparfaite", score: 5.42 },
    epidemics: { covid: "118 977 décès", main: "COVID-19" },
    military: { spend: "$64.8 Mds", rank: 8 },
  },
  "Algeria": {
    economy: { gdp: "$0.24T", gdpPC: "$5,253", rank: 52 },
    politics: { regime: "Régime autoritaire", score: 3.17 },
    epidemics: { covid: "6 881 décès", main: "COVID-19" },
    military: { spend: "$9.3 Mds", rank: 33 },
  },
  "Kazakhstan": {
    economy: { gdp: "$0.26T", gdpPC: "$13,264", rank: 53 },
    politics: { regime: "Régime autoritaire", score: 2.93 },
    epidemics: { covid: "18 965 décès", main: "COVID-19" },
    military: { spend: "$3.0 Mds", rank: 57 },
  },
  "Ethiopia": {
    economy: { gdp: "$0.16T", gdpPC: "$1,220", rank: 54 },
    politics: { regime: "Régime autoritaire", score: 3.28 },
    epidemics: { covid: "7 572 décès", main: "COVID-19" },
    military: { spend: "$0.7 Mds", rank: 80 },
  },
  "Kenya": {
    economy: { gdp: "$0.12T", gdpPC: "$2,159", rank: 55 },
    politics: { regime: "Régime hybride", score: 4.84 },
    epidemics: { covid: "5 688 décès", main: "COVID-19" },
    military: { spend: "$1.1 Mds", rank: 69 },
  },
};

export const THEME_DATA_LABELS: Record<string, {
  title: string;
  stat: string;
  accent: string;
  href: string;
  tooltip: (entry: CountryEntry) => string | null;
}> = {
  economy: {
    title: "Économie mondiale",
    stat: "$105T de PIB mondial en 2025",
    accent: "#10B981",
    href: "/map/economy",
    tooltip: (e) => e.economy
      ? `PIB : ${e.economy.gdp}${e.economy.gdpPC ? ` · ${e.economy.gdpPC}/hab.` : ""}${e.economy.rank ? ` · #${e.economy.rank} mondial` : ""}`
      : null,
  },
  politics: {
    title: "Régimes politiques",
    stat: "44,8% de la population en démocratie",
    accent: "#8B5CF6",
    href: "/map/politics",
    tooltip: (e) => e.politics
      ? `${e.politics.regime}${e.politics.score != null ? ` · Indice : ${e.politics.score}/10` : ""}`
      : null,
  },
  epidemics: {
    title: "Épidémies & Santé",
    stat: "7,04 millions de décès COVID-19",
    accent: "#EF4444",
    href: "/map/epidemics",
    tooltip: (e) => e.epidemics
      ? `${e.epidemics.main ?? "COVID-19"} · ${e.epidemics.covid ?? "n/a"}`
      : null,
  },
  military: {
    title: "Puissances militaires",
    stat: "2 443 milliards€ de dépenses de défense",
    accent: "#F59E0B",
    href: "/map/military",
    tooltip: (e) => e.military
      ? `Défense : ${e.military.spend ?? "n/a"}${e.military.rank ? ` · #${e.military.rank} mondial` : ""}`
      : null,
  },
  empires: {
    title: "Empires & Histoire",
    stat: "500 ans d'évolution géopolitique mondiale",
    accent: "#39FF88",
    href: "/map/empires",
    tooltip: () => "Explorer l'histoire de ce territoire →",
  },
};

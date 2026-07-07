export interface CountryEntry {
  economy?: { gdp: string; gdpRaw: number; gdpPC?: string; rank?: number };
  chomage?: { rate: string; rateRaw: number };
  politics?: { regime: string; score?: number };
  demographie?: { population: string; popRaw: number };
}

export const COUNTRIES: Record<string, CountryEntry> = {
  "United States of America": {
    economy: { gdp: "$28,8T", gdpRaw: 28.8, gdpPC: "$85 373", rank: 1 },
    chomage: { rate: "3,9%", rateRaw: 3.9 },
    politics: { regime: "Démocratie imparfaite", score: 7.85 },
    demographie: { population: "335M", popRaw: 335 },
  },
  "China": {
    economy: { gdp: "$18,5T", gdpRaw: 18.5, gdpPC: "$13 136", rank: 2 },
    chomage: { rate: "5,2%", rateRaw: 5.2 },
    politics: { regime: "Régime autoritaire", score: 1.94 },
    demographie: { population: "1 416M", popRaw: 1416 },
  },
  "Germany": {
    economy: { gdp: "$4,59T", gdpRaw: 4.59, gdpPC: "$54 291", rank: 3 },
    chomage: { rate: "5,1%", rateRaw: 5.1 },
    politics: { regime: "Démocratie complète", score: 8.80 },
    demographie: { population: "84M", popRaw: 84 },
  },
  "Japan": {
    economy: { gdp: "$4,21T", gdpRaw: 4.21, gdpPC: "$33 138", rank: 4 },
    chomage: { rate: "2,6%", rateRaw: 2.6 },
    politics: { regime: "Démocratie complète", score: 8.40 },
    demographie: { population: "124M", popRaw: 124 },
  },
  "India": {
    economy: { gdp: "$3,94T", gdpRaw: 3.94, gdpPC: "$2 731", rank: 5 },
    chomage: { rate: "7,5%", rateRaw: 7.5 },
    politics: { regime: "Démocratie imparfaite", score: 7.18 },
    demographie: { population: "1 428M", popRaw: 1428 },
  },
  "United Kingdom": {
    economy: { gdp: "$3,34T", gdpRaw: 3.34, gdpPC: "$49 100", rank: 6 },
    chomage: { rate: "4,2%", rateRaw: 4.2 },
    politics: { regime: "Démocratie complète", score: 8.28 },
    demographie: { population: "68M", popRaw: 68 },
  },
  "France": {
    economy: { gdp: "$3,14T", gdpRaw: 3.14, gdpPC: "$47 360", rank: 7 },
    chomage: { rate: "7,3%", rateRaw: 7.3 },
    politics: { regime: "Démocratie imparfaite", score: 7.99 },
    demographie: { population: "68M", popRaw: 68 },
  },
  "Brazil": {
    economy: { gdp: "$2,33T", gdpRaw: 2.33, gdpPC: "$10 992", rank: 8 },
    chomage: { rate: "7,9%", rateRaw: 7.9 },
    politics: { regime: "Démocratie imparfaite", score: 6.86 },
    demographie: { population: "215M", popRaw: 215 },
  },
  "Italy": {
    economy: { gdp: "$2,34T", gdpRaw: 2.34, gdpPC: "$39 617", rank: 9 },
    chomage: { rate: "6,7%", rateRaw: 6.7 },
    politics: { regime: "Démocratie imparfaite", score: 7.78 },
    demographie: { population: "59M", popRaw: 59 },
  },
  "Canada": {
    economy: { gdp: "$2,31T", gdpRaw: 2.31, gdpPC: "$58 398", rank: 10 },
    chomage: { rate: "5,8%", rateRaw: 5.8 },
    politics: { regime: "Démocratie complète", score: 8.65 },
    demographie: { population: "40M", popRaw: 40 },
  },
  "Russia": {
    economy: { gdp: "$2,24T", gdpRaw: 2.24, gdpPC: "$15 349", rank: 11 },
    chomage: { rate: "3,2%", rateRaw: 3.2 },
    politics: { regime: "Régime autoritaire", score: 2.22 },
    demographie: { population: "144M", popRaw: 144 },
  },
  "South Korea": {
    economy: { gdp: "$1,89T", gdpRaw: 1.89, gdpPC: "$36 131", rank: 12 },
    chomage: { rate: "2,9%", rateRaw: 2.9 },
    politics: { regime: "Démocratie complète", score: 8.09 },
    demographie: { population: "52M", popRaw: 52 },
  },
  "Australia": {
    economy: { gdp: "$1,72T", gdpRaw: 1.72, gdpPC: "$64 964", rank: 13 },
    chomage: { rate: "3,8%", rateRaw: 3.8 },
    politics: { regime: "Démocratie complète", score: 8.97 },
    demographie: { population: "26M", popRaw: 26 },
  },
  "Spain": {
    economy: { gdp: "$1,62T", gdpRaw: 1.62, gdpPC: "$33 970", rank: 14 },
    chomage: { rate: "11,7%", rateRaw: 11.7 },
    politics: { regime: "Démocratie imparfaite", score: 7.98 },
    demographie: { population: "47M", popRaw: 47 },
  },
  "Mexico": {
    economy: { gdp: "$1,33T", gdpRaw: 1.33, gdpPC: "$10 114", rank: 15 },
    chomage: { rate: "2,8%", rateRaw: 2.8 },
    politics: { regime: "Démocratie imparfaite", score: 5.77 },
    demographie: { population: "130M", popRaw: 130 },
  },
  "Indonesia": {
    economy: { gdp: "$1,47T", gdpRaw: 1.47, gdpPC: "$5 264", rank: 16 },
    chomage: { rate: "5,3%", rateRaw: 5.3 },
    politics: { regime: "Démocratie imparfaite", score: 6.71 },
    demographie: { population: "277M", popRaw: 277 },
  },
  "Netherlands": {
    economy: { gdp: "$1,12T", gdpRaw: 1.12, gdpPC: "$63 754", rank: 17 },
    chomage: { rate: "3,7%", rateRaw: 3.7 },
    politics: { regime: "Démocratie complète", score: 9.01 },
    demographie: { population: "18M", popRaw: 18 },
  },
  "Turkey": {
    economy: { gdp: "$1,11T", gdpRaw: 1.11, gdpPC: "$12 847", rank: 18 },
    chomage: { rate: "8,5%", rateRaw: 8.5 },
    politics: { regime: "Régime hybride", score: 4.35 },
    demographie: { population: "85M", popRaw: 85 },
  },
  "Saudi Arabia": {
    economy: { gdp: "$1,07T", gdpRaw: 1.07, gdpPC: "$27 940", rank: 19 },
    chomage: { rate: "5,6%", rateRaw: 5.6 },
    politics: { regime: "Régime autoritaire", score: 2.08 },
    demographie: { population: "37M", popRaw: 37 },
  },
  "Argentina": {
    economy: { gdp: "$0,63T", gdpRaw: 0.63, gdpPC: "$13 431", rank: 21 },
    chomage: { rate: "6,5%", rateRaw: 6.5 },
    politics: { regime: "Démocratie imparfaite", score: 6.89 },
    demographie: { population: "46M", popRaw: 46 },
  },
  "Poland": {
    economy: { gdp: "$0,81T", gdpRaw: 0.81, gdpPC: "$21 115", rank: 22 },
    chomage: { rate: "2,9%", rateRaw: 2.9 },
    politics: { regime: "Démocratie imparfaite", score: 7.64 },
    demographie: { population: "38M", popRaw: 38 },
  },
  "Belgium": {
    economy: { gdp: "$0,63T", gdpRaw: 0.63, gdpPC: "$53 261", rank: 23 },
    chomage: { rate: "5,7%", rateRaw: 5.7 },
    politics: { regime: "Démocratie complète", score: 7.89 },
    demographie: { population: "11,5M", popRaw: 11.5 },
  },
  "Sweden": {
    economy: { gdp: "$0,59T", gdpRaw: 0.59, gdpPC: "$55 394", rank: 24 },
    chomage: { rate: "8,4%", rateRaw: 8.4 },
    politics: { regime: "Démocratie complète", score: 9.39 },
    demographie: { population: "10,5M", popRaw: 10.5 },
  },
  "Thailand": {
    economy: { gdp: "$0,54T", gdpRaw: 0.54, gdpPC: "$7 494", rank: 25 },
    chomage: { rate: "1,1%", rateRaw: 1.1 },
    politics: { regime: "Régime hybride", score: 5.01 },
    demographie: { population: "72M", popRaw: 72 },
  },
  "Iran": {
    economy: { gdp: "$0,42T", gdpRaw: 0.42, gdpPC: "$4 630", rank: 26 },
    chomage: { rate: "10,0%", rateRaw: 10.0 },
    politics: { regime: "Régime autoritaire", score: 1.73 },
    demographie: { population: "89M", popRaw: 89 },
  },
  "Austria": {
    economy: { gdp: "$0,51T", gdpRaw: 0.51, gdpPC: "$55 846", rank: 27 },
    chomage: { rate: "5,0%", rateRaw: 5.0 },
    politics: { regime: "Démocratie complète", score: 8.30 },
    demographie: { population: "9,1M", popRaw: 9.1 },
  },
  "United Arab Emirates": {
    economy: { gdp: "$0,50T", gdpRaw: 0.50, gdpPC: "$48 952", rank: 28 },
    chomage: { rate: "3,4%", rateRaw: 3.4 },
    politics: { regime: "Régime autoritaire", score: 2.79 },
    demographie: { population: "9,8M", popRaw: 9.8 },
  },
  "Nigeria": {
    economy: { gdp: "$0,50T", gdpRaw: 0.50, gdpPC: "$2 184", rank: 29 },
    chomage: { rate: "33,3%", rateRaw: 33.3 },
    politics: { regime: "Régime hybride", score: 4.23 },
    demographie: { population: "222M", popRaw: 222 },
  },
  "South Africa": {
    economy: { gdp: "$0,38T", gdpRaw: 0.38, gdpPC: "$6 192", rank: 30 },
    chomage: { rate: "32,9%", rateRaw: 32.9 },
    politics: { regime: "Démocratie imparfaite", score: 7.05 },
    demographie: { population: "61M", popRaw: 61 },
  },
  "Bangladesh": {
    economy: { gdp: "$0,45T", gdpRaw: 0.45, gdpPC: "$2 688", rank: 31 },
    chomage: { rate: "5,1%", rateRaw: 5.1 },
    politics: { regime: "Régime autoritaire", score: 3.47 },
    demographie: { population: "173M", popRaw: 173 },
  },
  "Norway": {
    economy: { gdp: "$0,49T", gdpRaw: 0.49, gdpPC: "$89 154", rank: 32 },
    chomage: { rate: "3,6%", rateRaw: 3.6 },
    politics: { regime: "Démocratie complète", score: 9.81 },
    demographie: { population: "5,4M", popRaw: 5.4 },
  },
  "Egypt": {
    economy: { gdp: "$0,35T", gdpRaw: 0.35, gdpPC: "$3 228", rank: 33 },
    chomage: { rate: "7,1%", rateRaw: 7.1 },
    politics: { regime: "Régime autoritaire", score: 2.93 },
    demographie: { population: "107M", popRaw: 107 },
  },
  "Denmark": {
    economy: { gdp: "$0,41T", gdpRaw: 0.41, gdpPC: "$69 273", rank: 34 },
    chomage: { rate: "5,0%", rateRaw: 5.0 },
    politics: { regime: "Démocratie complète", score: 9.07 },
    demographie: { population: "5,9M", popRaw: 5.9 },
  },
  "Philippines": {
    economy: { gdp: "$0,44T", gdpRaw: 0.44, gdpPC: "$3 852", rank: 35 },
    chomage: { rate: "4,5%", rateRaw: 4.5 },
    politics: { regime: "Régime hybride", score: 5.96 },
    demographie: { population: "117M", popRaw: 117 },
  },
  "Singapore": {
    economy: { gdp: "$0,50T", gdpRaw: 0.50, gdpPC: "$84 734", rank: 36 },
    chomage: { rate: "2,1%", rateRaw: 2.1 },
    politics: { regime: "Régime hybride", score: 6.27 },
    demographie: { population: "5,9M", popRaw: 5.9 },
  },
  "Malaysia": {
    economy: { gdp: "$0,44T", gdpRaw: 0.44, gdpPC: "$12 952", rank: 37 },
    chomage: { rate: "3,4%", rateRaw: 3.4 },
    politics: { regime: "Démocratie imparfaite", score: 7.41 },
    demographie: { population: "34M", popRaw: 34 },
  },
  "Vietnam": {
    economy: { gdp: "$0,43T", gdpRaw: 0.43, gdpPC: "$4 324", rank: 38 },
    chomage: { rate: "2,3%", rateRaw: 2.3 },
    politics: { regime: "Régime autoritaire", score: 2.58 },
    demographie: { population: "98M", popRaw: 98 },
  },
  "Colombia": {
    economy: { gdp: "$0,33T", gdpRaw: 0.33, gdpPC: "$6 380", rank: 39 },
    chomage: { rate: "9,7%", rateRaw: 9.7 },
    politics: { regime: "Démocratie imparfaite", score: 6.80 },
    demographie: { population: "52M", popRaw: 52 },
  },
  "Pakistan": {
    economy: { gdp: "$0,37T", gdpRaw: 0.37, gdpPC: "$1 631", rank: 40 },
    chomage: { rate: "8,5%", rateRaw: 8.5 },
    politics: { regime: "Régime autoritaire", score: 3.57 },
    demographie: { population: "231M", popRaw: 231 },
  },
  "Chile": {
    economy: { gdp: "$0,34T", gdpRaw: 0.34, gdpPC: "$17 066", rank: 41 },
    chomage: { rate: "8,6%", rateRaw: 8.6 },
    politics: { regime: "Démocratie imparfaite", score: 7.89 },
    demographie: { population: "19,7M", popRaw: 19.7 },
  },
  "Finland": {
    economy: { gdp: "$0,31T", gdpRaw: 0.31, gdpPC: "$55 800", rank: 42 },
    chomage: { rate: "7,5%", rateRaw: 7.5 },
    politics: { regime: "Démocratie complète", score: 9.30 },
    demographie: { population: "5,5M", popRaw: 5.5 },
  },
  "Romania": {
    economy: { gdp: "$0,35T", gdpRaw: 0.35, gdpPC: "$18 238", rank: 43 },
    chomage: { rate: "5,6%", rateRaw: 5.6 },
    politics: { regime: "Démocratie imparfaite", score: 6.43 },
    demographie: { population: "19M", popRaw: 19 },
  },
  "Portugal": {
    economy: { gdp: "$0,29T", gdpRaw: 0.29, gdpPC: "$28 087", rank: 44 },
    chomage: { rate: "6,6%", rateRaw: 6.6 },
    politics: { regime: "Démocratie complète", score: 8.26 },
    demographie: { population: "10,2M", popRaw: 10.2 },
  },
  "Czech Republic": {
    economy: { gdp: "$0,33T", gdpRaw: 0.33, gdpPC: "$30 834", rank: 45 },
    chomage: { rate: "2,6%", rateRaw: 2.6 },
    politics: { regime: "Démocratie complète", score: 8.38 },
    demographie: { population: "10,9M", popRaw: 10.9 },
  },
  "New Zealand": {
    economy: { gdp: "$0,25T", gdpRaw: 0.25, gdpPC: "$47 706", rank: 46 },
    chomage: { rate: "4,3%", rateRaw: 4.3 },
    politics: { regime: "Démocratie complète", score: 9.61 },
    demographie: { population: "5,2M", popRaw: 5.2 },
  },
  "Peru": {
    economy: { gdp: "$0,27T", gdpRaw: 0.27, gdpPC: "$7 866", rank: 47 },
    chomage: { rate: "6,8%", rateRaw: 6.8 },
    politics: { regime: "Régime hybride", score: 5.20 },
    demographie: { population: "34M", popRaw: 34 },
  },
  "Greece": {
    economy: { gdp: "$0,23T", gdpRaw: 0.23, gdpPC: "$21 908", rank: 48 },
    chomage: { rate: "10,5%", rateRaw: 10.5 },
    politics: { regime: "Démocratie imparfaite", score: 7.72 },
    demographie: { population: "10,4M", popRaw: 10.4 },
  },
  "Hungary": {
    economy: { gdp: "$0,23T", gdpRaw: 0.23, gdpPC: "$23 831", rank: 49 },
    chomage: { rate: "4,3%", rateRaw: 4.3 },
    politics: { regime: "Régime hybride", score: 3.67 },
    demographie: { population: "9,6M", popRaw: 9.6 },
  },
  "Morocco": {
    economy: { gdp: "$0,14T", gdpRaw: 0.14, gdpPC: "$3 751", rank: 50 },
    chomage: { rate: "13,0%", rateRaw: 13.0 },
    politics: { regime: "Régime hybride", score: 4.46 },
    demographie: { population: "37M", popRaw: 37 },
  },
  "Ukraine": {
    economy: { gdp: "$0,17T", gdpRaw: 0.17, gdpPC: "$4 802", rank: 51 },
    chomage: { rate: "15,0%", rateRaw: 15.0 },
    politics: { regime: "Démocratie imparfaite", score: 5.42 },
    demographie: { population: "38M", popRaw: 38 },
  },
  "Algeria": {
    economy: { gdp: "$0,24T", gdpRaw: 0.24, gdpPC: "$5 253", rank: 52 },
    chomage: { rate: "14,0%", rateRaw: 14.0 },
    politics: { regime: "Régime autoritaire", score: 3.17 },
    demographie: { population: "46M", popRaw: 46 },
  },
  "Kazakhstan": {
    economy: { gdp: "$0,26T", gdpRaw: 0.26, gdpPC: "$13 264", rank: 53 },
    chomage: { rate: "4,8%", rateRaw: 4.8 },
    politics: { regime: "Régime autoritaire", score: 2.93 },
    demographie: { population: "19,6M", popRaw: 19.6 },
  },
  "Ethiopia": {
    economy: { gdp: "$0,16T", gdpRaw: 0.16, gdpPC: "$1 220", rank: 54 },
    chomage: { rate: "19,8%", rateRaw: 19.8 },
    politics: { regime: "Régime autoritaire", score: 3.28 },
    demographie: { population: "127M", popRaw: 127 },
  },
  "Kenya": {
    economy: { gdp: "$0,12T", gdpRaw: 0.12, gdpPC: "$2 159", rank: 55 },
    chomage: { rate: "5,7%", rateRaw: 5.7 },
    politics: { regime: "Régime hybride", score: 4.84 },
    demographie: { population: "55M", popRaw: 55 },
  },
};

export const THEME_DATA_LABELS: Record<string, {
  title: string;
  stat: string;
  accent: string;
  href: string;
  tooltip: (entry: CountryEntry) => string | null;
}> = {
  pib: {
    title: "PIB mondial",
    stat: "$105T de PIB mondial en 2025",
    accent: "#10B981",
    href: "/map/economy",
    tooltip: (e) => e.economy
      ? `PIB : ${e.economy.gdp}${e.economy.gdpPC ? ` · ${e.economy.gdpPC}/hab.` : ""}${e.economy.rank ? ` · #${e.economy.rank} mondial` : ""}`
      : null,
  },
  chomage: {
    title: "Chômage",
    stat: "Taux de chômage par pays 2024",
    accent: "#F59E0B",
    href: "/map/economy",
    tooltip: (e) => e.chomage
      ? `Taux de chômage : ${e.chomage.rate}`
      : null,
  },
  politique: {
    title: "Régimes politiques",
    stat: "44,8% de la population en démocratie",
    accent: "#8B5CF6",
    href: "/map/politics",
    tooltip: (e) => e.politics
      ? `${e.politics.regime}${e.politics.score != null ? ` · Score : ${e.politics.score}/10` : ""}`
      : null,
  },
  demographie: {
    title: "Démographie mondiale",
    stat: "8,1 milliards d'habitants",
    accent: "#3B82F6",
    href: "/map/economy",
    tooltip: (e) => e.demographie
      ? `Population : ${e.demographie.population}`
      : null,
  },
};

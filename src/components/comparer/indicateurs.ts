/* Ce qu'on peut comparer : chaque indicateur sait où se lire dans la base,
   comment s'écrire, et dans quel groupe se ranger. */

export interface Indic {
  id: string;
  src: "eco" | "demo";
  champ: string;
  label: string;
  groupe: "Économie" | "Démographie";
  /** Une grandeur qui peut être négative : la barre garde son signe. */
  signe?: boolean;
  fmt: (v: number) => string;
  /** La phrase courte pour dire « X fois plus ». */
  nom: string;
}

const n1 = (v: number, d = 1) => v.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: d });

const md = (v: number) => {
  const a = Math.abs(v);
  if (a >= 1000) return `${n1(v / 1000)} T$`;
  return `${n1(v, a >= 100 ? 0 : 1)} Md$`;
};
const hab = (v: number) => {
  const a = Math.abs(v);
  if (a >= 1e9) return `${n1(v / 1e9, 2)} Md`;
  if (a >= 1e6) return `${n1(v / 1e6, a >= 1e8 ? 0 : 1)} M`;
  if (a >= 1e3) return `${n1(v / 1e3, 0)} k`;
  return n1(v, 0);
};

export const INDICS: Indic[] = [
  { id: "gdp", src: "eco", champ: "gdp", label: "PIB", nom: "le PIB", groupe: "Économie", fmt: md },
  { id: "gdp_per_capita", src: "eco", champ: "gdp_per_capita", label: "PIB par habitant", nom: "le PIB par habitant", groupe: "Économie", fmt: (v) => `${n1(v, 0)} $` },
  { id: "trade_balance", src: "eco", champ: "trade_balance", label: "Balance commerciale", nom: "la balance commerciale", groupe: "Économie", signe: true, fmt: md },
  { id: "inflation", src: "eco", champ: "inflation", label: "Inflation", nom: "l'inflation", groupe: "Économie", signe: true, fmt: (v) => `${n1(v)} %` },
  { id: "debt_ratio", src: "eco", champ: "debt_ratio", label: "Dette / PIB", nom: "la dette rapportée au PIB", groupe: "Économie", fmt: (v) => `${n1(v)} %` },
  { id: "unemployment", src: "eco", champ: "unemployment", label: "Chômage", nom: "le chômage", groupe: "Économie", fmt: (v) => `${n1(v)} %` },
  { id: "population", src: "demo", champ: "population", label: "Population", nom: "la population", groupe: "Démographie", fmt: hab },
  { id: "birth_rate", src: "demo", champ: "birth_rate", label: "Natalité", nom: "la natalité", groupe: "Démographie", fmt: (v) => `${n1(v)} pour 1 000` },
  { id: "death_rate", src: "demo", champ: "death_rate", label: "Mortalité", nom: "la mortalité", groupe: "Démographie", fmt: (v) => `${n1(v)} pour 1 000` },
  { id: "natural_change", src: "demo", champ: "natural_change", label: "Accroissement naturel", nom: "l'accroissement naturel", groupe: "Démographie", signe: true, fmt: hab },
  { id: "net_migration", src: "demo", champ: "net_migration", label: "Solde migratoire", nom: "le solde migratoire", groupe: "Démographie", signe: true, fmt: hab },
  { id: "births_annual", src: "demo", champ: "births_annual", label: "Naissances", nom: "les naissances", groupe: "Démographie", fmt: hab },
  { id: "deaths_annual", src: "demo", champ: "deaths_annual", label: "Décès", nom: "les décès", groupe: "Démographie", fmt: hab },
];

export const COULEURS = ["#8b5cff", "#ff6fa5", "#2cc8e6", "#ffb86b"];

export const PRESETS: { label: string; pays: string[] }[] = [
  { label: "France · Allemagne", pays: ["France", "Germany"] },
  { label: "États-Unis · Chine", pays: ["United States of America", "China"] },
  { label: "Les quatre premières économies", pays: ["United States of America", "China", "Germany", "Japan"] },
  { label: "BRICS", pays: ["Brazil", "Russia", "India", "China"] },
  { label: "Europe du Sud", pays: ["France", "Italy", "Spain"] },
];

/* ═══════════════════════════════════════════════════════════════════════════
   PROTOTYPE — LE CONTENU DE LA PAGE CONCEPT

   Route isolée : rien de ce fichier n'est lu ailleurs dans le site.

   ⚠ Les valeurs de marché, l'audience et la satisfaction sont des VALEURS DE
   DÉMONSTRATION, demandées telles quelles pour la maquette. Elles ne sont
   reliées à aucune source et ne doivent pas quitter ce prototype : la page
   les signale par une pastille « démonstration » en en-tête. Les vraies
   mesures d'audience du média sont ailleurs (analytics), et elles ne disent
   pas la même chose.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Topic {
  id: string;
  label: string;
  /** L'inclinaison de son orbite, en degrés. */
  inclinaison: number;
  /** Le rayon de l'orbite, en multiple du rayon de la sphère. */
  rayon: number;
  /** Où le nœud se trouve sur l'orbite au départ, en tours (0 → 1). */
  phase: number;
  /** Sa vitesse propre, en tours par seconde. */
  vitesse: number;
  teinte: string;
  /** Le fragment éditorial qui flotte avec lui. */
  module: { valeur: string; legende: string; image: string };
}

export const TOPICS: Topic[] = [
  {
    id: "economie",
    label: "Économie",
    inclinaison: 14,
    rayon: 1.42,
    phase: 0.08,
    vitesse: 0.017,
    teinte: "#D6A77A",
    module: { valeur: "+2,4 %", legende: "Croissance mondiale", image: "IMAGE_PNG_ECONOMIE" },
  },
  {
    id: "geopolitique",
    label: "Géopolitique",
    inclinaison: -26,
    rayon: 1.24,
    phase: 0.42,
    vitesse: -0.013,
    teinte: "#9EC7D8",
    module: { valeur: "Nouvel équilibre", legende: "des puissances", image: "IMAGE_PNG_GEOPOLITIQUE" },
  },
  {
    id: "climat",
    label: "Climat",
    inclinaison: 58,
    rayon: 1.33,
    phase: 0.71,
    vitesse: 0.011,
    teinte: "#41C7A5",
    module: { valeur: "+1,5 °C", legende: "Trajectoire actuelle", image: "IMAGE_PNG_CLIMAT" },
  },
  {
    id: "ressources",
    label: "Ressources",
    inclinaison: -46,
    rayon: 1.15,
    phase: 0.24,
    vitesse: -0.019,
    teinte: "#C98F5B",
    module: { valeur: "Lithium · Cuivre", legende: "Terres rares", image: "IMAGE_PNG_RESSOURCES" },
  },
  {
    id: "societes",
    label: "Sociétés",
    inclinaison: 34,
    rayon: 1.52,
    phase: 0.58,
    vitesse: 0.009,
    teinte: "#F4F2EE",
    module: { valeur: "8,1 Md", legende: "Habitants suivis", image: "IMAGE_PNG_SOCIETES" },
  },
  {
    id: "analyses",
    label: "Analyses",
    inclinaison: -8,
    rayon: 1.08,
    phase: 0.87,
    vitesse: 0.023,
    teinte: "#9DA4AA",
    module: { valeur: "Le fil long", legende: "Enquêtes et séries", image: "IMAGE_PNG_ANALYSES" },
  },
];

/* ── Le flux « en direct » ─────────────────────────────────────────────────
   Valeurs de démonstration. La micro-courbe est un tracé de forme, pas un
   historique : elle n'est là que pour donner le rythme du ticker. */
export const MARCHES = [
  { nom: "S&P 500", valeur: "7 656,98", delta: "+0,27 %", sens: 1, forme: [3, 5, 4, 6, 5, 7, 6, 8, 9] },
  { nom: "NASDAQ 100", valeur: "29 368,44", delta: "−0,18 %", sens: -1, forme: [8, 7, 8, 6, 7, 5, 6, 4, 4] },
  { nom: "EUR/USD", valeur: "1,0742", delta: "−0,12 %", sens: -1, forme: [6, 6, 5, 6, 4, 5, 4, 3, 4] },
  { nom: "OR", valeur: "2 388,50", delta: "+0,83 %", sens: 1, forme: [2, 3, 3, 5, 4, 6, 7, 8, 9] },
  { nom: "PÉTROLE", valeur: "72,14", delta: "−0,41 %", sens: -1, forme: [7, 6, 7, 5, 6, 4, 5, 4, 3] },
  { nom: "CUIVRE", valeur: "9 142,00", delta: "+0,54 %", sens: 1, forme: [4, 5, 4, 6, 6, 7, 6, 8, 8] },
];

/* ── La fiche pays de l'aperçu carte ──────────────────────────────────────
   Valeurs de démonstration, à brancher sur le socle le jour où ce prototype
   devient une page réelle. */
export const FICHE_PAYS = {
  pays: "France",
  drapeau: "🇫🇷",
  mesures: [
    { label: "PIB", valeur: "3 032 Md $" },
    { label: "Population", valeur: "68,1 M" },
    { label: "Dette publique", valeur: "110,6 %" },
    { label: "Croissance", valeur: "1,1 %" },
  ],
  couverture: [
    { valeur: "195", label: "pays analysés" },
    { valeur: "1 000+", label: "indicateurs" },
    { valeur: "50+", label: "sources" },
  ],
};

export const UNE = {
  titre: ["La nouvelle route", "des métaux critiques"],
  chapo:
    "Entre rivalités, dépendances et transition énergétique, les métaux critiques redessinent les équilibres mondiaux.",
  rubrique: "Ressources",
  duree: "12 min",
  image: "IMAGE_PNG_ARTICLE_01",
};

export const SECONDAIRES = [
  { titre: "Où va l'argent des États ?", rubrique: "Économie", duree: "9 min", image: "IMAGE_PNG_ARTICLE_02" },
  { titre: "Les pays les plus exposés en 2050", rubrique: "Climat", duree: "11 min", image: "IMAGE_PNG_ARTICLE_03" },
  { titre: "Le lithium, nouvel or blanc ?", rubrique: "Ressources", duree: "8 min", image: "IMAGE_PNG_ARTICLE_04" },
];

export const THEMES_EXPLORER = [
  { id: "economie", label: "Économie", ligne: "Croissance, dette, échanges et emploi.", image: "IMAGE_PNG_THEME_01" },
  { id: "geopolitique", label: "Géopolitique", ligne: "Alliances, frontières et rapports de force.", image: "IMAGE_PNG_THEME_02" },
  { id: "climat", label: "Climat", ligne: "Trajectoires, expositions et adaptation.", image: "IMAGE_PNG_THEME_03" },
  { id: "ressources", label: "Ressources", ligne: "Métaux, énergie et chaînes d'approvisionnement.", image: "IMAGE_PNG_THEME_04" },
  { id: "societes", label: "Sociétés", ligne: "Démographie, santé et inégalités.", image: "IMAGE_PNG_THEME_05" },
];

/* Valeurs de démonstration. */
export const PREUVES = [
  { valeur: 50000, prefixe: "+", suffixe: "", label: "lecteurs mensuels" },
  { valeur: 4.8, prefixe: "", suffixe: "/5", label: "satisfaction", decimales: 1 },
  { valeur: 195, prefixe: "", suffixe: "", label: "pays couverts" },
  { valeur: 1000, prefixe: "", suffixe: "+", label: "indicateurs" },
];

export const CITATION = ["Les données ne changent pas le monde.", "Ce que l'on en fait, oui."];

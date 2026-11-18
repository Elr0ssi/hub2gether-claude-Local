/* ═══════════════════════════════════════════════════════════════════════════
   LES COMPTEURS « TEMPS RÉEL » DE LA PAGE RESSOURCES

   Aucun de ces chiffres n'est mesuré à la seconde : chacun est une grandeur
   annuelle publiée, étalée sur l'année en cours (ou, pour les réserves,
   retranchée depuis la date du stock publié). La source de chaque chiffre est
   nommée ici et affichée sous les compteurs.
   ═══════════════════════════════════════════════════════════════════════════ */

const AN_S = 365.2425 * 24 * 3600;

export interface CadenceRessource {
  id: "foret" | "eau" | "petrole";
  label: string;
  unite: string;
  dec: number;
  mot: string;
  note: string;
  /** Ce qui s'écoule par an (positif), dans l'unité affichée. */
  parAn: number;
  /** Le stock de départ (réserves), à la date `stockMs`. Absent pour un cumul. */
  stock?: number;
  stockMs?: number;
  source: { nom: string; url: string; precision: string };
}

export const CADENCES_RESSOURCES: CadenceRessource[] = [
  {
    id: "foret",
    label: "Forêt brûlée",
    unite: " ha",
    dec: 0,
    mot: "hectares de forêt brûlés",
    note: "Cumul depuis le 1er janvier, au rythme record de 2024.",
    parAn: 13_500_000,
    source: {
      nom: "Global Forest Watch / WRI (université du Maryland)",
      url: "https://www.wri.org/news/release-global-forest-loss-shatters-records-2024-fueled-massive-fires",
      precision: "au moins 13,5 millions d’hectares de forêt brûlés en 2024",
    },
  },
  {
    id: "eau",
    label: "Eau douce prélevée",
    unite: " km³",
    dec: 3,
    mot: "kilomètres cubes d’eau",
    note: "Cumul depuis le 1er janvier, au rythme des prélèvements mondiaux publiés.",
    parAn: 3_853,
    source: {
      nom: "FAO AQUASTAT",
      url: "https://www.fao.org/aquastat/en/",
      precision: "3 853 km³ d’eau douce prélevés par an (mise à jour 2016, données autour de 2010), agriculture, industrie et usages domestiques",
    },
  },
  {
    id: "petrole",
    label: "Réserves de pétrole",
    unite: " barils",
    dec: 0,
    mot: "barils",
    note: "Réserves prouvées restantes : le stock publié, moins la consommation depuis. Hors nouvelles découvertes.",
    parAn: 101_420_000 * 365.2425,
    stock: 1_567_000_000_000,
    stockMs: Date.UTC(2025, 0, 1),
    source: {
      nom: "OPEC Annual Statistical Bulletin 2025 · Energy Institute Statistical Review 2025",
      url: "https://www.opec.org/",
      precision: "1 567 milliards de barils de réserves prouvées fin 2024 ; consommation mondiale de 101,4 millions de barils par jour en 2024",
    },
  },
];

export const parSeconde = (c: CadenceRessource) => (c.stock !== undefined ? -c.parAn / AN_S : c.parAn / AN_S);

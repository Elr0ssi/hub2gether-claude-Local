import type { Bareme, Detail, Part } from "../cadre/ventilation";
import { SOURCES } from "./donnees";

/* ═══════════════════════════════════════════════════════════════════════════
   ITALIE : CE QUI S'OUVRE SOUS CHAQUE LIGNE DES RECETTES ET DES DÉPENSES

   Source : « Dossier complet de données : la dette publique de l'Italie » (17 octobre 2026).
   Montants en milliards d'euros. Recettes et dépenses : ISTAT, SEC 2010, comptes révisés du 22/09/2026.

   Les recettes sont lues par grande famille (impôts directs, impôts indirects, impôts en capital,
   cotisations sociales, autres recettes) : le dossier ne chiffre aucun impôt pris un par un en
   comptabilité nationale. Les taux et barèmes sont ceux de 2025, sans montant à côté.
   Pas de lecture par fonction (COFOG) : seules quatre fonctions de 2024 sont vérifiées.
   ═══════════════════════════════════════════════════════════════════════════ */

export const SRC = {
  ISTAT: { nom: "ISTAT, comptes économiques nationaux 2010-2025 (22 septembre 2026)", url: SOURCES.ISTAT },
  IRPEF: { nom: "Dipartimento delle Finanze, IRPEF", url: SOURCES.FINANZE },
  TVA: { nom: "Agenzia delle Entrate, TVA", url: SOURCES.AGENZIA_ENTRATE },
  SUCCESSIONS: { nom: "Normattiva, décret législatif 346/1990", url: SOURCES.NORMATTIVA },
};

/* ── 1. Recettes (ISTAT, SEC 2010, 2025) ─────────────────────────────────── */

export const RECETTES_TOTAL = 1087.919;
export const FAMILLES_RECETTES = [{ nom: "Impôts" }, { nom: "Cotisations sociales" }, { nom: "Autres recettes" }];

const BAREME_IRPEF: Bareme = {
  titre: "IRPEF 2025, barème national (les additionnels régionaux et communaux s'y ajoutent)",
  lignes: [
    { libelle: "De 0 à 28 000 €", taux: 23, texte: "23 %" },
    { libelle: "De 28 000 à 50 000 €", taux: 35, texte: "35 %" },
    { libelle: "Au-delà de 50 000 €", taux: 43, texte: "43 %" },
  ],
};
const BAREME_TVA: Bareme = {
  titre: "TVA (IVA)",
  lignes: [
    { libelle: "Taux normal", taux: 22, texte: "22 %" },
    { libelle: "Taux réduit", taux: 10, texte: "10 %" },
    { libelle: "Taux réduit", taux: 5, texte: "5 %" },
    { libelle: "Taux super-réduit", taux: 4, texte: "4 %" },
  ],
};
const BAREME_SUCCESSIONS: Bareme = {
  titre: "Successions et donations, taux de base par bénéficiaire",
  lignes: [
    { libelle: "Conjoint et ligne directe (au-delà de 1 000 000 € par bénéficiaire)", taux: 4, texte: "4 %" },
    { libelle: "Frères et sœurs (au-delà de 100 000 €)", taux: 6, texte: "6 %" },
    { libelle: "Autres parents jusqu’aux degrés prévus par la loi", taux: 6, texte: "6 %" },
    { libelle: "Autres bénéficiaires", taux: 8, texte: "8 %" },
  ],
};

export const RECETTES_LIGNES: Part[] = [
  { nom: "Cotisations sociales", md: 305.829, famille: 1 },
  { nom: "Impôts directs", md: 345.95, famille: 0, taux: "IRPEF 23 / 35 / 43 %" },
  { nom: "Impôts indirects", md: 316.787, famille: 0, taux: "TVA 22 %" },
  { nom: "Autres recettes", md: 116.269, famille: 2 },
  { nom: "Impôts en capital", md: 3.084, famille: 0 },
];

export const DETAIL_RECETTES: Record<string, Detail> = {
  "Cotisations sociales": {
    texte: "Les cotisations versées par les salariés, les employeurs et les indépendants pour financer les retraites, la maladie, le chômage et les autres prestations sociales.",
    source: SRC.ISTAT,
  },
  "Impôts directs": {
    texte:
      "Les impôts sur le revenu et sur les bénéfices : l’IRPEF des personnes physiques, dont le barème national est de 23, 35 et 43 %, auquel les régions et les communes ajoutent leurs additionnels, et l’IRES des sociétés, au taux normal de 24 %. L’impôt est marginal par tranche, pas un taux unique sur tout le revenu.",
    baremes: [BAREME_IRPEF],
    source: SRC.IRPEF,
  },
  "Impôts indirects": {
    texte:
      "Les impôts sur la consommation, la production et les transactions : la TVA (IVA), les accises sur les carburants, l’énergie, le tabac et l’alcool, et d’autres taxes sur les actes et les transactions. Le taux normal de la TVA est de 22 %.",
    baremes: [BAREME_TVA],
    source: SRC.TVA,
  },
  "Autres recettes": {
    texte: "Les recettes qui ne sont ni des impôts ni des cotisations : les ventes et la production des administrations, d’autres recettes courantes et des recettes en capital hors impôts.",
    vues: [
      {
        parts: [
          { nom: "Production, ventes et recettes propres", md: 54.263 },
          { nom: "Autres recettes courantes", md: 48.787 },
          { nom: "Autres recettes en capital, hors impôts", md: 13.219 },
        ],
        total: 116.269,
      },
    ],
    source: SRC.ISTAT,
  },
  "Impôts en capital": {
    texte: "Les prélèvements exceptionnels ou assis sur le patrimoine transmis. Les droits de succession et de donation suivent un barème de base selon le lien de parenté, après des franchises qui vont jusqu’à 1 000 000 € en ligne directe.",
    baremes: [BAREME_SUCCESSIONS],
    source: SRC.SUCCESSIONS,
  },
};

/* ── 2. Dépenses par nature (ISTAT, SEC 2010, 2025) ──────────────────────── */

export const DEPENSES_TOTAL = 1157.655;

export const DEPENSES_NATURE_LIGNES: Part[] = [
  { nom: "Prestations sociales en espèces", md: 458.798 },
  { nom: "Rémunération des agents publics", md: 203.265 },
  { nom: "Consommations intermédiaires et prestations sociales en nature", md: 185.5 },
  { nom: "Autres dépenses courantes", md: 173.695 },
  { nom: "Dépenses en capital", md: 136.397 },
];

export const DETAIL_NATURE: Record<string, Detail> = {
  "Prestations sociales en espèces": { texte: "Les pensions, les indemnités de chômage et de maladie et les allocations versées aux ménages : la première dépense publique par nature.", source: SRC.ISTAT },
  "Rémunération des agents publics": { texte: "Les salaires et les charges des agents de l’État, des régions, des communes et des organismes de sécurité sociale.", source: SRC.ISTAT },
  "Consommations intermédiaires et prestations sociales en nature": {
    texte: "Les achats de biens et de services nécessaires au fonctionnement des administrations, et les prestations achetées pour les ménages, comme les soins de santé. Les deux sont regroupés dans une seule catégorie de la publication.",
    source: SRC.ISTAT,
  },
  "Autres dépenses courantes": {
    texte: "Les dépenses courantes qui ne sont ni des salaires, ni des prestations, ni des achats : les intérêts de la dette, qui en forment la moitié, et d’autres transferts et subventions.",
    vues: [{ parts: [{ nom: "Intérêts de la dette", md: 87.158 }], total: 173.695, resteNom: "Autres dépenses courantes, hors intérêts" }],
    source: SRC.ISTAT,
  },
  "Dépenses en capital": { texte: "Les investissements des administrations et les aides en capital versées.", source: SRC.ISTAT },
};

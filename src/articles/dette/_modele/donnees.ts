/* ═══════════════════════════════════════════════════════════════════════════
   MODÈLE · LES DONNÉES DE L'ARTICLE

   Toutes les valeurs de l'article sont ici, séparées du texte. Chaque chiffre
   garde SA source et SA date : c'est ce qui permet de le citer et de le mettre à jour.

   ⚠ Valeurs d'exemple (« Pays modèle »). Les remplacer par des chiffres vérifiés,
     avec leur source exacte. Ne jamais inventer un chiffre : si une donnée n'existe
     pas pour ce pays, le chapitre correspondant disparaît — il n'est pas rempli.

   UNITÉS : les montants sont en MILLIARDS D'EUROS (milliards d'euros), les ratios en % du PIB.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Un chiffre sourcé : sa valeur, sa période, et où le vérifier. */
export interface Mesure {
  valeur: number;
  /** « T4 2025 », « 2024 »… */
  periode: string;
  /** L'organisme : « INSEE », « Eurostat », « Ministère des Finances »… */
  source: string;
  /** L'adresse de la page où le chiffre se vérifie. */
  url: string;
}

/** La dette publique brute, en milliards d'euros. */
export const DETTE: Mesure = {
  valeur: 1000,
  periode: "2025",
  source: "Source officielle du pays",
  url: "https://example.org/dette",
};

/** La dette rapportée au PIB, en %. */
export const RATIO: Mesure = { ...DETTE, valeur: 80 };

/** Le ratio à quelques dates repères (les dates dont on dispose, pas une série inventée). */
export const RATIO_PAR_DATE = [
  { annee: 2000, valeur: 60, repere: undefined as string | undefined },
  { annee: 2008, valeur: 65, repere: "crise financière" },
  { annee: 2020, valeur: 95, repere: "Covid-19" },
  { annee: 2025, valeur: 80, repere: undefined },
];

/** Qui doit : une répartition par émetteur, en milliards d'euros. Remplacer par la répartition réelle du pays
 *  (administration centrale, collectivités, sécurité sociale…), ou supprimer le chapitre si elle n'existe pas. */
export const PAR_EMETTEUR = [
  { nom: "Administration centrale", md: 800 },
  { nom: "Collectivités locales", md: 120 },
  { nom: "Sécurité sociale", md: 80 },
];

/** Les questions fréquentes. Elles sont affichées ET balisées pour les moteurs : mêmes mots des deux côtés. */
export const FAQ = [
  { q: "Quel est le montant de la dette publique du Pays modèle ?", r: "Environ 1 000 milliards d'euros en 2025, soit 80 % du PIB." },
  { q: "Qui détient la dette du Pays modèle ?", r: "À renseigner avec une source." },
];

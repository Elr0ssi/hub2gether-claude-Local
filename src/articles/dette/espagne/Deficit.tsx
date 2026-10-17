"use client";

import { DeficitPublic, enLettres } from "@/articles/dette/cadre";
import { DEFICIT_2025, DEPENSES_2025, RECETTES_2025, DEFICIT_PCT_PIB } from "./donnees";
import { DEPENSES_NATURE_LIGNES, DETAIL_NATURE, DETAIL_RECETTES, FAMILLES_RECETTES, RECETTES_LIGNES } from "./ventilations";

/* Le chapitre « Déficit public » de l'Espagne : des données, et rien d'autre.
   La mise en page est celle de tous les pays : `DeficitPublic` (cadre/DeficitPublic.tsx).
   Les chiffres et les textes sont dans `ventilations.ts`.

   Pas de lecture par fonction (COFOG) ni de déficit par administration : le dossier ne les a pas vérifiés pour
   cette édition. L'onglet Déficit montre donc l'écart entre dépenses et recettes. */

export function Deficit() {
  const rec = RECETTES_2025.valeur;
  const dep = DEPENSES_2025.valeur;
  const solde = DEFICIT_2025.valeur;

  return (
    <DeficitPublic
      pays="espagnoles"
      recettes={{
        total: rec,
        lignes: RECETTES_LIGNES,
        details: DETAIL_RECETTES,
        familles: FAMILLES_RECETTES,
        source: RECETTES_2025,
        resume: `Répartition des ${enLettres(rec, 1)} de recettes des administrations publiques espagnoles en 2025 : cotisations sociales, impôts (revenu, TVA, sociétés, accises) et autres recettes.`,
      }}
      depenses={{
        total: dep,
        source: DEPENSES_2025,
        resume: `Les ${enLettres(dep, 1)} de dépenses des administrations publiques espagnoles en 2025, lues par nature : prestations sociales, salaires des agents publics, achats, investissement, intérêts.`,
        lectures: [{ id: "nature", bouton: "Par nature", nom: "Dépenses publiques espagnoles 2025 par nature", lignes: DEPENSES_NATURE_LIGNES, details: DETAIL_NATURE }],
      }}
      deficit={{
        montant: -solde,
        source: DEFICIT_2025,
        resume: `Les dépenses (${enLettres(dep, 1)}) dépassent les recettes (${enLettres(rec, 1)}) de ${enLettres(solde, 1)} en 2025, soit ${DEFICIT_PCT_PIB.toLocaleString("fr-FR")} % du PIB, selon l'édition actualisée de l'INE.`,
        note: "Ce solde est porté par l'État central, les communautés autonomes, les collectivités locales et la sécurité sociale.",
      }}
    />
  );
}

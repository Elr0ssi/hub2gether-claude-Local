"use client";

import { DeficitPublic, enLettres, montant, nombre } from "@/articles/dette/cadre";
import { ACTEURS_2025, DEFICIT_2025, DEPENSES_2025, RECETTES_2025 } from "@/articles/dette/france/donnees/financesPubliques";
import {
  DEFICIT_LIGNES,
  DEPENSES_FONCTION_LIGNES,
  DEPENSES_NATURE_LIGNES,
  DETAIL_DEFICIT,
  DETAIL_FONCTION,
  DETAIL_NATURE,
  DETAIL_RECETTES,
  FAMILLES_RECETTES,
  FONCTIONS_TOTAL,
  RECETTES_LIGNES,
  SRC,
} from "@/articles/dette/france/donnees/ventilations";

/* Le chapitre « Déficit public » de la France : des données, et rien d'autre.
   La mise en page est celle de tous les pays : `DeficitPublic` (cadre/DeficitPublic.tsx).
   Les chiffres et les textes sont dans `donnees/ventilations.ts`. */

export function Deficit() {
  const rec = RECETTES_2025.valeur;
  const dep = DEPENSES_2025.valeur;
  const solde = Math.abs(DEFICIT_2025.valeur);
  const etat = Math.abs(ACTEURS_2025[0].lignes?.[0].md ?? 0);

  return (
    <DeficitPublic
      pays="françaises"
      recettes={{
        total: rec,
        lignes: RECETTES_LIGNES,
        details: DETAIL_RECETTES,
        familles: FAMILLES_RECETTES,
        source: RECETTES_2025,
        resume: `Répartition des ${enLettres(rec, 1)} de recettes des administrations publiques françaises en 2025 : cotisations sociales, impôts (revenu, TVA, produits, production), recettes de production et autres recettes.`,
      }}
      depenses={{
        total: dep,
        source: DEPENSES_2025,
        resume: `Les ${enLettres(dep, 1)} de dépenses publiques françaises en 2025, lus par fonction (protection sociale, santé, enseignement, défense…) ou par nature (prestations sociales, fonctionnement, transferts, investissement, intérêts).`,
        lectures: [
          {
            id: "fonction",
            bouton: "Par fonction",
            nom: "Dépenses publiques françaises 2024 par fonction",
            lignes: DEPENSES_FONCTION_LIGNES,
            details: DETAIL_FONCTION,
            annee: 2024,
            note: (
              <>
                Lecture par fonction : année 2024 ({montant(FONCTIONS_TOTAL, 0, 2024)} au total), la dernière série complète. C'est une autre lecture des mêmes dépenses, qui ne s'ajoute pas à la lecture par nature.{" "}
                <a href={SRC.COFOG.url} target="_blank" rel="noopener noreferrer">Insee ↗</a>
              </>
            ),
          },
          { id: "nature", bouton: "Par nature", nom: "Dépenses publiques françaises 2025 par nature", lignes: DEPENSES_NATURE_LIGNES, details: DETAIL_NATURE },
        ],
      }}
      deficit={{
        montant: DEFICIT_2025.valeur,
        lignes: DEFICIT_LIGNES,
        details: DETAIL_DEFICIT,
        source: DEFICIT_2025,
        resume: `${nombre(etat, 0)} des ${enLettres(solde, 0)} de déficit public 2025 viennent de l'État ; les collectivités locales et la Sécurité sociale pèsent bien moins. Cliquez sur une ligne pour la détailler.`,
      }}
    />
  );
}

'use client';

import { DeficitPublic, enLettres, montant } from '@/articles/dette/cadre';
import { RECETTES_2025, DEPENSES_2025, DEFICIT_2025 } from './donnees';
import {
  DEPENSES_FONCTION_LIGNES,
  DEPENSES_NATURE_LIGNES,
  DETAIL_FONCTION,
  DETAIL_NATURE,
  DETAIL_RECETTES,
  FAMILLES_RECETTES,
  RECETTES_LIGNES,
  SOMME_FONCTIONS,
  SRC,
} from './ventilations';

/* Le chapitre « Déficit public » de l'Allemagne : des données, et rien d'autre.
   La mise en page est celle de tous les pays : `DeficitPublic` (cadre/DeficitPublic.tsx).
   Les chiffres et les textes sont dans `ventilations.ts`.

   Pas de répartition du déficit par administration : le dossier vérifié n'en porte pas pour la
   révision 2025 (déficit de 136,472 Md€). L'onglet Déficit montre donc l'écart entre dépenses et recettes. */

export function Deficit() {
  const rec = RECETTES_2025.valeur;
  const dep = DEPENSES_2025.valeur;
  const solde = Math.abs(DEFICIT_2025.valeur);

  return (
    <DeficitPublic
      pays="allemandes"
      recettes={{
        total: rec,
        lignes: RECETTES_LIGNES,
        details: DETAIL_RECETTES,
        familles: FAMILLES_RECETTES,
        source: RECETTES_2025,
        resume: `Répartition des ${enLettres(rec, 1)} de recettes des administrations allemandes en 2025 (comptes nationaux révisés) : impôts, cotisations sociales et autres recettes.`,
      }}
      depenses={{
        total: dep,
        source: DEPENSES_2025,
        resume: `Les ${enLettres(dep, 1)} de dépenses des administrations allemandes en 2025, lus par nature (prestations, rémunérations, achats, investissement) ou par fonction (protection sociale, santé, enseignement, défense…).`,
        lectures: [
          { id: 'nature', bouton: 'Par nature', nom: 'Dépenses allemandes 2025 par nature', lignes: DEPENSES_NATURE_LIGNES, details: DETAIL_NATURE },
          {
            id: 'fonction',
            bouton: 'Par fonction',
            nom: 'Dépenses allemandes 2025 par fonction',
            lignes: DEPENSES_FONCTION_LIGNES,
            details: DETAIL_FONCTION,
            note: (
              <>
                Les dix fonctions représentent {montant(SOMME_FONCTIONS, 1)} sur {montant(dep, 1)} de dépenses. C'est une autre lecture des mêmes dépenses, qui ne s'ajoute pas à la lecture par nature.{' '}
                <a href={SRC.COFOG.url} target="_blank" rel="noopener noreferrer">Destatis ↗</a>
              </>
            ),
          },
        ],
      }}
      deficit={{
        montant: DEFICIT_2025.valeur,
        source: DEFICIT_2025,
        resume: `Les dépenses (${enLettres(dep, 1)}) dépassent les recettes (${enLettres(rec, 1)}) de ${enLettres(solde, 1)} en 2025, selon les comptes nationaux révisés de Destatis.`,
        note: "Le Bund est l'État fédéral, les Länder sont les 16 États fédérés, les Gemeinden sont les communes, et la Sozialversicherung regroupe les organismes de sécurité sociale.",
      }}
    />
  );
}

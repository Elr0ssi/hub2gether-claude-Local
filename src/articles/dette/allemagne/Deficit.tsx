'use client';

import { useState } from 'react';
import { Figure, Repartition, enLettres, montant } from '@/articles/dette/cadre';
import { RECETTES_2025, DEPENSES_2025, DEFICIT_2025 } from './donnees';
import {
  DEPENSES_FONCTION_LIGNES,
  DEPENSES_NATURE_LIGNES,
  DETAIL_FONCTION,
  DETAIL_NATURE,
  DETAIL_RECETTES,
  ECART_FONCTIONS,
  RECETTES_LIGNES,
  SOMME_FONCTIONS,
  SRC,
} from './ventilations';

/* ═══════════════════════════════════════════════════════════════════════════
   RECETTES, DÉPENSES, DÉFICIT : LES TROIS ONGLETS DE LA FRANCE, AVEC LES DONNÉES ALLEMANDES

   Même principe que `france/Deficit.tsx` : chaque onglet est une <Figure> ;
   les lignes s'ouvrent sur leur explication et leur camembert. Les chiffres et
   les textes sont dans `ventilations.ts`.

   Pas de répartition du déficit par administration : le dossier vérifié n'en
   porte pas pour la révision 2025 (déficit de 136,472 Md€). Les montants d'une
   édition antérieure ne s'additionnent pas à un déficit révisé : on ne les affiche pas.
   ═══════════════════════════════════════════════════════════════════════════ */

function Equation({ rec, dep, solde }: { rec: number; dep: number; solde: number }) {
  return (
    <div className="dos-eq" role="img" aria-label="Dépenses, recettes et déficit">
      <div className="dos-eq-l">
        <span>Dépenses</span>
        <i style={{ '--p': '100%' } as React.CSSProperties} />
        <b>{montant(dep, 1)}</b>
      </div>
      <div className="dos-eq-l">
        <span>Recettes</span>
        <i style={{ '--p': `${(rec / dep) * 100}%` } as React.CSSProperties} />
        <b>{montant(rec, 1)}</b>
      </div>
      <div className="dos-eq-l dos-eq-def">
        <span>Écart : le déficit</span>
        <i style={{ '--p': `${(solde / dep) * 100}%` } as React.CSSProperties} />
        <b>−{montant(solde, 1)}</b>
      </div>
    </div>
  );
}

export function Deficit() {
  const [onglet, setOnglet] = useState<'recettes' | 'depenses' | 'deficit'>('recettes');
  const [lecture, setLecture] = useState<'fonction' | 'nature'>('fonction');
  const rec = RECETTES_2025.valeur;
  const dep = DEPENSES_2025.valeur;
  const solde = DEFICIT_2025.valeur;

  return (
    <>
      <div className="dos-onglets" role="tablist" aria-label="Recettes, dépenses ou déficit">
        <button type="button" role="tab" aria-selected={onglet === 'recettes'} aria-controls="de-p-recettes"
          className="dos-onglet dos-onglet-rec" onClick={() => setOnglet('recettes')}>
          <span>Recettes</span><b>{montant(rec, 1)}</b>
          <i style={{ '--p': `${(rec / dep) * 100}%` } as React.CSSProperties} />
        </button>
        <span className="dos-onglets-s" aria-hidden="true">−</span>
        <button type="button" role="tab" aria-selected={onglet === 'depenses'} aria-controls="de-p-depenses"
          className="dos-onglet dos-onglet-dep" onClick={() => setOnglet('depenses')}>
          <span>Dépenses</span><b>{montant(dep, 1)}</b><i style={{ '--p': '100%' } as React.CSSProperties} />
        </button>
        <span className="dos-onglets-s" aria-hidden="true">=</span>
        <button type="button" role="tab" aria-selected={onglet === 'deficit'} aria-controls="de-p-deficit"
          className="dos-onglet dos-onglet-def" onClick={() => setOnglet('deficit')}>
          <span>Déficit</span><b>−{montant(solde, 1)}</b>
          <i style={{ '--p': `${(solde / dep) * 400}%` } as React.CSSProperties} />
        </button>
      </div>

      <div id="de-p-recettes" role="tabpanel" hidden={onglet !== 'recettes'} className="dos-panneau">
        <Figure id="recettes-publiques" titre="D'où viennent les recettes publiques allemandes"
          legende={`Répartition des ${enLettres(rec, 1)} de recettes des administrations allemandes en 2025 (comptes nationaux révisés) : impôts, cotisations sociales et autres recettes. Cliquez sur une ligne pour voir ce qu'elle contient.`}
          source={RECETTES_2025} voir={[{ href: '#depenses-publiques', label: 'Voir les dépenses' }]}>
          <Repartition nom="Recettes publiques allemandes 2025" lignes={RECETTES_LIGNES} details={DETAIL_RECETTES} />
          <p className="dos-notule">« Autres recettes » est un solde calculé, pas une catégorie publiée par Destatis.</p>
        </Figure>
      </div>

      <div id="de-p-depenses" role="tabpanel" hidden={onglet !== 'depenses'} className="dos-panneau">
        <Figure id="depenses-publiques" titre="Où va l'argent public allemand"
          legende={`Les ${enLettres(dep, 1)} de dépenses des administrations allemandes en 2025, lus par fonction (protection sociale, santé, enseignement, défense…) ou par nature (prestations, rémunérations, achats, investissement). Cliquez sur une ligne pour voir ce qu'elle contient.`}
          source={DEPENSES_2025} voir={[{ href: '#recettes-publiques', label: 'Voir les recettes' }]}>
          <div className="dos-lectures" role="group" aria-label="Lecture des dépenses">
            <button type="button" className={lecture === 'fonction' ? 'dos-lec-on' : undefined} onClick={() => setLecture('fonction')}>Par fonction</button>
            <button type="button" className={lecture === 'nature' ? 'dos-lec-on' : undefined} onClick={() => setLecture('nature')}>Par nature</button>
          </div>
          {lecture === 'fonction' ? (
            <>
              <Repartition nom="Dépenses allemandes 2025 par fonction" lignes={DEPENSES_FONCTION_LIGNES} details={DETAIL_FONCTION} />
              <p className="dos-notule">
                Les dix fonctions font {montant(SOMME_FONCTIONS, 1)}, soit {montant(ECART_FONCTIONS, 1)} de moins que les {montant(dep, 1)} de dépenses totales : cet écart dépasse les arrondis et la série fonctionnelle publiée ne se lit pas comme une répartition exhaustive du total. Chaque fonction, elle, se lit sur son propre total.{' '}
                <a href={SRC.COFOG.url} target="_blank" rel="noopener noreferrer">Destatis ↗</a>
              </p>
            </>
          ) : (
            <>
              <Repartition nom="Dépenses allemandes 2025 par nature" lignes={DEPENSES_NATURE_LIGNES} details={DETAIL_NATURE} />
              <p className="dos-notule">Les cinq postes détaillés sont des « dont » du total ; « Autres dépenses » est le reste calculé, pas une catégorie publiée. C'est une autre lecture des mêmes dépenses que la lecture par fonction : on ne les additionne pas.</p>
            </>
          )}
        </Figure>
      </div>

      <div id="de-p-deficit" role="tabpanel" hidden={onglet !== 'deficit'} className="dos-panneau">
        <Figure id="qui-cree-le-deficit" titre="Comment se forme le déficit public allemand"
          legende={`Les dépenses (${enLettres(dep, 1)}) dépassent les recettes (${enLettres(rec, 1)}) de ${enLettres(Math.abs(solde), 1)} en 2025, selon les comptes nationaux révisés de Destatis.`}
          source={DEFICIT_2025} voir={[{ href: '#evolution', label: "Voir l'évolution de la dette" }]}>
          <Equation rec={rec} dep={dep} solde={Math.abs(solde)} />
          <p className="dos-notule">
            Qui porte ce déficit ? Le Bund est l'État fédéral, les Länder sont les 16 États fédérés, les Gemeinden sont les communes, et la Sozialversicherung regroupe les organismes de sécurité sociale. La répartition du déficit entre ces administrations n'est pas affichée : les montants d'une édition antérieure ne peuvent pas expliquer le déficit révisé.
          </p>
        </Figure>
      </div>
    </>
  );
}

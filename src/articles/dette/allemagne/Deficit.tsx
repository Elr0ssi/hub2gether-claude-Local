"use client";
import { useState } from 'react';
import { Figure, Repartition, montant, enLettres, nf } from '@/articles/dette/cadre';
import {
  RECETTES_2025, DEPENSES_2025, DEFICIT_2025, IMPOTS_COURANTS_2025,
  DEFICIT_BUND, DEFICIT_LANDER, DEFICIT_COMMUNES, DEFICIT_SECU,
} from './donnees';

/** Même rail d'onglets et même composant Repartition que France/Deficit.tsx.
 * Les dépenses sont réparties par leur mode de couverture, pas par fonction,
 * faute de tableau COFOG 2025 vérifié : le graphique l'indique explicitement. */
export function Deficit() {
  const [onglet, setOnglet] = useState<'recettes' | 'depenses' | 'deficit'>('recettes');
  const rec = RECETTES_2025.valeur;
  const dep = DEPENSES_2025.valeur;
  const solde = DEFICIT_2025.valeur;
  return <>
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
        <span>Déficit</span><b>−{montant(solde)}</b>
        <i style={{ '--p': `${(solde / dep) * 400}%` } as React.CSSProperties} />
      </button>
    </div>
    <div id="de-p-recettes" role="tabpanel" hidden={onglet !== 'recettes'} className="dos-panneau">
      <Figure id="recettes-publiques" titre="D'où viennent les recettes publiques allemandes en 2025 ?"
        legende="Sur les recettes SEC 2010 de 2025, les impôts courants identifiés par Destatis représentent une partie du total. Le solde est une différence calculée : cotisations sociales, autres impôts et autres recettes, sans ventilation supplémentaire."
        source={RECETTES_2025}>
        <Repartition nom="Recettes des administrations allemandes, 2025, SEC 2010" lignes={[
          { nom: 'Impôts courants', md: IMPOTS_COURANTS_2025.valeur },
          { nom: 'Autres recettes (différence calculée)', md: rec - IMPOTS_COURANTS_2025.valeur },
        ]} />
      </Figure>
    </div>
    <div id="de-p-depenses" role="tabpanel" hidden={onglet !== 'depenses'} className="dos-panneau">
      <Figure id="depenses-publiques" titre="Comment les dépenses publiques ont-elles été financées ?"
        legende={`En 2025, ${enLettres(dep, 1)} de dépenses SEC 2010 se couvrent par des recettes et un déficit comptable. Ce n'est pas une répartition des dépenses par fonction (santé, défense ou éducation).`}
        source={DEPENSES_2025}>
        <Repartition nom="Couverture des dépenses publiques allemandes, 2025" lignes={[
          { nom: 'Recettes de l’année', md: rec },
          { nom: 'Déficit de l’année', md: solde },
        ]} />
      </Figure>
    </div>
    <div id="de-p-deficit" role="tabpanel" hidden={onglet !== 'deficit'} className="dos-panneau">
      <Figure id="qui-cree-le-deficit" titre="Qui crée le déficit public allemand en 2025 ?"
        legende={`Répartition du déficit SEC 2010 de 2025 entre Bund, communes, Länder et sécurité sociale. Les chiffres sont publiés au dixième de milliard ; leur somme (${nf(DEFICIT_BUND.valeur + DEFICIT_COMMUNES.valeur + DEFICIT_LANDER.valeur + DEFICIT_SECU.valeur)}) peut différer de ${nf(solde)} en raison des arrondis.`}
        source={DEFICIT_2025}>
        <Repartition nom="Déficit des administrations allemandes en 2025" negatif lignes={[
          { nom: 'Bund (administration centrale)', md: DEFICIT_BUND.valeur },
          { nom: 'Communes', md: DEFICIT_COMMUNES.valeur },
          { nom: 'Länder', md: DEFICIT_LANDER.valeur },
          { nom: 'Assurances sociales', md: DEFICIT_SECU.valeur },
        ]} />
      </Figure>
    </div>
  </>;
}
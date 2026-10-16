"use client";
import { useState } from 'react';
import { DetailsPostes } from '@/articles/dette/cadre/DetailsPostes';
import { Figure, Repartition, montant, enLettres, nf } from '@/articles/dette/cadre';
import {
  RECETTES_2025, DEPENSES_2025, DEFICIT_2025, IMPOTS_COURANTS_2025,
  DEFICIT_BUND, DEFICIT_LANDER, DEFICIT_COMMUNES, DEFICIT_SECU,
} from './donnees';

/** Même rail d'onglets et même composant Repartition que France/Deficit.tsx.
 * Les dépenses sont réparties par leur mode de couverture, pas par fonction,
 * faute de tableau COFOG 2025 vérifié : le graphique l'indique explicitement. */
function Comprendre({titre,children}:{titre:string;children:React.ReactNode}) {return <details className="dos-notule"><summary style={{cursor:'pointer',fontWeight:650}}>{titre} — explication</summary><div style={{paddingTop:8}}>{children}</div></details>}
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
          { nom: 'Autres impôts, cotisations et produits (solde non ventilé)', md: rec - IMPOTS_COURANTS_2025.valeur },
        ]} />
        <DetailsPostes titre="Explorer les recettes allemandes" postes={[{nom:'Impôts courants',md:IMPOTS_COURANTS_2025.valeur},{nom:'Autres recettes (solde non ventilé)',md:rec-IMPOTS_COURANTS_2025.valeur}]} complements={{'Impôts courants':{texte:'Inclut notamment impôt sur le revenu, impôt sur les sociétés et autres impôts courants. TVA et autres prélèvements ne sont pas nécessairement dans cette seule rubrique : le périmètre SEC doit être respecté.'},'Autres recettes (solde non ventilé)':{texte:'Ce solde est une différence calculée, pas une rubrique officielle. Il comprend notamment cotisations sociales, impôts sur les produits et recettes non fiscales ; aucun montant par sous-poste ne peut être déduit du seul total.'}}} />
        <Comprendre titre="Quels impôts ?">L'impôt sur le revenu allemand est progressif : chaque taux marginal concerne seulement une tranche du revenu imposable. Les recettes comprennent aussi la TVA, l'impôt sur les sociétés, la taxe professionnelle communale et les impôts fonciers. Un taux marginal n'est pas le taux moyen payé.</Comprendre>
        <Comprendre titre="Que financent les cotisations sociales ?">Les cotisations salariales et patronales financent notamment les retraites, la santé, le chômage et la dépendance. Les taux varient selon l'assurance, le revenu, les plafonds et l'année : ne pas les confondre avec la part des cotisations dans les recettes publiques.</Comprendre>
        <Comprendre titre="Que comprend le solde non ventilé ?">Il s'agit d'une différence comptable calculée, et non d'une catégorie officielle. Elle recouvre notamment d'autres impôts, les cotisations, des services facturés par les administrations, des revenus de patrimoine public et des transferts. <a href="https://ec.europa.eu/eurostat/databrowser/view/gov_10a_taxag/default/table" target="_blank" rel="noopener noreferrer">Ventilation officielle des impôts et cotisations : Eurostat ↗</a>.</Comprendre>
      </Figure>
    </div>
    <div id="de-p-depenses" role="tabpanel" hidden={onglet !== 'depenses'} className="dos-panneau">
      <Figure id="depenses-publiques" titre="Où va l'argent public allemand ?" legende="Total des dépenses 2025 de toutes les administrations publiques selon Destatis. Les postes ci-dessous sont expliqués sans leur attribuer des montants non vérifiés." source={DEPENSES_2025}>
        <Repartition nom="Dépenses publiques allemandes en 2025 : total non ventilé" lignes={[{nom:'Dépenses de toutes les administrations (ventilation à confirmer)',md:dep}]} />
        <DetailsPostes titre="Comprendre les dépenses" postes={[{nom:'Retraites et protection sociale',md:0},{nom:'Santé',md:0},{nom:'Enseignement',md:0},{nom:'Défense et administration',md:0}]} complements={{
          'Retraites et protection sociale':{texte:'Pensions de vieillesse et de réversion, chômage, aides aux familles, handicap et dépendance. Les pensions sont des prestations en espèces ; les services directement pris en charge sont des prestations en nature. Les montants par fonction ne sont pas déductibles du total SEC 2025.'},
          'Santé':{texte:'Soins hospitaliers, médecins, médicaments, prévention, rémunérations des personnels actifs et investissements. Les dépenses de santé totales incluent aussi des dépenses privées : ne pas les confondre avec les dépenses publiques.'},
          'Enseignement':{texte:'Salaires des enseignants en activité, écoles, universités, achats et construction ou entretien de bâtiments. Les pensions des anciens enseignants sont classées en protection sociale.'},
          'Défense et administration':{texte:'Soldes et salaires des agents actifs, matériel, fonctionnement, infrastructures, sécurité, justice et intérêts de dette. Les intérêts ne remboursent pas le capital.'}
        }} />
        <p className="dos-notule">Les catégories explicatives ci-dessus ne sont pas des parts chiffrées : les montants officiels par fonction doivent être extraits de <a href="https://www-genesis.destatis.de/datenbank/online/table/81000-0413" target="_blank" rel="noopener noreferrer">Destatis, tableau 81000-0413 ↗</a> avant de construire un camembert exact.</p>
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
        <Comprendre titre="Bund, Länder, communes : qui est qui ?">Le Bund est l'État fédéral ; les Länder sont les 16 États fédérés ; les communes sont les collectivités locales. Les assurances sociales gèrent notamment les retraites, la santé et le chômage. Ici, les parts concernent le déficit de l'année, pas la dette totale accumulée.</Comprendre>
      </Figure>
    </div>
  </>;
}
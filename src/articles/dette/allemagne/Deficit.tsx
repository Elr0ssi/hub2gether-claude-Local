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
        <Comprendre titre="Quels impôts ?">L'impôt sur le revenu allemand est progressif : chaque taux marginal concerne seulement une tranche du revenu imposable. Les recettes comprennent aussi la TVA, l'impôt sur les sociétés, la taxe professionnelle communale et les impôts fonciers. Un taux marginal n'est pas le taux moyen payé.</Comprendre>
        <Comprendre titre="Que financent les cotisations sociales ?">Les cotisations salariales et patronales financent notamment les retraites, la santé, le chômage et la dépendance. Les taux varient selon l'assurance, le revenu, les plafonds et l'année : ne pas les confondre avec la part des cotisations dans les recettes publiques.</Comprendre>
        <Comprendre titre="Que comprend le solde non ventilé ?">Il s'agit d'une différence comptable calculée, et non d'une catégorie officielle. Elle recouvre notamment d'autres impôts, les cotisations, des services facturés par les administrations, des revenus de patrimoine public et des transferts. <a href="https://ec.europa.eu/eurostat/databrowser/view/gov_10a_taxag/default/table" target="_blank" rel="noopener noreferrer">Ventilation officielle des impôts et cotisations : Eurostat ↗</a>.</Comprendre>
      </Figure>
    </div>
    <div id="de-p-depenses" role="tabpanel" hidden={onglet !== 'depenses'} className="dos-panneau">
      <Figure id="depenses-publiques" titre="Où va l'argent public allemand ?" legende="Total des dépenses 2025 de toutes les administrations publiques selon Destatis. Les postes ci-dessous sont expliqués sans leur attribuer des montants non vérifiés." source={DEPENSES_2025}>
        <p>En 2025, les administrations ont dépensé <b>{montant(dep,1)}</b>. Ce total sert à financer les services publics et les transferts aux ménages et entreprises. Ce n'est pas le budget du seul Bund.</p>
        <Comprendre titre="Retraites et protection sociale">Pensions, chômage, aides aux familles, prestations liées au handicap ou à la dépendance. Les prestations sont des dépenses ; les cotisations sont des recettes.</Comprendre>
        <Comprendre titre="Santé">Hôpitaux, consultations, médicaments, prévention et prestations des caisses d'assurance maladie. La dépense publique n'inclut pas forcément toutes les dépenses privées de santé.</Comprendre>
        <Comprendre titre="Éducation, transports et infrastructures">Écoles, universités, enseignants, routes, transports et bâtiments publics. Les Länder jouent un rôle central dans l'éducation ; les communes financent des services locaux.</Comprendre>
        <Comprendre titre="Défense, intérêts et administration">Armée et équipement, police, justice, services administratifs, aides économiques et intérêts versés aux prêteurs. Les intérêts sont un coût annuel, pas un remboursement du capital.</Comprendre>
        <p className="dos-notule">Pour les montants et parts exacts par fonction, consulter <a href="https://ec.europa.eu/eurostat/databrowser/view/gov_10a_exp/default/table" target="_blank" rel="noopener noreferrer">Eurostat COFOG, dépenses publiques allemandes ↗</a>. Ne pas présenter les recettes et le déficit comme des catégories de dépenses.</p>
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
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
const DEPENSES_COF_2025 = [{"nom":"Administration générale","md":283.151},{"nom":"Défense","md":68.554},{"nom":"Sécurité et justice","md":74.511},{"nom":"Économie et transports","md":252.065},{"nom":"Environnement","md":24.411},{"nom":"Logement et équipements collectifs","md":20.566},{"nom":"Santé","md":353.305},{"nom":"Culture, sports et loisirs","md":46.537},{"nom":"Enseignement","md":206.743},{"nom":"Protection sociale","md":932.744}];
const DETAILS_COF_2025 = {"Protection sociale":{texte:"Ventilation COFOG 2025, administrations publiques allemandes, chiffres provisoires Destatis. Les sous-postes relèvent de la même fonction, sans double comptage.",sous:[{nom:"Retraites et vieillesse",md:453.932},{nom:"Maladie et incapacité",md:153.346},{nom:"Pensions de survivants",md:85.513},{nom:"Familles et enfants",md:85.344},{nom:"Chômage",md:77.063},{nom:"Logement",md:21.261},{nom:"Aide sociale et autres",md:56.285}]},"Santé":{texte:"Ventilation COFOG 2025, administrations publiques allemandes, chiffres provisoires Destatis. Les sous-postes relèvent de la même fonction, sans double comptage.",sous:[{nom:"Hôpitaux et soins avec hospitalisation",md:134.979},{nom:"Soins ambulatoires",md:105.623},{nom:"Produits médicaux et équipements",md:81.171},{nom:"Santé publique et prévention",md:3.836},{nom:"Recherche et autres dépenses de santé",md:27.696}]},"Enseignement":{texte:"Ventilation COFOG 2025, administrations publiques allemandes, chiffres provisoires Destatis. Les sous-postes relèvent de la même fonction, sans double comptage.",sous:[{nom:"Préscolaire et primaire",md:69.59},{nom:"Secondaire",md:71.597},{nom:"Supérieur",md:35.331},{nom:"Services auxiliaires",md:20.015},{nom:"Autres niveaux et recherche",md:10.21}]},"Défense":{texte:"Ventilation COFOG 2025, administrations publiques allemandes, chiffres provisoires Destatis. Les sous-postes relèvent de la même fonction, sans double comptage.",sous:[{nom:"Défense militaire",md:50.835},{nom:"Aide militaire à l'étranger",md:15.852},{nom:"Défense civile",md:0.303},{nom:"Recherche et autres",md:1.564}]},"Sécurité et justice":{texte:"Ventilation COFOG 2025, administrations publiques allemandes, chiffres provisoires Destatis. Les sous-postes relèvent de la même fonction, sans double comptage.",sous:[{nom:"Police",md:34.566},{nom:"Pompiers",md:14.307},{nom:"Tribunaux",md:17.059},{nom:"Prisons",md:4.384},{nom:"Autres",md:4.195}]},"Économie et transports":{texte:"Ventilation COFOG 2025, administrations publiques allemandes, chiffres provisoires Destatis. Les sous-postes relèvent de la même fonction, sans double comptage.",sous:[{nom:"Transports",md:136.084},{nom:"Énergie",md:32.804},{nom:"Économie et marché du travail",md:31.084},{nom:"Agriculture",md:8.854},{nom:"Industrie et construction",md:7.441},{nom:"Autres politiques économiques",md:35.798}]}};
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
        legende="Répartition détaillée 2025 d’après Destatis GENESIS 81000-0031 : impôts, cotisations sociales et autres recettes. Le total actualisé est de 2 137,940 Md€, légèrement différent du chiffre provisoire publié précédemment."
        source={RECETTES_2025}>
        <Repartition nom="Recettes des administrations allemandes, 2025, SEC 2010" details={{"Impôts (comptes nationaux actualisés)":{texte:"Impôts directs et indirects selon la comptabilité nationale. Le détail par taxe ci-dessous est issu des statistiques de recettes fiscales encaissées et ne s’additionne pas exactement à ce poste SEC.",sous:[{nom:"TVA et TVA à l’importation (statistique fiscale)",md:310.2},{nom:"Impôt sur les salaires (Lohnsteuer)",md:262.7},{nom:"Taxe professionnelle locale (Gewerbesteuer)",md:76.4},{nom:"Taxe sur l’énergie",md:37.6},{nom:"Droits de succession",md:15.4}]},"Cotisations sociales":{texte:"Cotisations retraite, assurance maladie, chômage et dépendance payées par salariés et employeurs. Les taux varient selon les assurances, revenus et plafonds."},"Autres recettes":{texte:"Recettes non fiscales et autres ressources publiques : production, patrimoine, transferts et autres opérations. Solde comptable calculé, non ventilation détaillée."}}} lignes={[
          { nom: 'Impôts (comptes nationaux actualisés)', md: 1031.546 },
          { nom: 'Cotisations sociales', md: 823.069 },
          { nom: 'Autres recettes', md: 283.325 },
        ]} />
        <Comprendre titre="Quels impôts ?">L'impôt sur le revenu allemand est progressif : chaque taux marginal concerne seulement une tranche du revenu imposable. Les recettes comprennent aussi la TVA, l'impôt sur les sociétés, la taxe professionnelle communale et les impôts fonciers. Un taux marginal n'est pas le taux moyen payé.</Comprendre>
        <Comprendre titre="Que financent les cotisations sociales ?">Les cotisations salariales et patronales financent notamment les retraites, la santé, le chômage et la dépendance. Les taux varient selon l'assurance, le revenu, les plafonds et l'année : ne pas les confondre avec la part des cotisations dans les recettes publiques.</Comprendre>
        <Comprendre titre="Que comprend le solde non ventilé ?">Il s'agit d'une différence comptable calculée, et non d'une catégorie officielle. Elle recouvre notamment d'autres impôts, les cotisations, des services facturés par les administrations, des revenus de patrimoine public et des transferts. <a href="https://ec.europa.eu/eurostat/databrowser/view/gov_10a_taxag/default/table" target="_blank" rel="noopener noreferrer">Ventilation officielle des impôts et cotisations : Eurostat ↗</a>.</Comprendre>
      </Figure>
    </div>
    <div id="de-p-depenses" role="tabpanel" hidden={onglet !== 'depenses'} className="dos-panneau">
      <Figure id="depenses-publiques" titre="Où va l'argent public allemand ?" legende="Total des dépenses 2025 de toutes les administrations publiques selon Destatis. Les postes ci-dessous sont expliqués sans leur attribuer des montants non vérifiés." source={DEPENSES_2025}>
        <Repartition nom="Dépenses allemandes par fonction COFOG 2025" lignes={DEPENSES_COF_2025} details={DETAILS_COF_2025} />
        <p className="dos-notule">Ventilation officielle COFOG 2025 : 2 274,412 Md€ (publication Destatis actualisée). Ce total diffère du total provisoire des comptes 2025 affiché dans les onglets (2 259,3 Md€) : les deux millésimes statistiques ne sont pas directement réconciliables. <a href="https://genesis.destatis.de/datenbank/online/statistic/81000/table/81000-0413" target="_blank" rel="noopener noreferrer">Source Destatis 81000-0413 ↗</a>.</p>
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
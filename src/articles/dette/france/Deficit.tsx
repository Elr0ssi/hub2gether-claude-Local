"use client";

import { useState } from "react";
import { Figure, Repartition, enLettres, montant, nombre } from "@/articles/dette/cadre";
import {
  ACTEURS_2025,
  DEFICIT_2025,
  DEFICIT_PAR_ACTEUR,
  DEPENSES_2025,
  DEPENSES_FONCTION,
  DEPENSES_NATURE,
  RECETTES_2025,
  RECETTES_DETAIL,
  IMPOTS_FAMILLES,
} from "@/articles/dette/france/donnees/financesPubliques";

/* ═══════════════════════════════════════════════════════════════════════════
   RECETTES, DÉPENSES, DÉFICIT : TROIS ONGLETS, UN SEUL VISUEL

   Le chapitre « Déficit public ». Chaque onglet est une <Figure> qui contient
   une <Repartition> : la même barre segmentée pour les trois lectures.
   Pour un autre pays, on garde ce principe (des onglets qui changent de
   figure) et on remplace les données.
   ═══════════════════════════════════════════════════════════════════════════ */

export function Deficit() {
  const [onglet, setOnglet] = useState<"recettes" | "depenses" | "deficit">("recettes");
  const [lecture, setLecture] = useState<"nature" | "fonction">("nature");
  const rec = RECETTES_2025.valeur;
  const dep = DEPENSES_2025.valeur;
  const solde = Math.abs(DEFICIT_2025.valeur);
  const etat = Math.abs(ACTEURS_2025[0].lignes?.[0].md ?? 0);

  return (
    <>
      <div className="dos-onglets" role="tablist" aria-label="Recettes, dépenses ou déficit">
        <button
          type="button"
          role="tab"
          aria-selected={onglet === "recettes"}
          aria-controls="dos-p-recettes"
          className="dos-onglet dos-onglet-rec"
          onClick={() => setOnglet("recettes")}
        >
          <span>Recettes</span>
          <b>{montant(rec, 0)}</b>
          <i style={{ "--p": `${(rec / dep) * 100}%` } as React.CSSProperties} />
        </button>
        <span className="dos-onglets-s" aria-hidden="true">−</span>
        <button
          type="button"
          role="tab"
          aria-selected={onglet === "depenses"}
          aria-controls="dos-p-depenses"
          className="dos-onglet dos-onglet-dep"
          onClick={() => setOnglet("depenses")}
        >
          <span>Dépenses</span>
          <b>{montant(dep, 0)}</b>
          <i style={{ "--p": "100%" } as React.CSSProperties} />
        </button>
        <span className="dos-onglets-s" aria-hidden="true">=</span>
        <button
          type="button"
          role="tab"
          aria-selected={onglet === "deficit"}
          aria-controls="dos-p-deficit"
          className="dos-onglet dos-onglet-def"
          onClick={() => setOnglet("deficit")}
        >
          <span>Déficit</span>
          <b>−{montant(solde)}</b>
          <i style={{ "--p": `${(solde / dep) * 400}%` } as React.CSSProperties} />
        </button>
      </div>

      <div id="dos-p-recettes" role="tabpanel" hidden={onglet !== "recettes"} className="dos-panneau">
        <Figure
          id="recettes-publiques"
          titre="D'où viennent les recettes publiques"
          legende={`Répartition des ${enLettres(rec, 0)} de recettes des administrations publiques françaises en 2025 : impôts, cotisations sociales, ventes et autres produits.`}
          source={RECETTES_2025}
          voir={[{ href: "#depenses-publiques", label: "Voir les dépenses" }]}
        >
          <Repartition lignes={RECETTES_DETAIL} nom="Répartition des recettes publiques 2025" details={{
 "Impôts": {texte:"Impôts courants sur les revenus et patrimoines, taxes sur les produits et la production, impôts en capital. Cliquez sur une famille dans le camembert pour voir les principaux impôts.",sous:IMPOTS_FAMILLES.map(p => ({ nom:p.nom, md:p.md, enfants:p.enfants })),source:{nom:"Insee, comptes des administrations publiques",url:"https://www.insee.fr/fr/statistiques/2830166"}},
 "Cotisations sociales effectives":{texte:"Cotisations versées par les employeurs et salariés pour financer les assurances sociales : retraite, maladie, chômage, famille. Les taux varient selon le régime, la rémunération et les plafonds."},
 "Ventes et autres recettes de production":{texte:"Services et productions vendus ou facturés par les administrations, notamment redevances et prestations publiques."},
 "Revenus de la propriété":{texte:"Dividendes, intérêts et revenus du patrimoine public."},
 "Autres recettes":{texte:"Transferts et autres ressources qui ne relèvent pas des grandes catégories précédentes."},
 "Impôts et cotisations susceptibles de ne pas être recouvrés":{texte:"Montant déduit pour tenir compte des impôts et cotisations dont le recouvrement est jugé improbable."}
}} />
        </Figure>
      </div>

      <div id="dos-p-depenses" role="tabpanel" hidden={onglet !== "depenses"} className="dos-panneau">
        <Figure
          id="depenses-publiques"
          titre="Où va l'argent public"
          legende={`Les ${enLettres(dep, 0)} de dépenses publiques 2025 lus par nature (salaires, prestations sociales, investissement, intérêts) ou par fonction (protection sociale, santé, éducation, défense).`}
          source={DEPENSES_2025}
          voir={[{ href: "#recettes-publiques", label: "Voir les recettes" }]}
        >
          <div className="dos-lectures" role="group" aria-label="Lecture des dépenses">
            <button type="button" className={lecture === "nature" ? "dos-lec-on" : undefined} onClick={() => setLecture("nature")}>
              Par nature
            </button>
            <button type="button" className={lecture === "fonction" ? "dos-lec-on" : undefined} onClick={() => setLecture("fonction")}>
              Par fonction
            </button>
          </div>
          {lecture === "nature" ? (
            <Repartition lignes={DEPENSES_NATURE} nom="Dépenses publiques 2025 par nature" details={{
 "Fonctionnement":{texte:"Salaires des agents en activité et achats de fonctionnement ; la différence avec le total inclut d’autres composantes.",sous:[{nom:"Rémunérations des agents",md:370},{nom:"Consommations intermédiaires",md:164.6}],precision:"Ces deux postes ne couvrent pas l’intégralité de la catégorie : ne pas les additionner comme une ventilation exhaustive."},
 "Prestations sociales en espèces et en nature":{texte:"Espèces : sommes versées aux ménages, dont pensions, indemnités et allocations. Nature : biens et services fournis ou pris en charge. La CAF verse notamment des aides familiales et au logement ; le versement ne signifie pas que toute l’aide relève d’une même fonction COFOG."},
 "Autres transferts et subventions":{texte:"Financements transférés à d’autres agents économiques, associations, entreprises ou organismes."},
 "Acquisitions nettes d'actifs non financiers":{texte:"Investissements et achats nets de bâtiments, équipements et autres actifs non financiers. La ligne « dont investissement » est incluse dans le total, elle ne s’y ajoute pas."},
 "Intérêts":{texte:"Coût des emprunts pendant l’année ; ce n’est pas le remboursement du principal."}
}} />
          ) : (<>
            <Repartition lignes={DEPENSES_FONCTION} nom="Dépenses publiques par fonction" details={{
 "Protection sociale":{texte:"Retraites, chômage, famille, handicap, dépendance et exclusion. Le camembert classe la dépense par nature économique (2024), pas par organisme : la CAF est un organisme payeur, pas une fonction distincte.",sous:[{nom:"Prestations en espèces : pensions et allocations",md:556},{nom:"Prestations en nature : services financés",md:45},{nom:"Rémunérations des agents actifs",md:32},{nom:"Transferts et subventions",md:45},{nom:"Achats de fonctionnement",md:11},{nom:"Investissements",md:4}],source:{nom:"Insee, dépenses par fonction 2024",url:"https://www.insee.fr/fr/statistiques/4277596"}},
 "Santé":{texte:"Soins, établissements de santé, personnel en activité, achats et équipements.",sous:[{nom:"Prestations en nature",md:136},{nom:"Rémunérations des personnels",md:70},{nom:"Consommations intermédiaires",md:34},{nom:"Transferts",md:11},{nom:"Investissements",md:10}],source:{nom:"Insee, dépenses par fonction 2024",url:"https://www.insee.fr/fr/statistiques/4277596"}},
 "Enseignement":{texte:"Écoles, universités, personnels en activité, bâtiments et équipements. Les pensions des anciens enseignants sont comptées dans la protection sociale.",sous:[{nom:"Rémunérations",md:104},{nom:"Achats courants",md:14},{nom:"Investissements",md:12},{nom:"Transferts",md:9},{nom:"Prestations",md:11}],precision:"Montants arrondis : leur somme peut différer du total de la fonction.",source:{nom:"Insee, dépenses par fonction 2024",url:"https://www.insee.fr/fr/statistiques/4277596"}},
 "Défense":{texte:"Rémunérations des militaires actifs, fonctionnement, achats et investissements.",sous:[{nom:"Rémunérations",md:22},{nom:"Achats",md:20},{nom:"Investissements",md:11},{nom:"Transferts",md:2}],precision:"Montants arrondis : la somme peut différer du total.",source:{nom:"Insee, dépenses par fonction 2024",url:"https://www.insee.fr/fr/statistiques/4277596"}}
}} />
            <p className="dos-notule">Ventilation par fonction : 2024 (dernière série disponible ici), à distinguer des dépenses totales 2025.</p>
          </>)}
        </Figure>
      </div>

      <div id="dos-p-deficit" role="tabpanel" hidden={onglet !== "deficit"} className="dos-panneau">
        <Figure
          id="qui-cree-le-deficit"
          titre="Qui crée le déficit"
          legende={`${nombre(etat, 0)} des ${enLettres(solde, 0)} de déficit public 2025 viennent de l'État ; les collectivités locales et la Sécurité sociale pèsent bien moins.`}
          source={DEFICIT_2025}
          voir={[{ href: "#evolution", label: "Voir l'évolution de la dette" }]}
        >
          <Repartition
            lignes={DEFICIT_PAR_ACTEUR.map((d) => ({ nom: d.nom, md: Math.abs(d.md) }))}
            nom="Déficit public 2025 par administration"
            negatif
            details={{
              "État":{texte:"Déficit de l’État, en comptabilité nationale. Ce solde ne doit pas être confondu avec les dépenses brutes de l’État.",sous:[{nom:"Solde négatif de l’État",md:128.1}]},
              "Organismes d'administration centrale":{texte:"Organismes nationaux distincts de l’État.",sous:[{nom:"Solde des organismes centraux",md:2.2}]},
              "Administrations publiques locales":{texte:"Solde des communes, départements, régions et autres organismes locaux.",sous:[{nom:"Solde des administrations locales",md:15.6}]},
              "Administrations de sécurité sociale":{texte:"Solde des administrations de sécurité sociale en comptabilité nationale.",sous:[{nom:"Solde de la sécurité sociale",md:6.7}]}
            }}
          />
        </Figure>
      </div>
    </>
  );
}

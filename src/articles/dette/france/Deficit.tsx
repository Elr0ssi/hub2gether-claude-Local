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
          <Repartition lignes={RECETTES_DETAIL} nom="Répartition des recettes publiques 2025" />
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
            <Repartition lignes={DEPENSES_NATURE} nom="Dépenses publiques 2025 par nature" />
          ) : (
            <>
              <Repartition lignes={DEPENSES_FONCTION} nom="Dépenses publiques par fonction" />
              <p className="dos-notule">Dernière ventilation par fonction publiée : 2024.</p>
            </>
          )}
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
          />
        </Figure>
      </div>
    </>
  );
}

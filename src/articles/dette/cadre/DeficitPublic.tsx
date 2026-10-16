"use client";

import { useState } from "react";
import { Figure } from "./Figure";
import { Repartition } from "./Repartition";
import { enLettres, montant } from "./montants";
import type { Detail, Part } from "./ventilation";
import type { Source } from "./types";

/* ═══════════════════════════════════════════════════════════════════════════
   LE CHAPITRE « DÉFICIT PUBLIC » : LA TRAME COMMUNE À TOUS LES PAYS

   Trois onglets, toujours les mêmes, dans le même ordre :
     Recettes − Dépenses = Déficit
   Chaque onglet est une <Figure> qui contient une <Repartition> ; chaque ligne
   s'ouvre sur son explication et son camembert ; tous les chiffres sont aussi
   dans un tableau sous la figure (pour les moteurs de recherche).

   Un pays remplit les données (voir `france/Deficit.tsx` et
   `allemagne/Deficit.tsx`, qui ne contiennent que cela). Il ne réécrit jamais
   la mise en page : c'est ce qui garde tous les articles identiques.

     <DeficitPublic
       pays="France"                       // sert aux titres : « … publiques françaises »
       recettes={{ total, lignes, details, source }}
       depenses={{ total, lectures: [{ id, bouton, nom, lignes, details, annee?, note? }], source }}
       deficit={{ montant, lignes?, details?, source }}
     />
   La première lecture des dépenses est celle qui s'affiche d'abord ; s'il n'y en a qu'une, les boutons disparaissent.
   Sans `deficit.lignes`, l'onglet Déficit montre l'écart entre dépenses et recettes en trois barres.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface LectureDepenses {
  /** Ancre de la lecture : « nature », « fonction ». */
  id: string;
  /** Le texte du bouton : « Par nature », « Par fonction ». */
  bouton: string;
  nom: string;
  lignes: Part[];
  details?: Record<string, Detail>;
  annee?: number;
  /** Une ligne sous la répartition : l'année, ou ce que cette lecture n'additionne pas. */
  note?: React.ReactNode;
}

export interface DeficitPublicProps {
  pays: string;
  annee?: number;
  recettes: { total: number; lignes: Part[]; details?: Record<string, Detail>; source: Source; resume: string };
  depenses: { total: number; lectures: LectureDepenses[]; source: Source; resume: string };
  deficit: { montant: number; lignes?: Part[]; details?: Record<string, Detail>; source: Source; resume: string; note?: React.ReactNode };
}

function Ecart({ rec, dep, solde }: { rec: number; dep: number; solde: number }) {
  return (
    <div className="dos-eq" role="img" aria-label="Dépenses, recettes et déficit">
      <div className="dos-eq-l">
        <span>Dépenses</span>
        <i style={{ "--p": "100%" } as React.CSSProperties} />
        <b>{montant(dep, 1)}</b>
      </div>
      <div className="dos-eq-l">
        <span>Recettes</span>
        <i style={{ "--p": `${(rec / dep) * 100}%` } as React.CSSProperties} />
        <b>{montant(rec, 1)}</b>
      </div>
      <div className="dos-eq-l dos-eq-def">
        <span>Écart : le déficit</span>
        <i style={{ "--p": `${(solde / dep) * 100}%` } as React.CSSProperties} />
        <b>−{montant(solde, 1)}</b>
      </div>
    </div>
  );
}

export function DeficitPublic({ pays, annee = 2025, recettes, depenses, deficit }: DeficitPublicProps) {
  const [onglet, setOnglet] = useState<"recettes" | "depenses" | "deficit">("recettes");
  const [lecture, setLecture] = useState(depenses.lectures[0].id);
  const rec = recettes.total;
  const dep = depenses.total;
  const solde = Math.abs(deficit.montant);
  const lectureActive = depenses.lectures.find((l) => l.id === lecture) ?? depenses.lectures[0];
  const sur = (id: string) => `dos-p-${id}`;

  return (
    <>
      <div className="dos-onglets" role="tablist" aria-label="Recettes, dépenses ou déficit">
        <button type="button" role="tab" aria-selected={onglet === "recettes"} aria-controls={sur("recettes")} className="dos-onglet dos-onglet-rec" onClick={() => setOnglet("recettes")}>
          <span>Recettes</span>
          <b>{montant(rec, 1, annee)}</b>
          <i style={{ "--p": `${(rec / dep) * 100}%` } as React.CSSProperties} />
        </button>
        <span className="dos-onglets-s" aria-hidden="true">−</span>
        <button type="button" role="tab" aria-selected={onglet === "depenses"} aria-controls={sur("depenses")} className="dos-onglet dos-onglet-dep" onClick={() => setOnglet("depenses")}>
          <span>Dépenses</span>
          <b>{montant(dep, 1, annee)}</b>
          <i style={{ "--p": "100%" } as React.CSSProperties} />
        </button>
        <span className="dos-onglets-s" aria-hidden="true">=</span>
        <button type="button" role="tab" aria-selected={onglet === "deficit"} aria-controls={sur("deficit")} className="dos-onglet dos-onglet-def" onClick={() => setOnglet("deficit")}>
          <span>Déficit</span>
          <b>−{montant(solde, 1, annee)}</b>
          <i style={{ "--p": `${(solde / dep) * 400}%` } as React.CSSProperties} />
        </button>
      </div>

      <div id={sur("recettes")} role="tabpanel" hidden={onglet !== "recettes"} className="dos-panneau">
        <Figure
          id="recettes-publiques"
          titre={`D'où viennent les recettes publiques ${pays}`}
          legende={`${recettes.resume} Cliquez sur une ligne pour voir ce qu'elle contient.`}
          source={recettes.source}
          voir={[{ href: "#depenses-publiques", label: "Voir les dépenses" }]}
        >
          <Repartition nom={`Recettes publiques ${pays} ${annee}`} idBase="recettes" lignes={recettes.lignes} details={recettes.details} annee={annee} />
        </Figure>
      </div>

      <div id={sur("depenses")} role="tabpanel" hidden={onglet !== "depenses"} className="dos-panneau">
        <Figure
          id="depenses-publiques"
          titre={`Où va l'argent public ${pays}`}
          legende={`${depenses.resume} Cliquez sur une ligne pour voir ce qu'elle contient.`}
          source={depenses.source}
          voir={[{ href: "#recettes-publiques", label: "Voir les recettes" }]}
        >
          {depenses.lectures.length > 1 && (
            <div className="dos-lectures" role="group" aria-label="Lecture des dépenses">
              {depenses.lectures.map((l) => (
                <button key={l.id} type="button" className={l.id === lectureActive.id ? "dos-lec-on" : undefined} onClick={() => setLecture(l.id)}>
                  {l.bouton}
                </button>
              ))}
            </div>
          )}
          <Repartition key={lectureActive.id} nom={lectureActive.nom} idBase={`depenses-${lectureActive.id}`} lignes={lectureActive.lignes} details={lectureActive.details} annee={lectureActive.annee ?? annee} />
          {lectureActive.note && <p className="dos-notule">{lectureActive.note}</p>}
        </Figure>
      </div>

      <div id={sur("deficit")} role="tabpanel" hidden={onglet !== "deficit"} className="dos-panneau">
        <Figure
          id="qui-cree-le-deficit"
          titre={`Comment se forme le déficit public ${pays}`}
          legende={deficit.resume}
          source={deficit.source}
          voir={[{ href: "#evolution", label: "Voir l'évolution de la dette" }]}
        >
          {deficit.lignes ? (
            <Repartition nom={`Déficit public ${pays} ${annee} par administration`} idBase="deficit" negatif lignes={deficit.lignes} details={deficit.details} annee={annee} />
          ) : (
            <Ecart rec={rec} dep={dep} solde={solde} />
          )}
          {deficit.note && <p className="dos-notule">{deficit.note}</p>}
        </Figure>
      </div>
    </>
  );
}

/** Le résumé d'un total en toutes lettres, pour les légendes : « 1 714,2 milliards d'euros ». */
export const enMots = enLettres;

"use client";

import { COMPARAISON, SOURCE_COMPARAISON } from "@/articles/dette/france/donnees/detteFrancaise";
import { useVu } from "@/articles/dette/cadre";
import { Donnees } from "./Donnees";

/* ═══════════════════════════════════════════════════════════════════════════
   LA FRANCE FACE À SES VOISINS

   Des barres horizontales : la dette rapportée au PIB de quelques pays et des
   moyennes de la zone euro et de l'Union européenne.
   ═══════════════════════════════════════════════════════════════════════════ */

const nb = (v: number, d = 0) =>
  v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

export function Comparaison() {
  const { ref, vu } = useVu<HTMLDivElement>(90);
  const max = Math.max(...COMPARAISON.map((c) => c.pct));
  return (
    <figure className="dp-fig">
      <div className="dp-comp" ref={ref} data-vu={vu ? "1" : "0"}>
        {COMPARAISON.map((c, i) => (
          <div
            key={c.nom}
            className={`dp-comp-l${c.france ? " dp-comp-fr" : ""}${c.agregat ? " dp-comp-ag" : ""}`}
            style={{ "--i": i, "--p": `${(c.pct / max) * 100}%` } as React.CSSProperties}
          >
            <span className="dp-comp-n">{c.nom}</span>
            <span className="dp-comp-b" aria-hidden="true" />
            <span className="dp-comp-v">{nb(c.pct, 1)} %</span>
          </div>
        ))}
      </div>
      <Donnees
        titre={`Dette publique rapportée au PIB, ${SOURCE_COMPARAISON.periode}`}
        colonnes={["Pays ou zone", "Dette / PIB (%)"]}
        lignes={COMPARAISON.map((c) => [c.nom, nb(c.pct, 1)])}
      />
      <p className="dp-fig-s">
        <a href={SOURCE_COMPARAISON.url} target="_blank" rel="noopener noreferrer">
          Source : {SOURCE_COMPARAISON.source} ↗
        </a>
      </p>
    </figure>
  );
}

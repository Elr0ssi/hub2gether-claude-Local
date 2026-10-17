"use client";

import { EUROPE, SOURCES } from "../donnees";
import { useVu, nf, montant } from "@/articles/dette/cadre";

/** Les classes de la comparaison horizontale de la France : même visuel, données de l'Italie.
 *  Une seule édition (Eurostat, 22 avril 2026, fin 2025). */
export function Comparaison() {
  const { ref, vu } = useVu<HTMLDivElement>(90);
  const max = Math.max(...EUROPE.map((c) => c.pct));
  return (
    <figure className="dp-fig">
      <div className="dp-comp" ref={ref} data-vu={vu ? "1" : "0"}>
        {EUROPE.map((c, i) => (
          <div
            key={c.nom}
            className={`dp-comp-l${c.italie ? " dp-comp-fr" : ""}${c.agregat ? " dp-comp-ag" : ""}`}
            style={{ "--i": i, "--p": `${(c.pct / max) * 100}%` } as React.CSSProperties}
          >
            <span className="dp-comp-n">{c.nom}</span>
            <span className="dp-comp-b" aria-hidden="true" />
            <span className="dp-comp-v">{nf(c.pct)} %</span>
          </div>
        ))}
      </div>
      <details className="dos-donnees">
        <summary>Voir les données</summary>
        <table>
          <caption>Dette publique Maastricht et solde public, fin 2025, Eurostat</caption>
          <thead>
            <tr>
              <th scope="col">Pays ou zone</th>
              <th scope="col">Dette / PIB</th>
              <th scope="col">Dette</th>
              <th scope="col">Solde / PIB 2025</th>
            </tr>
          </thead>
          <tbody>
            {EUROPE.map((c) => (
              <tr key={c.nom}>
                <th scope="row">{c.nom}</th>
                <td>{nf(c.pct)} %</td>
                <td>{montant(c.md, 1)}</td>
                <td>{`${c.solde > 0 ? "+" : "−"}${nf(Math.abs(c.solde))} %`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      <p className="dp-fig-s">
        <a href={SOURCES.EUROSTAT} target="_blank" rel="noopener noreferrer">Source : Eurostat · dette publique de Maastricht, fin 2025 (notification du 22 avril 2026) ↗</a>
      </p>
    </figure>
  );
}

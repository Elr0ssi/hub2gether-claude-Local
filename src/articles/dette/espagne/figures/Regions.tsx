"use client";

import { REGIONS, SOURCES } from "../donnees";
import { useVu, nf } from "@/articles/dette/cadre";

/** La dette de neuf communautés autonomes, rapportée au PIB de leur région (Banco de España, fin T2 2026). */
export function Regions() {
  const { ref, vu } = useVu<HTMLDivElement>(90);
  const max = Math.max(...REGIONS.map((c) => c.pct));
  return (
    <figure className="dp-fig">
      <div className="dp-comp" ref={ref} data-vu={vu ? "1" : "0"}>
        {REGIONS.map((c, i) => (
          <div key={c.nom} className="dp-comp-l" style={{ "--i": i, "--p": `${(c.pct / max) * 100}%` } as React.CSSProperties}>
            <span className="dp-comp-n">{c.nom}</span>
            <span className="dp-comp-b" aria-hidden="true" />
            <span className="dp-comp-v">{nf(c.pct)} %</span>
          </div>
        ))}
      </div>
      <details className="dos-donnees">
        <summary>Voir les données</summary>
        <table>
          <caption>Dette des communautés autonomes rapportée au PIB de leur région, fin T2 2026</caption>
          <thead>
            <tr>
              <th scope="col">Communauté autonome</th>
              <th scope="col">Dette / PIB régional</th>
            </tr>
          </thead>
          <tbody>
            {REGIONS.map((c) => (
              <tr key={c.nom}>
                <th scope="row">{c.nom}</th>
                <td>{nf(c.pct)} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      <p className="dp-fig-s">
        <a href={SOURCES.BDE_T2} target="_blank" rel="noopener noreferrer">Source : Banco de España · dette des administrations publiques, 2e trimestre 2026 ↗</a>
      </p>
    </figure>
  );
}

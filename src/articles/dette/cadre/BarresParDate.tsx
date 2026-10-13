"use client";

import { useState } from "react";
import { montant, nf } from "./montants";

export interface PointDate {
  /** Identifiant unique du point (« 2023 », « 2025-T4 »). */
  cle: string;
  /** Ce qui s'écrit sous la barre (« 2023 », « 2025 T4 »). */
  etiquette: string;
  /** La valeur tracée, en % du PIB par défaut. */
  valeur: number;
  /** Le montant de la dette à cette date, en milliards d'euros — facultatif, converti dans la monnaie du lecteur. */
  montantMd?: number | null;
  /** Un événement daté à rappeler (« crise financière »), facultatif. */
  repere?: string;
}

/** Des barres, une par date : on lit en cliquant (ou en survolant) une barre. Pas de courbe tracée
 *  entre les dates : si l'on n'a que sept repères, on montre sept barres, sans faire croire à une série annuelle.
 *
 *    <BarresParDate
 *      points={[{ cle: "2000", etiquette: "2000", valeur: 58.9 }, { cle: "2024", etiquette: "2024", valeur: 137, montantMd: 3200 }]}
 *      unite="% du PIB"                // ce qui suit la valeur lue
 *      enteteValeur="Dette / PIB"      // en-têtes du tableau « Voir les données »
 *    />
 */
export function BarresParDate({
  points,
  unite = "% du PIB",
  enteteValeur = "Dette / PIB",
  enteteMontant = "Montant",
}: {
  points: PointDate[];
  unite?: string;
  enteteValeur?: string;
  enteteMontant?: string;
}) {
  const [sel, setSel] = useState(points.length - 1);
  const max = Math.max(...points.map((p) => p.valeur));
  const p = points[sel];

  return (
    <div className="dos-graphe">
      <div className="dos-graphe-tete">
        <p className="dos-graphe-v">
          {nf(p.valeur)} <small>{unite}</small>
        </p>
        <p className="dos-graphe-d">
          {p.etiquette}
          {p.montantMd != null ? ` · ${montant(p.montantMd)}` : ""}
          {p.repere ? ` · ${p.repere}` : ""}
        </p>
      </div>
      <div className="dos-barres" role="list">
        {points.map((pt, i) => (
          <button
            key={pt.cle}
            type="button"
            role="listitem"
            className={`dos-barre-c${i === sel ? " dos-barre-on" : ""}`}
            onClick={() => setSel(i)}
            onMouseEnter={() => setSel(i)}
            onFocus={() => setSel(i)}
            aria-label={`${pt.etiquette} : ${nf(pt.valeur)} ${unite}`}
          >
            <span className="dos-barre-v">{nf(pt.valeur, Number.isInteger(pt.valeur) ? 0 : 1)}</span>
            <span className="dos-barre-z">
              <span className="dos-barre-b" style={{ height: `${(pt.valeur / max) * 100}%`, "--i": i } as React.CSSProperties} />
            </span>
            <span className="dos-barre-a">{pt.etiquette}</span>
          </button>
        ))}
      </div>
      <details className="dos-donnees">
        <summary>Voir les données</summary>
        <table>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">{enteteValeur}</th>
              <th scope="col">{enteteMontant}</th>
            </tr>
          </thead>
          <tbody>
            {points.map((pt) => (
              <tr key={pt.cle}>
                <th scope="row">{pt.etiquette}</th>
                <td>
                  {nf(pt.valeur)} {unite.startsWith("%") ? "%" : unite}
                </td>
                <td>{pt.montantMd != null ? montant(pt.montantMd) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

"use client";

import { PAR_ADMINISTRATION } from "../donnees";
import { montant } from "@/articles/dette/cadre";

/** La dette par administration débitrice, AVANT consolidation : des barres, pas un camembert. Les « dettes croisées »
 *  (en corail) sont ce qu'une administration doit à une autre : elles disparaissent du total consolidé. */
export function Administrations() {
  const max = Math.max(...PAR_ADMINISTRATION.map((l) => Math.abs(l.md)));
  return (
    <div className="dos-eq dos-eq-ad" role="img" aria-label="Dette par administration, avant consolidation">
      {PAR_ADMINISTRATION.map((l) => (
        <div key={l.nom} className={`dos-eq-l${l.consolidation ? " dos-eq-neg" : ""}${l.total ? " dos-eq-total" : ""}`}>
          <span>{l.nom}</span>
          <i style={{ "--p": `${(Math.abs(l.md) / max) * 100}%` } as React.CSSProperties} />
          <b>
            {l.md < 0 ? "−" : ""}
            {montant(Math.abs(l.md), l.total && !Number.isInteger(l.md) ? 1 : 0, 2026)}
          </b>
        </div>
      ))}
    </div>
  );
}

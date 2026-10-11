"use client";

import { MONNAIES } from "@/data/finance/tauxChange";
import { useMonnaieArticle } from "./Monnaie";
import "./devise.css";

/** « Afficher en » : trois pastilles posées dans l'article, pour convertir tous ses montants. */
export function DeviseArticle({ className = "" }: { className?: string }) {
  const [m, change] = useMonnaieArticle();
  return (
    <div className={`dv ${className}`} role="group" aria-label="Monnaie d'affichage des montants">
      <span>Afficher les montants en</span>
      {MONNAIES.map((x) => (
        <button key={x.code} type="button" className={m === x.code ? "on" : ""} aria-pressed={m === x.code} onClick={() => change(x.code)} title={x.libelle}>
          {x.unitaire}
        </button>
      ))}
      <small>Taux moyen de l&apos;année de chaque montant.</small>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMonnaieArticle } from "@/components/concept/Monnaie";
import { fmtMontant } from "@/lib/montant";
import { nf } from "@/data/seo/francais";
import type { Dossier } from "@/data/dettes/dossiers";
import { adresseDette } from "@/articles/dette/catalogue";
import "@/components/seo/seo.css";
import "./dette-dossier.css";

const lien = (d: Dossier) => adresseDette(d.slug);

/** Le classement mondial : trois façons de trier, des montants dans la monnaie du lecteur. */
export function ClassementDette({ dossiers }: { dossiers: Dossier[] }) {
  const [mon] = useMonnaieArticle();
  const [tri, setTri] = useState<"ratio" | "montant" | "hausse">("ratio");
  const lignes = useMemo(() => {
    const l = [...dossiers];
    if (tri === "ratio") l.sort((a, b) => b.p2024 - a.p2024);
    else if (tri === "montant") l.sort((a, b) => b.d2024 - a.d2024);
    else l.sort((a, b) => b.p2024 - b.p2000 - (a.p2024 - a.p2000));
    return l;
  }, [dossiers, tri]);
  const max = tri === "ratio" ? Math.max(...dossiers.map((d) => d.p2024)) : tri === "montant" ? Math.max(...dossiers.map((d) => d.d2024)) : Math.max(...dossiers.map((d) => Math.abs(d.p2024 - d.p2000)));

  return (
    <div className="dd-classement">
      <div className="dd-tri" role="tablist" aria-label="Trier le classement">
        {([
          ["ratio", "Poids dans le PIB"],
          ["montant", "Montant"],
          ["hausse", "Évolution depuis 2000"],
        ] as const).map(([id, lib]) => (
          <button key={id} type="button" role="tab" aria-selected={tri === id} className={tri === id ? "on" : ""} onClick={() => setTri(id)}>{lib}</button>
        ))}
      </div>
      <ol className="dd-liste">
        {lignes.map((d, i) => {
          const v = tri === "ratio" ? d.p2024 : tri === "montant" ? d.d2024 : d.p2024 - d.p2000;
          return (
            <li key={d.slug}>
              <Link href={lien(d)} className="dd-ligne">
                <span className="dd-rang">{i + 1}</span>
                <span className="dd-pays">{d.flag} {d.fr}</span>
                <span className="dd-piste"><i style={{ width: `${Math.max(2, (Math.abs(v) / max) * 100)}%` }} /></span>
                <span className="dd-val">
                  {tri === "ratio" ? `${nf(d.p2024, 1)} %` : tri === "montant" ? fmtMontant(d.d2024, "eur", 2024, mon, d.d2024 >= 100 ? 0 : 1) : `${v >= 0 ? "+" : "−"}${nf(Math.abs(v), 1)} pts`}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

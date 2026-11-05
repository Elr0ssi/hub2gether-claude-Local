"use client";

import { useState } from "react";
import { ArrowUpRight, Link2 } from "lucide-react";
import type { Source } from "./types";

/** Une figure : le graphique, sa légende, sa source exacte, une adresse qu'on peut copier.
 *  C'est ce qui permet de retrouver — et de citer — un graphique précis depuis un moteur de recherche.
 *
 *    <Figure
 *      id="dette-par-emetteur"                       // l'ancre de la figure : `#dette-par-emetteur`
 *      titre="Dette publique par émetteur"           // sans point final : il est ajouté
 *      legende="Ce qu'on y voit, avec les mots qu'on cherche."
 *      source={{ source: "INSEE · comptes nationaux", url: "https://www.insee.fr/…" }}
 *      voir={[{ href: "#interets", label: "Ce que ça coûte" }]}     // renvois, facultatifs
 *    >
 *      <Repartition … />
 *    </Figure>
 */
export function Figure({
  id,
  titre,
  legende,
  source,
  voir,
  children,
  reprise = false,
}: {
  id: string;
  titre: string;
  legende: string;
  source: Source;
  voir?: { href: string; label: string }[];
  children: React.ReactNode;
  /** Vrai pour un visuel qui garde son propre style (voir `france/figures/`). Inutile pour un nouvel article. */
  reprise?: boolean;
}) {
  const [copie, setCopie] = useState(false);
  const copier = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard?.writeText(url).then(
      () => {
        setCopie(true);
        window.setTimeout(() => setCopie(false), 1800);
      },
      () => {},
    );
  };
  return (
    <figure id={id} className="dos-fig">
      <div className={reprise ? "dos-reuse dp dos-reuse-dp" : "dos-fig-corps"}>{children}</div>
      <figcaption className="dos-fig-l">
        <p>
          <b>{titre}.</b> {legende}
        </p>
        <div className="dos-fig-pied">
          <a className="dos-source" href={source.url} target="_blank" rel="noopener noreferrer">
            Source : {source.source}
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <button type="button" className="dos-ancre" onClick={copier} aria-label={`Copier le lien vers « ${titre} »`}>
            <Link2 size={13} aria-hidden="true" />
            {copie ? "Lien copié" : "Copier le lien"}
          </button>
          {voir?.map((v) => (
            <a key={v.href} className="dos-voir" href={v.href}>
              {v.label}
            </a>
          ))}
        </div>
      </figcaption>
    </figure>
  );
}

"use client";

import { useState } from "react";
import { montant, montantAbs, nf } from "./montants";
import { DetailsPostes } from "./DetailsPostes";

const COULEURS = [
  "var(--dos-s0)",
  "var(--dos-s1)",
  "var(--dos-s2)",
  "var(--dos-s3)",
  "var(--dos-s4)",
  "var(--dos-s5)",
  "var(--dos-s6)",
  "var(--dos-s7)",
];

/** Une répartition : une barre segmentée, puis la liste des montants et des parts. Au survol d'un
 *  segment ou d'une ligne, l'autre s'éclaire. Convient aux recettes, aux dépenses, à une dette par
 *  créancier — tout ce qui se découpe en parts d'un total.
 *
 *    <Repartition
 *      nom="Dette par créancier"                       // décrit le graphique aux lecteurs d'écran
 *      lignes={[{ nom: "Marchés privés", md: 1800 }, { nom: "FMI", md: 400 }]}   // md : milliards d'euros
 *    />
 *
 *  `negatif` : pour une répartition de déficits, les montants s'écrivent avec un « − ».
 *  Une ligne dont `md` est négatif s'affiche « en déduction » et ne compte pas dans la barre.
 */
export function Repartition({
  lignes,
  nom,
  negatif = false,
  details,
}: {
  lignes: { nom: string; md: number }[];
  nom: string;
  negatif?: boolean;
  details?: Record<string,{texte:string;sous?:{nom:string;md:number}[]}>;
}) {
  const positives = lignes.filter((l) => l.md > 0);
  const somme = positives.reduce((t, l) => t + l.md, 0);
  const [actif, setActif] = useState<number | null>(null);
  const [ouvert, setOuvert] = useState<string | null>(null);
  return (
    <div className="dos-rep">
      <div className="dos-pile-b" role="img" aria-label={nom}>
        {positives.map((l, i) => (
          <span
            className={actif !== null && actif !== i ? "dos-seg-sombre" : undefined}
            style={{ flexGrow: l.md, backgroundColor: COULEURS[i % COULEURS.length] }}
            title={`${l.nom} · ${montantAbs(l.md)}`}
            onPointerEnter={() => setActif(i)}
            onPointerLeave={() => setActif(null)}
          />
        ))}
      </div>
      <ul className="dos-pile-l">
        {lignes.map((l, i) => (<div key={l.nom} style={{display:"contents"}}><li
            key={l.nom}
            className={`${l.md < 0 ? "dos-pile-neg" : ""}${actif === i && l.md > 0 ? " dos-pile-on" : ""}`}
            onPointerEnter={() => l.md > 0 && setActif(i)}
            onPointerLeave={() => setActif(null)}
          >
            <i style={{ backgroundColor: l.md > 0 ? COULEURS[i % COULEURS.length] : "var(--dos-s7)" }} aria-hidden="true" />
            {details?.[l.nom] ? <button type="button" aria-expanded={ouvert===l.nom} onClick={()=>setOuvert(ouvert===l.nom?null:l.nom)} style={{flex:1,textAlign:"left",border:0,background:"transparent",color:"inherit",font:"inherit",cursor:"pointer",padding:0}}>{l.nom} <span aria-hidden="true">{ouvert===l.nom?"−":"⌄"}</span></button> : <span>{l.nom}</span>}
            <b className={negatif ? "dos-neg" : undefined}>
              {negatif || l.md < 0 ? "−" : ""}
              {montant(Math.abs(l.md), 0)}
            </b>
            <em>{l.md > 0 ? `${nf((l.md / somme) * 100)} %` : "en déduction"}</em>
          </li>{ouvert===l.nom && details?.[l.nom] && <li style={{display:"block",padding:"12px 16px",background:"var(--dos-fond, transparent)"}}><DetailsPostes titre={l.nom} postes={[{nom:l.nom,md:l.md}]} complements={{[l.nom]:details[l.nom]}} /></li>}</div>))}
      </ul>
    </div>
  );
}

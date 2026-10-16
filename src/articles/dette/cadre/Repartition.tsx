"use client";

import { Fragment, useId, useState } from "react";
import { montant, montantAbs, nf } from "./montants";

const COULEURS = [
  "var(--dos-s0)", "var(--dos-s1)", "var(--dos-s2)", "var(--dos-s3)",
  "var(--dos-s4)", "var(--dos-s5)", "var(--dos-s6)", "var(--dos-s7)",
];

export interface SousPoste {
  nom: string;
  md: number;
  note?: string;
  enfants?: SousPoste[];
}
export interface DetailRepartition {
  texte: string;
  sous?: SousPoste[];
  /** Périmètre d'un tableau distinct (ex. impôts encaissés vs comptabilité nationale). */
  totalSous?: number;
  precision?: string;
  source?: { nom: string; url: string };
}
export interface LigneRepartition extends SousPoste {}

function DiagrammeDetail({
  postes, total, precision,
}: { postes: SousPoste[]; total?: number; precision?: string }) {
  const [survol, setSurvol] = useState<number | null>(null);
  const [deplie, setDeplie] = useState<number | null>(null);
  const base = total ?? postes.reduce((s, p) => s + Math.max(0, p.md), 0);
  if (base <= 0) return null;
  const somme = postes.reduce((s, p) => s + Math.max(0, p.md), 0);
  const manque = base - somme;
  const parts = manque > 0.08
    ? [...postes, { nom: "Autres postes non détaillés (solde)", md: manque }]
    : postes;
  const sommeGraph = parts.reduce((s, p) => s + Math.max(0, p.md), 0);
  const R = 42; const C = 2 * Math.PI * R;
  let parcours = 0;
  const arcs = parts.map((p, i) => {
    const longueur = (Math.max(0, p.md) / sommeGraph) * C;
    const arc = { index: i, longueur, decalage: -parcours };
    parcours += longueur;
    return arc;
  });
  return <>
    <div className="dp-porteurs dos-detail-porteurs" data-vu="1">
      <div className="dp-anneau-w">
        <svg className="dp-anneau-svg" viewBox="0 0 100 100" role="img" aria-label="Ventilation détaillée en diagramme circulaire">
          {arcs.map(({ index, longueur, decalage }) =>
            <circle key={parts[index].nom} cx="50" cy="50" r={R}
              fill="none" stroke={COULEURS[index % COULEURS.length]}
              strokeWidth={survol === index ? 14 : 11}
              strokeDasharray={`${Math.max(0, longueur - .7)} ${C}`}
              strokeDashoffset={decalage}
              transform="rotate(-90 50 50)"
              style={{ opacity: survol !== null && survol !== index ? .35 : 1, transition: "opacity .2s,stroke-width .2s" }}
              onPointerEnter={() => setSurvol(index)} onPointerLeave={() => setSurvol(null)}
            />
          )}
        </svg>
        <div className="dp-anneau-c"><b>{survol === null ? "100 %" : `${nf(parts[survol].md / sommeGraph * 100)} %`}</b><small>{survol === null ? "du détail" : parts[survol].nom}</small></div>
      </div>
      <ul className="dp-porteurs-l dos-detail-legende">
        {parts.map((p, i) => <li key={p.nom}
          onPointerEnter={() => setSurvol(i)} onPointerLeave={() => setSurvol(null)}>
          <span className="dos-detail-puce" style={{ background: COULEURS[i % COULEURS.length] }} />
          <div className="dos-detail-libelle">
            {p.enfants?.length ? <button type="button" onClick={() => setDeplie(deplie === i ? null : i)}
              aria-expanded={deplie === i}>{p.nom} <span aria-hidden="true">{deplie === i ? "−" : "⌄"}</span></button> : <span>{p.nom}</span>}
            {p.note && <small>{p.note}</small>}
            {deplie === i && p.enfants && <ul className="dos-detail-enfants">{p.enfants.map(e => <li key={e.nom}><span>{e.nom}</span><b>{montant(e.md, 1)}</b>{e.note && <small>{e.note}</small>}</li>)}</ul>}
          </div>
          <b>{montant(p.md, 1)}</b>
          <em>{nf(p.md / sommeGraph * 100)} %</em>
        </li>)}
      </ul>
    </div>
    {precision && <p className="dos-detail-precision">{precision}</p>}
  </>;
}

/** Les styles et les quatre colonnes des lignes d'origine ne changent pas.
 * Le clic déplie une deuxième ligne, directement sous la ligne choisie. */
export function Repartition({
  lignes, nom, negatif = false, details,
}: {
  lignes: LigneRepartition[];
  nom: string;
  negatif?: boolean;
  details?: Record<string, DetailRepartition>;
}) {
  const positives = lignes.filter(l => l.md > 0);
  const somme = positives.reduce((t, l) => t + l.md, 0);
  const [actif, setActif] = useState<number | null>(null);
  const [ouvert, setOuvert] = useState<string | null>(null);
  const identifiant = useId();
  return <div className="dos-rep">
    <div className="dos-pile-b" role="img" aria-label={nom}>
      {positives.map((l, i) => <span key={l.nom}
        className={actif !== null && actif !== i ? "dos-seg-sombre" : undefined}
        style={{ flexGrow: l.md, backgroundColor: COULEURS[lignes.indexOf(l) % COULEURS.length] }}
        title={`${l.nom} · ${montantAbs(l.md)}`}
        onPointerEnter={() => setActif(i)}
        onPointerLeave={() => setActif(null)} />)}
    </div>
    <ul className="dos-pile-l">
      {lignes.map((l, i) => {
        const detail: DetailRepartition = details?.[l.nom] ?? { texte: l.note || "Cette catégorie n’a pas de ventilation chiffrée supplémentaire dans la source actuelle.", sous: l.enfants?.length ? l.enfants : [{ nom: l.nom, md: Math.abs(l.md) }] };
        const estOuvert = ouvert === l.nom && !!detail;
        const id = `${identifiant}-${i}`;
        return <Fragment key={l.nom}>
          <li className={`${l.md < 0 ? "dos-pile-neg" : ""}${actif === i && l.md > 0 ? " dos-pile-on" : ""}${detail ? " dos-pile-ouvrable" : ""}`}
            role={detail ? "button" : undefined}
            tabIndex={detail ? 0 : undefined}
            aria-expanded={detail ? estOuvert : undefined}
            aria-controls={detail ? id : undefined}
            onClick={detail ? () => setOuvert(estOuvert ? null : l.nom) : undefined}
            onKeyDown={detail ? e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOuvert(estOuvert ? null : l.nom); } } : undefined}
            onPointerEnter={() => l.md > 0 && setActif(i)}
            onPointerLeave={() => setActif(null)}>
            <i style={{ backgroundColor: l.md > 0 ? COULEURS[i % COULEURS.length] : "var(--dos-s7)" }} aria-hidden="true" />
            <span>{l.nom}{detail && <small className="dos-pile-chevron" aria-hidden="true">{estOuvert ? "−" : "⌄"}</small>}</span>
            <b className={negatif ? "dos-neg" : undefined}>{negatif || l.md < 0 ? "−" : ""}{montant(Math.abs(l.md), 0)}</b>
            <em>{l.md > 0 ? `${nf((l.md / somme) * 100)} %` : "en déduction"}</em>
          </li>
          {estOuvert && detail && <li className="dos-pile-detail" id={id}>
            {detail.texte && <p>{detail.texte}</p>}
            {detail.sous && detail.sous.length > 0 &&
              <DiagrammeDetail postes={detail.sous} total={detail.totalSous}
                precision={detail.precision} />}
            {detail.source && <p className="dos-detail-source">Source : <a href={detail.source.url}
              target="_blank" rel="noopener noreferrer">{detail.source.nom} ↗</a></p>}
          </li>}
        </Fragment>;
      })}
    </ul>
  </div>;
}

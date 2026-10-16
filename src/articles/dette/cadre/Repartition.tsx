"use client";

import { Fragment, useId, useState } from "react";
import { Camembert, avecMontants } from "./Camembert";
import { montant, montantAbs, nf } from "./montants";
import type { Detail, Part } from "./ventilation";

/** La barre segmentée et ses lignes ; chaque ligne qui a un `details` s'ouvre sur un petit
 *  panneau : l'explication, puis le camembert de son contenu (comme « Qui détient la dette »).
 *
 *    <Repartition
 *      nom="Recettes publiques 2025"
 *      lignes={[{ nom: "Impôts", md: 884.9 }, …]}
 *      details={{ "Impôts": { texte: "…", vues: [{ parts: […], total: 884.9 }], source: {…} } }}
 *    />
 *
 *  Une ligne sans `details` reste une ligne simple. La clé de `details` est le `nom` de la ligne. */

const COULEURS = [
  "var(--dos-s0)", "var(--dos-s1)", "var(--dos-s2)", "var(--dos-s3)",
  "var(--dos-s4)", "var(--dos-s5)", "var(--dos-s6)", "var(--dos-s7)",
];

export type LigneRepartition = Part;

function Panneau({ detail, annee }: { detail: Detail; annee: number }) {
  const t = (s: string) => avecMontants(s, annee);
  const [vue, setVue] = useState(0);
  const vues = detail.vues ?? [];
  const courante = vues[Math.min(vue, vues.length - 1)];
  return (
    <>
      <p className="dos-det-texte">{t(detail.texte)}</p>
      {detail.notes && detail.notes.length > 0 && (
        <ul className="dos-det-notes">
          {detail.notes.map((n) => <li key={n}>{t(n)}</li>)}
        </ul>
      )}
      {vues.length > 1 && (
        <div className="dos-det-onglets" role="group" aria-label="Lecture du détail">
          {vues.map((v, i) => (
            <button key={v.titre ?? i} type="button" className={i === vue ? "dos-det-on" : undefined} onClick={() => setVue(i)}>
              {v.titre}
            </button>
          ))}
        </div>
      )}
      {courante && <Camembert key={vue} vue={courante} annee={annee} />}
      {detail.absent && <p className="dos-det-absent">{t(detail.absent)}</p>}
      {detail.source && (
        <p className="dos-det-source">
          Source : <a href={detail.source.url} target="_blank" rel="noopener noreferrer">{detail.source.nom} ↗</a>
        </p>
      )}
    </>
  );
}

export function Repartition({
  lignes,
  nom,
  negatif = false,
  details,
  annee = 2025,
}: {
  lignes: LigneRepartition[];
  nom: string;
  negatif?: boolean;
  details?: Record<string, Detail>;
  /** L'année des montants : c'est le taux de change de cette année qui les convertit. */
  annee?: number;
}) {
  const positives = lignes.filter((l) => l.md > 0);
  const somme = positives.reduce((t, l) => t + l.md, 0);
  const [actif, setActif] = useState<number | null>(null);
  const [ouvert, setOuvert] = useState<string | null>(null);
  const identifiant = useId();

  return (
    <div className="dos-rep">
      <div className="dos-pile-b" role="img" aria-label={nom}>
        {positives.map((l) => {
          const i = lignes.indexOf(l);
          return (
            <span
              key={l.nom}
              className={actif !== null && actif !== i ? "dos-seg-sombre" : undefined}
              style={{ flexGrow: l.md, backgroundColor: COULEURS[i % COULEURS.length] }}
              title={`${l.nom} · ${montantAbs(l.md, 1, annee)}`}
              onPointerEnter={() => setActif(i)}
              onPointerLeave={() => setActif(null)}
            />
          );
        })}
      </div>
      <ul className="dos-pile-l">
        {lignes.map((l, i) => {
          const detail = details?.[l.nom];
          const estOuvert = ouvert === l.nom;
          const id = `${identifiant}-${i}`;
          const bascule = () => setOuvert(estOuvert ? null : l.nom);
          return (
            <Fragment key={l.nom}>
              <li
                className={`${l.md < 0 ? "dos-pile-neg" : ""}${actif === i && l.md > 0 ? " dos-pile-on" : ""}${detail ? " dos-pile-ouvrable" : ""}${estOuvert ? " dos-pile-ouverte" : ""}`}
                role={detail ? "button" : undefined}
                tabIndex={detail ? 0 : undefined}
                aria-expanded={detail ? estOuvert : undefined}
                aria-controls={detail ? id : undefined}
                onClick={detail ? bascule : undefined}
                onKeyDown={detail ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); bascule(); } } : undefined}
                onPointerEnter={() => l.md > 0 && setActif(i)}
                onPointerLeave={() => setActif(null)}
              >
                <i style={{ backgroundColor: l.md > 0 ? COULEURS[i % COULEURS.length] : "var(--dos-s7)" }} aria-hidden="true" />
                <span>
                  {l.nom}
                  {detail && <small className="dos-pile-chevron" aria-hidden="true">{estOuvert ? "−" : "+"}</small>}
                  {l.note && <small className="dos-pile-note">{l.note}</small>}
                </span>
                <b className={negatif ? "dos-neg" : undefined}>
                  {negatif || l.md < 0 ? "−" : ""}
                  {montant(Math.abs(l.md), 1, annee)}
                </b>
                <em>{l.md > 0 ? `${nf((l.md / somme) * 100)} %` : "en déduction"}</em>
              </li>
              {estOuvert && detail && (
                <li className="dos-pile-detail" id={id}>
                  <Panneau detail={detail} annee={annee} />
                </li>
              )}
            </Fragment>
          );
        })}
      </ul>
    </div>
  );
}

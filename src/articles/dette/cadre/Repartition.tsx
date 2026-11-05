"use client";

import { Fragment, useEffect, useId, useState } from "react";
import { Bareme, Camembert, Taux, avecMontants, mdAuto } from "./Camembert";
import { montant, montantAbs, nf } from "./montants";
import { aplatir, slug, type Detail, type Part } from "./ventilation";

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

/** Une grande famille de lignes (impôts, cotisations sociales, autres recettes) : une pastille de couleur. */
export interface FamilleRepartition {
  nom: string;
}
const couleurDe = (l: Part, i: number) => (l.md <= 0 ? "var(--dos-s7)" : l.famille !== undefined ? `var(--fam${l.famille % 3})` : COULEURS[i % COULEURS.length]);

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
      {detail.baremes?.map((b) => <Bareme key={b.titre ?? b.lignes[0].libelle} bareme={b} />)}
      {courante && <Camembert key={vue} vue={courante} annee={annee} />}
      {detail.source && (
        <p className="dos-det-source">
          Source : <a href={detail.source.url} target="_blank" rel="noopener noreferrer">{detail.source.nom} ↗</a>
        </p>
      )}
    </>
  );
}

/** Tous les chiffres de la répartition dans un vrai tableau : lu par les moteurs de recherche et les lecteurs d'écran
 *  même quand les panneaux sont fermés. Il vient des mêmes données que les camemberts : rien à écrire en plus. */
function TableauChiffres({ nom, lignes, details, annee }: { nom: string; lignes: Part[]; details?: Record<string, Detail>; annee: number }) {
  const rangs = aplatir(lignes, details);
  return (
    <details className="dos-tab">
      <summary>Voir tous les chiffres en tableau</summary>
      <div className="dos-tab-c">
        <table>
          <caption>{nom}</caption>
          <thead>
            <tr>
              <th scope="col">Poste</th>
              <th scope="col">Montant</th>
              <th scope="col">Part</th>
              <th scope="col">Taux</th>
              <th scope="col">Ce que c'est</th>
            </tr>
          </thead>
          <tbody>
            {rangs.map((r, i) => (
              <tr key={`${i}-${r.nom}`} className={r.niveau > 0 ? "dos-tab-dont" : "dos-tab-poste"}>
                <th scope="row">
                  {r.niveau > 0 && <span aria-hidden="true">{r.niveau > 1 ? "↳ ↳ " : "↳ "}</span>}
                  {r.nom}
                  {r.parent && r.niveau === 1 && <small> dans {r.parent}</small>}
                </th>
                <td>{mdAuto(Math.abs(r.md), annee)}</td>
                <td>{r.base > 0 ? `${nf((Math.abs(r.md) / r.base) * 100)} %` : ""}</td>
                <td>{r.taux ?? ""}</td>
                <td>{r.texte ? avecMontants(r.texte, annee) : r.note ? avecMontants(r.note, annee) : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

export function Repartition({
  lignes,
  nom,
  negatif = false,
  details,
  annee = 2025,
  idBase,
  familles,
}: {
  lignes: LigneRepartition[];
  nom: string;
  negatif?: boolean;
  details?: Record<string, Detail>;
  /** L'année des montants : c'est le taux de change de cette année qui les convertit. */
  annee?: number;
  /** Le préfixe des ancres des lignes (`#recettes-tva`). Par défaut, le nom de la répartition. */
  idBase?: string;
  /** Les grandes familles de lignes (jusqu'à trois) : leur couleur se lit sur la barre et sur chaque ligne (`famille` : 0, 1 ou 2). */
  familles?: FamilleRepartition[];
}) {
  const positives = lignes.filter((l) => l.md > 0);
  const somme = positives.reduce((t, l) => t + l.md, 0);
  const [actif, setActif] = useState<number | null>(null);
  const [ouvert, setOuvert] = useState<string | null>(null);
  const identifiant = useId();
  const base = idBase ?? slug(nom);

  /* Une adresse comme `#recettes-publiques-tva` ouvre la ligne et y amène le lecteur. */
  useEffect(() => {
    const ouvre = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      const ligne = lignes.find((l) => `${base}-${slug(l.nom)}` === h);
      if (!ligne || !details?.[ligne.nom]) return;
      setOuvert(ligne.nom);
      window.setTimeout(() => document.getElementById(h)?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
    };
    ouvre();
    window.addEventListener("hashchange", ouvre);
    return () => window.removeEventListener("hashchange", ouvre);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="dos-rep">
      {familles && familles.length > 0 && (
        <ul className="dos-fam" aria-label="Grandes familles">
          {familles.map((f, k) => (
            <li key={f.nom}>
              <i style={{ backgroundColor: `var(--fam${k % 3})` }} aria-hidden="true" />
              {f.nom}
            </li>
          ))}
        </ul>
      )}
      <div className="dos-pile-b" role="img" aria-label={nom}>
        {positives.map((l) => {
          const i = lignes.indexOf(l);
          return (
            <span
              key={l.nom}
              className={actif !== null && actif !== i ? "dos-seg-sombre" : undefined}
              style={{ flexGrow: l.md, backgroundColor: couleurDe(l, i) }}
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
                id={`${base}-${slug(l.nom)}`}
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
                <i style={{ backgroundColor: couleurDe(l, i) }} aria-hidden="true" />
                <span>
                  {l.nom}
                  {detail && <small className="dos-pile-chevron" aria-hidden="true">{estOuvert ? "−" : "+"}</small>}
                  {l.taux && <span className="dos-pile-taux"><Taux taux={l.taux} /></span>}
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
      <TableauChiffres nom={nom} lignes={lignes} details={details} annee={annee} />
    </div>
  );
}

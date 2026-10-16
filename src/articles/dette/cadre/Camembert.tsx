"use client";

import { useMemo, useState } from "react";
import { completer, type Bareme as BaremeT, type Part, type Vue } from "./ventilation";
import { montant, nf } from "./montants";

/** Un camembert qui se lit comme « Qui détient la dette française » : l'anneau à gauche,
 *  la légende à droite (nom, montant, part), le survol allume la part dans les deux.
 *
 *    <Camembert vue={{ parts: [{ nom: "TVA", md: 208.8, taux: "2,1 à 20 %" }, …], total: 884.9 }} />
 *
 *  Quand une part a des « dont » (`enfants`), un clic ouvre leur liste sous le camembert, sur toute
 *  la largeur : un nom, → son taux en bleu, son montant, sa part. Les « dont » ne sont pas dans l'anneau. */

const TEINTES = ["var(--cam0)", "var(--cam1)", "var(--cam2)", "var(--cam3)", "var(--cam4)", "var(--cam5)", "var(--cam6)", "var(--cam7)", "var(--cam8)", "var(--cam9)"];
const teinte = (p: Part, i: number) => (p.reste ? "var(--cam-reste)" : TEINTES[i % TEINTES.length]);

const pct = (v: number, d: number) => {
  if (v > 0 && v < 0.1 && d > 0) return "< 0,1 %";
  return `${nf(v, d)} %`;
};

/** Un montant écrit dans un texte s'écrit `[[109]]` (ou `[[109|0]]` pour 0 décimale) : il est converti
 *  dans la monnaie du menu, comme tous les autres. Jamais de « 109 Md€ » tapé en dur. */
export function avecMontants(texte: string, annee = 2025): string {
  return texte.replace(/\[\[(-?\d+(?:\.\d+)?)(?:\|(\d))?\]\]/g, (_, v: string, d?: string) => montant(Number(v), d === undefined ? 1 : Number(d), annee));
}

/** Un montant avec assez de décimales pour ne pas s'afficher « 0,0 » : trois sous 0,1 Md, deux sous 1 Md, une au-delà. */
export const mdAuto = (v: number, annee = 2025) => montant(v, Math.abs(v) < 0.1 ? 3 : Math.abs(v) < 1 ? 2 : 1, annee);

/** Le taux, en une courte ligne : une flèche bleue, puis « 20 % ». */
function Taux({ taux }: { taux: string }) {
  return (
    <span className="dos-taux">
      <i aria-hidden="true">→</i>
      {taux}
    </span>
  );
}

/** Un barème en barres (tranches de l'impôt sur le revenu…) : plus la barre est longue, plus le taux est haut. */
function Bareme({ bareme }: { bareme: BaremeT }) {
  const max = Math.max(...bareme.lignes.map((l) => l.taux ?? 0), 1);
  const avecBarres = bareme.lignes.some((l) => l.taux !== undefined);
  return (
    <div className="dos-bar">
      {bareme.titre && <p className="dos-bar-t">{bareme.titre}</p>}
      <ul>
        {bareme.lignes.map((l) => (
          <li key={l.libelle}>
            <span className="dos-bar-l">{l.libelle}</span>
            {avecBarres && <i style={{ width: `${l.taux ? Math.max(3, (l.taux / max) * 100) : 0}%` }} aria-hidden="true" />}
            <b>{l.texte}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Une ligne de la liste des « dont » : nom, → taux, montant, part du parent. */
function LigneDont({ p, base, annee, niveau = 0 }: { p: Part; base: number; annee: number; niveau?: number }) {
  const [bareme, setBareme] = useState(false);
  const sous = p.enfants ? completer(p.enfants, p.md).parts : [];
  return (
    <>
      <li className={`dos-dont${p.reste ? " dos-dont-reste" : ""}${niveau > 0 ? " dos-dont-sous" : ""}`}>
        <span className="dos-dont-n">
          {p.nom}
          {p.note && <small>{avecMontants(p.note, annee)}</small>}
        </span>
        <span className="dos-dont-t">
          {p.taux && <Taux taux={p.taux} />}
          {p.bareme && (
            <button type="button" className="dos-cam-voir" aria-expanded={bareme} onClick={() => setBareme(!bareme)}>
              {bareme ? "masquer" : "barème"}
            </button>
          )}
        </span>
        <b>{mdAuto(p.md, annee)}</b>
        <em>{base > 0 ? pct((p.md / base) * 100, 1) : ""}</em>
        {bareme && p.bareme && <div className="dos-dont-bar"><Bareme bareme={p.bareme} /></div>}
      </li>
      {sous.map((e) => (
        <LigneDont key={e.nom} p={e} base={p.md} annee={annee} niveau={niveau + 1} />
      ))}
    </>
  );
}

export function Camembert({ vue, annee = 2025 }: { vue: Vue; annee?: number }) {
  const { parts, base } = useMemo(() => completer(vue.parts, vue.total, vue.resteNom), [vue]);
  const [actif, setActif] = useState<number | null>(null);
  const [ouvert, setOuvert] = useState<number | null>(null);
  const dec = vue.pctDecimales ?? 1;
  if (parts.length === 0 || base <= 0) return null;
  const mdAff = (v: number) => mdAuto(v, annee);

  const R = 42;
  const C = 2 * Math.PI * R;
  let acc = 0;
  const arcs = parts.map((p, i) => {
    const long = (p.md / base) * C;
    const arc = { i, long, decal: -acc };
    acc += long;
    return arc;
  });
  const lu = actif === null ? null : parts[actif];
  const ouverte = ouvert === null ? null : parts[ouvert];
  const dont = ouverte?.enfants ? completer(ouverte.enfants, ouverte.md).parts : [];

  return (
    <div className="dos-cam">
      {vue.legende && <p className="dos-cam-legende">{vue.legende}</p>}
      <div className="dos-cam-anneau">
        <svg viewBox="0 0 100 100" role="img" aria-label={`Répartition : ${parts.map((p) => p.nom).join(", ")}`}>
          {arcs.map(({ i, long, decal }) => (
            <circle
              key={parts[i].nom}
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke={teinte(parts[i], i)}
              strokeWidth={actif === i || ouvert === i ? 14 : 11}
              strokeDasharray={`${Math.max(0, long - 0.8)} ${C}`}
              strokeDashoffset={decal}
              transform="rotate(-90 50 50)"
              className={actif !== null && actif !== i ? "dos-cam-arc dos-cam-arc-sombre" : "dos-cam-arc"}
              onPointerEnter={() => setActif(i)}
              onPointerLeave={() => setActif(null)}
              onClick={() => setActif(actif === i ? null : i)}
            />
          ))}
        </svg>
        <span className="dos-cam-centre" aria-live="polite">
          {lu ? (
            <>
              <b>{pct((lu.md / base) * 100, dec)}</b>
              <small>{lu.nom}</small>
            </>
          ) : (
            <>
              <b>{mdAff(base)}</b>
              <small>au total</small>
            </>
          )}
        </span>
      </div>

      <ul className="dos-cam-leg">
        {parts.map((p, i) => {
          const peutOuvrir = Boolean(p.enfants && p.enfants.length > 0);
          const estOuvert = ouvert === i;
          return (
            <li
              key={p.nom}
              className={`${actif === i ? "dos-cam-on" : ""}${p.reste ? " dos-cam-reste" : ""}${estOuvert ? " dos-cam-ouvert" : ""}`}
              onPointerEnter={() => setActif(i)}
              onPointerLeave={() => setActif(null)}
            >
              <span className="dos-cam-p" style={{ background: teinte(p, i) }} aria-hidden="true" />
              <div className="dos-cam-n">
                {peutOuvrir ? (
                  <button type="button" aria-expanded={estOuvert} onClick={() => setOuvert(estOuvert ? null : i)}>
                    {p.nom}
                    <span className="dos-cam-chev" aria-hidden="true">{estOuvert ? "−" : "+"}</span>
                  </button>
                ) : (
                  <span>{p.nom}</span>
                )}
                {p.note && <small>{avecMontants(p.note, annee)}</small>}
                {p.taux && <Taux taux={p.taux} />}
              </div>
              <b>{mdAff(p.md)}</b>
              <em>{pct((p.md / base) * 100, dec)}</em>
            </li>
          );
        })}
      </ul>

      {ouverte && dont.length > 0 && (
        <div className="dos-cam-dont">
          <p className="dos-cam-dont-t">
            Dans « {ouverte.nom} » <span>{mdAff(ouverte.md)}</span>
          </p>
          <ul>
            {dont.map((e) => (
              <LigneDont key={e.nom} p={e} base={ouverte.md} annee={annee} />
            ))}
          </ul>
          {ouverte.precisionDont && <p className="dos-cam-dont-p">{avecMontants(ouverte.precisionDont, annee)}</p>}
        </div>
      )}

      {vue.precision && <p className="dos-cam-precision">{avecMontants(vue.precision, annee)}</p>}
    </div>
  );
}

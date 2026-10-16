"use client";

import { useMemo, useState } from "react";
import { completer, type Part, type Vue } from "./ventilation";
import { montant, nf } from "./montants";

/** Un camembert qui se lit comme « Qui détient la dette française » : l'anneau à gauche,
 *  la légende à droite (nom, montant, part), le survol allume la part dans les deux.
 *
 *    <Camembert vue={{ parts: [{ nom: "TVA", md: 208.8 }, …], total: 884.9 }} />
 *
 *  Les « dont » (`enfants`) s'ouvrent sous leur part ; ils ne sont pas dans l'anneau. */

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

function Sous({ parts, total, annee }: { parts: Part[]; total: number; annee: number }) {
  const { parts: liste } = completer(parts, total);
  return (
    <ul className="dos-cam-sous">
      {liste.map((p) => (
        <li key={p.nom} className={p.reste ? "dos-cam-reste" : undefined}>
          <span>
            {p.nom}
            {p.note && <small>{avecMontants(p.note, annee)}</small>}
          </span>
          <b>{montant(p.md, 1, annee)}</b>
          {p.enfants && p.enfants.length > 0 && <Sous parts={p.enfants} total={p.md} annee={annee} />}
        </li>
      ))}
    </ul>
  );
}

export function Camembert({ vue, annee = 2025 }: { vue: Vue; annee?: number }) {
  const mdAff = (v: number) => montant(v, 1, annee);
  const { parts, base, exces } = useMemo(() => completer(vue.parts, vue.total, vue.resteNom), [vue]);
  const [actif, setActif] = useState<number | null>(null);
  const [ouvert, setOuvert] = useState<number | null>(null);
  const dec = vue.pctDecimales ?? 1;
  if (parts.length === 0 || base <= 0) return null;

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

  return (
    <div className="dos-cam">
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
              strokeWidth={actif === i ? 14 : 11}
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
              className={`${actif === i ? "dos-cam-on" : ""}${p.reste ? " dos-cam-reste" : ""}`}
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
                {estOuvert && p.enfants && <Sous parts={p.enfants} total={p.md} annee={annee} />}
              </div>
              <b>{mdAff(p.md)}</b>
              <em>{pct((p.md / base) * 100, dec)}</em>
            </li>
          );
        })}
      </ul>

      {(vue.precision || exces > 0) && (
        <p className="dos-cam-precision">
          {vue.precision && avecMontants(vue.precision, annee)}
          {exces > 0 && ` Les montants sont arrondis : leur somme (${mdAff(base)}) dépasse de ${mdAff(exces)} le total publié, et les parts se lisent sur cette somme.`}
        </p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  DETENTEURS,
} from "@/articles/dette/france/donnees/detteFrancaise";
import {
  NON_RESIDENTS_SERIE,
  PORTEURS,
  PORTEURS_PAR_TITRE,
} from "@/articles/dette/france/donnees/financesPubliques";
import { enLettres as mdMots, useVu } from "@/articles/dette/cadre";
import { Donnees } from "./Donnees";
import { Etiquette } from "./Composition";
import { useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   QUI DÉTIENT LA DETTE

   `Porteurs` : l'anneau des détenteurs de la dette négociable de l'État,
   son évolution depuis 2022 et la matrice par type de titre.
   `Detenteurs` : les cartes qui présentent chaque famille d'investisseurs.
   ═══════════════════════════════════════════════════════════════════════════ */

const pct = (v: number, d = 1) =>
  `${v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d })} %`;

export function Porteurs() {
  const [info, setInfo] = useState(false);
  const [serie, setSerie] = useState(false);
  /* La part survolée ou choisie : l'anneau la détache, le centre la nomme et
     la ligne de la légende s'allume. Au repos, c'est la première. */
  const [actif, setActif] = useState<number | null>(null);
  const { ref, vu } = useVu<HTMLDivElement>(90);
  const lu = PORTEURS[actif ?? 0];

  /* Un anneau en arcs SVG, un par part : chacun reçoit le survol et le clic. */
  const R = 42;
  const C = 2 * Math.PI * R;
  let acc = 0;
  const arcs = PORTEURS.map((p, i) => {
    const long = (p.pct / 100) * C;
    const arc = { i, long, decal: -acc };
    acc += long;
    return arc;
  });

  return (
    <div className="dp-porteurs" ref={ref} data-vu={vu ? "1" : "0"}>
      <div className="dp-anneau-w">
        <svg className="dp-anneau-svg" viewBox="0 0 100 100" role="img" aria-label="Répartition des détenteurs de la dette de l'État">
          {arcs.map(({ i, long, decal }) => (
            <circle
              key={PORTEURS[i].nom}
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke={`var(--c${i})`}
              strokeWidth={actif === i ? 14 : 11}
              strokeDasharray={`${Math.max(0, long - 0.8)} ${C}`}
              strokeDashoffset={decal}
              transform="rotate(-90 50 50)"
              className={`dp-arc${actif !== null && actif !== i ? " dp-arc-sombre" : ""}`}
              onPointerEnter={() => setActif(i)}
              onPointerLeave={() => setActif(null)}
              onClick={() => setActif(actif === i ? null : i)}
            />
          ))}
        </svg>
        <span className="dp-anneau-c" aria-live="polite">
          <b>{pct(lu.pct)}</b>
          {lu.nom}
        </span>
      </div>
      <ul className="dp-porteurs-l">
        {PORTEURS.map((p, i) => (
          <li
            key={p.nom}
            style={{ "--i": i } as React.CSSProperties}
            className={actif === i ? "dp-porteurs-on" : undefined}
            onPointerEnter={() => setActif(i)}
            onPointerLeave={() => setActif(null)}
          >
            <span className="dp-porteurs-p" aria-hidden="true" />
            <span className="dp-porteurs-n">{p.nom}</span>
            <b>{pct(p.pct)}</b>
            {p.info && (
              <button type="button" className="dp-info" aria-expanded={info} onClick={() => setInfo((v) => !v)}>
                Qu&apos;est-ce qu&apos;un non-résident ?
              </button>
            )}
          </li>
        ))}
      </ul>
      {info && <p className="dp-garde">{PORTEURS[0].info}</p>}

      <button type="button" className="dp-bouton" onClick={() => setSerie((s) => !s)} aria-expanded={serie}>
        {serie ? "Masquer l'évolution" : "Voir l'évolution depuis 2022"}
      </button>
      <figure className="dp-serie" hidden={!serie}>
          <figcaption>La part détenue par des non-résidents est remontée depuis 2022.</figcaption>
          <svg viewBox="0 0 100 34" preserveAspectRatio="none" role="img" aria-label="Part des non-résidents, de décembre 2022 à mars 2026">
            <path
              d={NON_RESIDENTS_SERIE.map((p, i) => {
                const x = (i / (NON_RESIDENTS_SERIE.length - 1)) * 100;
                const y = 32 - ((p.pct - 49) / 9.5) * 28;
                return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
              }).join(" ")}
              fill="none"
              stroke="#7cc0ff"
              strokeWidth="1.6"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
            />
          </svg>
          <div className="dp-serie-x">
            <span>{NON_RESIDENTS_SERIE[0].periode} · {pct(NON_RESIDENTS_SERIE[0].pct, 2)}</span>
            <span>
              {NON_RESIDENTS_SERIE[NON_RESIDENTS_SERIE.length - 1].periode} ·{" "}
              {pct(NON_RESIDENTS_SERIE[NON_RESIDENTS_SERIE.length - 1].pct, 2)}
            </span>
          </div>
          <Donnees
            titre="Part des non-résidents dans la dette négociable de l'État"
            colonnes={["Trimestre", "Part (%)"]}
            lignes={NON_RESIDENTS_SERIE.map((p) => [p.periode, pct(p.pct, 2)])}
          />
      </figure>

      <h4 className="dp-ouva-t">Qui détient quel type de titre ?</h4>
      <table className="dp-matrice">
        <caption>Répartition des détenteurs par type de titre, T1 2026</caption>
        <thead>
          <tr>
            <th scope="col">Titre</th>
            <th scope="col">Résidents</th>
            <th scope="col">Non-résidents</th>
          </tr>
        </thead>
        <tbody>
          {PORTEURS_PAR_TITRE.map((t) => (
            <tr key={t.titre}>
              <th scope="row">
                {t.titre}
                {t.note && <i>{t.note}</i>}
              </th>
              <td>{pct(t.residents)}</td>
              <td>{pct(t.nonResidents)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="dp-texte">
        La structure des détenteurs dépend donc aussi du type de titre. Les BTF, titres de court
        terme, sont très majoritairement détenus par des non-résidents au T1 2026, tandis que les
        obligations indexées sur l&apos;inflation présentent une structure différente.
      </p>

      <div className="dp-garde">
        <p>
          Cette répartition concerne les titres de la <b>dette négociable de l&apos;État</b>,
          exprimés en valeur de marché. Elle ne correspond pas directement aux {mdMots(3536, 0)}
          de dette publique de Maastricht.
        </p>
      </div>
      <Etiquette perimetre="STATE_NEGOTIABLE_DEBT" base="NATIONAL_FINANCIAL_STATISTICS" periode="T1 2026" />
    </div>
  );
}

export function Detenteurs() {
  const rail = useRef<HTMLDivElement>(null);
  const prise = useRef<{ x: number; g: number } | null>(null);
  return (
    <div
      ref={rail}
      className="dp-rail"
      onPointerDown={(e) => {
        prise.current = { x: e.clientX, g: e.currentTarget.scrollLeft };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!prise.current || !rail.current) return;
        rail.current.scrollLeft = prise.current.g - (e.clientX - prise.current.x);
      }}
      onPointerUp={() => (prise.current = null)}
      onPointerCancel={() => (prise.current = null)}
    >
      {DETENTEURS.map((d) => (
        <article key={d.nom} className="dp-det">
          <h3>{d.nom}</h3>
          <p>{d.texte}</p>
        </article>
      ))}
    </div>
  );
}

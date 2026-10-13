"use client";

import { useState } from "react";
import {
  DETTE_PAR_EMETTEUR,
  DETTE_PAR_INSTRUMENT,
  LIBELLE_BASE,
  LIBELLE_PERIMETRE,
  type BaseComptable,
  type Perimetre,
} from "@/articles/dette/france/donnees/financesPubliques";
import { montantAbs as md, useVu } from "@/articles/dette/cadre";

/* ═══════════════════════════════════════════════════════════════════════════
   QUI PORTE LA DETTE, ET SOUS QUELLE FORME

   Deux figures du chapitre « Qui doit » : la dette par émetteur et par
   instrument (onglets), puis la différence entre dette brute et dette nette.
   Les montants passent par `montantAbs` : ils suivent la monnaie du menu.
   Style : classes `dp-*` de `figures.css`.
   ═══════════════════════════════════════════════════════════════════════════ */

const pct = (v: number, d = 1) =>
  `${v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d })} %`;

/** L'étiquette de périmètre, sous chaque visualisation complexe. */
export function Etiquette({
  perimetre,
  base,
  periode,
}: {
  perimetre: Perimetre;
  base: BaseComptable;
  periode: string;
}) {
  return (
    <p className="dp-perim">
      <span>Périmètre · {LIBELLE_PERIMETRE[perimetre]}</span>
      <span>{LIBELLE_BASE[base]}</span>
      <span className="dp-perim-d">{periode}</span>
    </p>
  );
}

export function CompositionDette() {
  const [vue, setVue] = useState<"emetteur" | "instrument">("emetteur");
  const { ref, vu } = useVu<HTMLDivElement>(90);
  return (
    <div className="dp-compo" ref={ref} data-vu={vu ? "1" : "0"}>
      <div className="dp-vues" role="tablist" aria-label="Composition de la dette">
        <button type="button" role="tab" aria-selected={vue === "emetteur"} onClick={() => setVue("emetteur")}>
          Par émetteur
        </button>
        <button type="button" role="tab" aria-selected={vue === "instrument"} onClick={() => setVue("instrument")}>
          Par instrument
        </button>
      </div>

      <ul className="dp-postes" hidden={vue !== "emetteur"}>
          {DETTE_PAR_EMETTEUR.map((e) => (
            <li key={e.nom}>
              <span className="dp-poste-b" style={{ "--p": `${e.pct}%` } as React.CSSProperties} aria-hidden="true" />
              <span className="dp-poste-n">{e.nom}</span>
              <span className="dp-poste-v">
                {md(e.md)}
                <i>≈ {pct(e.pct)}</i>
              </span>
            </li>
          ))}
      </ul>
      <div hidden={vue !== "instrument"}>
          <ul className="dp-postes">
            {DETTE_PAR_INSTRUMENT.map((p) => (
              <li key={p.nom}>
                <span className="dp-poste-b" style={{ "--p": `${p.part}%` } as React.CSSProperties} aria-hidden="true" />
                <span className="dp-poste-n">{p.nom}</span>
                <span className="dp-poste-v">
                  {md(p.md)}
                  <i>≈ {pct(p.part ?? 0)}</i>
                </span>
                {p.enfants && (
                  <ul className="dp-sous">
                    {p.enfants.map((e) => (
                      <li key={e.nom}>
                        {e.nom} <b>{md(e.md)}</b>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <p className="dp-texte">
            La dette publique française est donc essentiellement constituée de titres financiers
            négociables, et non de prêts bancaires classiques.
          </p>
      </div>
      <Etiquette perimetre="GENERAL_GOVERNMENT" base="MAASTRICHT" periode="T1 2026" />
    </div>
  );
}

export function BruteNette() {
  const [ouvert, setOuvert] = useState(false);
  return (
    <div className="dp-carte-x">
      <button type="button" aria-expanded={ouvert} onClick={() => setOuvert((o) => !o)}>
        Dette brute, dette nette : quelle différence ?
        <span aria-hidden="true">{ouvert ? "−" : "+"}</span>
      </button>
      <div className="dp-carte-xr" hidden={!ouvert}>
          <div className="dp-vs">
            <span>
              <b>{md(3536.1, 1)}</b>dette brute de Maastricht, T1 2026
            </span>
            <span>
              <b>{md(3301.1, 1)}</b>dette nette sur le même champ d&apos;instruments · 109,7 % du PIB
            </span>
          </div>
          <p>
            La mesure de Maastricht est une dette <b>brute</b> : elle ne soustrait pas les actifs
            financiers détenus par les administrations publiques. Une mesure nette peut donc être
            calculée, mais elle ne constitue pas pour autant une mesure exhaustive de la valeur
            nette du patrimoine public.
          </p>
          <p className="dp-note">
            Ce ne sont pas « la fausse » et « la vraie » dette : ce sont deux indicateurs
            différents.
          </p>
      </div>
    </div>
  );
}

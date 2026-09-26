"use client";

import { useState } from "react";
import {
  ACTEURS_2025,
  DEFICIT_2025,
  DEFICIT_PAR_ACTEUR,
  DEPENSES_2025,
  DEPENSES_FONCTION,
  DEPENSES_FONCTION_TOTAL,
  DEPENSES_NATURE,
  DETTE_PAR_EMETTEUR,
  DETTE_PAR_INSTRUMENT,
  ETAT_CHAINE,
  ETAT_DEPENSES,
  ETAT_SOLDE,
  IMPOTS_FAMILLES,
  LIBELLE_BASE,
  LIBELLE_PERIMETRE,
  MISSIONS_2025,
  NON_RESIDENTS_SERIE,
  PORTEURS,
  PORTEURS_PAR_TITRE,
  RECETTES_2025,
  RECETTES_DETAIL,
  SOURCE_FONCTION,
  type Mesure,
  type Perimetre,
  type BaseComptable,
} from "@/data/articles/financesPubliques";
import { Donnees, useVu } from "./pieces";

/* ═══════════════════════════════════════════════════════════════════════════
   LES FINANCES PUBLIQUES, PAR PALIERS

   Par défaut, le lecteur voit ce qui est indispensable. Tout le reste
   s'ouvre : un clic sur un poste, un changement de vue, un repli. Plus de
   profondeur, pas plus de bruit.

   Chaque visualisation porte son étiquette de périmètre. Personne ne doit
   pouvoir regarder un graphique sans savoir de quoi il parle.
   ═══════════════════════════════════════════════════════════════════════════ */

const md = (v: number, d = 1) =>
  `${Math.abs(v).toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d })} Md€`;
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

export function SourceM({ m }: { m: Mesure }) {
  return (
    <a className="dp-src" href={m.url} target="_blank" rel="noopener noreferrer">
      Source : {m.source}
      {m.statut ? ` · ${m.statut}` : ""}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}

/* ── L'année 2025 : ce qui entre, ce qui sort, ce qui manque ───────────── */

export function AnneeReelle() {
  const { ref, vu } = useVu<HTMLDivElement>(100);
  const max = Math.max(RECETTES_2025.valeur, DEPENSES_2025.valeur);
  return (
    <div className="dp-annee" ref={ref} data-vu={vu ? "1" : "0"}>
      <div className="dp-annee-l">
        <span className="dp-annee-n">≈ {md(RECETTES_2025.valeur, 0)}</span>
        <span className="dp-annee-t">de recettes publiques</span>
        <span
          className="dp-annee-b dp-annee-r"
          style={{ "--p": `${(RECETTES_2025.valeur / max) * 100}%` } as React.CSSProperties}
          aria-hidden="true"
        />
      </div>
      <div className="dp-annee-l">
        <span className="dp-annee-n">≈ {md(DEPENSES_2025.valeur, 0)}</span>
        <span className="dp-annee-t">de dépenses publiques</span>
        <span
          className="dp-annee-b dp-annee-d"
          style={{ "--p": `${(DEPENSES_2025.valeur / max) * 100}%` } as React.CSSProperties}
          aria-hidden="true"
        />
      </div>
      <div className="dp-annee-e">
        <span className="dp-annee-ev">{md(DEFICIT_2025.valeur)}</span>
        <span className="dp-annee-et">déficit public 2025 · 5,1 % du PIB</span>
      </div>
      <Etiquette perimetre="GENERAL_GOVERNMENT" base="NATIONAL_ACCOUNTS" periode="2025" />
    </div>
  );
}

/* ── D'où vient l'argent ───────────────────────────────────────────────── */

export function Recettes() {
  const [ouvert, setOuvert] = useState(false);
  const [famille, setFamille] = useState<number | null>(null);
  const total = RECETTES_2025.valeur;

  return (
    <div className="dp-bloc">
      <button type="button" className="dp-ouvreur" aria-expanded={ouvert} onClick={() => setOuvert((o) => !o)}>
        <span className="dp-ouvreur-n">≈ {md(total, 0)}</span>
        <span className="dp-ouvreur-t">
          D&apos;où viennent les recettes publiques ?
          <span className="dp-ouvreur-s">{ouvert ? "Replier" : "Ouvrir la décomposition"}</span>
        </span>
      </button>

      <div className="dp-deploie" hidden={!ouvert}>
          <p className="dp-texte">
            Les administrations publiques ne se financent pas uniquement avec « les impôts ». Les
            recettes publiques réunissent des impôts, des cotisations sociales, des recettes issues
            de services ou de production, des revenus du patrimoine public et d&apos;autres
            ressources.
          </p>

          <ul className="dp-postes">
            {RECETTES_DETAIL.map((p) => {
              const impots = p.nom === "Impôts";
              return (
                <li key={p.nom} className={p.md < 0 ? "dp-poste-neg" : undefined}>
                  <span className="dp-poste-b" style={{ "--p": `${(Math.abs(p.md) / 900) * 100}%` } as React.CSSProperties} aria-hidden="true" />
                  <span className="dp-poste-n">{p.nom}</span>
                  <span className="dp-poste-v">
                    {p.md < 0 ? "−" : ""}
                    {md(p.md)}
                    {p.part ? <i>≈ {pct(p.part)}</i> : null}
                  </span>
                  {impots && (
                    <button
                      type="button"
                      className="dp-poste-p"
                      onClick={() => setFamille(famille === null ? 0 : null)}
                      aria-expanded={famille !== null}
                    >
                      {famille !== null ? "Replier" : "Détailler"}
                    </button>
                  )}
                  {p.note && <span className="dp-poste-no">{p.note}</span>}
                </li>
              );
            })}
          </ul>
          <p className="dp-note">
            Les légers écarts d&apos;addition proviennent notamment des arrondis et des conventions
            comptables.
          </p>

          <div className="dp-impots" hidden={famille === null}>
              <p className="dp-impots-t">Les 882 Md€ d&apos;impôts, par famille</p>
              <div className="dp-impots-f">
                {IMPOTS_FAMILLES.map((f, i) => (
                  <button
                    key={f.nom}
                    type="button"
                    className={famille === i ? "dp-impots-on" : undefined}
                    onClick={() => setFamille(i)}
                  >
                    <b>{md(f.md)}</b>
                    {f.nom}
                  </button>
                ))}
              </div>
              {IMPOTS_FAMILLES.map((f, i) => (
                <ul className="dp-impots-l" key={f.nom} hidden={famille !== i}>
                  {(f.enfants ?? []).map((e) => (
                    <li key={e.nom} style={{ "--p": `${(e.md / 210) * 100}%` } as React.CSSProperties}>
                      <span className="dp-impots-b" aria-hidden="true" />
                      <span>{e.nom}</span>
                      <b>{md(e.md)}</b>
                      {e.note && <i>{e.note}</i>}
                    </li>
                  ))}
                </ul>
              ))}
              <p className="dp-garde">
                Ce sont les <b>principaux</b> impôts, pas une liste à additionner pour retrouver les
                882 Md€ : certains appartiennent à des familles plus larges, et l&apos;énumération
                n&apos;est pas exhaustive.
              </p>
          </div>

          <Donnees
            titre="Recettes publiques 2025, par nature"
            colonnes={["Poste", "Montant (Md€)", "Part"]}
            lignes={RECETTES_DETAIL.map((p) => [p.nom, p.md.toLocaleString("fr-FR"), p.part ? pct(p.part) : "n.d."])}
          />
          <Etiquette perimetre="GENERAL_GOVERNMENT" base="NATIONAL_ACCOUNTS" periode="2025" />
          <SourceM m={RECETTES_2025} />
      </div>
    </div>
  );
}

/* ── Prélèvements obligatoires ≠ recettes publiques ────────────────────── */

export function Prelevements() {
  const [ouvert, setOuvert] = useState(false);
  return (
    <div className="dp-carte-x">
      <button type="button" aria-expanded={ouvert} onClick={() => setOuvert((o) => !o)}>
        1 562 Md€ de recettes, mais 1 305 Md€ de prélèvements obligatoires. Pourquoi ?
        <span aria-hidden="true">{ouvert ? "−" : "+"}</span>
      </button>
      <div className="dp-carte-xr" hidden={!ouvert}>
          <p>
            Parce que toutes les recettes publiques ne sont pas des prélèvements obligatoires. Les
            administrations publiques disposent également de recettes de production, de revenus de
            la propriété et d&apos;autres ressources.
          </p>
          <div className="dp-vs">
            <span>
              <b>1 305 Md€</b>prélèvements obligatoires 2025
            </span>
            <span>
              <b>≈ 1 562 Md€</b>ensemble des recettes publiques 2025
            </span>
          </div>
          <Etiquette perimetre="GENERAL_GOVERNMENT" base="NATIONAL_ACCOUNTS" periode="2025" />
      </div>
    </div>
  );
}

/* ── Où va l'argent : trois lectures ───────────────────────────────────── */

export function OuVaLArgent() {
  const [vue, setVue] = useState<"nature" | "fonction" | "administration">("fonction");
  const [tout, setTout] = useState(false);
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [acteur, setActeur] = useState<number | null>(null);

  /* Les dix fonctions sont toujours rendues ; les cinq dernières sont
     repliées tant qu'on ne les demande pas. */
  const fonctions = DEPENSES_FONCTION;
  const maxF = DEPENSES_FONCTION[0].md;

  return (
    <div className="dp-ouva">
      <div className="dp-vues" role="tablist" aria-label="Lecture des dépenses">
        {([
          ["nature", "Par nature"],
          ["fonction", "Par fonction"],
          ["administration", "Par administration"],
        ] as const).map(([k, l]) => (
          <button key={k} type="button" role="tab" aria-selected={vue === k} onClick={() => setVue(k)}>
            {l}
          </button>
        ))}
      </div>
      <p className="dp-note">
        Ces trois lectures décrivent les mêmes finances publiques sous trois angles différents.
        Elles ne doivent pas être additionnées entre elles.
      </p>

      <div className="dp-deploie" hidden={vue !== "nature"}>
          <h3 className="dp-ouva-t">Comment dépense-t-on 1 714 milliards d&apos;euros ?</h3>
          <ul className="dp-postes">
            {DEPENSES_NATURE.map((p) => (
              <li key={p.nom}>
                <span className="dp-poste-b" style={{ "--p": `${(p.md / 780) * 100}%` } as React.CSSProperties} aria-hidden="true" />
                <span className="dp-poste-n">{p.nom}</span>
                <span className="dp-poste-v">{md(p.md)}</span>
                {p.enfants && (
                  <ul className="dp-sous">
                    {p.enfants.map((e) => (
                      <li key={e.nom}>
                        {e.nom} <b>{md(e.md)}</b>
                      </li>
                    ))}
                  </ul>
                )}
                {p.note && <span className="dp-poste-no">{p.note}</span>}
              </li>
            ))}
          </ul>
          <p className="dp-note">
            Les rémunérations et les consommations intermédiaires sont des composants du
            fonctionnement : elles ne s&apos;y ajoutent pas une seconde fois.
          </p>
          <p className="dp-texte">
            Près de 45 % de la dépense publique correspond ainsi à des prestations sociales. Les
            rémunérations représentent 370 milliards d&apos;euros, tandis que l&apos;investissement
            public atteint environ 132 milliards.
          </p>
          <Etiquette perimetre="GENERAL_GOVERNMENT" base="NATIONAL_ACCOUNTS" periode="2025" />
          <SourceM m={DEPENSES_2025} />
        </div>

      <div className="dp-deploie" hidden={vue !== "fonction"}>
          <p className="dp-avert">
            Dernière ventilation fonctionnelle complète disponible : <b>2024</b>. Elle n&apos;est
            pas extrapolée à 2025.
          </p>
          <h3 className="dp-ouva-t">
            Sur {DEPENSES_FONCTION_TOTAL.toLocaleString("fr-FR")} Md€ de dépenses publiques en
            2024…
          </h3>
          <ul className="dp-fonctions">
            {fonctions.map((f, i) => (
              <li key={f.nom} hidden={!tout && i >= 5}>
                <button
                  type="button"
                  className={ouvert === f.nom ? "dp-fonction-on" : undefined}
                  onClick={() => setOuvert(ouvert === f.nom ? null : f.nom)}
                  aria-expanded={ouvert === f.nom}
                  style={{ "--p": `${(f.md / maxF) * 100}%` } as React.CSSProperties}
                >
                  <span className="dp-fonction-b" aria-hidden="true" />
                  <span className="dp-fonction-n">{f.nom}</span>
                  <span className="dp-fonction-v">
                    {md(f.md, 0)}
                    {f.pct ? <i>{f.pct} %</i> : null}
                  </span>
                </button>
                <div className="dp-fonction-r" hidden={ouvert !== f.nom}>
                    {f.detail && <p>{f.detail}</p>}
                    {f.sous && (
                      <ul className="dp-sous">
                        {f.sous.map((s) => (
                          <li key={s.nom}>
                            {s.nom} <b>{md(s.md, 0)}</b>
                          </li>
                        ))}
                      </ul>
                    )}
                    {f.sous && (
                      <p className="dp-note">
                        Ces éléments ne résument pas l&apos;ensemble de la fonction : ils en
                        éclairent quelques composantes.
                      </p>
                    )}
                </div>
              </li>
            ))}
          </ul>
          {!tout && (
            <button type="button" className="dp-bouton" onClick={() => setTout(true)}>
              Voir les dix fonctions
            </button>
          )}
          <Donnees
            titre="Dépenses publiques par fonction, 2024"
            colonnes={["Fonction", "Montant (Md€)", "Part"]}
            lignes={DEPENSES_FONCTION.map((f) => [f.nom, f.md.toLocaleString("fr-FR"), f.pct ? `${f.pct} %` : "n.d."])}
          />
          <Etiquette perimetre="GENERAL_GOVERNMENT" base="NATIONAL_ACCOUNTS" periode="2024" />
          <a className="dp-src" href={SOURCE_FONCTION.url} target="_blank" rel="noopener noreferrer">
            Source : {SOURCE_FONCTION.source} ↗
          </a>
        </div>

      <div className="dp-deploie" hidden={vue !== "administration"}>
          <h3 className="dp-ouva-t">Qui gère réellement l&apos;argent public ?</h3>
          <div className="dp-acteurs">
            {ACTEURS_2025.map((a, i) => (
              <button
                key={a.nom}
                type="button"
                className={acteur === i ? "dp-acteur-on" : undefined}
                onClick={() => setActeur(acteur === i ? null : i)}
                aria-expanded={acteur === i}
              >
                <span className="dp-acteur-n">{a.nom}</span>
                <span className="dp-acteur-c">
                  <i>Dépenses</i>
                  <b>{md(a.depenses)}</b>
                </span>
                <span className="dp-acteur-c">
                  <i>Recettes</i>
                  <b>{md(a.recettes)}</b>
                </span>
                <span className="dp-acteur-s">{md(a.solde)} de solde</span>
              </button>
            ))}
          </div>
          {ACTEURS_2025.map((a, i) => (
            <div className="dp-fonction-r" key={a.nom} hidden={acteur !== i}>
              {a.detail && <p>{a.detail}</p>}
              {a.lignes && (
                <ul className="dp-sous">
                  {a.lignes.map((l) => (
                    <li key={l.nom}>
                      {l.nom} <b>{md(l.md)}</b>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <div className="dp-garde">
            <p>
              681,1 + 335,5 + 803,3 dépasse 1 714 Md€, et ce n&apos;est pas une erreur. Les
              administrations publiques se transfèrent aussi de l&apos;argent entre elles :
              lorsqu&apos;on calcule le total de la dépense publique française, ces flux internes
              sont consolidés afin de ne pas compter deux fois le même euro.
            </p>
          </div>
          <Etiquette perimetre="GENERAL_GOVERNMENT" base="NATIONAL_ACCOUNTS" periode="2025" />
      </div>
    </div>
  );
}

/* ── Le zoom budget de l'État ──────────────────────────────────────────── */

export function ZoomEtat() {
  const [ouvert, setOuvert] = useState(false);
  return (
    <div className="dp-bloc">
      <button type="button" className="dp-ouvreur" aria-expanded={ouvert} onClick={() => setOuvert((o) => !o)}>
        <span className="dp-ouvreur-n">Zoom</span>
        <span className="dp-ouvreur-t">
          Et si l&apos;on regarde uniquement l&apos;État ?
          <span className="dp-ouvreur-s">On change de périmètre et de comptabilité</span>
        </span>
      </button>
      <div className="dp-deploie" hidden={!ouvert}>
          <ol className="dp-chaine-b">
            {ETAT_CHAINE.map((e) => (
              <li key={e.nom} className={e.signe === -1 ? "dp-chaine-m" : e.signe === 0 ? "dp-chaine-s" : undefined}>
                <b>
                  {e.signe === -1 ? "−" : e.signe === 1 ? "+" : ""}
                  {md(e.md, Number.isInteger(e.md * 10) ? 1 : 2)}
                </b>
                <span>{e.nom}</span>
              </li>
            ))}
          </ol>

          <h4 className="dp-ouva-t">Les principales missions exécutées en 2025</h4>
          <ul className="dp-postes">
            {MISSIONS_2025.map((m) => (
              <li key={m.nom}>
                <span className="dp-poste-b" style={{ "--p": `${(m.md / 90) * 100}%` } as React.CSSProperties} aria-hidden="true" />
                <span className="dp-poste-n">{m.nom}</span>
                <span className="dp-poste-v">{md(m.md)}</span>
                {m.enfants && (
                  <ul className="dp-sous">
                    {m.enfants.map((e) => (
                      <li key={e.nom}>
                        dont {e.nom} <b>{md(e.md)}</b>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <p className="dp-note">
            Il s&apos;agit des principales missions budgétaires, et non de l&apos;intégralité des
            dépenses publiques françaises.
          </p>

          <div className="dp-solde">
            <p>
              <b>318,7 Md€</b> de recettes nettes, <b>{md(ETAT_DEPENSES.valeur)}</b> de dépenses
              nettes, puis comptes spéciaux et budgets annexes.
            </p>
            <p className="dp-solde-v">{md(ETAT_SOLDE.valeur)} de solde budgétaire de l&apos;État</p>
          </div>
          <div className="dp-garde">
            <p>
              Ce déficit budgétaire de l&apos;État n&apos;est pas identique au déficit public de{" "}
              {md(Math.abs(DEFICIT_2025.valeur))} : ce dernier porte sur l&apos;ensemble des
              administrations publiques et se mesure selon les règles de la comptabilité nationale.
            </p>
          </div>
          <Etiquette perimetre="STATE" base="BUDGETARY_ACCOUNTING" periode="2025" />
          <SourceM m={ETAT_DEPENSES} />
      </div>
    </div>
  );
}

/* ── Pourquoi la TVA n'a pas le même montant selon l'endroit ───────────── */

export function TvaDeuxMesures() {
  const [ouvert, setOuvert] = useState(false);
  return (
    <div className="dp-carte-x">
      <button type="button" aria-expanded={ouvert} onClick={() => setOuvert((o) => !o)}>
        Pourquoi la TVA vaut 208,8 Md€ ici et 98,1 Md€ là ?
        <span aria-hidden="true">{ouvert ? "−" : "+"}</span>
      </button>
      <div className="dp-carte-xr" hidden={!ouvert}>
          <div className="dp-vs">
            <span>
              <b>208,8 Md€</b>comptes nationaux, toutes administrations publiques, 2025
            </span>
            <span>
              <b>≈ 98,1 Md€</b>recettes fiscales nettes du budget de l&apos;État, 2025
            </span>
          </div>
          <p>
            Ce n&apos;est pas une contradiction. Une même recette fiscale peut être répartie entre
            plusieurs administrations, et les règles de comptabilisation diffèrent entre
            comptabilité nationale et comptabilité budgétaire.
          </p>
          <p className="dp-note">
            La différence entre les deux ne se soustrait pas : 208,8 − 98,1 ne donne pas « la TVA
            donnée ailleurs », parce que les deux mesures ne sont pas construites sur le même
            périmètre.
          </p>
      </div>
    </div>
  );
}

/* ── Qui crée le déficit ───────────────────────────────────────────────── */

export function Waterfall() {
  const { ref, vu } = useVu<HTMLDivElement>(100);
  const max = Math.max(...DEFICIT_PAR_ACTEUR.map((d) => Math.abs(d.md)));
  return (
    <div className="dp-water" ref={ref} data-vu={vu ? "1" : "0"}>
      {DEFICIT_PAR_ACTEUR.map((d, i) => (
        <div key={d.nom} className="dp-water-l" style={{ "--i": i } as React.CSSProperties}>
          <span className="dp-water-n">{d.nom}</span>
          <span
            className="dp-water-b"
            style={{ "--p": `${(Math.abs(d.md) / max) * 100}%` } as React.CSSProperties}
            aria-hidden="true"
          />
          <span className="dp-water-v">{md(d.md)}</span>
        </div>
      ))}
      <div className="dp-water-t">
        <span>Total</span>
        <b>{md(DEFICIT_2025.valeur)}</b>
      </div>
      <p className="dp-texte">
        En 2025, l&apos;État représente donc la majeure partie du besoin de financement public. Cela
        ne signifie pas qu&apos;il représente toute la dépense publique : déficit et niveau de
        dépense sont deux choses différentes.
      </p>
      <Etiquette perimetre="GENERAL_GOVERNMENT" base="NATIONAL_ACCOUNTS" periode="2025" />
    </div>
  );
}

/* ── Qui porte la dette, et sous quelle forme ──────────────────────────── */

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
              <b>3 536,1 Md€</b>dette brute de Maastricht, T1 2026
            </span>
            <span>
              <b>3 301,1 Md€</b>dette nette sur le même champ d&apos;instruments · 109,7 % du PIB
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

/* ── Les détenteurs de la dette négociable ─────────────────────────────── */

export function Porteurs() {
  const [info, setInfo] = useState(false);
  const [serie, setSerie] = useState(false);
  const { ref, vu } = useVu<HTMLDivElement>(90);
  /* Un anneau en conic-gradient : cinq parts qui font exactement 100 %, et
     aucune bibliothèque pour le tracer. */
  let acc = 0;
  const parts = PORTEURS.map((p, i) => {
    const debut = acc;
    acc += p.pct;
    return `var(--c${i}) ${debut}% ${acc}%`;
  }).join(", ");

  return (
    <div className="dp-porteurs" ref={ref} data-vu={vu ? "1" : "0"}>
      {/* Le libellé est posé à côté de l'anneau, pas dedans : le masque qui
          creuse le disque découperait aussi son propre contenu. */}
      <div className="dp-anneau-w">
        <div className="dp-anneau" aria-hidden="true" style={{ "--parts": parts } as React.CSSProperties} />
        <span className="dp-anneau-c" aria-hidden="true">
          <b>57,5 %</b>
          non-résidents
        </span>
      </div>
      <ul className="dp-porteurs-l">
        {PORTEURS.map((p, i) => (
          <li key={p.nom} style={{ "--i": i } as React.CSSProperties}>
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
          exprimés en valeur de marché. Elle ne correspond pas directement aux 3 536 milliards
          d&apos;euros de dette publique de Maastricht.
        </p>
      </div>
      <Etiquette perimetre="STATE_NEGOTIABLE_DEBT" base="NATIONAL_FINANCIAL_STATISTICS" periode="T1 2026" />
    </div>
  );
}

/* ── Le zoom Sécurité sociale ──────────────────────────────────────────── */

export function ZoomSecu() {
  const [ouvert, setOuvert] = useState(false);
  return (
    <div className="dp-carte-x">
      <button type="button" aria-expanded={ouvert} onClick={() => setOuvert((o) => !o)}>
        Sécurité sociale : pourquoi deux déficits différents ?
        <span aria-hidden="true">{ouvert ? "−" : "+"}</span>
      </button>
      <div className="dp-carte-xr" hidden={!ouvert}>
          <div className="dp-vs">
            <span>
              <b>−6,7 Md€</b>administrations de sécurité sociale, comptabilité nationale, 2025
            </span>
            <span>
              <b>−21,6 Md€</b>régimes obligatoires de base et FSV, 2025
            </span>
          </div>
          <p>
            Parce que ce n&apos;est pas le même périmètre. Les « administrations de sécurité
            sociale » de la comptabilité nationale englobent un ensemble plus large d&apos;organismes
            que les seuls régimes obligatoires de base et le Fonds de solidarité vieillesse. Leurs
            dépenses atteignent environ 803 Md€ en 2025.
          </p>
          <p>
            L&apos;ONDAM 2025 s&apos;établit à <b>265,4 Md€</b> : ce sont les dépenses relevant de
            l&apos;objectif national des dépenses d&apos;assurance maladie, et non l&apos;ensemble
            de la santé publique.
          </p>
      </div>
    </div>
  );
}

/* ── Deux chiffres vrais en même temps ─────────────────────────────────── */

export function DeuxMesures() {
  const [ouvert, setOuvert] = useState(false);
  return (
    <div className="dp-carte-x">
      <button type="button" aria-expanded={ouvert} onClick={() => setOuvert((o) => !o)}>
        149 Md€ d&apos;enseignement, ou 87,7 Md€ ? Les deux.
        <span aria-hidden="true">{ouvert ? "−" : "+"}</span>
      </button>
      <div className="dp-carte-xr" hidden={!ouvert}>
          <div className="dp-vs">
            <span>
              <b>149 Md€</b>fonction « enseignement » de toutes les administrations publiques,
              comptabilité nationale, 2024
            </span>
            <span>
              <b>87,7 Md€</b>mission « Enseignement scolaire » du budget de l&apos;État,
              comptabilité budgétaire, exécution 2025
            </span>
          </div>
          <p>
            Le périmètre, l&apos;année et les règles comptables sont différents. Les deux chiffres
            sont exacts en même temps, et aucun ne corrige l&apos;autre.
          </p>
      </div>
    </div>
  );
}

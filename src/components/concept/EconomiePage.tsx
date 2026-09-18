"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FicheArticle, FichePays } from "@/data/concept/conceptGeo";
import type { SocleEco } from "@/data/concept/conceptEconomie";
import { Enseigne, EnTete, ImagePlaceholder, LENT, Monte, Pied } from "./pieces";
import { GlobeMonde } from "./GlobeMonde";
import "./concept.css";

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE ÉCONOMIE DU PROTOTYPE

   Même langage que la page Monde, mais une seule matière : le socle
   économique, millésime par millésime. Tout ce qui s'affiche ici vient de la
   base du site. Une année qu'une source ne publie pas pour un pays reste
   absente — le pays sort du classement de cette année-là, il n'y figure pas
   avec un zéro.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface EcoProps {
  socle: SocleEco;
  articles: FicheArticle[];
  faq: { question: string; answer: string }[];
  regions: readonly { id: string; label: string; pays: readonly string[] }[];
  vues: Record<string, { lat: number; lon: number }>;
}

interface Rang {
  nom: string;
  fr: string;
  pib: number | null;
  pibHab: number | null;
  inflation: number | null;
  balance: number | null;
  dette: number | null;
  chomage: number | null;
}

type Col = "pib" | "pibHab" | "inflation" | "balance" | "dette" | "chomage";

const COLONNES: { id: Col; label: string; unite: "md" | "eur" | "pct" }[] = [
  { id: "pib", label: "PIB", unite: "md" },
  { id: "pibHab", label: "PIB / hab.", unite: "eur" },
  { id: "inflation", label: "Inflation", unite: "pct" },
  { id: "balance", label: "Balance", unite: "md" },
  { id: "dette", label: "Dette / PIB", unite: "pct" },
  { id: "chomage", label: "Chômage", unite: "pct" },
];

function val(v: number | null, unite: "md" | "eur" | "pct") {
  if (v === null) return "—";
  if (unite === "pct") return `${v.toFixed(1).replace(".", ",")} %`;
  if (unite === "eur") return `${Math.round(v).toLocaleString("fr-FR")} €`;
  return Math.abs(v) >= 1000
    ? `${(v / 1000).toFixed(1).replace(".", ",")} T€`
    : `${Math.round(v).toLocaleString("fr-FR")} Md€`;
}

export function EconomiePage({ socle, articles, faq, regions, vues }: EcoProps) {
  const [annee, setAnnee] = useState(socle.annees[socle.annees.length - 1]);
  const [col, setCol] = useState<Col>("pib");
  const [sens, setSens] = useState<1 | -1>(-1);
  const [filtre, setFiltre] = useState("");
  const [choisi, setChoisi] = useState<string | null>("France");
  const [ouvert, setOuvert] = useState<number | null>(0);
  const tableau = useRef<HTMLDivElement>(null);

  /* Les lignes de l'année, reconstituées depuis le format compact. */
  const rangs = useMemo<Rang[]>(() => {
    const l = socle.lignes[annee] ?? [];
    return l.map(([id, pib, pibHab, inflation, balance, dette, chomage]) => {
      const p = socle.pays[id as number];
      return { nom: p.nom, fr: p.fr, pib, pibHab, inflation, balance, dette, chomage };
    });
  }, [socle, annee]);

  /* Un pays sans valeur pour la colonne triée passe à la fin, jamais au
     rang le plus bas : ne pas savoir n'est pas être dernier. */
  const tries = useMemo(() => {
    const q = filtre.trim().toLowerCase();
    const base = q ? rangs.filter((r) => r.fr.toLowerCase().includes(q)) : rangs;
    return [...base].sort((a, b) => {
      const x = a[col];
      const y = b[col];
      if (x === null && y === null) return a.fr.localeCompare(b.fr);
      if (x === null) return 1;
      if (y === null) return -1;
      /* sens = −1 : du plus grand au plus petit. L'écart doit donc être
         pris dans l'ordre naturel puis retourné, pas l'inverse. */
      return (x - y) * sens;
    });
  }, [rangs, col, sens, filtre]);

  /* Ce que lit le globe : la même année, la même base. */
  const donnees = useMemo<Record<string, FichePays>>(() => {
    const o: Record<string, FichePays> = {};
    for (const r of rangs) {
      o[r.nom] = { fr: r.fr, pib: r.pib, pibHab: r.pibHab, inflation: r.inflation, balance: r.balance };
    }
    return o;
  }, [rangs]);

  const cles = useMemo(() => {
    let pib = 0;
    let n = 0;
    const infl: number[] = [];
    for (const r of rangs) {
      if (r.pib !== null) {
        pib += r.pib;
        n += 1;
      }
      if (r.inflation !== null) infl.push(r.inflation);
    }
    infl.sort((a, b) => a - b);
    const med = infl.length
      ? infl.length % 2
        ? infl[(infl.length - 1) / 2]
        : (infl[infl.length / 2 - 1] + infl[infl.length / 2]) / 2
      : null;
    const tete = [...rangs].filter((r) => r.pib !== null).sort((a, b) => (b.pib as number) - (a.pib as number))[0];
    return { pib, n, med, tete };
  }, [rangs]);

  /* Choisir dans le classement fait défiler jusqu'à la ligne : autrement, on
     clique un pays sur le globe et rien ne bouge dans un tableau de cent
     quatre-vingts lignes. */
  useEffect(() => {
    if (!choisi || !tableau.current) return;
    const el = tableau.current.querySelector<HTMLElement>(`[data-pays="${CSS.escape(choisi)}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [choisi, tries]);

  const trier = (c: Col) => {
    if (c === col) setSens((s) => (s === 1 ? -1 : 1));
    else {
      setCol(c);
      setSens(-1);
    }
  };

  return (
    <div className="cg">
      <EnTete actif="Économie" />

      {/* ── L'ouverture ──────────────────────────────────────────────────── */}
      <section className="cg-section cg-eco-haut">
        <div className="cg-wrap">
          <Monte>
            <p className="cg-eyebrow">Économie</p>
            <h1 className="cg-h1 cg-eco-h1">
              Le monde,
              <br />
              <span className="cg-h2-doux">en milliards.</span>
            </h1>
            <p className="cg-chapo">
              Six indicateurs, {socle.pays.length} pays, {socle.annees.length} millésimes. Choisissez
              une année : tout suit — le globe, le classement, les chiffres.
            </p>
          </Monte>

          <Monte delay={0.15}>
            <dl className="cg-eco-cles">
              <div>
                <dt>PIB cumulé</dt>
                <dd>{(cles.pib / 1000).toFixed(1).replace(".", ",")} T€</dd>
                <span>{cles.n} pays renseignés</span>
              </div>
              <div>
                <dt>Première économie</dt>
                <dd>{cles.tete?.fr ?? "—"}</dd>
                <span>{val(cles.tete?.pib ?? null, "md")}</span>
              </div>
              <div>
                <dt>Inflation médiane</dt>
                <dd>{cles.med === null ? "—" : `${cles.med.toFixed(1).replace(".", ",")} %`}</dd>
                <span>millésime {annee}</span>
              </div>
              <div>
                <dt>Fiches au classement</dt>
                <dd>{rangs.length}</dd>
                <span>sur {socle.pays.length} pays du socle</span>
              </div>
            </dl>
          </Monte>
        </div>
      </section>

      {/* ── La frise ─────────────────────────────────────────────────────── */}
      <section className="cg-section cg-frise-s">
        <div className="cg-wrap">
          <Enseigne droite={<span className="cg-demo-mini">Banque mondiale (WDI) · FMI</span>}>
            La frise
          </Enseigne>
          <div className="cg-frise" role="group" aria-label="Millésime affiché">
            {socle.annees.map((a) => (
              <button
                key={a}
                type="button"
                className={`cg-an${a === annee ? " cg-an-on" : ""}`}
                aria-pressed={a === annee}
                onClick={() => setAnnee(a)}
              >
                <span className="cg-an-t" aria-hidden="true" />
                {a}
              </button>
            ))}
          </div>
          <p className="cg-frise-n">
            Les millésimes affichés sont ceux publiés par la source. Rien n&apos;est interpolé entre
            deux jalons : une année absente reste absente.
          </p>
        </div>
      </section>

      {/* ── Le globe ─────────────────────────────────────────────────────── */}
      <section className="cg-section">
        <div className="cg-wrap">
          <Enseigne>Le globe, millésime {annee}</Enseigne>
          <GlobeMonde
            donnees={donnees}
            annee={annee}
            regions={regions}
            vues={vues}
            choisi={choisi}
            onChoisi={setChoisi}
          />
        </div>
      </section>

      {/* ── Le classement ────────────────────────────────────────────────── */}
      <section className="cg-section cg-eco-rang">
        <div className="cg-wrap">
          <Enseigne
            droite={
              <input
                className="cg-filtre"
                type="search"
                placeholder="Filtrer un pays"
                value={filtre}
                onChange={(e) => setFiltre(e.target.value)}
                aria-label="Filtrer un pays"
              />
            }
          >
            Le classement {annee}
          </Enseigne>

          <div ref={tableau} className="cg-tab-cadre">
            <table className="cg-tab">
              <thead>
                <tr>
                  <th className="cg-tab-r">#</th>
                  <th className="cg-tab-p">Pays</th>
                  {COLONNES.map((c) => (
                    <th key={c.id}>
                      <button
                        type="button"
                        className={`cg-tri${col === c.id ? " cg-tri-on" : ""}`}
                        onClick={() => trier(c.id)}
                        aria-sort={col === c.id ? (sens === -1 ? "descending" : "ascending") : "none"}
                      >
                        {c.label}
                        <span aria-hidden="true">{col === c.id ? (sens === -1 ? " ↓" : " ↑") : ""}</span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tries.map((r, i) => (
                  <tr
                    key={r.nom}
                    data-pays={r.nom}
                    className={choisi === r.nom ? "cg-tab-on" : undefined}
                    onClick={() => setChoisi(r.nom)}
                  >
                    <td className="cg-tab-r">{String(i + 1).padStart(2, "0")}</td>
                    <td className="cg-tab-p">{r.fr}</td>
                    {COLONNES.map((c) => (
                      <td key={c.id} className={r[c.id] === null ? "cg-tab-vide" : undefined}>
                        {val(r[c.id], c.unite)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="cg-frise-n">
            {tries.length} pays affichés · un tiret signale une valeur que la source ne publie pas
            pour ce pays cette année-là ; ces pays passent en fin de tri, ils ne sont pas classés
            derniers. Cliquez une ligne pour la retrouver sur le globe.
          </p>
        </div>
      </section>

      {/* ── Les articles ─────────────────────────────────────────────────── */}
      <section className="cg-section">
        <div className="cg-wrap">
          <Enseigne>À lire sur l&apos;économie</Enseigne>
          <div className="cg-secondaires cg-eco-arts">
            {articles.map((a, k) => (
              <Monte key={a.slug} delay={k * 0.08} y={30}>
                <article className="cg-second">
                  <ImagePlaceholder nom={`IMAGE_PNG_ECO_0${k + 1}`} ratio="4 / 3" />
                  <span className="cg-rubrique">
                    {a.rubrique} · {a.duree}
                  </span>
                  <h4 className="cg-second-t">{a.titre}</h4>
                  <p className="cg-second-c">{a.chapo}</p>
                </article>
              </Monte>
            ))}
          </div>
        </div>
      </section>

      {/* ── La FAQ ───────────────────────────────────────────────────────── */}
      <section className="cg-section cg-questions">
        <div className="cg-wrap">
          <Enseigne>Les questions d&apos;économie</Enseigne>
          <div className="cg-q-liste">
            {faq.map((q, k) => {
              const on = ouvert === k;
              return (
                <div key={q.question} className={`cg-q${on ? " cg-q-on" : ""}`}>
                  <button
                    type="button"
                    className="cg-q-t"
                    aria-expanded={on}
                    onClick={() => setOuvert(on ? null : k)}
                  >
                    {q.question}
                    <span className="cg-q-signe" aria-hidden="true" />
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        className="cg-q-r"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.36, ease: LENT }}
                      >
                        <p>{q.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Pied />
    </div>
  );
}

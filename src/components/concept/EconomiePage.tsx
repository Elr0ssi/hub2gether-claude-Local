"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FicheArticle, FichePays } from "@/data/concept/conceptGeo";
import { COLONNE, type Compteur as CompteurEco, type SocleEco } from "@/data/concept/conceptEconomie";
import { CompteursEco } from "./CompteursEco";
import { Annonce } from "./Annonce";
import type { CountryEconomyData, EconomyMetricId, EconomyYear } from "@/types";
import { Enseigne, EnTete, ImagePlaceholder, LENT, Monte, Pied } from "./pieces";
import { GlobeEco, familleDe, TOUTES } from "./GlobeEco";
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
  compteurs: CompteurEco[];
  articles: FicheArticle[];
  faq: { question: string; answer: string }[];
}

type Col =
  | "pib"
  | "pibHab"
  | "balance"
  | "dette"
  | "detteMontant"
  | "inflation"
  | "chomage"
  | "actifs"
  | "retraite"
  | "entreprises";

type Rang = { nom: string; fr: string } & Record<Col, number | null>;

/* La colonne du classement correspondant à chaque métrique du site. Le
   classement et le globe parlent ainsi de la même chose. */
/* Le champ de la base derrière chaque métrique, pour lire une série. */
const CHAMP_DE: Partial<Record<EconomyMetricId, string>> = {
  gdp: "gdp",
  gdp_per_capita: "gdp_per_capita",
  trade_balance: "trade_balance",
  debt_ratio: "debt_ratio",
  debt_amount: "debt_amount",
  inflation: "inflation",
  unemployment: "unemployment",
  active_population: "active_population",
  retirement_age: "retirement_age",
  companies: "companies",
};

/* Les mots qui rapprochent un article d'un indicateur. Écrits, pas déduits :
   les libellés du site sont des étiquettes de colonne, pas du vocabulaire
   d'article. */
const MOTS_DE: Partial<Record<EconomyMetricId, string[]>> = {
  gdp: ["pib", "croissance", "économie mondiale"],
  gdp_per_capita: ["pib par habitant", "habitant", "niveau de vie", "pib"],
  trade_balance: ["balance", "commerce", "échange", "exportation", "importation"],
  debt_ratio: ["dette", "emprunt", "déficit"],
  debt_amount: ["dette", "emprunt", "déficit"],
  inflation: ["inflation", "prix", "pouvoir d'achat"],
  unemployment: ["chômage", "emploi", "travail"],
  active_population: ["population", "emploi", "actif", "démographie"],
  retirement_age: ["retraite", "pension"],
  companies: ["entreprise", "industrie", "marché"],
};

const COL_DE: Partial<Record<EconomyMetricId, Col>> = {
  gdp: "pib",
  gdp_per_capita: "pibHab",
  trade_balance: "balance",
  debt_ratio: "dette",
  debt_amount: "detteMontant",
  inflation: "inflation",
  unemployment: "chomage",
  active_population: "actifs",
  retirement_age: "retraite",
  companies: "entreprises",
};

type Unite = "md" | "eur" | "pct" | "hab" | "ans" | "k";

/* Le classement montre les colonnes de la famille regardée, pas les dix à la
   fois : dix colonnes de chiffres ne se comparent pas, elles se subissent. */
const COLONNES: { id: Col; label: string; unite: Unite; famille: string }[] = [
  { id: "pib", label: "PIB", unite: "md", famille: "pib" },
  { id: "pibHab", label: "PIB / hab.", unite: "eur", famille: "pib" },
  { id: "balance", label: "Balance", unite: "md", famille: "pib" },
  { id: "dette", label: "Dette / PIB", unite: "pct", famille: "dette" },
  { id: "detteMontant", label: "Montant dette", unite: "md", famille: "dette" },
  { id: "inflation", label: "Inflation", unite: "pct", famille: "dette" },
  { id: "chomage", label: "Chômage", unite: "pct", famille: "chomage" },
  { id: "actifs", label: "Population active", unite: "hab", famille: "chomage" },
  { id: "retraite", label: "Retraite", unite: "ans", famille: "chomage" },
  { id: "entreprises", label: "Entreprises", unite: "k", famille: "entreprises" },
];

function val(v: number | null, unite: Unite) {
  if (v === null) return "—";
  if (unite === "ans") return `${Math.round(v)} ans`;
  if (unite === "k") return `${Math.round(v).toLocaleString("fr-FR")} k`;
  if (unite === "hab") return `${v.toFixed(1).replace(".", ",")} M`;
  if (unite === "pct") return `${v.toFixed(1).replace(".", ",")} %`;
  if (unite === "eur") return `${Math.round(v).toLocaleString("fr-FR")} €`;
  return Math.abs(v) >= 1000
    ? `${(v / 1000).toFixed(1).replace(".", ",")} T€`
    : `${Math.round(v).toLocaleString("fr-FR")} Md€`;
}


/* Deux cents lignes se reconstruisaient à chaque pixel de glissement sur la
   frise : le tableau ne dépend pas de l'année visée, seulement de l'année
   posée, et il n'a donc aucune raison de repasser par React entre-temps.
   C'est ce qui rendait la frise poisseuse. */
const Tableau = memo(function Tableau({
  lignes,
  colonnes,
  col,
  sens,
  choisi,
  onChoisi,
  onTrier,
}: {
  lignes: Rang[];
  colonnes: { id: Col; label: string; unite: Unite; famille: string }[];
  col: Col;
  sens: 1 | -1;
  choisi: string | null;
  onChoisi: (n: string) => void;
  onTrier: (c: Col) => void;
}) {
  return (
    <div className="cg-tab-cadre">
      <table className="cg-tab">
        <thead>
          <tr>
            <th className="cg-tab-r">#</th>
            <th className="cg-tab-p">Pays</th>
            {colonnes.map((c) => (
              <th key={c.id}>
                <button
                  type="button"
                  className={`cg-tri${col === c.id ? " cg-tri-on" : ""}`}
                  onClick={() => onTrier(c.id)}
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
          {lignes.map((r, i) => (
            <tr
              key={r.nom}
              data-pays={r.nom}
              className={choisi === r.nom ? "cg-tab-on" : undefined}
              onClick={() => onChoisi(r.nom)}
            >
              <td className="cg-tab-r">{String(i + 1).padStart(2, "0")}</td>
              <td className="cg-tab-p">{r.fr}</td>
              {colonnes.map((c) => (
                <td key={c.id} className={r[c.id] === null ? "cg-tab-vide" : undefined}>
                  {val(r[c.id], c.unite)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export function EconomiePage({ socle, compteurs, articles, faq }: EcoProps) {
  /* Deux années : celle qu'on vise et celle qu'on affiche.
     Repeindre la texture du globe et recalculer deux cents lignes à chaque
     pixel de glissement rendait la frise poisseuse. Le point et le libellé
     suivent le doigt immédiatement ; le reste de la page attend que le geste
     se pose. */
  const [anneeVue, setAnneeVue] = useState(socle.annees[socle.annees.length - 1]);
  const [annee, setAnnee] = useState(socle.annees[socle.annees.length - 1]);
  const attente = useRef<number | null>(null);

  const viseAnnee = useCallback((a: number, tout_de_suite = false) => {
    setAnneeVue(a);
    if (attente.current) clearTimeout(attente.current);
    if (tout_de_suite) setAnnee(a);
    else attente.current = window.setTimeout(() => setAnnee(a), 110);
  }, []);
  useEffect(() => () => {
    if (attente.current) clearTimeout(attente.current);
  }, []);
  const [col, setCol] = useState<Col>("pib");
  /* La métrique du globe et la colonne triée sont liées : cliquer « Dette »
     sur le globe trie le classement sur la dette, et l'inverse aussi. C'est
     ce que faisait la carte du site, et c'est ce qui évite deux états qui
     racontent deux choses. */
  const [metrique, setMetrique] = useState<EconomyMetricId>("gdp");
  const [sens, setSens] = useState<1 | -1>(-1);
  const [filtre, setFiltre] = useState("");
  const [qArticle, setQArticle] = useState("");
  const [choisi, setChoisi] = useState<string | null>("France");
  const [ouvert, setOuvert] = useState<number | null>(0);
  const rail = useRef<HTMLDivElement>(null);
  const rail2 = useRef<HTMLDivElement>(null);
  const prise2 = useRef<{ x: number; g: number } | null>(null);
  const tire = useRef(false);

  /* La position d'un millésime sur la ligne, en pourcentage : les jalons ne
     sont pas régulièrement espacés dans le temps, mais ils le sont sur la
     ligne — c'est une suite de repères, pas un axe. */
  const pct = (a: number) => {
    const i = socle.annees.indexOf(a);
    return socle.annees.length < 2 ? 0 : (i / (socle.annees.length - 1)) * 100;
  };
  const viseX = (x: number) => {
    const el = rail.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (x - r.left) / (r.width || 1)));
    viseAnnee(socle.annees[Math.round(t * (socle.annees.length - 1))]);
  };

  /* Les lignes de l'année, reconstituées depuis le format compact. */
  const rangs = useMemo<Rang[]>(() => {
    const l = socle.lignes[annee] ?? [];
    return l.map((ligne) => {
      const p = socle.pays[ligne[0] as number];
      const v = (c: string) => {
        const x = ligne[COLONNE[c]];
        return typeof x === "number" && Number.isFinite(x) ? x : null;
      };
      return {
        nom: p.nom,
        fr: p.fr,
        pib: v("gdp"),
        pibHab: v("gdp_per_capita"),
        balance: v("trade_balance"),
        dette: v("debt_ratio"),
        detteMontant: v("debt_amount"),
        inflation: v("inflation"),
        chomage: v("unemployment"),
        actifs: v("active_population"),
        retraite: v("retirement_age"),
        entreprises: v("companies"),
      };
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

  /* L'année remise au format de la base : le globe du site lit un EconomyYear,
     et on le reconstruit depuis le format compact plutôt que d'expédier au
     navigateur seize millésimes entiers. */
  const anneeEco = useMemo<EconomyYear>(() => {
    const countries: Record<string, CountryEconomyData> = {};
    for (const r of rangs) {
      countries[r.nom] = {
        gdp: r.pib ?? undefined,
        gdp_per_capita: r.pibHab ?? undefined,
        trade_balance: r.balance ?? undefined,
        debt_ratio: r.dette ?? undefined,
        debt_amount: r.detteMontant ?? undefined,
        inflation: r.inflation ?? undefined,
        unemployment: r.chomage ?? undefined,
        active_population: r.actifs ?? undefined,
        retirement_age: r.retraite ?? undefined,
        companies: r.entreprises ?? undefined,
      };
    }
    return { year: annee, label: String(annee), dataNote: "", countries };
  }, [rangs, annee]);

  /* La série du pays choisi, millésime par millésime, pour la courbe. Une
     année sans valeur reste nulle : la courbe se coupe, elle ne descend pas
     à zéro. */
  const serie = useMemo(() => {
    const idx = choisi ? socle.pays.findIndex((p) => p.nom === choisi) : -1;
    const c = CHAMP_DE[metrique];
    return socle.annees.map((a) => {
      if (idx < 0 || !c) return { annee: a, v: null };
      const l = (socle.lignes[a] ?? []).find((x) => x[0] === idx);
      const v = l ? l[COLONNE[c]] : null;
      return { annee: a, v: typeof v === "number" && Number.isFinite(v) ? v : null };
    });
  }, [socle, choisi, metrique]);

  /* Les colonnes de la famille en cours, plus le PIB qui sert de repère
     commun — on compare toujours quelque chose au poids de l'économie. */
  const colonnes = useMemo(() => {
    const f = familleDe(metrique).id;
    const l = COLONNES.filter((c) => c.famille === f);
    return f === "pib" ? l : [COLONNES[0], ...l];
  }, [metrique]);

  /* Les trois articles les plus proches de l'indicateur regardé. Le
     rapprochement se fait sur des mots, pas sur le libellé découpé : « PIB »
     fait trois lettres et ne ressortait d'aucune découpe. Sans
     correspondance, on ne recommande rien plutôt que les trois premiers de
     la liste, qui n'auraient aucun rapport. */
  const recos = useMemo(() => {
    const cles = MOTS_DE[metrique] ?? [];
    if (!cles.length) return [];
    return articles
      .map((a) => ({ a, score: cles.filter((c) => (a.mots ?? "").includes(c)).length }))
      .filter((o) => o.score > 0)
      .sort((x, y) => y.score - x.score)
      .slice(0, 3)
      .map((o) => o.a);
  }, [articles, metrique]);

  const articlesVus = useMemo(() => {
    const q = qArticle.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter((a) => `${a.titre} ${a.chapo} ${a.mots ?? ""}`.toLowerCase().includes(q));
  }, [articles, qArticle]);

  const trier = useCallback((c: Col) => {
    if (c === col) setSens((s) => (s === 1 ? -1 : 1));
    else {
      setCol(c);
      setSens(-1);
      const m = TOUTES.find((x) => COL_DE[x.id] === c);
      if (m) setMetrique(m.id);
    }
  }, [col]);

  const changeMetrique = (id: EconomyMetricId) => {
    setMetrique(id);
    const c = COL_DE[id];
    if (c) {
      setCol(c);
      setSens(-1);
    }
  };

  return (
    <div className="cg cg-eco">
      <EnTete actif="Économie" />

      {/* Le rail d'annonce suit la lecture sans la couper. Il ne s'affiche
          qu'au-delà de la largeur où il ne mange rien à la colonne. */}
      <Annonce format="rail" className="an-colle" />

      {/* ── L'ouverture ──────────────────────────────────────────────────── */}
      <section className="cg-section cg-eco-haut">
        {/* Une lueur derrière le titre : sur une page entièrement noire, une
            ouverture sans relief se confond avec la section suivante. */}
        <div className="cg-eco-lueur" aria-hidden="true" />
        <div className="cg-wrap cg-eco-ouv">
          <Monte>
            <p className="cg-eyebrow">Économie · millésime {annee}</p>
            <h1 className="cg-h1 cg-eco-h1">
              Le monde,
              <br />
              <span className="cg-h2-doux">en milliards.</span>
            </h1>
            <p className="cg-chapo">
              Dix indicateurs, {socle.pays.length} pays, {socle.annees.length} millésimes — de{" "}
              {socle.annees[0]} à {socle.annees[socle.annees.length - 1]}. Choisissez une année :
              tout suit.
            </p>
          </Monte>

          <Monte delay={0.12}>
            <CompteursEco compteurs={compteurs} annee={socle.annees[socle.annees.length - 1]} />
          </Monte>
        </div>
      </section>

      {/* ── Le globe, sa frise et ses raccourcis ─────────────────────────── */}
      <section className="cg-section cg-eco-globe">
        <div className="cg-wrap">
          <Enseigne droite={<span className="cg-demo-mini">Banque mondiale (WDI) · FMI</span>}>
            Le globe, millésime {annee}
          </Enseigne>

          <GlobeEco
            annee={anneeEco}
            metrique={TOUTES.find((m) => m.id === metrique) ?? TOUTES[0]}
            onMetrique={changeMetrique}
            choisi={choisi}
            onChoisi={setChoisi}
            nomFr={(n) => socle.pays.find((p) => p.nom === n)?.fr ?? n}
            creancier={choisi ? socle.pays.find((p) => p.nom === choisi)?.creancier : undefined}
            serie={serie}
            sousLeGlobe={

              /* La frise est collée au globe : changer d'année et regarder le
                 résultat est un seul geste, et l'envoyer dans une section
                 au-dessus obligeait à remonter pour chaque millésime. */
              <div className="cg-frise2">
                <div className="cg-frise2-tete">
                  <span className="cg-frise2-an">{anneeVue}</span>
                  <span className="cg-frise2-l">millésime affiché</span>
                </div>

                {/* Une ligne, un point. On vise un jalon, on glisse le point,
                    ou on pousse aux flèches — un curseur qui ne répond qu'à la
                    souris exclut ceux qui n'en tiennent pas. */}
                <div
                  ref={rail}
                  className="cg-frise2-rail"
                  role="slider"
                  tabIndex={0}
                  aria-label="Millésime affiché"
                  aria-valuemin={socle.annees[0]}
                  aria-valuemax={socle.annees[socle.annees.length - 1]}
                  aria-valuenow={anneeVue}
                  aria-valuetext={String(anneeVue)}
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    tire.current = true;
                    viseX(e.clientX);
                  }}
                  onPointerMove={(e) => tire.current && viseX(e.clientX)}
                  onPointerUp={() => {
                    tire.current = false;
                    /* Le geste est fini : on n'attend plus. */
                    viseAnnee(anneeVue, true);
                  }}
                  onPointerCancel={() => {
                    tire.current = false;
                  }}
                  onKeyDown={(e) => {
                    const i = socle.annees.indexOf(anneeVue);
                    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                      e.preventDefault();
                      viseAnnee(socle.annees[Math.max(0, i - 1)], true);
                    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                      e.preventDefault();
                      viseAnnee(socle.annees[Math.min(socle.annees.length - 1, i + 1)], true);
                    } else if (e.key === "Home") {
                      e.preventDefault();
                      viseAnnee(socle.annees[0], true);
                    } else if (e.key === "End") {
                      e.preventDefault();
                      viseAnnee(socle.annees[socle.annees.length - 1], true);
                    }
                  }}
                >
                  <span className="cg-frise2-ligne" aria-hidden="true" />
                  <span className="cg-frise2-faite" aria-hidden="true" style={{ width: `${pct(anneeVue)}%` }} />
                  {socle.annees
                    .filter((a) => a % 10 === 0 || (a >= 2000 && a % 5 === 0))
                    .map((a) => (
                      <span
                        key={a}
                        className="cg-frise2-jalon"
                        style={{ left: `${pct(a)}%` }}
                        aria-hidden="true"
                      />
                    ))}
                  <span className="cg-frise2-point" aria-hidden="true" style={{ left: `${pct(anneeVue)}%` }} />
                </div>

                <div className="cg-frise2-bornes" aria-hidden="true">
                  {/* Toutes les années sont atteignables sur la ligne ; seules
                      les décennies portent un libellé, et les demi-décennies à
                      partir de 2000 où la matière se resserre. Soixante-six
                      étiquettes côte à côte ne se lisent pas. */}
                  {socle.annees
                    .filter((a) => a % 10 === 0 || (a >= 2000 && a % 5 === 0) || a === anneeVue || a === socle.annees[socle.annees.length - 1])
                    .map((a) => (
                      <button
                        key={a}
                        type="button"
                        className={`cg-frise2-b${a === anneeVue ? " cg-frise2-b-on" : ""}`}
                        style={{ left: `${pct(a)}%` }}
                        onClick={() => viseAnnee(a, true)}
                        tabIndex={-1}
                      >
                        {a}
                      </button>
                    ))}
                </div>

                <p className="cg-frise-n">
                  Les millésimes affichés sont ceux publiés par la source. Rien n&apos;est interpolé
                  entre deux jalons : une année absente reste absente.
                </p>
              </div>
            }
          />
        </div>
      </section>

      <div className="cg-wrap cg-an-bande">
        <Annonce format="bande" />
      </div>

      {/* ── Le classement ────────────────────────────────────────────────── */}
      {/* Un panneau clair, qui se lève au défilement : après trois sections
          sombres, c'est la rupture qui signale « ici on compare », et un
          tableau se lit mieux sur du clair que sur du noir. */}
      <motion.section
        className="cg-section cg-eco-rang"
        initial={{ opacity: 0, y: 46 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-90px" }}
        transition={{ duration: 0.85, ease: LENT }}
      >
        <div className="cg-wrap">
          <motion.div
            className="cg-clair"
            initial={{ clipPath: "inset(8% 6% 8% 6% round 18px)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0% round 18px)" }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 1, ease: LENT }}
          >
            <div className="cg-clair-h">
              <div>
                <h2 className="cg-clair-t">Le classement</h2>
                <label className="cg-an-choix">
                  <span className="cg-an-choix-l">Millésime</span>
                  <select
                    value={annee}
                    onChange={(e) => viseAnnee(Number(e.target.value), true)}
                    aria-label="Millésime du classement"
                  >
                    {[...socle.annees].reverse().map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <input
                className="cg-filtre cg-filtre-clair"
                type="search"
                placeholder="Filtrer un pays"
                value={filtre}
                onChange={(e) => setFiltre(e.target.value)}
                aria-label="Filtrer un pays"
              />
            </div>

            <Tableau
              lignes={tries}
              colonnes={colonnes}
              col={col}
              sens={sens}
              choisi={choisi}
              onChoisi={setChoisi}
              onTrier={trier}
            />
            <p className="cg-clair-n">
              {tries.length} pays affichés · un tiret signale une valeur que la source ne publie pas
              pour ce pays cette année-là ; ces pays passent en fin de tri, ils ne sont pas classés
              derniers. Cliquez une ligne pour la retrouver sur le globe.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Les recommandations, puis la lecture ─────────────────────────── */}
      <section className="cg-section cg-lectures">
        <div className="cg-wrap">
          <Enseigne
            droite={
              <input
                className="cg-filtre"
                type="search"
                placeholder="Chercher un article"
                value={qArticle}
                onChange={(e) => setQArticle(e.target.value)}
                aria-label="Chercher un article"
              />
            }
          >
            À lire sur l&apos;économie
          </Enseigne>

          {recos.length > 0 && !qArticle.trim() && (
            <div className="cg-recos">
              <p className="cg-recos-t">
                Parce que vous regardez « {TOUTES.find((m) => m.id === metrique)?.label} »
              </p>
              <div className="cg-recos-l">
                {recos.map((a) => (
                  <article key={a.slug} className="cg-reco">
                    <span className="cg-rubrique">{a.rubrique} · {a.duree}</span>
                    <h4 className="cg-reco-t">{a.titre}</h4>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Défilement libre : plus d'accrochage par fiche. On s'arrête où
              l'on veut, y compris entre deux. */}
          <div
            ref={rail2}
            className="cg-arts"
            onPointerDown={(e) => {
              prise2.current = { x: e.clientX, g: e.currentTarget.scrollLeft };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!prise2.current || !rail2.current) return;
              rail2.current.scrollLeft = prise2.current.g - (e.clientX - prise2.current.x);
            }}
            onPointerUp={() => {
              prise2.current = null;
            }}
            onPointerCancel={() => {
              prise2.current = null;
            }}
          >
            {articlesVus.map((a, k) => (
              <article key={a.slug} className="cg-art">
                <ImagePlaceholder nom={`IMAGE_PNG_ECO_0${(k % 9) + 1}`} ratio="16 / 10" />
                <span className="cg-rubrique">
                  {a.rubrique} · {a.duree}
                </span>
                <h4 className="cg-art-t">{a.titre}</h4>
                <p className="cg-art-c">{a.chapo}</p>
              </article>
            ))}
            {articlesVus.length > 3 && <Annonce format="encart" className="an-dans-fil" />}
            {articlesVus.length === 0 && (
              <p className="cg-frise-n">Aucun article ne correspond à cette recherche.</p>
            )}
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

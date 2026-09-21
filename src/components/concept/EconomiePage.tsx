"use client";

import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FicheArticle, FichePays } from "@/data/concept/conceptGeo";
import { COLONNE, type LigneSource, type SocleEco } from "@/data/concept/conceptEconomie";
import { Annonce } from "./Annonce";
import type { CountryEconomyData, EconomyMetricId, EconomyYear } from "@/types";
import { Enseigne, EnTete, ImagePlaceholder, LENT, Monte, Pied } from "./pieces";
import { gelerOdometres } from "./Roulement";
import { GlobeEco, familleDe, TOUTES } from "./GlobeEco";
import "./concept.css";

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE ÉCONOMIE DU PROTOTYPE

   Même langage que la page Monde, mais une seule matière : le socle
   économique, date par date. Tout ce qui s'affiche ici vient de la
   base du site. Une année qu'une source ne publie pas pour un pays reste
   absente — le pays sort du classement de cette année-là, il n'y figure pas
   avec un zéro.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface EcoProps {
  socle: SocleEco;
  /* Les compteurs qui couraient en ouverture sont sortis de la page. Le
     composant reste dans le dépôt : les remettre tient en une ligne, ailleurs
     et plus discrets si on le souhaite. */
  sources: LigneSource[];
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
  /* Une seule échelle pour les montants : des milliards, toujours. Un PIB en
     T€ face à une dette en Md€ oblige à diviser de tête avant de comparer. */
  return `${Math.round(v).toLocaleString("fr-FR")} Md€`;
}


/* Deux cents lignes se reconstruisaient à chaque pixel de glissement sur la
   frise : le tableau ne dépend pas de l'année visée, seulement de l'année
   posée, et il n'a donc aucune raison de repasser par React entre-temps.
   C'est ce qui rendait la frise poisseuse. */
/* L'ouverture de la bande au défilement.

   whileInView de framer n'a jamais répondu ici, et un IntersectionObserver
   posé au montage restait muet alors qu'un observateur créé après coup sur le
   même nœud, lui, se déclenchait. Plutôt que de dépendre d'un mécanisme qui
   se comporte différemment selon le moment où on l'installe, on lit la
   position réelle à chaque défilement : c'est une lecture par image, sur un
   seul nœud, et la mesure est relue à chaque fois donc jamais périmée. Une
   fois la bande vue, on décroche tout et on n'y revient pas. */
function useVu(marge = 120) {
  const ref = useRef<HTMLElement | null>(null);
  const [vu, setVu] = useState(false);
  useEffect(() => {
    let vivant = true;
    const regarde = () => {
      const n = ref.current;
      if (!n) return;
      const r = n.getBoundingClientRect();
      const h = window.innerHeight || 0;
      /* Le rectangle doit réapparaître à chaque fois qu'on revient dessus,
         pas seulement la première : on suit l'état au lieu de le figer. */
      setVu(r.top < h - marge && r.bottom > marge);
    };
    /* On mesure dans l'écouteur, pas dans une image d'animation. Attendre
       requestAnimationFrame liait l'ouverture au rythme de rendu : sur une
       page où le globe tire la cadence vers le bas, la bande s'ouvrait avec
       un défilement de retard. Lire la position d'un seul élément ne coûte
       rien, et le résultat est juste au moment où on le lit. */
    const planifie = () => {
      if (!vivant) return;
      regarde();
    };
    const decroche = () => {
      vivant = false;
      window.removeEventListener("scroll", planifie);
      window.removeEventListener("resize", planifie);
    };
    window.addEventListener("scroll", planifie, { passive: true });
    window.addEventListener("resize", planifie);
    planifie();
    return decroche;
  }, [marge]);
  return { ref, vu };
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA FRISE

   Elle porte son année elle-même. C'est tout l'enjeu : tant qu'elle vivait
   dans l'état de la page, chaque pixel de glissement redessinait le globe, la
   fiche pays et le classement — soixante fois par seconde, pour un point qui
   bouge de trois pixels. Ici, glisser ne redessine que la frise ; la page
   n'apprend l'année qu'une fois le geste posé, ou après une courte attente.

   Les compteurs sont gelés le temps du geste. Ils ne mesurent pas une seconde
   qui passe, ils projettent une grandeur annuelle : les arrêter une seconde
   ne fausse rien, et cela rend au glissement les images qu'ils prenaient.
   ═══════════════════════════════════════════════════════════════════════════ */
/* Un titre qui se lève, mot par mot, derrière un masque. Chaque mot porte son
   rang : c'est le CSS qui décale les départs, rien ne tourne en JavaScript. */
function Titre({ texte }: { texte: string }) {
  const mots = texte.split(" ");
  return (
    <>
      {mots.map((m, i) => (
        <Fragment key={`${m}-${i}`}>
          <span className="cg-mot" style={{ "--i": i } as React.CSSProperties}>
            <span>{m}</span>
          </span>
          {i < mots.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

const Frise = memo(function Frise({
  annees,
  valeur,
  onAnnee,
}: {
  annees: number[];
  valeur: number;
  onAnnee: (a: number) => void;
}) {
  const [vue, setVue] = useState(valeur);
  /* L'année sous le doigt est aussi tenue dans une référence. Relâcher lit
     celle-ci et non celle du dernier rendu : un geste rapide envoie ses
     déplacements plus vite que React ne redessine, et la valider depuis l'état
     ramenait à l'année d'avant le geste. */
  const vueRef = useRef(valeur);
  const rail = useRef<HTMLDivElement>(null);
  const tire = useRef(false);
  const attente = useRef<number | null>(null);

  /* Un changement venu d'ailleurs — le menu du classement, par exemple —
     ramène le point où il doit être. */
  useEffect(() => {
    setVue(valeur);
    vueRef.current = valeur;
  }, [valeur]);
  useEffect(
    () => () => {
      if (attente.current) clearTimeout(attente.current);
      gelerOdometres(false);
    },
    [],
  );

  const vise = useCallback(
    (a: number, tout_de_suite = false) => {
      vueRef.current = a;
      setVue(a);
      if (attente.current) clearTimeout(attente.current);
      if (tout_de_suite) onAnnee(a);
      else attente.current = window.setTimeout(() => onAnnee(a), 110);
    },
    [onAnnee],
  );

  const viseX = (x: number) => {
    const el = rail.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (x - r.left) / (r.width || 1)));
    vise(annees[Math.round(t * (annees.length - 1))]);
  };

  const pct = (a: number) => {
    const i = annees.indexOf(a);
    return annees.length < 2 ? 0 : (i / (annees.length - 1)) * 100;
  };

  const jalons = annees.filter((a) => a % 10 === 0 || (a >= 2000 && a % 5 === 0));

  return (
    <div className="cg-frise2">
      <div className="cg-frise2-tete">
        <span className="cg-frise2-an">{vue}</span>
        <span className="cg-frise2-l">date affichée</span>
      </div>

      {/* Une ligne, un point. On vise un repère, on glisse le point, ou on
          pousse aux flèches — un curseur qui ne répond qu'à la souris exclut
          ceux qui n'en tiennent pas. */}
      <div
        ref={rail}
        className="cg-frise2-rail"
        role="slider"
        tabIndex={0}
        aria-label="Date affichée"
        aria-valuemin={annees[0]}
        aria-valuemax={annees[annees.length - 1]}
        aria-valuenow={vue}
        aria-valuetext={String(vue)}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          tire.current = true;
          gelerOdometres(true);
          viseX(e.clientX);
        }}
        onPointerMove={(e) => tire.current && viseX(e.clientX)}
        onPointerUp={() => {
          tire.current = false;
          gelerOdometres(false);
          vise(vueRef.current, true);
        }}
        onPointerCancel={() => {
          tire.current = false;
          gelerOdometres(false);
        }}
        onKeyDown={(e) => {
          const i = annees.indexOf(vueRef.current);
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            vise(annees[Math.max(0, i - 1)], true);
          } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            vise(annees[Math.min(annees.length - 1, i + 1)], true);
          } else if (e.key === "Home") {
            e.preventDefault();
            vise(annees[0], true);
          } else if (e.key === "End") {
            e.preventDefault();
            vise(annees[annees.length - 1], true);
          }
        }}
      >
        <span className="cg-frise2-ligne" aria-hidden="true" />
        <span className="cg-frise2-faite" aria-hidden="true" style={{ width: `${pct(vue)}%` }} />
        {jalons.map((a) => (
          <span key={a} className="cg-frise2-jalon" style={{ left: `${pct(a)}%` }} aria-hidden="true" />
        ))}
        <span className="cg-frise2-point" aria-hidden="true" style={{ left: `${pct(vue)}%` }} />
      </div>

      <div className="cg-frise2-bornes" aria-hidden="true">
        {/* Toutes les années sont atteignables sur la ligne ; seules les
            décennies portent un libellé, et les demi-décennies à partir de
            2000 où la matière se resserre. Soixante-six étiquettes côte à côte
            ne se lisent pas. */}
        {annees
          .filter(
            (a) =>
              a % 10 === 0 ||
              (a >= 2000 && a % 5 === 0) ||
              a === vue ||
              a === annees[annees.length - 1],
          )
          .map((a) => (
            <button
              key={a}
              type="button"
              className={`cg-frise2-b${a === vue ? " cg-frise2-b-on" : ""}`}
              style={{ left: `${pct(a)}%` }}
              onClick={() => vise(a, true)}
              tabIndex={-1}
            >
              {a}
            </button>
          ))}
      </div>

      <p className="cg-frise-n">
        Les dates affichées sont celles publiées par la source. Rien n&apos;est interpolé entre deux
        repères : une année absente reste absente.
      </p>
    </div>
  );
});

/* Le classement ne dessine que ce qui est à l'écran.

   Deux cents lignes de cinq cellules, c'est mille nœuds que React devait
   rapprocher à chaque changement d'année — pendant que le globe repeignait
   sa texture. Le cadre n'en montre qu'une douzaine : on ne rend que celles-là
   plus une marge, et deux cales tiennent la hauteur pour que la barre de
   défilement reste juste. */
const MARGE = 8;

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
  const cadre = useRef<HTMLDivElement>(null);
  const allumee = useRef<HTMLElement | null>(null);
  const [haut, setHaut] = useState(44);
  const [fen, setFen] = useState({ a: 0, b: 30 });

  const mesure = useCallback(() => {
    const el = cadre.current;
    if (!el) return;
    const tr = el.querySelector("tbody tr[data-pays]") as HTMLElement | null;
    const h = tr?.offsetHeight || haut;
    if (h && Math.abs(h - haut) > 0.5) setHaut(h);
    const a = Math.max(0, Math.floor(el.scrollTop / h) - MARGE);
    const b = Math.min(lignes.length, Math.ceil((el.scrollTop + el.clientHeight) / h) + MARGE);
    setFen((p) => (p.a === a && p.b === b ? p : { a, b }));
  }, [haut, lignes.length]);

  useEffect(() => {
    mesure();
    const el = cadre.current;
    if (!el) return;
    const suit = () => mesure();
    el.addEventListener("scroll", suit, { passive: true });
    window.addEventListener("resize", suit);
    return () => {
      el.removeEventListener("scroll", suit);
      window.removeEventListener("resize", suit);
    };
  }, [mesure]);

  /* Trier ou changer d'année remet la lecture en haut : rester au millieu
     d'un classement qu'on vient de retourner n'a pas de sens. */
  useEffect(() => {
    cadre.current?.scrollTo({ top: 0 });
  }, [col, sens, lignes]);

  const a = Math.min(fen.a, Math.max(0, lignes.length - 1));
  const b = Math.min(fen.b, lignes.length);
  const nCol = colonnes.length + 2;

  /* La lueur suit le pointeur : deux propriétés écrites sur la ligne
     survolée, rien de plus. On nettoie en sortant pour qu'aucune ligne ne
     reste allumée derrière le curseur. */
  const suitLePointeur = useCallback((e: React.PointerEvent<HTMLTableSectionElement>) => {
    const tr = (e.target as HTMLElement).closest("tr") as HTMLElement | null;
    if (!tr || !tr.dataset.pays) return;
    const r = tr.getBoundingClientRect();
    if (allumee.current && allumee.current !== tr) allumee.current.classList.remove("cg-tab-suivi");
    tr.classList.add("cg-tab-suivi");
    tr.style.setProperty("--x", `${e.clientX - r.left}px`);
    allumee.current = tr;
  }, []);
  const eteint = useCallback(() => {
    allumee.current?.classList.remove("cg-tab-suivi");
    allumee.current = null;
  }, []);

  return (
    <div className="cg-tab-cadre" ref={cadre}>
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
        <tbody onPointerMove={suitLePointeur} onPointerLeave={eteint}>
          {a > 0 && (
            <tr className="cg-tab-cale" aria-hidden="true">
              <td colSpan={nCol} style={{ height: a * haut }} />
            </tr>
          )}
          {lignes.slice(a, b).map((r, i) => (
            <tr
              key={r.nom}
              data-pays={r.nom}
              className={choisi === r.nom ? "cg-tab-on" : undefined}
              onClick={() => onChoisi(r.nom)}
            >
              <td className="cg-tab-r">{String(a + i + 1).padStart(2, "0")}</td>
              <td className="cg-tab-p">{r.fr}</td>
              {colonnes.map((c) => (
                <td key={c.id} className={r[c.id] === null ? "cg-tab-vide" : undefined}>
                  {val(r[c.id], c.unite)}
                </td>
              ))}
            </tr>
          ))}
          {b < lignes.length && (
            <tr className="cg-tab-cale" aria-hidden="true">
              <td colSpan={nCol} style={{ height: (lignes.length - b) * haut }} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});

export function EconomiePage({ socle, sources, articles, faq }: EcoProps) {
  /* La page ne connaît qu'une année : celle qu'elle affiche. L'année visée
     pendant qu'on glisse appartient à la frise, et n'en sort qu'une fois le
     geste posé — c'est ce qui l'empêche de redessiner le globe à chaque
     pixel. */
  const [annee, setAnnee] = useState(socle.annees[socle.annees.length - 1]);

  const [col, setCol] = useState<Col>("pib");
  /* La métrique du globe et la colonne triée sont liées : cliquer « Dette »
     sur le globe trie le classement sur la dette, et l'inverse aussi. C'est
     ce que faisait la carte du site, et c'est ce qui évite deux états qui
     racontent deux choses. */
  const [metrique, setMetrique] = useState<EconomyMetricId>("gdp");
  const [sens, setSens] = useState<1 | -1>(-1);
  const [filtre, setFiltre] = useState("");
  const bande = useVu();
  const [qArticle, setQArticle] = useState("");
  const [choisi, setChoisi] = useState<string | null>("France");
  const [ouvert, setOuvert] = useState<number | null>(0);
  const rail = useRef<HTMLDivElement>(null);
  const rail2 = useRef<HTMLDivElement>(null);
  const prise2 = useRef<{ x: number; g: number } | null>(null);
  const tire = useRef(false);

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
     navigateur seize dates entiers. */
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

  /* La série du pays choisi, date par date, pour la courbe. Une
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
        {/* Une ouverture courte et centrée. Un titre sur deux lignes, une
            phrase, et l'on est dans la matière. Le grand bloc de texte et la
            rangée de compteurs qui occupaient cet espace disaient beaucoup
            avant d'avoir rien montré — et les compteurs prenaient des images
            au glissement de la frise, juste en dessous. */}
        <div className="cg-eco-lueur" aria-hidden="true" />
        <div className="cg-wrap">
          <Monte>
            <div className="cg-eco-ouv">
              <p className="cg-eyebrow">Économie</p>
              <h1 className="cg-h1 cg-eco-h1">
                <Titre texte="Le socle économique" />
              </h1>
              <p className="cg-chapo cg-eco-ouv-c">
                {socle.pays.length} pays, {socle.annees[0]}–
                {socle.annees[socle.annees.length - 1]}, dix indicateurs.
              </p>
            </div>
          </Monte>
        </div>
      </section>

      {/* ── Le globe, sa frise et ses raccourcis ─────────────────────────── */}
      <section className="cg-section cg-eco-globe">
        <div className="cg-wrap">
          <Enseigne droite={<span className="cg-demo-mini">Banque mondiale (WDI) · FMI</span>}>
            Le globe, {annee}
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
            sousLeGlobe={<Frise annees={socle.annees} valeur={annee} onAnnee={setAnnee} />}
          />
        </div>
      </section>

      <div className="cg-wrap cg-an-bande">
        <Annonce format="bande" />
      </div>

      {/* ── Le classement ────────────────────────────────────────────────── */}
      {/* Une bande claire, de bord à bord, qui s'ouvre au défilement. Après
          trois sections de nuit, c'est la rupture franche qui dit « ici on
          compare » — et un tableau de chiffres se lit mieux sur du clair.
          Le titre et son sélecteur sont centrés ; le tableau vient dessous,
          dans un bloc arrondi posé au milieu de la bande. */}
      {/* L'ouverture est une transition CSS pilotée par un attribut, pas une
          animation JavaScript : elle ne dépend d'aucune boucle de rendu, elle
          rejoue dans les deux sens à chaque passage, et elle ne coûte rien
          pendant que le globe occupe le processeur. */}
      <section
        ref={bande.ref as React.RefObject<HTMLElement>}
        className="cg-bande"
        data-vu={bande.vu ? "1" : "0"}
      >
        <div className="cg-bande-h">
          <h2 className="cg-bande-t">
            Le classement
          </h2>
          <p className="cg-bande-c">
            {socle.pays.length} pays, {socle.annees.length} dates, dix indicateurs. Choisissez
            une année, triez la colonne qui vous intéresse.
          </p>

          <div className="cg-bande-ctrl">
            <label className="cg-an-choix">
              <span className="cg-an-choix-l">Date</span>
              <select
                value={annee}
                onChange={(e) => setAnnee(Number(e.target.value))}
                aria-label="Date du classement"
              >
                {[...socle.annees].reverse().map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
            <input
              className="cg-filtre cg-filtre-clair"
              type="search"
              placeholder="Filtrer un pays"
              value={filtre}
              onChange={(e) => setFiltre(e.target.value)}
              aria-label="Filtrer un pays"
            />
          </div>
        </div>

        <div className="cg-bande-bloc">
          <Tableau
            lignes={tries}
            colonnes={colonnes}
            col={col}
            sens={sens}
            choisi={choisi}
            onChoisi={setChoisi}
            onTrier={trier}
          />
          <p className="cg-bande-n">
            {tries.length} pays affichés · un tiret signale une valeur que la source ne publie pas
            pour ce pays cette année-là ; ces pays passent en fin de tri, ils ne sont pas classés
            derniers. Cliquez une ligne pour la retrouver sur le globe.
          </p>
        </div>
      </section>

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
                À lire aussi · {TOUTES.find((m) => m.id === metrique)?.label}
              </p>
              <div className="cg-recos-l">
                {recos.map((a) => (
                  <button key={a.slug} type="button" className="cg-reco">
                    <span className="cg-reco-n">
                      {a.rubrique.toUpperCase()} · {a.duree}
                    </span>
                    <span className="cg-reco-t">{a.titre}</span>
                    <span className="cg-reco-m">Lire →</span>
                  </button>
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

      {/* ── La méthode et les sources ────────────────────────────────────── */}
      <section className="cg-section cg-methode2">
        <div className="cg-wrap">
          <Enseigne droite={<span className="cg-demo-mini">{sources.length} indicateurs</span>}>
            D&apos;où viennent ces chiffres
          </Enseigne>

          <div className="cg-meth-l">
            <article className="cg-meth">
              <span className="cg-meth-n">01</span>
              <h3 className="cg-meth-t">Une seule base</h3>
              <p className="cg-meth-c">
                Chaque indicateur est rangé par pays et par date, sous son code ISO3, avec sa
                source. Rien n&apos;est saisi deux fois : le chiffre que vous lisez sur le globe est
                le même objet que celui du classement et celui de la courbe.
              </p>
            </article>
            <article className="cg-meth">
              <span className="cg-meth-n">02</span>
              <h3 className="cg-meth-t">Une absence reste une absence</h3>
              <p className="cg-meth-c">
                Une année qu&apos;une source ne publie pas n&apos;est pas ramenée à zéro et
                n&apos;est pas devinée d&apos;après ses voisines. Le pays sort en gris sur le globe
                et porte un tiret au classement : il n&apos;est pas dernier, il n&apos;est pas
                classé.
              </p>
            </article>
            <article className="cg-meth">
              <span className="cg-meth-n">03</span>
              <h3 className="cg-meth-t">Ce qui est calculé le dit</h3>
              <p className="cg-meth-c">
                Le montant de la dette affiché ici est déduit du PIB et du ratio de dette, faute
                d&apos;une série annuelle mesurée. La couverture de chaque indicateur est donnée
                ci-dessous, telle qu&apos;elle est — sept dates ne se présentent pas comme
                soixante-six.
              </p>
            </article>
          </div>

          <div className="cg-sources">
            <p className="cg-sources-t">Les sources, indicateur par indicateur</p>
            <div className="cg-sources-l">
              {sources.map((s) => (
                <div key={s.libelle} className="cg-source">
                  <span className="cg-source-l">{s.libelle}</span>
                  <span className="cg-source-c">{s.couverture}</span>
                  <span className="cg-source-s">{s.source}</span>
                </div>
              ))}
            </div>
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

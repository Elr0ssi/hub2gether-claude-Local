"use client";

import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FicheArticle, FichePays } from "@/data/concept/conceptGeo";
import { type FicheDebat, type LigneSource, type SocleEco } from "@/data/concept/conceptEconomie";
import type { CountryEconomyData, EconomyMetricId, EconomyYear } from "@/types";
import { Dessin, Jetons } from "./Jetons";
import { Loupe } from "./Loupe";
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
  debats: FicheDebat[];
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
  if (v === null) return "n.d.";
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

/** Un nom de pays réduit à ce qui sert à le reconnaître dans une adresse. */
function cle(n: string) {
  return n
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Les indicateurs, sous le nom qu'on tape dans une adresse. */
const PAR_NOM: Record<string, EconomyMetricId> = {
  pib: "gdp",
  "pib-par-habitant": "gdp_per_capita",
  "balance-commerciale": "trade_balance",
  dette: "debt_ratio",
  "dette-montant": "debt_amount",
  inflation: "inflation",
  chomage: "unemployment",
  "population-active": "active_population",
  "age-retraite": "retirement_age",
  entreprises: "companies",
};
const VERS_NOM: Record<string, string> = Object.fromEntries(
  Object.entries(PAR_NOM).map(([n, id]) => [id, n]),
);

/**
 * La progression de l'ouverture : zéro quand elle tient l'écran, un quand
 * elle l'a quitté par le haut.
 *
 * Elle s'écrit directement dans le style de la section, sans passer par un
 * rendu React : le navigateur interpole tout le reste en CSS, à partir de
 * cette seule variable. Descendre et remonter sont donc le même mouvement,
 * joué dans un sens puis dans l'autre, et rien ne se rejoue d'un coup en
 * arrivant par le bas.
 *
 * La mesure se fait dans l'écouteur, comme pour `useVu` et pour la même
 * raison : une image d'animation de retard se voit sur cette page.
 */
function useProgression() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    let vivant = true;
    const regarde = () => {
      const n = ref.current;
      if (!n || !vivant) return;
      const r = n.getBoundingClientRect();
      /* La course : la hauteur de l'ouverture. Une course plus courte
         faisait disparaître les tuiles alors que l'ouverture tenait encore
         l'écran — le mouvement prenait de l'avance sur la lecture. */
      const course = Math.max(1, r.height);
      const p = Math.min(1, Math.max(0, -r.top / course));
      n.style.setProperty("--p", p.toFixed(3));
    };
    window.addEventListener("scroll", regarde, { passive: true });
    window.addEventListener("resize", regarde);
    regarde();
    return () => {
      vivant = false;
      window.removeEventListener("scroll", regarde);
      window.removeEventListener("resize", regarde);
    };
  }, []);
  return ref;
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
      <span className="cg-frise2-an">{vue}</span>

      <div className="cg-frise2-piste">
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
    <div
      className="cg-tab-cadre"
      ref={cadre}
      style={{ "--cg-tab-h": `${haut}px` } as React.CSSProperties}
    >
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

export function EconomiePage({ socle, sources, articles, debats, faq }: EcoProps) {
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
  const haut = useVu(260);
  const ouverture = useProgression();
  /* Les tuiles n'arrivent qu'une fois la page chargée. Les faire partir
     pendant que le globe monte sa scène, c'est les faire sauter : le fil
     d'exécution est pris ailleurs, et une animation qui démarre dans une
     image à deux cents millisecondes se voit par à-coups. */
  /* L'adresse pilote la première vue.
   *
   * « /economie?pays=france&indicateur=pib&annee=2025 » ouvre la page sur la
   * France, le produit intérieur brut et 2025, et descend jusqu'au globe.
   * C'est ce qui permet à un moteur d'envoyer quelqu'un sur la réponse qu'il
   * cherchait plutôt qu'en haut d'une page longue.
   *
   * La lecture se fait au montage, dans le navigateur, et non par les
   * paramètres de rendu : la page reste entièrement statique, donc servie
   * depuis le cache pour tout le monde, quelle que soit l'adresse demandée.
   */
  const [pret, setPret] = useState(false);
  const arrivee = useRef(false);
  useEffect(() => {
    const lance = () => requestAnimationFrame(() => setPret(true));
    if (document.readyState === "complete") {
      lance();
      return;
    }
    window.addEventListener("load", lance);
    return () => window.removeEventListener("load", lance);
  }, []);
  const [qArticle, setQArticle] = useState("");
  const [choisi, setChoisi] = useState<string | null>("France");
  const [ouvert, setOuvert] = useState<number | null>(0);

  /* ── L'adresse, lue une fois puis tenue à jour ───────────────────────── */
  useEffect(() => {
    if (arrivee.current) return;
    arrivee.current = true;
    const q = new URLSearchParams(window.location.search);

    const p = q.get("pays");
    if (p) {
      const k = cle(p);
      const t = socle.pays.find((x) => cle(x.nom) === k || cle(x.fr) === k);
      if (t) setChoisi(t.nom);
    }

    const i = q.get("indicateur");
    if (i && PAR_NOM[cle(i)]) {
      const m = PAR_NOM[cle(i)];
      setMetrique(m);
      setCol((COLONNES.find((c) => c.id === (CHAMP_DE[m] as Col))?.id ?? "pib") as Col);
    }

    const a = Number(q.get("annee"));
    if (Number.isFinite(a) && socle.annees.includes(a)) setAnnee(a);

    /* On ne descend que si l'adresse demandait quelque chose : sans cela une
       visite ordinaire sauterait par-dessus l'ouverture. */
    if (p || i || q.get("annee")) {
      window.requestAnimationFrame(() =>
        document.getElementById("globe")?.scrollIntoView({ block: "start" }),
      );
    }
  }, [socle]);

  /* Le lien reste partageable : ce qu'on regarde est dans l'adresse, sans
     jamais empiler d'entrées dans l'historique. */
  useEffect(() => {
    if (!arrivee.current) return;
    const q = new URLSearchParams();
    if (choisi) q.set("pays", cle(socle.pays.find((x) => x.nom === choisi)?.fr ?? choisi));
    if (VERS_NOM[metrique]) q.set("indicateur", VERS_NOM[metrique]);
    q.set("annee", String(annee));
    window.history.replaceState(null, "", `${window.location.pathname}?${q}`);
  }, [choisi, metrique, annee, socle]);
  const rail = useRef<HTMLDivElement>(null);
  const rail2 = useRef<HTMLDivElement>(null);
  const rail3 = useRef<HTMLDivElement>(null);
  const prise2 = useRef<{ x: number; g: number } | null>(null);
  const prise3 = useRef<{ x: number; g: number } | null>(null);
  const tire = useRef(false);

  /* Les lignes de l'année, reconstituées depuis le format compact. Les
     colonnes dépendent de la date : une date qui ne publie pas un indicateur
     ne lui réserve pas de place. */
  const rangs = useMemo<Rang[]>(() => {
    const l = socle.lignes[annee] ?? [];
    const place = socle.cols[annee] ?? {};
    return l.map((ligne) => {
      const p = socle.pays[ligne[0] as number];
      const v = (c: string) => {
        const i = place[c];
        const x = i === undefined ? null : ligne[i];
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
      const i = (socle.cols[a] ?? {})[c];
      const l = i === undefined ? undefined : (socle.lignes[a] ?? []).find((x) => x[0] === idx);
      const v = l ? l[i] : null;
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

  /* « D'où viennent ces chiffres » n'était pas une section : c'est une
     question, et elle se range avec les autres. Les trois principes la
     suivent, et les sources ferment la page. */
  const questions = useMemo<{ question: string; answer: string; tableau?: boolean }[]>(
    () => [
      ...faq,
      {
        question: "D'où viennent ces chiffres ?",
        answer:
          "D'une seule base. Chaque indicateur y est rangé par pays et par date, sous son code ISO3, avec sa source. Rien n'est saisi deux fois : le chiffre que vous lisez sur le globe est le même objet que celui du classement et celui de la courbe. Le détail source par source est donné au bas de cette page.",
      },
      {
        question: "Que se passe-t-il quand une donnée manque ?",
        answer:
          "Rien ne la remplace. Une année qu'une source ne publie pas n'est pas ramenée à zéro et n'est pas devinée d'après ses voisines. Le pays sort en gris sur le globe et porte la mention « n.d. » au classement : il n'est pas dernier, il n'est pas classé.",
      },
      {
        question: "Tous les chiffres sont-ils mesurés ?",
        answer:
          "Non, et ceux qui ne le sont pas le disent. Le montant de la dette affiché ici est déduit du PIB et du ratio de dette, faute d'une série annuelle mesurée. La couverture de chaque indicateur est donnée telle qu'elle est dans la question suivante : sept dates ne s'y présentent pas comme soixante-six.",
      },
    ],
    [faq],
  );

  /* La FAQ posait déjà la question des sources : le tableau se range dans sa
     réponse plutôt que d'ouvrir une seconde question qui dirait la même
     chose. S'il n'y en avait pas, on en ajouterait une. */
  const questionsVues = useMemo(() => {
    const i = questions.findIndex((q) => /sources/i.test(q.question));
    if (i >= 0) {
      const l = [...questions];
      l[i] = { ...l[i], tableau: true };
      /* Elle ferme la page : c'est là qu'on vient vérifier. */
      const [src] = l.splice(i, 1);
      l.push(src);
      return l;
    }
    return [
      ...questions,
      {
        question: "Quelles sont nos sources ?",
        answer:
          "Indicateur par indicateur, l'institution qui publie la donnée, la référence exacte de la série, les dates couvertes et le nombre de pays renseignés.",
        tableau: true,
      },
    ];
  }, [questions]);

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
      <Loupe />

      {/* ── L'ouverture ──────────────────────────────────────────────────── */}
      {/* L'ouverture occupe la page. Rien d'autre que le titre, et en bas un
          arc de cercle qui ferme l'écran comme un horizon : c'est lui qui dit
          que la page continue, et il s'allume quand on descend vers le
          globe. */}
      <section
        ref={ouverture as React.RefObject<HTMLElement>}
        className="cg-section cg-eco-haut"
        data-vu={haut.vu ? "1" : "0"}
        data-pret={pret ? "1" : "0"}
      >
        <div className="cg-eco-lueur" aria-hidden="true" />
        <Jetons />
        <div className="cg-wrap">
          <div className="cg-eco-ouv">
            {/* Le sceau : la tuile du milieu, plus grande que les autres et
                seule à porter un cerne. C'est le point de fuite du champ —
                tout s'écarte de lui quand on descend, tout y revient quand
                on remonte. */}
            <span className="cg-sceau" aria-hidden="true">
              <span className="cg-sceau-i">
                <Dessin f="courbe" />
              </span>
            </span>
            {/* Le mot seul tient le titre. « Le socle économique » disait au
                lecteur comment on appelle la page en interne, pas ce qu'elle
                traite ; le sur-titre, lui, portait déjà le sujet, en petit et
                sans être un titre. Ils échangent leurs rôles, et le mot que
                les moteurs cherchent devient le titre de premier niveau. */}
            <h1 className="cg-eco-titre">
              <Titre texte="Économie" />
            </h1>
            <p className="cg-chapo cg-eco-ouv-c">
              {socle.pays.length} pays, {socle.annees[0]}&ndash;
              {socle.annees[socle.annees.length - 1]}, dix indicateurs.
            </p>
          </div>
        </div>
        <div className="cg-arc" aria-hidden="true">
          <span className="cg-arc-corps" />
          <span className="cg-arc-trait" />
          <span className="cg-arc-nappe" />
          {/* Le point du jour, posé sur le limbe : c'est lui qui donne
              l'échelle et qui dit d'où vient la lumière. */}
          <span className="cg-arc-point" />
        </div>
      </section>

      {/* Le témoin que l'arc regarde : dès qu'il entre dans l'écran, l'arc
          s'allume et s'ouvre. */}
      <div ref={haut.ref as React.RefObject<HTMLDivElement>} className="cg-temoin" aria-hidden="true" />

      {/* ── Le globe, sa frise et ses raccourcis ─────────────────────────── */}
      <section id="globe" className="cg-section cg-eco-globe">
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
            {tries.length} pays affichés · « n.d. » signale une valeur que la source ne publie pas
            pour ce pays cette année-là ; ces pays passent en fin de tri, ils ne sont pas classés
            derniers. Cliquez une ligne pour la retrouver sur le globe.
          </p>
        </div>
      </section>

      {/* ── Les articles ─────────────────────────────────────────────────── */}
      <section className="cg-section cg-lectures">
        <div className="cg-wrap">
          <div className="cg-arts-tete">
            <h2 className="cg-arts-h">Articles</h2>
            <input
              className="cg-filtre cg-filtre-gros"
              type="search"
              placeholder="Chercher un article"
              value={qArticle}
              onChange={(e) => setQArticle(e.target.value)}
              aria-label="Chercher un article"
            />
          </div>

          {articlesVus.length === 0 ? (
            <p className="cg-frise-n">Aucun article ne correspond à cette recherche.</p>
          ) : (
            /* Une lecture en grand à gauche, et à droite deux étages : les
               débats en cours au-dessus, la file des autres lectures en
               dessous. Le grand article tient la hauteur des deux. */
            <div className="cg-arts-l">
              <article className="cg-art cg-art-une">
                <ImagePlaceholder nom="IMAGE_PNG_ECO_01" ratio="16 / 10" />
                <span className="cg-rubrique">
                  {articlesVus[0].rubrique} · {articlesVus[0].duree}
                </span>
                <h3 className="cg-art-t">{articlesVus[0].titre}</h3>
                <p className="cg-art-c">{articlesVus[0].chapo}</p>
              </article>

              {debats.length > 0 && (
                <div className="cg-debats">
                  <div className="cg-debats-t">
                    <span>Nos plus gros débats</span>
                    <span className="cg-debats-n">{debats.length} en cours</span>
                  </div>
                  <div
                    ref={rail3}
                    className="cg-debats-l"
                    onPointerDown={(e) => {
                      prise3.current = { x: e.clientX, g: e.currentTarget.scrollLeft };
                      e.currentTarget.setPointerCapture(e.pointerId);
                    }}
                    onPointerMove={(e) => {
                      if (!prise3.current || !rail3.current) return;
                      rail3.current.scrollLeft = prise3.current.g - (e.clientX - prise3.current.x);
                    }}
                    onPointerUp={() => {
                      prise3.current = null;
                    }}
                    onPointerCancel={() => {
                      prise3.current = null;
                    }}
                  >
                    {debats.map((d) => (
                      <button key={d.id} type="button" className="cg-debat">
                        <span className="cg-debat-q">{d.question}</span>
                        <span className="cg-debat-a">{d.ancre}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="cg-arts-c">
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
                  {articlesVus.slice(1).map((a, k) => (
                    <article key={a.slug} className="cg-art">
                      <ImagePlaceholder nom={`IMAGE_PNG_ECO_0${((k + 1) % 9) + 1}`} ratio="16 / 9" />
                      <span className="cg-rubrique">
                        {a.rubrique} · {a.duree}
                      </span>
                      <h4 className="cg-art-t">{a.titre}</h4>
                    </article>
                  ))}
                </div>
                <div className="cg-arts-f" aria-hidden="true" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── La FAQ ───────────────────────────────────────────────────────── */}
      <section className="cg-section cg-questions">
        <div className="cg-wrap">
          <Enseigne>Les questions d&apos;économie</Enseigne>

          {/* Le balisage que les moteurs lisent. Il décrit les questions et
              leurs réponses telles qu'elles sont affichées — jamais autre
              chose, sous peine d'être traité comme une tromperie. Cette page
              du prototype n'est pas indexée ; le balisage est là pour que la
              page définitive n'ait rien à rattraper. */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: questionsVues.map((q) => ({
                  "@type": "Question",
                  name: q.question,
                  acceptedAnswer: { "@type": "Answer", text: q.answer },
                })),
              }),
            }}
          />
          <div className="cg-q-liste">
            {questionsVues.map((q, k) => {
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
                        {"tableau" in q && q.tableau && (
                          <table className="cg-src-t">
                            <caption className="cg-src-c">
                              Sources des indicateurs économiques, telles que la base les
                              enregistre
                            </caption>
                            <thead>
                              <tr>
                                <th scope="col">Indicateur</th>
                                <th scope="col">Source</th>
                                <th scope="col">Couverture</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sources.map((o) => (
                                <tr key={o.libelle}>
                                  <th scope="row">{o.libelle}</th>
                                  <td>{o.source}</td>
                                  <td className="cg-src-n">{o.couverture}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
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

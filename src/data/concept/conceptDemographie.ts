import { CAUSES_MORTALITE, DEMOGRAPHY_YEARS, SOURCES_SOCLE_DEMO } from "@/data/demographie/demographie";
import { countryFr } from "@/data/countryNamesFr";
import { EPIDEMICS_ARTICLES } from "@/data/articles";
import type { FicheArticle } from "./conceptGeo";
import type { FicheDebat } from "./conceptEconomie";

/**
 * Le socle démographique, préparé pour le prototype.
 *
 * Même principe que le socle économique : aucune donnée n'est réécrite, la
 * base des Nations Unies traverse telle quelle, année par année. Le format
 * compact laisse la frise passer de 1960 à 2026 sans aller-retour serveur.
 */

export type Ligne = (number | null)[];

export interface SocleDemo {
  annees: number[];
  pays: { nom: string; fr: string }[];
  cols: Record<number, Record<string, number>>;
  lignes: Record<number, Ligne[]>;
}

/* Les grandeurs comparables d'un pays à l'autre — le nombre de naissances
   et de décès par seconde ne le sont pas, ce sont les compteurs en direct
   qui s'en servent, pas le classement. */
const CHAMPS: [string, number][] = [
  ["population", 0],
  ["birth_rate", 2],
  ["death_rate", 2],
  ["natural_change", 0],
  ["net_migration", 0],
  ["births_annual", 0],
  ["deaths_annual", 0],
  ...CAUSES_MORTALITE.map((c): [string, number] => [`${c}_annual`, 0]),
];

export function socleDemo(): SocleDemo {
  const index = new Map<string, number>();
  const pays: SocleDemo["pays"] = [];
  const lignes: Record<number, Ligne[]> = {};
  const cols: Record<number, Record<string, number>> = {};

  for (const y of DEMOGRAPHY_YEARS) {
    const fiches = Object.entries(y.countries);

    const publies = CHAMPS.filter(([c]) =>
      fiches.some(([, d]) => {
        const v = (d as Record<string, number | undefined>)[c];
        return v !== undefined && Number.isFinite(v);
      }),
    );
    const place: Record<string, number> = {};
    publies.forEach(([c], i) => {
      place[c] = i + 1;
    });

    const l: Ligne[] = [];
    for (const [nom, d] of fiches) {
      let id = index.get(nom);
      if (id === undefined) {
        id = pays.length;
        index.set(nom, id);
        pays.push({ nom, fr: countryFr(nom) });
      }
      const vals = publies.map(([c, dec]) => {
        const v = (d as Record<string, number | undefined>)[c];
        if (v === undefined || !Number.isFinite(v)) return null;
        const p = Math.pow(10, dec);
        return Math.round(v * p) / p;
      });
      if (vals.every((v) => v === null)) continue;
      l.push([id, ...vals]);
    }
    lignes[y.year] = l;
    cols[y.year] = place;
  }

  return { annees: DEMOGRAPHY_YEARS.map((y) => y.year), pays, cols, lignes };
}

/* ── Le bandeau en temps réel ────────────────────────────────────────────── */

export interface CompteurDemo {
  annee: number;
  population: number;
  naissancesParSeconde: number;
  decesParSeconde: number;
  nPays: number;
}

/** La dernière année publiée, sommée sur tous les pays du socle : c'est la
    base et le débit du compteur de population en direct. */
export function compteurDemo(): CompteurDemo {
  const y = DEMOGRAPHY_YEARS[DEMOGRAPHY_YEARS.length - 1];
  let population = 0;
  let naissances = 0;
  let deces = 0;
  let n = 0;
  for (const d of Object.values(y.countries)) {
    if (typeof d.population === "number") {
      population += d.population;
      n += 1;
    }
    if (typeof d.births_per_second === "number") naissances += d.births_per_second;
    if (typeof d.deaths_per_second === "number") deces += d.deaths_per_second;
  }
  return { annee: y.year, population, naissancesParSeconde: naissances, decesParSeconde: deces, nPays: n };
}

export interface LigneSourceDemo {
  libelle: string;
  source: string;
}

export function sourcesDemo(): LigneSourceDemo[] {
  return Object.values(SOURCES_SOCLE_DEMO).map((f) => ({ libelle: f.libelle, source: f.source }));
}

/* ── Les articles ────────────────────────────────────────────────────────── */

/* Le site n'a pas de rubrique « Démographie » : les épidémies sont ce qui
   s'en approche le plus, population et mortalité au cœur de chaque texte.
   On les affiche donc sous leur vraie rubrique, Épidémies — ce sont ces
   articles-là, pas des textes redécoupés pour l'occasion. */
export function articlesDemo(n = 9): FicheArticle[] {
  return [...EPIDEMICS_ARTICLES]
    .sort((a, b) => {
      const f = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      return f !== 0 ? f : (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
    })
    .slice(0, n)
    .map((a) => ({
      slug: a.slug,
      titre: a.title,
      chapo: a.excerpt,
      rubrique: "Épidémies",
      duree: a.readingTime ? `${a.readingTime} min` : "durée inconnue",
      mots: [...(a.tags ?? []), a.title].join(" · ").toLowerCase(),
    }));
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA FAQ DÉMOGRAPHIE

   Une seule base derrière ces réponses — les Nations Unies, pas dix sources
   à arbitrer comme sur la page Économie — mais la même honnêteté : ce qui
   est mesuré, ce qui est projeté, ce qui manque et reste absent plutôt que
   ramené à zéro.
   ═══════════════════════════════════════════════════════════════════════════ */

export function faqDemo(): { question: string; answer: string }[] {
  return [
    {
      question: "Combien de personnes vivent sur Terre, et comment ce chiffre avance-t-il ?",
      answer:
        "Le socle donne un total par pays et par année, publié par les Nations Unies. Pour l'année en cours, ce total n'est pas mesuré en direct : il part du dernier chiffre publié et avance au rythme des naissances et des décès de l'année, comptés depuis le 1er janvier. C'est une projection à débit constant, pas une mesure seconde par seconde — la page le dit à côté du compteur.",
    },
    {
      question: "Taux de natalité et nombre de naissances : pourquoi les deux ?",
      answer:
        "Le taux, pour mille habitants, compare des pays de toute taille sur un pied d'égalité. L'effectif, le nombre brut de naissances, dit ce qui se produit réellement sur le terrain — un pays au taux modeste peut compter plus de naissances qu'un petit pays au taux élevé. Les deux sont sur le globe, dans la même famille d'indicateurs, pour ne pas avoir à choisir.",
    },
    {
      question: "Pourquoi un bouton « pour 100 000 habitants » seulement sur la mortalité ?",
      answer:
        "Un effectif brut de décès par cancer ou par accident de la route classe surtout les pays les plus peuplés en tête, quelle que soit leur situation réelle. Rapporté à 100 000 habitants, deux pays de taille très différente se comparent enfin sur la même échelle. Les causes détaillées — cancer, suicide, homicide, route, diabète, mortalité maternelle — ne remontent que depuis 1990 dans la base : les années antérieures restent grises sur cette famille, elles ne sont pas comptées pour zéro.",
    },
    {
      question: "Accroissement naturel et solde migratoire, quelle différence ?",
      answer:
        "L'accroissement naturel est l'écart entre les naissances et les décès d'un pays : ce qu'il produit lui-même, sans personne qui entre ou qui sorte. Le solde migratoire compte les arrivées moins les départs. Une population peut croître alors que son accroissement naturel est négatif, portée par la migration — et inversement. Le globe les affiche comme deux indicateurs distincts, jamais fondus en un seul chiffre.",
    },
    {
      question: "D'où viennent ces chiffres, et que se passe-t-il quand l'un d'eux manque ?",
      answer:
        "D'une seule base : les Nations Unies, World Population Prospects 2024. Une année qu'elle ne publie pas pour un pays reste absente — elle n'est ni devinée d'après ses voisines, ni ramenée à zéro. Le pays sort en gris sur le globe et porte la mention « n.d. » au classement : il n'est pas dernier, il n'est pas classé. Le détail par indicateur est donné au bas de cette page.",
    },
  ];
}

/* ═══════════════════════════════════════════════════════════════════════════
   LES DÉBATS DE DÉMOGRAPHIE

   Rédigés comme des arbitrages, pas des opinions attribuées à quelqu'un —
   même principe que les débats d'économie. Sans article dédié à pointer, ils
   restent volontairement sans chiffre inventé : l'ancre dit une tendance
   documentée, jamais un total précis qu'on ne mesure pas ici.
   ═══════════════════════════════════════════════════════════════════════════ */

const DEBATS_DEMO: FicheDebat[] = [
  {
    id: "vieillissement-mondial",
    question: "Le monde vieillit : faut-il reculer l'âge de la retraite partout ?",
    ancre: "Natalité en repli, espérance de vie en hausse",
    tags: ["Vieillissement", "Retraite"],
  },
  {
    id: "migration-compense",
    question: "Quand l'accroissement naturel recule, la migration doit-elle compenser ?",
    ancre: "Deux moteurs, un seul total de population",
    tags: ["Migration", "Population"],
  },
  {
    id: "pic-population",
    question: "La population mondiale va-t-elle vraiment plafonner ce siècle ?",
    ancre: "Croissance mondiale en net ralentissement",
    tags: ["Natalité", "Projection"],
  },
];

export function debatsDemo(): FicheDebat[] {
  return DEBATS_DEMO;
}

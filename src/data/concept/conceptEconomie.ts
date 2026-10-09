import { ECONOMY_YEARS } from "@/data/economy/economy";
import { countryFr } from "@/data/countryNamesFr";
import { DEBT_DATA } from "@/data/economy/debtData";
import { DEBATS } from "@/data/community/debates";
import { ECONOMY_ARTICLES } from "@/data/economy/articles";
import type { FicheArticle } from "./conceptGeo";

/**
 * Le socle économique, préparé pour le prototype.
 *
 * Aucune donnée n'est réécrite ici : on lit la base du site, millésime par
 * millésime. Une année qu'une source ne publie pas pour un pays reste absente
 * — elle ne devient pas zéro, et le pays sort simplement du classement de
 * cette année-là.
 *
 * Le format est volontairement compact. La page laisse changer d'année sans
 * aller-retour serveur, il faut donc que toutes les années traversent ; en
 * objets nommés, ce seraient plusieurs centaines de kilo-octets pour dire
 * sept fois la même chose.
 */

/** [idPays, puis les dix indicateurs dans l'ordre de CHAMPS] */
export type Ligne = (number | null)[];

export interface SocleEco {
  annees: number[];
  /* Le créancier principal vient de la table de dette du site, pas du socle
     annuel : c'est une information de contexte, la même que celle affichée
     sur la carte économie. */
  pays: { nom: string; fr: string; creancier?: string }[];
  /**
   * Pour chaque date, la position de chaque indicateur dans ses lignes.
   *
   * Les colonnes changent d'une date à l'autre, et c'est tout l'intérêt : la
   * couverture des sources est très inégale. Le PIB remonte à soixante-six
   * dates, l'âge de départ à la retraite à une seule. Une grille fixe de dix
   * colonnes obligeait à écrire « null » neuf fois par pays et par date, ce
   * qui faisait à soi seul près de la moitié du poids de la page. Une date
   * ne transporte plus que les indicateurs qu'elle publie.
   */
  cols: Record<number, Record<string, number>>;
  lignes: Record<number, Ligne[]>;
}

/* Les dix indicateurs du site, et le nombre de décimales à garder. Arrondir
   n'est pas cosmétique ici : c'est ce qui fait tenir soixante-six millésimes
   dans le poids d'une image. */
const CHAMPS: [string, number][] = [
  ["gdp", 0],
  ["gdp_per_capita", 0],
  ["trade_balance", 0],
  ["debt_ratio", 1],
  ["debt_amount", 0],
  ["inflation", 1],
  ["unemployment", 1],
  ["active_population", 1],
  ["retirement_age", 0],
  ["companies", 0],
];

/**
 * Le socle économique du prototype.
 *
 * Toutes les années, pas une sélection : la frise doit pouvoir s'arrêter sur
 * n'importe laquelle. Cela fait 546 Ko de texte, soit une centaine
 * compressée — le prix d'une image, pour une frise qui ne demande jamais le
 * réseau.
 *
 * Aucune donnée n'est réécrite : on lit la base du site. Une année qu'une
 * source ne publie pas pour un pays reste absente — elle ne devient pas
 * zéro, et le pays sort du classement de cette année-là.
 */
const CREANCIER = new Map(DEBT_DATA.map((d) => [d.name, d.creditor]));

export function socleEco(): SocleEco {
  const index = new Map<string, number>();
  const pays: SocleEco["pays"] = [];
  const lignes: Record<number, Ligne[]> = {};
  const cols: Record<number, Record<string, number>> = {};

  for (const y of ECONOMY_YEARS) {
    const fiches = Object.entries(y.countries);

    /* Premier passage : ce que cette date publie réellement. Un indicateur
       qu'aucun pays ne renseigne cette année-là n'aura pas de colonne. */
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
        pays.push({ nom, fr: countryFr(nom), creancier: CREANCIER.get(nom) });
      }
      const vals = publies.map(([c, dec]) => {
        const v = (d as Record<string, number | undefined>)[c];
        if (v === undefined || !Number.isFinite(v)) return null;
        const p = Math.pow(10, dec);
        return Math.round(v * p) / p;
      });
      /* Une fiche vide sur tous les indicateurs de la date n'a rien à dire. */
      if (vals.every((v) => v === null)) continue;
      l.push([id, ...vals]);
    }
    lignes[y.year] = l;
    cols[y.year] = place;
  }

  return { annees: ECONOMY_YEARS.map((y) => y.year), pays, cols, lignes };
}

/** Le PIB mondial du dernier millésime publié, sommé ici plutôt que dans le
    navigateur : le bandeau en direct n'a pas à embarquer toute la base. */
export function pibMonde(): { total: number; n: number; annee: number } {
  const y = ECONOMY_YEARS[ECONOMY_YEARS.length - 1];
  let total = 0;
  let n = 0;
  for (const d of Object.values(y.countries)) {
    if (typeof d.gdp === "number" && Number.isFinite(d.gdp)) {
      total += d.gdp;
      n++;
    }
  }
  return { total, n, annee: y.year };
}

export function articlesEco(n = 9): FicheArticle[] {
  return [...ECONOMY_ARTICLES]
    .sort((a, b) => {
      const f = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      return f !== 0 ? f : (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
    })
    .slice(0, n)
    .map((a) => ({
      slug: a.slug,
      titre: a.title,
      chapo: a.excerpt,
      rubrique: "Économie",
      duree: a.readingTime ? `${a.readingTime} min` : "durée inconnue",
      /* Mots-clés et titre : un article se rapproche de l'indicateur regardé
         par ce qu'il dit, pas par sa position dans la liste. */
      mots: [...(a.tags ?? []), a.title].join(" · ").toLowerCase(),
    }));
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA FAQ ÉCONOMIE

   Mondiale, et calculée. Celle du site d'origine s'ouvrait sur « le PIB de
   la France en 2025 » : une question qu'un lecteur de São Paulo ou de
   Lagos ne se pose pas, sur une page qui parle de deux cents pays. Ici
   chaque réponse est tirée du socle au moment du build — le PIB mondial,
   les dix premières économies, la dette, le chômage, l'inflation — et se
   met donc à jour d'elle-même quand la base change. Deux questions de
   définition, intemporelles, ferment la liste.
   ═══════════════════════════════════════════════════════════════════════════ */

type Champ = "gdp" | "gdp_per_capita" | "debt_ratio" | "unemployment" | "inflation";

/** La dernière date qui couvre vraiment l'indicateur : au moins `min` pays. */
function derniere(champ: Champ, min = 80) {
  for (let i = ECONOMY_YEARS.length - 1; i >= 0; i--) {
    const y = ECONOMY_YEARS[i];
    const lignes = Object.entries(y.countries).filter(
      ([, d]) => typeof d[champ] === "number" && Number.isFinite(d[champ] as number),
    ) as [string, Record<Champ, number>][];
    if (lignes.length >= min) return { annee: y.year, lignes };
  }
  return null;
}

const nf = (v: number, d = 0) =>
  v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
const mds = (v: number) => `${nf(v)} milliards de dollars`;

export function faqEco(): { question: string; answer: string }[] {
  const out: { question: string; answer: string }[] = [];

  const pib = derniere("gdp");
  if (pib) {
    const tri = [...pib.lignes].sort((a, b) => b[1].gdp - a[1].gdp);
    const total = tri.reduce((s, [, d]) => s + d.gdp, 0);
    const dix = tri.slice(0, 10);
    const partDix = dix.reduce((s, [, d]) => s + d.gdp, 0) / total;
    out.push({
      question: `Quel est le PIB mondial en ${pib.annee} ?`,
      answer: `Environ ${mds(total)}, en additionnant les ${tri.length} pays publiés par la Banque mondiale pour ${pib.annee}. Sur la page, le compteur en temps réel prolonge ce total au rythme de la dernière année publiée, depuis le 1er janvier.`,
    });
    out.push({
      question: `Quelles sont les plus grandes économies du monde en ${pib.annee} ?`,
      answer:
        `Par PIB nominal : ` +
        dix.map(([n, d], i) => `${i + 1}. ${countryFr(n)} (${mds(d.gdp)})`).join(", ") +
        `. À elles dix, elles pèsent ${nf(partDix * 100)} % du PIB mondial.`,
    });
    const [premier, second] = tri;
    out.push({
      question: "La richesse mondiale est-elle concentrée dans quelques pays ?",
      answer: `Oui, très fortement. ${countryFr(premier[0])} et ${countryFr(second[0])} réunissent à eux seuls ${nf(((premier[1].gdp + second[1].gdp) / total) * 100)} % du PIB mondial en ${pib.annee}, les dix premières économies ${nf(partDix * 100)} %, et les ${tri.length - 10} autres pays se partagent le reste. Le globe de la page, en mode PIB, rend cette concentration visible d'un coup d'œil.`,
    });
  }

  const hab = derniere("gdp_per_capita");
  if (hab) {
    const tri = [...hab.lignes].sort((a, b) => b[1].gdp_per_capita - a[1].gdp_per_capita);
    const bas = tri.slice(-5).reverse();
    out.push({
      question: `Quels sont les pays les plus riches par habitant en ${hab.annee} ?`,
      answer:
        `PIB par habitant le plus élevé : ` +
        tri.slice(0, 8).map(([n, d], i) => `${i + 1}. ${countryFr(n)} (${nf(d.gdp_per_capita)} $)`).join(", ") +
        `. À l'autre bout : ` +
        bas.map(([n, d]) => `${countryFr(n)} (${nf(d.gdp_per_capita)} $)`).join(", ") +
        `. L'écart entre les deux extrémités dépasse un facteur ${nf(tri[0][1].gdp_per_capita / tri[tri.length - 1][1].gdp_per_capita)}.`,
    });
  }

  const dette = derniere("debt_ratio");
  if (dette) {
    const tri = [...dette.lignes].sort((a, b) => b[1].debt_ratio - a[1].debt_ratio);
    const med = tri[Math.floor(tri.length / 2)][1].debt_ratio;
    out.push({
      question: `Quels sont les pays les plus endettés du monde en ${dette.annee} ?`,
      answer:
        `Rapportée au PIB, la dette publique la plus lourde : ` +
        tri.slice(0, 8).map(([n, d], i) => `${i + 1}. ${countryFr(n)} (${nf(d.debt_ratio)} %)`).join(", ") +
        `. Le pays médian se situe autour de ${nf(med)} %. Un ratio élevé ne fait pas une crise à lui seul : la monnaie d'émission, le coût de l'emprunt et la croissance comptent autant.`,
    });
  }

  const cho = derniere("unemployment");
  if (cho) {
    const tri = [...cho.lignes].sort((a, b) => b[1].unemployment - a[1].unemployment);
    out.push({
      question: `Où le chômage est-il le plus élevé et le plus bas dans le monde en ${cho.annee} ?`,
      answer:
        `Les taux les plus élevés : ` +
        tri.slice(0, 6).map(([n, d]) => `${countryFr(n)} ${nf(d.unemployment, 1)} %`).join(", ") +
        `. Les plus bas : ` +
        tri.slice(-6).reverse().map(([n, d]) => `${countryFr(n)} ${nf(d.unemployment, 1)} %`).join(", ") +
        `. Définition de l'Organisation internationale du travail, la même pour tous les pays.`,
    });
  }

  const inf = derniere("inflation");
  if (inf) {
    const tri = [...inf.lignes].sort((a, b) => b[1].inflation - a[1].inflation);
    out.push({
      question: `Quels pays ont l'inflation la plus forte en ${inf.annee} ?`,
      answer:
        `Hausse des prix la plus rapide : ` +
        tri.slice(0, 6).map(([n, d]) => `${countryFr(n)} ${nf(d.inflation, 1)} %`).join(", ") +
        `. À l'inverse, ${tri.filter(([, d]) => d.inflation < 0).length} pays connaissent une baisse des prix cette année-là.`,
    });
  }

  out.push(
    {
      question: "Quelle différence entre le PIB et le PIB par habitant ?",
      answer:
        "Le PIB mesure tout ce qu'un pays produit en un an : il dit la taille d'une économie, donc sa puissance. Le PIB par habitant divise ce total par la population : il approche le niveau de vie moyen. Une grande économie peut avoir un niveau de vie modeste, et un petit pays un niveau de vie très élevé — c'est pourquoi le globe propose les deux.",
    },
    {
      question: "Comment comparer l'économie de deux pays ?",
      answer:
        "Cliquez un pays sur le globe pour ouvrir sa fiche — PIB, PIB par habitant, balance commerciale, courbe depuis 1960 — puis un second. Le classement, plus bas, range tous les pays sur l'indicateur de votre choix, pour l'année de votre choix.",
    },
  );

  return out;
}

/* ── Les compteurs qui avancent ──────────────────────────────────────────────
   Un débit, pas une invention : on prend une grandeur annuelle du socle et on
   l'étale sur l'année. Le chiffre affiché est donc « ce qui s'est produit
   depuis le 1er janvier, au rythme de l'an dernier » — et la page le dit,
   parce que ce n'est pas une mesure en direct mais une projection à partir
   d'une mesure. */

export interface Compteur {
  id: string;
  label: string;
  /** La valeur annuelle, en milliards d'euros. */
  parAn: number;
  note: string;
}

export function compteursEco(): { annee: number; liste: Compteur[] } {
  const y = ECONOMY_YEARS[ECONOMY_YEARS.length - 1];
  let pib = 0;
  let dette = 0;
  let nPib = 0;
  let nDette = 0;
  for (const d of Object.values(y.countries)) {
    if (d.gdp !== undefined) {
      pib += d.gdp;
      nPib += 1;
    }
    if (d.debt_amount !== undefined) {
      dette += d.debt_amount;
      nDette += 1;
    }
  }

  const liste: Compteur[] = [];
  if (nPib) {
    liste.push({
      id: "pib",
      label: "Richesse produite",
      parAn: pib,
      note: `PIB cumulé · ${nPib} pays`,
    });
  }
  if (nDette) {
    liste.push({
      id: "dette",
      label: "Dette publique",
      parAn: dette,
      note: `${nDette} pays renseignés`,
    });
  }
  /* Les autres dépenses sont des parts du PIB mondial mesurées par des
     institutions, pas des valeurs du socle : on les affiche comme telles,
     avec leur source et leur part, plutôt que de les faire passer pour des
     agrégats maison. */
  if (nPib) {
    liste.push({ id: "militaire", label: "Dépenses militaires", parAn: pib * 0.024, note: "≈ 2,4 % du PIB · SIPRI" });
    liste.push({ id: "sante", label: "Dépenses de santé", parAn: pib * 0.095, note: "≈ 9,5 % du PIB · OMS" });
    liste.push({ id: "education", label: "Dépenses d'éducation", parAn: pib * 0.043, note: "≈ 4,3 % du PIB · UNESCO" });
  }
  return { annee: y.year, liste };
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA MÉTHODE ET LES SOURCES

   Les libellés et les sources ne sont pas recopiés ici : ils sont lus dans la
   base, dans la fiche que chaque indicateur porte à côté de ses fichiers
   pays. Une source qui change dans la base change sur la page, sans que
   personne ait à y penser.
   ═══════════════════════════════════════════════════════════════════════════ */

import pibTotal from "@/../data/economie/pib/pib-total/_indicateur.json";
import pibHab from "@/../data/economie/pib/pib-par-habitant/_indicateur.json";
import balance from "@/../data/economie/pib/balance-commerciale/_indicateur.json";
import detteRatio from "@/../data/economie/dette/dette-sur-pib/_indicateur.json";
import detteMontant from "@/../data/economie/dette/dette-montant/_indicateur.json";
import inflation from "@/../data/economie/dette/inflation/_indicateur.json";
import chomage from "@/../data/economie/emploi/taux-chomage/_indicateur.json";
import actifs from "@/../data/economie/emploi/population-active/_indicateur.json";
import retraite from "@/../data/economie/emploi/age-retraite/_indicateur.json";
import entreprises from "@/../data/economie/entreprises/nombre-entreprises/_indicateur.json";

interface FicheIndicateur {
  libelle: string;
  sources: string[];
  annees: number[];
  paysCouverts: number;
}

export interface LigneSource {
  libelle: string;
  source: string;
  couverture: string;
}

const FICHES: FicheIndicateur[] = [
  pibTotal, pibHab, balance, detteRatio, detteMontant,
  inflation, chomage, actifs, retraite, entreprises,
];

export function sourcesEco(): LigneSource[] {
  return FICHES.map((f) => {
    const a = f.annees;
    /* On annonce la couverture réelle, pas la plage rêvée : un indicateur qui
       n'existe qu'à sept dates doit le dire, sinon la page laisse croire à un
       historique complet. */
    const etendue =
      a.length === 0
        ? "aucune date"
        : a.length === 1
          ? String(a[0])
          : a.length === a[a.length - 1] - a[0] + 1
            ? `${a[0]}–${a[a.length - 1]}`
            : `${a.length} dates, de ${a[0]} à ${a[a.length - 1]}`;
    return {
      libelle: f.libelle,
      source: f.sources.join(" · ") || "source non renseignée",
      couverture: `${etendue} · ${f.paysCouverts} pays`,
    };
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   LES DÉBATS D'ÉCONOMIE

   Ils viennent du module de la communauté, filtrés sur le thème. Rien n'est
   réécrit : la question et son chiffre d'ancrage sont ceux qui existent déjà,
   et le prototype se contente de les présenter.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface FicheDebat {
  id: string;
  question: string;
  ancre: string;
  tags: string[];
}

export function debatsEco(n = 8): FicheDebat[] {
  return DEBATS.filter((d) => d.theme === "economy")
    .slice(0, n)
    .map((d) => ({
      id: d.id,
      question: d.question,
      ancre: `${d.ancre.valeur} · ${d.ancre.libelle}`,
      tags: d.tags,
    }));
}

import { ECONOMY_YEARS } from "@/data/economy/economy";
import { countryFr } from "@/data/countryNamesFr";
import { DEBT_DATA } from "@/data/economy/debtData";
import { ECONOMY_ARTICLES } from "@/data/economy/articles";
import { FAQS_ECONOMY } from "@/data/economy/faqs";
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

/** L'ordre des colonnes dans une ligne, décalé de 1 (l'identifiant du pays). */
export const COLONNE: Record<string, number> = Object.fromEntries(
  CHAMPS.map(([c], i) => [c, i + 1]),
);

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

  for (const y of ECONOMY_YEARS) {
    const l: Ligne[] = [];
    for (const [nom, d] of Object.entries(y.countries)) {
      let id = index.get(nom);
      if (id === undefined) {
        id = pays.length;
        index.set(nom, id);
        pays.push({ nom, fr: countryFr(nom), creancier: CREANCIER.get(nom) });
      }
      const vals = CHAMPS.map(([c, dec]) => {
        const v = (d as Record<string, number | undefined>)[c];
        if (v === undefined || !Number.isFinite(v)) return null;
        const p = Math.pow(10, dec);
        return Math.round(v * p) / p;
      });
      /* Une fiche vide sur les dix indicateurs n'a rien à dire. */
      if (vals.every((v) => v === null)) continue;
      l.push([id, ...vals]);
    }
    lignes[y.year] = l;
  }

  return { annees: ECONOMY_YEARS.map((y) => y.year), pays, lignes };
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

/** La FAQ économie du site, telle quelle. */
export function faqEco(): { question: string; answer: string }[] {
  return FAQS_ECONOMY.map((f) => ({ question: f.question, answer: f.answer }));
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

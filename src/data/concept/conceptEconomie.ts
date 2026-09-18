import { ECONOMY_YEARS } from "@/data/economy/economy";
import { countryFr } from "@/data/countryNamesFr";
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

/** [idPays, pib, pibHab, inflation, balance, dette, chômage] */
export type Ligne = (number | null)[];

export interface SocleEco {
  annees: number[];
  pays: { nom: string; fr: string }[];
  lignes: Record<number, Ligne[]>;
}

const CHAMPS = ["gdp", "gdp_per_capita", "inflation", "trade_balance", "debt_ratio", "unemployment"] as const;

/* Le socle couvre soixante-six millésimes. Les envoyer tous au navigateur
   ferait 412 Ko pour une page — plus que tout le reste réuni. On garde les
   jalons et le détail récent : c'est ce qu'une frise demande, et rien n'est
   inventé entre deux jalons puisqu'on n'interpole pas. */
const JALONS = new Set([
  1960, 1970, 1980, 1990, 1995, 2000, 2005, 2010, 2015, 2018, 2020, 2021, 2022, 2023, 2024, 2025,
]);

export function socleEco(): SocleEco {
  /* L'index des pays est commun à toutes les années : une ligne ne porte
     qu'un numéro, jamais un nom répété sept fois. */
  const index = new Map<string, number>();
  const pays: { nom: string; fr: string }[] = [];
  const lignes: Record<number, Ligne[]> = {};

  for (const y of ECONOMY_YEARS) {
    if (!JALONS.has(y.year)) continue;
    const l: Ligne[] = [];
    for (const [nom, d] of Object.entries(y.countries)) {
      let id = index.get(nom);
      if (id === undefined) {
        id = pays.length;
        index.set(nom, id);
        pays.push({ nom, fr: countryFr(nom) });
      }
      const vals = CHAMPS.map((c) => {
        const v = (d as Record<string, number | undefined>)[c];
        return v === undefined || !Number.isFinite(v) ? null : Math.round(v * 100) / 100;
      });
      /* Une fiche vide sur les six indicateurs n'a rien à dire : on ne
         l'envoie pas plutôt que de faire une ligne de tirets. */
      if (vals.every((v) => v === null)) continue;
      l.push([id, ...vals]);
    }
    lignes[y.year] = l;
  }

  return { annees: ECONOMY_YEARS.map((y) => y.year).filter((a) => JALONS.has(a)), pays, lignes };
}

/** Les articles d'économie du site, réduits aux champs affichés. */
export function articlesEco(n = 4): FicheArticle[] {
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
      duree: a.readingTime ? `${a.readingTime} min` : "—",
    }));
}

/** La FAQ économie du site, telle quelle. */
export function faqEco(): { question: string; answer: string }[] {
  return FAQS_ECONOMY.map((f) => ({ question: f.question, answer: f.answer }));
}

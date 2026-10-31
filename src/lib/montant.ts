import { convertirMontant, fiche, type Monnaie } from "@/data/finance/tauxChange";

/* Les montants des articles : écrits dans leur monnaie d'origine, affichés dans celle du lecteur. */

const nf = (v: number, d: number) => v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

/** Un montant en milliards, converti au taux moyen de l'année. Sans taux, on garde la monnaie d'origine. */
export function fmtMontant(v: number, source: Monnaie, annee: number, cible: Monnaie, d = 1): string {
  const c = convertirMontant(v, source, annee, cible);
  if (c === null) return `${nf(v, d)}\u00a0${fiche(source).suffixe}`;
  return `${nf(c, d)}\u00a0${fiche(cible).suffixe}`;
}

/** La même conversion, pour un montant en unités (par habitant) : « 58 300 € ». */
export function fmtUnitaire(v: number, source: Monnaie, annee: number, cible: Monnaie): string {
  const c = convertirMontant(v, source, annee, cible);
  if (c === null) return `${nf(v, 0)}\u00a0${fiche(source).unitaire}`;
  return `${nf(c, 0)}\u00a0${fiche(cible).unitaire}`;
}

/** Le nombre seul, pour un compteur qui anime sa valeur. */
export function valeurConvertie(v: number, source: Monnaie, annee: number, cible: Monnaie): { v: number; suffixe: string } {
  const c = convertirMontant(v, source, annee, cible);
  return c === null ? { v, suffixe: fiche(source).suffixe } : { v: c, suffixe: fiche(cible).suffixe };
}

/* ── La monnaie de l'article en cours ─────────────────────────────────────
   Les figures d'un article sont des fonctions de formatage appelées partout,
   sans crochet possible. La page pose la monnaie à chaque rendu (l'euro,
   monnaie d'origine, tant que le lecteur n'a rien choisi) ; tout ce qui
   s'en sert se redessine avec elle. */

let ARTICLE: Monnaie = "eur";
export const poserMonnaieArticle = (m: Monnaie) => {
  ARTICLE = m;
};
export const monnaieArticle = () => ARTICLE;

/** Un montant en milliards d'euros, dans la monnaie de l'article : « 3 536,1 Md€ ». */
export function mdArticle(v: number, d = 1, annee = 2025): string {
  return fmtMontant(v, "eur", annee, ARTICLE, d).replace(/Md[\s\u00a0]([€$])/, "Md$1");
}

/** Le nombre seul, pour une colonne dont l'en-tête porte l'unité. */
export function nombreArticle(v: number, d = 1, annee = 2025): string {
  const c = convertirMontant(v, "eur", annee, ARTICLE);
  return nf(c === null ? v : c, d);
}

/** L'unité d'un montant en milliards : « Md€ », « Md$ », « Md CN¥ ». */
export function uniteArticle(annee = 2025): string {
  const c = convertirMontant(1, "eur", annee, ARTICLE);
  return fiche(c === null ? "eur" : ARTICLE).suffixe.replace(/Md[\s\u00a0]([€$])/, "Md$1");
}

/** En toutes lettres, pour le texte courant : « 3 536,1 milliards d'euros ». */
export function mdMots(v: number, d = 1, annee = 2025): string {
  const c = convertirMontant(v, "eur", annee, ARTICLE);
  const mot = c === null || ARTICLE === "eur" ? "d'euros" : ARTICLE === "usd" ? "de dollars" : "de yuans";
  return `${nf(c === null ? v : c, d)}\u00a0milliards ${mot}`;
}

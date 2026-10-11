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

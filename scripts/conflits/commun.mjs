/* Lecture commune des données du module Conflits pour les scripts de contrôle et de rapport. */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const lire = (p) => JSON.parse(readFileSync(resolve(RACINE, p), "utf8"));

export const DATE_ARRET = "2026-10-31";
export const inventaire = lire("src/data/conflits/inventaire-2026-10-31.json");
export const enrichi = lire("src/data/conflits/enrichi.json");
export const paysIso = lire("src/data/conflits/pays-iso.json");
export const locaux = lire("src/data/conflits/chiffres-2026-10-31.json").dossiers;
export const evenements = lire("src/data/conflits/evenements-2026-10-31.json").evenements;
export const relations = lire("src/data/conflits/relations-diplomatiques.json");

export const FIABILITES = ["vérifié", "estimé", "revendiqué", "contesté"];
/** Une URL de tableau de bord ou de page d'accueil ne prouve aucun chiffre précis. */
export const generique = (url) => !url || /\/dashboard\/?$/.test(url) || /^https?:\/\/[^/]+\/?$/.test(url);

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
/** « 3 mars 2026 » / « mars 2026 » / « 2026 » / « juillet et septembre 2026 » → { annee, mois } (le premier mois cité). */
export function lireDateFr(t) {
  const a = t.match(/(\d{4})/);
  if (!a) return null;
  const pos = MOIS.map((m, i) => ({ i, p: t.toLowerCase().indexOf(m) })).filter((x) => x.p >= 0).sort((x, y) => x.p - y.p)[0];
  return { annee: Number(a[1]), mois: pos ? pos.i + 1 : null };
}

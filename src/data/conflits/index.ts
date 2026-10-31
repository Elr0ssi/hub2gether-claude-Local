import type { Categorie, Conflit, FicheConflit, Inventaire, Region } from "./types";
import { analyserZone, norm } from "./pays";
import { sourceFichier, type SourceConflits } from "./source";

export type { Categorie, Conflit, Inventaire, Region } from "./types";
export { norm } from "./pays";
export type { SourceConflits } from "./source";

/* ═══════════════════════════════════════════════════════════════════════════
   LES CONFLITS : LA LOGIQUE, SANS AUCUNE MISE EN PAGE

   Rapproche chaque fiche des pays du site, relie les fiches entre elles, indexe par pays, filtre.
   ═══════════════════════════════════════════════════════════════════════════ */

export const CATEGORIES: { id: Categorie; court: string; pluriel: string; couleur: string }[] = [
  { id: "Conflit armé", court: "Conflit armé", pluriel: "Conflits armés", couleur: "#e5484d" },
  { id: "Violences armées", court: "Violences armées", pluriel: "Violences armées", couleur: "#f08a24" },
  { id: "Tension géopolitique", court: "Tension géopolitique", pluriel: "Tensions géopolitiques", couleur: "#e8b923" },
];
export const COULEUR: Record<Categorie, string> = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.couleur])) as Record<Categorie, string>;
const RANG: Record<Categorie, number> = { "Conflit armé": 0, "Violences armées": 1, "Tension géopolitique": 2 };

/** Les régions, avec le cadrage du globe : centre et étendue en degrés. Un cadrage de présentation, pas une donnée. */
export const REGIONS: { id: Region | "Monde"; court: string; vue: { lat: number; lon: number; largeur: number; hauteur: number } | null }[] = [
  { id: "Monde", court: "Monde", vue: null },
  { id: "Europe", court: "Europe", vue: { lat: 49, lon: 22, largeur: 38, hauteur: 24 } },
  { id: "Moyen-Orient et Afrique du Nord", court: "Moyen-Orient et Afrique du Nord", vue: { lat: 29, lon: 33, largeur: 62, hauteur: 34 } },
  { id: "Afrique subsaharienne", court: "Afrique subsaharienne", vue: { lat: 2, lon: 22, largeur: 56, hauteur: 46 } },
  { id: "Asie et Pacifique", court: "Asie et Pacifique", vue: { lat: 22, lon: 98, largeur: 80, hauteur: 50 } },
  { id: "Amériques", court: "Amériques", vue: { lat: 8, lon: -78, largeur: 56, hauteur: 70 } },
];

export function preparer(inv: Inventaire): { inventaire: Inventaire; conflits: Conflit[] } {
  const parNom = new Map<string, FicheConflit>(inv.conflits.map((c) => [norm(c.nom), c]));
  const conflits: Conflit[] = inv.conflits.map((c) => {
    const { pays, reste } = analyserZone(c.zone);
    const parent = c.conflit_parent ? parNom.get(norm(c.conflit_parent)) : undefined;
    return { ...c, pays, paysRattaches: [], zonesNonPositionnees: reste, parent: parent?.id ?? null, enfants: [] };
  });
  const parId = new Map(conflits.map((c) => [c.id, c]));
  for (const c of conflits) if (c.parent) parId.get(c.parent)?.enfants.push(c.id);
  for (const c of conflits) if (!c.pays.length && c.parent) c.paysRattaches = parId.get(c.parent)?.pays ?? [];
  return { inventaire: inv, conflits };
}

export async function chargerConflits(source: SourceConflits = sourceFichier) {
  return preparer(await source.charger());
}

/** La même chose, de façon synchrone, pour le fichier du dépôt. */
export function conflitsDuFichier() {
  return preparer(sourceFichier.charger() as Inventaire);
}

export interface Filtre {
  region: Region | "Monde";
  categorie: Categorie | "Tous";
  recherche: string;
}

export function filtrer(liste: Conflit[], f: Filtre, nomPays: (en: string) => string): Conflit[] {
  const q = norm(f.recherche);
  return liste.filter((c) => {
    if (f.region !== "Monde" && c.region !== f.region) return false;
    if (f.categorie !== "Tous" && c.categorie !== f.categorie) return false;
    if (!q) return true;
    return (
      norm(c.nom).includes(q) ||
      norm(c.zone).includes(q) ||
      norm(c.acteurs).includes(q) ||
      c.pays.some((p) => norm(nomPays(p)).includes(q) || norm(p).includes(q))
    );
  });
}

/** Par pays : ses fiches, rangées par catégorie. Les fiches ne sont ni fusionnées ni sommées. */
export function indexerParPays(liste: Conflit[]): Map<string, Conflit[]> {
  const m = new Map<string, Conflit[]>();
  for (const c of liste) for (const p of c.pays.length ? c.pays : c.paysRattaches) m.set(p, [...(m.get(p) ?? []), c]);
  for (const [p, l] of m) m.set(p, l.sort((a, b) => RANG[a.categorie] - RANG[b.categorie] || a.nom.localeCompare(b.nom, "fr")));
  return m;
}

/** La catégorie la plus marquée d'un pays : elle donne sa teinte sur le globe, jamais un score. */
export function categorieDominante(l: Conflit[]): Categorie {
  return l.reduce((a, c) => (RANG[c.categorie] < RANG[a] ? c.categorie : a), l[0].categorie);
}

export function compter(liste: Conflit[]) {
  const parCategorie = Object.fromEntries(CATEGORIES.map((c) => [c.id, 0])) as Record<Categorie, number>;
  const parRegion: Record<string, number> = {};
  for (const c of liste) {
    parCategorie[c.categorie]++;
    parRegion[c.region] = (parRegion[c.region] ?? 0) + 1;
  }
  return { total: liste.length, parCategorie, parRegion };
}

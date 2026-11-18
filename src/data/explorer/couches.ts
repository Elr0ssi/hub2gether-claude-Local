import { Atom, Building2, Landmark, Mountain, Waves, type LucideIcon } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   L'ONGLET EXPLORER : LES COUCHES

   Une couche = un type d'éléments posés sur le globe. Ajouter une couche, c'est
   ajouter une ligne ici, une clé dans `public/explorer/points.json` (ou un fichier
   de tracés pour les lignes) et, au besoin, une mise en forme dans `detail`.

   `exemple: true` : les données de la couche sont FICTIVES (placeholders, générés
   par scripts/explorer/preparer.py). L'interface les signale comme telles ; on retire
   l'indicateur le jour où un dossier vérifié les remplace.
   ═══════════════════════════════════════════════════════════════════════════ */

export type CoucheId = "nucleaire" | "sieges" | "montagnes" | "villes" | "rivieres";

export interface Couche {
  id: CoucheId;
  nom: string;
  nomUn: string;
  icone: LucideIcon;
  couleur: string;
  exemple: boolean;
  /** Une phrase pour dire ce que la couche contient et d'où elle vient. */
  source: string;
  /** « points » (repères) ou « lignes » (tracés). */
  forme: "points" | "lignes";
}

export const COUCHES: Couche[] = [
  { id: "nucleaire", nom: "Centrales nucléaires", nomUn: "Centrale nucléaire", icone: Atom, couleur: "#f59e0b", exemple: true, forme: "points", source: "Données d'exemple : positions et puissances fictives, en attente d'un dossier vérifié." },
  { id: "sieges", nom: "Sièges sociaux", nomUn: "Siège social", icone: Building2, couleur: "#6366f1", exemple: true, forme: "points", source: "Données d'exemple : sociétés et chiffres d'affaires fictifs, placés dans de vraies grandes villes." },
  { id: "montagnes", nom: "Montagnes", nomUn: "Sommet", icone: Mountain, couleur: "#10b981", exemple: false, forme: "points", source: "Natural Earth : sommets nommés, avec leur altitude (sélection des principaux, pas l'intégralité)." },
  { id: "villes", nom: "Grandes villes", nomUn: "Ville", icone: Landmark, couleur: "#ec4899", exemple: false, forme: "points", source: "Natural Earth : capitales et villes de plus d'un million d'habitants." },
  { id: "rivieres", nom: "Rivières et fleuves", nomUn: "Cours d'eau", icone: Waves, couleur: "#3b82f6", exemple: false, forme: "lignes", source: "Natural Earth : tracés des principaux cours d'eau (échelle 1/50 millions)." },
];

export const COUCHE = Object.fromEntries(COUCHES.map((c) => [c.id, c])) as Record<CoucheId, Couche>;

/** Un repère posé sur le globe. */
export interface Repere {
  id: string;
  couche: CoucheId;
  nom: string;
  lat: number;
  lon: number;
  /** Le nom anglais Natural Earth du pays, clé de jointure avec les données du site. */
  pays: string | null;
  /** Ce qu'on lit sous le nom : « 4 808 m », « 1 300 MW », « Énergie · 245 Md$ ». */
  detail: string;
  /** Un nombre pour ranger les repères d'une même couche (le plus grand d'abord). */
  poids: number;
  /** Une couleur et une icône propres, quand le repère ne suit pas celles de sa couche (la page Conflits). */
  couleur?: string;
  icone?: LucideIcon;
}

export interface Riviere {
  n: string;
  p: string[];
  l: number[][][];
}

const nf = (v: number, d = 0) => v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

/** Le fichier points.json → des repères typés. */
export function lireRepères(brut: {
  montagnes: [string, number, number, number, string | null][];
  villes: [string, number, number, number, string | null, number][];
  nucleaire: [string, number, number, number, string][];
  sieges: [string, string, number, number, number, string, string][];
}): Repere[] {
  const r: Repere[] = [];
  brut.montagnes.forEach(([nom, alt, lat, lon, pays], i) =>
    r.push({ id: `m${i}`, couche: "montagnes", nom, lat, lon, pays, detail: `${nf(alt)} m`, poids: alt }),
  );
  brut.villes.forEach(([nom, pop, lat, lon, pays, cap], i) =>
    r.push({ id: `v${i}`, couche: "villes", nom, lat, lon, pays, detail: `${cap ? "Capitale · " : ""}${nf(pop / 1e6, pop >= 1e7 ? 0 : 1)} M hab.`, poids: pop + (cap ? 1e6 : 0) }),
  );
  brut.nucleaire.forEach(([nom, mw, lat, lon, pays], i) =>
    r.push({ id: `n${i}`, couche: "nucleaire", nom: `${nom}`, lat, lon, pays, detail: `${nf(mw)} MW`, poids: mw }),
  );
  brut.sieges.forEach(([nom, secteur, ca, lat, lon, pays, ville], i) =>
    r.push({ id: `s${i}`, couche: "sieges", nom, lat, lon, pays, detail: `${secteur} · ${ville} · ${nf(ca, 0)} Md$`, poids: ca }),
  );
  return r;
}

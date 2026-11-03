import type { EntreeIndex } from "./types";

/* ═══════════════════════════════════════════════════════════════════════════
   RESSOURCES : LE CATALOGUE

   L'arborescence des ressources du site et les noms français. Une ressource n'est ACTIVE que si un fichier importé existe
   (public/ressources/index.json) : les branches futures (énergie, minerais, eau et forêts) sont listées mais vides, jamais remplies.
   Ajouter un produit FAOSTAT : l'importer ; s'il est absent d'ici, il apparaît sous « Autres cultures » avec son nom FAOSTAT.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface RessourceCatalogue {
  /** Identifiant de fichier : « qcl-wheat ». */
  id: string;
  nomFr: string;
  nomFao: string;
}

export interface Famille {
  id: string;
  nom: string;
  /** Sous-familles (Céréales, Fruits à coque…). */
  enfants?: Famille[];
  ressources?: RessourceCatalogue[];
  /** Ressources prévues, sans données : on les montre comme « à venir », on ne les remplit pas. */
  aVenir?: string[];
}

export const CATALOGUE: Famille[] = [
  {
    id: "agriculture",
    nom: "Agriculture",
    enfants: [
      { id: "cereales", nom: "Céréales", ressources: [{ id: "qcl-wheat", nomFr: "Blé", nomFao: "Wheat" }] },
      { id: "fruits-a-coque", nom: "Fruits à coque", ressources: [{ id: "qcl-almonds-in-shell", nomFr: "Amandes en coque", nomFao: "Almonds, in shell" }] },
      { id: "oleagineux", nom: "Oléagineux", ressources: [] },
      { id: "autres-cultures", nom: "Autres cultures", ressources: [] },
    ],
  },
  { id: "energie", nom: "Énergie", aVenir: ["Pétrole", "Gaz naturel", "Charbon", "Uranium"] },
  { id: "minerais", nom: "Minerais", aVenir: ["Lithium", "Cuivre", "Fer", "Or", "Argent"] },
  { id: "eau-forets", nom: "Eau et forêts", aVenir: [] },
];

/** Les ressources du catalogue, à plat. */
export function ressourcesDuCatalogue(): (RessourceCatalogue & { chemin: string })[] {
  const out: (RessourceCatalogue & { chemin: string })[] = [];
  const parcourir = (f: Famille, chemin: string[]) => {
    for (const r of f.ressources ?? []) out.push({ ...r, chemin: [...chemin, f.nom].join(" → ") });
    for (const e of f.enfants ?? []) parcourir(e, [...chemin, f.nom]);
  };
  CATALOGUE.forEach((f) => parcourir(f, []));
  return out;
}

export interface RessourceActive extends RessourceCatalogue {
  chemin: string;
  entree: EntreeIndex;
}

/** Les ressources réellement importées : celles du catalogue, puis celles que le catalogue ne connaît pas encore. */
export function ressourcesActives(index: EntreeIndex[]): RessourceActive[] {
  const connues = ressourcesDuCatalogue();
  const parId = new Map(index.map((e) => [e.id, e]));
  const out: RessourceActive[] = [];
  for (const r of connues) {
    const entree = parId.get(r.id);
    if (entree) out.push({ ...r, entree });
  }
  for (const e of index) {
    if (!connues.some((r) => r.id === e.id)) out.push({ id: e.id, nomFr: e.nom_fao, nomFao: e.nom_fao, chemin: "Agriculture → Autres cultures", entree: e });
  }
  return out;
}

/** Les noms français des entités historiques et des agrégats, par code M49 (les pays actuels passent par countryNamesFr). */
export const NOMS_FR_ENTITES: Record<string, string> = {
  "058": "Belgique-Luxembourg",
  "200": "Tchécoslovaquie",
  "230": "Éthiopie (avant 1993)",
  "736": "Soudan (avant 2012)",
  "810": "URSS",
  "890": "Yougoslavie",
  "891": "Serbie-et-Monténégro",
  "159": "Chine (agrégat FAOSTAT)",
};

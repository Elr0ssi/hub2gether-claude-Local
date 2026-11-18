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
      {
        id: "cereales",
        nom: "Céréales",
        ressources: [
          { id: "qcl-wheat", nomFr: "Blé", nomFao: "Wheat" },
          { id: "qcl-rice", nomFr: "Riz", nomFao: "Rice" },
          { id: "qcl-quinoa", nomFr: "Quinoa", nomFao: "Quinoa" },
          { id: "qcl-cereals-n-e-c", nomFr: "Autres céréales", nomFao: "Cereals n.e.c." },
        ],
      },
      { id: "fruits-a-coque", nom: "Fruits à coque", ressources: [{ id: "qcl-almonds-in-shell", nomFr: "Amandes en coque", nomFao: "Almonds, in shell" }] },
      {
        id: "legumes",
        nom: "Légumes et tubercules",
        ressources: [
          { id: "qcl-potatoes", nomFr: "Pommes de terre", nomFao: "Potatoes" },
          { id: "qcl-tomatoes", nomFr: "Tomates", nomFao: "Tomatoes" },
        ],
      },
      { id: "fruits", nom: "Fruits", ressources: [{ id: "qcl-avocados", nomFr: "Avocats", nomFao: "Avocados" }] },
      {
        id: "oleagineux",
        nom: "Huiles végétales",
        ressources: [
          { id: "qcl-olive-oil", nomFr: "Huile d’olive", nomFao: "Olive oil" },
          { id: "qcl-sunflower-seed-oil-crude", nomFr: "Huile de tournesol brute", nomFao: "Sunflower-seed oil, crude" },
        ],
      },
      {
        id: "autres-cultures",
        nom: "Cultures tropicales et épices",
        ressources: [
          { id: "qcl-cocoa-beans", nomFr: "Fèves de cacao", nomFao: "Cocoa beans" },
          { id: "qcl-chillies-and-peppers-dry-capsicum-spp-pimenta-spp-raw", nomFr: "Piments secs", nomFao: "Chillies and peppers, dry (Capsicum spp., Pimenta spp.), raw" },
        ],
      },
      { id: "boissons", nom: "Boissons", ressources: [{ id: "qcl-wine", nomFr: "Vin", nomFao: "Wine" }] },
    ],
  },
  {
    id: "elevage",
    nom: "Élevage",
    enfants: [
      {
        id: "viandes",
        nom: "Viandes",
        ressources: [
          { id: "qcl-meat-of-chickens-fresh-or-chilled", nomFr: "Viande de poulet", nomFao: "Meat of chickens, fresh or chilled" },
          { id: "qcl-meat-of-pig-with-the-bone-fresh-or-chilled", nomFr: "Viande de porc", nomFao: "Meat of pig with the bone, fresh or chilled" },
          { id: "qcl-meat-of-ducks-fresh-or-chilled", nomFr: "Viande de canard", nomFao: "Meat of ducks, fresh or chilled" },
          { id: "qcl-meat-of-camels-fresh-or-chilled", nomFr: "Viande de chameau", nomFao: "Meat of camels, fresh or chilled" },
        ],
      },
      {
        id: "lait-oeufs",
        nom: "Lait et œufs",
        ressources: [
          { id: "qcl-raw-milk-of-cattle", nomFr: "Lait de vache", nomFao: "Raw milk of cattle" },
          { id: "qcl-hen-eggs-in-shell-fresh", nomFr: "Œufs de poule", nomFao: "Hen eggs in shell, fresh" },
        ],
      },
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
  /* Des territoires et petits États que la géométrie du globe ne contient pas : ils figurent au classement et aux courbes, pas sur la carte. */
  "254": "Guyane",
  "312": "Guadeloupe",
  "474": "Martinique",
  "638": "La Réunion",
  "446": "Macao (Chine)",
  "520": "Nauru",
  "798": "Tuvalu",
  "462": "Maldives",
};

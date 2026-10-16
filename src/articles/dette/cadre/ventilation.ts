/* ═══════════════════════════════════════════════════════════════════════════
   VENTILATIONS : LA FORME DES DONNÉES D'UN CAMEMBERT

   Une ligne d'une <Repartition> peut s'ouvrir sur un camembert. Ce fichier dit
   comment on décrit ce camembert, sans aucune mise en page.

     Part     une part : un nom, un montant (Md€), éventuellement ses « dont »
     Vue      un camembert : des parts, et le total publié si on le connaît
     Detail   ce qui s'ouvre sous une ligne : l'explication, une ou plusieurs vues

   RÈGLES (elles évitent les doubles comptes) :
     - `enfants` = les « dont » : ils sont inclus dans le montant du parent et ne
       s'y ajoutent jamais. Ils ne sont pas dessinés dans l'anneau, seulement
       listés sous leur parent.
     - Quand les parts ne font pas le total publié, la différence est montrée
       comme une part grisée « Reste non détaillé dans la source » : jamais
       cachée, jamais attribuée à un poste.
     - Quand la somme des parts dépasse le total publié (arrondis), le total
       affiché est la somme et une phrase le dit.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Part {
  nom: string;
  /** Milliards d'euros. */
  md: number;
  note?: string;
  /** Les « dont » : inclus dans `md`, listés sous la part. */
  enfants?: Part[];
  /** Vrai pour la part calculée « reste ». */
  reste?: boolean;
}

export interface Vue {
  /** Le nom de l'onglet, quand une ligne propose plusieurs lectures. */
  titre?: string;
  parts: Part[];
  /** Le total publié. Sans lui, c'est la somme des parts. */
  total?: number;
  /** Le nom de la part « reste ». */
  resteNom?: string;
  /** Une phrase de précaution sous le camembert (périmètre, arrondis, édition). */
  precision?: string;
  /** 1 par défaut ; 0 pour des montants arrondis à l'unité (les parts ne se lisent pas au dixième). */
  pctDecimales?: number;
}

export interface Detail {
  /** Ce que c'est, en une ou deux phrases. */
  texte: string;
  vues?: Vue[];
  /** Quand la source ne détaille pas : on le dit ici, à la place du camembert. */
  absent?: string;
  /** Des lignes de lecture, sans camembert. */
  notes?: string[];
  source?: { nom: string; url: string };
}

const TOLERANCE = 0.05;

export interface PartsCompletees {
  parts: Part[];
  base: number;
  /** De combien la somme dépasse le total publié (arrondis), sinon 0. */
  exces: number;
}

/** Complète une liste de parts avec la part « reste » et fixe la base des pourcentages. */
export function completer(parts: Part[], total?: number, resteNom = "Reste non détaillé dans la source"): PartsCompletees {
  const utiles = parts.filter((p) => p.md > 0);
  const somme = utiles.reduce((s, p) => s + p.md, 0);
  if (total === undefined) return { parts: utiles, base: somme, exces: 0 };
  if (somme > total + TOLERANCE) return { parts: utiles, base: somme, exces: somme - total };
  if (total - somme > TOLERANCE) {
    return { parts: [...utiles, { nom: resteNom, md: total - somme, reste: true }], base: total, exces: 0 };
  }
  return { parts: utiles, base: total, exces: 0 };
}

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

/** Une ligne d'un barème : un libellé, un taux (pour la longueur de la barre) et le texte du taux. */
export interface Tranche {
  libelle: string;
  /** Le taux en %, pour dessiner la barre ; absent si la ligne n'a pas de taux unique. */
  taux?: number;
  /** Ce qu'on lit à droite : « 20 % », « de 14 % à 24 % »… */
  texte: string;
}
export interface Bareme {
  titre?: string;
  lignes: Tranche[];
}

export interface Part {
  nom: string;
  /** Milliards d'euros. */
  md: number;
  note?: string;
  /** Le taux ou le barème de l'impôt, quand on le connaît : « 20 % » ou « 0,6545 €/litre ». */
  taux?: string;
  /** Les taux en détail, dessinés en barres : tranches d'un barème, ou taux d'une même taxe. */
  bareme?: Bareme;
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
  /** Une ligne au-dessus du camembert : ce qu'il montre. */
  legende?: string;
  /** Une phrase de précaution sous le camembert (périmètre, arrondis, édition). */
  precision?: string;
  /** 1 par défaut ; 0 pour des montants arrondis à l'unité (les parts ne se lisent pas au dixième). */
  pctDecimales?: number;
}

export interface Detail {
  /** Ce que c'est, en une ou deux phrases. */
  texte: string;
  vues?: Vue[];
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
export function completer(parts: Part[], total?: number, resteNom = "Autres"): PartsCompletees {
  const utiles = parts.filter((p) => p.md > 0);
  const somme = utiles.reduce((s, p) => s + p.md, 0);
  if (total === undefined) return { parts: utiles, base: somme, exces: 0 };
  if (somme > total + TOLERANCE) return { parts: utiles, base: somme, exces: somme - total };
  if (total - somme > TOLERANCE) {
    return { parts: [...utiles, { nom: resteNom, md: total - somme, reste: true }], base: total, exces: 0 };
  }
  return { parts: utiles, base: total, exces: 0 };
}

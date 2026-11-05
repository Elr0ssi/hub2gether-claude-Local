/* ═══════════════════════════════════════════════════════════════════════════
   LES CADENCES DU BANDEAU « TEMPS RÉEL »

   Deux natures de chiffres cohabitent ici, et elles ne sont pas mélangées.

   Le produit intérieur brut et la population sont calculés à partir du socle,
   à son dernier millésime publié : la valeur de départ et le rythme viennent
   de la base, pas d'ici.

   La forêt brûlée et l'eau utilisée n'ont pas encore de source dans le socle.
   Les cadences ci-dessous sont donc des VALEURS D'EXEMPLE, posées pour que la
   mise en page existe, et marquées comme telles à l'écran : sur un site de
   données, un compteur non sourcé se voit ou il nuit. Le jour où les formules
   arrivent, on remplace `parAn`, on nomme la source dans `note`, et on retire
   le champ `exemple` — la ligne disparaît de l'affichage des exemples sans
   qu'aucun autre code ne bouge.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Cadence {
  id: string;
  /** L'intitulé court, au-dessus du nombre. */
  label: string;
  /** Ce qui est collé à droite du nombre. */
  unite: string;
  /** Chiffres après la virgule : assez pour que le dernier rouleau tourne de
      façon visible, pas assez pour qu'il devienne illisible. */
  dec: number;
  /** Ce qui s'accumule en une année, dans l'unité affichée. */
  parAn: number;
  /** Le mot qui suit le nombre écrit en toutes lettres, au pluriel
      (« hectares », « habitants »…) : « 8,5 milliards d'habitants ». */
  mot: string;
  /** La ligne sous le nombre : ce que la grandeur est, et d'où elle vient.
      Conservée pour documenter la donnée même si l'écran ne l'affiche plus. */
  note: string;
  /** Renseigné tant que le chiffre n'est pas sourcé. Le texte dit ce qui est
      inventé ; l'affichage porte alors une pastille, toujours visible. */
  exemple?: string;
}

/** Les grandeurs en attente de formule. Chiffres d'exemple, tous marqués. */
export const CADENCES_EXEMPLE: Cadence[] = [
  {
    id: "foret",
    label: "Forêt brûlée",
    unite: "\u00a0ha",
    dec: 0,
    parAn: 30_000_000,
    note: "Surface partie en fumée depuis le 1er janvier.",
    mot: "hectares brûlés",
    exemple: "Cadence d'exemple, en attente de la source.",
  },
  {
    id: "eau",
    label: "Eau douce prélevée",
    unite: "\u00a0km³",
    dec: 4,
    parAn: 4_000,
    note: "Prélèvements cumulés depuis le 1er janvier.",
    mot: "kilomètres cubes d'eau",
    exemple: "Cadence d'exemple, en attente de la source.",
  },
  {
    id: "co2",
    label: "CO₂ émis",
    unite: "\u00a0Mt",
    dec: 3,
    parAn: 37_000,
    note: "Émissions liées à l'énergie, cumulées depuis le 1er janvier.",
    mot: "mégatonnes de CO₂",
    exemple: "Cadence d'exemple, en attente de la source.",
  },
  {
    id: "plastique",
    label: "Plastique produit",
    unite: "\u00a0t",
    dec: 0,
    parAn: 400_000_000,
    note: "Production mondiale cumulée depuis le 1er janvier.",
    mot: "tonnes de plastique",
    exemple: "Cadence d'exemple, en attente de la source.",
  },
  {
    id: "solaire",
    label: "Électricité solaire",
    unite: "\u00a0TWh",
    dec: 4,
    parAn: 2_000,
    note: "Production photovoltaïque cumulée depuis le 1er janvier.",
    mot: "térawattheures",
    exemple: "Cadence d'exemple, en attente de la source.",
  },
  {
    id: "naissances",
    label: "Naissances",
    unite: "",
    dec: 0,
    parAn: 134_000_000,
    note: "Naissances cumulées depuis le 1er janvier.",
    mot: "naissances",
    exemple: "Cadence d'exemple, en attente de la source.",
  },
  {
    id: "terres",
    label: "Terres arables perdues",
    unite: "\u00a0ha",
    dec: 1,
    parAn: 10_000_000,
    note: "Surfaces cultivables perdues depuis le 1er janvier.",
    mot: "hectares de terres perdus",
    exemple: "Cadence d'exemple, en attente de la source.",
  },
  {
    id: "vols",
    label: "Vols commerciaux",
    unite: "",
    dec: 0,
    parAn: 38_000_000,
    note: "Décollages cumulés depuis le 1er janvier.",
    mot: "vols commerciaux",
    exemple: "Cadence d'exemple, en attente de la source.",
  },
];

/** L'accroissement annuel de la population, faute de deux millésimes dans le
    socle pour le mesurer. C'est la seule part inventée du compteur de
    population : son point de départ, lui, est la somme du socle. */
export const POPULATION_PAR_AN = 70_000_000;

/** Les identifiants qu'on peut épingler à un tableau de bord personnel :
    les deux grandeurs réelles, puis les cadences d'exemple ci-dessus. */
export const WIDGETS_POSSIBLES = [
  "pib",
  "population",
  ...CADENCES_EXEMPLE.map((c) => c.id),
] as const;

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
  /** La ligne sous le nombre : ce que la grandeur est, et d'où elle vient. */
  note: string;
  /** Renseigné tant que le chiffre n'est pas sourcé. Le texte dit ce qui est
      inventé ; l'affichage porte alors une pastille. */
  exemple?: string;
}

/** Les deux grandeurs en attente de formule. Chiffres d'exemple. */
export const CADENCES_EXEMPLE: Cadence[] = [
  {
    id: "foret",
    label: "Forêt brûlée",
    unite: " ha",
    dec: 0,
    parAn: 30_000_000,
    note: "Surface partie en fumée depuis le 1er janvier.",
    exemple: "Cadence d'exemple, en attente de la source.",
  },
  {
    id: "eau",
    label: "Eau douce prélevée",
    unite: " km³",
    dec: 4,
    parAn: 4_000,
    note: "Prélèvements cumulés depuis le 1er janvier.",
    exemple: "Cadence d'exemple, en attente de la source.",
  },
];

/** L'accroissement annuel de la population, faute de deux millésimes dans le
    socle pour le mesurer. C'est la seule part inventée du compteur de
    population : son point de départ, lui, est la somme du socle. */
export const POPULATION_PAR_AN = 70_000_000;

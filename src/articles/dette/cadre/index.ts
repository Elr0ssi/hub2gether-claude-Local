/* ═══════════════════════════════════════════════════════════════════════════
   LE CADRE DES ARTICLES DE DETTE

   Tout ce qu'un article long peut utiliser, depuis un seul endroit :

     import { ArticleLong, Chapitre, Figure, Repartition, … } from "@/articles/dette/cadre";

   Le guide complet est dans `src/articles/LISEZ-MOI.md`.
   ═══════════════════════════════════════════════════════════════════════════ */

export { ArticleLong } from "./ArticleLong";
export { Chapitre } from "./Chapitre";
export { Figure } from "./Figure";
export { Etapes } from "./Etapes";
export { Repartition } from "./Repartition";
export { Camembert, avecMontants } from "./Camembert";
export type { Part, Vue, Detail } from "./ventilation";
export { BarresParDate, type PointDate } from "./BarresParDate";
export { ChiffresCles, ChiffresGrille, type CarteChiffre } from "./ChiffresCles";
export { ListeQuestions } from "./ListeQuestions";
export { ChapitrePresse } from "./ChapitrePresse";
export { Compteur, Leve, useVu } from "./mouvement";
export { montant, montantAbs, enLettres, nombre, nf } from "./montants";
export type { ChapitreDef, Source, Suggestion } from "./types";

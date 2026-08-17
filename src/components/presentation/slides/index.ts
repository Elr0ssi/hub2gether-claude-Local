import type { ComponentType } from "react";
import {
  CoverSlide,
  ConstatSlide,
  ProblemeSlide,
  ValeurSlide,
  ProduitSlide,
  DemoSlide,
  ConceptProduitSlide,
  RalentirSlide,
  VisionSlide,
  AmbitionSlide,
  MoteurSlide,
  IaHumainSlide,
} from "./partOne";
import {
  TransitionSlide,
  QuestionSlide,
  EquationSlide,
  LevierSlide,
  ArchitectureSlide,
  LeanSlide,
  AgiliteSlide,
  ParadoxeSlide,
  ModeleCibleSlide,
  ApprentissagesSlide,
  PhasesSlide,
  AProuverSlide,
  JurySlide,
  RoadmapSlide,
  ConclusionSlide,
} from "./partTwo";

/**
 * Slide id → view. Keys must match `SLIDES[].id` in presentationData.ts:
 * the order of the deck is defined by that array, never here.
 */
export const SLIDE_VIEWS: Record<string, ComponentType> = {
  // Part I — pitch
  cover: CoverSlide,
  constat: ConstatSlide,
  probleme: ProblemeSlide,
  valeur: ValeurSlide,
  produit: ProduitSlide,
  demo: DemoSlide,
  "concept-produit": ConceptProduitSlide,
  ralentir: RalentirSlide,
  vision: VisionSlide,
  ambition: AmbitionSlide,
  moteur: MoteurSlide,
  "ia-humain": IaHumainSlide,

  // Pivot
  transition: TransitionSlide,

  // Part II — approfondissement
  question: QuestionSlide,
  equation: EquationSlide,
  levier: LevierSlide,
  architecture: ArchitectureSlide,
  lean: LeanSlide,
  agilite: AgiliteSlide,
  paradoxe: ParadoxeSlide,
  "modele-cible": ModeleCibleSlide,
  apprentissages: ApprentissagesSlide,
  phases: PhasesSlide,
  "a-prouver": AProuverSlide,
  jury: JurySlide,
  roadmap: RoadmapSlide,
  conclusion: ConclusionSlide,
};

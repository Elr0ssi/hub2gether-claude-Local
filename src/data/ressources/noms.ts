import { countryFr } from "@/data/countryNamesFr";
import { NOMS_FR_ENTITES } from "./catalogue";
import type { Zone } from "./types";

/** Le nom français d'une entité : un pays actuel passe par countryFr, une entité historique ou un agrégat par sa table. */
export function nomZone(z: Zone): string {
  if (NOMS_FR_ENTITES[z.m49]) return NOMS_FR_ENTITES[z.m49];
  if (z.m49 === "156") return "Chine continentale";
  return z.ne ? countryFr(z.ne) : z.nom;
}

import type { FicheDebat } from "@/data/concept/conceptEconomie";
import { classement, complet, court, indexer, obs, totalMonde } from "./calc";
import { nomZone } from "./noms";
import type { JeuRessource } from "./types";

/* ═══════════════════════════════════════════════════════════════════════════
   LES SUJETS DE FORUM D'UNE RESSOURCE

   Chaque sujet part d'un chiffre CALCULÉ dans le fichier importé (comme les débats d'Économie partent d'un chiffre d'article) : la question
   est posée au lecteur, le chiffre qui la déclenche vient des données. Rien n'est écrit à la main.
   ═══════════════════════════════════════════════════════════════════════════ */

export function debatsRessource(J: JeuRessource, nomFr: string): FicheDebat[] {
  const an = J.annees[1];
  const ix = indexer(J);
  const nom = (id: string) => nomZone(ix.parM49.get(id)!);
  const art = /^[aeiouyhéèêâîô]/i.test(nomFr) ? "d’" : "de ";
  const bas = nomFr.toLowerCase();
  const out: FicheDebat[] = [];

  const prod = classement(J, "production", an);
  const total = totalMonde(J, "production", an);
  if (prod.length >= 3 && total) {
    const trois = prod.slice(0, 3).reduce((s, l) => s + l.valeur, 0);
    out.push({
      id: `res-${bas}-concentration`,
      question: `Une production de ${bas} concentrée dans quelques pays est-elle un risque pour la sécurité alimentaire ?`,
      ancre: `${Math.round((trois / total.valeur) * 100)} % de la production mondiale recalculée en ${an}, dans trois pays`,
      tags: [bas, "sécurité alimentaire", "production"],
    });
  }
  const rend = classement(J, "rendement", an);
  const surf = classement(J, "surface", an);
  if (rend.length >= 3 && surf.length >= 3) {
    const grand = surf[0];
    const rg = obs(J, grand.m49, "rendement", an);
    out.push({
      id: `res-${bas}-surfaces-rendements`,
      question: `Pour produire plus ${art}${bas}, faut-il étendre les surfaces ou augmenter les rendements ?`,
      ancre: `${nom(rend[0].m49)} : ${complet(rend[0].valeur)} kg/ha${rg ? `, contre ${complet(rg.valeur)} kg/ha pour ${nom(grand.m49)}, première en surface` : ""}`,
      tags: [bas, "rendement", "surface"],
    });
  }
  if (prod.length >= 2) {
    out.push({
      id: `res-${bas}-premier`,
      question: `Qui doit nourrir le monde en ${bas} : les plus gros producteurs ou ceux qui progressent le plus vite ?`,
      ancre: `${nom(prod[0].m49)} · ${court(prod[0].valeur)} t en ${an}`,
      tags: [bas, "production", "classement"],
    });
  }
  const ent = classement(J, "production", an);
  const nonOff = ent.filter((l) => l.flag !== "A").length;
  if (ent.length) {
    out.push({
      id: `res-${bas}-fiabilite`,
      question: "Peut-on se fier à des chiffres de production estimés ou reconstitués ?",
      ancre: `${nonOff} valeurs non officielles sur ${ent.length} en ${an}`,
      tags: ["données", "FAOSTAT", "fiabilité"],
    });
  }
  const urss = J.zones.find((z) => z.m49 === "810");
  if (urss) {
    let best: { an: number; v: number } | null = null;
    for (let a = urss.debut; a <= urss.fin; a++) { const o = obs(J, urss.m49, "production", a); if (o && (!best || o.valeur > best.v)) best = { an: a, v: o.valeur }; }
    if (best) {
      out.push({
        id: `res-${bas}-urss`,
        question: `Que reste-t-il de la puissance agricole soviétique dans le ${bas} d’aujourd’hui ?`,
        ancre: `${nomZone(urss)} · ${court(best.v)} t en ${best.an}, record de la série ${urss.debut}–${urss.fin}`,
        tags: [bas, "histoire", "URSS"],
      });
    }
  }
  return out;
}

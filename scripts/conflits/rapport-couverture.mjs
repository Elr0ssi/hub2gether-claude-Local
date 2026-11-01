#!/usr/bin/env node
/* Rapport automatique de couverture des 68 fiches : docs/conflits/COUVERTURE.csv et COUVERTURE.md.
   Usage : npm run conflits:couverture
   Un contenu n'est compté « vérifié » que s'il est rattaché à une source consultée ; une synthèse éditoriale reste « à vérifier ».
   Aucune fiche n'est « valide » ou « publiée » ici : ces statuts demandent une relecture humaine (voir ETAT_PUBLICATION). */
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { RACINE, enrichi, evenements, generique, inventaire, locaux } from "./commun.mjs";

const ok = (v) => v === "documenté_sur_source_consultee" || v === "vérifié";
const lignes = [];
for (const c of inventaire.conflits) {
  const f = enrichi.conflits[c.id];
  const l = locaux[c.id];
  const evts = evenements.filter((e) => e.conflit === c.id);
  const causes = f.causes.length;
  const causesOk = f.causes.filter((x) => ok(x.verification)).length;
  const acteurs = f.acteurs.length + (l?.acteurs?.length ?? 0);
  const acteursRole = f.acteurs.filter((a) => a.role).length + (l?.acteurs?.length ?? 0);
  const chrono = f.chronologie.length + (l?.chronologie?.length ?? 0) + evts.length;
  const chiffres = f.chiffres.length + (l?.chiffres?.length ?? 0);
  const cons = f.consequences.length + (l?.consequences?.length ?? 0);
  const idsSources = new Set([...f.sources, ...f.resume.source_ids]);
  const precises = [...idsSources].filter((id) => !generique(enrichi.sources[id]?.url) && enrichi.sources[id]?.nature !== "piste_source_inventaire_original").length;
  const localesPrecises = new Set([...(l?.chiffres ?? []).map((x) => x.source_url), ...(l?.causes ?? []).map((x) => x.source_url), ...(l?.chronologie ?? []).map((x) => x.source_url), ...evts.map((e) => e.source_url)].filter(Boolean)).size;
  const sourcesPrecises = precises + localesPrecises;
  const resumeOk = l?.resume ? true : ok(f.resume.verification);
  const complet = { resume: resumeOk, causes: causes > 0 && causesOk === causes, acteurs: acteurs > 0 && acteursRole === acteurs, chronologie: chrono >= 5, chiffres: chiffres >= 3, consequences: cons > 0, cartographie: evts.length >= 5 };
  const nbComplets = Object.values(complet).filter(Boolean).length;
  /* Statut de publication : brouillon → sources_a_verifier. « valide » et « publie » exigent une relecture humaine, jamais attribuée ici. */
  const ETAT_PUBLICATION = sourcesPrecises > 0 && (chiffres > 0 || chrono > 0) ? "sources_a_verifier" : "brouillon";
  lignes.push({
    id: c.id, nom: f.nom_court, categorie: c.categorie,
    resume: resumeOk ? "documenté" : "à vérifier",
    causes: `${causesOk}/${causes}`, acteurs: `${acteursRole}/${acteurs}`,
    chronologie: chrono, chiffres, consequences: cons, points: evts.length, sources_precises: sourcesPrecises,
    sections_completes: `${nbComplets}/7`,
    statut: ETAT_PUBLICATION, risque: nbComplets <= 1 ? "élevé" : nbComplets <= 3 ? "moyen" : "faible",
    manque: [...new Set(f.manque)].join(" | "),
  });
}
const entetes = ["id", "nom", "categorie", "resume", "causes", "acteurs", "chronologie", "chiffres", "consequences", "points", "sources_precises", "sections_completes", "statut", "risque", "manque"];
const csv = [entetes.join(","), ...lignes.map((r) => entetes.map((k) => `"${String(r[k]).replace(/"/g, '""')}"`).join(","))].join("\n") + "\n";
mkdirSync(resolve(RACINE, "docs/conflits"), { recursive: true });
writeFileSync(resolve(RACINE, "docs/conflits/COUVERTURE.csv"), csv);

const n = (f) => lignes.filter(f).length;
const md = `# Couverture des 68 fiches du module Conflits

Généré par \`npm run conflits:couverture\` à partir de l'enrichissement du 31 octobre 2026 et des dossiers locaux.
**Ce rapport mesure ce qui est présent, pas la complétude du réel.** Aucune fiche n'est « valide » ni « publiée » : ces statuts demandent une relecture humaine.

| Mesure | Fiches |
|---|---|
| Résumé documenté sur une source consultée | ${n((r) => r.resume === "documenté")} / 68 |
| Au moins un chiffre sourcé | ${n((r) => r.chiffres > 0)} / 68 |
| Au moins 3 chiffres sourcés | ${n((r) => r.chiffres >= 3)} / 68 |
| Chronologie d'au moins 5 étapes | ${n((r) => r.chronologie >= 5)} / 68 |
| Au moins un point cartographique | ${n((r) => r.points > 0)} / 68 |
| Au moins une source précise (hors lien générique) | ${n((r) => r.sources_precises > 0)} / 68 |
| Statut « sources à vérifier » | ${n((r) => r.statut === "sources_a_verifier")} / 68 |
| Statut « brouillon » | ${n((r) => r.statut === "brouillon")} / 68 |
| Risque éditorial élevé (≤ 1 section sur 7 complète) | ${n((r) => r.risque === "élevé")} / 68 |

Sections comptées : résumé, causes (toutes documentées), acteurs (tous avec un rôle), chronologie (≥ 5), chiffres (≥ 3), conséquences, cartographie (≥ 5 points).
Sources génériques (tableau de bord) dans l'enrichissement : ${Object.values(enrichi.sources).filter((s) => s.generique).length} — à remplacer par des URL précises.

| Fiche | Nom | Résumé | Causes | Acteurs | Chrono | Chiffres | Points | Sources précises | Complètes | Statut | Risque |
|---|---|---|---|---|---|---|---|---|---|---|---|
${lignes.map((r) => `| ${r.id} | ${r.nom} | ${r.resume} | ${r.causes} | ${r.acteurs} | ${r.chronologie} | ${r.chiffres} | ${r.points} | ${r.sources_precises} | ${r.sections_completes} | ${r.statut} | ${r.risque} |`).join("\n")}
`;
writeFileSync(resolve(RACINE, "docs/conflits/COUVERTURE.md"), md);
console.log(`68 fiches : ${n((r) => r.chiffres > 0)} avec chiffres, ${n((r) => r.points > 0)} avec points, ${n((r) => r.risque === "élevé")} à risque élevé. → docs/conflits/COUVERTURE.md`);

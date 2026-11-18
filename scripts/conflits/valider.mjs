#!/usr/bin/env node
/* Contrôles automatiques du module Conflits. Usage : npm run conflits:valider
   Chaque contrôle est indépendant ; le script sort en erreur (code 1) si un seul échoue. */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { DATE_ARRET, FIABILITES, RACINE, enrichi, evenements, generique, inventaire, locaux, lireDateFr, paysIso, relations } from "./commun.mjs";

let echecs = 0;
const ok = (c, msg, detail = []) => {
  if (c) console.log("  ✓ " + msg);
  else { echecs++; console.error("  ✗ " + msg); detail.slice(0, 8).forEach((d) => console.error("      · " + d)); if (detail.length > 8) console.error(`      · … ${detail.length - 8} autres`); }
};
const section = (t) => console.log("\n" + t);

const ids = inventaire.conflits.map((c) => c.id);
const idsAttendus = Array.from({ length: 68 }, (_, i) => `VIZ-C-${String(i + 1).padStart(3, "0")}`);
const fiches = enrichi.conflits;
const dansArret = (iso) => !iso || iso.slice(0, 10) <= DATE_ARRET;

section("Identité des 68 fiches");
ok(ids.length === 68 && new Set(ids).size === 68, "68 identifiants uniques dans l'inventaire");
ok(JSON.stringify([...ids].sort()) === JSON.stringify(idsAttendus), "les identifiants sont exactement VIZ-C-001 à VIZ-C-068");
ok(Object.keys(fiches).length === 68 && ids.every((i) => fiches[i]), "l'enrichissement couvre les 68 identifiants, sans fiche en trop");
ok(inventaire.conflits.every((c) => fiches[c.id].categorie === c.categorie), "les catégories d'origine sont conservées", inventaire.conflits.filter((c) => fiches[c.id].categorie !== c.categorie).map((c) => c.id));
const cat = inventaire.conflits.reduce((m, c) => ({ ...m, [c.categorie]: (m[c.categorie] ?? 0) + 1 }), {});
ok(cat["Conflit armé"] === 29 && cat["Violences armées"] === 28 && cat["Tension géopolitique"] === 11, `29 conflits armés, 28 violences armées, 11 tensions (trouvé ${JSON.stringify(cat)})`);
ok(Object.keys(locaux).every((i) => ids.includes(i)), "les dossiers locaux ne visent que des identifiants existants");

section("Pays");
const mauvais = [];
for (const [id, f] of Object.entries(fiches)) for (const p of f.pays) if (!paysIso.pays[p.iso3]) mauvais.push(`${id} : ${p.iso3}`);
ok(mauvais.length === 0, "tous les codes ISO3 des fiches existent dans l'index des entités", mauvais);
ok(paysIso.pays.XKX && paysIso.pays.XKX.statut !== "entite_iso_3166_1", `XKX (Kosovo) est signalé comme non officiel (statut : ${paysIso.pays.XKX?.statut})`);
ok(Object.keys(paysIso.pays).length === 250, `250 entrées géographiques, dont des territoires : pas 250 États (trouvé ${Object.keys(paysIso.pays).length})`);
const sansGeom = [...new Set(Object.values(fiches).flatMap((f) => f.pays).filter((p) => !p.ne).map((p) => p.iso3))];
console.log(`  · ${sansGeom.length} code(s) ISO3 sans géométrie Natural Earth : ${sansGeom.join(", ") || "aucun"}`);

section("Références croisées");
const srcInconnues = [], liensInconnus = [], pointsInconnus = [];
const evIds = new Set(evenements.map((e) => e.id));
for (const [id, f] of Object.entries(fiches)) {
  const refs = [...f.sources, ...f.resume.source_ids, ...f.causes.flatMap((c) => c.source_ids), ...f.acteurs.map((a) => a.source_id), ...f.chronologie.map((e) => e.source_id), ...f.chiffres.map((k) => k.source_id)];
  for (const r of refs) if (r && !enrichi.sources[r]) srcInconnues.push(`${id} → ${r}`);
  for (const l of f.liens) if (!fiches[l.id]) liensInconnus.push(`${id} → ${l.id}`);
}
for (const d of Object.entries(locaux)) for (const j of d[1].chronologie ?? []) for (const p of j.points ?? []) if (!evIds.has(p)) pointsInconnus.push(`${d[0]} → ${p}`);
ok(srcInconnues.length === 0, "toutes les sources citées existent", srcInconnues);
ok(liensInconnus.length === 0, "tous les liens entre crises visent une fiche existante", liensInconnus);
ok(pointsInconnus.length === 0, "tous les points de chronologie existent", pointsInconnus);
ok(evenements.every((e) => ids.includes(e.conflit)), "tous les points cartographiques se rattachent à une fiche existante");

section("Dates");
const apres = [], jourFictif = [];
for (const [id, f] of Object.entries(fiches)) {
  for (const e of f.chronologie) {
    if (!dansArret(e.date) || !dansArret(e.fin)) apres.push(`${id} : ${e.titre} (${e.date})`);
    if (e.precision === "mois" && e.date.length !== 7) jourFictif.push(`${id} : ${e.titre} → ${e.date}`);
    if (e.precision === "annee" && e.date.length !== 4) jourFictif.push(`${id} : ${e.titre} → ${e.date}`);
  }
  for (const k of f.chiffres) for (const d of [k.periode_debut, k.periode_fin, k.date_donnee]) if (!dansArret(d)) apres.push(`${id} : chiffre ${k.id} (${d})`);
}
for (const e of evenements) { const d = lireDateFr(e.date); if (d && (d.annee > 2026 || (d.annee === 2026 && d.mois && d.mois > 10))) apres.push(`${e.id} : ${e.date}`); }
for (const [id, d] of Object.entries(locaux)) if (d.periode && !dansArret(d.periode.debut)) apres.push(`${id} : début ${d.periode.debut}`);
ok(apres.length === 0, `aucune date postérieure au ${DATE_ARRET} (l'instantané)`, apres);
ok(jourFictif.length === 0, "aucune date mensuelle ou annuelle transformée en jour", jourFictif);
ok(!JSON.stringify(Object.values(fiches).flatMap((f) => f.chronologie)).includes(`"${DATE_ARRET}"`), "la date d'inventaire n'est la date d'aucun événement");

section("Chiffres");
const fautes = [], zeros = [], melanges = [], generiques = [], chevauch = [];
const tous = [
  ...Object.entries(fiches).flatMap(([id, f]) => f.chiffres.map((k) => ({ id, origine: "importé", libelle: k.type, valeur: k.valeur, unite: k.unite, fin: k.periode_fin, fiab: k.fiabilite, url: enrichi.sources[k.source_id]?.url, detail: k.precision, portee: k.portee_geographique, debut: k.periode_debut, min: k.min, max: k.max }))),
  ...Object.entries(locaux).flatMap(([id, d]) => d.chiffres.map((k) => ({ id, origine: "local", libelle: k.libelle, valeur: k.valeur, unite: "(dans le libellé)", fin: "ok", fiab: k.fiabilite, url: k.source_url, detail: k.detail, portee: k.detail }))),
];
for (const k of tous) {
  const manque = [];
  if (!k.url) manque.push("URL");
  if (!k.fin) manque.push("période");
  if (!k.unite) manque.push("unité");
  if (!FIABILITES.includes(k.fiab)) manque.push("fiabilité");
  if (!k.detail) manque.push("définition/périmètre");
  if (manque.length) fautes.push(`${k.id} (${k.origine}) ${k.libelle} : manque ${manque.join(", ")}`);
  if (k.valeur === 0 || k.valeur === "0") zeros.push(`${k.id} ${k.libelle} : zéro sans mesure explicite`);
  if (generique(k.url)) generiques.push(`${k.id} ${k.libelle} → ${k.url}`);
  if (/(morts|tués|tues).*(blessés|blesses)|(blessés|blesses).*(morts|tués|tues)/i.test(k.libelle)) melanges.push(`${k.id} : « ${k.libelle} » mélange morts et blessés`);
}
/* Deux chiffres du même type, même périmètre et périodes qui se recouvrent dans une même fiche : risque de double compte. */
const parFiche = {};
for (const k of tous.filter((x) => x.origine === "importé")) (parFiche[k.id] ??= []).push(k);
for (const [id, l] of Object.entries(parFiche)) for (let i = 0; i < l.length; i++) for (let j = i + 1; j < l.length; j++)
  if (l[i].libelle === l[j].libelle && l[i].portee === l[j].portee && l[i].debut <= l[j].fin && l[j].debut <= l[i].fin) chevauch.push(`${id} : ${l[i].libelle}`);
ok(tous.length > 0, `${tous.length} observations chiffrées contrôlées (${tous.filter((k) => k.origine === "importé").length} importées, ${tous.filter((k) => k.origine === "local").length} locales)`);
ok(fautes.length === 0, "chaque chiffre a une URL, une période, une unité, une définition et une fiabilité", fautes);
ok(zeros.length === 0, "null ≠ 0 : aucun zéro sans mesure", zeros);
ok(melanges.length === 0, "morts, blessés, déplacés ne sont jamais mélangés dans un même chiffre", melanges);
ok(generiques.length === 0, "aucun chiffre ne s'appuie sur un lien générique (tableau de bord, page d'accueil)", generiques);
ok(chevauch.length === 0, "pas de chiffres de même type et de même périmètre aux périodes qui se recouvrent", chevauch);

section("Sources");
const gen = Object.values(enrichi.sources).filter((s) => s.generique);
console.log(`  · ${gen.length} source(s) génériques (tableau de bord) : à remplacer par une URL précise ; aucune ne soutient un chiffre`);
ok(Object.values(enrichi.sources).every((s) => /^https:\/\//.test(s.url)), "toutes les sources ont une URL https");

section("Relations diplomatiques");
const relTypes = new Set(relations.types);
const relFautes = relations.relations.filter((r) => !relTypes.has(r.type) || !r.source_url || !r.debut || !Array.isArray(r.acteurs) || r.acteurs.length < 2).map((r) => r.id);
ok(relFautes.length === 0, `${relations.relations.length} relation(s) : chacune a un type connu, deux acteurs, une date de début et une preuve`, relFautes);
ok(relations.relations.every((r) => r.type !== "vote_onu" || r.proxy === true), "les votes ONU sont marqués comme indicateur indirect, jamais comme alliance");

section("Idempotence de l'import");
const sha = () => createHash("sha256").update(readFileSync(resolve(RACINE, "src/data/conflits/enrichi.json"))).digest("hex");
const avant = sha();
execFileSync("node", [resolve(RACINE, "scripts/conflits/importer-enrichissement.mjs")], { stdio: "ignore" });
ok(sha() === avant, "relancer l'import redonne exactement le même fichier");

console.log(echecs ? `\n${echecs} contrôle(s) en échec` : "\nTous les contrôles passent.");
process.exit(echecs ? 1 : 0);

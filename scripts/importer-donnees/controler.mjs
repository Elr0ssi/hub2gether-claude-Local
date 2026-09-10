#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   CONTRÔLE — la base dit-elle la même chose partout ?

   Le stock et les fichiers d'affichage sont deux écritures d'une même donnée.
   Ce script vérifie qu'elles n'ont pas divergé : même valeur, même couverture,
   aucun code inconnu, aucun zéro apparu là où il y avait une absence.

   USAGE  node scripts/importer-donnees/controler.mjs
   ═══════════════════════════════════════════════════════════════════════════ */

import fs from "node:fs";
import path from "node:path";
import { PAYS } from "./referentiel.mjs";

const RACINE = path.resolve(import.meta.dirname, "../..");
const lire = (f) => JSON.parse(fs.readFileSync(f, "utf8"));

const catalogue = lire(path.join(RACINE, "data/catalogue-indicateurs.json"));
const fiches = fs.readdirSync(path.join(RACINE, "data/countries")).filter((f) => f.endsWith(".json"));

let erreurs = 0;
const signaler = (m) => { console.log(`   ⚠ ${m}`); erreurs++; };

console.log(`\nCONTRÔLE DE LA BASE\n`);
console.log(`Fiches pays   : ${fiches.length}`);
console.log(`Indicateurs   : ${Object.keys(catalogue).join(", ")}\n`);

for (const [id, meta] of Object.entries(catalogue)) {
  // Le stock, relu depuis les fiches.
  const stock = new Map();
  let valeurs = 0;
  for (const f of fiches) {
    const fiche = lire(path.join(RACINE, "data/countries", f));
    if (!PAYS[fiche.iso3]) signaler(`${f} : code absent du référentiel`);
    const ind = fiche.indicateurs?.[id];
    if (!ind) continue;
    for (const [annee, v] of Object.entries(ind.valeurs)) {
      if (typeof v !== "number" || !Number.isFinite(v)) {
        signaler(`${fiche.iso3} ${id} ${annee} : valeur non numérique`);
        continue;
      }
      stock.set(`${fiche.iso3}:${annee}`, v);
      valeurs++;
    }
  }

  // Les fichiers d'affichage, relus depuis le disque.
  const dossier = path.join(RACINE, "public/data-generated/cartes", id);
  const annees = fs.existsSync(dossier)
    ? fs.readdirSync(dossier).map((f) => Number(f.replace(".json", ""))).sort((a, b) => a - b)
    : [];
  let generees = 0;
  for (const annee of annees) {
    const carte = lire(path.join(dossier, `${annee}.json`));
    if (carte.annee !== annee) signaler(`${id}/${annee}.json : l'année du contenu ne correspond pas au nom`);
    if (carte.unite !== meta.unite) signaler(`${id}/${annee}.json : unité ${carte.unite} ≠ ${meta.unite}`);
    for (const [iso3, v] of Object.entries(carte.pays)) {
      generees++;
      if (!PAYS[iso3]) { signaler(`${id}/${annee} : code inconnu ${iso3}`); continue; }
      const attendu = stock.get(`${iso3}:${annee}`);
      if (attendu === undefined) signaler(`${id}/${annee} ${iso3} : présent à l'affichage, absent du stock`);
      else if (attendu !== v) signaler(`${id}/${annee} ${iso3} : ${v} ≠ ${attendu} (stock)`);
    }
  }

  const declarees = meta.anneesDisponibles;
  if (declarees.length !== annees.length) {
    signaler(`${id} : ${declarees.length} années au catalogue, ${annees.length} fichiers générés`);
  }

  console.log(`${meta.nom}`);
  console.log(`   Années            : ${annees[0]} → ${annees[annees.length - 1]} (${annees.length})`);
  console.log(`   Valeurs au stock  : ${valeurs}`);
  console.log(`   Valeurs générées  : ${generees}`);
  console.log(`   Concordance       : ${valeurs === generees && erreurs === 0 ? "exacte" : "à vérifier"}`);
}

console.log(`\n${erreurs === 0 ? "Aucune anomalie." : `${erreurs} anomalie(s) signalée(s).`}\n`);
process.exit(erreurs === 0 ? 0 : 1);

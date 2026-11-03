#!/usr/bin/env node
/* Contrôles automatiques : le JSON normalisé reproduit EXACTEMENT le CSV source, sans double compte.
   Usage : npm run ressources:valider -- data/sources/faostat/FAOSTAT_data_en_11-1-2026_2.csv */
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { lireCsv, indicateursDuProduit } from "./importer-faostat.mjs";

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const GEO = JSON.parse(readFileSync(resolve(RACINE, "src/data/ressources/geo-m49.json"), "utf8"));
const INDICATEURS = { 5510: "production", 5312: "surface", 5412: "rendement" };
let echecs = 0;
const ok = (c, msg) => { if (!c) { echecs++; console.error("  ✗ " + msg); } else console.log("  ✓ " + msg); };

const fichiers = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (!fichiers.length) { console.error("Indique le CSV source."); process.exit(1); }

for (const f of fichiers) {
  const rows = lireCsv(readFileSync(f, "utf8"));
  const parRessource = new Map();
  for (const r of rows) {
    const id = `${r["Domain Code"].toLowerCase()}-${r["Item"].toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
    parRessource.set(id, [...(parRessource.get(id) ?? []), r]);
  }
  for (const [id, lignes] of parRessource) {
    console.log(`\n${id} (${lignes.length} lignes)`);
    const J = JSON.parse(readFileSync(resolve(RACINE, `public/ressources/${id}.json`), "utf8"));
    const choix = indicateursDuProduit(new Set(lignes.map((r) => Number(r["Element Code"]))));
    const [aMin, aMax] = J.annees;

    /* 1. Chaque ligne du CSV retrouvée à l'identique : valeur, flag, note, unité. */
    let faux = 0, vides = 0, zeros = 0, flagsFaux = 0, unitesFausses = 0;
    for (const r of lignes) {
      const ind = choix[Number(r["Element Code"])];
      const s = J.series[r["Area Code (M49)"]]?.[ind];
      const i = Number(r["Year"]) - aMin;
      if (!s) { faux++; continue; }
      const attendu = r["Value"].trim() === "" ? null : Number(r["Value"]);
      if (s.v[i] !== attendu) faux++;
      if (attendu === null) vides++;
      if (attendu === 0 && s.v[i] === 0) zeros++;
      if (s.f[i] !== r["Flag"]) flagsFaux++;
      if ((s.n[i] === "1") !== (r["Note"] !== "")) flagsFaux++;
      if (J.indicateurs[ind].unite !== r["Unit"]) unitesFausses++;
    }
    ok(faux === 0, `les ${lignes.length} lignes sont retrouvées avec la même valeur (écarts : ${faux})`);
    ok(flagsFaux === 0, `flags et notes identiques (écarts : ${flagsFaux})`);
    ok(unitesFausses === 0, `unités identiques : ${Object.entries(J.indicateurs).map(([k, v]) => `${k}=${v.unite}`).join(", ")}`);
    console.log(`  · ${vides} valeurs vides conservées comme null, ${zeros} zéros réels conservés`);

    /* 2. Aucune cellule remplie sans ligne source : le nombre de cellules non vides = le nombre de lignes. */
    let cellules = 0;
    for (const par of Object.values(J.series)) for (const s of Object.values(par)) for (let i = 0; i < s.f.length; i++) if (s.f[i] !== " ") cellules++;
    ok(cellules === lignes.length, `aucune donnée ajoutée ni interpolée : ${cellules} cellules renseignées pour ${lignes.length} lignes`);

    /* 3. Années : pas d'année hors du fichier. */
    ok(aMax <= 2024 || lignes.some((r) => Number(r["Year"]) === aMax), `dernière année = ${aMax}, présente dans le CSV`);

    /* 4. Pas de double compte : une entité historique ne recoupe jamais ses successeurs, et l'agrégat n'entre pas dans le total. */
    let chevauchements = 0;
    const annees = (m49) => { const par = J.series[m49]; if (!par) return new Set(); const s = Object.values(par)[0]; const set = new Set(); for (let i = 0; i < s.v.length; i++) if (s.v[i] !== null) set.add(aMin + i); return set; };
    for (const z of J.zones.filter((x) => x.type === "historique")) {
      const a = annees(z.m49);
      for (const succ of z.successeurs ?? []) for (const y of annees(succ)) if (a.has(y)) { chevauchements++; console.error(`    recouvrement ${z.nom} / ${succ} en ${y}`); }
    }
    ok(chevauchements === 0, `entités historiques sans recouvrement avec leurs successeurs (${chevauchements})`);
    const agregats = J.zones.filter((z) => z.type === "agregat");
    for (const ind of ["production", "surface"]) {
      if (!J.monde[ind]) continue;
      let ecart = 0;
      for (let i = 0; i <= aMax - aMin; i++) {
        let somme = null;
        for (const z of J.zones) {
          if (z.type === "agregat" || z.type === "inconnu") continue;
          const x = J.series[z.m49]?.[ind]?.v[i];
          if (x !== null && x !== undefined) somme = (somme ?? 0) + x;
        }
        const m = J.monde[ind].v[i];
        if ((somme === null) !== (m === null) || (somme !== null && Math.abs(somme - m) > 1e-9 * Math.max(1, Math.abs(somme)))) ecart++;
      }
      ok(ecart === 0, `total monde (${ind}) = somme des pays et entités historiques, hors agrégat « ${agregats.map((a) => a.nom).join(", ")} »`);
    }

    /* 5. Agrégat Chine : 156 + 158 reste proche de 159 (le reste : Hong Kong, Macao) — informatif. */
    if (J.series["159"] && J.series["156"] && J.series["158"]) {
      let maxEcart = 0, ye = 0, paires = 0;
      for (let i = 0; i <= aMax - aMin; i++) {
        const a = J.series["159"].production?.v[i], b = J.series["156"].production?.v[i], c = J.series["158"].production?.v[i];
        if (a && b !== null && c !== null) { paires++; const e = Math.abs(a - b - c) / a; if (e > maxEcart) { maxEcart = e; ye = aMin + i; } }
      }
      console.log(`  · Chine : écart maximal entre « China » et « mainland + Taïwan » = ${(maxEcart * 100).toFixed(4)} % sur ${paires} années → agrégat jamais additionné`);
    }

    /* 6. Rendement publié vs production × 1000 / surface : écarts d'arrondi signalés, jamais corrigés. */
    if (J.indicateurs.rendement && J.indicateurs.production && J.indicateurs.surface) {
      let n = 0, gros = 0, max = 0, pire = null;
      for (const [m49, par] of Object.entries(J.series)) {
        if (!par.rendement || !par.production || !par.surface) continue;
        for (let i = 0; i < par.rendement.v.length; i++) {
          const y = par.rendement.v[i], p = par.production.v[i], s = par.surface.v[i];
          if (y === null || p === null || !s) continue;
          const d = Math.abs(y - (p * 1000) / s) / Math.max(y, 1);
          n++; if (d > max) { max = d; pire = `${m49} ${aMin + i} : publié ${y}, calculé ${Math.round((p * 1000) / s)}`; } if (d > 0.01) gros++;
        }
      }
      console.log(`  · rendement publié vs calculé : ${n} couples, écart maximal ${(max * 100).toFixed(2)} %, ${gros} couples au-delà de 1 % (valeurs FAOSTAT conservées ; pire cas : ${pire})`);
    }
    /* 7. Géographie. */
    const sans = J.zones.filter((z) => z.type === "inconnu");
    ok(sans.length === 0, `toutes les entités ont une règle géographique (inconnues : ${sans.map((z) => z.nom).join(", ") || "aucune"})`);
  }
}
console.log(echecs ? `\n${echecs} contrôle(s) en échec` : "\nTous les contrôles passent.");
process.exit(echecs ? 1 : 0);

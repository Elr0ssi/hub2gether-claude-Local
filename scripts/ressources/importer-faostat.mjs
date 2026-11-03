#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   IMPORT FAOSTAT → DONNÉES NORMALISÉES DE LA RUBRIQUE RESSOURCES

   Usage :   npm run ressources:importer -- chemin/vers/FAOSTAT_data.csv [--export 2026-11-01]
   Un export FAOSTAT (format « long » : Domain, Area Code (M49), Element Code, Item Code, Year, Unit, Value, Flag…) peut contenir
   plusieurs produits et plusieurs domaines : le script les reconnaît et écrit UN fichier par ressource dans public/ressources/,
   plus un index (public/ressources/index.json). Le navigateur ne charge que la ressource affichée, jamais le CSV brut.

   Règles (voir docs/ressources/README.md) :
   - une valeur vide devient null, jamais 0 ; un 0 réel reste 0 ;
   - le flag d'origine est conservé tel quel (A, E, I, X, M…) ;
   - aucune interpolation, aucune extrapolation, aucune année ajoutée ;
   - les agrégats FAOSTAT et les entités historiques sont marqués (src/data/ressources/geo-m49.json) et ne sont jamais additionnés
     avec les pays qui les recoupent ;
   - les totaux « monde » sont recalculés (somme des entités de type « pays » ou « historique » présentes l'année concernée), jamais
     présentés comme officiels.
   ═══════════════════════════════════════════════════════════════════════════ */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { basename, resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const SORTIE = resolve(RACINE, "public/ressources");
const RAPPORTS = resolve(RACINE, "src/data/ressources/rapports");
const GEO = JSON.parse(readFileSync(resolve(RACINE, "src/data/ressources/geo-m49.json"), "utf8"));
const NE = new Set(JSON.parse(readFileSync(resolve(RACINE, "public/geo/ne_50m_countries.simplified.geojson"), "utf8")).features.map((f) => f.properties.name));

/** Codes d'éléments FAOSTAT connus → identifiant d'indicateur de Vizualize. Un code inconnu devient « el-<code> ». */
const INDICATEURS = { 5510: "production", 5312: "surface", 5412: "rendement" };
/** Les rendements que FAOSTAT publie sous d'autres codes (élevage : poids par animal, œufs par poule…). Un seul devient « rendement » par produit,
    dans cet ordre ; les autres restent des éléments à part (« el-<code> »), jamais perdus ni mélangés avec lui. */
const RENDEMENTS = [5412, 5417, 5424, 5413];

/** Associe chaque code d'élément d'un produit à son indicateur. */
export function indicateursDuProduit(codes) {
  const out = {};
  for (const c of codes) out[c] = INDICATEURS[c] ?? `el-${c}`;
  const r = RENDEMENTS.find((c) => codes.has(c));
  if (r !== undefined) out[r] = "rendement";
  return out;
}

/* ── CSV (guillemets, virgules et sauts de ligne dans les champs) ─────────────────────────────── */
export function lireCsv(texte) {
  const t = texte.charCodeAt(0) === 0xfeff ? texte.slice(1) : texte;
  const lignes = [];
  let ligne = [], champ = "", dansGuillemets = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (dansGuillemets) {
      if (c === '"') { if (t[i + 1] === '"') { champ += '"'; i++; } else dansGuillemets = false; }
      else champ += c;
    } else if (c === '"') dansGuillemets = true;
    else if (c === ",") { ligne.push(champ); champ = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && t[i + 1] === "\n") i++;
      ligne.push(champ); champ = "";
      if (ligne.length > 1 || ligne[0] !== "") lignes.push(ligne);
      ligne = [];
    } else champ += c;
  }
  if (champ !== "" || ligne.length) { ligne.push(champ); lignes.push(ligne); }
  const [entete, ...corps] = lignes;
  return corps.map((l) => Object.fromEntries(entete.map((h, i) => [h, l[i] ?? ""])));
}

const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function main() {
  const args = process.argv.slice(2);
  const fichiers = args.filter((a) => !a.startsWith("--"));
  const iExp = args.indexOf("--export");
  if (!fichiers.length) { console.error("Usage : importer-faostat.mjs fichier.csv [--export AAAA-MM-JJ]"); process.exit(1); }
  mkdirSync(SORTIE, { recursive: true });
  mkdirSync(RAPPORTS, { recursive: true });
  const indexPath = resolve(SORTIE, "index.json");
  const index = existsSync(indexPath) ? JSON.parse(readFileSync(indexPath, "utf8")) : { schema: 1, ressources: [] };

  for (const f of fichiers) {
    const brut = readFileSync(f);
    const sha = createHash("sha256").update(brut).digest("hex");
    const lignes = lireCsv(brut.toString("utf8"));
    /* La date d'export : l'option, sinon le nom du fichier (« 11-1-2026 » = 1er novembre 2026). Elle n'est JAMAIS l'année des valeurs. */
    let dateExport = iExp >= 0 ? args[iExp + 1] : null;
    if (!dateExport) {
      const m = basename(f).match(/(\d{1,2})-(\d{1,2})-(\d{4})/);
      if (m) dateExport = `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
    }
    const groupes = new Map();
    for (const r of lignes) {
      const cle = `${r["Domain Code"]}|${r["Item Code (CPC)"]}`;
      if (!groupes.has(cle)) groupes.set(cle, []);
      groupes.get(cle).push(r);
    }
    for (const [, rows] of groupes) {
      const r0 = rows[0];
      const id = `${r0["Domain Code"].toLowerCase()}-${slug(r0["Item"])}`;
      const annees = rows.map((r) => Number(r["Year"]));
      const [aMin, aMax] = [Math.min(...annees), Math.max(...annees)];
      const nA = aMax - aMin + 1;
      const indicateurs = {};
      const zonesMap = new Map();
      const series = {};
      const vus = new Set();
      const doublons = [];
      const choix = indicateursDuProduit(new Set(rows.map((r) => Number(r["Element Code"]))));
      const rapport = { id, lignes_source: rows.length, lignes_traitees: 0, lignes_ecartees: [], valeurs_vides: 0, zeros: 0, flags: {}, notes: {}, unites: {}, doublons, geo: { associes: [], historiques: [], agregats: [], non_associes: [], ambigus: [] } };

      for (const r of rows) {
        const code = Number(r["Element Code"]);
        const ind = choix[code];
        const unite = r["Unit"];
        if (!indicateurs[ind]) indicateurs[ind] = { code_element: code, nom_fao: r["Element"], unite };
        else if (indicateurs[ind].unite !== unite) { rapport.lignes_ecartees.push({ raison: "unité incohérente", ligne: r }); continue; }
        rapport.unites[unite] = (rapport.unites[unite] ?? 0) + 1;
        const m49 = r["Area Code (M49)"];
        const an = Number(r["Year"]);
        const clef = `${m49}|${ind}|${an}`;
        if (vus.has(clef)) { doublons.push(clef); continue; }
        vus.add(clef);
        if (!zonesMap.has(m49)) zonesMap.set(m49, { m49, nom: r["Area"], debut: an, fin: an });
        const z = zonesMap.get(m49);
        z.debut = Math.min(z.debut, an); z.fin = Math.max(z.fin, an);
        if (!series[m49]) series[m49] = {};
        if (!series[m49][ind]) series[m49][ind] = { v: Array(nA).fill(null), f: " ".repeat(nA).split(""), n: "0".repeat(nA).split("") };
        const s = series[m49][ind];
        const i = an - aMin;
        const txt = r["Value"].trim();
        const flag = r["Flag"] || "?";
        /* Vide → null (jamais 0). 0 présent → 0. */
        if (txt === "") { s.v[i] = null; rapport.valeurs_vides++; }
        else {
          const x = Number(txt);
          if (!Number.isFinite(x)) { rapport.lignes_ecartees.push({ raison: "valeur non numérique", ligne: r }); continue; }
          s.v[i] = x;
          if (x === 0) rapport.zeros++;
        }
        s.f[i] = flag;
        if (r["Note"]) { s.n[i] = "1"; rapport.notes[r["Note"]] = (rapport.notes[r["Note"]] ?? 0) + 1; }
        rapport.flags[flag] = (rapport.flags[flag] ?? 0) + 1;
        rapport.lignes_traitees++;
      }

      /* Géographie : codes M49 d'abord, alias documentés dans geo-m49.json. Rien ne se fait par nom approximatif. */
      const zones = [...zonesMap.values()].sort((a, b) => a.m49.localeCompare(b.m49)).map((z) => {
        const g = GEO[z.m49];
        if (!g) { rapport.geo.non_associes.push({ m49: z.m49, nom: z.nom }); return { ...z, type: "inconnu", continent: null, ne: null }; }
        if (g.type === "agregat") rapport.geo.agregats.push({ m49: z.m49, nom: z.nom, note: g.note });
        else if (g.type === "historique") rapport.geo.historiques.push({ m49: z.m49, nom: z.nom, note: g.note, successeurs: g.successeurs });
        else if (g.ne && NE.has(g.ne)) rapport.geo.associes.push({ m49: z.m49, nom: z.nom, ne: g.ne });
        else rapport.geo.non_associes.push({ m49: z.m49, nom: z.nom, raison: "géométrie Natural Earth introuvable : " + g.ne });
        return { ...z, type: g.type, continent: g.continent, ne: g.ne && NE.has(g.ne) ? g.ne : null, note: g.note, successeurs: g.successeurs, contient: g.contient };
      });
      const dup = new Map();
      for (const z of zones) if (z.ne) dup.set(z.ne, [...(dup.get(z.ne) ?? []), z.m49]);
      for (const [ne, codes] of dup) {
        /* Deux entités sur une même géométrie : légitime seulement si elles ne se recouvrent pas dans le temps. */
        if (codes.length > 1) rapport.geo.ambigus.push({ ne, codes });
      }

      /* Totaux « monde » recalculés : somme des entités ni agrégat ni inconnues, année par année. Production et surface seulement
         (un rendement mondial n'est pas la somme de rendements). null quand aucune entité n'a de valeur. */
      const typeDe = Object.fromEntries(zones.map((z) => [z.m49, z.type]));
      const monde = {};
      for (const ind of ["production", "surface"]) {
        if (!indicateurs[ind]) continue;
        const v = Array(nA).fill(null);
        const n = Array(nA).fill(0);
        for (const [m49, par] of Object.entries(series)) {
          if (typeDe[m49] !== "pays" && typeDe[m49] !== "historique") continue;
          const s = par[ind];
          if (!s) continue;
          for (let i = 0; i < nA; i++) if (s.v[i] !== null) { v[i] = (v[i] ?? 0) + s.v[i]; n[i]++; }
        }
        monde[ind] = { v, n };
      }

      const sortie = {
        schema: 1,
        ressource: { id, domaine: r0["Domain Code"], domaine_nom: r0["Domain"], code_item: r0["Item Code (CPC)"], nom_fao: r0["Item"] },
        source: {
          nom: `FAOSTAT — ${r0["Domain"]} (${r0["Domain Code"]}), ${r0["Item"]}`,
          url: `https://www.fao.org/faostat/en/#data/${r0["Domain Code"]}`,
          metadonnees: `https://www.fao.org/faostat/en/#data/${r0["Domain Code"]}/metadata`,
          fichier: basename(f), sha256: sha, date_export: dateExport, importe_le: new Date().toISOString().slice(0, 10),
        },
        annees: [aMin, aMax],
        indicateurs,
        zones,
        series: Object.fromEntries(Object.entries(series).map(([k, par]) => [k, Object.fromEntries(Object.entries(par).map(([ind, s]) => [ind, { v: s.v, f: s.f.join(""), n: s.n.join("") }]))])),
        monde,
      };
      writeFileSync(resolve(SORTIE, `${id}.json`), JSON.stringify(sortie));
      writeFileSync(resolve(RAPPORTS, `${id}.json`), JSON.stringify(rapport, null, 1));
      const entree = { id, nom_fao: r0["Item"], domaine: r0["Domain Code"], annees: [aMin, aMax], indicateurs: Object.keys(indicateurs), zones: zones.length, importe_le: sortie.source.importe_le, date_export: dateExport };
      index.ressources = [...index.ressources.filter((x) => x.id !== id), entree].sort((a, b) => a.id.localeCompare(b.id));
      console.log(`${id} : ${rows.length} lignes → ${rapport.lignes_traitees} traitées, ${rapport.lignes_ecartees.length} écartées, ${doublons.length} doublons, ${zones.length} entités, ${aMin}–${aMax}`);
    }
  }
  writeFileSync(indexPath, JSON.stringify(index, null, 1));
}
/* Lancé en ligne de commande seulement : le validateur réutilise `lireCsv` sans relancer l'import. */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();

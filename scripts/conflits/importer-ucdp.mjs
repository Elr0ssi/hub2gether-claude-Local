#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   CONNECTEUR UCDP (jeux officiels téléchargés à la main)

   Usage :
     npm run conflits:ucdp -- acd  chemin/ucdp-prio-acd-261.csv   --version 26.1
     npm run conflits:ucdp -- ged  chemin/GEDEvent_v26_1.csv      --version 26.1
     npm run conflits:ucdp -- candidate chemin/GEDEvent_v26_0_9.csv --version 26.0.9

   Pourquoi des fichiers locaux : l'API UCDP exige un jeton, et ce connecteur ne contourne aucune authentification. Les exports CSV
   officiels sont téléchargeables sur https://ucdp.uu.se/downloads/ (licence CC BY 4.0, attribution obligatoire : « Uppsala Conflict
   Data Program »). STATUT : écrit d'après le codebook, vérifié sur de petits fichiers de test (scripts/conflits/fixtures), PAS sur un export réel
   — aucun jeu UCDP n'a pu être téléchargé dans l'environnement de développement (réseau restreint).

   Sorties (public/conflits/historique/) :
     - acd.json        : conflits annuels 1946–… (une ligne par conflit et par année), catégories UCDP conservées (type_of_conflict, intensity_level) ;
     - ged-pays-annee.json : événements GED agrégés par pays, année et type de violence (nombre d'événements, décès best/low/high) ;
   « candidate » écrit candidate-pays-mois.json : données PRÉLIMINAIRES, jamais fusionnées avec les données définitives.
   Règles : décès = champs best/low/high tels que publiés, jamais additionnés entre jeux ; GED et ACLED ne sont pas mélangés ; la clé d'un
   événement GED (id) est unique : un doublon dans le fichier est une erreur, pas un total à additionner.
   ═══════════════════════════════════════════════════════════════════════════ */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { basename, resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { lireCsv } from "../ressources/importer-faostat.mjs";

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const SORTIE = resolve(RACINE, "public/conflits/historique");

const exige = (r, cols, jeu) => {
  const manque = cols.filter((c) => !(c in r));
  if (manque.length) throw new Error(`${jeu} : colonnes absentes (${manque.join(", ")}). Le fichier n'est pas celui attendu : aucun import.`);
};
const num = (x) => (x === "" || x === undefined ? null : Number(x));

export function lireAcd(texte, version, meta) {
  const lignes = lireCsv(texte);
  if (!lignes.length) throw new Error("ACD : fichier vide");
  exige(lignes[0], ["conflict_id", "location", "side_a", "side_b", "year", "intensity_level", "type_of_conflict", "start_date"], "ACD");
  const vus = new Set();
  const out = lignes.map((r) => {
    const k = `${r.conflict_id}|${r.year}`;
    if (vus.has(k)) throw new Error(`ACD : doublon conflit/année ${k}`);
    vus.add(k);
    return {
      conflit: Number(r.conflict_id), annee: Number(r.year), lieu: r.location, cote_a: r.side_a, cote_b: r.side_b, incompatibilite: num(r.incompatibility), territoire: r.territory_name || null,
      intensite: num(r.intensity_level), type: num(r.type_of_conflict), intensite_cumulee: num(r.cumulative_intensity), region: r.region || null, debut: r.start_date || null,
    };
  });
  return { jeu: "UCDP/PRIO Armed Conflict Dataset", version, licence: "CC BY 4.0 — Uppsala Conflict Data Program", statut: "definitif", ...meta, lignes: out.length, annees: [Math.min(...out.map((x) => x.annee)), Math.max(...out.map((x) => x.annee))], conflits_annuels: out };
}

export function lireGed(texte, version, meta, preliminaire = false) {
  const lignes = lireCsv(texte);
  if (!lignes.length) throw new Error("GED : fichier vide");
  exige(lignes[0], ["id", "year", "type_of_violence", "country", "best", "low", "high", "deaths_civilians"], "GED");
  const ids = new Set();
  const agr = new Map();
  for (const r of lignes) {
    if (ids.has(r.id)) throw new Error(`GED : identifiant d'événement dupliqué ${r.id} (double compte évité : import refusé)`);
    ids.add(r.id);
    const mois = preliminaire ? (r.date_start ?? "").slice(0, 7) : "";
    const k = `${r.year}|${mois}|${r.country}|${r.type_of_violence}`;
    const a = agr.get(k) ?? { annee: Number(r.year), mois: mois || null, pays: r.country, type_violence: Number(r.type_of_violence), evenements: 0, deces_best: 0, deces_low: 0, deces_high: 0, deces_civils: 0 };
    a.evenements++;
    a.deces_best += Number(r.best) || 0; a.deces_low += Number(r.low) || 0; a.deces_high += Number(r.high) || 0; a.deces_civils += Number(r.deaths_civilians) || 0;
    agr.set(k, a);
  }
  const out = [...agr.values()].sort((x, y) => x.annee - y.annee || x.pays.localeCompare(y.pays) || x.type_violence - y.type_violence);
  return { jeu: preliminaire ? "UCDP Candidate (préliminaire)" : "UCDP GED", version, licence: "CC BY 4.0 — Uppsala Conflict Data Program", statut: preliminaire ? "preliminaire" : "definitif", ...meta, evenements: ids.size, lignes: out.length, agregats: out,
    note: "Types de violence UCDP : 1 conflit étatique, 2 non étatique, 3 violence unilatérale. Décès best/low/high additionnés sur les événements d'un même pays et d'une même année : une agrégation recalculée, pas un total officiel." };
}

function main() {
  const [mode, fichier] = process.argv.slice(2);
  const iv = process.argv.indexOf("--version");
  const version = iv >= 0 ? process.argv[iv + 1] : null;
  if (!["acd", "ged", "candidate"].includes(mode) || !fichier || !version) { console.error("Usage : importer-ucdp.mjs acd|ged|candidate fichier.csv --version X.Y"); process.exit(1); }
  const brut = readFileSync(fichier);
  const meta = { fichier: basename(fichier), sha256: createHash("sha256").update(brut).digest("hex"), importe_le: new Date().toISOString().slice(0, 10) };
  const txt = brut.toString("utf8");
  mkdirSync(SORTIE, { recursive: true });
  const [nom, doc] = mode === "acd" ? ["acd.json", lireAcd(txt, version, meta)] : mode === "ged" ? ["ged-pays-annee.json", lireGed(txt, version, meta)] : ["candidate-pays-mois.json", lireGed(txt, version, meta, true)];
  writeFileSync(resolve(SORTIE, nom), JSON.stringify(doc));
  console.log(`${doc.jeu} ${version} : ${doc.lignes} lignes → public/conflits/historique/${nom}`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();

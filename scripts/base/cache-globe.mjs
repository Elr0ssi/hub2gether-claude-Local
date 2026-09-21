#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   LE CACHE DU GLOBE

   /cache n'est pas une seconde base. C'est une vue, entièrement dérivée de
   /data, régénérable à tout moment, et qui ne se modifie jamais à la main.
   Elle existe pour une seule raison : le globe a besoin, pour une année
   donnée, de tous les pays d'un coup — et non d'ouvrir deux cents fiches.

   Un fichier par indicateur et par année :
     /cache/globe/<indicateur>/<année>.json  →  { "FRA": valeur, "USA": … }

   Une absence reste une absence : un pays sans valeur cette année-là n'a pas
   de clé. Il n'y a pas de zéro de remplissage.

   USAGE
     node scripts/base/cache-globe.mjs
   ═══════════════════════════════════════════════════════════════════════════ */

import fs from "node:fs";
import path from "node:path";

const RACINE = process.cwd();
const SORTIE = path.join(RACINE, "cache", "globe");

/** Tous les indicateurs de la base : les dossiers qui contiennent des ISO3. */
function indicateurs(base, prefixe = "") {
  const out = [];
  for (const e of fs.readdirSync(base, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const chemin = path.join(base, e.name);
    const fichiers = fs.readdirSync(chemin);
    if (fichiers.some((f) => /^[A-Z]{3}\.json$/.test(f))) {
      out.push({ nom: e.name, chemin, categorie: prefixe });
    } else {
      out.push(...indicateurs(chemin, prefixe ? `${prefixe}/${e.name}` : e.name));
    }
  }
  return out;
}

const racineData = path.join(RACINE, "data");
const dossiers = indicateurs(racineData).filter((d) => !d.chemin.includes(`${path.sep}countries`));

/* Le cache est reconstruit en entier : un indicateur retiré de la base ne
   doit pas survivre dans le cache. */
if (fs.existsSync(SORTIE)) fs.rmSync(SORTIE, { recursive: true });

const index = {};
let fichiers = 0;
let valeurs = 0;

for (const d of dossiers) {
  const parAnnee = new Map();
  let unite = null;
  let code = null;
  const sources = new Set();
  for (const f of fs.readdirSync(d.chemin).sort()) {
    if (!/^[A-Z]{3}\.json$/.test(f)) continue;
    const fiche = JSON.parse(fs.readFileSync(path.join(d.chemin, f), "utf8"));
    unite ??= fiche.unit;
    code ??= fiche.indicator;
    if (fiche.source) sources.add(fiche.source);
    for (const [annee, v] of Object.entries(fiche.data)) {
      if (v === null || v === undefined) continue;
      let m = parAnnee.get(annee);
      if (!m) parAnnee.set(annee, (m = {}));
      m[fiche.country] = v;
    }
  }
  const dest = path.join(SORTIE, d.nom);
  fs.mkdirSync(dest, { recursive: true });
  const annees = [...parAnnee.keys()].sort();
  for (const a of annees) {
    const bloc = parAnnee.get(a);
    const trie = {};
    for (const k of Object.keys(bloc).sort()) trie[k] = bloc[k];
    fs.writeFileSync(path.join(dest, `${a}.json`), JSON.stringify(trie) + "\n");
    fichiers += 1;
    valeurs += Object.keys(trie).length;
  }
  index[d.nom] = {
    categorie: d.categorie,
    indicateur: code,
    unite,
    annees: annees.map(Number),
    pays: new Set(annees.flatMap((a) => Object.keys(parAnnee.get(a)))).size,
    sources: [...sources],
  };
  console.log(`  ${d.nom.padEnd(24)} ${String(annees.length).padStart(3)} années · ${String(index[d.nom].pays).padStart(4)} pays`);
}

fs.writeFileSync(
  path.join(SORTIE, "index.json"),
  JSON.stringify({ genereLe: new Date().toISOString().slice(0, 10), indicateurs: index }, null, 2) + "\n",
);
console.log(`\n  ${fichiers} fichiers de cache · ${valeurs} valeurs · généré depuis /data`);

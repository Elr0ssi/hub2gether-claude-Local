#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   PONT GÉOGRAPHIES → ISO3

   Les fonds de carte Natural Earth ne portent qu'un nom, pas de code. Or
   joindre sur un nom est exactement ce qu'il ne faut pas faire : un fichier
   qui écrit « Korea, Rep. » là où un autre écrit « South Korea » fait perdre
   un pays sans rien signaler.

   D'où ce pont, écrit une fois, vérifié, et rangé dans un fichier qu'on peut
   relire : nom du fond de carte → ISO3. Tout le reste du projet joint ensuite
   sur ISO3. Les entités sans code — Antarctique, Sahara occidental, Taïwan,
   pour lesquelles la Banque mondiale ne publie pas — sont listées à part
   plutôt que silencieusement perdues.

   USAGE  node scripts/importer-donnees/pont-geographies.mjs
   ═══════════════════════════════════════════════════════════════════════════ */

import fs from "node:fs";
import path from "node:path";
import { PAYS } from "./referentiel.mjs";

const RACINE = path.resolve(import.meta.dirname, "../..");
const FONDS = [
  "public/geo/ne_110m_admin_0_countries.geojson",
  "public/geo/ne_50m_countries.geojson",
];

/** Comparaison indifférente aux accents, aux traits d'union et à la casse. */
const norm = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

// La table des noms français du site, qui traduit déjà les noms Natural Earth.
const src = fs.readFileSync(path.join(RACINE, "src/data/countryNamesFr.ts"), "utf8");
const nomsFr = {};
for (const m of src.matchAll(/^\s*"?([^":\n]+?)"?:\s*"((?:[^"\\]|\\.)*)",\s*$/gm)) {
  nomsFr[m[1].trim()] = m[2].replace(/\\'/g, "'");
}

const parNom = new Map(Object.entries(PAYS).map(([iso3, p]) => [norm(p.nom), iso3]));

const pont = {};
const sansCode = new Set();

for (const f of FONDS) {
  const geo = JSON.parse(fs.readFileSync(path.join(RACINE, f), "utf8"));
  for (const feature of geo.features) {
    const nom = feature.properties.name;
    const fr = nomsFr[nom];
    const iso3 = fr ? parNom.get(norm(fr)) : undefined;
    if (iso3) pont[nom] = iso3;
    else sansCode.add(nom);
  }
}

const sortie = {
  pont: Object.fromEntries(Object.entries(pont).sort(([a], [b]) => a.localeCompare(b))),
  sansCode: [...sansCode].sort(),
};
fs.writeFileSync(
  path.join(RACINE, "data/pont-geographies.json"),
  JSON.stringify(sortie, null, 2) + "\n"
);

console.log(`\nPONT GÉOGRAPHIES → ISO3\n`);
console.log(`Formes appariées : ${Object.keys(pont).length}`);
console.log(`Sans code ISO3   : ${sansCode.size}`);
if (sansCode.size) {
  console.log(`\nEntités sans code, donc jamais jointes (aucune n'est publiée par la Banque mondiale) :`);
  for (const n of sortie.sansCode) console.log(`   ${n}`);
}
console.log("");

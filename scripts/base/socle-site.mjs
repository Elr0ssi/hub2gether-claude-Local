#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   LE SOCLE DU SITE — une vue, pas une base

   Le navigateur n'ouvre pas deux cents fiches par année. Ce script fabrique,
   depuis /data, le seul fichier que la page économie importe : un tableau de
   nombres, aligné sur les années, joint aux noms du fond de carte.

   C'est un cache au même titre que /cache/globe : il se régénère, il ne se
   modifie pas à la main. La référence reste /data.

   USAGE
     node scripts/base/socle-site.mjs [--simulation] [--sortie <chemin>]
   ═══════════════════════════════════════════════════════════════════════════ */

import fs from "node:fs";
import path from "node:path";

const RACINE = process.cwd();
const SIMULATION = process.argv.includes("--simulation");
const iSortie = process.argv.indexOf("--sortie");
const F_SORTIE =
  iSortie > 0
    ? path.resolve(process.argv[iSortie + 1])
    : path.join(RACINE, "src/data/economy/genere/socle-economie.json");

const PREMIERE_ANNEE = 1960;
const DERNIERE_ANNEE = 2025;
const ANNEES = Array.from({ length: DERNIERE_ANNEE - PREMIERE_ANNEE + 1 }, (_, i) => PREMIERE_ANNEE + i);

/* Ce que la page appelle une métrique, l'indicateur de la base qui la
   nourrit, et la conversion vers l'unité affichée. */
const METRIQUES = [
  { cle: "gdp", chemin: "economie/pib/pib-total", facteur: 1e9, decimales: 2 },
  { cle: "gdp_per_capita", chemin: "economie/pib/pib-par-habitant", facteur: 1, decimales: 0 },
  { cle: "trade_balance", chemin: "economie/pib/balance-commerciale", facteur: 1e9, decimales: 2 },
  { cle: "inflation", chemin: "economie/dette/inflation", facteur: 1, decimales: 1 },
];

const arrondir = (v, d) => {
  const f = 10 ** d;
  return Math.round(v * f) / f;
};

const { pont } = JSON.parse(fs.readFileSync(path.join(RACINE, "data/pont-geographies.json"), "utf8"));
const nomDeCarte = {};
for (const [nom, iso3] of Object.entries(pont)) nomDeCarte[iso3] = nom;

/* Lecture de la base : indicateur → ISO3 → { iso2, valeurs } */
const lu = {};
const fiches = {};
const horsPlage = new Set();
for (const m of METRIQUES) {
  const dossier = path.join(RACINE, "data", m.chemin);
  fiches[m.cle] = JSON.parse(fs.readFileSync(path.join(dossier, "_indicateur.json"), "utf8"));
  const par = new Map();
  for (const f of fs.readdirSync(dossier)) {
    if (!/^[A-Z]{3}\.json$/.test(f)) continue;
    const d = JSON.parse(fs.readFileSync(path.join(dossier, f), "utf8"));
    for (const a of Object.keys(d.data)) {
      const n = Number(a);
      if (n < PREMIERE_ANNEE || n > DERNIERE_ANNEE) horsPlage.add(a);
    }
    par.set(d.country, d);
  }
  lu[m.cle] = par;
}

/* Tous les pays présents dans au moins un indicateur, dans l'ordre des ISO3
   — le fichier doit être reproductible au bit près d'une exécution à l'autre. */
const tousPays = new Set();
for (const m of METRIQUES) for (const k of lu[m.cle].keys()) tousPays.add(k);

const paysSortie = {};
const rapport = { retenus: 0, valeurs: 0, sansNomDeCarte: [], parMetrique: {} };
for (const m of METRIQUES) rapport.parMetrique[m.cle] = 0;

for (const iso3 of [...tousPays].sort()) {
  const nom = nomDeCarte[iso3];
  if (!nom) {
    rapport.sansNomDeCarte.push(iso3);
    continue;
  }
  let iso2 = null;
  const series = METRIQUES.map((m) => {
    const d = lu[m.cle].get(iso3);
    iso2 ??= d?.iso2 ?? null;
    return ANNEES.map((annee) => {
      const brut = d?.data?.[String(annee)];
      if (brut === undefined || brut === null) return null;
      rapport.parMetrique[m.cle] += 1;
      rapport.valeurs += 1;
      return arrondir(brut / m.facteur, m.decimales);
    });
  });
  if (!series.some((s) => s.some((v) => v !== null))) continue;
  paysSortie[nom] = { iso3, iso2, series };
  rapport.retenus += 1;
}

const ancien = fs.existsSync(F_SORTIE) ? JSON.parse(fs.readFileSync(F_SORTIE, "utf8")) : null;
const socle = {
  /* La date de génération ne dit rien des données : on garde celle du socle
     existant tant que son contenu ne bouge pas, pour qu'un diff ne montre que
     de vraies différences. */
  genereLe: ancien?.genereLe ?? new Date().toISOString().slice(0, 10),
  annees: ANNEES,
  colonnes: METRIQUES.map((m) => m.cle),
  sources: Object.fromEntries(
    METRIQUES.map((m) => [
      m.cle,
      {
        indicateur: fiches[m.cle].cleHistorique ?? fiches[m.cle].indicateur,
        libelle: fiches[m.cle].libelle,
        source: fiches[m.cle].sources.join(" · "),
      },
    ]),
  ),
  pays: paysSortie,
};

if (!SIMULATION) {
  fs.mkdirSync(path.dirname(F_SORTIE), { recursive: true });
  fs.writeFileSync(F_SORTIE, JSON.stringify(socle) + "\n");
}
console.log(
  `${SIMULATION ? "SIMULATION · " : ""}socle : ${rapport.retenus} pays · ${rapport.valeurs} valeurs` +
    ` · ${ANNEES.length} années`,
);
for (const [k, n] of Object.entries(rapport.parMetrique)) console.log(`  ${k.padEnd(16)} ${n}`);
if (rapport.sansNomDeCarte.length) console.log(`  sans nom de carte : ${rapport.sansNomDeCarte.join(", ")}`);
if (horsPlage.size) console.log(`  années hors plage ignorées : ${[...horsPlage].join(", ")}`);

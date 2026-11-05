#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   SOCLE ÉCONOMIE — la base devient ce que la page affiche

   La page /map/economy lisait des chiffres saisis à la main. Elle lit
   désormais la base : ce script fabrique, à partir de data/countries/, le
   seul fichier dont la page a besoin.

   USAGE
     node scripts/importer-donnees/socle-economie.mjs [--simulation]

   TOUTES LES ANNÉES, PAS UN ÉCHANTILLON
     La base couvre 1960 à 2025. Le socle les porte toutes : 1974 doit valoir
     1974 et non l'année repère la plus proche. C'est la raison d'être du
     fichier — une frise qui ramène cinq années à une seule ne montre pas des
     données, elle montre un palier.

   POURQUOI UN FICHIER INTERMÉDIAIRE
     Charger les 217 fiches complètes dans le navigateur reviendrait à payer
     les libellés, les sources et les unités de chaque indicateur pour chaque
     pays. Le socle ne garde que les nombres, joint les noms de la carte, et
     convertit une bonne fois dans les unités que l'écran affiche.

   LA FORME DU FICHIER
     Chaque pays porte quatre séries alignées sur `annees`, dans l'ordre de
     `colonnes` : PIB, PIB par habitant, balance extérieure, inflation. Une
     case vaut null quand la source ne publie rien — et null veut dire absent,
     jamais zéro. Ranger par série plutôt que par année épargne les treize
     mille clés d'années que le navigateur téléchargerait pour rien.

   CE QUI NE SE DISCUTE PAS
     · Aucune valeur n'est inventée, ni interpolée d'une année sur l'autre.
     · Les arrondis sont ceux de l'affichage, jamais moins précis que lui :
       deux décimales en milliards valent les dix millions près.
     · Le pont ISO3 → nom de carte est celui de pont-geographies.json. Aucun
       rapprochement de noms n'est improvisé ici.
   ═══════════════════════════════════════════════════════════════════════════ */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const RACINE = path.resolve(import.meta.dirname, "../..");
const DIR_PAYS = path.join(RACINE, "data/countries");
const F_PONT = path.join(RACINE, "data/pont-geographies.json");
const F_CATALOGUE = path.join(RACINE, "data/catalogue-indicateurs.json");
const F_SORTIE = path.join(RACINE, "src/data/economy/genere/socle-economie.json");

/* La plage que la base couvre. Une année ajoutée à un import futur se prend
   ici, et se retrouve dans la frise sans autre intervention. */
const PREMIERE_ANNEE = 1960;
const DERNIERE_ANNEE = 2025;
const ANNEES = Array.from(
  { length: DERNIERE_ANNEE - PREMIERE_ANNEE + 1 },
  (_, i) => PREMIERE_ANNEE + i
);

/* Ce que la page appelle une métrique, et l'indicateur de la base qui la
   nourrit. L'unité est celle de l'affichage, après conversion. */
const METRIQUES = [
  { cle: "gdp",            indicateur: "pib",                 facteur: 1e9, decimales: 2 },
  { cle: "gdp_per_capita", indicateur: "pib_par_habitant",    facteur: 1,   decimales: 0 },
  { cle: "trade_balance",  indicateur: "balance_commerciale", facteur: 1e9, decimales: 2 },
  { cle: "inflation",      indicateur: "inflation",           facteur: 1,   decimales: 1 },
];

function arrondir(v, decimales) {
  const f = 10 ** decimales;
  return Math.round(v * f) / f;
}

function main() {
  const simulation = process.argv.includes("--simulation");
  const { pont } = JSON.parse(fs.readFileSync(F_PONT, "utf8"));
  const catalogue = JSON.parse(fs.readFileSync(F_CATALOGUE, "utf8"));

  /* Le pont va du nom de carte vers l'ISO3 ; ici on a besoin de l'inverse,
     puisqu'on parcourt les fiches. Un ISO3 ne porte qu'un nom de carte. */
  const nomDeCarte = {};
  for (const [nom, iso3] of Object.entries(pont)) nomDeCarte[iso3] = nom;

  const fichiers = fs.readdirSync(DIR_PAYS).filter((f) => f.endsWith(".json")).sort();
  const paysSortie = {};
  const rapport = {
    fiches: fichiers.length,
    sansNomDeCarte: [],
    retenus: 0,
    valeurs: 0,
    parMetrique: Object.fromEntries(METRIQUES.map((m) => [m.cle, 0])),
    couvertureAnnee: {},
    indicateursAbsents: METRIQUES.filter((m) => !catalogue[m.indicateur]).map((m) => m.indicateur),
    horsPlage: new Set(),
  };

  for (const fichier of fichiers) {
    const fiche = JSON.parse(fs.readFileSync(path.join(DIR_PAYS, fichier), "utf8"));
    const nom = nomDeCarte[fiche.iso3];
    if (!nom) {
      rapport.sansNomDeCarte.push(`${fiche.iso3} (${fiche.nom})`);
      continue;
    }

    // Une année publiée hors de la plage du socle serait perdue en silence :
    // on la signale plutôt que de l'ignorer.
    for (const ind of Object.values(fiche.indicateurs ?? {})) {
      for (const a of Object.keys(ind.valeurs ?? {})) {
        const n = Number(a);
        if (n < PREMIERE_ANNEE || n > DERNIERE_ANNEE) rapport.horsPlage.add(a);
      }
    }

    const series = METRIQUES.map((m) => {
      const valeurs = fiche.indicateurs?.[m.indicateur]?.valeurs;
      return ANNEES.map((annee) => {
        const brut = valeurs?.[String(annee)];
        if (brut === undefined || brut === null) return null;
        rapport.parMetrique[m.cle] += 1;
        rapport.valeurs += 1;
        rapport.couvertureAnnee[annee] = (rapport.couvertureAnnee[annee] ?? 0) + 1;
        return arrondir(brut / m.facteur, m.decimales);
      });
    });

    // Un pays dont aucune série ne porte rien n'a pas à figurer.
    if (!series.some((s) => s.some((v) => v !== null))) continue;
    paysSortie[nom] = { iso3: fiche.iso3, iso2: fiche.iso2, series };
    rapport.retenus += 1;
  }

  const socle = {
    genereLe: new Date().toISOString().slice(0, 10),
    annees: ANNEES,
    // L'ordre des séries de chaque pays. Le lecteur s'y réfère plutôt que de
    // le supposer.
    colonnes: METRIQUES.map((m) => m.cle),
    sources: Object.fromEntries(
      METRIQUES.filter((m) => catalogue[m.indicateur]).map((m) => [
        m.cle,
        { indicateur: m.indicateur, libelle: catalogue[m.indicateur].nom, source: catalogue[m.indicateur].source },
      ])
    ),
    pays: Object.fromEntries(Object.keys(paysSortie).sort().map((k) => [k, paysSortie[k]])),
  };

  const texte = JSON.stringify(socle) + "\n";
  rendreCompte(rapport, socle, texte, simulation);

  if (simulation) {
    console.log("\nSIMULATION : aucun fichier écrit.");
    return;
  }
  fs.mkdirSync(path.dirname(F_SORTIE), { recursive: true });
  fs.writeFileSync(F_SORTIE, texte, "utf8");
  console.log(`\nÉcrit : ${path.relative(RACINE, F_SORTIE)}`);
}

function rendreCompte(r, socle, texte, simulation) {
  const ko = (n) => (n / 1024).toFixed(0) + " Ko";
  console.log(`\nSOCLE ÉCONOMIE${simulation ? " (SIMULATION)" : ""}\n`);
  console.log(`Fiches lues        : ${r.fiches}`);
  console.log(`Pays retenus       : ${r.retenus}`);
  console.log(`Années             : ${socle.annees[0]} → ${socle.annees[socle.annees.length - 1]} (${socle.annees.length})`);
  console.log(`Valeurs écrites    : ${r.valeurs}`);
  console.log(`Poids              : ${ko(Buffer.byteLength(texte))} · ${ko(zlib.gzipSync(texte).length)} compressé`);
  console.log(`\nValeurs par métrique :`);
  for (const [cle, n] of Object.entries(r.parMetrique)) console.log(`   ${cle.padEnd(16)} ${String(n).padStart(6)}`);

  const annees = socle.annees;
  const couv = annees.map((a) => r.couvertureAnnee[a] ?? 0);
  console.log(`\nCouverture (valeurs par année, les quatre métriques cumulées) :`);
  console.log(`   la plus faible : ${Math.min(...couv)} · la plus forte : ${Math.max(...couv)}`);
  for (const a of [annees[0], 1980, 2000, 2020, 2023, 2024, 2025]) {
    if (!annees.includes(a)) continue;
    console.log(`   ${a} : ${r.couvertureAnnee[a] ?? 0}`);
  }

  if (r.indicateursAbsents.length) {
    console.log(`\n⚠ Indicateurs absents du catalogue, donc absents du socle :`);
    for (const i of r.indicateursAbsents) console.log(`   ${i}`);
  }
  if (r.horsPlage.size) {
    console.log(`\n⚠ Années publiées hors de la plage du socle, donc non reprises :`);
    console.log(`   ${[...r.horsPlage].sort().join(", ")}`);
    console.log(`   Élargir PREMIERE_ANNEE / DERNIERE_ANNEE en tête de ce script.`);
  }
  if (r.sansNomDeCarte.length) {
    console.log(`\n⚠ Pays de la base sans nom de carte dans le pont (${r.sansNomDeCarte.length}) :`);
    for (const c of r.sansNomDeCarte.slice(0, 12)) console.log(`   ${c}`);
    if (r.sansNomDeCarte.length > 12) console.log(`   … et ${r.sansNomDeCarte.length - 12} autres`);
  }
}

main();

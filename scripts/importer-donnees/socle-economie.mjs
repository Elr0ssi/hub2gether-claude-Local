#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   SOCLE ÉCONOMIE — la base devient ce que la page affiche

   La page /map/economy lisait des chiffres saisis à la main. Elle lit
   désormais la base : ce script fabrique, à partir de data/countries/, le
   seul fichier dont la page a besoin.

   USAGE
     node scripts/importer-donnees/socle-economie.mjs [--simulation]

   POURQUOI UN FICHIER INTERMÉDIAIRE
     La base tient 217 fiches de 66 années. La page en montre sept. Charger
     les 217 fiches dans le navigateur pour n'en lire que sept années serait
     payer soixante fois trop cher ; le socle extrait ces sept années, joint
     les noms de la carte, et convertit une bonne fois dans les unités que
     l'écran affiche — milliards pour le PIB et la balance, unité pour le
     PIB par habitant, pourcentage pour l'inflation.

   CE QUI NE SE DISCUTE PAS
     · Aucune valeur n'est inventée. Une année que la Banque mondiale ne
       publie pas reste absente du socle, et le pays sort en gris.
     · Les arrondis sont ceux de l'affichage, jamais moins précis que lui :
       trois décimales en milliards valent le million près.
     · Chaque année est un quadruplet [PIB, PIB/hab., balance, inflation] et
       non un objet : les quatre mêmes clés répétées treize cents fois
       pesaient un tiers du fichier, que le navigateur téléchargeait pour
       rien. Une case sans valeur vaut null, et null veut dire absent.
     · Le pont ISO3 → nom de carte est celui de pont-geographies.json. Aucun
       rapprochement de noms n'est improvisé ici.
   ═══════════════════════════════════════════════════════════════════════════ */

import fs from "node:fs";
import path from "node:path";

const RACINE = path.resolve(import.meta.dirname, "../..");
const DIR_PAYS = path.join(RACINE, "data/countries");
const F_PONT = path.join(RACINE, "data/pont-geographies.json");
const F_CATALOGUE = path.join(RACINE, "data/catalogue-indicateurs.json");
const F_SORTIE = path.join(RACINE, "src/data/economy/genere/socle-economie.json");

/* Les années que la frise chronologique propose. En ajouter une ici suffit à
   la faire apparaître partout : carte, classement, fiche pays. */
const ANNEES = [2000, 2005, 2010, 2015, 2020, 2023, 2025];

/* Ce que la page appelle une métrique, et l'indicateur de la base qui la
   nourrit. L'unité est celle de l'affichage, après conversion. */
const METRIQUES = [
  { cle: "gdp",             indicateur: "pib",              facteur: 1e9, decimales: 3 },
  { cle: "gdp_per_capita",  indicateur: "pib_par_habitant", facteur: 1,   decimales: 0 },
  { cle: "trade_balance",   indicateur: "balance_commerciale", facteur: 1e9, decimales: 3 },
  { cle: "inflation",       indicateur: "inflation",        facteur: 1,   decimales: 2 },
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
    parAnnee: Object.fromEntries(ANNEES.map((a) => [a, Object.fromEntries(METRIQUES.map((m) => [m.cle, 0]))])),
    indicateursAbsents: [],
  };

  for (const m of METRIQUES) {
    if (!catalogue[m.indicateur]) rapport.indicateursAbsents.push(m.indicateur);
  }

  for (const fichier of fichiers) {
    const fiche = JSON.parse(fs.readFileSync(path.join(DIR_PAYS, fichier), "utf8"));
    const nom = nomDeCarte[fiche.iso3];
    if (!nom) {
      rapport.sansNomDeCarte.push(`${fiche.iso3} (${fiche.nom})`);
      continue;
    }

    const valeurs = {};
    for (const annee of ANNEES) {
      const quadruplet = METRIQUES.map((m) => {
        const brut = fiche.indicateurs?.[m.indicateur]?.valeurs?.[String(annee)];
        if (brut === undefined || brut === null) return null;
        rapport.parAnnee[annee][m.cle] += 1;
        rapport.valeurs += 1;
        return arrondir(brut / m.facteur, m.decimales);
      });
      // Une année sans la moindre valeur n'a pas à figurer : l'absence se lit
      // à l'absence, pas à une rangée de null.
      if (quadruplet.some((v) => v !== null)) valeurs[annee] = quadruplet;
    }

    if (!Object.keys(valeurs).length) continue;
    paysSortie[nom] = { iso3: fiche.iso3, iso2: fiche.iso2, valeurs };
    rapport.retenus += 1;
  }

  const socle = {
    genereLe: new Date().toISOString().slice(0, 10),
    annees: ANNEES,
    // L'ordre des métriques dans chaque quadruplet. Le lecteur s'y réfère
    // plutôt que de le supposer.
    colonnes: METRIQUES.map((m) => m.cle),
    sources: Object.fromEntries(
      METRIQUES.filter((m) => catalogue[m.indicateur]).map((m) => [
        m.cle,
        { indicateur: m.indicateur, libelle: catalogue[m.indicateur].nom, source: catalogue[m.indicateur].source },
      ])
    ),
    pays: Object.fromEntries(Object.keys(paysSortie).sort().map((k) => [k, paysSortie[k]])),
  };

  rendreCompte(rapport, socle, simulation);

  if (simulation) {
    console.log("\nSIMULATION : aucun fichier écrit.");
    return;
  }
  fs.mkdirSync(path.dirname(F_SORTIE), { recursive: true });
  fs.writeFileSync(F_SORTIE, JSON.stringify(socle) + "\n", "utf8");
  const ko = (fs.statSync(F_SORTIE).size / 1024).toFixed(0);
  console.log(`\nÉcrit : ${path.relative(RACINE, F_SORTIE)} (${ko} Ko)`);
}

function rendreCompte(r, socle, simulation) {
  console.log(`\nSOCLE ÉCONOMIE${simulation ? " (SIMULATION)" : ""}\n`);
  console.log(`Fiches lues        : ${r.fiches}`);
  console.log(`Pays retenus       : ${r.retenus}`);
  console.log(`Valeurs écrites    : ${r.valeurs}`);
  console.log(`Années             : ${socle.annees.join(", ")}`);
  console.log(`\nCouverture par année et par métrique :`);
  const cles = METRIQUES.map((m) => m.cle);
  console.log(`   année  ${cles.map((c) => c.padStart(16)).join("")}`);
  for (const a of socle.annees) {
    console.log(`   ${a}   ${cles.map((c) => String(r.parAnnee[a][c]).padStart(16)).join("")}`);
  }

  if (r.indicateursAbsents.length) {
    console.log(`\n⚠ Indicateurs absents du catalogue, donc absents du socle :`);
    for (const i of r.indicateursAbsents) console.log(`   ${i}`);
  }
  if (r.sansNomDeCarte.length) {
    console.log(`\n⚠ Pays de la base sans nom de carte dans le pont (${r.sansNomDeCarte.length}) :`);
    for (const c of r.sansNomDeCarte.slice(0, 12)) console.log(`   ${c}`);
    if (r.sansNomDeCarte.length > 12) console.log(`   … et ${r.sansNomDeCarte.length - 12} autres`);
  }
}

main();

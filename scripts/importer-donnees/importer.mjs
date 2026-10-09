#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   IMPORTER — un CSV entre, la base en ressort enrichie

   Le même script sert pour tous les indicateurs. Ce qui change d'un fichier à
   l'autre — le nom de l'indicateur, son unité — se passe en argument ; la
   structure du CSV, elle, est reconnue plutôt que supposée.

   USAGE
     node scripts/importer-donnees/importer.mjs <fichier.csv> \
       --indicateur pib --unite USD --libelle "PIB" [--source "Banque mondiale"]

   CE QUE FAIT LE SCRIPT
     lire le CSV → reconnaître son format → écarter les agrégats →
     normaliser en ISO3 → enrichir data/countries/<ISO3>.json →
     mettre à jour data/catalogue-indicateurs.json →
     régénérer public/data-generated/cartes/<indicateur>/<année>.json →
     contrôler et rendre compte.

   DEUX RÈGLES QUI NE SE DISCUTENT PAS
     · Une valeur absente reste absente. Jamais de zéro à la place, jamais
       d'interpolation : zéro est une mesure, l'absence n'en est pas une.
     · Un fichier pays déjà écrit n'est pas remplacé mais enrichi. Un import
       de dette ne doit pas effacer le PIB importé la veille.
   ═══════════════════════════════════════════════════════════════════════════ */

import fs from "node:fs";
import path from "node:path";
import { PAYS, AGREGATS } from "./referentiel.mjs";

const RACINE = path.resolve(import.meta.dirname, "../..");
const DIR_PAYS = path.join(RACINE, "data/countries");
const DIR_CARTES = path.join(RACINE, "public/data-generated/cartes");
const F_REFERENTIEL = path.join(RACINE, "data/referentiel-pays.json");
const F_CATALOGUE = path.join(RACINE, "data/catalogue-indicateurs.json");

/* ── Lecture d'un CSV ──────────────────────────────────────────────────────
   Un analyseur minimal mais correct : les guillemets protègent les virgules,
   et un guillemet doublé à l'intérieur d'un champ vaut un guillemet. C'est
   tout ce dont un fichier de la Banque mondiale a besoin, et cela évite une
   dépendance pour trois cents lignes. */
function lireCsv(texte) {
  const lignes = [];
  let champ = "";
  let ligne = [];
  let dansGuillemets = false;

  for (let i = 0; i < texte.length; i++) {
    const c = texte[i];
    if (dansGuillemets) {
      if (c === '"') {
        if (texte[i + 1] === '"') { champ += '"'; i++; }
        else dansGuillemets = false;
      } else champ += c;
      continue;
    }
    if (c === '"') { dansGuillemets = true; continue; }
    if (c === ",") { ligne.push(champ); champ = ""; continue; }
    if (c === "\n") { ligne.push(champ); lignes.push(ligne); ligne = []; champ = ""; continue; }
    if (c === "\r") continue;
    champ += c;
  }
  if (champ !== "" || ligne.length) { ligne.push(champ); lignes.push(ligne); }
  return lignes;
}

/**
 * Où commence le tableau, et où sont les années.
 *
 * Les exports de la Banque mondiale posent quelques lignes de métadonnées
 * avant l'en-tête. Plutôt que de compter ces lignes — leur nombre change d'un
 * millésime à l'autre — on cherche la première ligne qui contient à la fois un
 * code pays et des années : c'est l'en-tête, par construction.
 */
function reconnaitreFormat(lignes) {
  for (let i = 0; i < Math.min(lignes.length, 20); i++) {
    const l = lignes[i].map((c) => c.trim());
    const annees = l
      .map((c, k) => ({ annee: Number(c), colonne: k }))
      .filter((a) => Number.isInteger(a.annee) && a.annee >= 1800 && a.annee <= 2200);
    if (annees.length < 3) continue;

    const colCode = l.findIndex((c) => /^country code$|^code$|^iso3$/i.test(c));
    const colNom = l.findIndex((c) => /^country name$|^pays$|^country$/i.test(c));
    if (colCode === -1) continue;

    return { ligneEntete: i, colCode, colNom, annees };
  }
  throw new Error(
    "Format non reconnu : aucune ligne ne porte à la fois un code pays et des colonnes d'années."
  );
}

const lireJson = (f, defaut) =>
  fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : defaut;

/** JSON lisible en revue de code, sans être bavard : deux espaces, rien de plus. */
const ecrireJson = (f, obj) => {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, JSON.stringify(obj, null, 2) + "\n");
};

function args() {
  const a = process.argv.slice(2);
  const fichier = a.find((x) => !x.startsWith("--"));
  const opt = (nom) => {
    const i = a.indexOf(`--${nom}`);
    return i === -1 ? undefined : a[i + 1];
  };
  return {
    fichier,
    indicateur: opt("indicateur"),
    unite: opt("unite"),
    libelle: opt("libelle"),
    source: opt("source") ?? "Banque mondiale",
    simulation: a.includes("--simulation"),
  };
}

function main() {
  const o = args();
  if (!o.fichier || !o.indicateur || !o.unite || !o.libelle) {
    console.error(
      "Usage : node scripts/importer-donnees/importer.mjs <fichier.csv> " +
        "--indicateur <id> --unite <unité> --libelle <nom affiché> [--source <source>] [--simulation]"
    );
    process.exit(1);
  }
  if (!/^[a-z0-9_]+$/.test(o.indicateur)) {
    console.error("L'identifiant d'indicateur doit être en minuscules, sans accent ni espace.");
    process.exit(1);
  }

  const lignes = lireCsv(fs.readFileSync(o.fichier, "utf8").replace(/^﻿/, ""));
  const fmt = reconnaitreFormat(lignes);
  const corps = lignes.slice(fmt.ligneEntete + 1).filter((l) => l[fmt.colCode]?.trim());

  const rapport = {
    reconnus: 0,
    agregats: 0,
    inconnus: [],
    valeurs: 0,
    manquantes: 0,
    nonNumeriques: 0,
    doublons: [],
    ecrasees: [],
    anneesVues: new Set(),
  };

  /** ISO3 → { année: valeur } */
  const parPays = new Map();

  for (const l of corps) {
    const code = l[fmt.colCode].trim().toUpperCase();
    if (AGREGATS.has(code)) { rapport.agregats++; continue; }
    if (!PAYS[code]) {
      rapport.inconnus.push(`${code} (${(l[fmt.colNom] ?? "").trim()})`);
      continue;
    }
    if (parPays.has(code)) { rapport.doublons.push(code); continue; }

    const valeurs = {};
    for (const { annee, colonne } of fmt.annees) {
      const brut = (l[colonne] ?? "").trim();
      if (brut === "") { rapport.manquantes++; continue; }
      const v = Number(brut);
      if (!Number.isFinite(v)) { rapport.nonNumeriques++; continue; }
      valeurs[annee] = v;
      rapport.valeurs++;
      rapport.anneesVues.add(annee);
    }
    parPays.set(code, valeurs);
    rapport.reconnus++;
  }

  if (o.simulation) {
    rendreCompte(o, rapport);
    console.log("\nSIMULATION : aucun fichier écrit.");
    return;
  }

  /* ── Fiches pays : on enrichit, on ne remplace pas ────────────────────── */
  for (const [code, valeurs] of parPays) {
    const f = path.join(DIR_PAYS, `${code}.json`);
    const fiche = lireJson(f, {
      iso3: code,
      iso2: PAYS[code].iso2,
      nom: PAYS[code].nom,
      indicateurs: {},
    });
    // Le référentiel fait autorité sur l'identité, même sur une fiche ancienne.
    fiche.iso3 = code;
    fiche.iso2 = PAYS[code].iso2;
    fiche.nom = PAYS[code].nom;
    fiche.indicateurs ??= {};

    const avant = fiche.indicateurs[o.indicateur];
    if (avant) {
      // Une valeur déjà présente qui change de millésime n'est pas une erreur,
      // mais elle se signale : c'est la seule façon de voir une révision de
      // source passer dans la base.
      for (const [annee, v] of Object.entries(valeurs)) {
        const ancien = avant.valeurs?.[annee];
        if (ancien !== undefined && ancien !== v) {
          rapport.ecrasees.push(`${code} ${annee} : ${ancien} → ${v}`);
        }
      }
    }

    fiche.indicateurs[o.indicateur] = {
      libelle: o.libelle,
      unite: o.unite,
      source: o.source,
      valeurs: Object.fromEntries(
        Object.entries(valeurs).sort(([a], [b]) => Number(a) - Number(b))
      ),
    };

    // Les indicateurs restent triés : un diff Git lisible vaut mieux qu'un
    // fichier dont l'ordre dépend de la date d'import.
    fiche.indicateurs = Object.fromEntries(
      Object.entries(fiche.indicateurs).sort(([a], [b]) => a.localeCompare(b))
    );
    ecrireJson(f, fiche);
  }

  /* ── Référentiel : la table de jointure, réécrite depuis la source ────── */
  ecrireJson(F_REFERENTIEL, PAYS);

  /* ── Catalogue ────────────────────────────────────────────────────────── */
  const catalogue = lireJson(F_CATALOGUE, {});
  const annees = [...rapport.anneesVues].sort((a, b) => a - b);
  catalogue[o.indicateur] = {
    nom: o.libelle,
    unite: o.unite,
    source: o.source,
    anneesDisponibles: annees,
    paysCouverts: rapport.reconnus,
    misAJour: new Date().toISOString().slice(0, 10),
  };
  ecrireJson(
    F_CATALOGUE,
    Object.fromEntries(Object.entries(catalogue).sort(([a], [b]) => a.localeCompare(b)))
  );

  /* ── Fichiers de carte : une année, une ressource ─────────────────────── */
  const dossier = path.join(DIR_CARTES, o.indicateur);
  fs.rmSync(dossier, { recursive: true, force: true });
  for (const annee of annees) {
    const pays = {};
    for (const [code, valeurs] of parPays) {
      if (valeurs[annee] !== undefined) pays[code] = valeurs[annee];
    }
    if (Object.keys(pays).length === 0) continue;
    ecrireJson(path.join(dossier, `${annee}.json`), {
      annee,
      indicateur: o.indicateur,
      unite: o.unite,
      source: o.source,
      pays,
    });
  }

  rendreCompte(o, rapport);
}

function rendreCompte(o, r) {
  const annees = [...r.anneesVues].sort((a, b) => a - b);
  console.log(`\nIMPORT ${o.libelle.toUpperCase()} TERMINÉ\n`);
  console.log(`Pays reconnus      : ${r.reconnus}`);
  console.log(`Agrégats écartés   : ${r.agregats}`);
  console.log(`Codes inconnus     : ${r.inconnus.length}`);
  console.log(`Années             : ${annees[0]} → ${annees[annees.length - 1]}`);
  console.log(`Valeurs importées  : ${r.valeurs}`);
  console.log(`Valeurs manquantes : ${r.manquantes}`);
  console.log(`Doublons           : ${r.doublons.length}`);
  console.log(`Non numériques     : ${r.nonNumeriques}`);
  console.log(`Valeurs révisées   : ${r.ecrasees.length}`);

  // Une anomalie n'est pas corrigée en silence : elle est nommée.
  if (r.inconnus.length) {
    console.log(`\n⚠ Codes absents du référentiel, donc non importés :`);
    for (const c of r.inconnus) console.log(`   ${c}`);
  }
  if (r.doublons.length) {
    console.log(`\n⚠ Pays présents deux fois dans le CSV, seule la première ligne est retenue :`);
    for (const c of r.doublons) console.log(`   ${c}`);
  }
  if (r.ecrasees.length) {
    console.log(`\n⚠ Valeurs déjà présentes et révisées par cet import (${r.ecrasees.length}) :`);
    for (const c of r.ecrasees.slice(0, 12)) console.log(`   ${c}`);
    if (r.ecrasees.length > 12) console.log(`   … et ${r.ecrasees.length - 12} autres`);
  }
  console.log("");
}

main();

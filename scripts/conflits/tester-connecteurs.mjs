#!/usr/bin/env node
/* Teste le connecteur UCDP sur de petits fichiers fabriqués (fixtures) : agrégation exacte, refus des doublons et des colonnes absentes. */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { lireAcd, lireGed } from "./importer-ucdp.mjs";

const d = dirname(fileURLToPath(import.meta.url));
const lire = (f) => readFileSync(resolve(d, "fixtures", f), "utf8");
const acd = lireAcd(lire("acd-test.csv"), "26.1", {});
assert.equal(acd.lignes, 2); assert.deepEqual(acd.annees, [2001, 2002]);
const ged = lireGed(lire("ged-test.csv"), "26.1", {});
const e1 = ged.agregats.find((a) => a.type_violence === 1);
assert.equal(ged.evenements, 3); assert.equal(e1.evenements, 2); assert.equal(e1.deces_best, 7); assert.equal(e1.deces_low, 5); assert.equal(e1.deces_high, 11); assert.equal(e1.deces_civils, 2);
assert.throws(() => lireGed(lire("ged-test.csv") + "1,2001,1,Test,Testland,2001-04-02,5,3,8,2\n", "26.1", {}), /dupliqué/);
assert.throws(() => lireAcd("a,b\n1,2\n", "26.1", {}), /colonnes absentes/);
const cand = lireGed(lire("ged-test.csv"), "26.0.9", {}, true);
assert.equal(cand.statut, "preliminaire"); assert.equal(cand.agregats[0].mois, "2001-04");
console.log("Connecteur UCDP : 6 vérifications passent (sur fixtures, pas sur un export réel).");

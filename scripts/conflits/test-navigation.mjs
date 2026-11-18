#!/usr/bin/env node
/* Test de navigation (navigateur) : Pays → Crise → rubriques → Retour au pays → Synthèse, avec adresse partageable.
   Prérequis : un serveur lancé (npx next start -p 3300) et Playwright (chemin dans PLAYWRIGHT, par défaut /opt/node-tools/node_modules/playwright).
   Usage : node scripts/conflits/test-navigation.mjs [http://localhost:3300] */
import { createRequire } from "node:module";
import assert from "node:assert/strict";

const base = process.argv[2] ?? "http://localhost:3300";
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT ?? "/opt/node-tools/node_modules/playwright");
const b = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
const erreurs = [];
p.on("pageerror", (e) => erreurs.push(e.message));
const pan = () => p.locator(".cf-panneau");
const txt = async () => (await pan().innerText()).replace(/\n+/g, " | ");
try {
  await p.goto(`${base}/conflits?pays=Afghanistan`, { waitUntil: "networkidle" });
  await p.waitForTimeout(1500);
  assert.match(await txt(), /Afghanistan/, "le pays de l'adresse est sélectionné");
  await pan().locator(".cf-fiches button", { hasText: "Afghanistan – Pakistan" }).first().click();
  await p.waitForTimeout(800);
  assert.match(await txt(), /Retour aux conflits · Afghanistan/, "bouton « Retour aux conflits · pays »");
  assert.equal(await pan().locator(".cf-rub-on").count(), 0, "les rubriques sont fermées par défaut");
  assert.match(p.url(), /conflit=VIZ-C-046/, "l'adresse porte la fiche");
  await pan().locator(".cf-rub-t", { hasText: "Chronologie" }).click();
  await pan().locator(".cf-rub-t", { hasText: "Sources" }).click();
  assert.equal(await pan().locator(".cf-rub-on").count(), 1, "une seule rubrique ouverte à la fois");
  const indicateurs = await pan().locator(".cf-ind").count();
  assert.ok(indicateurs >= 1 && indicateurs <= 3, `trois indicateurs au plus (trouvé ${indicateurs})`);
  await pan().locator(".cf-retour").click();
  await p.waitForTimeout(500);
  assert.match(await txt(), /Synthèse.*Afghanistan/, "retour à la liste des conflits du pays, sans repasser par le monde");
  assert.match(p.url(), /pays=Afghanistan/);
  await pan().locator(".cf-retour").click();
  await p.waitForTimeout(500);
  assert.match(await txt(), /Synthèse mondiale/, "retour à la synthèse mondiale");
  // adresse partageable : une fiche et un point
  await p.goto(`${base}/conflits?conflit=VIZ-C-005&point=EV-013`, { waitUntil: "networkidle" });
  await p.waitForTimeout(1500);
  assert.match(await txt(), /Bandar Abbas/, "un point est ouvert depuis l'adresse");
  assert.deepEqual(erreurs, [], "aucune erreur JavaScript");
  console.log("Navigation : Pays → Crise → rubriques → Retour → adresse partageable : OK");
} catch (e) {
  console.error("ÉCHEC :", e.message);
  process.exitCode = 1;
} finally {
  await b.close();
}

/* Teste la fusion dossiers locaux + enrichissement : npm run conflits:tester-fusion (via tsx). */
import assert from "node:assert/strict";
import { dossierFusionne, ficheImportee } from "../../src/data/conflits/fusion";
import { dossiersDuFichier } from "../../src/data/conflits/chiffres";

const local = dossiersDuFichier();
// 1. Le local garde la priorité : son résumé et ses chiffres sont intacts.
const ukr = dossierFusionne("VIZ-C-001")!;
assert.equal(ukr.resume, local.get("VIZ-C-001")!.resume);
assert.ok(ukr.chiffres.some((c) => c.valeur === "16 431"), "le chiffre local de l'ONU est conservé");
assert.ok(ukr.chiffres.some((c) => c.valeur === "437" && c.libelle === "civils tués"), "le chiffre importé (OHCHR, juillet 2026) est ajouté");
// 2. Trois indicateurs au plus mis en avant, de natures distinctes d'abord.
const natures = ukr.chiffres.slice(0, 3).map((c) => c.nature);
assert.equal(new Set(natures.slice(0, 2)).size, Math.min(2, new Set(ukr.chiffres.map((c) => c.nature)).size));
// 3. Divergences conservées : les trois chiffres de déplacés du Soudan restent disponibles, avec leur date.
const sdn = dossierFusionne("VIZ-C-020")!;
const dep = sdn.chiffres.filter((c) => c.nature === "deplaces");
assert.ok(dep.length >= 3, "les chiffres de déplacés qui divergent sont tous conservés");
assert.equal(sdn.chiffres.slice(0, 3).filter((c) => c.nature === "deplaces").length, 1, "un seul chiffre de déplacés en vedette");
// 4. Morts et blessés ne se mélangent pas : deux chiffres distincts.
const afg = dossierFusionne("VIZ-C-046")!;
assert.ok(afg.chiffres.some((c) => c.libelle === "civils tués" && c.valeur === "56") && afg.chiffres.some((c) => c.libelle === "civils blessés" && c.valeur === "129"));
assert.ok(afg.chiffres.find((c) => c.valeur === "56")!.perimetre!.includes("Afghanistan"), "le périmètre est conservé");
// 5. Un contenu importé non recoupé reste « à vérifier ».
const arm = dossierFusionne("VIZ-C-002")!;
assert.equal(arm.resumeVerification, "a_verifier");
assert.ok(arm.causes!.every((c) => c.verification === "a_verifier"));
// 6. Les fenêtres de mesure ne sont pas des événements de chronologie.
assert.ok(!ukr.chronologie!.some((j) => /^(Début|Fin) de la période/.test(j.titre)));
// 7. Les liens corrigés : la Cisjordanie n'est pas une sous-crise de Gaza.
const cis = dossierFusionne("VIZ-C-007")!;
assert.equal(cis.liens![0].type, "connexite_non_hierarchique");
assert.equal(ficheImportee("VIZ-C-029")!.liens[0].type, "connexite_non_hierarchique");
// 8. Aucune fiche sans dossier n'a de chiffre inventé.
let sans = 0;
for (let i = 1; i <= 68; i++) { const d = dossierFusionne(`VIZ-C-${String(i).padStart(3, "0")}`); if (d && d.chiffres.length === 0) sans++; }
assert.ok(sans >= 50, "la plupart des fiches n'ont aucun chiffre : rien n'est inventé");
console.log("Fusion : 8 vérifications passent.");

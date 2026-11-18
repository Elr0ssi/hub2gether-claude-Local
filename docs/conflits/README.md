# Module Conflits — données, import et contrôles

## Les couches de données (rien n'écrase rien)

| Couche | Fichier | Rôle |
|---|---|---|
| Inventaire d'origine | `src/data/conflits/inventaire-2026-10-31.json` | les 68 fiches `VIZ-C-001…068`, intactes |
| Dossiers locaux | `chiffres-2026-10-31.json`, `evenements-2026-10-31.json` | contenu rédigé et sourcé ligne à ligne ; **prioritaire** |
| Enrichissement importé | `enrichi.json` (+ `pays-iso.json`) | produit par `npm run conflits:importer` depuis `data/sources/conflits/` ; chaque contenu garde son état de vérification |
| Fusion | `fusion.ts` | local d'abord, puis l'importé sans doublon ; jamais de promotion en « vérifié » |
| Relations diplomatiques | `relations-diplomatiques.json` | structure prête, **vide** |
| Historique long | `public/conflits/historique/` | produit par `importer-ucdp.mjs` ; **vide** (aucun jeu téléchargé) |

Réversibilité : supprimer `enrichi.json` ramène le site à l'inventaire + dossiers locaux. L'import est idempotent (même source → même fichier, contrôlé par `conflits:valider`).

## Commandes

```bash
npm run conflits:importer            # source brute → enrichi.json (journal d'import inclus)
npm run conflits:valider             # 30+ contrôles (IDs, ISO3, références, dates, chiffres, null ≠ 0, liens génériques, idempotence…)
npm run conflits:tester-fusion       # la fusion locale + importée
npm run conflits:tester-connecteurs  # connecteur UCDP, sur fixtures
npm run conflits:tester-navigation   # navigateur : Pays → Crise → rubriques → Retour (serveur lancé sur :3300)
npm run conflits:couverture          # docs/conflits/COUVERTURE.md et .csv
npm run conflits:tout                # tout, sauf la navigation
```

## Règles de transformation de l'import

1. Les acteurs en doublon (même rôle, même source) sont fusionnés : on garde le nom le plus complet (13 éléments listés dans `enrichi.json › journal`).
2. Les « Début / Fin de la période du bilan… » et « Point de situation… » ne sont pas des événements : ce sont les bornes d'un chiffre, déjà portées par lui. Ils sont écartés de la chronologie.
3. Les liens entre crises suivent `liens_crises` : 8 liens parent→enfant jugés erronés (Cisjordanie/Gaza, ADF/M23…) sont des « crises connexes, distinctes », pas des sous-crises.
4. Les chiffres qui se recouvrent restent tous disponibles (rubrique Conséquences, avec leur date). Seuls trois sont mis en avant, de natures distinctes d'abord (bilan humain cumulé, déplacés, bilan récent…).

## Historique long (UCDP) — comment l'importer

1. Télécharger les CSV officiels sur https://ucdp.uu.se/downloads/ (UCDP/PRIO ACD 26.1, GED 26.1, Candidate 26.0.9). Licence CC BY 4.0 : attribution « Uppsala Conflict Data Program ».
2. `npm run conflits:ucdp -- acd chemin.csv --version 26.1`, puis `ged`, puis `candidate` (préliminaire : jamais mélangé aux données définitives).
3. Le connecteur refuse un fichier aux colonnes inattendues et tout identifiant d'événement dupliqué (pas de double compte).
4. Rapprocher ensuite un conflit UCDP d'une fiche `VIZ-C-…` par une **table de correspondance relue à la main** (non fournie) : le nom et le pays ne suffisent pas.

L'API UCDP exige un jeton ; ACLED demande un compte et des droits de redistribution. Aucun des deux n'est contourné.

## Modèle SQL

`db/conflits/001_schema.up.sql` / `.down.sql` : sources, pays, conflits, rôles pays, acteurs, causes, événements, observations (`value` NULL = inconnu), relations diplomatiques (vote ONU = `proxy`), liens entre crises, versions de données, journal d'import, tables historiques UCDP. Non appliqué : aucune base n'est connectée.

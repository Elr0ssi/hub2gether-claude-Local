# Rubrique Ressources — import FAOSTAT

## Importer un nouveau fichier

```bash
# 1. déposer le CSV d'export FAOSTAT (format long, « Download data → CSV ») dans data/sources/faostat/
# 2. l'importer
npm run ressources:importer -- data/sources/faostat/MON_FICHIER.csv [--export AAAA-MM-JJ]
# 3. contrôler : le JSON doit reproduire chaque ligne du CSV
npm run ressources:valider -- data/sources/faostat/MON_FICHIER.csv
```

Le script reconnaît seul les **produits** (un fichier par `Domain Code` + `Item Code`), les **indicateurs** (codes d'élément : 5510 production,
5312 surface récoltée, 5412 rendement ; un autre code devient `el-<code>`), les **unités** et les **années**. Il écrit :

- `public/ressources/<domaine>-<produit>.json` : le fichier chargé par le navigateur (une seule ressource à la fois) ;
- `public/ressources/index.json` : la liste des ressources disponibles (alimente le sélecteur) ;
- `src/data/ressources/rapports/<id>.json` : le rapport d'import (lignes, flags, unités, correspondances géographiques).

Pour donner un nom français et une place dans l'arborescence : ajouter la ressource dans `src/data/ressources/catalogue.ts`.
Sans cela, elle apparaît sous « Autres cultures » avec son nom FAOSTAT.

## Règles de transformation

1. Valeur vide → `null`, jamais 0. Un 0 présent dans le CSV reste 0.
2. Le flag FAOSTAT (`A`, `E`, `I`, `X`, `M`) et la note (« Unofficial figure ») sont conservés pour chaque valeur.
3. Aucune interpolation, aucune année ajoutée : le nombre de cellules renseignées = le nombre de lignes du CSV.
4. Les totaux « monde » sont **recalculés** (somme des entités de type pays ou historique présentes l'année concernée) pour la production et la
   surface ; ils ne sont jamais présentés comme officiels. Pas de total pour un rendement.
5. La date d'export du CSV n'est jamais l'année des observations.

## Géographie

La correspondance se fait par **code M49** dans `src/data/ressources/geo-m49.json` (pas par nom approché) :

| type | exemples | traitement |
|---|---|---|
| `pays` | États-Unis, Iran, Türkiye… | rattaché à une géométrie Natural Earth (`ne`) ; alias documentés (Iran → `Iran`, Türkiye → `Turkey`…) |
| `historique` | URSS, Yougoslavie, Tchécoslovaquie, Soudan (ancien)… | série conservée, **pas** de géométrie ; comptée dans les classements et les totaux sur ses années seulement ; ses successeurs sont déclarés (`successeurs`) et le validateur vérifie qu'ils ne se recouvrent jamais |
| `agregat` | « China » (159) = Chine continentale + Taïwan | exclu des classements et des totaux (il recouvre 156 et 158) |

Un code M49 absent de ce fichier est signalé « inconnu » dans le rapport : l'ajouter, puis relancer l'import.

## Brancher une base (Supabase)

Seules `src/data/ressources/charger.ts` (`chargerIndex`, `chargerJeu`) lisent les données : les remplacer par des requêtes renvoyant la même forme
(`JeuRessource`, voir `types.ts`). Les calculs (`calc.ts`) et les composants n'en dépendent pas.

## Rendements d'élevage (import du 3 novembre 2026)

Pour l'élevage, FAOSTAT publie le « rendement » sous d'autres codes que les cultures : 5417 (kg/animal), 5424 (g/animal), 5413 (nombre/animal). L'importateur retient UN seul de ces éléments comme « rendement » par produit, dans l'ordre 5412 > 5417 > 5424 > 5413 ; les autres restent dans le fichier sous « el-<code> » (par exemple, pour les œufs, la production en milliers d'œufs et le nombre d'œufs par poule), sans être affichés. L'unité d'origine est conservée dans les fichiers ; l'affichage écrit « kg/animal », « g/animal ».
Un produit qui n'a pas de surface ni de rendement (vin, huiles) n'affiche que la production et la part.
Les territoires et petits États absents de la géométrie du globe (Guyane, Guadeloupe, Martinique, La Réunion, Macao, Nauru, Tuvalu, Maldives) figurent au classement et aux courbes, pas sur la carte.

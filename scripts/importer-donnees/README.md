# Importer un jeu de données

Trois commandes, toujours les mêmes, quel que soit l'indicateur.

```bash
# 1. Vérifier ce que le fichier contient, sans rien écrire
node scripts/importer-donnees/importer.mjs <fichier.csv> \
  --indicateur dette --unite USD --libelle "Dette" --simulation

# 2. Importer
node scripts/importer-donnees/importer.mjs <fichier.csv> \
  --indicateur dette --unite USD --libelle "Dette" --source "FMI · WEO"

# 3. Contrôler
node scripts/importer-donnees/controler.mjs
```

## Ce que produit un import

| Chemin | Rôle |
| --- | --- |
| `data/countries/<ISO3>.json` | Le stock. Enrichi, jamais remplacé. |
| `data/referentiel-pays.json` | ISO3 → code à deux lettres et nom français. |
| `data/catalogue-indicateurs.json` | Les indicateurs, leurs unités, leurs années. |
| `data/pont-geographies.json` | Nom d'une forme Natural Earth → ISO3. |
| `public/data-generated/cartes/<ind>/<année>.json` | Ce que le navigateur charge. |

## Les règles

**Une absence reste une absence.** Aucune valeur manquante n'est comblée par un
zéro ni par une interpolation. Zéro est une mesure ; l'absence n'en est pas
une, et l'interface écrit « Donnée indisponible ».

**Les fiches pays s'enrichissent.** Importer la dette n'efface pas le PIB
importé la veille. Une valeur déjà présente qui change est signalée dans le
rapport plutôt que remplacée en silence.

**La jointure se fait sur ISO3.** Jamais sur un nom : deux sources écrivent
rarement « Corée du Sud » de la même façon. Le nom français ne sert qu'à
l'affichage.

**Les agrégats sont écartés.** « Monde », « Union européenne » et les tranches
de revenu portent un code à trois lettres comme les pays. Sans la liste tenue
dans `referentiel.mjs`, « Monde » serait premier de tous les classements.

## Ajouter un pays ou un agrégat

Tout se passe dans `scripts/importer-donnees/referentiel.mjs`. Un code absent
du référentiel n'est pas importé, et le rapport le nomme : c'est le signal
qu'il faut compléter la table, pas contourner le contrôle.

## Après un import

Le fond de carte a changé ? Régénérer le pont :

```bash
node scripts/importer-donnees/pont-geographies.mjs
```

## 3. Alimenter la page économie

La carte et le classement de `/map/economy` ne lisent pas les 217 fiches : ce
serait payer soixante-six années pour n'en afficher sept. Un troisième script
extrait de la base le strict nécessaire.

```bash
npm run donnees:socle
```

Il écrit `src/data/economy/genere/socle-economie.json` : les sept années que la
frise propose, pour les 206 pays que le pont rattache à un nom de carte, dans
les unités de l'écran — milliards pour le PIB et la balance, unité pour le PIB
par habitant, pourcentage pour l'inflation. Chaque année y est un quadruplet
`[PIB, PIB/hab., balance, inflation]`, et `null` veut dire absent.

**À relancer après chaque import**, sinon la page continue d'afficher l'état
précédent de la base. Les années affichées se changent dans la constante
`ANNEES` en tête du script.

Ce que la page prend dans le socle et rien d'autre : PIB, PIB par habitant,
balance extérieure, inflation. Dette, chômage, entreprises, population active
et âge de la retraite restent des estimations saisies à la main, en attente de
leur propre import.

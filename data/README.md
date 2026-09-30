# La base

Une seule référence : `/data`. Tout le reste en dérive et se régénère.

```
CATÉGORIE → SOUS-CATÉGORIE → INDICATEUR → PAYS → ANNÉES
```

```
data/
├── economie/
│   ├── pib/          pib-total · pib-par-habitant · balance-commerciale
│   │                 exportations · importations
│   ├── dette/        dette-montant · dette-sur-pib · inflation
│   ├── emploi/       taux-chomage · population-active · age-retraite
│   └── entreprises/  nombre-entreprises
├── demographie/
│   └── population/   nombre-habitants
├── politique/        (vide — voir plus bas)
├── ressources/       (vide — voir plus bas)
│
├── countries/                 l'ancienne forme, conservée le temps de la bascule
├── referentiel-pays.json      ISO3 → code à deux lettres et nom français
├── pont-geographies.json      nom d'une forme Natural Earth → ISO3
└── catalogue-indicateurs.json l'ancien catalogue, conservé
```

## Un fichier pays

`data/economie/pib/pib-total/FRA.json`

```json
{
  "country": "FRA",
  "indicator": "GDP_TOTAL",
  "unit": "USD",
  "source": "Banque mondiale · WDI (NY.GDP.MKTP.CD)",
  "name": "France",
  "iso2": "FR",
  "data": { "1960": 61959085885.3427, "...": "...", "2025": 3366315927447.33 }
}
```

Deux champs n'apparaissent que lorsqu'ils ont lieu d'être :

- **`notes`** — ce que la source dit de ses propres limites. Par exemple :
  l'âge de la retraite n'est publié qu'une fois, daté 2023 ; la valeur est
  rangée sous 2023 et n'est pas recopiée sur les autres années.
- **`autres_sources`** — quand un second jeu couvre le même indicateur. Il
  garde sa source, son unité et ses années, à côté de la série principale.
  Rien n'est fusionné : choisir entre deux chiffres est une décision, elle ne
  se prend pas dans un script.

Chaque dossier d'indicateur porte aussi un `_indicateur.json` : libellé, unité,
sources, années couvertes, nombre de pays. La base se décrit elle-même.

## Les règles

**Une absence reste une absence.** Une année sans mesure n'a pas de clé. Zéro
est une mesure, l'absence n'en est pas une, et l'écran écrit « — ».

**Toutes les années.** La base couvre 1960 à 2025 là où la source les publie.
On ne raccourcit pas un historique pour alléger un fichier : c'est le rôle du
cache.

**La précision de la source.** Aucun arrondi à l'entrée. Le PIB de la France en
1960 vaut `61959085885.3427`, pas `62`. Les arrondis appartiennent à
l'affichage.

**La jointure se fait sur ISO3.** Jamais sur un nom : deux sources écrivent
rarement « Corée du Sud » de la même façon. Un pays absent du référentiel
arrête l'import et se fait nommer dans le rapport — c'est le signal qu'il faut
compléter la table, pas contourner le contrôle.

**Rien n'est supprimé.** Un import enrichit les fiches existantes.

## Le cache

`/cache/globe/<indicateur>/<année>.json` — `{ "FRA": valeur, "USA": valeur }`

Ce n'est pas une seconde base : c'est une vue, entièrement dérivée de `/data`,
régénérée par une commande, jamais modifiée à la main. Elle existe pour que le
globe obtienne tous les pays d'une année d'un seul coup au lieu d'ouvrir deux
cents fiches.

`src/data/economy/genere/socle-economie.json` est un cache de même nature : le
fichier compact que la page économie importe.

## Les commandes

```bash
npm run base:migrer     # (re)construit /data depuis les sources historiques
npm run base:verifier   # compare valeur par valeur, sans tolérance
npm run base:cache      # régénère /cache/globe
npm run base:socle      # régénère le socle compact du site
```

## Ajouter un jeu de données

1. Identifier la catégorie, la sous-catégorie et l'indicateur.
2. S'il est nouveau, ajouter une ligne au registre de
   `scripts/base/migrer.mjs` — c'est là que vivent les chemins et les unités.
3. Convertir les pays en ISO3. Un code inconnu arrête le traitement.
4. Écrire les valeurs telles quelles, avec leur source et leurs années.
5. `npm run base:verifier` puis `npm run base:cache` et `npm run base:socle`.

Ajouter le PIB 2026 ne crée pas une base : cela ajoute `"2026": valeur` dans
les fichiers de `data/economie/pib/pib-total/` et régénère les caches.

## Les catégories encore vides

`politique/` et `ressources/` n'ont pas de sous-dossier : on n'en crée pas
avant d'avoir les données. La forme est arrêtée, elle attend son contenu.

Pour la démographie, la suite prévue — mortalité (dont les causes de décès),
natalité, migrations — suivra la même forme dès que les jeux correspondants
seront fournis.

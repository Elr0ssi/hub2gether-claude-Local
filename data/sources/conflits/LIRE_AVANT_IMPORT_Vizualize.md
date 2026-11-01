# VIZUALIZE — NOTE DE LIVRAISON ET MÉTHODOLOGIE

**Version :** 0.2.0-editorial — données figées au 31 octobre 2026, assemblage du 1er novembre 2026.

## Contenu livré

- 68 fiches conservées, mêmes IDs `VIZ-C-001` à `VIZ-C-068` que l'inventaire original.
- 250 entrées géographiques (249 entités ISO 3166-1 et XKX/Kosovo non officiel) ; ce ne sont PAS 250 pays souverains.
- 88 sources ou pistes bibliographiques ; les sources héritées doivent être vérifiées fiche par fiche.
- 9 observations chiffrées rattachées à 5 conflits, avec origine, période, date et périmètre.
- 14 repères temporels documentés sur 7 crises.
- 189 associations acteur–conflit (noms issus de la base, quelques rôles recoupés).
- Catégories inchangées : 29 conflits armés, 28 violences armées, 11 tensions géopolitiques.

## Limites majeures

**Ce n'est pas une base exhaustive de tous les conflits de l'histoire ni un inventaire exhaustif de tous les pays.** C'est un enrichissement de l'inventaire à 68 fiches, avec un index géographique mondial.

**Toutes les causes ne sont pas prêtes à être publiées.** Les causes/ enjeux créés pour les 68 entrées sont des synthèses éditoriales qui doivent être recoupées contre les sources exactes ; `verification=contextualisation_editoriale_a_verifier` les marque explicitement. Les résumés existants sont maintenus, mais ne sont pas des observations factuelles temps réel.

**Les acteurs ont été conservés, mais des rôles précis restent à vérifier.** Les liens pays et leur statut territorial sont une première cartographie ; ils demandent une relecture des cas transfrontaliers, maritimes et politiquement contestés.

**Chiffres :** ne pas fabriquer une valeur de victimes, déplacés ou nombre d'incidents pour les 63 fiches sans observation numérique retenue. `0` n'est pas synonyme de valeur inconnue. Les chiffres UNHCR/Myanmar peuvent désigner une crise nationale plus large que le seul conflit, mention obligatoire.

**Historiques :** aucun jeu GED historique massif n'a été téléchargé dans ce paquet. Les repères chronologiques fournis sont un noyau partiel, non une série quantitative complète. L'API UCDP exige désormais un token ; des téléchargements gratuits (CC BY 4.0) sont indiqués dans `sources_pour_imports_massifs`.

**Diplomatie :** les liens de différends ajoutés sont uniquement associés aux crises identifiées. Ils ne constituent ni un réseau diplomatique exhaustif ni un indicateur de soutien/hostilité. Ne pas fabriquer d'alliances à partir de l'identité des acteurs.

**Ne pas sommer :** les conflits de pays, les sous-conflits, les morts/bessés et les déplacés issus de différentes périodes ou catégories se chevauchant.

## Structure JSON

`conflits[]` contient les anciens `id` intacts, `nom_court`, `resume`, `causes`, `acteurs`, `chronologie`, `chiffres_cles`, `consequences`, `diplomatie`, `donnees_carte`, `sources` et `manque`.

`pays[]` contient les liens vers les fiches impliquant chaque pays, une liste distincte `conflits_theatres` (lieu géographique affecté) et `relations_diplomatiques` partielles.

`sources[]` répertorie les URLs et leur niveau de contrôle ; ne pas assimiler un lien à une vérification de toutes les assertions.

## Principes d'intégration

- Importer par `id`, sans remplacer arbitrairement les fiches existantes ni écraser les données locales plus récentes.
- Revoir et corriger les dossiers `contextualisation_editoriale_a_verifier` avant publication.
- Afficher `null` et `Donnée indisponible` pour tout champ non étayé.
- Afficher séparément les estimations civiles, militaires, morts, blessés, déplacés internes, réfugiés, populations dans le besoin.
- Préserver les périodes et unités ; ne pas confondre **stock** et **flux**, ni période d'observation et date de publication.
- Récupérer les datasets officiels UCDP 1946–2025 (annualisé), GED 1989–2025, Candidate jusqu'à septembre 2026 selon version, puis relier **prudemment** les conflits UCDP aux 68 fiches via tables de correspondance vérifiées.
- Distinguer 1946–2025 historique confirmé et 2026 préliminaire; ne pas mélanger dans un même score sans avertissement.
- Utiliser des sources fiables et des avertissements d'actualisation, sans prétendre offrir du temps réel.

## Contrôles effectués

- 68 IDs uniques et catégories originales inchangées.
- Chaque observation chiffrée est rattachée à une source connue, avec une date et un périmètre.
- Les codes pays référencés sont définis, y compris XKX/Kosovo.
- Les liens conflit_parent sont résolus lorsqu'une fiche parente existe.

## Points encore à produire avant mise en ligne complète

1. Vérification humaine du texte de 68 fiches et des 68 liens originaux.
2. Réconciliation de chaque dossier avec les versions et IDs UCDP/ACLED exacts.
3. Série temporelle à partir des évènements datés et **agrégations dédupliquées**.
4. Dossiers de relations diplomatiques officiels (accords, traités, sanctions, votes ONU), à traiter séparément.
5. Chronologie et points cartographiques précis sur les dossiers restants.
6. Vérification des droits de redistribution par source, notamment ONU et ACLED.

## Audit supplémentaire de structure

- **29 des 68 sources originelles** renvoient à une page d’accueil/tableau de bord CFR générique, sans article dédié à chaque sous-crise : à remplacer prioritairement par une URL précise.
- **8 liens parents potentiellement erronés** ont été convertis en liens de crise connexe (voir `liens_crises`). Exemples : Cisjordanie n’est pas une sous-crise de Gaza ; ADF n’est pas une composante du M23 ; violences du Middle Belt ne sont pas une branche de Boko Haram.
- Les autres liens parents sont conservés comme `sous_dossier_potentiel`, à valider.
- 68 résumés sont désormais étoffés; seuls ceux marqués `documenté_sur_source_consultee` peuvent être envisagés pour publication, après contrôle d’actualité.

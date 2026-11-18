# PROMPT MAÎTRE POUR CLAUDE — VIZUALIZE / BASE MONDIALE DES CONFLITS

## Mission

Tu interviens comme **architecte de données, développeur full-stack, analyste géopolitique et responsable qualité éditoriale** sur mon site Vizualize, onglet « Conflits ».

Je joins un paquet `PACK_Vizualize_Conflits_2026-10-31.zip` contenant notamment :
- `Vizualize_Conflits_Enrichis_2026-10-31.json` : **68 fiches existantes conservées**, index de 250 entités géographiques (249 ISO 3166-1 + XKX/Kosovo non officiel), sources, premiers enrichissements, champs de vérification, observations chiffrées sourcées ;
- `Vizualize_Conflits_Index_68.csv` : table synthétique des 68 fiches et causes, acteurs, pays associés ;
- `LIRE_AVANT_IMPORT_Vizualize.md` : audit qualité, limites et règles ;
- cinq petits dossiers JSON exemplaires ;
- ce prompt.

**Mission principale :** analyser l'architecture existante, intégrer sans perte les 68 fiches, puis construire progressivement une **véritable base documentaire géopolitique mondiale, historique et géolocalisée**, dotée de sources auditables. Je veux que le lecteur choisisse un pays et un conflit, consulte d'abord une fiche épurée, puis développe « Causes », « Acteurs », « Chronologie », « Conséquences », « Sources » et les relations diplomatiques pertinentes.

**NE PAS** inventer des chiffres, dates, conflits, déclarations, positions diplomatiques, alliances ou points cartographiques. La base jointe est partielle et plusieurs résumés/cause sont explicitement marqués « à vérifier » : ne les transforme pas arbitrairement en contenu vérifié. Les chiffres de maquettes UX antérieures sont fictifs et ne doivent jamais alimenter les données.

## Étape 0 — Inspection et conservation

1. Parcours le dépôt, relève la stack, les fichiers de données, les composants Conflits, le moteur globe/carte, les sélecteurs, les filtres, la recherche, la timeline, les exports et les éventuels services Backend/Supabase.
2. Identifie le fichier réellement utilisé pour alimenter les 68 fiches et fais une comparaison structurelle avec le JSON joint, en conservant la version locale quand elle est plus récente ou plus complète et sourcée.
3. Réalise une sauvegarde versionnée ou un commit avant migration. Ne détruis aucune donnée existante. Crée une migration idempotente, réversible, avec une table de correspondance des anciens champs et des nouveaux.
4. Garde exactement les IDs `VIZ-C-001` à `VIZ-C-068`. Vérifie les éventuels identifiants de pays, événements et relations déjà utilisés dans le site.
5. N'altère ni le design de la page économique, ni le globe mondial, ni les composants hors du périmètre Conflits.
6. La date de l'inventaire est le **31 octobre 2026**. Ce n'est ni la date du dernier incident pour chaque crise, ni une preuve d'activité à cette date, ni une actualisation temps réel.

## Étape 1 — Contrat de données stable

Conserve un modèle normalisé dont les entités logiques sont :

`countries` : code ISO3, code ISO2, nom localisé, région, type (État, territoire, code spécial), aliases, statut de reconnaissance éventuellement contesté, géométrie Natural Earth. Le code `XKX` n'est pas officiel ISO 3166-1 : le traiter explicitement, pas comme un État unanimement reconnu. Une absence de crise dans l'inventaire signifie **aucune fiche disponible**, jamais « pays pacifique ».

`conflicts` : ID stable, nom long, **titre court UX**, catégorie originale, statut opérationnel sourcé, contexte géographique, période début/fin avec précision temporelle, texte bref, niveau de vérification, date d'édition, sources.

`conflict_country_roles` : identifiant de conflit, code pays, rôle `theatre` / `belligerant` / `etat_impliqué` / `mediateur` / `affecté` / `autre`, intervalle de validité, source, justification. **Ne pas confondre pays concerné diplomatiquement et zone de combat.** Pas de coloration de tout un pays pour un événement limité à quelques districts.

`actors` et `conflict_actors` : noms, alias, type (État, armée, mouvement, milice, institution, coalition), nature de la participation, objectifs officiellement revendiqués, observations indépendantes, périodes d'implication, source et prudence éditoriale. Distinguer un soutien allégué d'un soutien démontré.

`causes` : crise, cause structurelle, déclencheur, facteur aggravant, enjeux, texte lisible, période d'application, source. Distinguer clairement **causalité étayée** de **lecture analytique / hypothèse**.

`events` : un événement daté, avec titre, récit court, conflit(s), acteurs, géométrie/point si connu, précision de date, source précise, niveau de vérification, type (combat, frappe, massacre, accord, cessez-le-feu, sanction, médiation, déplacement, élection, prise de ville...), identifiant unique stable et lien éventuel vers une observation UCDP/ACLED.

`observations` : indicateurs numériques séparés **par type exact, unité, population, période, territoire, granularité, provenance, qualité et date de mise à jour**. Prévoir `value`, `min`, `max`, `range_type`, `period_start`, `period_end`, `as_of`, `publication_date`, `source_id`, `reliability`, `methodology`, `is_cumulative`, `stock_or_flow`, `disaggregation`, `coverage_note`, `caveat`. Un bilan « morts et blessés » ne se transforme jamais en morts seuls. Ne pas additionner les chiffres à périmètres ou périodes se chevauchant. Un total national de déplacés ne représente pas forcément les déplacés d'un conflit particulier.

`diplomatic_relations` : relation bilatérale ou multilatérale **datée** (`sanction`, `alliance_traite`, `rupture_relations`, `normalisation`, `mediation`, `soutien_militaire_documente`, `vote_onu`, `differend`, etc.), orientation, acteurs, date début/fin, preuve (traité, résolution, rapport, déclaration), attribution. Les votes de l'ONU servent de proxy de convergence sur des résolutions, jamais de preuve suffisante d'une alliance. Pas de notes abstraites « pays amis / ennemis » sans méthode.

`conflict_edges` : liens entre crises avec typologie claire (`sous_dossier`, `meme_contexte_regional`, `operations_associees`, `conflit_distinct_memes_acteurs`, etc.). Ne pas faire artificiellement de la Cisjordanie une « sous-crise » de Gaza, de l'ADF une « branche » du M23 ou des violences du Middle Belt une branche de Boko Haram. Respecter les huit liens corrigés dans le JSON.

`sources` : URL exacte vers le document ou l'article, organisme, type (ONU, base scientifique, ONG, média, gouvernement / partie impliquée), date de publication, accès, éventuelle version, citation bibliographique, droit d'utilisation, statut de contrôle et date de consultation. Lier **chaque fait** à une ou plusieurs preuves, et pas seulement une unique source en bas de fiche.

`data_versions` et `import_log` : version de chaque jeu, source des fichiers importés, date d'ingestion, checksum, licence, nombre de lignes, règles de déduplication, avertissements, erreurs et résultats de validation.

Toutes les tables liées doivent avoir des clés étrangères. Conserver en plus un **export JSON par crise**, construit automatiquement à partir du modèle normalisé, pour les composants front-end.

## Étape 2 — Travaux de recherche sur les 68 fiches

**Pour chacune des 68 fiches et seulement sur des sources accessibles et vérifiées**, compléter :

**Résumé** : 80 à 130 mots en français clair, 2 à 4 paragraphes courts au maximum : quoi, qui, où, depuis quand, état des lieux, enjeu. Chaque phrase substantielle doit pouvoir être reliée à sa source.

**Causes** : histoire du conflit, causes structurelles, responsabilités et déclencheurs, avec distinctions explicites entre faits, accusations des parties et hypothèses d'analystes ; intégrer les ruptures et négociations sur la durée.

**Acteurs** : personnes morales et coalitions, objectifs, rôle militaire / politique / diplomatique / humanitaire, zones de présence, alliés ou soutiens documentés, évolutions dans le temps, controverses et différences entre sources.

**Chiffres clés** : rechercher décès (civils / combattants / non classés), blessés, incidents, attaques contre les civils, déplacés internes, réfugiés, personnes ayant besoin d'aide, destructions et impacts économiques, **uniquement quand mesurables**. Pour chaque chiffre : période, source détaillée, date, unité, périmètre, catégorie statistique, estimation/faible/forte, fiabilité (`vérifié`, `estimé`, `revendiqué`, `contesté`). Zéro seulement si la source constate un zéro mesuré ; sinon `null` et `manque`.

**Chronologie** : 5 à 15 étapes majeures par crise **si attestées**, dont antécédents historiques et tournants récents ; événement précis avec date et source, sans dates fictives. Si l'événement n'est connu qu'au mois ou à l'année, conserver explicitement cette précision sans le transformer en jour artificiel.

**Conséquences** : humaines, économiques, territoriales, environnementales, diplomatiques et humanitaires selon disponibilité ; différencier les effets du conflit des autres catastrophes ou crises nationales. Garder un champ `impact_attribution_confidentielle` / `note_limite` si l'imputation est délicate.

**Cartographie** : rechercher 5 à 15 **points précis documentés** pour les conflits disposant d'événements géolocalisés, pas tous les conflits mécaniquement. Conserver les coordonnées WGS84, date, précision géographique, nom de lieu et source ; aucun point inventé au centroïde national. Ne pas rendre des positions sensibles actuelles de manière inappropriée ; privilégier le niveau d'agrégation déjà publié par les sources.

**Sources** : remplacer les sources « dashboard » trop générales par des liens ciblés et stables (article, rapport, jeu de données versionné). Le paquet initial compte **29 liens CFR génériques** : ce chantier est prioritaire.

Ne jamais afficher « fiche complète » si elle n'a pas passé la validation. Prévoir les statuts `brouillon`, `sources_a_verifier`, `valide`, `publie`, `archive`.

## Étape 3 — Profondeur temporelle et couverture mondiale

La base initiale comprend **68 fiches éditoriales**, **29 conflits armés**, **28 violences armées**, **11 tensions géopolitiques**. Ne pas confondre ces 68 fiches avec 68 guerres officielles distinctes, ni avec l'ensemble des conflits mondiaux. Construis une **extension historique** et une **vue par pays**, sans inventer de crises pour les pays sans entrée.

Utilise les sources officielles complémentaires suivantes selon leurs conditions d'accès et de licence :

- **UCDP/PRIO Armed Conflict Dataset 26.1** : années 1946–2025, conflits annuels impliquant un État ; définitions et seuils du codebook. https://ucdp.uu.se/downloads/
- **UCDP GED 26.1** : événements violents géocodés 1989–2025 ; décès `best / low / high` et classification type de violence, précision des coordonnées/dates. Téléchargement CSV versionné gratuit en CC BY 4.0 avec attribution. https://ucdp.uu.se/downloads/
- **UCDP Candidate (septembre 2026, version 26.0.9 / cumul janvier–septembre 26.01.26.09)** : données préliminaires ; présenter séparément des données définitives 2025. Ne jamais présenter octobre 2026 comme couvert si les observations arrêtent en septembre. La **nouvelle API UCDP exige un token** (voir https://ucdp.uu.se/apidocs/) : en absence de token, privilégie les exports officiels téléchargeables, ne contourne pas l'authentification.
- **ACLED** : événements de violence politique plus étendus, accès myACLED + token OAuth et éventuelles restrictions de redistribution : https://acleddata.com/api-documentation/getting-started. Ne mélange pas automatiquement ses décès avec UCDP sans harmonisation explicite.
- **UNHCR Refugee Data Portal / API** : catégories de déplacés et réfugiés, stocks vs flux, pays d'origine vs pays d'asile. Documenter la révision de l'API/portail à l'automne 2026. https://www.unhcr.org/refugee-statistics/insights/explainers/forcibly-displaced-api.html
- **IDMC GRID 2026** : déplacements internes, distinction « nombre de personnes déplacées » vs « nouveaux déplacements », et distinction conflit / catastrophes. https://www.internal-displacement.org/publications/2026-global-report-on-internal-displacement-grid/
- **OHCHR, UNAMA, BINUH, UNICEF, OCHA, EUAA, rapports du Conseil de sécurité, CICR** : compléter les données humanitaires et textes explicatifs, avec sources exactes pour chacun.
- **Votes à l'AGNU** : jeu officiel jusqu'à décembre 2025; respecter licence non-commerciale et attribution si applicable, et indiquer qu'il s'agit d'un indicateur indirect. https://digitallibrary.un.org/record/4060887?ln=fr

Ne pas télécharger, publier ou intégrer des données dont la licence ne le permet pas. En cas de blocage d'authentification / accès, créer un connecteur documenté et signaler « non importé ».

Créer deux vues temporelles distinctes :
1. **Historique long** (couverture selon source et période, souvent 1946–2025 au niveau annuel et 1989–2025 par événement) ;
2. **Actualité 2026** (événements préliminaires et bulletins institutionnels datés, avec leur niveau d'incertitude).

Prévoir une sélection année / intervalle / date et pouvoir naviguer d'une date à une autre sur le globe. Ne proposer un « classement des conflits les plus meurtriers » qu'après explicitation du dénominateur, de la période, des types de violences inclus et de la comparabilité géographique. Pas de « score de gravité » arbitraire.

## Étape 4 — Diplomatie sans réseau illisible

Une fiche pays, notamment France, États-Unis, Chine ou Russie, ne doit pas afficher toutes les relations bilatérales d'un coup.

Afficher des **relations contextualisées et filtrables** : `impliqués dans le conflit choisi`, `alliances documentées`, `médiations`, `sanctions`, `différends`, `votes ONU (proxy distinct)` et `histoire de la relation`. Faire une recherche par pays partenaire et un filtrage temporel.

Un lien diplomatique doit avoir sa **nature, sa preuve et sa période** ; des pays membres d'une même coalition ou votant pareil ne sont pas automatiquement amis.

Un traité de défense, une intervention militaire, une médiation et une déclaration sont des relations distinctes. Indiquer les changements dans le temps. L'absence de relation enregistrée signifie « donnée non renseignée », pas « aucun lien ».

## Étape 5 — Affichage dans Vizualize

Reprendre exactement notre direction UX : **grande carte à gauche, un seul rectangle blanc à droite**, pas de mosaïque de statistiques encombrante, pas de double rangée d'onglets, pas de filtre « Tous » obligatoire.

**Vue pays :** nom du pays, liste des crises associées ; sélectionne une crise.

**Vue crise :** bouton clair `← Retour aux conflits en [pays]`, titre court (`Afghanistan – Pakistan`, `RDC – M23`, etc.), catégorie, dates, localisation, intensité seulement si sourcée, au plus 3 chiffres clés comparables et sourcés, un résumé de 3–5 lignes, puis des **accordéons uniques** `Causes`, `Acteurs`, `Chronologie`, `Conséquences`, `Sources`. Fermer les accordéons par défaut ; en ouvrir un à la fois, avec animation discrète et scrolling correct. L'accès aux relations diplomatiques pertinentes peut s'intégrer à `Acteurs` ou à un accordéon dédié seulement si cela n'encombre pas la page.

**Interactions :** la carte recadre la zone, les points d'événements vérifiés sont sélectionnables, la timeline filtre les points sans inventer de géographie, le bouton retour conserve pays, zoom et filtres précédents, la sélection demeure accessible depuis une URL partageable.

**Qualité UI :** violet Vizualize pour les interactions, catégories rouge/orange/jaune sans confondre couleur et intensité, responsive mobile, navigation clavier, textes lisibles et mode « non renseigné » élégant.

**Affichage des chiffres :** les fiches doivent afficher clairement `56 civils tués — Afghanistan uniquement — 26 février au 5 mars 2026 — UNAMA (vérifié)`, plutôt que `56 morts` sans périmètre. Un lien ou infobulle doit détailler l'origine et l'incertitude.

## Étape 6 — Vérifications automatiques et éditoriales obligatoires

Crée une suite de tests couvrant au minimum :

- unicité des 68 IDs et conservation des catégories d'origine ;
- `pays ISO3` et codes non officiels explicites ;
- validité de toutes les références croisées (conflit, acteur, source, pays) ;
- pas d'événement daté après le 31/10/2026 dans cet instantané ;
- pas de date-journalier fictive pour les sources mensuelles ;
- pas de valeur chiffrée sans URL précise, année ou période, unité, définition, statut de fiabilité ;
- `null` ≠ 0 ;
- pas de double comptage dans les agrégations de décès, sous-crises et stocks de déplacés ;
- distinction morts, morts + blessés, population déplacée, besoins humanitaires ;
- impossibilité d'afficher un lien generic-dashboard comme preuve précise d'une statistique ;
- contrôle de fraîcheur, versions UCDP et statut préliminaire/définitif ;
- droits de redistribution ;
- navigation `Globe → Pays → Crise → Retour au pays`, filtres et accordéons ;
- contrôle visuel desktop/mobile et accessibilité des contrastes/accordéons.

Produis un **rapport de couverture** par crise : sections présentes, sections vérifiées, nombre de chiffres sourcés, événements datés, points cartographiques, sources précises, niveau de risque éditorial et liste des manques ; un champ inconnu reste `null` et `manque` doit être renseigné.

## Étape 7 — Déroulement concret et rendu

Travaille par lots **de huit crises maximum** pour la recherche éditoriale, afin de contrôler les liens et la qualité. Dans les lots, priorise les grandes crises et les exemples avec données vérifiées (Ukraine, Soudan, Myanmar, Afghanistan–Pakistan, Haïti, RDC–M23, Gaza, Éthiopie), puis couvre le reste des 68. La couverture mondiale historique doit être construite par imports versionnés UCDP, pas par ajout fictif de milliers de conflits rédigés à la main.

Sur le dépôt, effectue **réellement** : migrations, import, composants, adaptateurs, validations, tests, et génère des fichiers exécutables, pas seulement des recommandations.

Livrables attendus :
1. Inventaire des fichiers existants et stratégie de migration ;
2. Modèle de données et migrations SQL / JSON ;
3. 68 fiches enrichies, avec séparation stricte entre contenu vérifié et brouillon ;
4. Index pays et relations, pas de lien diplomatique inventé ;
5. Ingestions historiques UCDP et connecteurs externes légaux, quand accessibles ;
6. Interface à accordéons du panneau droit conforme à la maquette ;
7. Tests, état de couverture, journal des sources, dictionnaire de données ;
8. Liste précise des fichiers modifiés et des tâches restant bloquées par accès ou données manquantes.

**CRITÈRE DE SUCCÈS :** proposer énormément de profondeur accessible en deux clics, sans surcharge à l'écran, avec des données historiques comparables et des sources inspectables, et sans aucune affirmation de complétude artificielle. Si tu n'as pu vérifier qu'une partie des 68 fiches, indique exactement lesquelles ; ne remplis pas fictivement les autres.

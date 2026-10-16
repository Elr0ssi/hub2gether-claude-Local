# Les articles longs de Visualize — guide de travail

Ce guide s'adresse à toute personne (ou IA) qui doit **écrire ou modifier un article long** du site, en particulier un article sur la **dette publique d'un pays**. Il dit où est chaque chose, comment dupliquer un article existant et comment l'intégrer au site sans rien casser.

> **Résumé en une phrase.** Un article de dette = un dossier `src/articles/dette/<pays>/` (copié depuis `_modele/`), deux lignes d'inscription (`catalogue.ts`, `registre.ts`), et le site fait le reste : page, référencement, plan du site, carrousels, liens.

---

## 1. Le principe

- Chaque article long est **écrit à la main**. Un pays n'a pas les mêmes informations qu'un autre : on garde les chapitres dont on dispose des données, on en crée d'autres si le pays le demande (dette indexée sur l'inflation, régime fédéral, garanties d'État…). **Ce n'est pas un formulaire à remplir.**
- Les **briques** (titre de chapitre, figure sourcée, répartition, barres par date, étapes, FAQ…) sont partagées dans `cadre/` : on les assemble, on ne les réécrit pas.
- Les **chiffres** vivent dans `donnees.ts`, séparés du texte, chacun avec sa source et sa date.
- Les **montants** passent toujours par `montant(...)` : ils se convertissent dans la monnaie choisie par le lecteur (€, $, CN¥) au taux moyen de l'année.

## 2. Où est quoi

```
src/articles/
├─ LISEZ-MOI.md                  ← ce guide
├─ PROMPT-CHATGPT.md             ← le prompt à donner à une IA
└─ dette/
   ├─ cadre/                     ← LES BRIQUES, communes à tous les articles
   │  ├─ index.ts                   un seul point d'import : "@/articles/dette/cadre"
   │  ├─ ArticleLong.tsx            le squelette (menu, titre, sommaire, colonnes, « Continuer »)
   │  ├─ Chapitre.tsx  Figure.tsx  Etapes.tsx  Repartition.tsx  BarresParDate.tsx
   │  ├─ ChiffresCles.tsx           (ChiffresCles + ChiffresGrille)
   │  ├─ ListeQuestions.tsx  ChapitrePresse.tsx
   │  ├─ mouvement.tsx              (Leve, Compteur : animations qui n'enlèvent rien au HTML)
   │  ├─ montants.ts                (montant, enLettres, nombre, nf)
   │  └─ dossier.css                le style de tous les articles (préfixe de classes : `dos-`)
   ├─ france/                    ← L'ARTICLE DE RÉFÉRENCE (à lire avant d'écrire un autre pays)
   │  ├─ Article.tsx                la page : CHAPITRES + <ArticleLong> + un <Chapitre> par entrée
   │  ├─ Deficit.tsx                un chapitre à onglets (recettes / dépenses / déficit)
   │  ├─ fiche.tsx                  titre, métadonnées, données structurées, suggestions
   │  ├─ catalogue.ts               la fiche légère (titre, accroche, dates, adresse)
   │  ├─ donnees/                   les chiffres, avec sources (detteFrancaise.ts, financesPubliques.ts)
   │  └─ figures/                   des figures propres à la France (style `dp-*` dans figures.css)
   ├─ _modele/                   ← LE GABARIT À COPIER (compile, mais n'est pas publié)
   │  ├─ Article.tsx  donnees.ts  fiche.tsx  catalogue.ts
   ├─ catalogue.ts               ← la liste LÉGÈRE des articles (plan du site, carrousels, liens)
   ├─ registre.ts                ← la liste qui charge les PAGES
   ├─ rendu.tsx                  ← affiche un article (données structurées + composant)
   └─ types.ts                   ← EntreeCatalogue, RenduArticle, ArticleDette
```

Fichiers du site que les articles alimentent **automatiquement** (ne pas les éditer à la main pour un nouvel article) :

| Ce qui se met à jour seul | Où c'est branché |
|---|---|
| La page `/pays/<pays>/dette-publique` (sur la fiche du pays) | `src/app/pays/[slug]/dette-publique/page.tsx` (lit le registre) |
| Le plan du site (`sitemap.xml`) | `src/app/sitemap.ts` (lit le catalogue) |
| Les carrousels d'articles (Économie, accueil) | `src/data/dettes/fiches.ts` (lit le catalogue) |
| Les liens vers la page d'un pays (classement, fiches pays, dossiers voisins) | `adresseDette(slug)` dans `catalogue.ts` |
| Le dossier généré automatiquement du même pays (`/dette-publique/<pays>`) | redirige vers l'article rédigé (même `slug`) |

## 3. Deux sortes de pages de dette

1. **Les dossiers générés** (88 pays) : `/dette-publique/<pays>`. Construits à partir de la table `src/data/economy/debtData.ts` par le gabarit `src/components/dettes/DossierDette.tsx`. Courts, identiques d'un pays à l'autre.
2. **Les articles rédigés à la main** : riches, propres à un pays. Ils vivent dans `src/articles/dette/<pays>/`.

Quand un article rédigé existe pour un pays, **il remplace le dossier généré** : il vit sur la fiche du pays, à l'adresse **`/pays/<pays>/dette-publique`** (par exemple `/pays/france/dette-publique`), et `/dette-publique/<pays>` y redirige. Son fil d'Ariane est « Accueil › Pays › <Pays> › Dette publique ».

## 4. Ajouter l'article d'un pays — pas à pas

Exemple : l'Italie (`slug` = `italie`).

1. **Copier le gabarit.** Copier le dossier `src/articles/dette/_modele/` vers `src/articles/dette/italie/`.
2. **Renommer.** Dans les 4 fichiers copiés : `entreeModele` → `entreeItalie`, `articleModele` → `articleItalie`, `ArticleModele` → `ArticleItalie`, « Pays modèle » → « Italie ».
3. **Écrire les données** (`donnees.ts`) : remplacer les valeurs d'exemple par des chiffres **vérifiés**, chacun avec sa source exacte (organisme, période, adresse de la page). Montants en **milliards d'euros**, ratios en **% du PIB**. Si une donnée n'existe pas, ne pas l'inventer : le chapitre correspondant n'existe pas.
4. **Écrire l'article** (`Article.tsx`) : définir `CHAPITRES` (le sommaire), puis un `<Chapitre>` par entrée, avec les briques adaptées aux données du pays. Dans `<ArticleLong fil=…>`, le fil d'Ariane est Accueil › Pays › <Pays> › Dette publique (voir `france/Article.tsx`). Voir la section 5 pour les briques ; `france/Article.tsx` est l'exemple complet.
5. **Remplir `catalogue.ts`** : `slug: "italie"` (le même que celui de la fiche `/pays/italie`), `pays`, `drapeau`, `titre`, `accroche`, dates, `url: "/pays/italie/dette-publique"`, `mots`.
6. **Remplir `fiche.tsx`** : métadonnées (titre ≤ 65 caractères environ, description ≤ 160), Open Graph, données structurées (Article, FAQPage, éventuellement un Dataset par figure), résumé pour moteurs de réponse, suggestions de lecture.
7. **Inscrire l'article** :
   - dans `src/articles/dette/catalogue.ts` : importer `entreeItalie` et l'ajouter à `CATALOGUE_DETTE` ;
   - dans `src/articles/dette/registre.ts` : importer `articleItalie` et l'ajouter à `FICHES` sous la clé `italie`.
   Un contrôle au démarrage signale si l'un des deux manque.
8. **(Facultatif) Lier un globe et un fil de forum** : ajouter une entrée dans `src/data/concept/sujets.ts` et la passer à `<ArticleLong sujet={…}>`.
9. **(Facultatif) La presse** : ajouter une liste de citations dans `src/data/concept/presse.ts` et un `<ChapitrePresse>`. Seulement avec de vrais articles.
10. **Vérifier** (section 8), puis commit.

## 5. Les briques du cadre

Tout s'importe depuis `@/articles/dette/cadre`. Chaque fichier de `cadre/` commence par un commentaire avec un exemple d'usage.

| Brique | Rôle | Exemple minimal |
|---|---|---|
| `ArticleLong` | Le squelette de la page. Reçoit le fil d'Ariane, le titre, le grand chiffre, le chapo, la liste des chapitres, les suggestions. | `<ArticleLong fil=… surtitre=… chiffre=… chapo=… chapitres={CHAPITRES} suggestions=… sources="INSEE">…</ArticleLong>` |
| `Chapitre` | Un chapitre numéroté automatiquement : titre direct, réponse en une phrase, ancre. | `<Chapitre id="deficit" titre="Déficit public de l'Italie" reponse="…">…</Chapitre>` |
| `Figure` | Un graphique avec légende, **source exacte**, bouton « Copier le lien », renvois. Chaque graphique doit être dans une `Figure`. | `<Figure id="x" titre="…" legende="…" source={{ source: "Eurostat", url: "https://…" }}>…</Figure>` |
| `ChiffresCles` | Jusqu'à 6 cartes de chiffres clés, la première en grand. | `<ChiffresCles cartes={[{ icone: Percent, valeur: "137 %", libelle: "…", texte: "…" }]} />` |
| `ChiffresGrille` | Une rangée de gros chiffres (coûts, échéances). | `<ChiffresGrille items={[{ valeur: montant(64.7), libelle: "d'intérêts par an" }]} />` |
| `Repartition` | Barre segmentée + liste des montants et des parts (créanciers, recettes, dépenses). | `<Repartition nom="…" lignes={[{ nom: "FMI", md: 400 }]} />` |
| `BarresParDate` | Des barres, une par date (ratio dette/PIB…). Pas de courbe inventée entre les dates. | `<BarresParDate points={[{ cle: "2000", etiquette: "2000", valeur: 58.9 }]} />` |
| `Etapes` | Un mécanisme en étapes cliquables (budget, refinancement). | `<Etapes nom="budget" etapes={[{ titre: "…", texte: "…" }]} />` |
| `ListeQuestions` | La FAQ qui se déplie. | `<ListeQuestions questions={FAQ} />` |
| `ChapitrePresse` | Carrousel de citations de presse. | `<ChapitrePresse titre="…" intro="…" citations={PRESSE_X} />` |
| `Leve`, `Compteur` | Mouvement : un bloc qui se lève, un nombre qui compte. | `<Compteur valeur={3200} decimales={0} />` |
| `montant`, `montantAbs`, `enLettres`, `nombre`, `nf` | Formatage des montants (voir section 6). | `montant(152.5)` → « 152,5 Md€ » |

On peut aussi écrire des **figures propres au pays** (comme `france/Deficit.tsx` ou `france/figures/`) : un composant client qui reçoit les données et dessine ce qu'il faut, rangé dans la `<Figure>`. Réutiliser les classes `dos-*` de `cadre/dossier.css` ; n'ajouter du CSS que si c'est nécessaire, dans un fichier du dossier du pays.

## 6. Règles à respecter

1. **Monnaie.** Tout montant passe par `montant(...)`, `montantAbs(...)`, `enLettres(...)` ou `nombre(...)`. Un « 3 536 Md€ » tapé dans le texte ne se convertit pas.
   - `montant(md, décimales = 1, année = 2025)` → « 3 536,1 Md€ » ou « 4 112,6 Md$ » selon le menu.
   - `montantAbs` : sans le signe. `enLettres(3536, 0)` : « 3 536 milliards d'euros » pour le texte courant. `nombre(152.5)` : le nombre converti seul (colonne dont l'en-tête porte l'unité).
   - Les données sont en **milliards d'euros**. Au composant de l'article : `const [devise] = useMonnaieArticle(); poserMonnaieArticle(devise);` (voir `_modele/Article.tsx`) — ces deux lignes branchent la page sur le sélecteur de monnaie du menu.
   - Seules trois monnaies ont des taux de change : dollar, euro, yuan (`src/data/finance/tauxChange.ts`).
2. **Sources.** Chaque chiffre a une source officielle et une date. Chaque `Figure` porte une `source` avec une adresse vérifiable. On cite l'organisme et la période. On n'invente jamais un chiffre, un taux, une projection.
3. **Texte.** Français clair, direct, précis. Le titre d'un chapitre contient les mots qu'on cherche (« Qui détient la dette de l'Italie ? »). La première phrase d'un chapitre (`reponse`) donne la réponse.
4. **Données structurées.** Le contenu du JSON-LD (FAQ, Article…) doit être **identique** à ce que la page affiche. La FAQ balisée est exactement la FAQ visible.
5. **Accessibilité et performance.** Tout le texte est dans le HTML dès le rendu serveur ; les animations n'ajoutent rien d'indispensable. Pas de bibliothèque de graphiques : SVG ou CSS. Les graphiques ont un `aria-label` ou un tableau « Voir les données ».
6. **Typographie.** Ne pas modifier les polices ni le style des chiffres du site : les articles héritent du thème. Les classes `dos-*` du cadre font foi.
7. **Pas de « v2 », « test », « nouveau »** dans les noms de fichiers, de composants ou de classes. Un nom dit ce que la chose est.

## 7. Où trouver des données à citer

- **Table de dette de 88 pays** : `src/data/economy/debtData.ts` (dette en 2000, 2014, 2024 en milliards d'euros, % du PIB, créanciers, inflation). Approximative : à croiser avec la source officielle du pays avant de citer un chiffre précis.
- **PIB, PIB/habitant, balance, inflation, population (1960–2025)** : socles `src/data/economy/genere/socle-economie.json` et `src/data/demographie/`.
- **Sources officielles** à privilégier : institut statistique national, ministère des finances, agence de la dette, banque centrale, Eurostat, FMI, Banque mondiale, OCDE.

## 8. Vérifier avant de livrer

```bash
npm run build          # doit se terminer sans erreur ; la page doit apparaître dans la liste des routes
npm run start -- -p 3300   # puis ouvrir http://localhost:3300/pays/<pays>/dette-publique
```

À contrôler à l'écran, en **clair et en sombre**, sur ordinateur et sur **téléphone (390 px)** :
- aucun débordement horizontal, aucun texte coupé ;
- changer la monnaie dans le menu (€ → $ → CN¥) : **tous** les montants changent, y compris dans les légendes et les tableaux ;
- le sommaire suit la lecture ; chaque ancre `#…` fonctionne ;
- le fil d'Ariane est « Accueil › Pays › <Pays> › Dette publique » et ses liens fonctionnent ;
- la page apparaît dans `/sitemap.xml` et dans le carrousel d'articles de `/economie`.

## 9. Pièges connus

- Un `<Chapitre id="…">` dont l'`id` n'est pas dans `CHAPITRES` s'affiche numéroté `00`.
- Oublier l'une des deux inscriptions (catalogue ou registre) fait échouer le démarrage avec un message explicite.
- Le catalogue ne doit importer **aucun composant** (il est lu partout, il doit rester léger).
- Les données en milliards d'euros : ne pas saisir des millions ou des unités.
- `slug` : celui de la fiche du pays (`/pays/<slug>`) — minuscules, sans accents, tirets (`etats-unis`, `royaume-uni`).
- Ne pas toucher à `cadre/dossier.css` pour un besoin propre à un seul pays : créer un fichier CSS dans le dossier du pays.

## 10. Ailleurs dans le site (pour information)

- Le classement mondial et les 11 analyses comparatives sont **générés** : `src/data/dettes/analyses.ts` (textes et tableaux calculés depuis la table de dette). Ils se mettent à jour quand la table change.
- Les articles « économie » plus anciens sont dans `src/data/economy/articles.ts` (pages `/articles/<slug>`).
- Le carrousel d'articles de la page Économie se compose dans `src/data/concept/conceptEconomie.ts` (`articlesEco`) et `src/data/dettes/fiches.ts` (articles de dette).

## Ce que le site ajoute autour de l'article

- **Le pied de page du site** est affiché sous chaque article long (`ArticleLong`) : le lecteur reste dans le site. Rien à faire.
- **La page `/articles`** liste tous les articles du site (articles longs, analyses, dossiers pays, lectures), à ranger par thématique, par pays ou par type, avec recherche. Elle se nourrit de `src/data/articles-catalogue.ts` : un article inscrit dans `catalogue.ts` y apparaît tout seul.
- **La fiche du pays** (`/pays/<slug>`) montre « Articles sur <pays> » : un carrousel dont le premier article long est l'**article phare**, avec une recherche limitée aux articles de ce pays.

## Les lignes qui s'ouvrent sur un camembert (recettes, dépenses, déficit)

Dans un chapitre « Déficit public », chaque ligne d'une `<Repartition>` peut s'ouvrir : un petit panneau apparaît sous la ligne, avec **l'explication** de la ligne, puis **un camembert** (l'anneau à gauche, la légende à droite : nom, montant, part), comme dans « Qui détient la dette ».

Exemples complets : `france/Deficit.tsx` + `france/donnees/ventilations.ts`, et `allemagne/Deficit.tsx` + `allemagne/ventilations.ts`.

**Où vont les chiffres.** Dans un fichier `ventilations.ts` du pays, jamais dans le composant :

```ts
export const DETAIL_RECETTES: Record<string, Detail> = {
  "Impôts": {
    texte: "Ce que c'est, en une ou deux phrases. Un montant dans un texte s'écrit [[310.2]] (converti dans la monnaie du menu).",
    vues: [                                        // un camembert, ou plusieurs (onglets : « Par type », « Par bénéficiaire »)
      { titre: "Par type d'impôt", parts: [{ nom: "TVA", md: 208.8 }, { nom: "…", md: 128.1, enfants: [{ nom: "dont accises", md: 30.5 }] }],
        total: 884.9, precision: "Phrase de précaution : périmètre, édition, arrondis." },
    ],
    absent: "Quand la source ne détaille pas : on le dit, on ne dessine rien.",
    source: { nom: "Insee, …", url: "https://…" },
  },
};
// puis : <Repartition lignes={…} details={DETAIL_RECETTES} annee={2025} />
```

**Règles.**
- `enfants` = les « dont » : inclus dans le montant de la part, **jamais additionnés** ; ils s'ouvrent sous la part (bouton +), ils ne sont pas dans l'anneau.
- Si les parts ne font pas le `total` publié, la différence apparaît en part grisée « Reste non détaillé dans la source » : jamais cachée, jamais attribuée à un poste.
- Si la somme des parts dépasse le total (arrondis), le total affiché est la somme, et une phrase le dit.
- Des montants arrondis à l'unité (COFOG) : `pctDecimales: 0`, et on ne lit pas les parts au dixième.
- Deux éditions d'une même statistique ne se mélangent pas dans un article. Un solde calculé (recettes − impôts − cotisations) se présente comme **calculé**, pas comme une catégorie publiée.
- Une ligne sans `details` reste une ligne simple.
- Vérifier les sommes avec un petit script avant de livrer (voir comment `ventilations.ts` est construit : tout est en données, donc testable).

Pour une part, `taux` (facultatif) affiche « Taux : 20 % » sous son nom : le taux ou le barème de l'impôt. Sans source officielle, on ne le renseigne pas. Pour obtenir ces données, voir `src/articles/PROMPT-DETAIL-IMPOTS.md`.
**Rien de « méta » dans la page** : pas de phrase du genre « la source ne détaille pas cette ligne » ni de commentaire sur les éditions ; si une ligne n'a pas de détail, elle s'ouvre sur son explication seule.

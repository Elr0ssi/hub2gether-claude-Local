# Prompt à donner à ChatGPT (ou à toute IA connectée au dépôt GitHub)

Copier-coller le texte ci-dessous, en remplaçant `<PAYS>` et `<slug>`.

---

Tu travailles sur le dépôt GitHub **Elr0ssi/hub2gether-claude-Local**, branche **`claude/essential-data-presentation-fv21q3`** (c'est cette branche qui est publiée ; ne travaille pas sur `main`). C'est un site Next.js (App Router, React 19, TypeScript) qui présente l'économie et la démographie du monde. Tout le texte du site est en **français**.

## Ta mission
Écrire **l'article long sur la dette publique de `<PAYS>`** (slug `<slug>`), à la main, avec la même qualité et la même structure que l'article de la France. Un pays n'a pas les mêmes informations qu'un autre : ne remplis pas un formulaire, compose l'article avec les briques existantes et les chapitres dont les données existent vraiment.

## Commence par lire, dans cet ordre
0. `src/articles/GUIDE-REDACTION.md` — **le style et la mécanique de rédaction** (ton, structure d'un chapitre, règle du périmètre, règles sur les chiffres). À lire en premier.
1. `src/articles/LISEZ-MOI.md` — le guide complet : arborescence, pas à pas, briques, règles, vérifications.
2. `src/articles/dette/france/Article.tsx` — l'article de référence (lis aussi `Deficit.tsx`, `fiche.tsx`, `catalogue.ts`, `donnees/`).
3. `src/articles/dette/_modele/` — le gabarit à copier (Article.tsx, donnees.ts, fiche.tsx, catalogue.ts).
4. `src/articles/dette/cadre/` — les briques ; chaque fichier commence par un exemple d'usage.

## Ce que tu dois produire
- Un dossier `src/articles/dette/<slug>/` copié depuis `_modele/` (le `<slug>` est celui de la fiche du pays : `/pays/<slug>`) et renommé (`entreeModele` → `entree<Pays>`, etc.), contenant : `donnees.ts`, `Article.tsx`, `fiche.tsx`, `catalogue.ts`.
- L'inscription de l'article dans `src/articles/dette/catalogue.ts` **et** dans `src/articles/dette/registre.ts` (deux lignes).
- Rien d'autre : le site se charge de la page `/pays/<slug>/dette-publique` (sur la fiche du pays), du plan du site, des carrousels et des liens.

## Règles non négociables
1. **Aucun chiffre inventé.** Chaque valeur vient d'une source officielle (institut statistique, ministère des finances, agence de la dette, banque centrale, Eurostat, FMI, Banque mondiale, OCDE), avec la période et l'adresse exacte de la page. Ajoute-les dans `donnees.ts`. Si une donnée n'existe pas, le chapitre correspondant n'existe pas.
2. **Montants en milliards d'euros dans `donnees.ts`**, et **toujours affichés via `montant(...)`, `montantAbs(...)`, `enLettres(...)` ou `nombre(...)`** (importés de `@/articles/dette/cadre`). C'est ce qui convertit les montants dans la monnaie choisie par le lecteur (€, $, CN¥). Un montant écrit en dur dans le texte ne se convertit pas : interdit. Pour un pays hors zone euro, convertis la valeur source en euros au taux moyen de l'année concernée et indique-le dans la source.
3. **Chaque graphique est dans une `<Figure>`** avec `id`, `titre`, `legende`, `source={{ source, url }}`. La légende dit ce qu'on y voit avec les mots qu'on cherche.
4. **Chaque chapitre** : `<Chapitre id titre reponse>` ; l'`id` est dans la liste `CHAPITRES` ; le titre contient les mots qu'on cherche ; `reponse` donne la réponse en une phrase.
5. **Données structurées** (`fiche.tsx`) : Article + FAQPage (+ un Dataset par figure si possible) ; le contenu est **identique** à ce que la page affiche (FAQ mot pour mot).
6. **Ne modifie pas** `cadre/` ni le style global, ni les polices, ni le style des chiffres, ni un autre article. Si une brique manque, écris un composant propre au pays dans son dossier et réutilise les classes `dos-*` de `cadre/dossier.css`.
7. **Pas de « v2 », « test », « nouveau »** dans les noms. Noms de fichiers et de composants en français clair, comme dans le dépôt.
8. **Texte** : français clair et précis, sans jargon inutile, public averti et international ; pas de promesse que les données ne soutiennent pas ; pas de projection ni de taux qui ne viennent pas d'une source.
9. **Pas de dépendance nouvelle.** Pas de bibliothèque de graphiques : SVG ou CSS.

## Choisir les chapitres
Pars de ceux de la France et garde seulement ceux dont tu as les données : L'essentiel (chiffres clés), Évolution (ratio par date), Qui doit (répartition par émetteur), Qui détient (créanciers), Intérêts, Refinancement/échéances, Comparaison régionale, Questions. Ajoute les chapitres propres au pays (par exemple : dette indexée sur l'inflation, dette en devises étrangères, garanties publiques, régime fédéral, restructurations passées, rôle du FMI), seulement s'ils sont sourcés.

## Avant de livrer
- `npm run build` passe sans erreur et la route `/pays/<slug>/dette-publique` apparaît.
- Vérifie à l'écran, en clair et en sombre, à 1280 px et à **390 px** : aucun débordement horizontal ; en changeant la monnaie du menu (€ → $ → CN¥), **tous** les montants changent (légendes et tableaux compris).
- Résume en fin de réponse : les chapitres écrits, les sources utilisées, les chiffres que tu n'as pas pu vérifier, et ce qui reste à faire.

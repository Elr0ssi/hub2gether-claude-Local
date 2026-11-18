# Guide de rédaction et de style : l'article « Dette publique » d'un pays

À donner tel quel à ChatGPT (ou à toute IA). Il complète `LISEZ-MOI.md` (la partie technique : dossiers, briques, inscription) et `PROMPT-CHATGPT.md` (la mission). Ici : **comment l'article de la France est écrit**, pour que chaque autre pays soit écrit de la même façon.

Dépôt : **Elr0ssi/hub2gether-claude-Local**, branche **`claude/essential-data-presentation-fv21q3`**. Article de référence : `src/articles/dette/france/Article.tsx` (+ `Deficit.tsx`, `donnees/`, `figures/`, `fiche.tsx`).

---

## 1. L'esprit en une phrase

> Le montant d'abord, une idée par chapitre, aucun retour en arrière. Chaque phrase dit quelque chose de vrai, de sourcé, et se lit seule.

Le lecteur est **averti, pluriel, international** : il connaît l'économie sans être spécialiste, il vient d'un moteur de recherche avec une question précise, il veut la réponse tout de suite, puis la preuve, puis le contexte.

## 2. La mécanique de chaque chapitre

Un chapitre répond à **une seule question**, dans cet ordre :

1. **Un titre qui contient les mots qu'on cherche** (« Qui détient la dette française ? », « Intérêts de la dette publique »). Pas de titre littéraire, pas de jeu de mots.
2. **Une réponse en une phrase** (`reponse`), avec le chiffre clé en gras. Elle doit suffire à qui s'arrête là.
3. **La preuve** : un graphique (`<Figure>`), une grille de chiffres, ou des étapes (`<Etapes>`).
4. **Le périmètre, quand deux chiffres se ressemblent** (voir §4).
5. **Les sources** sous le chapitre, avec lien.

Ordre des chapitres de la France (à reprendre quand les données existent, sinon supprimer le chapitre) :
L'essentiel → Déficit → Évolution → Qui doit → Qui détient → Intérêts → Qui vote le budget → Refinancement → En Europe/dans la région → Dans la presse → Questions.

Un chapitre **sans donnée sourcée n'existe pas**. On n'écrit jamais « données indisponibles, voici une estimation ».

## 3. Le ton

- **Direct et neutre.** Des faits, des verbes simples (« L'État porte », « La France a payé », « Les titres arrivent à échéance »).
- **Jamais dramatique.** Interdit : « abîme », « explose », « chaque Français doit », « nos enfants rembourseront ». Ce sont des raccourcis faux : la dette est un stock, pas une facture individuelle à régler d'un coup.
- **Pédagogique sans condescendance.** On définit un mot technique une fois, au bon endroit (« La dette est un **stock**, le déficit est ce qui l'alimente, les intérêts sont ce qu'elle coûte chaque année »).
- **Aucune opinion politique**, aucun « il faut », aucun jugement sur un gouvernement. On décrit, on compare, on explique les mécanismes.
- **Aucune projection** ni taux qui ne viennent pas d'une source citée.
- **Français clair, phrases courtes** (une idée par phrase), voix active, pas de jargon inutile, pas d'anglicisme gratuit. Les sigles sont développés à la première occurrence (OAT = obligations assimilables du Trésor).
- Chiffres à la française : `3 536,1 milliards d'euros`, `117,5 %` (espace avant le `%`), virgule décimale.

### Exemples de phrases « réponse » (à imiter)

- « La dette est un **stock**, le déficit est ce qui l'alimente, les intérêts sont ce qu'elle coûte chaque année. »
- « En 2025, les administrations publiques ont dépensé 1 714 Md€ pour 1 562 Md€ de recettes : **152 Md€ de déficit, soit 5,1 % du PIB**. »
- « Le ratio dette/PIB est passé de 57 % en 2000 à **117,5 % début 2026**, avec des paliers à la crise de 2008, au Covid-19 puis au choc énergétique. »
- « La France a payé **… d'intérêts en 2025**. C'est le coût annuel de la dette, à ne pas confondre avec son montant. »
- « Le Parlement. Le gouvernement propose, l'Assemblée nationale et le Sénat votent, puis l'État exécute et la Cour des comptes contrôle. »
- « Il n'y a pas de jour où tout serait dû : chaque titre a son échéance, et l'État en émet de nouveaux pour rembourser les anciens et financer le déficit. »

### Exemples de légendes de graphique

Une légende dit **ce qu'on voit, avec les mots qu'on cherche**, en une ou deux phrases :
« Le ratio dette/PIB de la France à sept dates repères entre 2000 et 2023, puis les valeurs INSEE de fin 2025 et du premier trimestre 2026. Chaque barre se lit en cliquant dessus. »

## 4. La règle d'or : le périmètre

Les erreurs de l'économie publique viennent presque toujours d'un **périmètre** mal nommé. À chaque fois que deux chiffres peuvent être confondus, on écrit une phrase qui dit pourquoi ils diffèrent :

- dette **brute** (Maastricht) ≠ dette **nette** (on retire trésorerie et actifs financiers) ;
- dette **de l'État** ≠ dette de **toutes les administrations publiques** (État + sécurité sociale + collectivités + organismes centraux) ;
- part de la dette **négociable de l'État** détenue par des non-résidents ≠ part de **toute** la dette de Maastricht ;
- intérêts en **comptabilité budgétaire** ≠ intérêts en **comptabilité nationale**.

Modèle de formulation : « Ces montants sont tous exacts : ils ne comptent ni les mêmes opérations, ni le même périmètre. » Ou : « Ce taux ne s'applique pas tel quel aux … de Maastricht. »

Adapter à chaque pays : chercher quelles confusions de ce genre existent dans le pays (administration centrale vs générale, dette fédérale vs États fédérés, dette en monnaie locale vs en devises, dette détenue par la banque centrale…) et les expliquer.

## 5. Les chiffres : règles non négociables

1. **Aucun chiffre inventé, estimé, interpolé ou arrondi « pour faire joli ».** Chaque valeur vient d'une source officielle (institut statistique, ministère des finances, agence de la dette, banque centrale, Eurostat, FMI, Banque mondiale, OCDE).
2. **Chaque chiffre porte 5 éléments** dans `donnees.ts` : valeur, unité, **période exacte**, **périmètre** (ce qu'il mesure et ne mesure pas), **source + adresse exacte de la page**. Rien ne s'affiche sans ces cinq éléments.
3. **Ce que la source ne publie pas reste absent**, et la page le dit à l'endroit où le lecteur s'attendrait à le lire (pas de zéro, pas de moyenne, pas de valeur de l'année précédente).
4. **Les chiffres se dérivent plutôt que se recopient** : une variation se calcule à partir de deux valeurs sourcées (ainsi le texte ne peut pas devenir faux quand on ajoute un trimestre).
5. **Montants en milliards d'euros dans `donnees.ts`, affichés via `montant()`, `montantAbs()`, `enLettres()`, `nombre()`** (de `@/articles/dette/cadre`). C'est ce qui les convertit en $ ou CN¥ selon le menu du site. **Jamais de montant écrit en dur dans une phrase.** Pour un pays hors zone euro : convertir en euros au taux moyen de l'année et le dire dans la source.
6. Les pourcentages et durées (non monétaires) s'affichent avec `nf()`.
7. Distinguer toujours **stock** (dette), **flux** (déficit, intérêts de l'année), **ratio** (% du PIB).

## 6. Les briques (tout vient de `@/articles/dette/cadre`)

| Besoin | Brique |
|---|---|
| Squelette de page (fil d'Ariane, chiffre en tête, sommaire, suggestions) | `ArticleLong` |
| Un chapitre | `Chapitre` (`id`, `titre`, `reponse`) |
| Un graphique + légende + source + renvois | `Figure` (`id`, `titre`, `legende`, `source`, `voir`) |
| 4 à 6 chiffres clés avec icône | `ChiffresCles` |
| Grille de chiffres simple | `ChiffresGrille` |
| Évolution date par date (barres cliquables) | `BarresParDate` |
| Séquence d'étapes (budget, refinancement) | `Etapes` |
| FAQ | `ListeQuestions` |
| Citations de presse | `ChapitrePresse` |
| Chiffre qui s'anime en tête | `Compteur` |

Pas de bibliothèque de graphiques : SVG ou CSS, classes `dos-*` de `cadre/dossier.css`. Ne pas modifier `cadre/`, ni le style global, ni les polices, ni le style des chiffres, ni un autre article.

## 7. Le chiffre en tête et le chapô

- Le **gros chiffre** en tête de page : le montant de la dette publique (dernière période publiée), via `Compteur`.
- Le **chapô** : une ligne, le ratio dette/PIB avec la période et un lien vers la source (« **117,5 % du PIB** à la fin du premier trimestre 2026. INSEE ↗ »).

## 8. La FAQ (≈ 10 à 12 questions)

Questions telles que les gens les tapent (« Quel est le montant de la dette publique de X ? », « Qui détient la dette de X ? », « Pourquoi X est-elle endettée ? », « Comment X rembourse-t-elle sa dette ? »). Réponses de **2 à 3 phrases**, chiffrées, **avec la période et le périmètre**, et leur mise en garde (« Ce pourcentage ne correspond pas à… »). Le texte de la FAQ est **identique mot pour mot** dans les données structurées (`fiche.tsx` : Article + FAQPage).

## 9. Les chapitres propres au pays

Chaque pays a ses mécanismes. Après les chapitres communs, ajouter ceux qui comptent **et qui sont sourcés** : dette indexée sur l'inflation, dette en devises étrangères, régime fédéral (dette des États fédérés), garanties publiques, restructurations passées, rôle du FMI, détention par la banque centrale, fonds souverains… Titre au format « question que le lecteur se pose ».

## 10. Ce qu'on ne fait pas

- Pas de « v2 », « test », « nouveau » dans les noms de fichiers/composants.
- Pas de dépendance nouvelle.
- Pas de chiffre sans source, pas de phrase alarmiste, pas de recommandation politique.
- Pas de copier-coller de texte d'un média : on cite la source, on reformule.
- Pas de comparaison qui mélange des périodes ou des périmètres différents sans le dire.

## 11. Avant de livrer

- `npm run build` passe et `/pays/<slug>/dette-publique` apparaît.
- Vérifier à 1280 px et **390 px**, en clair et en sombre : aucun débordement horizontal.
- Changer la monnaie du menu (€ → $ → CN¥) : **tous** les montants changent (légendes et tableaux compris).
- Relire chaque chiffre contre sa source : valeur, période, périmètre.
- Terminer par un résumé : chapitres écrits, sources utilisées, **chiffres non vérifiés**, ce qui reste à faire.

## 12. Les lignes qui s'ouvrent (recettes, dépenses, déficit)

Chaque ligne du chapitre « Déficit public » s'ouvre sur : **ce que c'est** (une ou deux phrases), puis **un camembert** de son contenu, avec sa source. Même ton que le reste : factuel, sans jugement.

- Un « dont » est inclus dans son parent : on ne l'additionne jamais, on l'affiche sous le parent.
- Ce que la source ne détaille pas n'est **pas reconstitué** : on écrit « La source utilisée ne détaille pas cette ligne » plutôt que d'inventer des parts ou des taux.
- Un reste (total moins parts connues) est montré comme **reste**, grisé, jamais attribué à un poste.
- Deux lectures d'une même dépense (par nature, par fonction, par administration) ne s'additionnent pas : on le dit.
- Une année ou une édition par statistique : on n'affiche pas deux éditions côte à côte comme si elles se complétaient.
- Les montants dans les phrases s'écrivent `[[valeur]]` pour suivre la monnaie du menu.
- Les taux s'écrivent en **une courte ligne** (≈ 25 caractères) : « 2,1 à 20 % », « 0 à 45 % », « variable », « prix + quantité ». Pas de phrase, pas de « voté par la commune ou l'intercommunalité ». Un barème détaillé seulement pour l'impôt sur le revenu ou un équivalent.
- Chaque poste porte le nom que les gens cherchent (« Rémunérations des salariés », « Taxe sur l'énergie ») : c'est ce nom qui sert à référencer la page.

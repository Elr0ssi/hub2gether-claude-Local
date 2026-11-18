# Images de la soutenance

Dépose tes fichiers **ici**, dans ce dossier et ses trois sous-dossiers, en
respectant exactement les noms ci-dessous. Le deck va les chercher à ces
chemins précis : un nom différent, une majuscule en trop ou une extension
`.jpg` au lieu de `.png`, et l'emplacement reste vide.

Tant qu'un fichier est absent, la slide affiche un cadre de remplacement
avec le chemin attendu écrit dedans. Rien ne casse, rien ne plante — il
manque juste l'image.

## Où déposer

Deux façons, au choix.

- **Sur GitHub, dans le navigateur** : ouvrir le dossier voulu, bouton
  « Add file » → « Upload files », glisser l'image, puis « Commit changes »
  sur la branche `claude/essential-data-presentation-fv21q3`.
- **Depuis ton ordinateur** : copier les fichiers dans les dossiers, puis
  `git add public/soutenance && git commit && git push`.

## Les neuf fichiers

| Fichier | Slide | Ce qu'on doit y voir | Format |
|---|---|---|---|
| `equipe/portrait.png` | 20 · Derrière le produit | Ton portrait | Carré, 800 × 800 px minimum |
| `article-format.png` | 07 · Trois profondeurs | Une capture d'un article réel du site, prise en entier | Vertical, 1200 px de large minimum |
| `publications/pub-01.png` | 26 · Ce que nous publions déjà | Le carrousel « Les dépenses de communication de l'État » | Vertical 4:5, 1080 × 1350 px |
| `publications/pub-02.png` | 26 · Ce que nous publions déjà | Le carrousel « La dette publique française depuis 2000 » | Vertical 4:5, 1080 × 1350 px |
| `publications/pub-03.png` | 26 · Ce que nous publions déjà | Le carrousel « Les 20 premières économies mondiales » | Vertical 4:5, 1080 × 1350 px |
| `partenariats/visuel-01.png` | 27 · Partenariats éventuels | Un visuel au format du site | Vertical 4:5, 1080 × 1350 px |
| `partenariats/visuel-02.png` | 27 · Partenariats éventuels | Un visuel au format du site | Vertical 4:5, 1080 × 1350 px |
| `partenariats/visuel-03.png` | 27 · Partenariats éventuels | Un visuel au format du site | Vertical 4:5, 1080 × 1350 px |
| `produit-carte.png` | Soutenance 2 seulement | Capture de `/map/economy` | Paysage 16:9, 1920 × 1080 px |

`produit-carte.png` ne sert plus dans la Soutenance 3 : la slide qui
l'utilisait a été remplacée par le globe interactif, qui affiche les vraies
données. Elle reste attendue par la Soutenance 2.

## Trois règles

1. **Du PNG**, pas du JPEG — les captures d'écran comportent du texte, et le
   JPEG le rend flou.
2. **Deux fois la taille d'affichage**, au minimum. Le deck se projette en
   1920 × 1080 : une image de 400 px de large y sera visiblement pixellisée.
3. **Pas d'accent ni d'espace dans les noms de fichiers.** Les noms du
   tableau ci-dessus sont à recopier tels quels.

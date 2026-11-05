# La base des comptes et du forum

Projet Supabase `umqksphaqhyairdchcxk`, région `eu-central-1` (Francfort),
forfait gratuit.

Le schéma est appliqué sur le projet distant. Les fichiers de
`migrations/` en sont la copie versionnée : ils portent le même nom et le
même ordre, pour qu'on puisse relire l'histoire du schéma sans ouvrir le
tableau de bord, et le rejouer sur un autre projet si besoin.

## Ce que contient la base

| Table | Ce qu'elle porte |
|---|---|
| `profils` | un pseudo par compte, une présentation, un rôle, les compteurs choisis pour le tableau de bord |
| `messages` | le texte, sa cible (`fil` ou `article`), son parent, sa source |
| `votes` | une voix par personne et par cible, nominative et privée |
| `scores` | le total des voix, tenu par déclencheur, public |
| `signalements` | ce qu'un lecteur conteste, et où en est le traitement |
| `favoris` | les articles qu'un compte a enregistrés, privé à ce compte |

La cible d'un message est un couple `(cible_type, cible_id)`. Le forum
écrit `('fil', 'dette-france')`. Les réponses sous un article écriront
`('article', '<slug>')` : une seule table servira les deux endroits, sans
rien changer au schéma.

## Ce qui protège les données

Les règles d'accès vivent dans la base, pas dans le site. Elles
s'appliquent donc aussi à quelqu'un qui appellerait l'API directement :

- tout le monde lit les messages, les profils et les totaux ;
- il faut un compte pour écrire, voter ou signaler ;
- personne n'écrit, ne vote ni n'efface au nom d'un autre ;
- qui a voté quoi n'est visible que de l'intéressé ;
- un modérateur peut retirer un message et traiter un signalement ;
- les articles enregistrés ne sont visibles, ajoutés et retirés que par le compte qui les a enregistrés.

Deux garde-fous complètent ces règles : cinq messages par minute et
soixante par heure au plus, et une réponse ne peut pas viser une autre
discussion que son parent.

## La connexion

Deux portes ouvrent le même compte : l'adresse électronique et le mot de
passe, ou le bouton Google. Les deux mènent au même profil quand elles
partagent l'adresse, puisque c'est elle que Supabase utilise pour
identifier un compte.

**Adresse et mot de passe.** Rien de particulier : `signUp` /
`signInWithPassword` côté serveur, le pseudo part dans les métadonnées de
l'inscription et le déclencheur `creer_profil()` en fait la ligne dans
`profils`.

**Google.** Le bouton lance `signInWithOAuth` depuis le navigateur — une
action serveur ne peut pas rediriger un onglet vers un autre site — puis
Google renvoie sur `/compte/callback`, qui échange le code contre une
session et redirige vers `/compte`. Comme Google ne fournit pas de pseudo,
le déclencheur retombe sur la partie locale de l'adresse Google et lui
attache un numéro si elle est déjà prise.

Pour activer ce bouton, deux réglages à faire une fois, sur le tableau de
bord :

1. **Google Cloud Console** : créer un identifiant OAuth 2.0 (type
   « Application Web »), avec `https://umqksphaqhyairdchcxk.supabase.co/auth/v1/callback`
   comme URI de redirection autorisée. On en tire un Client ID et un Client
   Secret.
2. **Supabase → Authentication → Providers → Google** : coller les deux,
   activer le fournisseur.
3. **Supabase → Authentication → URL Configuration → Redirect URLs** :
   ajouter l'adresse de chaque copie du site suivie de `/compte/callback`
   (par exemple `https://hub2gether-claude-local.vercel.app/compte/callback`
   et le domaine définitif une fois posé). Sans cette entrée, Supabase
   refuse de renvoyer vers une adresse qu'il ne reconnaît pas.

Sans ces trois réglages, le bouton reste affiché mais renvoie une erreur ;
la page de connexion l'affiche en clair plutôt que de laisser un onglet
Google en échec sans explication.

## Les variables d'environnement

Les deux sont publiques, elles partent dans le navigateur. Voir
`.env.example`.

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

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
| `profils` | un pseudo par compte, une présentation, un rôle |
| `messages` | le texte, sa cible (`fil` ou `article`), son parent, sa source |
| `votes` | une voix par personne et par cible, nominative et privée |
| `scores` | le total des voix, tenu par déclencheur, public |
| `signalements` | ce qu'un lecteur conteste, et où en est le traitement |

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
- un modérateur peut retirer un message et traiter un signalement.

Deux garde-fous complètent ces règles : cinq messages par minute et
soixante par heure au plus, et une réponse ne peut pas viser une autre
discussion que son parent.

## Les variables d'environnement

Les deux sont publiques, elles partent dans le navigateur. Voir
`.env.example`.

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

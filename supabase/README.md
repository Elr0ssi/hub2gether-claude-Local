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

## La connexion se fait par identifiant

On s'inscrit et on se connecte avec un identifiant et un mot de passe.
Aucune adresse électronique n'est demandée : personne n'a à donner son
courriel pour écrire dans un forum, et le forfait gratuit n'envoie de toute
façon de courriel qu'aux adresses de l'équipe du projet.

Supabase, lui, authentifie par adresse. On lui en fabrique donc une,
toujours la même pour un identifiant donné : `lea` devient
`lea@identifiants.essential-data.fr`, à l'inscription comme à la connexion.
Le domaine ne reçoit rien et n'a pas à exister. La transformation tient en
dix lignes, dans `src/lib/supabase/identifiant.ts`.

Deux conséquences qu'il faut connaître :

- **Le réglage « Confirm email » doit être coupé** (tableau de bord,
  Authentication, Sign In / Providers, Email). Sinon le compte est créé mais
  la connexion reste bloquée sur un courriel qui ne partira nulle part. Le
  site le dit mot pour mot quand le cas se présente.
- **Un mot de passe perdu est un compte perdu.** Sans adresse réelle, rien
  ne peut être renvoyé. Le jour où il faudra la récupération, on demandera
  une adresse facultative et on la branchera sur le renvoi de Supabase.

L'identifiant est insensible à la casse et aux espaces de bord : `Lea`,
`lea` et ` Lea ` ouvrent le même compte. Le nom affiché sur les messages,
lui, se change dans le profil ; l'identifiant de connexion, non.

## Les variables d'environnement

Les deux premières sont publiques, elles partent dans le navigateur. Voir
`.env.example`.

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_DOMAINE_COMPTES   (facultatif, défaut identifiants.essential-data.fr)
```

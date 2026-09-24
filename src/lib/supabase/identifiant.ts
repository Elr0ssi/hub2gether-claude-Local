/* ═══════════════════════════════════════════════════════════════════════════
   L'IDENTIFIANT

   On se connecte avec un identifiant et un mot de passe, pas avec une adresse
   électronique. Personne n'a à donner son courriel pour écrire dans un forum.

   Supabase, lui, authentifie par adresse : c'est sa clé d'unicité et elle
   n'est pas négociable. On lui en fabrique donc une, toujours la même pour un
   identifiant donné, sur un domaine qui ne reçoit rien. Aucun courriel n'est
   envoyé, aucune adresse réelle n'est demandée ni stockée, et la
   transformation est purement mécanique : « lea » devient toujours
   « lea@<domaine> », à l'inscription comme à la connexion.

   CE QUE CE CHOIX COÛTE, ET IL FAUT LE SAVOIR
   Sans adresse réelle, il n'existe aucun moyen de renvoyer un mot de passe
   perdu. Un mot de passe oublié est un compte perdu. Le jour où l'on voudra
   la récupération, il faudra demander une adresse — facultative — et la
   brancher sur le renvoi de Supabase.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Le domaine des adresses fabriquées. Il n'a pas à exister ni à recevoir. */
export const DOMAINE_IDENTIFIANT =
  process.env.NEXT_PUBLIC_DOMAINE_COMPTES || "identifiants.essential-data.fr";

/** Lettres, chiffres, tiret et souligné : tous valides dans une adresse. */
export const IDENTIFIANT_MOTIF = "[A-Za-z0-9_\\-]{3,24}";
export const IDENTIFIANT_OK = new RegExp(`^${IDENTIFIANT_MOTIF}$`);

/** L'adresse que Supabase verra pour cet identifiant. */
export function adresseDe(identifiant: string): string {
  return `${identifiant.trim().toLowerCase()}@${DOMAINE_IDENTIFIANT}`;
}

/** L'identifiant derrière une adresse fabriquée, pour l'afficher. */
export function identifiantDe(adresse: string): string {
  return adresse.split("@")[0] ?? "";
}

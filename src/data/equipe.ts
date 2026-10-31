/* ═══════════════════════════════════════════════════════════════════════════
   L'ÉQUIPE

   Cette liste est vide, et c'est volontaire : je ne connais pas les noms, et
   inventer une équipe sur une page « à propos » serait exactement le genre de
   contenu fabriqué que ce projet refuse ailleurs.

   Remplissez-la, et la section apparaît d'elle-même sur /a-propos, avec son
   balisage `Person` pour les moteurs. Laissez-la vide, et la page se tient
   très bien sans : elle dit alors ce que fait le projet et comment le
   joindre, sans faire semblant.

   Pour chaque personne, seul `nom` et `role` sont nécessaires. Le reste
   ajoute de la crédibilité aux yeux des moteurs comme des lecteurs : un
   parcours vérifiable et un lien public valent mieux qu'un titre ronflant.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Membre {
  nom: string;
  /** Ce que la personne fait ici. « Rédaction économie », pas « visionnaire ». */
  role: string;
  /** Deux phrases : ce qui rend cette personne légitime sur ce sujet. */
  parcours?: string;
  /** Une page publique qui confirme le parcours : profil professionnel, site,
      page universitaire. C'est ce qui transforme une affirmation en preuve. */
  lien?: string;
}

export const EQUIPE: Membre[] = [];

/** L'adresse à laquelle on peut nous écrire. Laissez vide si elle n'existe
    pas encore : un contact qui ne répond pas est pire que pas de contact. */
export const CONTACT = "";

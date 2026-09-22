/* ═══════════════════════════════════════════════════════════════════════════
   L'ADRESSE DE LA BASE

   Deux valeurs publiques, et rien d'autre : l'URL du projet et la clé
   publiable. Aucun secret ne passe par ici. Ce qui protège les données, ce
   sont les règles d'accès écrites dans la base, pas la discrétion de cette
   clé — le navigateur la voit de toute façon.

   Les deux peuvent manquer : sur une copie du dépôt sans fichier
   d'environnement, le site doit continuer de se construire et de s'afficher.
   Les pages de compte le disent alors franchement au lieu de tomber.
   ═══════════════════════════════════════════════════════════════════════════ */

export const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const CLE_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** Vrai quand les comptes sont branchés. */
export const COMPTES_ACTIFS = Boolean(URL_SUPABASE && CLE_SUPABASE);

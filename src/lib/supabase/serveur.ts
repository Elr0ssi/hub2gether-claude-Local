import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { CLE_SUPABASE, COMPTES_ACTIFS, URL_SUPABASE } from "./config";

/**
 * Le client des composants serveur et des actions.
 *
 * La session vit dans des cookies : le serveur les lit pour savoir qui
 * demande, et les réécrit quand le jeton est rafraîchi. Dans un composant
 * serveur, cette écriture est interdite par Next ; on l'avale, car le
 * middleware a déjà fait le travail avant que la page ne soit rendue.
 */
export async function clientServeur() {
  if (!COMPTES_ACTIFS) return null;
  const jar = await cookies();
  return createServerClient(URL_SUPABASE, CLE_SUPABASE, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (liste) => {
        try {
          for (const { name, value, options } of liste) jar.set(name, value, options);
        } catch {
          /* Rendu d'un composant serveur : le middleware s'en charge. */
        }
      },
    },
  });
}

export interface Profil {
  id: string;
  pseudo: string;
  bio: string | null;
  role: string;
  cree_le: string;
}

/** Le compte connecté, avec son profil, ou null. */
export async function lireCompte(): Promise<{ email: string; profil: Profil } | null> {
  const sb = await clientServeur();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  if (!data.user) return null;
  const { data: profil } = await sb
    .from("profils")
    .select("id, pseudo, bio, role, cree_le")
    .eq("id", data.user.id)
    .single();
  if (!profil) return null;
  return { email: data.user.email ?? "", profil: profil as Profil };
}

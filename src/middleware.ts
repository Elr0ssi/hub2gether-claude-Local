import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { CLE_SUPABASE, COMPTES_ACTIFS, URL_SUPABASE } from "@/lib/supabase/config";

/* ═══════════════════════════════════════════════════════════════════════════
   LE RAFRAÎCHISSEMENT DE LA SESSION

   Un jeton d'accès dure une heure. Sans ce passage, un lecteur revenu le
   lendemain serait traité comme un inconnu par les composants serveur,
   alors que son navigateur a de quoi prouver le contraire. On relit donc
   l'utilisateur à chaque requête, ce qui renouvelle les cookies au besoin.

   Rien d'autre n'est décidé ici : la protection des pages se fait dans les
   pages elles-mêmes, où l'on sait quoi répondre à un visiteur non connecté.
   ═══════════════════════════════════════════════════════════════════════════ */

export async function middleware(request: NextRequest) {
  if (!COMPTES_ACTIFS) return NextResponse.next();

  let reponse = NextResponse.next({ request });

  const sb = createServerClient(URL_SUPABASE, CLE_SUPABASE, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (liste) => {
        for (const { name, value } of liste) request.cookies.set(name, value);
        reponse = NextResponse.next({ request });
        for (const { name, value, options } of liste) reponse.cookies.set(name, value, options);
      },
    },
  });

  await sb.auth.getUser();
  return reponse;
}

/* Seulement les pages qui lisent la session côté serveur.
 *
 * Passer par ici coûte un aller-retour vers le service d'authentification.
 * L'appliquer à tout le site rendrait chaque page dynamique et dépenserait
 * une requête par visite, pour rien : le reste du site ne sait pas qui vous
 * êtes et n'a pas besoin de le savoir. Le forum et l'entrée du menu lisent
 * leur session dans le navigateur, qui renouvelle lui-même son jeton. */
export const config = {
  matcher: ["/compte/:path*"],
};

import { NextResponse, type NextRequest } from "next/server";
import { clientServeur } from "@/lib/supabase/serveur";

/* ═══════════════════════════════════════════════════════════════════════════
   LE RETOUR DE GOOGLE

   Une connexion par fournisseur externe ne se termine pas dans la page :
   Google renvoie le navigateur ici avec un code, et c'est ce code qui
   s'échange contre la session. Tant que cet échange n'a pas eu lieu, il n'y
   a pas de compte connecté à trouver.

   Cette route vit sous /compte, donc le middleware qui rafraîchit la
   session la couvre déjà sans réglage de plus.
   ═══════════════════════════════════════════════════════════════════════════ */

export async function GET(requete: NextRequest) {
  const { searchParams, origin } = new URL(requete.url);
  const code = searchParams.get("code");
  const suite = searchParams.get("suite") ?? "/compte";

  if (code) {
    const sb = await clientServeur();
    if (sb) {
      const { error } = await sb.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${origin}${suite}`);
    }
  }

  /* Code absent, ou échange refusé : on ramène vers la connexion plutôt que
     d'atterrir sur une page qui suppose une session qui n'existe pas. */
  return NextResponse.redirect(`${origin}/compte/connexion?erreur=google`);
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clientNavigateur } from "@/lib/supabase/navigateur";

/* ═══════════════════════════════════════════════════════════════════════════
   L'ENTRÉE DU COMPTE

   On ne lit que la présence d'une session, pas le profil : le nom ne vaut
   pas une requête sur chaque page du site. « Mon espace » suffit, et
   l'espace, lui, sait qui vous êtes.

   Elle s'affiche même quand les comptes ne sont pas branchés. Une entrée
   qui disparaît sans rien dire laisse chercher une porte qui n'existe
   plus ; la page de connexion, elle, explique ce qui manque.
   ═══════════════════════════════════════════════════════════════════════════ */

export function LienCompte({ className }: { className?: string }) {
  const [connecte, setConnecte] = useState(false);

  useEffect(() => {
    const sb = clientNavigateur();
    if (!sb) return;
    /* La session est lue dans le cookie, sans aller au serveur. */
    void sb.auth.getSession().then((r: { data: { session: unknown } }) =>
      setConnecte(Boolean(r.data.session))
    );
    const { data: ecoute } = sb.auth.onAuthStateChange((_e: string, session: unknown) =>
      setConnecte(Boolean(session))
    );
    return () => ecoute.subscription.unsubscribe();
  }, []);

  return (
    <Link href={connecte ? "/compte" : "/compte/connexion"} className={className}>
      {/* Deux libellés, un seul affiché : les barres étroites n'ont pas la
          place de « Se connecter ». */}
      <span className="lc-long">{connecte ? "Mon espace" : "Se connecter"}</span>
      <span className="lc-court">{connecte ? "Espace" : "Compte"}</span>
    </Link>
  );
}

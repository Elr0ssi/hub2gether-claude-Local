"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { COMPTES_ACTIFS } from "@/lib/supabase/config";
import { clientNavigateur } from "@/lib/supabase/navigateur";

/* ═══════════════════════════════════════════════════════════════════════════
   L'ENTRÉE DU COMPTE DANS LE MENU

   On ne lit que la présence d'une session, pas le profil : le nom ne vaut
   pas une requête sur chaque page du site. « Mon espace » suffit, et
   l'espace, lui, sait qui vous êtes.
   ═══════════════════════════════════════════════════════════════════════════ */

export function LienCompte({ className }: { className?: string }) {
  const [connecte, setConnecte] = useState<boolean | null>(null);

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

  if (!COMPTES_ACTIFS) return null;

  return (
    <Link href={connecte ? "/compte" : "/compte/connexion"} className={className}>
      {/* Avant de savoir, on affiche la formule neutre : les deux mènent au
          bon endroit, et rien ne saute au chargement. */}
      {connecte ? "Mon espace" : "Se connecter"}
    </Link>
  );
}

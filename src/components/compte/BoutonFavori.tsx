"use client";

import { useOptimistic, useTransition } from "react";
import { basculerFavori } from "@/app/compte/actions";

/**
 * Enregistrer un article, depuis sa propre page.
 *
 * Sans session, le bouton renvoie vers la connexion plutôt que de tenter un
 * appel qui échouera silencieusement. Avec session, le clic bascule tout de
 * suite l'état affiché — l'aller-retour serveur confirme derrière.
 */
export function BoutonFavori({
  slug,
  connecte,
  enregistreInitial,
}: {
  slug: string;
  /** Faux : aucune session, ou les comptes ne sont pas branchés sur cette copie. */
  connecte: boolean;
  enregistreInitial: boolean;
}) {
  const [enregistre, basculerOptimiste] = useOptimistic(enregistreInitial, (etat) => !etat);
  const [enCours, demarrer] = useTransition();

  if (!connecte) {
    return (
      <a href="/compte/connexion" className="lx-outil">
        Se connecter pour enregistrer
      </a>
    );
  }

  return (
    <button
      type="button"
      className="lx-outil"
      disabled={enCours}
      onClick={() =>
        demarrer(async () => {
          basculerOptimiste(undefined);
          await basculerFavori(slug);
        })
      }
    >
      {enregistre ? "Retirer de mes articles" : "Enregistrer cet article"}
    </button>
  );
}

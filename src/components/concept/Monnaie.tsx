"use client";

import { useEffect, useState } from "react";
import { MONNAIES, fiche, type Monnaie } from "@/data/finance/tauxChange";

/* ═══════════════════════════════════════════════════════════════════════════
   LE CHOIX DE LA MONNAIE

   Même mécanique que le thème, et pour la même raison : plusieurs endroits
   de la page ont besoin de la réponse, et chacun ne peut pas tenir son
   propre état sous peine de ne jamais apprendre les changements des autres.

   Le choix est gardé d'une visite à l'autre. Il n'est pas relu avant le
   premier rendu, contrairement au thème : un montant qui se convertit une
   fraction de seconde après l'affichage ne gêne personne, alors qu'une page
   qui passe du noir au blanc, si.
   ═══════════════════════════════════════════════════════════════════════════ */

const CLE = "visualize-monnaie";

let COURANTE: Monnaie = "usd";
const ABONNES = new Set<(m: Monnaie) => void>();

function diffuse(m: Monnaie) {
  COURANTE = m;
  for (const f of ABONNES) f(m);
}

/** La monnaie du moment, pour le code qui met en forme et ne peut pas tenir
    de crochet : un formateur est une fonction, pas un composant. Un rendu
    suit toujours un changement, donc la valeur lue est à jour. */
export function monnaieCourante(): Monnaie {
  return COURANTE;
}

export function useMonnaie(): [Monnaie, (m: Monnaie) => void] {
  const [m, poser] = useState<Monnaie>(COURANTE);

  useEffect(() => {
    try {
      const lu = window.localStorage.getItem(CLE) as Monnaie | null;
      if (lu && lu !== COURANTE && MONNAIES.some((x) => x.code === lu)) diffuse(lu);
    } catch {
      /* Navigation privée : on reste sur la monnaie d'origine. */
    }
    poser(COURANTE);
    ABONNES.add(poser);
    return () => {
      ABONNES.delete(poser);
    };
  }, []);

  const change = (v: Monnaie) => {
    diffuse(v);
    try {
      window.localStorage.setItem(CLE, v);
    } catch {
      /* Tant pis. */
    }
  };

  return [m, change];
}

/** Le sélecteur : le signe en place, les autres au survol, sous le verre. */
export function ChoixMonnaie({ className }: { className?: string }) {
  const [m, change] = useMonnaie();
  const f = fiche(m);

  return (
    <div className={`cg-monnaie${className ? ` ${className}` : ""}`}>
      <button type="button" className="cg-monnaie-b" aria-haspopup="true">
        <span className="sr-only">Monnaie d&apos;affichage : {f.libelle}</span>
        <span aria-hidden="true">{f.unitaire}</span>
      </button>
      <div className="cg-monnaie-l" role="menu">
        {MONNAIES.map((x) => (
          <button
            key={x.code}
            type="button"
            role="menuitemradio"
            aria-checked={x.code === m}
            className={x.code === m ? "on" : undefined}
            onClick={() => change(x.code)}
          >
            <b>{x.unitaire}</b>
            {x.libelle}
            {x.depuis > 0 && <em>depuis {x.depuis}</em>}
          </button>
        ))}
      </div>
    </div>
  );
}

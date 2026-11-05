"use client";

import { useEffect, useMemo, type RefObject } from "react";

/* La recherche d'un classement ne masque rien : le rang reste celui du classement complet, et le tableau
   défile jusqu'à la première ligne trouvée, qui s'allume (classe `cg-tab-trouve`). `haut` est la hauteur
   d'une ligne, pour les tableaux fenêtrés. */
export function useRechercheTableau<T>(
  cadre: RefObject<HTMLDivElement | null>,
  lignes: T[],
  nom: (r: T) => string,
  recherche: string,
  haut: number,
): Set<string> | null {
  const q = recherche.trim().toLowerCase();
  const trouvees = useMemo(() => (q ? new Set(lignes.map(nom).filter((n) => n.toLowerCase().includes(q))) : null), [lignes, q, nom]);
  useEffect(() => {
    const el = cadre.current;
    if (!el || !trouvees || !trouvees.size) return;
    const i = lignes.findIndex((r) => trouvees.has(nom(r)));
    if (i < 0) return;
    el.scrollTo({ top: Math.max(0, i * haut - el.clientHeight / 3), behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trouvees, lignes]);
  return trouvees;
}

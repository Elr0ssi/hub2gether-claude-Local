"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   LE MOUVEMENT

   Tout est écrit dans le HTML dès le rendu serveur. Les composants ci-dessous
   ajoutent du mouvement par-dessus, jamais à la place : aucune information
   n'attend une animation pour exister. C'est ce qui permet à un moteur, à un
   lecteur d'écran ou à quelqu'un qui a coupé les animations de lire la page
   entière.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Vrai dès que l'élément a été vu. On lit la position au défilement plutôt
    que de poser un observateur : une lecture sur un nœud, dans l'écouteur. */
export function useVu<T extends HTMLElement>(marge = 120) {
  const ref = useRef<T | null>(null);
  const [vu, setVu] = useState(false);
  useEffect(() => {
    let vivant = true;
    const regarde = () => {
      const n = ref.current;
      if (!n || !vivant) return;
      const r = n.getBoundingClientRect();
      if (r.top < (window.innerHeight || 0) - marge && r.bottom > 0) {
        setVu(true);
        decroche();
      }
    };
    const decroche = () => {
      vivant = false;
      window.removeEventListener("scroll", regarde);
      window.removeEventListener("resize", regarde);
    };
    window.addEventListener("scroll", regarde, { passive: true });
    window.addEventListener("resize", regarde);
    regarde();
    return decroche;
  }, [marge]);
  return { ref, vu };
}

/** Un bloc qui se lève quand il entre dans l'écran.
 *
 *    <Leve className="ma-carte" delai={70}>…</Leve>
 */
export function Leve({
  children,
  delai = 0,
  className = "",
  tag: Tag = "div",
}: {
  children: React.ReactNode;
  /** Retard en millisecondes : décale les cartes d'une même rangée. */
  delai?: number;
  className?: string;
  /* Le conteneur suit le sens du contenu : un paragraphe reste un
     paragraphe, une figure reste une figure. Le mouvement ne doit pas coûter
     sa nature à un élément. */
  tag?: "div" | "p" | "section" | "li" | "figure";
}) {
  const { ref, vu } = useVu<HTMLElement>();
  const Balise = Tag as React.ElementType;
  return (
    <Balise
      ref={ref}
      className={`dos-leve ${className}`}
      data-vu={vu ? "1" : "0"}
      style={{ transitionDelay: `${delai}ms` }}
    >
      {children}
    </Balise>
  );
}

/** Compte jusqu'à la valeur quand il entre dans l'écran. La valeur exacte est
    dans le HTML dès le départ : l'animation ne fait que la retenir un instant,
    elle ne la fabrique pas.
 *
 *    <Compteur valeur={3536.1} decimales={1} duree={1500} />
 */
export function Compteur({
  valeur,
  decimales = 0,
  duree = 1600,
  className = "",
}: {
  valeur: number;
  decimales?: number;
  duree?: number;
  className?: string;
}) {
  const { ref, vu } = useVu<HTMLSpanElement>(60);
  const [v, setV] = useState(valeur);
  const [anime, setAnime] = useState(false);

  useEffect(() => {
    setAnime(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!vu || !anime) return;
    let brut = 0;
    const t0 = performance.now();
    const pas = (t: number) => {
      const u = Math.min(1, (t - t0) / duree);
      const e = 1 - Math.pow(1 - u, 4);
      setV(valeur * e);
      if (u < 1) brut = requestAnimationFrame(pas);
    };
    setV(0);
    brut = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(brut);
  }, [vu, anime, valeur, duree]);

  const fmt = useMemo(
    () => new Intl.NumberFormat("fr-FR", { minimumFractionDigits: decimales, maximumFractionDigits: decimales }),
    [decimales],
  );
  return (
    <span ref={ref} className={className}>
      {fmt.format(anime ? v : valeur)}
    </span>
  );
}

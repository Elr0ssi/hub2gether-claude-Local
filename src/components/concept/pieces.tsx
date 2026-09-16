"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════════════
   LES PETITES PIÈCES DU PROTOTYPE
   ═══════════════════════════════════════════════════════════════════════════ */

export const LENT = [0.22, 1, 0.36, 1] as const;

/**
 * L'emplacement d'une image à venir.
 *
 * Aucune photo n'est cherchée ni générée : le cadre garde exactement les
 * proportions prévues et affiche le nom du fichier attendu. Il suffira de
 * remplacer ce composant par une balise `img` pointant sur
 * `/concept/<nom>.png` une fois les visuels déposés.
 */
export function ImagePlaceholder({
  nom,
  ratio = "16 / 9",
  className = "",
}: {
  nom: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div className={`image-placeholder ${className}`} style={{ aspectRatio: ratio }} data-png={nom}>
      <span className="image-placeholder-croix" aria-hidden="true" />
      <span className="image-placeholder-nom">{nom}</span>
    </div>
  );
}

/** Un nombre qui se remplit quand il entre dans le champ. */
export function Compteur({
  valeur,
  prefixe = "",
  suffixe = "",
  decimales = 0,
  duree = 1.8,
}: {
  valeur: number;
  prefixe?: string;
  suffixe?: string;
  decimales?: number;
  duree?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const vu = useInView(ref, { once: true, margin: "-90px" });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!vu) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(valeur);
      return;
    }
    let f = 0;
    const t0 = performance.now();
    const pas = (t: number) => {
      const p = Math.min(1, (t - t0) / (duree * 1000));
      setV(valeur * (1 - Math.pow(1 - p, 4)));
      if (p < 1) f = requestAnimationFrame(pas);
    };
    f = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(f);
  }, [vu, valeur, duree, decimales]);

  return (
    <span ref={ref} className="cg-tabulaire">
      {prefixe}
      {v.toLocaleString("fr-FR", { minimumFractionDigits: decimales, maximumFractionDigits: decimales })}
      {suffixe}
    </span>
  );
}

/** Un bloc qui monte à l'entrée dans le champ. */
export function Monte({
  children,
  delay = 0,
  y = 30,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.95, delay, ease: LENT }}
    >
      {children}
    </motion.div>
  );
}

/** Le titre de section : une ligne fine, un libellé, rien d'autre. */
export function Enseigne({ children, droite }: { children: React.ReactNode; droite?: React.ReactNode }) {
  return (
    <div className="cg-enseigne">
      <span className="cg-enseigne-t">{children}</span>
      <span className="cg-enseigne-r" aria-hidden="true" />
      {droite}
    </div>
  );
}

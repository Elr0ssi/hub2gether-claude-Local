"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Chiffre } from "@/data/articles/detteFrancaise";

/* ═══════════════════════════════════════════════════════════════════════════
   LES PIÈCES DE L'ARTICLE

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

/** Un bloc qui se lève quand il entre dans l'écran. */
export function Leve({
  children,
  delai = 0,
  className = "",
  tag: Tag = "div",
}: {
  children: React.ReactNode;
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
      className={`dp-leve ${className}`}
      data-vu={vu ? "1" : "0"}
      style={{ transitionDelay: `${delai}ms` }}
    >
      {children}
    </Balise>
  );
}

/* ── Le compteur ───────────────────────────────────────────────────────── */

/** Compte jusqu'à la valeur quand il entre dans l'écran. La valeur exacte est
    dans le HTML dès le départ : l'animation ne fait que la retenir un instant,
    elle ne la fabrique pas. */
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

/* ── La source ─────────────────────────────────────────────────────────── */

export function Source({ c, className = "" }: { c: Pick<Chiffre, "source" | "url" | "periode">; className?: string }) {
  return (
    <a className={`dp-src ${className}`} href={c.url} target="_blank" rel="noopener noreferrer">
      Source : {c.source}
      <span className="dp-src-f" aria-hidden="true"> ↗</span>
    </a>
  );
}

/** La valeur, son unité, sa période et son périmètre : les cinq éléments sans
    lesquels un chiffre ne veut rien dire, réunis au même endroit. */
export function Precision({ c }: { c: Chiffre }) {
  return (
    <p className="dp-precision">
      <span className="dp-precision-p">{c.periode}</span> · {c.perimetre}. <Source c={c} />
    </p>
  );
}

/* ── Le tableau sous le graphique ──────────────────────────────────────── */

/** « Voir les données » : le graphique a toujours son tableau derrière lui.
    Il est dans le HTML, replié par l'élément natif — donc lisible par un
    moteur et par un lecteur d'écran sans dérouler quoi que ce soit. */
export function Donnees({
  titre,
  colonnes,
  lignes,
}: {
  titre: string;
  colonnes: string[];
  lignes: (string | number)[][];
}) {
  return (
    <details className="dp-donnees">
      <summary>Voir les données</summary>
      <table>
        <caption>{titre}</caption>
        <thead>
          <tr>
            {colonnes.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lignes.map((l) => (
            <tr key={String(l[0])}>
              <th scope="row">{l[0]}</th>
              {l.slice(1).map((v, i) => (
                <td key={i}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

/* ── La barre de progression et le sommaire ────────────────────────────── */

export const SECTIONS = [
  { id: "trente-secondes", court: "30 sec", long: "La dette en 30 secondes" },
  { id: "origine", court: "Origine", long: "Comment la dette se crée" },
  { id: "qui-doit", court: "Qui ?", long: "Qui doit cet argent" },
  { id: "detenteurs", court: "Détenteurs", long: "Qui possède la dette" },
  { id: "cout", court: "Coût", long: "Ce que la dette coûte" },
  { id: "remboursement", court: "Remboursement", long: "Comment elle se rembourse" },
  { id: "avenir", court: "Avenir", long: "Ce que le niveau change" },
];

export function Progression() {
  const [part, setPart] = useState(0);
  const [actif, setActif] = useState(SECTIONS[0].id);

  const lis = useCallback(() => {
    const h = document.documentElement;
    const total = h.scrollHeight - window.innerHeight;
    setPart(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0);
    /* La section active est la dernière dont le haut est passé au-dessus du
       tiers supérieur de l'écran : c'est celle qu'on est en train de lire. */
    let courant = SECTIONS[0].id;
    for (const s of SECTIONS) {
      const n = document.getElementById(s.id);
      if (n && n.getBoundingClientRect().top < window.innerHeight * 0.34) courant = s.id;
    }
    setActif(courant);
  }, []);

  useEffect(() => {
    lis();
    window.addEventListener("scroll", lis, { passive: true });
    window.addEventListener("resize", lis);
    return () => {
      window.removeEventListener("scroll", lis);
      window.removeEventListener("resize", lis);
    };
  }, [lis]);

  return (
    <>
      <div className="dp-barre" aria-hidden="true">
        <span style={{ transform: `scaleX(${part})` }} />
      </div>
      <nav className="dp-sommaire" aria-label="Sections de l'article">
        <ol>
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={actif === s.id ? "dp-sommaire-on" : undefined}>
                <span className="dp-sommaire-p" aria-hidden="true" />
                {s.court}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

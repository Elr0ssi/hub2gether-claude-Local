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
/* Une teinte par famille de sujet, pour que le cadre vide donne déjà une
   idée du rythme de la page. Ce ne sont pas des images : ce sont des fonds
   dégradés, générés en CSS, que le PNG viendra recouvrir. */
const TEINTES: Record<string, [string, string]> = {
  ECONOMIE: ["#4a2f16", "#0d1218"],
  GEOPOLITIQUE: ["#16304a", "#0d1218"],
  CLIMAT: ["#123b33", "#0d1218"],
  RESSOURCES: ["#4a2a18", "#0d1218"],
  SOCIETES: ["#33304a", "#0d1218"],
  ANALYSES: ["#2c3238", "#0d1218"],
  ARTICLE_01: ["#4a2a18", "#0b1016"],
  ARTICLE_02: ["#3d3418", "#0b1016"],
  ARTICLE_03: ["#123b33", "#0b1016"],
  ARTICLE_04: ["#16304a", "#0b1016"],
  THEME_01: ["#4a2f16", "#0b1016"],
  THEME_02: ["#16304a", "#0b1016"],
  THEME_03: ["#123b33", "#0b1016"],
  THEME_04: ["#4a2a18", "#0b1016"],
  THEME_05: ["#33304a", "#0b1016"],
};

function teinte(nom: string): [string, string] {
  const cle = Object.keys(TEINTES).find((k) => nom.includes(k));
  return cle ? TEINTES[cle] : ["#1a2029", "#0b1016"];
}

export function ImagePlaceholder({
  nom,
  ratio = "16 / 9",
  className = "",
}: {
  nom: string;
  ratio?: string;
  className?: string;
}) {
  const [a, b] = teinte(nom);
  return (
    <div
      className={`image-placeholder ${className}`}
      style={
        {
          aspectRatio: ratio,
          "--ph-a": a,
          "--ph-b": b,
        } as React.CSSProperties
      }
      data-png={nom}
    >
      <span className="image-placeholder-lueur" aria-hidden="true" />
      <span className="image-placeholder-trame" aria-hidden="true" />
      <span className="image-placeholder-etiquette">{nom}</span>
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

/* ── L'en-tête et le pied, partagés par les pages du prototype ──────────── */

const NAV: { label: string; href: string }[] = [
  { label: "Monde", href: "/concept-globe" },
  { label: "Économie", href: "/concept-globe/economie" },
  { label: "Géopolitique", href: "/concept-globe#geopolitique" },
  { label: "Sociétés", href: "/concept-globe#societes" },
  { label: "Ressources", href: "/concept-globe#ressources" },
  { label: "Analyses", href: "/concept-globe#analyses" },
];

export function EnTete({ actif }: { actif?: string }) {
  /* Le menu tient tout entier dans son nom.

     Au repos, « Visualize » est seul, au milieu de la page. On s'en approche
     et il glisse vers la gauche pendant que le reste se déplie derrière lui,
     sur un panneau de verre qui laisse voir la page en dessous.

     L'ouverture se fait au survol et à la prise de focus : un menu qui ne
     répond qu'à la souris est un menu fermé pour qui navigue au clavier.
     Elle tient aussi au clic, sinon un écran tactile n'y accède jamais. */
  const [ouvert, setOuvert] = useState(false);
  const barre = useRef<HTMLElement>(null);

  /* Échap referme, et un clic ailleurs aussi : une barre ouverte qui couvre
     le haut de la page doit pouvoir se refermer sans viser. */
  useEffect(() => {
    if (!ouvert) return;
    const touche = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
    const ailleurs = (e: PointerEvent) => {
      if (!barre.current?.contains(e.target as Node)) setOuvert(false);
    };
    window.addEventListener("keydown", touche);
    window.addEventListener("pointerdown", ailleurs);
    return () => {
      window.removeEventListener("keydown", touche);
      window.removeEventListener("pointerdown", ailleurs);
    };
  }, [ouvert]);

  return (
    <header
      ref={barre}
      className={`cg-header${ouvert ? " cg-header-ouvert" : ""}`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOuvert(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOuvert(false)}
      onFocus={() => setOuvert(true)}
    >
      {/* Le verre : il n'existe qu'ouvert, et il ne floute que ce qui est
          derrière lui. Une couche immobile — le navigateur la compose une
          fois, pas à chaque image. */}
      <span className="cg-header-verre" aria-hidden="true" />

      <div className="cg-header-l">
        <a
          href="/concept-globe"
          className="cg-logo"
          onClick={(e) => {
            if (!ouvert) {
              e.preventDefault();
              setOuvert(true);
            }
          }}
        >
          <span className="cg-logo-m" aria-hidden="true" />
          <span className="cg-logo-t">Visualize</span>
        </a>

        <nav className="cg-nav">
          {NAV.map((n, i) => (
            <a
              key={n.label}
              href={n.href}
              className={actif === n.label ? "cg-nav-on" : undefined}
              style={{ "--i": i } as React.CSSProperties}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="cg-header-d">
          <span className="cg-demo-mini" title="Les valeurs de cette maquette ne sont pas mesurées">
            prototype · démonstration
          </span>
          <button type="button" className="cg-header-b" aria-label="Recherche">
            Recherche
          </button>
          <button type="button" className="cg-header-b">
            FR
          </button>
          <button type="button" className="cg-header-b cg-header-b-vif">
            Se connecter
          </button>
        </div>
      </div>
    </header>
  );
}

export function Pied() {
  return (
    <footer className="cg-pied">
      <div className="cg-wrap cg-pied-l">
        <span>Visualize</span>
        <nav>
          {NAV.slice(0, 4).map((n) => (
            <a key={n.label} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <span className="cg-pied-note">Prototype de direction artistique · non indexé</span>
      </div>
    </footer>
  );
}

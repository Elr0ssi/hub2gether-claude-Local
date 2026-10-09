"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { LienCompte } from "@/components/compte/LienCompte";
import { BoutonTheme } from "./Theme";
import { ChoixMonnaie } from "./Monnaie";

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

/** Le titre de section des pages de sujet (Économie, Démographie, Forum…) :
    un grand titre blanc, et en dessous, en petit, ce qui le situe — une
    période, une source. Les pages de sujet partagent toutes cette forme. */
export function TitreSection({
  titre,
  sous,
  direct,
}: {
  titre: React.ReactNode;
  sous?: React.ReactNode;
  /** Un point vert qui bat devant le titre : la section avance en direct. */
  direct?: boolean;
}) {
  return (
    <div className="cg-ts">
      <h2 className="cg-ts-t">
        {direct && <span className="cg-point-vif" aria-hidden="true" />}
        {titre}
      </h2>
      {sous && <p className="cg-ts-s">{sous}</p>}
    </div>
  );
}

/* ── L'en-tête et le pied, partagés par les pages du prototype ──────────── */

interface Onglet {
  label: string;
  /** Absent : la rubrique est annoncée, mais elle n'a pas encore de page. */
  href?: string;
}

/* Les onglets, dans l'ordre où ils se lisent. Aucun symbole : le nom suffit,
   et un symbole devant chaque mot faisait de la barre une rangée de choses qui
   se ressemblent. */
const NAV: Onglet[] = [
  { label: "Économie", href: "/economie" },
  { label: "Démographie", href: "/demographie" },
  { label: "Analyses", href: "/analyses" },
  { label: "Dette", href: "/france/economie/dette-publique-v2" },
  /* L'essai de la page Économie en néo-média. */
  { label: "V2 éco", href: "/v2-eco" },
  /* Comparer des thématiques dans le temps, sur un graphe : la suite de
     l'actuel /comparaison, encore à construire dans le concept. */
  { label: "Live" },
];

/** Un onglet. Sans adresse, il se montre sans se laisser cliquer. */
function Lien({ n, actif, rang }: { n: Onglet; actif?: string; rang: number }) {
  const style = { "--i": rang } as React.CSSProperties;
  if (!n.href) {
    return (
      <span className="cg-nav-bientot" style={style}>
        {n.label}
        <em>bientôt</em>
      </span>
    );
  }
  return (
    <a
      href={n.href}
      className={actif === n.label ? "cg-nav-on" : undefined}
      aria-current={actif === n.label ? "page" : undefined}
      style={style}
    >
      {n.label}
    </a>
  );
}

export function EnTete({ actif }: { actif?: string }) {
  /* Une pilule. Au repos, elle ne porte que le nom ; on s'en approche, ou on
     la touche, et elle s'ouvre sur les rubriques puis sur les réglages et le
     compte, séparés par un trait.

     L'ouverture se fait au survol et à la prise de focus : un menu qui ne
     répond qu'à la souris est un menu fermé pour qui navigue au clavier.
     Elle tient aussi au clic, sinon un écran tactile n'y accède jamais. */
  const [ouvert, setOuvert] = useState(false);
  const barre = useRef<HTMLElement>(null);
  /* L'état du menu au moment où le doigt se pose : sur un écran tactile, la
     prise de focus l'ouvre avant que le clic n'arrive, et le clic, voyant un
     menu déjà ouvert, suivait le lien. On retient donc l'état d'avant. */
  const avant = useRef(false);

  /* Échap referme, et un clic ailleurs aussi. */
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
      <div className="cg-pill">
        <a
          href="/"
          className="cg-logo"
          onPointerDownCapture={() => {
            avant.current = ouvert;
          }}
          onClick={(e) => {
            if (!avant.current) {
              e.preventDefault();
              setOuvert(true);
            }
          }}
        >
          <span className="cg-logo-m" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="cg-logo-t">Visualize</span>
        </a>

        <div className="cg-pill-corps">
          <nav className="cg-nav" aria-label="Rubriques">
            {NAV.map((n, i) => (
              <Lien key={n.label} n={n} actif={actif} rang={i} />
            ))}
          </nav>

          <span className="cg-sep" aria-hidden="true" />

          <div className="cg-bout">
            <ChoixMonnaie />
            <BoutonTheme className="cg-jour" />
            <a href="/forum" className="cg-bout-l">
              Forum
            </a>
          </div>
        </div>

        {/* L'entrée de compte reste posée sur mobile : sans elle, « Se
            connecter » existerait dans la page sans que personne puisse le
            toucher. Sur grand écran, elle arrive avec le reste. */}
        <LienCompte className="cg-cnx" />
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
          {NAV.filter((n) => n.href).map((n) => (
            <a key={n.label} href={n.href}>
              {n.label}
            </a>
          ))}
          <a href="/forum">Forum</a>
          <a href="/compte/connexion">Mon compte</a>
        </nav>
        <span className="cg-pied-note">Données : Banque mondiale, FMI, Nations Unies</span>
      </div>
    </footer>
  );
}

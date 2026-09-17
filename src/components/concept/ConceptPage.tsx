"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TOPICS } from "@/data/concept/conceptData";
import { UniverseGlobe, type PositionNoeud } from "./UniverseGlobe";
import { ImagePlaceholder, LENT } from "./pieces";
import {
  FeaturedStories,
  FluxSources,
  InteractiveMapPreview,
  LiveTicker,
  NewsletterSection,
  NumbersSection,
  TopicExplorer,
} from "./sections";
import type { FichePays } from "@/data/concept/conceptGeo";
import "./concept.css";

/* ═══════════════════════════════════════════════════════════════════════════
   PROTOTYPE — LA PAGE

   Une seule expérience continue : le globe tient l'écran d'ouverture, reste
   collé pendant que le premier écran de contenu passe devant lui, puis
   remonte et sort par le haut en laissant ses orbites derrière. Le fond ne
   change jamais.
   ═══════════════════════════════════════════════════════════════════════════ */

const NAV = ["Monde", "Économie", "Géopolitique", "Sociétés", "Ressources", "Analyses"];

export interface ConceptProps {
  donnees: Record<string, FichePays>;
  annee: number;
  regions: readonly { id: string; label: string; pays: readonly string[] }[];
  vues: Record<string, { lat: number; lon: number }>;
}

export function ConceptPage({ donnees, annee, regions, vues }: ConceptProps) {
  const [actif, setActif] = useState<string | null>(null);
  const [fige, setFige] = useState<string | null>(null);
  const [souris, setSouris] = useState({ x: 0, y: 0 });
  const [pret, setPret] = useState(false);

  /* Les étiquettes sont écrites directement dans le DOM par la boucle du
     canvas : les faire passer par l'état React à soixante images par seconde
     rendrait la page saccadée. */
  const noeuds = useRef<Record<string, HTMLDivElement | null>>({});

  const scene = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scene, offset: ["start start", "end start"] });
  /* Le globe monte, grandit et s'efface : il ne disparaît pas, il sort du
     cadre par le haut pendant que la suite arrive. */
  const globeY = useTransform(scrollYProgress, [0, 1], ["0%", "-38%"]);
  const globeS = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const globeO = useTransform(scrollYProgress, [0, 0.62, 1], [1, 0.6, 0.12]);
  const texteY = useTransform(scrollYProgress, [0, 1], ["0%", "-26%"]);
  const texteO = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  useEffect(() => {
    const t = setTimeout(() => setPret(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bouge = (e: PointerEvent) => {
      setSouris({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 });
    };
    window.addEventListener("pointermove", bouge, { passive: true });
    return () => window.removeEventListener("pointermove", bouge);
  }, []);

  const place = useCallback((positions: PositionNoeud[]) => {
    for (const p of positions) {
      const el = noeuds.current[p.id];
      if (!el) continue;
      /* Derrière la sphère, l'étiquette recule : plus petite, plus pâle. */
      const echelle = 0.86 + p.avant * 0.14;
      el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${echelle})`;
      el.style.opacity = String(0.34 + p.avant * 0.66);
      el.style.zIndex = String(Math.round(p.avant * 10) + 1);
    }
  }, []);

  const vise = fige ?? actif;

  return (
    <div className="cg">
      {/* ── L'en-tête ────────────────────────────────────────────────────── */}
      <header className="cg-header">
        <div className="cg-header-l">
          <a href="#" className="cg-logo">
            <span className="cg-logo-m" aria-hidden="true" />
            The Essential Data
          </a>
          <nav className="cg-nav">
            {NAV.map((n) => (
              <a key={n} href={`#${n.toLowerCase()}`}>
                {n}
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

      {/* ── La scène : globe collé, contenu qui passe devant ─────────────── */}
      <div ref={scene} className="cg-scene">
        <div className="cg-scene-colle">
          <div className="cg-globe-ancre">
          <motion.div className="cg-globe" style={{ y: globeY, scale: globeS, opacity: globeO }}>
            <UniverseGlobe topics={TOPICS} onNodes={place} actif={vise} souris={souris} />

            {/* Le nom, au centre de la sphère */}
            <motion.div
              className="cg-centre"
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={pret ? { opacity: 1, letterSpacing: "0.26em" } : {}}
              transition={{ duration: 1.6, delay: 1.9, ease: LENT }}
            >
              <span>The</span>
              <span>Essential Data</span>
            </motion.div>

            {/* Les rubriques en orbite */}
            <div className="cg-noeuds">
              {TOPICS.map((t, k) => (
                <motion.div
                  key={t.id}
                  ref={(el) => {
                    noeuds.current[t.id] = el;
                  }}
                  className={`cg-noeud${vise === t.id ? " cg-noeud-on" : ""}${vise && vise !== t.id ? " cg-noeud-off" : ""}`}
                  initial={{ opacity: 0 }}
                  animate={pret ? { opacity: 1 } : {}}
                  transition={{ duration: 1.1, delay: 2.3 + k * 0.16, ease: LENT }}
                  onMouseEnter={() => setActif(t.id)}
                  onMouseLeave={() => setActif(null)}
                  onClick={() => setFige((f) => (f === t.id ? null : t.id))}
                  role="button"
                  tabIndex={0}
                  onFocus={() => setActif(t.id)}
                  onBlur={() => setActif(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setFige((f) => (f === t.id ? null : t.id));
                    }
                  }}
                >
                  <span className="cg-noeud-tige" style={{ background: t.teinte }} aria-hidden="true" />
                  <span className="cg-noeud-label" style={{ color: t.teinte }}>
                    {t.label}
                  </span>
                  <span className="cg-fragment">
                    <ImagePlaceholder nom={t.module.image} ratio="16 / 10" className="cg-fragment-img" />
                    <span className="cg-fragment-v">{t.module.valeur}</span>
                    <span className="cg-fragment-l">{t.module.legende}</span>
                    <span className="cg-fragment-f" aria-hidden="true">
                      →
                    </span>
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          </div>

          {/* ── Le bloc éditorial, à gauche ──────────────────────────────── */}
          <div className="cg-hero-ancre">
          <motion.div className="cg-hero-texte" style={{ y: texteY, opacity: texteO }}>
            <motion.p
              className="cg-eyebrow"
              initial={{ opacity: 0, y: 10 }}
              animate={pret ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.1, delay: 2.7, ease: LENT }}
            >
              Des données pour comprendre le monde
            </motion.p>

            <h1 className="cg-h1">
              {["Comprendre", "ce qui façonne", "le monde."].map((l, k) => (
                <motion.span
                  key={l}
                  initial={{ opacity: 0, y: 28 }}
                  animate={pret ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1.3, delay: 2.85 + k * 0.13, ease: LENT }}
                >
                  {l}
                </motion.span>
              ))}
            </h1>

            <motion.p
              className="cg-hero-c"
              initial={{ opacity: 0, y: 16 }}
              animate={pret ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 3.35, ease: LENT }}
            >
              Des données fiables. Des analyses éclairées.
              <br />
              Pour comprendre les grands enjeux d&apos;aujourd&apos;hui et anticiper ceux de demain.
            </motion.p>

            <motion.div
              className="cg-hero-bas"
              initial={{ opacity: 0, y: 16 }}
              animate={pret ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 3.55, ease: LENT }}
            >
              <button type="button" className="cg-cta">
                Explorer l&apos;univers <span aria-hidden="true">→</span>
              </button>
              <span className="cg-lecteurs">
                <strong>+50 000</strong>
                lecteurs chaque mois
              </span>
            </motion.div>

            <motion.p
              className="cg-murmure"
              initial={{ opacity: 0 }}
              animate={pret ? { opacity: 1 } : {}}
              transition={{ duration: 1.6, delay: 4.1, ease: LENT }}
            >
              « Les données ne changent pas le monde.
              <br />
              Ce que l&apos;on en fait, oui. »
            </motion.p>
          </motion.div>
          </div>

          <motion.span
            className="cg-defiler"
            initial={{ opacity: 0 }}
            animate={pret ? { opacity: 1 } : {}}
            transition={{ duration: 1.4, delay: 4.4 }}
            aria-hidden="true"
          >
            défiler
          </motion.span>
        </div>
      </div>

      {/* ── Le fil orbital qui traverse tout le reste ────────────────────── */}
      <div className="cg-suite">
        <svg className="cg-fil-orbital" viewBox="0 0 1400 3200" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M 1180 -120 C 900 320, 300 520, 180 960 S 620 1520, 1240 1760 S 900 2400, 300 2720"
            fill="none"
            stroke="rgba(158,199,216,0.14)"
            strokeWidth="1"
          />
          <path
            d="M 1320 -60 C 1020 420, 420 640, 320 1080 S 760 1620, 1340 1900 S 980 2520, 380 2900"
            fill="none"
            stroke="rgba(214,167,122,0.10)"
            strokeWidth="1"
          />
        </svg>

        <LiveTicker />
        <InteractiveMapPreview donnees={donnees} annee={annee} regions={regions} vues={vues} />
        <FluxSources />
        <FeaturedStories />
        <TopicExplorer />
        <NumbersSection />
        <NewsletterSection />
      </div>
    </div>
  );
}

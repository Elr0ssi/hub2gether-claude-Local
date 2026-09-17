"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BarChart3, CloudSun, Flag, Layers, TrendingUp, Users } from "lucide-react";
import { LENT } from "./pieces";
import {
  Classements,
  FeaturedStories,
  FluxSources,
  InteractiveMapPreview,
  LiveTicker,
  Methode,
  NewsletterSection,
  NumbersSection,
  Questions,
  Rubriques,
  TopicExplorer,
} from "./sections";
import type { FichePays } from "@/data/concept/conceptGeo";
import "./concept.css";

/* Le globe en points du site — le même composant que la page d'accueil, servi
   ici avec une palette sombre. Chargé côté client seulement : il monte une
   scène WebGL, qui n'a rien à faire dans le rendu serveur. */
const GlobePoints = dynamic(() => import("@/components/globe/InteractiveGlobeIcons"), {
  ssr: false,
  loading: () => null,
});

/* Les rubriques, posées sur de vraies coordonnées : elles tournent donc avec
   le globe au lieu de flotter à côté. */
const MARQUEURS = [
  { id: "economie", lat: 50, lon: 12, icon: TrendingUp },
  { id: "geopolitique", lat: 39, lon: -98, icon: Flag },
  { id: "societes", lat: 22, lon: 79, icon: Users },
  { id: "ressources", lat: -25, lon: 133, icon: Layers },
  { id: "climat", lat: -12, lon: -55, icon: CloudSun },
  { id: "analyses", lat: 36, lon: 138, icon: BarChart3 },
];

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
  const [pret, setPret] = useState(false);

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
            <GlobePoints
              markers={MARQUEURS}
              accent="#9EC7D8"
              sphereColor="#070E16"
              badgeBackground="rgba(10,16,24,0.88)"
              badgeShadow="0 10px 28px rgba(0,0,0,0.55), 0 0 0 1px rgba(158,199,216,0.22)"
              iconColor="#CFE4EE"
              markerSize="clamp(34px, 4.4vw, 48px)"
            />

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

        <Rubriques />
        <LiveTicker />
        <InteractiveMapPreview donnees={donnees} annee={annee} regions={regions} vues={vues} />
        <Classements donnees={donnees} annee={annee} />
        <FluxSources />
        <Methode />
        <FeaturedStories />
        <TopicExplorer />
        <Questions />
        <NumbersSection />
        <NewsletterSection />
      </div>
    </div>
  );
}

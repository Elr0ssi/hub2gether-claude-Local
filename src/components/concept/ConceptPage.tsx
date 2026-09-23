"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { BarChart3, CloudSun, Flag, Layers, TrendingUp, Users } from "lucide-react";
import { Loupe } from "./Loupe";
import { EnTete, LENT } from "./pieces";
import { TempsReel } from "./TempsReel";
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
  TopicExplorer,
} from "./sections";
import type { FicheArticle, FichePays, Repere } from "@/data/concept/conceptGeo";
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

export interface ConceptProps {
  articles: FicheArticle[];
  reperes: Repere[];
  donnees: Record<string, FichePays>;
  annee: number;
  regions: readonly { id: string; label: string; pays: readonly string[] }[];
  vues: Record<string, { lat: number; lon: number }>;
}

export function ConceptPage({ articles, reperes, donnees, annee, regions, vues }: ConceptProps) {
  const [pret, setPret] = useState(false);

  const scene = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scene, offset: ["start start", "end start"] });
  const texteY = useTransform(scrollYProgress, [0, 1], ["0%", "-26%"]);
  const texteO = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  /* ── Le globe de fond ───────────────────────────────────────────────────
     Il n'appartient plus au hero : c'est une couche fixe qui traverse tout le
     haut de la page. En descendant, il recule — il plonge, rétrécit, se
     floute — et arrive derrière le globe interactif au moment précis où
     celui-ci entre à l'écran. Le relais se fait sans coupure : on ne voit pas
     un globe disparaître et un autre apparaître, on voit le premier passer
     derrière le second.

     La course est mesurée en pixels plutôt qu'en fraction d'élément : la
     couche est fixe, elle n'a pas de progression propre à observer. */
  const relais = useRef<HTMLDivElement>(null);
  const [fin, setFin] = useState(1400);
  useEffect(() => {
    const mesure = () => {
      const el = relais.current;
      if (!el) return;
      const haut = el.getBoundingClientRect().top + window.scrollY;
      setFin(Math.max(500, haut + el.offsetHeight * 0.4 - window.innerHeight * 0.5));
    };
    mesure();
    const t = setTimeout(mesure, 400);
    window.addEventListener("resize", mesure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", mesure);
    };
  }, []);

  const { scrollY } = useScroll();
  const fondY = useTransform(scrollY, [0, fin * 0.55, fin], [0, 150, 40]);
  const fondX = useTransform(scrollY, [0, fin], ["0%", "-27%"]);
  const fondS = useTransform(scrollY, [0, fin * 0.18, fin], [1, 1.1, 0.52]);
  const fondO = useTransform(
    scrollY,
    [0, fin * 0.5, fin * 0.85, fin, fin * 1.3],
    [1, 0.62, 0.3, 0.12, 0],
  );
  const fondFlouPx = useTransform(scrollY, [0, fin * 0.35, fin], [0, 3, 13]);
  const fondFlou = useMotionTemplate`blur(${fondFlouPx}px)`;

  /* Passé le relais, la scène WebGL n'a plus rien à montrer : on arrête sa
     boucle au lieu de la laisser tourner sous un flou à 12 %. On coupe avant
     le globe interactif — deux scènes qui tournent en même temps, c'est lui
     qui perd des images, et c'est celui qu'on manipule. */
  const [fondVivant, setFondVivant] = useState(true);
  useEffect(() => scrollY.on("change", (v) => setFondVivant(v < fin * 0.92)), [scrollY, fin]);

  /* Tant qu'on est dans le hero, le globe de fond se laisse attraper et
     tourner. Passé ce point il redevient transparent au pointeur : il est
     fixe, et il couvrirait sinon une bande de la page à chaque section. */
  const [fondPrise, setFondPrise] = useState(true);
  useEffect(() => scrollY.on("change", (v) => setFondPrise(v < fin * 0.34)), [scrollY, fin]);

  useEffect(() => {
    const t = setTimeout(() => setPret(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="cg">
      <EnTete />
      <Loupe />

      {/* ── Le globe de fond, sur toute la traversée ─────────────────────── */}
      <motion.div
        className="cg-fond-globe"
        style={{ y: fondY, x: fondX, scale: fondS, opacity: fondO, filter: fondFlou }}
        aria-hidden="true"
      >
        <div className="cg-fond-globe-i" style={{ pointerEvents: fondPrise ? "auto" : "none" }}>
          <GlobePoints
            markers={MARQUEURS}
            accent="#9EC7D8"
            sphereColor="#070E16"
            badgeBackground="rgba(10,16,24,0.88)"
            badgeShadow="0 10px 28px rgba(0,0,0,0.55), 0 0 0 1px rgba(158,199,216,0.22)"
            iconColor="#CFE4EE"
            markerSize="clamp(30px, 3.6vw, 42px)"
            active={fondVivant}
          />
        </div>
      </motion.div>

      {/* ── La scène : le texte passe devant le globe ─────────────────────── */}
      <div ref={scene} className="cg-scene">
        <div className="cg-scene-colle">
          {/* ── Le bloc éditorial, à gauche ──────────────────────────────── */}
          <div className="cg-hero-ancre">
          <motion.div className="cg-hero-texte" style={{ y: texteY, opacity: texteO }}>
            <motion.p
              className="cg-eyebrow"
              initial={{ opacity: 0, y: 10 }}
              animate={pret ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.1, delay: 0.35, ease: LENT }}
            >
              Des données pour comprendre le monde
            </motion.p>

            <h1 className="cg-h1">
              {["Comprendre", "ce qui façonne", "le monde."].map((l, k) => (
                <motion.span
                  key={l}
                  initial={{ opacity: 0, y: 28 }}
                  animate={pret ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1.3, delay: 0.5 + k * 0.1, ease: LENT }}
                >
                  {l}
                </motion.span>
              ))}
            </h1>

            <motion.p
              className="cg-hero-c"
              initial={{ opacity: 0, y: 16 }}
              animate={pret ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.85, ease: LENT }}
            >
              Des données fiables, des sources nommées, une méthode constante.
            </motion.p>

            <motion.div
              className="cg-hero-bas"
              initial={{ opacity: 0, y: 16 }}
              animate={pret ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 1.0, ease: LENT }}
            >
              <button type="button" className="cg-cta">
                Explorer l&apos;univers <span aria-hidden="true">→</span>
              </button>
              <span className="cg-lecteurs">
                <strong>+50 000</strong>
                lecteurs chaque mois
              </span>
            </motion.div>

          </motion.div>
          </div>

          <motion.span
            className="cg-defiler"
            initial={{ opacity: 0 }}
            animate={pret ? { opacity: 1 } : {}}
            transition={{ duration: 1.4, delay: 1.35 }}
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

        <LiveTicker reperes={reperes} annee={annee} />
        <TempsReel donnees={donnees} annee={annee} />
        <div ref={relais}>
          <InteractiveMapPreview donnees={donnees} annee={annee} regions={regions} vues={vues} />
        </div>
        <Classements donnees={donnees} annee={annee} />
        <FluxSources />
        <Methode />
        <FeaturedStories articles={articles} />
        <TopicExplorer />
        <Questions />
        <NumbersSection />
        <NewsletterSection />
      </div>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { Layers } from "lucide-react";
import { Loupe } from "./Loupe";
import { EnTete, LENT } from "./pieces";
import { TempsReel } from "./TempsReel";
import {
  Classements,
  FeaturedStories,
  FluxSources,
  InteractiveMapPreview,
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

/* Les trois repères tenaient une place à part dans la colonne de texte ; ils
   vivent maintenant sur le globe, comme les icônes qu'ils remplacent — des
   rectangles dépolis, posés sur de vraies coordonnées pour tourner avec la
   sphère plutôt que de flotter par-dessus. `icon` n'est là que parce que le
   type des marqueurs l'exige ; un marqueur textuel ne la dessine pas. */
const COORDONNEES = [
  { id: "globes", lat: 50, lon: 12 },
  { id: "articles", lat: 39, lon: -98 },
  { id: "forum", lat: -12, lon: -55 },
] as const;

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
  /** Les comptages du hero : globes thématiques, articles publiés. */
  comptes: { globes: number; articles: number };
  donnees: Record<string, FichePays>;
  annee: number;
  regions: readonly { id: string; label: string; pays: readonly string[] }[];
  vues: Record<string, { lat: number; lon: number }>;
}

export function ConceptPage({ articles, comptes, donnees, annee, regions, vues }: ConceptProps) {
  const [pret, setPret] = useState(false);

  const marqueurs = useMemo(
    () => [
      { id: COORDONNEES[0].id, lat: COORDONNEES[0].lat, lon: COORDONNEES[0].lon, icon: Layers, texte: { chiffre: String(comptes.globes), label: "globes thématiques" } },
      { id: COORDONNEES[1].id, lat: COORDONNEES[1].lat, lon: COORDONNEES[1].lon, icon: Layers, texte: { chiffre: String(comptes.articles), label: "articles décortiqués" } },
      { id: COORDONNEES[2].id, lat: COORDONNEES[2].lat, lon: COORDONNEES[2].lon, icon: Layers, texte: { chiffre: "Forum", label: "espace de débat" } },
    ],
    [comptes],
  );

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
            markers={marqueurs}
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
          {/* ── Le bloc éditorial, à gauche : le nom, une accroche, le lectorat.
              Tout le reste — ce que le site couvre — s'est déplacé sur le
              globe, à droite, plutôt que de s'empiler ici. */}
          <div className="cg-hero-ancre">
          <motion.div className="cg-hero-texte" style={{ y: texteY, opacity: texteO }}>
            <motion.h1 className="cg-hero-titre" style={{ margin: 0 }}
              initial={{ opacity: 0, y: 22 }}
              animate={pret ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.3, delay: 0.4, ease: LENT }}
            >
              Visualize
            </motion.h1>

            <motion.p
              className="cg-hero-c"
              initial={{ opacity: 0, y: 16 }}
              animate={pret ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.7, ease: LENT }}
            >
              Analyser et comprendre le monde en 30 secondes : des cartes qui se lisent d&apos;un
              coup d&apos;œil, des chiffres sourcés, une méthode qu&apos;on montre.
            </motion.p>

            <motion.span
              className="cg-lecteurs"
              initial={{ opacity: 0, y: 14 }}
              animate={pret ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.95, ease: LENT }}
            >
              <strong>+50 000</strong>
              lecteurs chaque mois
            </motion.span>
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

        <TempsReel donnees={donnees} annee={annee} />
        <div ref={relais}>
          <InteractiveMapPreview donnees={donnees} annee={annee} regions={regions} vues={vues} />
        </div>
        <Classements donnees={donnees} annee={annee} />
        <FluxSources />
        <FeaturedStories articles={articles} />
        <TopicExplorer />
        <NumbersSection />
        <Methode />
        <Questions />
        <NewsletterSection />
      </div>
    </div>
  );
}

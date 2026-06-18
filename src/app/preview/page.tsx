"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Globe, TrendingUp, Activity, Landmark, Scale, ArrowRight } from "lucide-react";
import { ARTICLES } from "@/data/articles";

const MAP_PREVIEWS = [
  {
    slug: "economy",
    label: "Économie mondiale",
    description: "PIB, dette publique, chômage par pays. Données FMI & Banque mondiale.",
    color: "#39FF88",
    bg: "rgba(57,255,136,0.08)",
    border: "rgba(57,255,136,0.25)",
    Icon: TrendingUp,
    stat: "190+ pays",
  },
  {
    slug: "epidemics",
    label: "Épidémies",
    description: "COVID-19, VIH, Ebola, Dengue. Cas, décès, cartographie mondiale.",
    color: "#FF6B6B",
    bg: "rgba(255,107,107,0.08)",
    border: "rgba(255,107,107,0.25)",
    Icon: Activity,
    stat: "12 maladies",
  },
  {
    slug: "empires",
    label: "Empires historiques",
    description: "Romain, Ottoman, Mongol, Britannique. 3 000 ans d'histoire.",
    color: "#FFD700",
    bg: "rgba(255,215,0,0.08)",
    border: "rgba(255,215,0,0.25)",
    Icon: Landmark,
    stat: "20+ empires",
  },
  {
    slug: "politics",
    label: "Orientations politiques",
    description: "Spectre gauche-droite par pays de 1933 à aujourd'hui.",
    color: "#9575CD",
    bg: "rgba(149,117,205,0.08)",
    border: "rgba(149,117,205,0.25)",
    Icon: Scale,
    stat: "1933 → 2025",
  },
];

const PREVIEW_ARTICLES = ARTICLES.slice(0, 8);

// ── Map preview card ─────────────────────────────────────────────────────────
function MapCard({ preview, index }: { preview: typeof MAP_PREVIEWS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
    >
      <Link
        href={`/map/${preview.slug}`}
        className="group block rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1"
        style={{
          background: preview.bg,
          border: `1px solid ${preview.border}`,
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${preview.color}22`, border: `1px solid ${preview.color}44` }}
          >
            <preview.Icon size={18} style={{ color: preview.color }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--ink)" }}>{preview.label}</p>
            <p style={{ color: preview.color, fontSize: "0.6rem", fontWeight: 700 }}>{preview.stat}</p>
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--ink-3)" }}>{preview.description}</p>
        <div
          className="flex items-center gap-1 mt-3 text-xs font-semibold transition-all duration-200 group-hover:gap-2"
          style={{ color: preview.color }}
        >
          Explorer <ArrowRight size={11} />
        </div>
      </Link>
    </motion.div>
  );
}

// ── Map previews section ──────────────────────────────────────────────────────
function MapPreviewsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-24 px-6" style={{ background: "var(--surface)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p style={{ color: "var(--accent)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
            4 thèmes
          </p>
          <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--ink)" }}>
            Une carte pour chaque dimension
          </h2>
          <p className="text-sm" style={{ color: "var(--ink-3)", maxWidth: 480, margin: "0 auto" }}>
            Économie, santé, histoire, politique. Chaque thème offre une fenêtre unique sur le monde.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MAP_PREVIEWS.map((preview, i) => (
            <MapCard key={preview.slug} preview={preview} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Article flip card ─────────────────────────────────────────────────────────
function ArticleFlipCard({ article, index, triggerFlip }: {
  article: typeof ARTICLES[0];
  index: number;
  triggerFlip: boolean;
}) {
  return (
    <motion.div
      initial={{ rotateY: 90, opacity: 0 }}
      animate={triggerFlip ? { rotateY: 0, opacity: 1 } : {}}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      style={{ perspective: 600 }}
    >
      <Link
        href={`/articles/${article.slug}`}
        className="block rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
      >
        <div className="p-4 flex flex-col gap-2">
          <span
            className="text-xs font-semibold capitalize px-2 py-0.5 rounded-md inline-block w-fit"
            style={{ background: "rgba(57,255,136,0.12)", color: "#0D7A40" }}
          >
            {article.theme}
          </span>
          <p
            className="text-xs font-bold leading-snug"
            style={{
              color: "var(--ink)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {article.title}
          </p>
          <p
            style={{
              color: "var(--ink-4)",
              fontSize: "0.62rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between mt-1">
            <span style={{ color: "var(--ink-4)", fontSize: "0.58rem" }}>{article.readingTime} min</span>
            <span style={{ color: "#0D7A40", fontSize: "0.62rem", fontWeight: 600 }}>Lire →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Articles flip section ──────────────────────────────────────────────────────
function ArticlesFlipSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p style={{ color: "var(--accent)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
            Analyses
          </p>
          <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--ink)" }}>
            Décryptages éditoriaux
          </h2>
          <p className="text-sm" style={{ color: "var(--ink-3)", maxWidth: 480, margin: "0 auto" }}>
            Articles approfondis sur l'économie mondiale, les épidémies, les empires et la géopolitique.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {PREVIEW_ARTICLES.map((article, i) => (
            <ArticleFlipCard
              key={article.slug}
              article={article}
              index={i}
              triggerFlip={isInView}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-center mt-10"
        >
          <Link
            href="/map/economy"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "var(--accent)", color: "#000" }}
          >
            <Globe size={16} />
            Explorer toutes les cartes
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PreviewPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  const globeScale    = useTransform(scrollYProgress, [0, 1],   [1, 2.8]);
  const heroOpacity   = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const heroY         = useTransform(scrollYProgress, [0, 1],   ["0%", "20%"]);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero — scroll-driven globe zoom */}
      <div ref={heroRef} style={{ height: "200vh", position: "relative" }}>
        <div
          className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center gap-8"
          style={{ paddingTop: "var(--navbar-height)" }}
        >
          {/* Background radial glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(57,255,136,0.05) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Headline + CTA */}
          <motion.div
            style={{ opacity: heroOpacity, y: heroY, position: "relative", zIndex: 2 }}
            className="text-center px-6"
          >
            <p style={{ color: "var(--accent)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
              The Essential Data
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight" style={{ color: "var(--ink)" }}>
              Le monde en données.<br />
              <span style={{ color: "var(--accent)" }}>Explorez. Comprenez.</span>
            </h1>
            <p className="text-base mb-6" style={{ color: "var(--ink-3)", maxWidth: 520, margin: "0 auto 24px" }}>
              Cartes interactives mondiales, analyses géopolitiques et données économiques.
              Faites défiler pour découvrir.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/map/economy" className="btn-primary text-sm">
                Explorer les cartes
              </Link>
              <Link href="/comparaison" className="btn-ghost text-sm">
                Comparer des pays
              </Link>
            </div>
          </motion.div>

          {/* Globe — scales with scroll */}
          <motion.div style={{ scale: globeScale, opacity: heroOpacity, position: "relative", zIndex: 1 }}>
            <div
              style={{
                width: "min(380px, 70vw)",
                height: "min(380px, 70vw)",
                borderRadius: "50%",
                background: "radial-gradient(circle at 35% 30%, #4fc3f7 0%, #1565c0 35%, #0d2a6b 60%, #060e2a 85%)",
                boxShadow: "inset -40px -30px 80px rgba(0,0,0,0.5), inset 20px 20px 60px rgba(79,195,247,0.15), 0 0 100px rgba(57,255,136,0.1)",
                position: "relative",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {/* Continent overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: "radial-gradient(ellipse 55% 35% at 45% 38%, rgba(76,175,80,0.35) 0%, transparent 60%), radial-gradient(ellipse 28% 18% at 68% 58%, rgba(76,175,80,0.22) 0%, transparent 60%), radial-gradient(ellipse 22% 16% at 22% 52%, rgba(76,175,80,0.18) 0%, transparent 60%)",
                  animation: "globe-spin 30s linear infinite",
                }}
              />
              {/* Specular highlight */}
              <div
                style={{
                  position: "absolute",
                  top: "12%",
                  left: "18%",
                  width: "28%",
                  height: "20%",
                  borderRadius: "50%",
                  background: "radial-gradient(ellipse at center, rgba(255,255,255,0.22) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            style={{ opacity: heroOpacity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 24,
                height: 40,
                border: "2px solid var(--border)",
                borderRadius: 12,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                paddingTop: 6,
              }}
            >
              <div style={{ width: 4, height: 8, borderRadius: 2, background: "var(--accent)" }} />
            </motion.div>
            <span style={{ color: "var(--ink-4)", fontSize: "0.62rem" }}>Défiler</span>
          </motion.div>
        </div>
      </div>

      {/* Map previews */}
      <MapPreviewsSection />

      {/* Articles flip */}
      <ArticlesFlipSection />

      <style>{`
        @keyframes globe-spin {
          from { transform: translateX(0%); }
          50%  { transform: translateX(4%); }
          to   { transform: translateX(0%); }
        }
      `}</style>
    </div>
  );
}

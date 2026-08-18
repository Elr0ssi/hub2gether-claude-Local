"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useMotionNumber } from "@/hooks/useMotionNumber";
import { useSettledReducedMotion } from "@/hooks/useSettledReducedMotion";

import { DataMapPanel, type MapCallout } from "./DataMapPanel";
import { AnimatedKpi } from "./AnimatedKpi";
import { COUNTRIES } from "@/data/countryData";

interface Kpi {
  target: number;
  decimals: number;
  prefix?: string;
  suffix?: string;
  label: string;
  delta?: string;
}

interface Category {
  id: string;
  label: string;
  title: string;
  description: string;
  href: string;
  accent: string;
  bg: string;
  landFill: string;
  highlight: { name: string; coordinates: [number, number] };
  callout: { label: string; value: string; delta?: string; source?: string };
  kpis: Kpi[];
  /** Same shape as `callout`: the card never changes layout, only content. */
  getCountryCallout: (countryName: string) => MapCallout;
}

/** Unknown metric → N/A, so the card keeps its shape until the data exists. */
const NA = "N/A";

const noData = (countryName: string, metric: string, source?: string): MapCallout => ({
  label: `${countryName} · ${metric}`,
  value: NA,
  delta: NA,
  source,
});

const CATEGORIES: Category[] = [
  {
    id: "economy",
    label: "Économie",
    title: "Suivez la puissance économique mondiale",
    description:
      "Analysez la croissance, le PIB, le commerce international et les grandes tendances économiques par pays.",
    href: "/map/economy",
    accent: "#10B981",
    bg: "#EEFBF4",
    landFill: "#CDEEDD",
    highlight: { name: "Chine", coordinates: [104.1954, 35.8617] },
    callout: { label: "Chine · PIB nominal 2025", value: "19,53 T$", delta: "+4,2% vs 2024", source: "FMI" },
    kpis: [
      { target: 105, decimals: 0, prefix: "$", suffix: " T", label: "PIB mondial 2025", delta: "+3,3% vs 2024" },
      { target: 19.53, decimals: 2, prefix: "$", suffix: " T", label: "PIB Chine 2025", delta: "+4,2% vs 2024" },
      { target: 30.3, decimals: 1, prefix: "$", suffix: " T", label: "Échanges mondiaux", delta: "+2,1% vs 2024" },
      { target: 2.44, decimals: 2, prefix: "$", suffix: " T", label: "Dépenses militaires", delta: "Record 2024" },
    ],
    getCountryCallout: (name) => {
      const e = COUNTRIES[name]?.economy;
      if (!e) return noData(name, "PIB nominal 2025", "FMI");
      return {
        label: `${name} · PIB nominal 2025`,
        value: e.gdp ?? NA,
        delta: e.gdpPC ? `PIB/hab. ${e.gdpPC}` : NA,
        source: e.rank ? `FMI · #${e.rank} mondial` : "FMI",
      };
    },
  },
  {
    id: "demography",
    label: "Démographie",
    title: "Comprenez l'évolution des populations",
    description:
      "Naissances, espérance de vie, urbanisation : des données clés pour anticiper les changements de demain.",
    href: "/map/economy",
    accent: "#3B82F6",
    bg: "#EFF5FF",
    landFill: "#CFE0FB",
    highlight: { name: "Inde", coordinates: [78.9629, 20.5937] },
    callout: { label: "Inde · Population 2025", value: "1,46 Md", delta: "+0,9% cette année", source: "ONU" },
    kpis: [
      { target: 8.2, decimals: 2, suffix: " Md", label: "Population mondiale", delta: "+0,8% vs 2024" },
      { target: 17, decimals: 0, label: "Naissances / 1 000 hab.", delta: "Moyenne mondiale" },
      { target: 73.4, decimals: 1, suffix: " ans", label: "Espérance de vie", delta: "+0,3 an vs 2024" },
      { target: 57, decimals: 0, suffix: "%", label: "Population urbaine", delta: "+1,2% vs 2024" },
    ],
    getCountryCallout: (name) => {
      const d = COUNTRIES[name]?.demographie;
      if (!d) return noData(name, "Population 2025", "ONU");
      return {
        label: `${name} · Population 2025`,
        value: d.population ?? NA,
        delta: NA,
        source: "ONU",
      };
    },
  },
  {
    id: "resources",
    label: "Ressources",
    title: "Surveillez les ressources qui façonnent le monde",
    description:
      "Énergie, minerais, eau, terres agricoles : accédez aux données essentielles et aux enjeux associés.",
    href: "/map/economy",
    accent: "#D97706",
    bg: "#FFF8EC",
    landFill: "#F7E2BC",
    highlight: { name: "Arabie saoudite", coordinates: [45.0792, 23.8859] },
    callout: { label: "Arabie saoudite · Réserves de pétrole", value: "267 Md barils", delta: "18% des réserves mondiales", source: "BP" },
    kpis: [
      { target: 267, decimals: 0, suffix: " Md barils", label: "Réserves de pétrole", delta: "18% du total mondial" },
      { target: 2814, decimals: 0, suffix: " T", label: "Production d'énergie", delta: "+2,4% vs 2023" },
      { target: 3.2, decimals: 1, suffix: " Md m³", label: "Eau douce / hab. / an", delta: "Renouvelable" },
      { target: 34, decimals: 0, suffix: "%", label: "Terres agricoles", delta: "Du territoire mondial" },
    ],
    // No resources dataset exists yet in the project — tooltip is honest about that.
    getCountryCallout: (name) => noData(name, "Réserves de pétrole", "BP"),
  },
  {
    id: "politics",
    label: "Politique",
    title: "Décryptez les régimes politiques du monde",
    description:
      "Démocraties, dictatures, monarchies : suivez les orientations politiques et les transitions de chaque pays.",
    href: "/map/politics",
    accent: "#8B5CF6",
    bg: "#F5F1FF",
    landFill: "#E1D6FB",
    highlight: { name: "Allemagne", coordinates: [10.4515, 51.1657] },
    callout: { label: "Allemagne · Indice démocratique", value: "8,80 / 10", delta: "Meilleur score mondial", source: "EIU" },
    kpis: [
      { target: 44.8, decimals: 1, suffix: "%", label: "Population en démocratie", delta: "-0,8% vs 2024" },
      { target: 72, decimals: 0, suffix: " pays", label: "En recul démocratique", delta: "Sur 167 évalués" },
      { target: 18, decimals: 0, suffix: "e année", label: "De recul consécutif", delta: "EIU 2024" },
      { target: 8.8, decimals: 2, suffix: " /10", label: "Meilleur score (Allemagne)", delta: "" },
    ],
    getCountryCallout: (name) => {
      const pol = COUNTRIES[name]?.politics;
      if (!pol) return noData(name, "Indice démocratique", "EIU");
      return {
        label: `${name} · Régime politique`,
        value: pol.regime ?? NA,
        delta:
          pol.score != null
            ? `Indice ${pol.score.toFixed(2).replace(".", ",")} / 10`
            : NA,
        source: "EIU",
      };
    },
  },
  {
    id: "military",
    label: "Militaire",
    title: "Comparez les puissances militaires",
    description:
      "Budgets de défense, effectifs, arsenaux : appréhendez l'équilibre des forces à travers des données concrètes.",
    href: "/map/military",
    accent: "#B45356",
    bg: "#FBF1F0",
    landFill: "#F0D5D3",
    highlight: { name: "États-Unis", coordinates: [-95.7129, 37.0902] },
    callout: { label: "États-Unis · Dépenses militaires", value: "886 Mds€", delta: "36% du total mondial", source: "SIPRI" },
    kpis: [
      { target: 2.44, decimals: 2, prefix: "$", suffix: " T", label: "Dépenses militaires mondiales", delta: "Record 2024" },
      { target: 47, decimals: 0, label: "Conflits armés actifs", delta: "+4 vs 2023" },
      { target: 6.8, decimals: 1, suffix: "%", label: "Croissance des budgets", delta: "Vs 2023" },
      { target: 9, decimals: 0, label: "Puissances nucléaires", delta: "Déclarées" },
    ],
    getCountryCallout: (name) => noData(name, "Dépenses militaires", "SIPRI"),
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function DataStoryScene() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Layout under reduced motion is handled by `.p2-story-runway` /
  // `.p2-story-stage`; this only gates the reveal, and waits a commit so the
  // server and the first client render agree.
  const reduced = useSettledReducedMotion();
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });
  const [activeIndex, setActiveIndex] = useState(0);

  // Entrance. This range covers the last viewport before the scene pins —
  // exactly the stretch over which the hero's surface finishes expanding. The
  // content therefore materialises *inside* that surface rather than riding in
  // on a new block, and the two scenes never look like separate sections.
  const { scrollYProgress: entry } = useScroll({
    target: wrapperRef,
    offset: ["start end", "start start"],
  });
  // Staggered by block: the map, then the editorial column, then the figures.
  // Tuned against the hero: the surface is edge to edge shortly before this
  // window opens, so the reader gets a beat of empty surface — then the
  // content builds up inside it as it rises into view.
  const revealFrom = 0.34;
  const revealTo = 0.82;
  const step = 0.045;
  const mapOpacityMv = useTransform(entry, [revealFrom, revealTo], [0, 1], { clamp: true });
  const mapY = useTransform(entry, [revealFrom, revealTo], [40, 0], { clamp: true });
  const mapScale = useTransform(entry, [revealFrom, revealTo], [0.97, 1], { clamp: true });
  const textOpacityMv = useTransform(entry, [revealFrom + step, revealTo + step], [0, 1], { clamp: true });
  const textY = useTransform(entry, [revealFrom + step, revealTo + step], [40, 0], { clamp: true });
  const kpiOpacityMv = useTransform(entry, [revealFrom + step * 2, revealTo + step * 2], [0, 1], { clamp: true });
  const kpiY = useTransform(entry, [revealFrom + step * 2, revealTo + step * 2], [40, 0], { clamp: true });
  const railOpacityMv = useTransform(entry, [revealFrom + step * 3, revealTo + step * 3], [0, 1], { clamp: true });

  // See useMotionNumber: opacity needs mirroring through React state here.
  const mapOpacity = useMotionNumber(mapOpacityMv);
  const textOpacity = useMotionNumber(textOpacityMv);
  const kpiOpacity = useMotionNumber(kpiOpacityMv);
  const railOpacity = useMotionNumber(railOpacityMv);

  useEffect(
    () =>
      scrollYProgress.on("change", (v) => {
        const idx = Math.min(CATEGORIES.length - 1, Math.max(0, Math.floor(v * CATEGORIES.length)));
        setActiveIndex(idx);
      }),
    [scrollYProgress]
  );

  const active = CATEGORIES[activeIndex];

  return (
    <div
      ref={wrapperRef}
      className="p2-story-runway"
      style={{ ["--p2-story-vh" as string]: CATEGORIES.length * 100 }}
    >
      {/* One snap anchor per category: zero-width, out of the flow, purely a
          position for scroll-snap to resolve against. Harmless under reduced
          motion, where the page's snap type is turned off in CSS. */}
      {CATEGORIES.map((c, i) => (
        <div
          key={`snap-${c.id}`}
          aria-hidden="true"
          className="p2-snap-target"
          style={{
            position: "absolute",
            top: `${i * 100}vh`,
            left: 0,
            width: 1,
            height: "100vh",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* The last category is one end of the locked pair with the articles
          section below — see the run mounted in ArticlesShowcase. Its own
          anchor, with no height: a stop taller than the viewport is read by
          scrolling rather than jumped to, which is the opposite of the point
          here. */}
      <div
        aria-hidden="true"
        className="p2-lock"
        style={{
          position: "absolute",
          top: `${(CATEGORIES.length - 1) * 100}vh`,
          left: 0,
          width: 1,
          height: 0,
          pointerEvents: "none",
        }}
      />

      <div
        className="p2-story-stage"
        style={{
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          background: active.bg,
          transition: "background-color 0.6s ease",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: "clamp(20px, 4vh, 40px) clamp(20px, 4vw, 64px)",
          }}
        >
          {/* Progress indicator — hidden on mobile via .p2-progress (no room beside the stacked layout) */}
          <motion.div
            className="p2-progress"
            style={{
              opacity: reduced ? 1 : railOpacity,
              position: "absolute",
              left: "clamp(8px, 1.6vw, 22px)",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              zIndex: 6,
            }}
          >
            {CATEGORIES.map((c, i) => (
              <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    color: i === activeIndex ? active.accent : "#C4C4C4",
                    transition: "color 0.4s ease",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {i === activeIndex && (
                  <span
                    style={{
                      width: 4,
                      height: 18,
                      borderRadius: 4,
                      background: active.accent,
                      transition: "background-color 0.4s ease",
                    }}
                  />
                )}
              </div>
            ))}
          </motion.div>

          <div className="p2-story-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "clamp(20px, 3vw, 44px)" }}>
            {/* Map — the reveal wrapper is outside AnimatePresence so the
                per-category crossfade and the entrance never fight over the
                same element. */}
            <motion.div
              style={{
                gridColumn: 1,
                gridRow: 1,
                display: "grid",
                opacity: reduced ? 1 : mapOpacity,
                y: reduced ? 0 : mapY,
                scale: reduced ? 1 : mapScale,
              }}
            >
            <AnimatePresence mode="sync">
              <motion.div
                key={active.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                style={{
                  position: "relative",
                  borderRadius: 22,
                  overflow: "hidden",
                  background: "#fff",
                  border: "1px solid rgba(10,20,15,0.06)",
                  boxShadow: "0 16px 40px rgba(10,20,15,0.08)",
                  aspectRatio: "16 / 11",
                  gridColumn: 1,
                  gridRow: 1,
                }}
              >
                <DataMapPanel
                  accent={active.accent}
                  landFill={active.landFill}
                  oceanFill="#FAFCFB"
                  highlight={active.highlight}
                  callout={active.callout}
                  getCountryCallout={active.getCountryCallout}
                />
              </motion.div>
            </AnimatePresence>
            </motion.div>

            {/* Editorial text — position:relative cell + absolute-filled motion.div so the
                exiting and entering text overlap instead of sitting side by side.
                No explicit gridColumn here: it auto-places into column 2 on the desktop
                2-column grid (since column 1 is taken by the map), and wraps into its own
                row when the grid collapses to a single column on mobile. */}
            <motion.div
              style={{
                position: "relative",
                minHeight: 260,
                opacity: reduced ? 1 : textOpacity,
                y: reduced ? 0 : textY,
              }}
            >
              <AnimatePresence mode="sync">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}
                >
                  {/* White card, matching the KPI row beneath the map */}
                  <div style={{ marginBottom: 16 }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "9px 16px",
                        background: "#fff",
                        borderRadius: 12,
                        border: "1px solid rgba(10,20,15,0.06)",
                        boxShadow: "0 10px 26px rgba(10,20,15,0.06)",
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: active.accent,
                      }}
                    >
                      {active.label}
                    </span>
                  </div>
                  <h2
                    style={{
                      fontSize: "clamp(1.5rem, 2.6vw, 2.2rem)",
                      fontWeight: 900,
                      color: "#0A0A0A",
                      letterSpacing: "-0.03em",
                      lineHeight: 1.15,
                      marginBottom: 14,
                    }}
                  >
                    {active.title}
                  </h2>
                  <p style={{ fontSize: "0.92rem", color: "#5C5C5C", lineHeight: 1.65, marginBottom: 20, maxWidth: 420 }}>
                    {active.description}
                  </p>
                  <Link
                    href={active.href}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: active.accent,
                      textDecoration: "none",
                    }}
                  >
                    Explorer la carte {active.label.toLowerCase()} →
                  </Link>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* KPI row — re-keyed per category so counters restart on entry */}
          <motion.div
            style={{
              opacity: reduced ? 1 : kpiOpacity,
              y: reduced ? 0 : kpiY,
              marginTop: "clamp(18px, 3vh, 30px)",
              background: "#fff",
              borderRadius: 18,
              border: "1px solid rgba(10,20,15,0.06)",
              boxShadow: "0 10px 26px rgba(10,20,15,0.06)",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
            }}
            className="p2-kpi-row"
          >
            {active.kpis.map((kpi, i) => (
              // No icon: the figure carries the cell on its own.
              <div
                key={`${active.id}-${i}`}
                style={{
                  padding: "18px clamp(12px, 1.6vw, 20px)",
                  borderLeft: i === 0 ? "none" : "1px solid rgba(10,20,15,0.06)",
                  minWidth: 0,
                }}
              >
                <p style={{ fontSize: "clamp(1.25rem, 1.9vw, 1.6rem)", fontWeight: 900, color: "#0A0A0A", letterSpacing: "-0.03em", whiteSpace: "nowrap", lineHeight: 1.1 }}>
                  <AnimatedKpi target={kpi.target} decimals={kpi.decimals} prefix={kpi.prefix} suffix={kpi.suffix} />
                </p>
                <p style={{ fontSize: "0.72rem", color: "#8A8A8A", marginTop: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {kpi.label}
                </p>
                {kpi.delta && (
                  <p style={{ fontSize: "0.64rem", fontWeight: 600, color: active.accent, marginTop: 3 }}>{kpi.delta}</p>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .p2-story-grid { grid-template-columns: 1fr !important; }
          .p2-kpi-row { grid-template-columns: repeat(2, 1fr) !important; }
          .p2-progress { display: none !important; }
        }
      `}</style>
    </div>
  );
}

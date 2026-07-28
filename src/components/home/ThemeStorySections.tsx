"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Vote, Activity, Shield, ArrowUpRight, type LucideIcon } from "lucide-react";

const MiniMap = dynamic(() => import("@/components/hero/MiniMap"), {
  ssr: false,
  loading: () => null,
});

interface StoryStat {
  icon: LucideIcon;
  value: string;
  label: string;
  delta: string;
}

interface StorySection {
  id: string;
  themeId: string;
  label: string;
  title: string;
  description: string;
  href: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  Icon: LucideIcon;
  stats: StoryStat[];
}

const SECTIONS: StorySection[] = [
  {
    id: "economy",
    themeId: "economy",
    label: "Économie",
    title: "Suivez la puissance économique mondiale",
    description:
      "Analysez la croissance, le PIB, le commerce international et les grandes tendances économiques par pays.",
    href: "/map/economy",
    accent: "#10B981",
    accentBg: "rgba(16,185,129,0.07)",
    accentBorder: "rgba(16,185,129,0.22)",
    Icon: TrendingUp,
    stats: [
      { icon: TrendingUp, value: "105,7 T$", label: "PIB mondial 2025", delta: "+3,2% vs 2024" },
      { icon: TrendingUp, value: "19,53 T$", label: "PIB Chine 2025", delta: "+4,2% vs 2024" },
      { icon: TrendingUp, value: "28,6 T$", label: "Commerce mondial", delta: "+2,1% vs 2024" },
      { icon: Shield, value: "2,44 T$", label: "Dépenses militaires", delta: "Record 2024" },
    ],
  },
  {
    id: "politics",
    themeId: "politics",
    label: "Politique",
    title: "Décryptez les régimes politiques du monde",
    description:
      "Démocraties, dictatures, monarchies : suivez les orientations politiques et les transitions de chaque pays.",
    href: "/map/politics",
    accent: "#8B5CF6",
    accentBg: "rgba(139,92,246,0.07)",
    accentBorder: "rgba(139,92,246,0.22)",
    Icon: Vote,
    stats: [
      { icon: Vote, value: "44,8 %", label: "Population en démocratie", delta: "-0,8% vs 2024" },
      { icon: Vote, value: "72 pays", label: "En recul démocratique", delta: "Sur 167 évalués" },
      { icon: Vote, value: "18e", label: "Année de recul consécutif", delta: "EIU 2024" },
      { icon: Vote, value: "8,80", label: "Meilleur score (Allemagne)", delta: "Sur 10" },
    ],
  },
  {
    id: "epidemics",
    themeId: "epidemics",
    label: "Épidémies",
    title: "Comprenez les crises sanitaires mondiales",
    description:
      "Suivez comment les pandémies franchissent les frontières et redéfinissent les priorités de santé publique.",
    href: "/map/epidemics",
    accent: "#EF4444",
    accentBg: "rgba(239,68,68,0.07)",
    accentBorder: "rgba(239,68,68,0.22)",
    Icon: Activity,
    stats: [
      { icon: Activity, value: "7,04 M", label: "Décès COVID-19", delta: "Cumulatif" },
      { icon: Activity, value: "38,4 M", label: "Personnes vivant avec le VIH", delta: "Stable" },
      { icon: Activity, value: "8,10 Md", label: "Population mondiale", delta: "+0,9% vs 2024" },
      { icon: Activity, value: "73,4 ans", label: "Espérance de vie moyenne", delta: "+0,3 an vs 2024" },
    ],
  },
  {
    id: "military",
    themeId: "military",
    label: "Militaire",
    title: "Comparez les puissances militaires",
    description:
      "Budgets de défense, effectifs, arsenaux : appréhendez l'équilibre des forces à travers des données concrètes.",
    href: "/map/military",
    accent: "#F59E0B",
    accentBg: "rgba(245,158,11,0.07)",
    accentBorder: "rgba(245,158,11,0.22)",
    Icon: Shield,
    stats: [
      { icon: Shield, value: "2,44 T$", label: "Dépenses militaires mondiales", delta: "Record 2024" },
      { icon: Shield, value: "47", label: "Conflits armés actifs", delta: "+4 vs 2023" },
      { icon: Shield, value: "+6,8 %", label: "Croissance des budgets", delta: "Vs 2023" },
      { icon: Shield, value: "9", label: "Puissances nucléaires", delta: "Déclarées" },
    ],
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function ThemeStorySections() {
  return (
    <section
      style={{
        position: "relative",
        maxWidth: 1280,
        margin: "0 auto",
        padding: "0 clamp(16px, 3.5vw, 40px) clamp(60px, 8vh, 100px)",
      }}
    >
      {SECTIONS.map((s, i) => (
        <div
          key={s.id}
          style={{
            position: "sticky",
            top: "calc(var(--navbar-height) + clamp(10px, 2vh, 24px))",
            zIndex: i + 1,
            paddingTop: i === 0 ? 0 : "clamp(10px, 2vh, 24px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
              borderRadius: 26,
              overflow: "hidden",
              background: "#fff",
              border: "1.5px solid #F0F0F0",
              boxShadow: "0 20px 50px rgba(10,20,15,0.10)",
              minHeight: "clamp(430px, 60vh, 560px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)",
                gap: 0,
                flex: 1,
              }}
              className="story-grid"
            >
              {/* Left: mini map */}
              <div
                style={{
                  position: "relative",
                  minHeight: 220,
                  background: s.accentBg,
                }}
              >
                <MiniMap themeId={s.themeId} />
                <div
                  style={{
                    position: "absolute",
                    top: 18,
                    left: 18,
                    background: "#fff",
                    borderRadius: 14,
                    padding: "12px 16px",
                    boxShadow: "0 10px 26px rgba(10,20,15,0.14)",
                    border: `1px solid ${s.accentBorder}`,
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: s.accent,
                      marginBottom: 4,
                    }}
                  >
                    {s.stats[0].label}
                  </p>
                  <p
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 900,
                      color: "#0A0A0A",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {s.stats[0].value}
                  </p>
                  <p style={{ fontSize: "0.65rem", fontWeight: 600, color: s.accent }}>
                    {s.stats[0].delta}
                  </p>
                </div>
              </div>

              {/* Right: title + description */}
              <div
                style={{
                  padding: "clamp(28px, 4vw, 48px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: s.accent,
                      boxShadow: `0 0 8px ${s.accent}`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: s.accent,
                    }}
                  >
                    {s.label}
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
                  {s.title}
                </h2>
                <p
                  style={{
                    fontSize: "0.92rem",
                    color: "#6B6B6B",
                    lineHeight: 1.65,
                    marginBottom: 22,
                    maxWidth: 420,
                  }}
                >
                  {s.description}
                </p>
                <Link
                  href={s.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: s.accent,
                    textDecoration: "none",
                    width: "fit-content",
                  }}
                >
                  Explorer la carte {s.label.toLowerCase()} <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>

            {/* Stat strip */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                borderTop: "1px solid #F0F0F0",
              }}
              className="story-stats"
            >
              {s.stats.map((stat, si) => {
                const StatIcon = stat.icon;
                return (
                  <div
                    key={si}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "16px clamp(14px, 2vw, 22px)",
                      borderLeft: si === 0 ? "none" : "1px solid #F0F0F0",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 9,
                        background: s.accentBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <StatIcon size={14} style={{ color: s.accent }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 800,
                          color: "#0A0A0A",
                          letterSpacing: "-0.02em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {stat.value}
                      </p>
                      <p
                        style={{
                          fontSize: "0.65rem",
                          color: "#9B9B9B",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      ))}

      <style>{`
        @media (max-width: 720px) {
          .story-grid { grid-template-columns: 1fr !important; }
          .story-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

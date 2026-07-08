"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Shield, Activity, Vote, Globe, ArrowUpRight } from "lucide-react";

const METRICS = [
  {
    id: "gdp",
    title: "PIB mondial 2025",
    value: "$105T",
    change: "+3,2%",
    positive: true,
    color: "#10B981",
    bg: "rgba(16,185,129,0.06)",
    border: "rgba(16,185,129,0.20)",
    Icon: TrendingUp,
    detail: "Projections FMI · 195 pays",
    href: "/map/economy",
    cols: 2,
  },
  {
    id: "military",
    title: "Dépenses militaires",
    value: "2 443 Mds€",
    change: "+6,8%",
    positive: false,
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.20)",
    Icon: Shield,
    detail: "Record absolu · SIPRI 2024",
    href: "/map/military",
    cols: 1,
  },
  // Row 2 — three span-1 cards fill the row perfectly
  {
    id: "democracy",
    title: "Population en démocratie",
    value: "44,8%",
    change: "-0,8%",
    positive: false,
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.06)",
    border: "rgba(139,92,246,0.20)",
    Icon: Vote,
    detail: "18e recul consécutif · V-Dem",
    href: "/map/politics",
    cols: 1,
  },
  {
    id: "covid",
    title: "Décès COVID-19",
    value: "7,04M",
    change: "cumulatif",
    positive: null,
    color: "#EF4444",
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.20)",
    Icon: Activity,
    detail: "OMS · données 2020–2024",
    href: "/map/epidemics",
    cols: 1,
  },
  {
    id: "hiv",
    title: "Vivant avec le VIH",
    value: "38,4M",
    change: "stable",
    positive: null,
    color: "#EF4444",
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.20)",
    Icon: Activity,
    detail: "ONUSIDA 2024",
    href: "/map/epidemics",
    cols: 1,
  },
  // Row 3 — full-width banner
  {
    id: "decline",
    title: "Pays en recul démocratique",
    value: "72 pays",
    change: "sur 167 évalués",
    positive: null,
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.06)",
    border: "rgba(139,92,246,0.20)",
    Icon: Globe,
    detail: "EIU Democracy Index 2024",
    href: "/map/politics",
    cols: 3,
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function DashboardSection() {
  return (
    <section
      style={{
        background: "#FAFAFA",
        padding: "88px 24px 100px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ marginBottom: 52 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 10,
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 800,
                color: "#0A0A0A",
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
              }}
            >
              Tableau de bord mondial
            </h2>

            {/* Live badge */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "3px 10px",
                borderRadius: 100,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.22)",
                fontSize: "0.58rem",
                fontWeight: 700,
                color: "#EF4444",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              <motion.div
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#EF4444",
                  boxShadow: "0 0 6px rgba(239,68,68,0.8)",
                  flexShrink: 0,
                }}
              />
              Live
            </span>
          </div>

          <p style={{ fontSize: "0.92rem", color: "#6B6B6B", lineHeight: 1.6 }}>
            Données de référence — FMI, Banque mondiale, OMS, SIPRI, V-Dem 2024–2025
          </p>
        </motion.div>

        {/* Bento grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {METRICS.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
              style={{
                gridColumn: m.cols === 3 ? "span 3" : m.cols === 2 ? "span 2" : "span 1",
              }}
            >
              <Link
                href={m.href}
                style={{ textDecoration: "none", display: "block", height: "100%" }}
              >
                <div
                  className="dashboard-card"
                  style={{
                    padding: "28px",
                    borderRadius: 18,
                    background: "#fff",
                    border: `1.5px solid ${m.border}`,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                    transition: "all 0.22s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Top row: icon + arrow */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: 18,
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 11,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: m.bg,
                        border: `1px solid ${m.border}`,
                        flexShrink: 0,
                      }}
                    >
                      <m.Icon size={16} style={{ color: m.color }} />
                    </div>
                    <ArrowUpRight
                      size={14}
                      style={{ color: "#C4C4C4", flexShrink: 0 }}
                    />
                  </div>

                  {/* Title */}
                  <div
                    style={{
                      fontSize: "0.74rem",
                      color: "#9B9B9B",
                      fontWeight: 500,
                      marginBottom: 10,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {m.title}
                  </div>

                  {/* Value */}
                  <div
                    style={{
                      fontSize: "clamp(1.7rem, 3vw, 2.2rem)",
                      fontWeight: 900,
                      color: "#0A0A0A",
                      letterSpacing: "-0.03em",
                      lineHeight: 1.1,
                      marginBottom: 12,
                      flex: 1,
                    }}
                  >
                    {m.value}
                  </div>

                  {/* Change + detail */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    {m.positive !== null && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 3,
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: m.positive ? "#10B981" : "#EF4444",
                          background: m.positive
                            ? "rgba(16,185,129,0.09)"
                            : "rgba(239,68,68,0.09)",
                          padding: "2px 8px",
                          borderRadius: 100,
                        }}
                      >
                        {m.positive ? (
                          <TrendingUp size={10} />
                        ) : (
                          <TrendingDown size={10} />
                        )}
                        {m.change}
                      </span>
                    )}
                    {m.positive === null && (
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          color: "#9B9B9B",
                          background: "#F5F5F5",
                          padding: "2px 8px",
                          borderRadius: 100,
                        }}
                      >
                        {m.change}
                      </span>
                    )}
                    <span style={{ fontSize: "0.66rem", color: "#C4C4C4" }}>
                      {m.detail}
                    </span>
                  </div>

                  {/* Subtle colored accent bottom-right orb */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      bottom: -40,
                      right: -40,
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      background: `radial-gradient(circle, ${m.bg} 0%, transparent 70%)`,
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

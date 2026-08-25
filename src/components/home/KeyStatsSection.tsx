"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ── Live counter hook ── */
function useLiveCounter(
  target: number,
  intervalMs: number | null,
  triggered: boolean
) {
  const [value, setValue] = useState(0);
  const countRef = useRef(value);

  // Count-up animation when triggered
  useEffect(() => {
    if (!triggered) return;
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let step = 0;
    const id = setInterval(() => {
      step++;
      const next = step >= steps ? target : Math.round(increment * step);
      setValue(next);
      countRef.current = next;
      if (step >= steps) clearInterval(id);
    }, duration / steps);
    return () => clearInterval(id);
  }, [triggered, target]);

  // Live tick after count-up
  useEffect(() => {
    if (!triggered || intervalMs === null) return;
    const id = setInterval(() => {
      countRef.current += 1;
      setValue(countRef.current);
    }, intervalMs);
    return () => clearInterval(id);
  }, [triggered, intervalMs]);

  return value;
}

/* ── Stat card data ── */
interface StatDef {
  id: string;
  staticValue?: string;
  liveBase?: number;
  liveInterval?: number;
  label: string;
  delta: string;
  deltaUp: boolean;
  source: string;
  accent: string;
  href: string;
  isLive: boolean;
}

const STATS: StatDef[] = [
  {
    id: "pib",
    staticValue: "$105T",
    label: "PIB mondial 2025",
    delta: "+3,3% vs 2024",
    deltaUp: true,
    source: "FMI · Projections avril 2025",
    accent: "#10B981",
    href: "/map/economy",
    isLive: false,
  },
  {
    id: "population",
    liveBase: 8_200_000_000,
    liveInterval: 700,
    label: "Population mondiale",
    delta: "+80 millions cette année",
    deltaUp: true,
    source: "ONU · DESA · 2025",
    accent: "#3B82F6",
    href: "/map/epidemics",
    isLive: true,
  },
  {
    id: "militaire",
    staticValue: "$2,44T",
    label: "Dépenses militaires",
    delta: "Record absolu 2024",
    deltaUp: false,
    source: "SIPRI · 2024",
    accent: "#F59E0B",
    href: "/map/military",
    isLive: false,
  },
  {
    id: "naissances",
    liveBase: 0,
    liveInterval: 233,
    label: "Naissances depuis l'ouverture",
    delta: "+385k par jour dans le monde",
    deltaUp: true,
    source: "ONU · DESA · estimations 2025",
    accent: "#10B981",
    href: "/map/epidemics",
    isLive: true,
  },
  {
    id: "deces",
    liveBase: 0,
    liveInterval: 556,
    label: "Décès depuis l'ouverture",
    delta: "+164k par jour dans le monde",
    deltaUp: false,
    source: "OMS · estimations 2025",
    accent: "#EF4444",
    href: "/map/epidemics",
    isLive: true,
  },
  {
    id: "conflits",
    staticValue: "47",
    label: "Conflits armés actifs",
    delta: "+4 vs 2023",
    deltaUp: false,
    source: "UCDP · PRIO · 2024",
    accent: "#8B5CF6",
    href: "/map/military",
    isLive: false,
  },
];

function formatLiveValue(id: string, value: number): string {
  if (id === "population") {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(3).replace(".", ",")} Md`;
    return value.toLocaleString("fr-FR");
  }
  if (id === "naissances" || id === "deces") {
    return value.toLocaleString("fr-FR");
  }
  return value.toLocaleString("fr-FR");
}

function StatCard({ stat, triggered }: { stat: StatDef; triggered: boolean }) {
  const liveValue = useLiveCounter(
    stat.liveBase ?? 0,
    triggered && stat.isLive ? (stat.liveInterval ?? null) : null,
    triggered && stat.isLive
  );

  const displayValue = stat.isLive
    ? formatLiveValue(stat.id, liveValue)
    : (stat.staticValue ?? "-");

  return (
    <Link key={stat.id} href={stat.href} style={{ textDecoration: "none" }}>
      <div
        style={{
          padding: "26px 24px",
          borderRadius: 18,
          border: "1.5px solid #F0F0F0",
          background: "#fff",
          boxShadow: "0 4px 20px rgba(10,20,15,0.05)",
          transition: "all 0.22s ease",
          cursor: "pointer",
          height: "100%",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = `${stat.accent}45`;
          el.style.boxShadow = `0 14px 34px rgba(10,20,15,0.11), 0 0 0 1px ${stat.accent}22`;
          el.style.transform = "translateY(-5px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "#F0F0F0";
          el.style.boxShadow = "0 4px 20px rgba(10,20,15,0.05)";
          el.style.transform = "translateY(0)";
        }}
      >
        {/* Accent bar + live dot */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <div
            style={{
              width: 28,
              height: 3,
              borderRadius: 100,
              background: stat.accent,
              boxShadow: `0 0 8px ${stat.accent}60`,
              flexShrink: 0,
            }}
          />
          {stat.isLive && (
            <span
              style={{
                fontSize: "0.48rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: stat.accent,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: stat.accent,
                  display: "inline-block",
                  animation: "pulse-dot 1.8s ease-in-out infinite",
                }}
              />
              Live
            </span>
          )}
        </div>

        {/* Value */}
        <div
          style={{
            fontSize: stat.isLive && stat.id !== "population"
              ? "clamp(1.4rem, 2.2vw, 2rem)"
              : "clamp(1.7rem, 2.6vw, 2.4rem)",
            fontWeight: 900,
            color: "#0A0A0A",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            marginBottom: 8,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {displayValue}
        </div>

        {/* Label */}
        <p
          style={{
            fontSize: "0.82rem",
            fontWeight: 600,
            color: "#3A3A3A",
            marginBottom: 8,
            lineHeight: 1.3,
          }}
        >
          {stat.label}
        </p>

        {/* Delta */}
        <p
          style={{
            fontSize: "0.68rem",
            fontWeight: 600,
            color: stat.deltaUp ? "#10B981" : "#EF4444",
            marginBottom: 12,
          }}
        >
          {stat.delta}
        </p>

        {/* Source */}
        <p style={{ fontSize: "0.62rem", color: "#C4C4C4", lineHeight: 1.4 }}>
          {stat.source}
        </p>
      </div>
    </Link>
  );
}

export function KeyStatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#fafbfb",
        borderTop: "1px solid #F0F0F0",
        borderBottom: "1px solid #F0F0F0",
        padding: "clamp(48px, 7vh, 80px) 0",
      }}
    >
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 56px)",
        }}
      >
        {/* Section header */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: "clamp(32px, 5vh, 52px)",
            gap: 16,
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#39FF88",
                marginBottom: 10,
              }}
            >
              EN TEMPS RÉEL
            </p>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
                fontWeight: 900,
                color: "#0A0A0A",
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
              }}
            >
              Le monde{" "}
              <em
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontStyle: "italic",
                  fontWeight: 700,
                  background: "linear-gradient(125deg, #39FF88 0%, #10B981 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                en chiffres,
              </em>{" "}
              à l&apos;instant
            </h2>
          </div>
          <p
            style={{
              fontSize: "0.72rem",
              color: "#9B9B9B",
              lineHeight: 1.6,
              maxWidth: 240,
              textAlign: "right",
            }}
          >
            Indicateurs mis à jour en temps réel à partir des sources FMI, ONU, SIPRI et UCDP.
          </p>
        </div>

        {/* Stats grid — 3 cols on desktop, 2 on tablet, 1 on mobile */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          {STATS.map((stat) => (
            <StatCard key={stat.id} stat={stat} triggered={triggered} />
          ))}
        </div>
      </div>
    </section>
  );
}

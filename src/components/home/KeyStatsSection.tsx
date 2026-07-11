"use client";

import Link from "next/link";

const STATS = [
  {
    value: "$105T",
    label: "PIB mondial 2025",
    delta: "+3,3% vs 2024",
    deltaUp: true,
    source: "FMI · Projections avril 2025",
    accent: "#10B981",
    href: "/map/economy",
  },
  {
    value: "8,1Md",
    label: "Habitants sur Terre",
    delta: "+80M cette année",
    deltaUp: true,
    source: "ONU · DESA · 2024",
    accent: "#3B82F6",
    href: "/map/epidemics",
  },
  {
    value: "44,8%",
    label: "Population en démocratie",
    delta: "−18e recul consécutif",
    deltaUp: false,
    source: "V-Dem Institute · 2024",
    accent: "#8B5CF6",
    href: "/map/politics",
  },
  {
    value: "2 443 Md€",
    label: "Dépenses militaires mondiales",
    delta: "Record absolu 2024",
    deltaUp: false,
    source: "SIPRI · 2024",
    accent: "#F59E0B",
    href: "/map/military",
  },
];

export function KeyStatsSection() {
  return (
    <section
      style={{
        background: "#fff",
        borderTop: "1px solid #F0F0F0",
        borderBottom: "1px solid #F0F0F0",
        padding: "clamp(48px, 7vh, 80px) 0",
      }}
    >
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
              § 01 — Données mondiales
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
                en chiffres
              </em>
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
            Indicateurs clés mis à jour en temps réel à partir des sources FMI, ONU, SIPRI et V-Dem.
          </p>
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {STATS.map((stat) => (
            <Link key={stat.label} href={stat.href} style={{ textDecoration: "none" }}>
              <div
                style={{
                  padding: "28px 26px",
                  borderRadius: 18,
                  border: "1.5px solid #F0F0F0",
                  background: "#FAFAFA",
                  transition: "all 0.22s ease",
                  cursor: "pointer",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = `${stat.accent}45`;
                  el.style.background = "#fff";
                  el.style.boxShadow = `0 4px 24px ${stat.accent}18`;
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "#F0F0F0";
                  el.style.background = "#FAFAFA";
                  el.style.boxShadow = "none";
                  el.style.transform = "translateY(0)";
                }}
              >
                {/* Accent bar */}
                <div
                  style={{
                    width: 28,
                    height: 3,
                    borderRadius: 100,
                    background: stat.accent,
                    marginBottom: 20,
                    boxShadow: `0 0 8px ${stat.accent}60`,
                  }}
                />

                {/* Value */}
                <div
                  style={{
                    fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                    fontWeight: 900,
                    color: "#0A0A0A",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {stat.value}
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
          ))}
        </div>
      </div>
    </section>
  );
}

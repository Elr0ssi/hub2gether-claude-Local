"use client";

import dynamic from "next/dynamic";
import { Globe2, Landmark, Users, PieChart } from "lucide-react";

const InteractiveGlobeIcons = dynamic(
  () => import("@/components/globe/InteractiveGlobeIcons"),
  { ssr: false, loading: () => null }
);

interface StatDef {
  id: string;
  icon: typeof Globe2;
  label: string;
  value: string;
  delta: string;
}

const STATS: StatDef[] = [
  { id: "pib", icon: Globe2, label: "PIB mondial", value: "105,7 T$", delta: "+3,2% vs 2024" },
  { id: "dettes", icon: Landmark, label: "Dettes mondiales", value: "315,4 T$", delta: "+4,7% vs 2024" },
  { id: "population", icon: Users, label: "Population mondiale", value: "8,10 Md", delta: "+0,9% vs 2024" },
  { id: "commerce", icon: PieChart, label: "Commerce mondial", value: "28,6 T$", delta: "+2,1% vs 2024" },
];

export function HeroGlobePreview() {
  return (
    <section style={{ background: "#fff", overflow: "hidden" }}>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "clamp(56px, 9vh, 96px) clamp(20px, 5vw, 56px) 0",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            fontWeight: 900,
            color: "#0A0A0A",
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          Explorez le monde
          <br />
          <span
            style={{
              background: "linear-gradient(125deg, #39FF88 0%, #10B981 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            en données
          </span>
        </h1>
        <p
          style={{
            marginTop: 20,
            fontSize: "clamp(0.85rem, 1.1vw, 1rem)",
            color: "#6B6B6B",
            maxWidth: 480,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.6,
          }}
        >
          Données géopolitiques mondiales, comparables et actualisées en temps réel.
        </p>
      </div>

      {/* Globe stage */}
      <div
        style={{
          position: "relative",
          width: "min(680px, 92vw)",
          aspectRatio: "1 / 1",
          margin: "clamp(20px, 3vh, 40px) auto 0",
        }}
      >
        {/* Soft ground shadow beneath the globe */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "2%",
            transform: "translateX(-50%)",
            width: "72%",
            height: "10%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(16,24,20,0.16) 0%, transparent 72%)",
            filter: "blur(4px)",
          }}
        />
        <InteractiveGlobeIcons />
      </div>

      {/* Stat cards */}
      <div
        style={{
          maxWidth: 1120,
          margin: "clamp(28px, 5vh, 56px) auto 0",
          padding: "0 clamp(20px, 4vw, 56px) clamp(56px, 8vh, 88px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 18,
        }}
      >
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              style={{
                padding: "26px 22px",
                borderRadius: 18,
                border: "1.5px solid #F0F0F0",
                background: "#fff",
                boxShadow: "0 4px 20px rgba(10,20,15,0.05)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "rgba(16,185,129,0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                }}
              >
                <Icon size={20} color="#10B981" strokeWidth={2.2} />
              </div>
              <p style={{ fontSize: "0.8rem", color: "#3A3A3A", fontWeight: 600, marginBottom: 10 }}>
                {stat.label}
              </p>
              <p
                style={{
                  fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)",
                  fontWeight: 900,
                  color: "#0A0A0A",
                  letterSpacing: "-0.03em",
                  marginBottom: 8,
                }}
              >
                {stat.value}
              </p>
              <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "#10B981" }}>{stat.delta}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

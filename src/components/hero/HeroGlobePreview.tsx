"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Title fades out early as the user starts scrolling.
  const titleOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0], { clamp: true });
  const titleY = useTransform(scrollYProgress, [0, 0.3], [0, -40], { clamp: true });

  // Globe sinks down + shrinks slightly as the stats panel rises to meet it.
  const globeY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"], { clamp: true });
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 0.88], { clamp: true });

  // Stats panel slides up from below the fold and settles near the bottom, covering the globe's lower half.
  const statsY = useTransform(scrollYProgress, [0.1, 0.85], ["62%", "0%"], { clamp: true });
  const statsOpacity = useTransform(scrollYProgress, [0.1, 0.32], [0, 1], { clamp: true });

  return (
    <div ref={wrapperRef} style={{ height: "185vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: "var(--navbar-height)",
          height: "calc(100vh - var(--navbar-height))",
          overflow: "hidden",
          background: "#fff",
        }}
      >
        {/* Title + subtitle */}
        <motion.div
          style={{
            position: "absolute",
            top: "clamp(28px, 6vh, 64px)",
            left: 0,
            right: 0,
            textAlign: "center",
            padding: "0 clamp(20px, 5vw, 56px)",
            zIndex: 2,
            opacity: titleOpacity,
            y: titleY,
          }}
        >
          <h1
            style={{
              fontSize: "clamp(2.2rem, 5.4vw, 3.6rem)",
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
              marginTop: 16,
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
        </motion.div>

        {/* Globe stage */}
        <motion.div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            x: "-50%",
            y: globeY,
            scale: globeScale,
            width: "min(640px, 78vw)",
            aspectRatio: "1 / 1",
            zIndex: 1,
          }}
        >
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
        </motion.div>

        {/* Stats panel — rises from below and covers the globe's lower half */}
        <motion.div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            y: statsY,
            opacity: statsOpacity,
            zIndex: 3,
            padding: "clamp(20px, 4vh, 40px) clamp(20px, 4vw, 56px) clamp(24px, 4vh, 44px)",
            background:
              "linear-gradient(to bottom, transparent 0%, #fff 22%, #fff 100%)",
          }}
        >
          <div
            style={{
              maxWidth: 1120,
              margin: "0 auto",
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
                    padding: "24px 22px",
                    borderRadius: 18,
                    border: "1.5px solid #F0F0F0",
                    background: "#fff",
                    boxShadow: "0 4px 20px rgba(10,20,15,0.05)",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "rgba(16,185,129,0.10)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                    }}
                  >
                    <Icon size={18} color="#10B981" strokeWidth={2.2} />
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "#3A3A3A", fontWeight: 600, marginBottom: 8 }}>
                    {stat.label}
                  </p>
                  <p
                    style={{
                      fontSize: "clamp(1.3rem, 2.2vw, 1.75rem)",
                      fontWeight: 900,
                      color: "#0A0A0A",
                      letterSpacing: "-0.03em",
                      marginBottom: 6,
                    }}
                  >
                    {stat.value}
                  </p>
                  <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "#10B981" }}>{stat.delta}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

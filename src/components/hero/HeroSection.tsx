"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { COUNTRIES, type CountryEntry } from "@/data/countryData";

const GlobeCanvas = dynamic(() => import("@/components/globe/GlobeCanvas"), {
  ssr: false,
  loading: () => null,
});

const THEMES = [
  {
    id: "pib",
    label: "PIB",
    accent: "#10B981",
    textDark: false,
    stat: "$105T de PIB mondial",
    source: "FMI · 195 pays · 2025",
    href: "/map/economy",
  },
  {
    id: "chomage",
    label: "Chômage",
    accent: "#F59E0B",
    textDark: true,
    stat: "~5% de chômage moyen",
    source: "OIT · données 2024",
    href: "/map/economy",
  },
  {
    id: "politique",
    label: "Politique",
    accent: "#8B5CF6",
    textDark: false,
    stat: "44,8% en démocratie",
    source: "V-Dem · 18e recul consécutif",
    href: "/map/politics",
  },
  {
    id: "demographie",
    label: "Démographie",
    accent: "#3B82F6",
    textDark: false,
    stat: "8,1 milliards d'habitants",
    source: "ONU · DESA · 2024",
    href: "/map/economy",
  },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  const [activeThemeId, setActiveThemeId] = useState<ThemeId>("pib");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const activeTheme = THEMES.find((t) => t.id === activeThemeId)!;

  const handleCountryClick = useCallback(
    (name: string | null, _x: number, _y: number) => {
      setSelectedCountry(name || null);
    },
    []
  );

  const countryEntry = selectedCountry ? COUNTRIES[selectedCountry] : null;

  return (
    <div
      className="hero-section-wrapper"
      style={{ background: "#F8FAFB", display: "flex", flexDirection: "column" }}
    >
      {/* ── Top: title + theme tabs ── */}
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: EASE }}
        style={{ padding: "clamp(20px, 3vh, 36px) clamp(20px, 4vw, 56px) 0" }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#39FF88",
            marginBottom: 10,
          }}
        >
          The Essential Data
        </p>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(1.65rem, 3.2vw, 3rem)",
            fontWeight: 900,
            color: "#0A0A0A",
            letterSpacing: "-0.04em",
            lineHeight: 1.07,
            marginBottom: 6,
          }}
        >
          Explorez le monde{" "}
          <span
            style={{
              background: "linear-gradient(125deg, #39FF88 0%, #10B981 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            depuis les étoiles
          </span>
        </h1>

        <p
          style={{
            fontSize: "0.82rem",
            color: "#6B6B6B",
            marginBottom: "clamp(14px, 2vh, 22px)",
          }}
        >
          Cliquez sur un pays pour explorer ses données géopolitiques
        </p>

        {/* Theme tabs + global stat */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveThemeId(t.id)}
              style={{
                padding: "7px 18px",
                borderRadius: 100,
                border: `1.5px solid ${activeThemeId === t.id ? t.accent : "#E0E0E0"}`,
                background: activeThemeId === t.id ? t.accent : "#fff",
                color:
                  activeThemeId === t.id
                    ? t.textDark
                      ? "#000"
                      : "#fff"
                    : "#6B6B6B",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                outline: "none",
                whiteSpace: "nowrap",
                boxShadow:
                  activeThemeId === t.id
                    ? `0 0 12px ${t.accent}44`
                    : "none",
              }}
            >
              {t.label}
            </button>
          ))}

          {/* Active theme global stat */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeThemeId}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.22 }}
              style={{
                marginLeft: 8,
                display: "flex",
                alignItems: "baseline",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: activeTheme.accent,
                }}
              >
                {activeTheme.stat}
              </span>
              <span style={{ fontSize: "0.64rem", color: "#C4C4C4" }}>
                {activeTheme.source}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Globe fills remaining space ── */}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <GlobeCanvas theme={activeThemeId} onCountryClick={handleCountryClick} />

        {/* ── Country info panel ── */}
        <AnimatePresence>
          {selectedCountry && countryEntry && (
            <CountryPanel
              key={selectedCountry}
              name={selectedCountry}
              entry={countryEntry}
              activeTheme={activeTheme}
              onClose={() => setSelectedCountry(null)}
            />
          )}
        </AnimatePresence>

        {/* Hint: no country selected */}
        <AnimatePresence>
          {!selectedCountry && (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              style={{
                position: "absolute",
                bottom: 18,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "0.63rem",
                color: "#C4C4C4",
                letterSpacing: "0.05em",
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}
            >
              Cliquez sur un pays · Glissez pour tourner
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Country info panel ── */
interface CountryPanelProps {
  name: string;
  entry: CountryEntry;
  activeTheme: (typeof THEMES)[number];
  onClose: () => void;
}

function CountryPanel({ name, entry, activeTheme, onClose }: CountryPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.96 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "absolute",
        right: 24,
        bottom: 28,
        width: 288,
        background: "#fff",
        borderRadius: 20,
        border: "1.5px solid #EBEBEB",
        boxShadow: "0 8px 48px rgba(0,0,0,0.13)",
        overflow: "hidden",
        zIndex: 20,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px 12px",
          borderBottom: "1px solid #F2F2F2",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div>
          <p
            style={{
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#C4C4C4",
              marginBottom: 3,
            }}
          >
            Données du pays
          </p>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              color: "#0A0A0A",
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
            }}
          >
            {name}
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{
            flexShrink: 0,
            background: "#F5F5F5",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            padding: "5px 6px",
            color: "#9B9B9B",
            display: "flex",
            marginTop: 2,
            transition: "background 0.15s",
          }}
        >
          <X size={13} />
        </button>
      </div>

      {/* Data rows */}
      <div style={{ padding: "10px 14px" }}>
        {entry.economy && (
          <DataRow
            label="PIB"
            value={entry.economy.gdp}
            sub={
              entry.economy.rank
                ? `#${entry.economy.rank} mondial${entry.economy.gdpPC ? ` · ${entry.economy.gdpPC}/hab.` : ""}`
                : entry.economy.gdpPC
                ? `${entry.economy.gdpPC} par habitant`
                : undefined
            }
            accent="#10B981"
            active={activeTheme.id === "pib"}
          />
        )}
        {entry.chomage && (
          <DataRow
            label="Chômage"
            value={entry.chomage.rate}
            accent="#F59E0B"
            active={activeTheme.id === "chomage"}
          />
        )}
        {entry.politics && (
          <DataRow
            label="Régime politique"
            value={entry.politics.regime}
            sub={
              entry.politics.score != null
                ? `Score V-Dem : ${entry.politics.score.toFixed(2)} / 10`
                : undefined
            }
            accent="#8B5CF6"
            active={activeTheme.id === "politique"}
          />
        )}
        {entry.demographie && (
          <DataRow
            label="Population"
            value={entry.demographie.population}
            accent="#3B82F6"
            active={activeTheme.id === "demographie"}
          />
        )}
      </div>

      {/* CTA */}
      <div
        style={{
          padding: "6px 14px 14px",
          borderTop: "1px solid #F5F5F5",
          marginTop: 2,
        }}
      >
        <Link
          href={activeTheme.href}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: "0.71rem",
            fontWeight: 600,
            color: activeTheme.accent,
            textDecoration: "none",
            paddingTop: 6,
          }}
        >
          Explorer la carte complète <ArrowRight size={11} />
        </Link>
      </div>
    </motion.div>
  );
}

/* ── Single data row ── */
function DataRow({
  label,
  value,
  sub,
  accent,
  active,
}: {
  label: string;
  value: string;
  sub?: string;
  accent: string;
  active: boolean;
}) {
  return (
    <div
      style={{
        padding: "8px 10px",
        borderRadius: 10,
        marginBottom: 4,
        background: active ? `${accent}14` : "transparent",
        border: `1px solid ${active ? `${accent}30` : "transparent"}`,
        transition: "all 0.25s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: "0.62rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: active ? accent : "#9B9B9B",
            flexShrink: 0,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: "0.86rem",
            fontWeight: 700,
            color: active ? "#0A0A0A" : "#3A3A3A",
            letterSpacing: "-0.01em",
            textAlign: "right",
          }}
        >
          {value}
        </span>
      </div>
      {sub && (
        <p style={{ fontSize: "0.6rem", color: "#B4B4B4", marginTop: 2 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

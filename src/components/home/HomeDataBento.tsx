"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Shield, Activity, Vote, ArrowUpRight } from "lucide-react";

const CARDS = [
  {
    theme: "Économie",
    href: "/map/economy",
    Icon: TrendingUp,
    accentColor: "#10B981",
    accentBg: "rgba(16,185,129,0.07)",
    accentBorder: "rgba(16,185,129,0.22)",
    value: "$105T",
    label: "PIB mondial cumulé 2025",
    sub: "Projections FMI · 195 pays analysés",
    span: "lg:col-span-2",
  },
  {
    theme: "Militaire",
    href: "/map/military",
    Icon: Shield,
    accentColor: "#F59E0B",
    accentBg: "rgba(245,158,11,0.07)",
    accentBorder: "rgba(245,158,11,0.22)",
    value: "2 443 Mds€",
    label: "Dépenses militaires mondiales",
    sub: "Record absolu · SIPRI 2024",
    span: "lg:col-span-1",
  },
  {
    theme: "Politique",
    href: "/map/politics",
    Icon: Vote,
    accentColor: "#8B5CF6",
    accentBg: "rgba(139,92,246,0.07)",
    accentBorder: "rgba(139,92,246,0.22)",
    value: "44,8 %",
    label: "Population en démocratie",
    sub: "18e année de recul consécutif · EIU 2024",
    span: "lg:col-span-1",
  },
  {
    theme: "Épidémies",
    href: "/map/epidemics",
    Icon: Activity,
    accentColor: "#EF4444",
    accentBg: "rgba(239,68,68,0.07)",
    accentBorder: "rgba(239,68,68,0.22)",
    value: "7,04M",
    label: "Décès COVID-19 confirmés",
    sub: "OMS · données cumulées 2020–2024",
    span: "lg:col-span-1",
  },
  {
    theme: "Politique",
    href: "/map/politics",
    Icon: Vote,
    accentColor: "#8B5CF6",
    accentBg: "rgba(139,92,246,0.07)",
    accentBorder: "rgba(139,92,246,0.22)",
    value: "72 pays",
    label: "En recul démocratique",
    sub: "Sur 167 évalués par l'EIU en 2024",
    span: "lg:col-span-2",
  },
];

export function HomeDataBento() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Header */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="section-title mb-3">Données en temps réel</p>
        <h2 className="text-heading-1 mb-3" style={{ color: "var(--ink)" }}>
          Le monde en chiffres essentiels
        </h2>
        <p className="text-body" style={{ maxWidth: "480px", color: "var(--ink-3)" }}>
          Les indicateurs qui structurent l'actualité géopolitique — économie,
          défense, démocratie, santé. Cliquez pour explorer la carte interactive.
        </p>
      </motion.div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((card, i) => (
          <motion.div
            key={i}
            className={card.span}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href={card.href} className="block h-full group">
              <div
                className="relative h-full rounded-2xl p-6 flex flex-col gap-4 overflow-hidden transition-all duration-300"
                style={{
                  background: card.accentBg,
                  border: `1px solid ${card.accentBorder}`,
                  minHeight: "180px",
                }}
              >
                {/* Hover radial glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse 70% 60% at 20% 30%, ${card.accentBg.replace("0.07", "0.15")} 0%, transparent 70%)`,
                  }}
                />

                {/* Top row: badge + icon */}
                <div className="flex items-center justify-between relative">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{
                      background: `${card.accentBg.replace("0.07", "0.18")}`,
                      border: `1px solid ${card.accentBorder}`,
                      color: card.accentColor,
                    }}
                  >
                    {card.theme}
                  </span>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `${card.accentBg.replace("0.07", "0.15")}`,
                      border: `1px solid ${card.accentBorder}`,
                    }}
                  >
                    <card.Icon size={17} style={{ color: card.accentColor }} />
                  </div>
                </div>

                {/* Big number */}
                <div className="relative flex-1">
                  <p
                    className="font-black leading-none mb-2"
                    style={{
                      fontSize: "clamp(2rem, 4vw, 2.75rem)",
                      color: "var(--ink)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {card.value}
                  </p>
                  <p className="text-sm font-semibold mb-1" style={{ color: "var(--ink-2)" }}>
                    {card.label}
                  </p>
                  <p className="text-caption" style={{ color: "var(--ink-4)" }}>
                    {card.sub}
                  </p>
                </div>

                {/* CTA arrow */}
                <div
                  className="relative flex items-center gap-1 text-xs font-semibold transition-all duration-200 group-hover:gap-2"
                  style={{ color: card.accentColor }}
                >
                  Explorer la carte
                  <ArrowUpRight
                    size={13}
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

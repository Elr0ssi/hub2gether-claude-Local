"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, TrendingUp, Swords, Shield, Activity, ArrowRight, Lock, Sparkles } from "lucide-react";
import type { Theme } from "@/types";

const ICONS: Record<string, React.ElementType> = {
  Crown,
  TrendingUp,
  Swords,
  Shield,
  Activity,
};

const THEME_PREVIEWS: Record<string, { stat: string; statLabel: string; color: string }> = {
  empires: { stat: "6 empires", statLabel: "50+ périodes historiques", color: "#0D7A40" },
  economy: { stat: "195 pays", statLabel: "PIB 2025 en temps réel", color: "#0D7A40" },
  epidemics: { stat: "12 épidémies", statLabel: "De la Peste Noire au COVID", color: "#0D7A40" },
  military: { stat: "Bientôt", statLabel: "Conflits mondiaux", color: "var(--ink-4)" },
  mortality: { stat: "Bientôt", statLabel: "Données de mortalité", color: "var(--ink-4)" },
};

interface ThemePreviewGridProps {
  themes: Theme[];
}

export function ThemePreviewGrid({ themes }: ThemePreviewGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Section header */}
      <div className="text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-title mb-3">Explorer par thème</p>
          <h2 className="text-heading-1 mb-4" style={{ color: "var(--ink)" }}>
            Quatre grandes lectures du monde
          </h2>
          <p className="text-body mx-auto" style={{ maxWidth: "520px", color: "var(--ink-3)" }}>
            Chaque thème offre un prisme analytique distinct pour comprendre
            comment le monde s&apos;est construit — et comment il fonctionne aujourd&apos;hui.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {themes.filter((t) => !t.hidden).map((theme, i) => {
          const Icon = ICONS[theme.icon] ?? Crown;
          const preview = THEME_PREVIEWS[theme.id];

          return (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              {theme.available ? (
                <Link href={`/map/${theme.slug}`} className="block h-full group">
                  <div
                    className="h-full rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 relative overflow-hidden"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      minHeight: "200px",
                    }}
                  >
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: "radial-gradient(ellipse 70% 60% at 30% 40%, rgba(57,255,136,0.06) 0%, transparent 70%)",
                      }}
                    />

                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: "var(--accent-dim)",
                        border: "1px solid var(--accent-border)",
                      }}
                    >
                      <Icon size={19} style={{ color: "#0D7A40" }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-heading-3 mb-1.5" style={{ color: "var(--ink)" }}>
                        {theme.label}
                      </h3>
                      <p className="text-small leading-relaxed" style={{ color: "var(--ink-3)" }}>
                        {theme.description}
                      </p>
                    </div>

                    {/* Stats mini */}
                    {preview && (
                      <div
                        className="rounded-lg px-3 py-2"
                        style={{ background: "var(--surface-2)", border: "1px solid var(--border-light)" }}
                      >
                        <p className="text-xs font-bold" style={{ color: preview.color }}>
                          {preview.stat}
                        </p>
                        <p className="text-caption">{preview.statLabel}</p>
                      </div>
                    )}

                    {/* CTA */}
                    <div
                      className="flex items-center gap-1 text-xs font-semibold transition-all duration-200 group-hover:gap-2"
                      style={{ color: "#0D7A40" }}
                    >
                      Explorer
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              ) : (
                <div
                  className="h-full rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    minHeight: "200px",
                    opacity: 0.6,
                  }}
                >
                  {/* Coming soon badge */}
                  <div
                    className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      background: "var(--surface-2)",
                      color: "var(--ink-4)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <Lock size={9} />
                    {theme.comingSoonLabel ?? "Bientôt"}
                  </div>

                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                  >
                    <Icon size={19} style={{ color: "var(--ink-4)" }} />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-heading-3 mb-1.5" style={{ color: "var(--ink-2)" }}>
                      {theme.label}
                    </h3>
                    <p className="text-small leading-relaxed" style={{ color: "var(--ink-3)" }}>
                      {theme.description}
                    </p>
                  </div>

                  {preview && (
                    <div
                      className="rounded-lg px-3 py-2"
                      style={{ background: "var(--surface-2)", border: "1px solid var(--border-light)" }}
                    >
                      <p className="text-xs font-bold" style={{ color: "var(--ink-4)" }}>
                        {preview.stat}
                      </p>
                      <p className="text-caption">{preview.statLabel}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA strip */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
          style={{
            background: "var(--accent-dim)",
            border: "1px solid var(--accent-border)",
            color: "#0D7A40",
          }}
        >
          <Sparkles size={12} />
          Nouvelles thématiques en développement — économie mondiale, conflits armés, mortalité
        </div>
      </motion.div>
    </section>
  );
}

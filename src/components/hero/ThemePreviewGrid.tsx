"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, TrendingUp, Swords, Shield, Activity, ArrowRight, Lock } from "lucide-react";
import type { Theme } from "@/types";

const ICONS: Record<string, React.ElementType> = {
  Crown,
  TrendingUp,
  Swords,
  Shield,
  Activity,
};

interface ThemePreviewGridProps {
  themes: Theme[];
}

export function ThemePreviewGrid({ themes }: ThemePreviewGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <p className="section-title mb-3">Explore by theme</p>
        <h2 className="text-heading-1" style={{ color: "var(--ink)" }}>
          Five lenses on global power
        </h2>
        <p className="text-body mt-3 mx-auto" style={{ maxWidth: "480px" }}>
          Each theme gives you a different analytical framework for understanding
          how the world works — historically and today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {themes.map((theme, i) => {
          const Icon = ICONS[theme.icon] ?? Crown;

          return (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {theme.available ? (
                <Link href={`/map/${theme.slug}`} className="block h-full">
                  <div
                    className="card-hover h-full p-5 flex flex-col gap-3 group"
                    style={{ minHeight: "180px" }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: "var(--accent-dim)", border: "1px solid var(--accent-border)" }}
                    >
                      <Icon size={18} style={{ color: "#0D7A40" }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-heading-3 mb-1.5" style={{ color: "var(--ink)" }}>
                        {theme.label}
                      </h3>
                      <p className="text-small leading-relaxed">{theme.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "#0D7A40" }}>
                      Explore
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              ) : (
                <div
                  className="card h-full p-5 flex flex-col gap-3 relative overflow-hidden"
                  style={{ minHeight: "180px", opacity: 0.7 }}
                >
                  {/* Coming soon overlay */}
                  <div
                    className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      background: "var(--surface-2)",
                      color: "var(--ink-4)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <Lock size={10} />
                    {theme.comingSoonLabel ?? "Soon"}
                  </div>

                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                  >
                    <Icon size={18} style={{ color: "var(--ink-4)" }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-heading-3 mb-1.5" style={{ color: "var(--ink-2)" }}>
                      {theme.label}
                    </h3>
                    <p className="text-small leading-relaxed">{theme.description}</p>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

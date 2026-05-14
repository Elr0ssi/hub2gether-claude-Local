"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, TrendingUp, Percent, Users, Building2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { EconomyMetricId } from "@/types";
import { ECONOMY_METRICS, ECONOMY_YEARS } from "@/data/economy/economy";
import type { CountryEconomyData } from "@/types";

interface EconomySidePanelProps {
  countryName: string | null;
  yearData: { year: number; countries: Record<string, CountryEconomyData> } | undefined;
  metric: EconomyMetricId;
  open: boolean;
  onClose: () => void;
}

function fmt(v: number, metric: EconomyMetricId): string {
  if (metric === "gdp") return `${v.toLocaleString("fr-FR")} Mds$`;
  if (metric === "companies") return `${v.toLocaleString("fr-FR")} k`;
  return `${v.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`;
}

const METRIC_ICONS: Record<EconomyMetricId, React.ElementType> = {
  gdp: TrendingUp,
  debt_ratio: Percent,
  unemployment: Users,
  companies: Building2,
};

export function EconomySidePanel({ countryName, yearData, metric, open, onClose }: EconomySidePanelProps) {
  const [showCompanies, setShowCompanies] = useState(false);
  const data = countryName && yearData ? yearData.countries[countryName] : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden flex-shrink-0"
          style={{ borderLeft: "1px solid var(--border)", background: "var(--surface)" }}
        >
          <div className="w-[300px] h-full overflow-y-auto">
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 sticky top-0"
              style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)", zIndex: 10 }}
            >
              <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>
                {countryName ?? "Sélection"}
              </span>
              <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
                <X size={14} />
              </button>
            </div>

            {/* Content */}
            {!countryName || !data ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
                <TrendingUp size={28} style={{ color: "var(--ink-4)" }} />
                <p className="text-sm" style={{ color: "var(--ink-3)" }}>
                  Cliquez sur un pays pour voir ses données économiques
                </p>
              </div>
            ) : (
              <div className="px-4 py-4 flex flex-col gap-5">
                {/* Year */}
                <p className="text-xs" style={{ color: "var(--ink-4)" }}>
                  Données {yearData?.year}
                </p>

                {/* Metrics grid */}
                <div className="flex flex-col gap-2">
                  {ECONOMY_METRICS.map((m) => {
                    const Icon = METRIC_ICONS[m.id];
                    const v = data[m.id] as number;
                    const isActive = m.id === metric;
                    return (
                      <div
                        key={m.id}
                        className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl"
                        style={{
                          background: isActive ? "var(--accent-dim)" : "var(--surface-2)",
                          border: isActive ? "1px solid rgba(57,255,136,0.3)" : "1px solid var(--border)",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Icon size={13} style={{ color: isActive ? "#0D7A40" : "var(--ink-3)" }} />
                          <span className="text-xs font-medium" style={{ color: isActive ? "#0D7A40" : "var(--ink-2)" }}>
                            {m.label}
                          </span>
                        </div>
                        <span className="text-xs font-bold tabular-nums" style={{ color: isActive ? "#0D7A40" : "var(--ink)" }}>
                          {fmt(v, m.id)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Trend across years */}
                <div>
                  <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>
                    Évolution — {ECONOMY_METRICS.find((m) => m.id === metric)?.label}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {ECONOMY_YEARS.map((yr) => {
                      const d = yr.countries[countryName];
                      if (!d) return null;
                      const v = d[metric] as number;
                      const isCurrentYear = yr.year === yearData?.year;
                      return (
                        <div key={yr.year} className="flex items-center justify-between gap-2">
                          <span
                            className="text-xs"
                            style={{ color: isCurrentYear ? "#0D7A40" : "var(--ink-3)", fontWeight: isCurrentYear ? 700 : 400, minWidth: 36 }}
                          >
                            {yr.year}
                          </span>
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min((v / (getMaxForTrend(countryName, metric))) * 100, 100)}%`,
                                background: isCurrentYear ? "#39FF88" : "var(--ink-4)",
                                transition: "width 0.4s ease",
                              }}
                            />
                          </div>
                          <span className="text-xs tabular-nums text-right" style={{ color: isCurrentYear ? "#0D7A40" : "var(--ink-3)", minWidth: 70 }}>
                            {fmt(v, metric)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top companies */}
                {data.top_companies && data.top_companies.length > 0 && (
                  <div>
                    <button
                      onClick={() => setShowCompanies((s) => !s)}
                      className="w-full flex items-center justify-between"
                      style={{ marginBottom: "6px" }}
                    >
                      <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700 }}>
                        Top entreprises ({data.top_companies.length})
                      </p>
                      {showCompanies ? <ChevronUp size={12} style={{ color: "var(--ink-3)" }} /> : <ChevronDown size={12} style={{ color: "var(--ink-3)" }} />}
                    </button>
                    <AnimatePresence>
                      {showCompanies && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-1.5">
                            {data.top_companies.map((c, i) => (
                              <div
                                key={c.name}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                              >
                                <span className="text-xs font-bold tabular-nums" style={{ color: "var(--accent)", minWidth: 16 }}>
                                  {i + 1}
                                </span>
                                <div className="flex flex-col flex-1 min-w-0">
                                  <span className="text-xs font-semibold truncate" style={{ color: "var(--ink)" }}>
                                    {c.name}
                                  </span>
                                  <span className="text-xs" style={{ color: "var(--ink-3)" }}>
                                    {c.sector}
                                  </span>
                                </div>
                                <span className="text-xs tabular-nums" style={{ color: "var(--ink-2)", whiteSpace: "nowrap" }}>
                                  {c.revenue_bn} Mds$
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function getMaxForTrend(countryName: string, metric: EconomyMetricId): number {
  let max = 1;
  for (const yr of ECONOMY_YEARS) {
    const d = yr.countries[countryName];
    if (d) {
      const v = d[metric] as number;
      if (v > max) max = v;
    }
  }
  return max;
}

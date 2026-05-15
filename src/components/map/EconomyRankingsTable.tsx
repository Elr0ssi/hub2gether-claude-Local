"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ECONOMY_METRICS, ECONOMY_YEARS } from "@/data/economy/economy";
import type { EconomyMetricId, EconomyYear } from "@/types";

// ── Country flags ─────────────────────────────────────────────────────────────
const FLAGS: Record<string, string> = {
  "United States of America": "🇺🇸", "China": "🇨🇳", "Japan": "🇯🇵",
  "Germany": "🇩🇪", "United Kingdom": "🇬🇧", "France": "🇫🇷", "Italy": "🇮🇹",
  "Brazil": "🇧🇷", "Canada": "🇨🇦", "India": "🇮🇳", "South Korea": "🇰🇷",
  "Russia": "🇷🇺", "Spain": "🇪🇸", "Australia": "🇦🇺", "Mexico": "🇲🇽",
  "Netherlands": "🇳🇱", "Switzerland": "🇨🇭", "Argentina": "🇦🇷",
  "Belgium": "🇧🇪", "Sweden": "🇸🇪", "Turkey": "🇹🇷", "Indonesia": "🇮🇩",
  "Saudi Arabia": "🇸🇦", "Poland": "🇵🇱", "Norway": "🇳🇴", "Austria": "🇦🇹",
  "Nigeria": "🇳🇬", "South Africa": "🇿🇦", "Thailand": "🇹🇭", "Egypt": "🇪🇬",
  "Pakistan": "🇵🇰", "Iran": "🇮🇷", "Malaysia": "🇲🇾", "Czech Republic": "🇨🇿",
  "Denmark": "🇩🇰", "Finland": "🇫🇮", "Hungary": "🇭🇺", "Romania": "🇷🇴",
  "Ukraine": "🇺🇦", "Israel": "🇮🇱", "Colombia": "🇨🇴", "Vietnam": "🇻🇳",
  "Bangladesh": "🇧🇩", "Philippines": "🇵🇭", "Singapore": "🇸🇬", "UAE": "🇦🇪",
  "Chile": "🇨🇱", "Iraq": "🇮🇶", "Portugal": "🇵🇹", "Kazakhstan": "🇰🇿",
  "Algeria": "🇩🇿", "Qatar": "🇶🇦", "Greece": "🇬🇷", "New Zealand": "🇳🇿",
  "Peru": "🇵🇪", "Morocco": "🇲🇦", "Ethiopia": "🇪🇹", "Kenya": "🇰🇪",
  "Tanzania": "🇹🇿", "Ghana": "🇬🇭", "Ecuador": "🇪🇨", "Bulgaria": "🇧🇬",
  "Croatia": "🇭🇷", "Slovakia": "🇸🇰", "Slovenia": "🇸🇮", "Serbia": "🇷🇸",
  "Lithuania": "🇱🇹", "Latvia": "🇱🇻", "Estonia": "🇪🇪", "Luxembourg": "🇱🇺",
  "Tunisia": "🇹🇳", "Angola": "🇦🇴", "Cameroon": "🇨🇲", "Ivory Coast": "🇨🇮",
  "Senegal": "🇸🇳", "Bolivia": "🇧🇴", "Paraguay": "🇵🇾", "Uruguay": "🇺🇾",
  "Panama": "🇵🇦", "Costa Rica": "🇨🇷", "Dominican Republic": "🇩🇴",
  "Guatemala": "🇬🇹", "Myanmar": "🇲🇲", "Azerbaijan": "🇦🇿", "Belarus": "🇧🇾",
  "Libya": "🇱🇾", "Sudan": "🇸🇩", "Zimbabwe": "🇿🇼", "Mozambique": "🇲🇿",
  "Zambia": "🇿🇲", "Uganda": "🇺🇬", "Mali": "🇲🇱", "Guinea": "🇬🇳",
  "Cuba": "🇨🇺", "Cyprus": "🇨🇾", "Iceland": "🇮🇸", "Malta": "🇲🇹",
  "Bahrain": "🇧🇭", "Kuwait": "🇰🇼", "Oman": "🇴🇲",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatValue(value: number | undefined, metricId: EconomyMetricId): string {
  if (value === undefined || value === null) return "—";
  if (metricId === "gdp") {
    if (value >= 1000) return `${(value / 1000).toFixed(1)} T$`;
    return `${value.toLocaleString("fr-FR")} Mds`;
  }
  if (metricId === "debt_ratio") return `${value.toFixed(1)} %`;
  if (metricId === "unemployment") return `${value.toFixed(1)} %`;
  if (metricId === "companies") return `${value.toLocaleString("fr-FR")} k`;
  return String(value);
}

function getMetricValue(data: EconomyYear["countries"][string], metricId: EconomyMetricId): number {
  if (metricId === "gdp") return data.gdp;
  if (metricId === "debt_ratio") return data.debt_ratio;
  if (metricId === "unemployment") return data.unemployment;
  if (metricId === "companies") return data.companies;
  return 0;
}

// Sort direction: GDP/Companies → bigger is "better" → desc by default
// Debt/Unemployment → smaller is "better" → asc by default
function defaultSortDir(metricId: EconomyMetricId): "asc" | "desc" {
  return metricId === "debt_ratio" || metricId === "unemployment" ? "asc" : "desc";
}

// ── Component ─────────────────────────────────────────────────────────────────
interface EconomyRankingsTableProps {
  metric: EconomyMetricId;
  year: number;
  activeEconomyYear: EconomyYear;
  ytdMode: boolean;
  onCountryClick?: (name: string) => void;
}

const PAGE_SIZE = 20;

export function EconomyRankingsTable({
  metric,
  year,
  activeEconomyYear,
  ytdMode,
  onCountryClick,
}: EconomyRankingsTableProps) {
  const [sortMetric, setSortMetric] = useState<EconomyMetricId>(metric);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSortDir(metric));
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  // Sync sort metric when parent metric changes
  const effectiveSortMetric = metric !== sortMetric ? metric : sortMetric;
  const effectiveSortDir = metric !== sortMetric ? defaultSortDir(metric) : sortDir;

  const handleSort = (m: EconomyMetricId) => {
    if (m === effectiveSortMetric) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortMetric(m);
      setSortDir(defaultSortDir(m));
    }
    setPage(0);
  };

  // Previous year data for rank delta
  const prevYearData = useMemo(() => {
    const prev = ECONOMY_YEARS.find((y) => y.year === year - 1) ??
      ECONOMY_YEARS.find((y) => y.year < year);
    return prev ?? null;
  }, [year]);

  // Build ranked rows
  const allRows = useMemo(() => {
    const countries = Object.entries(activeEconomyYear.countries);

    // Sort for current ranking
    const sorted = [...countries].sort(([, a], [, b]) => {
      const av = getMetricValue(a, effectiveSortMetric);
      const bv = getMetricValue(b, effectiveSortMetric);
      return effectiveSortDir === "desc" ? bv - av : av - bv;
    });

    // Previous year rank map for delta
    const prevRankMap: Record<string, number> = {};
    if (prevYearData) {
      const prevSorted = Object.entries(prevYearData.countries).sort(([, a], [, b]) => {
        const av = getMetricValue(a, effectiveSortMetric);
        const bv = getMetricValue(b, effectiveSortMetric);
        return effectiveSortDir === "desc" ? bv - av : av - bv;
      });
      prevSorted.forEach(([name], i) => { prevRankMap[name] = i + 1; });
    }

    return sorted.map(([name, data], i) => {
      const rank = i + 1;
      const prevRank = prevRankMap[name];
      const delta = prevRank !== undefined ? prevRank - rank : null;
      return { name, data, rank, delta };
    });
  }, [activeEconomyYear, effectiveSortMetric, effectiveSortDir, prevYearData]);

  // Filtered rows
  const filtered = useMemo(() => {
    if (!search.trim()) return allRows;
    const q = search.toLowerCase();
    return allRows.filter((r) => r.name.toLowerCase().includes(q));
  }, [allRows, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const currentMetric = ECONOMY_METRICS.find((m) => m.id === metric) ?? ECONOMY_METRICS[0];

  return (
    <div
      className="rounded-2xl overflow-hidden mt-6"
      style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
    >
      {/* Table header */}
      <div
        className="px-5 py-4 border-b flex items-center justify-between gap-4 flex-wrap"
        style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
      >
        <div>
          <p className="section-title mb-0.5">Classement mondial</p>
          <p className="text-heading-3" style={{ color: "var(--ink)" }}>
            {currentMetric.label}{" "}
            <span style={{ color: "var(--accent)" }}>
              {ytdMode ? "En direct" : year}
            </span>
          </p>
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", minWidth: "200px" }}
        >
          <Search size={13} style={{ color: "var(--ink-4)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Rechercher un pays…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="bg-transparent outline-none text-xs w-full"
            style={{ color: "var(--ink-2)" }}
          />
        </div>
      </div>

      {/* Metric tabs */}
      <div
        className="px-5 py-2 border-b flex items-center gap-1 overflow-x-auto"
        style={{ borderColor: "var(--border-light)" }}
      >
        <span className="text-caption shrink-0 mr-2">Trier par :</span>
        {ECONOMY_METRICS.map((m) => (
          <button
            key={m.id}
            onClick={() => handleSort(m.id)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0"
            style={
              m.id === effectiveSortMetric
                ? { background: "var(--accent-dim)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.3)", fontWeight: 700 }
                : { background: "transparent", color: "var(--ink-3)", border: "1px solid transparent" }
            }
          >
            {m.shortLabel}
            {m.id === effectiveSortMetric ? (
              effectiveSortDir === "desc" ? <ChevronDown size={11} /> : <ChevronUp size={11} />
            ) : (
              <ChevronsUpDown size={11} style={{ opacity: 0.4 }} />
            )}
          </button>
        ))}
        <span className="ml-auto text-caption shrink-0">
          {filtered.length} pays
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-light)", background: "var(--surface-2)" }}>
              <th className="px-4 py-2.5 text-left" style={{ color: "var(--ink-4)", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", width: "52px" }}>
                #
              </th>
              <th className="px-3 py-2.5 text-left" style={{ color: "var(--ink-4)", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Pays
              </th>
              {ECONOMY_METRICS.map((m) => (
                <th
                  key={m.id}
                  className="px-3 py-2.5 text-right cursor-pointer hover:bg-opacity-50 transition-colors"
                  onClick={() => handleSort(m.id)}
                  style={{
                    color: m.id === effectiveSortMetric ? "#0D7A40" : "var(--ink-4)",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    background: m.id === metric ? "rgba(57,255,136,0.04)" : "transparent",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span className="flex items-center justify-end gap-1">
                    {m.shortLabel}
                    <span style={{ opacity: 0.5, fontSize: "0.55rem" }}>{m.unit}</span>
                    {m.id === effectiveSortMetric ? (
                      effectiveSortDir === "desc" ? <ChevronDown size={10} /> : <ChevronUp size={10} />
                    ) : null}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <AnimatePresence mode="wait">
            <motion.tbody
              key={`${effectiveSortMetric}-${effectiveSortDir}-${year}-${page}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {pageRows.map(({ name, data, rank, delta }, idx) => {
                const isEven = idx % 2 === 1;
                return (
                  <tr
                    key={name}
                    onClick={() => onCountryClick?.(name)}
                    className="transition-colors"
                    style={{
                      background: isEven ? "var(--surface-2)" : "var(--surface)",
                      borderBottom: "1px solid var(--border-light)",
                      cursor: onCountryClick ? "pointer" : "default",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(57,255,136,0.04)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = isEven ? "var(--surface-2)" : "var(--surface)"; }}
                  >
                    {/* Rank */}
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold tabular-nums" style={{ color: rank <= 3 ? "#0D7A40" : "var(--ink-3)", minWidth: "20px" }}>
                          {rank <= 3 ? ["🥇","🥈","🥉"][rank - 1] : rank}
                        </span>
                        {delta !== null && delta !== 0 && (
                          <span
                            className="text-xs font-semibold flex items-center gap-0.5"
                            style={{
                              color: delta > 0 ? "#16a34a" : "#dc2626",
                              fontSize: "0.58rem",
                            }}
                          >
                            {delta > 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                            {Math.abs(delta)}
                          </span>
                        )}
                        {delta === 0 && (
                          <Minus size={9} style={{ color: "var(--ink-4)" }} />
                        )}
                      </div>
                    </td>

                    {/* Country */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>
                          {FLAGS[name] ?? "🌍"}
                        </span>
                        <span className="text-xs font-medium" style={{ color: "var(--ink)", whiteSpace: "nowrap" }}>
                          {name}
                        </span>
                      </div>
                    </td>

                    {/* Metric values */}
                    {ECONOMY_METRICS.map((m) => {
                      const val = getMetricValue(data, m.id);
                      const isActive = m.id === metric;
                      return (
                        <td
                          key={m.id}
                          className="px-3 py-2.5 text-right tabular-nums"
                          style={{
                            background: isActive ? "rgba(57,255,136,0.05)" : "transparent",
                            fontWeight: isActive ? 700 : 400,
                            color: isActive ? "var(--ink)" : "var(--ink-3)",
                            fontSize: isActive ? "0.8rem" : "0.72rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatValue(val, m.id)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </motion.tbody>
          </AnimatePresence>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="px-5 py-3 border-t flex items-center justify-between gap-4"
          style={{ borderColor: "var(--border-light)", background: "var(--surface-2)" }}
        >
          <span className="text-caption">
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} sur {filtered.length} pays
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: page === 0 ? "var(--ink-4)" : "var(--ink-2)",
                opacity: page === 0 ? 0.4 : 1,
              }}
            >
              ← Préc.
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="w-8 h-7 rounded-lg text-xs font-medium transition-all"
                  style={
                    p === page
                      ? { background: "var(--accent-dim)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.3)", fontWeight: 700 }
                      : { background: "var(--surface)", border: "1px solid var(--border)", color: "var(--ink-3)" }
                  }
                >
                  {p + 1}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: page >= totalPages - 1 ? "var(--ink-4)" : "var(--ink-2)",
                opacity: page >= totalPages - 1 ? 0.4 : 1,
              }}
            >
              Suiv. →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

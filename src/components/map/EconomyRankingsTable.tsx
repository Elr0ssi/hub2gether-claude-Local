"use client";

import React, { useMemo, useState } from "react";
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

// ── Flag image helper (avoids emoji rendering as text on some Android devices) ──
function flagImg(emoji: string | undefined): React.ReactNode {
  if (!emoji) return <span style={{ fontSize: "0.9rem" }}>🌍</span>;
  const chars = [...emoji];
  const a = chars[0]?.codePointAt(0) ?? 0;
  const b = chars[1]?.codePointAt(0) ?? 0;
  if (chars.length < 2 || a < 0x1F1E6 || b < 0x1F1E6) return <span style={{ fontSize: "0.9rem" }}>🌍</span>;
  const code = (String.fromCharCode(a - 0x1F1E6 + 65) + String.fromCharCode(b - 0x1F1E6 + 65)).toLowerCase();
  return <img src={`https://flagcdn.com/20x15/${code}.png`} alt="" width={20} height={15} style={{ borderRadius: "2px", objectFit: "cover", flexShrink: 0 }} />;
}

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
  if (metricId === "gdp_per_capita") return `${Math.round(value).toLocaleString("fr-FR")} $`;
  if (metricId === "trade_balance") return `${value > 0 ? "+" : ""}${value.toLocaleString("fr-FR")} Mds`;
  return String(value);
}

function getMetricValue(data: EconomyYear["countries"][string], metricId: EconomyMetricId): number {
  if (metricId === "gdp") return data.gdp;
  if (metricId === "debt_ratio") return data.debt_ratio;
  if (metricId === "unemployment") return data.unemployment;
  if (metricId === "companies") return data.companies;
  if (metricId === "gdp_per_capita") return data.gdp_per_capita ?? 0;
  if (metricId === "trade_balance") return data.trade_balance ?? 0;
  return 0;
}

// Sort direction: GDP/Companies/PIB per capita/Balance → bigger is "better" → desc by default
// Debt/Unemployment → smaller is "better" → asc by default
function defaultSortDir(metricId: EconomyMetricId): "asc" | "desc" {
  return metricId === "debt_ratio" || metricId === "unemployment" ? "asc" : "desc";
}

// ── Column config per metric ──────────────────────────────────────────────────
interface ColDef {
  key: string;
  header: string;
  unit: string;
  getValue: (data: EconomyYear["countries"][string]) => number;
  format: (data: EconomyYear["countries"][string]) => string;
  sortDir: "asc" | "desc";
}

function gdpPerCapitaCol(): ColDef {
  return {
    key: "gdp_per_capita", header: "PIB / hab.", unit: "$ US",
    getValue: (d) => d.gdp_per_capita ?? -Infinity,
    format: (d) => formatValue(d.gdp_per_capita, "gdp_per_capita"),
    sortDir: "desc",
  };
}

function tradeBalanceCol(): ColDef {
  return {
    key: "trade_balance", header: "Balance comm.", unit: "Mds USD",
    getValue: (d) => d.trade_balance ?? -Infinity,
    format: (d) => formatValue(d.trade_balance, "trade_balance"),
    sortDir: "desc",
  };
}

function getColDefs(metric: EconomyMetricId): ColDef[] {
  let primary: ColDef[] = [];
  if (metric === "gdp") {
    primary = [{
      key: "gdp", header: "PIB", unit: "Mds USD",
      getValue: (d) => d.gdp,
      format: (d) => formatValue(d.gdp, "gdp"),
      sortDir: "desc",
    }];
  } else if (metric === "debt_ratio") {
    primary = [
      {
        key: "debt_ratio", header: "% Dette / PIB", unit: "%",
        getValue: (d) => d.debt_ratio,
        format: (d) => `${d.debt_ratio.toFixed(1)} %`,
        sortDir: "desc",
      },
      {
        key: "debt_abs", header: "Montant dette", unit: "Mds USD",
        getValue: (d) => Math.round(d.gdp * d.debt_ratio / 100),
        format: (d) => {
          const v = Math.round(d.gdp * d.debt_ratio / 100);
          return formatValue(v, "gdp");
        },
        sortDir: "desc",
      },
    ];
  } else if (metric === "unemployment") {
    primary = [{
      key: "unemployment", header: "Chômage", unit: "%",
      getValue: (d) => d.unemployment,
      format: (d) => `${d.unemployment.toFixed(1)} %`,
      sortDir: "asc",
    }];
  } else if (metric === "gdp_per_capita") {
    primary = [gdpPerCapitaCol()];
  } else if (metric === "trade_balance") {
    primary = [tradeBalanceCol()];
  } else {
    return [];
  }

  const extras: ColDef[] = [];
  if (metric !== "gdp_per_capita") extras.push(gdpPerCapitaCol());
  if (metric !== "trade_balance") extras.push(tradeBalanceCol());
  return [...primary, ...extras];
}

// ── Component ─────────────────────────────────────────────────────────────────
interface EconomyRankingsTableProps {
  metric: EconomyMetricId;
  year: number;
  activeEconomyYear: EconomyYear;
  ytdMode: boolean;
  onCountryClick?: (name: string) => void;
}

export function EconomyRankingsTable({
  metric,
  year,
  activeEconomyYear,
  ytdMode,
  onCountryClick,
}: EconomyRankingsTableProps) {
  const [sortColKey, setSortColKey] = useState<string>(metric);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSortDir(metric));
  const [search, setSearch] = useState("");

  // No ranking for companies
  const cols = getColDefs(metric);
  if (cols.length === 0) return null;

  // Reset sort when metric changes
  const primaryCol = cols[0];
  const effectiveSortKey = cols.find(c => c.key === sortColKey) ? sortColKey : primaryCol.key;
  const effectiveSortCol = cols.find(c => c.key === effectiveSortKey) ?? primaryCol;
  const effectiveSortDir = cols.find(c => c.key === sortColKey) ? sortDir : primaryCol.sortDir;

  const handleSort = (key: string, dir: "asc" | "desc") => {
    if (key === effectiveSortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColKey(key);
      setSortDir(dir);
    }
  };

  // Previous year data for rank delta
  const prevYearData = useMemo(() => {
    const prev = ECONOMY_YEARS.find((y) => y.year === year - 1) ??
      ECONOMY_YEARS.find((y) => y.year < year);
    return prev ?? null;
  }, [year]);

  // Build ranked rows sorted by primary col
  const allRows = useMemo(() => {
    const countries = Object.entries(activeEconomyYear.countries);

    const sorted = [...countries].sort(([, a], [, b]) => {
      const av = effectiveSortCol.getValue(a);
      const bv = effectiveSortCol.getValue(b);
      return effectiveSortDir === "desc" ? bv - av : av - bv;
    });

    const prevRankMap: Record<string, number> = {};
    if (prevYearData) {
      const prevSorted = Object.entries(prevYearData.countries).sort(([, a], [, b]) => {
        const av = primaryCol.getValue(a);
        const bv = primaryCol.getValue(b);
        return primaryCol.sortDir === "desc" ? bv - av : av - bv;
      });
      prevSorted.forEach(([name], i) => { prevRankMap[name] = i + 1; });
    }

    return sorted.map(([name, data], i) => {
      const rank = i + 1;
      const prevRank = prevRankMap[name];
      const delta = prevRank !== undefined ? prevRank - rank : null;
      return { name, data, rank, delta };
    });
  }, [activeEconomyYear, effectiveSortCol, effectiveSortDir, primaryCol, prevYearData]);

  // Filtered rows
  const filtered = useMemo(() => {
    if (!search.trim()) return allRows;
    const q = search.toLowerCase();
    return allRows.filter((r) => r.name.toLowerCase().includes(q));
  }, [allRows, search]);

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
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-xs w-full"
            style={{ color: "var(--ink-2)" }}
          />
        </div>
      </div>

      {/* Table — translate="no" prevents browser auto-translation of units (Mds, k, %) */}
      <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: "460px" }} translate="no">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-light)", background: "var(--surface-2)" }}>
              <th className="px-4 py-2.5 text-left" style={{ color: "var(--ink-4)", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", width: "52px" }}>
                #
              </th>
              <th className="px-3 py-2.5 text-left" style={{ color: "var(--ink-4)", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Pays
              </th>
              {cols.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2.5 text-right cursor-pointer transition-colors"
                  onClick={() => handleSort(col.key, col.sortDir)}
                  style={{
                    color: col.key === effectiveSortKey ? "#0D7A40" : "var(--ink-4)",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    background: "rgba(57,255,136,0.04)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span className="flex items-center justify-end gap-1">
                    {col.header}
                    <span style={{ opacity: 0.5, fontSize: "0.55rem" }}>{col.unit}</span>
                    {col.key === effectiveSortKey ? (
                      effectiveSortDir === "desc" ? <ChevronDown size={10} /> : <ChevronUp size={10} />
                    ) : <ChevronsUpDown size={10} style={{ opacity: 0.3 }} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <AnimatePresence mode="wait">
            <motion.tbody
              key={`${metric}-${effectiveSortKey}-${effectiveSortDir}-${year}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {filtered.map(({ name, data, rank, delta }, idx) => {
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
                            style={{ color: delta > 0 ? "#16a34a" : "#dc2626", fontSize: "0.58rem" }}
                          >
                            {delta > 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                            {Math.abs(delta)}
                          </span>
                        )}
                        {delta === 0 && <Minus size={9} style={{ color: "var(--ink-4)" }} />}
                      </div>
                    </td>

                    {/* Country */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        {flagImg(FLAGS[name])}
                        <span className="text-xs font-medium" style={{ color: "var(--ink)", whiteSpace: "nowrap" }}>
                          {name}
                        </span>
                      </div>
                    </td>

                    {/* Data columns */}
                    {cols.map((col) => (
                      <td
                        key={col.key}
                        className="px-3 py-2.5 text-right tabular-nums"
                        style={{
                          background: "rgba(57,255,136,0.05)",
                          fontWeight: col.key === effectiveSortKey ? 700 : 500,
                          color: "var(--ink)",
                          fontSize: "0.8rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {col.format(data)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </motion.tbody>
          </AnimatePresence>
        </table>
      </div>

      {/* Footer: count */}
      <div
        className="px-5 py-2 border-t text-xs"
        style={{ borderColor: "var(--border-light)", background: "var(--surface-2)", color: "var(--ink-4)" }}
      >
        {filtered.length} pays
      </div>
    </div>
  );
}

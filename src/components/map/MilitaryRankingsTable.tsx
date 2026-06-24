"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronUp, ChevronDown, Shield } from "lucide-react";
import { MILITARY_METRICS, getMilitaryData } from "@/data/military/military";
import type { MilitaryMetricId } from "@/data/military/military";
import { ECONOMY_YEARS } from "@/data/economy/economy";

const FLAGS: Record<string, string> = {
  "United States of America": "🇺🇸", "Russia": "🇷🇺", "China": "🇨🇳",
  "France": "🇫🇷", "Germany": "🇩🇪", "United Kingdom": "🇬🇧", "Japan": "🇯🇵",
  "India": "🇮🇳", "South Korea": "🇰🇷", "Italy": "🇮🇹", "Israel": "🇮🇱",
  "Turkey": "🇹🇷", "Saudi Arabia": "🇸🇦", "Australia": "🇦🇺", "Poland": "🇵🇱",
  "Ukraine": "🇺🇦", "Brazil": "🇧🇷", "Iran": "🇮🇷", "Spain": "🇪🇸",
  "Canada": "🇨🇦", "Pakistan": "🇵🇰", "Egypt": "🇪🇬", "Indonesia": "🇮🇩",
  "Vietnam": "🇻🇳", "Greece": "🇬🇷", "Netherlands": "🇳🇱", "Sweden": "🇸🇪",
  "Switzerland": "🇨🇭", "Norway": "🇳🇴", "North Korea": "🇰🇵",
};

function flagImg(emoji: string | undefined): React.ReactNode {
  if (!emoji) return <span style={{ fontSize: "0.9rem" }}>🌍</span>;
  const chars = [...emoji];
  const a = chars[0]?.codePointAt(0) ?? 0;
  const b = chars[1]?.codePointAt(0) ?? 0;
  if (chars.length < 2 || a < 0x1F1E6 || b < 0x1F1E6) return <span style={{ fontSize: "0.9rem" }}>🌍</span>;
  const code = (String.fromCharCode(a - 0x1F1E6 + 65) + String.fromCharCode(b - 0x1F1E6 + 65)).toLowerCase();
  return <img src={`https://flagcdn.com/20x15/${code}.png`} alt="" width={20} height={15} style={{ borderRadius: "2px", objectFit: "cover", flexShrink: 0 }} />;
}

const MEDALS = ["🥇", "🥈", "🥉"];

interface MilitaryRankingsTableProps {
  year: number;
  rankMetric: MilitaryMetricId;
  onRankMetricChange: (m: MilitaryMetricId) => void;
  selectedCountry: string | null;
  onCountryClick: (name: string) => void;
}

export function MilitaryRankingsTable({
  year,
  rankMetric,
  onRankMetricChange,
  selectedCountry,
  onCountryClick,
}: MilitaryRankingsTableProps) {
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState("");

  const data = useMemo(() => getMilitaryData(year), [year]);

  // Economy GDP for same year (for % PIB)
  const economyYear = useMemo(() => {
    const exact = ECONOMY_YEARS.find(y => y.year === year);
    if (exact) return exact;
    const closest = [...ECONOMY_YEARS].sort((a, b) => Math.abs(a.year - year) - Math.abs(b.year - year))[0];
    return closest ?? null;
  }, [year]);

  const totalBudget = useMemo(() =>
    Object.values(data).reduce((s, d) => s + d.budget, 0)
  , [data]);

  const metricDef = MILITARY_METRICS.find(m => m.id === rankMetric)!;
  const showBudgetCols = rankMetric === "budget";

  const allRanked = useMemo(() => {
    const rows = Object.entries(data).map(([name, d]) => ({
      name,
      value: d[rankMetric],
      budget: d.budget,
      data: d,
    }));
    return rows.sort((a, b) => sortAsc ? a.value - b.value : b.value - a.value);
  }, [data, rankMetric, sortAsc]);

  const rankMax = allRanked.length > 0 ? allRanked[0].value : 1;

  const filtered = useMemo(() => {
    if (!search.trim()) return allRanked;
    const q = search.toLowerCase();
    return allRanked.filter(r => r.name.toLowerCase().includes(q));
  }, [allRanked, search]);

  return (
    <div className="mt-4 rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      {/* Header */}
      <div className="px-5 py-4 border-b flex items-center justify-between gap-4 flex-wrap"
        style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
        <div className="flex items-center gap-3">
          <Shield size={14} style={{ color: metricDef.color }} />
          <div>
            <p className="section-title mb-0.5" style={{ color: "var(--ink-4)", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700 }}>Classement militaire</p>
            <p className="font-bold text-sm" style={{ color: "var(--ink)" }}>
              {metricDef.label} <span style={{ color: metricDef.color }}>{year}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Metric tabs */}
          <div className="flex items-center gap-1 flex-wrap">
            {MILITARY_METRICS.map(m => (
              <button
                key={m.id}
                onClick={() => { onRankMetricChange(m.id); setSortAsc(false); }}
                className="px-2.5 py-1 rounded-lg text-xs transition-all"
                style={rankMetric === m.id
                  ? { background: m.color + "22", color: m.color, border: `1px solid ${m.color}55`, fontWeight: 700 }
                  : { background: "transparent", color: "var(--ink-4)", border: "1px solid transparent" }
                }
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", minWidth: "180px" }}>
            <Search size={12} style={{ color: "var(--ink-4)", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Rechercher un pays…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none text-xs w-full"
              style={{ color: "var(--ink-2)" }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: "460px" }}>
        <table className="w-full" style={{ borderCollapse: "collapse" }} translate="no">
          <thead style={{ position: "sticky", top: 0, background: "var(--surface-2)", zIndex: 1 }}>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th className="px-4 py-2.5 text-left" style={{ color: "var(--ink-4)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", width: "52px" }}>
                #
              </th>
              <th className="px-3 py-2.5 text-left" style={{ color: "var(--ink-4)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Pays
              </th>
              <th className="px-3 py-2.5 text-left hidden sm:table-cell" style={{ color: "var(--ink-4)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Barres
              </th>
              <th
                className="px-3 py-2.5 text-right cursor-pointer select-none"
                style={{ color: metricDef.color, fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap", background: metricDef.color + "08" }}
                onClick={() => setSortAsc(a => !a)}
              >
                <span className="flex items-center justify-end gap-1">
                  {metricDef.label} <span style={{ opacity: 0.5 }}>{metricDef.unit}</span>
                  {sortAsc ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                </span>
              </th>
              {showBudgetCols && (
                <>
                  <th className="px-3 py-2.5 text-right hidden md:table-cell" style={{ color: "var(--ink-4)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                    % PIB
                  </th>
                  <th className="px-3 py-2.5 text-right hidden md:table-cell" style={{ color: "var(--ink-4)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                    % Budget mondial
                  </th>
                </>
              )}
            </tr>
          </thead>
          <AnimatePresence mode="wait">
            <motion.tbody
              key={`${rankMetric}-${sortAsc}-${year}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {filtered.map(({ name, value, budget }, idx) => {
                const rank = allRanked.findIndex(r => r.name === name) + 1;
                const pct = rankMax > 0 ? (value / rankMax) * 100 : 0;
                const isHighlighted = selectedCountry === name;
                const isEven = idx % 2 === 1;

                const gdp = economyYear?.countries[name]?.gdp;
                const pctGDP = showBudgetCols && gdp && gdp > 0 ? (budget / gdp * 100) : null;
                const pctWorld = showBudgetCols && totalBudget > 0 ? (budget / totalBudget * 100) : null;

                return (
                  <tr
                    key={name}
                    className="cursor-pointer transition-colors"
                    style={{
                      borderBottom: "1px solid var(--border-light, var(--border))",
                      background: isHighlighted
                        ? metricDef.color + "18"
                        : isEven ? "var(--surface-2)" : "var(--surface)",
                    }}
                    onClick={() => onCountryClick(name)}
                    onMouseEnter={e => { if (!isHighlighted) (e.currentTarget as HTMLElement).style.background = metricDef.color + "0A"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isHighlighted ? metricDef.color + "18" : isEven ? "var(--surface-2)" : "var(--surface)"; }}
                  >
                    {/* Rank */}
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-bold tabular-nums" style={{ color: rank <= 3 ? metricDef.color : "var(--ink-4)" }}>
                        {rank <= 3 ? MEDALS[rank - 1] : rank}
                      </span>
                    </td>

                    {/* Country */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        {flagImg(FLAGS[name])}
                        <span className="text-xs font-medium" style={{ color: isHighlighted ? metricDef.color : "var(--ink)", whiteSpace: "nowrap" }}>
                          {name}
                        </span>
                      </div>
                    </td>

                    {/* Bar */}
                    <td className="px-3 py-2.5 hidden sm:table-cell" style={{ minWidth: "100px" }}>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: metricDef.color, transition: "width 0.3s ease" }} />
                      </div>
                    </td>

                    {/* Value */}
                    <td className="px-3 py-2.5 text-right tabular-nums" style={{ background: metricDef.color + "08", whiteSpace: "nowrap" }}>
                      <span style={{ color: metricDef.color, fontSize: "0.8rem", fontWeight: 700 }}>
                        {value.toLocaleString("fr-FR")}
                      </span>
                      <span style={{ color: "var(--ink-4)", fontSize: "0.62rem", fontWeight: 400, marginLeft: "3px" }}>
                        {metricDef.unit}
                      </span>
                    </td>

                    {/* % PIB */}
                    {showBudgetCols && (
                      <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell" style={{ whiteSpace: "nowrap" }}>
                        <span style={{ color: pctGDP !== null ? "var(--ink)" : "var(--ink-4)", fontSize: "0.75rem", fontWeight: pctGDP !== null ? 600 : 400 }}>
                          {pctGDP !== null ? `${pctGDP.toFixed(1)} %` : "—"}
                        </span>
                      </td>
                    )}

                    {/* % Budget mondial */}
                    {showBudgetCols && (
                      <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell" style={{ whiteSpace: "nowrap" }}>
                        <span style={{ color: pctWorld !== null ? "var(--ink)" : "var(--ink-4)", fontSize: "0.75rem", fontWeight: pctWorld !== null ? 600 : 400 }}>
                          {pctWorld !== null ? `${pctWorld.toFixed(1)} %` : "—"}
                        </span>
                      </td>
                    )}
                  </tr>
                );
              })}
            </motion.tbody>
          </AnimatePresence>
        </table>
      </div>

      <div className="px-5 py-2.5 border-t flex items-center justify-between"
        style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
        <span style={{ color: "var(--ink-4)", fontSize: "0.62rem" }}>
          {filtered.length} pays · Sources : SIPRI, IISS Military Balance, Global Firepower
        </span>
        {showBudgetCols && (
          <span style={{ color: "var(--ink-4)", fontSize: "0.58rem" }}>
            % PIB calculé via données FMI
          </span>
        )}
      </div>
    </div>
  );
}

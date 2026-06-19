"use client";

import { useCallback, useMemo, useState } from "react";
import { Maximize2, Minimize2, ChevronLeft, Shield, ChevronUp, ChevronDown } from "lucide-react";
import { MilitaryInteractiveMap } from "./MilitaryInteractiveMap";
import { MilitarySidePanel } from "@/components/sidebar/MilitarySidePanel";
import { ThemeDropdown } from "./ThemeDropdown";
import { useDragScroll } from "@/hooks/useDragScroll";
import {
  getMilitaryData,
  MILITARY_METRICS,
  MILITARY_KEY_YEARS,
  DEFAULT_MILITARY_YEAR,
  MILITARY_MIN_YEAR,
  MILITARY_MAX_YEAR,
  type MilitaryMetricId,
} from "@/data/military/military";

export function MilitaryMapView() {
  const [metric, setMetric] = useState<MilitaryMetricId>("budget");
  const [year, setYear] = useState<number>(DEFAULT_MILITARY_YEAR);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rankMetric, setRankMetric] = useState<MilitaryMetricId>("budget");
  const [rankAsc, setRankAsc] = useState(false);
  const { ref: yearBtnsRef, onMouseDown: onYearBtnsDown, onMouseUp: onYearBtnsUp, onMouseLeave: onYearBtnsLeave, onMouseMove: onYearBtnsMove } = useDragScroll();

  const data = useMemo(() => getMilitaryData(year), [year]);

  const selectedData = useMemo(() =>
    selectedCountry ? data[selectedCountry] : undefined,
    [selectedCountry, data]
  );

  const handleCountryClick = useCallback((name: string) => {
    setSelectedCountry(name);
    setSidePanelOpen(true);
  }, []);

  const activeMetric = MILITARY_METRICS.find(m => m.id === metric)!;

  // Full ranking for selected rank metric
  const allRanked = useMemo(() => {
    const sorted = Object.entries(data)
      .map(([name, d]) => ({ name, value: d[rankMetric] }))
      .sort((a, b) => rankAsc ? a.value - b.value : b.value - a.value);
    return sorted;
  }, [data, rankMetric, rankAsc]);

  const rankMax = allRanked.length > 0 ? Math.max(...allRanked.map(r => r.value)) : 1;
  const rankMetricDef = MILITARY_METRICS.find(m => m.id === rankMetric)!;

  return (
    <>
      {/* Map card */}
      <div
        className={`border rounded-2xl overflow-hidden${isFullscreen ? " fixed inset-0 z-[9999] rounded-none flex flex-col" : ""}`}
        style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-float)", background: "var(--surface)" }}
      >
        {/* Toolbar */}
        <div className="px-4 py-3 border-b flex items-center justify-between gap-4 flex-wrap"
          style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
        >
          <div className="flex items-center gap-3">
            <ThemeDropdown currentTheme="military" />
          </div>
          <div className="flex items-center gap-2">
            {sidePanelOpen ? (
              <button onClick={() => setSidePanelOpen(false)} className="btn-ghost px-2.5 py-1.5 text-xs gap-1.5">
                <ChevronLeft size={13} /> Réduire
              </button>
            ) : (
              <button onClick={() => setSidePanelOpen(true)} className="btn-ghost px-2.5 py-1.5 text-xs gap-1.5">
                <ChevronLeft size={13} /> Détails
              </button>
            )}
            <button
              onClick={() => setIsFullscreen(f => !f)}
              className="btn-ghost px-2.5 py-1.5 text-xs gap-1.5"
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              {isFullscreen ? "Réduire" : "Agrandir"}
            </button>
          </div>
        </div>

        {/* Metric selector */}
        <div className="px-4 py-2 border-b flex items-center gap-2 flex-wrap"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          {MILITARY_METRICS.map(m => (
            <button
              key={m.id}
              onClick={() => setMetric(m.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
              style={metric === m.id
                ? { background: m.color + "22", color: m.color, border: `1px solid ${m.color}55`, fontWeight: 700 }
                : { background: "transparent", color: "var(--ink-3)", border: "1px solid transparent" }
              }
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Year slider */}
        <div className="px-5 py-3 border-b flex flex-col gap-2"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold" style={{ color: "var(--ink-3)" }}>Année :</span>
            <span className="text-sm font-bold tabular-nums" style={{ color: "var(--ink)" }}>{year}</span>
            <span className="text-xs ml-auto" style={{ color: "var(--ink-4)" }}>
              {Object.keys(data).length} pays documentés
            </span>
          </div>
          <div className="relative flex flex-col gap-1">
            <input
              type="range"
              min={MILITARY_MIN_YEAR}
              max={MILITARY_MAX_YEAR}
              value={year}
              onChange={e => setYear(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${activeMetric.color} 0%, ${activeMetric.color} ${((year - MILITARY_MIN_YEAR) / (MILITARY_MAX_YEAR - MILITARY_MIN_YEAR)) * 100}%, var(--surface-2) ${((year - MILITARY_MIN_YEAR) / (MILITARY_MAX_YEAR - MILITARY_MIN_YEAR)) * 100}%, var(--surface-2) 100%)`,
                outline: "none",
                accentColor: activeMetric.color,
              }}
            />
            {/* Tick marks */}
            <div className="relative h-3">
              {MILITARY_KEY_YEARS.map(ky => {
                const pct = ((ky - MILITARY_MIN_YEAR) / (MILITARY_MAX_YEAR - MILITARY_MIN_YEAR)) * 100;
                return (
                  <button
                    key={ky}
                    onClick={() => setYear(ky)}
                    className="absolute transform -translate-x-1/2 text-xs transition-all"
                    style={{ left: `${pct}%`, color: year === ky ? activeMetric.color : "var(--ink-4)", fontWeight: year === ky ? 700 : 400, fontSize: "0.55rem", top: 0 }}
                    title={`Aller en ${ky}`}
                  >
                    {ky === 2000 || ky === 2010 || ky === 2020 || ky === 2024 ? ky : "·"}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Quick year buttons */}
          <div
            ref={yearBtnsRef}
            className="flex items-center gap-1 overflow-x-auto pb-0.5"
            style={{ scrollbarWidth: "none", cursor: "grab" }}
            onMouseDown={onYearBtnsDown} onMouseUp={onYearBtnsUp} onMouseLeave={onYearBtnsLeave} onMouseMove={onYearBtnsMove}
          >
            {MILITARY_KEY_YEARS.map(ky => (
              <button
                key={ky}
                onClick={() => setYear(ky)}
                className="px-2 py-0.5 rounded text-xs font-medium transition-all shrink-0 select-none"
                style={ky === year
                  ? { background: activeMetric.color + "22", color: activeMetric.color, border: `1px solid ${activeMetric.color}44`, fontWeight: 700 }
                  : { background: "transparent", color: "var(--ink-4)", border: "1px solid transparent" }
                }
              >
                {ky}
              </button>
            ))}
          </div>
        </div>

        {/* Map + Side panel */}
        <div className={`flex flex-col lg:flex-row${isFullscreen ? " flex-1 overflow-hidden" : ""}`} style={isFullscreen ? {} : { minHeight: "480px" }}>
          <div className="flex-1 overflow-hidden" style={{ minWidth: 0 }}>
            <MilitaryInteractiveMap
              data={data}
              metric={metric}
              selectedCountry={selectedCountry}
              onCountryClick={handleCountryClick}
            />
          </div>
          <MilitarySidePanel
            countryName={selectedCountry}
            data={selectedData}
            metric={metric}
            year={year}
            open={sidePanelOpen}
            onClose={() => setSidePanelOpen(false)}
          />
        </div>

        {/* Color legend */}
        <div className="px-5 py-2 border-t flex items-center justify-between gap-4"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: "var(--ink-4)", fontSize: "0.62rem" }}>Faible</span>
            <div className="w-24 h-2 rounded-full" style={{
              background: `linear-gradient(to right, ${activeMetric.color}33, ${activeMetric.color})`
            }} />
            <span style={{ color: "var(--ink-4)", fontSize: "0.62rem" }}>Élevé</span>
          </div>
          <p style={{ color: "var(--ink-4)", fontSize: "0.6rem" }}>
            Sources : SIPRI, IISS Military Balance, Global Firepower — à titre indicatif
          </p>
        </div>
      </div>

      {/* Full ranking table */}
      <div className="mt-4 rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        {/* Header + metric tabs */}
        <div className="px-4 pt-4 pb-3 border-b flex items-center justify-between gap-3 flex-wrap"
          style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
          <div className="flex items-center gap-2">
            <Shield size={14} style={{ color: rankMetricDef.color }} />
            <p className="text-xs font-bold" style={{ color: "var(--ink-2)" }}>
              Classement complet — {year}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {MILITARY_METRICS.map(m => (
              <button
                key={m.id}
                onClick={() => { setRankMetric(m.id); setRankAsc(false); }}
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
        </div>

        {/* Table */}
        <div className="overflow-y-auto" style={{ maxHeight: "420px" }}>
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead style={{ position: "sticky", top: 0, background: "var(--surface)", zIndex: 1 }}>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="px-3 py-2 text-left" style={{ color: "var(--ink-4)", fontSize: "0.6rem", fontWeight: 600, width: "32px" }}>#</th>
                <th className="px-2 py-2 text-left" style={{ color: "var(--ink-4)", fontSize: "0.6rem", fontWeight: 600 }}>Pays</th>
                <th className="px-2 py-2 text-left hidden sm:table-cell" style={{ color: "var(--ink-4)", fontSize: "0.6rem", fontWeight: 600 }}>Barres</th>
                <th
                  className="px-3 py-2 text-right cursor-pointer select-none"
                  style={{ color: rankMetricDef.color, fontSize: "0.6rem", fontWeight: 700, whiteSpace: "nowrap" }}
                  onClick={() => setRankAsc(a => !a)}
                >
                  <span className="flex items-center justify-end gap-1">
                    {rankMetricDef.label}
                    {rankAsc ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {allRanked.map(({ name, value }, idx) => {
                const pct = (value / rankMax) * 100;
                const isHighlighted = selectedCountry === name;
                return (
                  <tr
                    key={name}
                    className="cursor-pointer transition-all"
                    style={{ borderBottom: "1px solid var(--border)", background: isHighlighted ? rankMetricDef.color + "11" : "transparent" }}
                    onClick={() => { setSelectedCountry(name); setSidePanelOpen(true); }}
                  >
                    <td className="px-3 py-2 text-right tabular-nums" style={{ color: "var(--ink-4)", fontSize: "0.65rem", fontWeight: 600 }}>{idx + 1}</td>
                    <td className="px-2 py-2" style={{ color: isHighlighted ? rankMetricDef.color : "var(--ink)", fontSize: "0.7rem", fontWeight: isHighlighted ? 700 : 400, maxWidth: "120px" }}>
                      <span className="block truncate">{name}</span>
                    </td>
                    <td className="px-2 py-2 hidden sm:table-cell" style={{ minWidth: "80px" }}>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: rankMetricDef.color }} />
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums" style={{ color: rankMetricDef.color, fontSize: "0.65rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                      {value.toLocaleString("fr-FR")} <span style={{ color: "var(--ink-4)", fontWeight: 400 }}>{rankMetricDef.unit}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width:16px; height:16px; border-radius:50%;
          background: ${activeMetric.color}; border: 2px solid ${activeMetric.color}99;
          cursor: pointer; box-shadow: 0 0 6px ${activeMetric.color}66;
        }
        input[type=range]::-moz-range-thumb {
          width:16px; height:16px; border-radius:50%;
          background: ${activeMetric.color}; border: 2px solid ${activeMetric.color}99;
          cursor: pointer; box-shadow: 0 0 6px ${activeMetric.color}66;
        }
      `}</style>
    </>
  );
}

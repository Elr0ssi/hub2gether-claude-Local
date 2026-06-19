"use client";

import { useCallback, useMemo, useState } from "react";
import { Maximize2, Minimize2, ChevronLeft, Shield } from "lucide-react";
import { MilitaryInteractiveMap } from "./MilitaryInteractiveMap";
import { MilitarySidePanel } from "@/components/sidebar/MilitarySidePanel";
import { ThemeDropdown } from "./ThemeDropdown";
import { ArticleCarousel } from "@/components/articles/ArticleCarousel";
import { ARTICLES } from "@/data/articles";
import { MILITARY_ARTICLES } from "@/data/military/articles";
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
  const [year, setYear] = useState(DEFAULT_MILITARY_YEAR);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { ref: yearBtnsRef, onMouseDown: onYearBtnsDown, onMouseUp: onYearBtnsUp, onMouseLeave: onYearBtnsLeave, onMouseMove: onYearBtnsMove } = useDragScroll();

  const data = useMemo(() => getMilitaryData(year), [year]);

  const selectedData = useMemo(() =>
    selectedCountry ? data[selectedCountry] : undefined,
    [selectedCountry, data]
  );

  const countryArticles = useMemo(() => {
    if (!selectedCountry) return [];
    const q = selectedCountry.toLowerCase();
    return ARTICLES.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [selectedCountry]);

  const handleCountryClick = useCallback((name: string) => {
    setSelectedCountry(name);
    setSidePanelOpen(true);
  }, []);

  const activeMetric = MILITARY_METRICS.find(m => m.id === metric)!;

  // Top 5 for selected metric
  const top5 = useMemo(() => {
    return Object.entries(data)
      .map(([name, d]) => ({ name, value: d[metric] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [data, metric]);

  const maxValue = top5[0]?.value ?? 1;

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

      {/* Top 5 ranking */}
      <div className="mt-4 rounded-2xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Shield size={14} style={{ color: activeMetric.color }} />
          <p className="text-xs font-bold" style={{ color: "var(--ink-2)" }}>
            Top 5 — {activeMetric.label} ({activeMetric.unit}) en {year}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {top5.map(({ name, value }, idx) => {
            const pct = (value / maxValue) * 100;
            return (
              <div key={name} className="flex items-center gap-3">
                <span className="w-4 text-right text-xs font-bold shrink-0" style={{ color: "var(--ink-4)" }}>{idx + 1}</span>
                <span className="w-28 text-xs truncate shrink-0" style={{ color: selectedCountry === name ? activeMetric.color : "var(--ink)" }}>
                  {name}
                </span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: activeMetric.color, transition: "width 0.4s ease" }} />
                </div>
                <span className="text-xs tabular-nums shrink-0 font-semibold" style={{ color: activeMetric.color, minWidth: "80px", textAlign: "right", fontSize: "0.62rem" }}>
                  {value.toLocaleString("fr-FR")} {activeMetric.unit}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Article carousels */}
      <div className="mt-6 rounded-2xl p-5 flex flex-col gap-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        {selectedCountry && (
          <ArticleCarousel
            articles={countryArticles}
            title={`Recommandations — ${selectedCountry}`}
            subtitle="Articles liés au pays sélectionné"
            emptyMessage={`Aucun article spécifique pour ${selectedCountry} pour l'instant.`}
            icon="pin"
          />
        )}
        <ArticleCarousel
          articles={MILITARY_ARTICLES}
          title="Analyses militaires"
          subtitle="Tous les articles de l'onglet Militaire"
          emptyMessage="Aucun article disponible."
          icon="newspaper"
        />
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

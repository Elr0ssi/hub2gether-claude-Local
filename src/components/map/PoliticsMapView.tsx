"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Maximize2, Minimize2, ChevronLeft } from "lucide-react";
import { PoliticsInteractiveMap } from "./PoliticsInteractiveMap";
import { PoliticsSidePanel } from "@/components/sidebar/PoliticsSidePanel";
import { MunicipalElectionsSection } from "./MunicipalElectionsSection";
import { ThemeDropdown } from "./ThemeDropdown";
import { getAllPoliticsForYear, getPoliticsForYear, POLITICS_MIN_YEAR, POLITICS_MAX_YEAR } from "@/data/politics/politics";
import { ORIENTATION_COLORS, ORIENTATION_LABELS } from "@/lib/politicsColors";
import { ArticleCarousel } from "@/components/articles/ArticleCarousel";
import { getArticlesByTheme, ARTICLES } from "@/data/articles";
import { useDragScroll } from "@/hooks/useDragScroll";

const KEY_YEARS = [1900, 1914, 1920, 1933, 1939, 1945, 1950, 1960, 1970, 1980, 1989, 1991, 2000, 2008, 2016, 2020, 2025];

const politicsArticles = getArticlesByTheme("politics");

export function PoliticsMapView() {
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [year, setYear] = useState(2025);
  const { ref: yearBtnsRef, onMouseDown: onYearBtnsDown, onMouseUp: onYearBtnsUp, onMouseLeave: onYearBtnsLeave, onMouseMove: onYearBtnsMove } = useDragScroll();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsFullscreen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const countryArticles = useMemo(() => {
    if (!selectedCountry) return [];
    const q = selectedCountry.toLowerCase();
    return ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [selectedCountry]);

  const politicsData = useMemo(() => getAllPoliticsForYear(year), [year]);

  const selectedPeriod = useMemo(
    () => selectedCountry ? getPoliticsForYear(selectedCountry, year) : undefined,
    [selectedCountry, year]
  );

  const handleCountryClick = useCallback((name: string) => {
    setSelectedCountry(name);
    setSidePanelOpen(true);
  }, []);

  const countriesWithData = Object.keys(politicsData).length;

  return (
    <>
      {/* Map card */}
      <div
        className={`border rounded-2xl overflow-hidden${isFullscreen ? " fixed inset-0 z-[9999] rounded-none flex flex-col" : ""}`}
        style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-float)", background: "var(--surface)" }}
      >
        {/* Main toolbar */}
        <div
          className="px-4 py-3 border-b flex items-center justify-between gap-4 flex-wrap"
          style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
        >
          <div className="flex items-center gap-3">
            <ThemeDropdown currentTheme="politics" />
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
              onClick={() => setIsFullscreen((f) => !f)}
              className="btn-ghost px-2.5 py-1.5 text-xs gap-1.5"
              title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              {isFullscreen ? "Réduire" : "Agrandir"}
            </button>
          </div>
        </div>

        {/* Timeline slider */}
        <div
          className="px-5 py-3 border-b flex flex-col gap-2"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold shrink-0" style={{ color: "var(--ink-3)" }}>Année :</span>
            <span className="text-sm font-bold tabular-nums" style={{ color: "var(--ink)" }}>{year}</span>
            <span className="text-xs ml-auto" style={{ color: "var(--ink-4)" }}>{countriesWithData} pays documentés</span>
          </div>

          {/* Slider */}
          <div className="relative flex flex-col gap-1">
            <input
              type="range"
              min={POLITICS_MIN_YEAR}
              max={POLITICS_MAX_YEAR}
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((year - POLITICS_MIN_YEAR) / (POLITICS_MAX_YEAR - POLITICS_MIN_YEAR)) * 100}%, var(--surface-2) ${((year - POLITICS_MIN_YEAR) / (POLITICS_MAX_YEAR - POLITICS_MIN_YEAR)) * 100}%, var(--surface-2) 100%)`,
                outline: "none",
                accentColor: "#39FF88",
              }}
            />
            {/* Key year markers */}
            <div className="relative h-3">
              {KEY_YEARS.map((ky) => {
                const pct = ((ky - POLITICS_MIN_YEAR) / (POLITICS_MAX_YEAR - POLITICS_MIN_YEAR)) * 100;
                return (
                  <button
                    key={ky}
                    onClick={() => setYear(ky)}
                    className="absolute transform -translate-x-1/2 text-xs transition-all"
                    style={{
                      left: `${pct}%`,
                      color: year === ky ? "#0D7A40" : "var(--ink-4)",
                      fontWeight: year === ky ? 700 : 400,
                      fontSize: "0.55rem",
                      top: 0,
                    }}
                    title={`Aller en ${ky}`}
                  >
                    {ky === 1900 || ky === 1945 || ky === 1989 || ky === 2025 ? ky : "·"}
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
            onMouseDown={onYearBtnsDown}
            onMouseUp={onYearBtnsUp}
            onMouseLeave={onYearBtnsLeave}
            onMouseMove={onYearBtnsMove}
          >
            {KEY_YEARS.map((ky) => (
              <button
                key={ky}
                onClick={() => setYear(ky)}
                className="px-2 py-0.5 rounded text-xs font-medium transition-all duration-150 shrink-0 select-none"
                style={
                  ky === year
                    ? { background: "var(--accent-dim)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.3)", fontWeight: 700 }
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
            <PoliticsInteractiveMap
              politicsData={politicsData}
              selectedCountry={selectedCountry}
              onCountryClick={handleCountryClick}
            />
          </div>

          <PoliticsSidePanel
            countryName={selectedCountry}
            period={selectedPeriod}
            year={year}
            open={sidePanelOpen}
            onClose={() => setSidePanelOpen(false)}
          />
        </div>

        {/* Source note */}
        <div
          className="px-5 py-1.5 border-t flex items-center justify-end"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <p style={{ color: "var(--ink-4)", fontSize: "0.6rem" }}>
            Source : données compilées à partir de sources académiques et institutionnelles — à titre éditorial
          </p>
        </div>
      </div>

      {/* Orientation summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
        {(["far_left", "left", "center", "right", "far_right"] as const).map((ori) => {
          const count = Object.values(politicsData).filter((p) => p.orientation === ori).length;
          return (
            <div
              key={ori}
              className="rounded-xl px-4 py-3 flex flex-col gap-1.5"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ background: ORIENTATION_COLORS[ori] }} />
                <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 700 }}>
                  {ORIENTATION_LABELS[ori]}
                </p>
              </div>
              <p className="text-2xl font-bold tabular-nums" style={{ color: ORIENTATION_COLORS[ori] }}>{count}</p>
              <p style={{ color: "var(--ink-4)", fontSize: "0.6rem" }}>pays en {year}</p>
            </div>
          );
        })}
      </div>

      {/* Article carousels */}
      <div
        className="mt-6 rounded-2xl p-5 flex flex-col gap-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
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
          articles={politicsArticles}
          title="Analyses politiques"
          subtitle="Tous les articles de l'onglet Politique"
          emptyMessage="Aucun article disponible pour cet onglet."
          icon="newspaper"
        />
      </div>

      {/* Municipal elections */}
      <MunicipalElectionsSection />

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #39FF88;
          border: 2px solid #0D7A40;
          cursor: pointer;
          box-shadow: 0 0 6px rgba(57,255,136,0.5);
        }
        input[type=range]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #39FF88;
          border: 2px solid #0D7A40;
          cursor: pointer;
          box-shadow: 0 0 6px rgba(57,255,136,0.5);
        }
      `}</style>
    </>
  );
}

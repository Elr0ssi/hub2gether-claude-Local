"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Maximize2, Minimize2, ChevronLeft, PenLine, Map, Navigation, Satellite } from "lucide-react";
import { EconomyInteractiveMap } from "./EconomyInteractiveMap";
import { EconomyLeafletMap, type LeafletTileStyle } from "./EconomyLeafletMap";
import { EconomySidePanel } from "@/components/sidebar/EconomySidePanel";
import { EconomyRankingsTable } from "./EconomyRankingsTable";
import { ThemeDropdown } from "./ThemeDropdown";
import { ECONOMY_METRICS, ECONOMY_YEARS, ECONOMY_YEAR_VALUES, getYearData, DEFAULT_YEAR } from "@/data/economy/economy";
import type { EconomyMetricId, EconomyYear } from "@/types";

function computeLiveYearData(baseYear: EconomyYear): EconomyYear {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const dayOfYear = Math.ceil((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const fraction = dayOfYear / 365;
  const dateStr = today.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });

  const liveCountries: EconomyYear["countries"] = {};
  for (const [country, data] of Object.entries(baseYear.countries)) {
    liveCountries[country] = {
      ...data,
      // GDP is a flow: prorate to days elapsed. Rates (debt/unemployment/companies) are stocks — unchanged.
      gdp: Math.round(data.gdp * fraction),
    };
  }
  return {
    year: today.getFullYear(),
    label: "Depuis 2026",
    dataNote: `Prorata ${baseYear.year} au ${dateStr} (jour ${dayOfYear}/365). PIB = annuel × fraction. Taux : derniers chiffres disponibles.`,
    countries: liveCountries,
  };
}

type MapStyle = "editorial" | LeafletTileStyle;

const MAP_STYLES: { id: MapStyle; label: string; Icon: React.ElementType }[] = [
  { id: "editorial", label: "Éditorial",  Icon: PenLine   },
  { id: "standard",  label: "Standard",   Icon: Map       },
  { id: "detailed",  label: "Détaillé",   Icon: Navigation },
  { id: "satellite", label: "Satellite",  Icon: Satellite  },
];

export function EconomyMapView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyle>("editorial");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ytdMode, setYtdMode] = useState(false);

  const metric = (searchParams.get("metric") ?? "gdp") as EconomyMetricId;
  const year = parseInt(searchParams.get("year") ?? String(DEFAULT_YEAR));
  const economyYear = getYearData(year) ?? ECONOMY_YEARS[ECONOMY_YEARS.length - 1];
  const isCurrentYear = year === DEFAULT_YEAR;

  // For "En direct": use previous year as base for prorating (2024 → live 2025 estimate)
  const prevEconomyYear = useMemo(
    () => ECONOMY_YEARS.find((y) => y.year === year - 1) ?? economyYear,
    [year, economyYear]
  );

  const activeEconomyYear = useMemo(
    () => (ytdMode && isCurrentYear ? computeLiveYearData(prevEconomyYear) : economyYear),
    [economyYear, ytdMode, isCurrentYear, prevEconomyYear]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsFullscreen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const handleMetricChange = useCallback((id: EconomyMetricId) => {
    updateParam("metric", id);
  }, [updateParam]);

  const handleYearChange = useCallback((y: number) => {
    updateParam("year", y.toString());
  }, [updateParam]);

  const handleCountryClick = useCallback((name: string) => {
    setSelectedCountry(name);
    setSidePanelOpen(true);
  }, []);

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
          <div className="flex items-center gap-3 flex-wrap">
            <ThemeDropdown currentTheme="economy" />
            <div className="h-4 w-px" style={{ background: "var(--border)" }} />

            {/* Metric selector */}
            <div className="flex items-center gap-1 flex-wrap">
              {ECONOMY_METRICS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleMetricChange(m.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                  style={
                    m.id === metric
                      ? { background: "var(--accent-dim)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.3)", fontWeight: 700 }
                      : { background: "transparent", color: "var(--ink-3)", border: "1px solid transparent" }
                  }
                >
                  {m.shortLabel}
                </button>
              ))}
            </div>

          </div>

          <div className="flex items-center gap-2">
            {/* Map style switcher */}
            <div className="flex items-center rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              {MAP_STYLES.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setMapStyle(id)}
                  title={label}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-all duration-150"
                  style={
                    id === mapStyle
                      ? { background: "var(--accent-dim)", color: "#0D7A40", borderRight: "1px solid rgba(57,255,136,0.2)" }
                      : { background: "var(--surface-2)", color: "var(--ink-3)", borderRight: "1px solid var(--border)" }
                  }
                >
                  <Icon size={12} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

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

        {/* Year selector */}
        <div
          className="px-5 py-2 border-b flex items-center gap-3 overflow-x-auto"
          style={{ borderColor: "var(--border)", background: "var(--surface)", scrollbarWidth: "none" }}
        >
          <span className="text-xs font-semibold shrink-0" style={{ color: "var(--ink-3)" }}>Année :</span>
          <div className="flex items-center gap-1">
            {ECONOMY_YEAR_VALUES.map((y) => (
              <button
                key={y}
                onClick={() => { handleYearChange(y); setYtdMode(false); }}
                className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 shrink-0"
                style={
                  y === year && !ytdMode
                    ? { background: "var(--accent-dim)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.3)", fontWeight: 700 }
                    : { background: "transparent", color: "var(--ink-3)", border: "1px solid transparent" }
                }
              >
                {y}
                {y === DEFAULT_YEAR && (
                  <span className="text-xs px-1 rounded" style={{ background: "rgba(57,255,136,0.2)", color: "#0D7A40", fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.04em" }}>
                    PROJ
                  </span>
                )}
              </button>
            ))}

            {/* "Depuis 2026" button — toujours visible */}
            <>
              <div className="w-px h-4 shrink-0 mx-1" style={{ background: "var(--border)" }} />
              <button
                onClick={() => { handleYearChange(DEFAULT_YEAR); setYtdMode((v) => !v); }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 shrink-0"
                title="PIB au prorata des données 2025 depuis le 1er janvier 2026"
                style={
                  ytdMode && isCurrentYear
                    ? { background: "var(--accent-dim)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.3)", fontWeight: 700 }
                    : { background: "transparent", color: "var(--ink-3)", border: "1px solid var(--border)" }
                }
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: ytdMode && isCurrentYear ? "#39FF88" : "var(--ink-4)",
                    boxShadow: ytdMode && isCurrentYear ? "0 0 6px rgba(57,255,136,0.8)" : "none",
                    animation: ytdMode && isCurrentYear ? "pulse-glow 2s ease-in-out infinite" : "none",
                  }}
                />
                Depuis 2026
              </button>
            </>
          </div>
          {ytdMode && isCurrentYear && (
            <span className="ml-auto text-xs shrink-0" style={{ color: "var(--ink-4)" }}>
              Prorata au {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
            </span>
          )}
        </div>

        {/* Map + Side panel */}
        <div className={`flex flex-col lg:flex-row${isFullscreen ? " flex-1 overflow-hidden" : ""}`} style={isFullscreen ? {} : { minHeight: "480px" }}>
          <div className="flex-1 overflow-hidden" style={{ minWidth: 0 }}>
            {mapStyle === "editorial" ? (
              <EconomyInteractiveMap
                economyYear={activeEconomyYear}
                metric={metric}
                selectedCountry={selectedCountry}
                onCountryClick={handleCountryClick}
              />
            ) : (
              <EconomyLeafletMap
                economyYear={activeEconomyYear}
                metric={metric}
                selectedCountry={selectedCountry}
                onCountryClick={handleCountryClick}
                tileStyle={mapStyle}
                fillHeight={isFullscreen}
              />
            )}
          </div>

          <EconomySidePanel
            countryName={selectedCountry}
            yearData={activeEconomyYear}
            metric={metric}
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
            Source : {activeEconomyYear.dataNote}
          </p>
        </div>
      </div>

      {/* Rankings table */}
      <EconomyRankingsTable
        metric={metric}
        year={year}
        activeEconomyYear={activeEconomyYear}
        ytdMode={ytdMode}
        onCountryClick={(name) => {
          setSelectedCountry(name);
          setSidePanelOpen(true);
        }}
      />
    </>
  );
}

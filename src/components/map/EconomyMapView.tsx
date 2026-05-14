"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Maximize2, Minimize2, ChevronLeft, PenLine, Map, Navigation, Satellite, CalendarDays } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { EconomyInteractiveMap } from "./EconomyInteractiveMap";
import { EconomyLeafletMap, type LeafletTileStyle } from "./EconomyLeafletMap";
import { EconomySidePanel } from "@/components/sidebar/EconomySidePanel";
import { ThemeDropdown } from "./ThemeDropdown";
import { ECONOMY_METRICS, ECONOMY_YEARS, ECONOMY_YEAR_VALUES, getYearData, DEFAULT_YEAR } from "@/data/economy/economy";
import type { EconomyMetricId, EconomyYear } from "@/types";

function computeYtdEconomyYear(economyYear: EconomyYear): EconomyYear {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const dayOfYear = Math.ceil((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const fraction = dayOfYear / 365;

  const ytdCountries: EconomyYear["countries"] = {};
  for (const [country, data] of Object.entries(economyYear.countries)) {
    ytdCountries[country] = {
      ...data,
      // GDP is a flow: prorate to days elapsed. Rates (debt, unemployment, companies) stay unchanged.
      gdp: Math.round(data.gdp * fraction),
    };
  }
  return {
    ...economyYear,
    label: `${economyYear.year} YTD`,
    dataNote: `${economyYear.dataNote} — Vue YTD : PIB annuel × ${dayOfYear} jours / 365.`,
    countries: ytdCountries,
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

  const activeEconomyYear = useMemo(
    () => (ytdMode && isCurrentYear && metric === "gdp" ? computeYtdEconomyYear(economyYear) : economyYear),
    [economyYear, ytdMode, isCurrentYear, metric]
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
    setSelectedCountry(null);
  }, [updateParam]);

  const handleYearChange = useCallback((y: number) => {
    updateParam("year", y.toString());
    setSelectedCountry(null);
  }, [updateParam]);

  const handleCountryClick = useCallback((name: string) => {
    setSelectedCountry(name);
    setSidePanelOpen(true);
  }, []);

  const currentMetric = ECONOMY_METRICS.find((m) => m.id === metric) ?? ECONOMY_METRICS[0];

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

            {/* YTD toggle — only for current year + GDP metric */}
            {isCurrentYear && metric === "gdp" && (
              <>
                <div className="h-4 w-px" style={{ background: "var(--border)" }} />
                <button
                  onClick={() => setYtdMode((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                  style={
                    ytdMode
                      ? { background: "var(--accent-dim)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.3)", fontWeight: 700 }
                      : { background: "transparent", color: "var(--ink-3)", border: "1px solid var(--border)" }
                  }
                  title="PIB généré depuis le 1er janvier — prorata annuel au jour actuel"
                >
                  <CalendarDays size={11} />
                  Depuis le 1er jan.
                </button>
              </>
            )}
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
              {isFullscreen ? "Réduire" : "Expand"}
            </button>
          </div>
        </div>

        {/* Year selector */}
        <div
          className="px-5 py-2 border-b flex items-center gap-3 overflow-x-auto"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <span className="text-xs font-semibold shrink-0" style={{ color: "var(--ink-3)" }}>Année :</span>
          <div className="flex items-center gap-1">
            {ECONOMY_YEAR_VALUES.map((y) => (
              <button
                key={y}
                onClick={() => { handleYearChange(y); setYtdMode(false); }}
                className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200"
                style={
                  y === year
                    ? { background: "var(--accent-dim)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.3)", fontWeight: 700 }
                    : { background: "transparent", color: "var(--ink-3)", border: "1px solid transparent" }
                }
              >
                {y}
                {y === DEFAULT_YEAR && (
                  <span className="text-xs px-1 rounded" style={{ background: "rgba(57,255,136,0.2)", color: "#0D7A40", fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.04em" }}>
                    LIVE
                  </span>
                )}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs shrink-0" style={{ color: "var(--ink-4)" }}>
            {ytdMode && isCurrentYear
              ? `PIB ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}`
              : `${Object.keys(economyYear.countries).length} pays`}
          </span>
        </div>

        {/* Map + Side panel */}
        <div className={`flex${isFullscreen ? " flex-1 overflow-hidden" : ""}`} style={isFullscreen ? {} : { minHeight: "480px" }}>
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
      </div>

      {/* Info blocks */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${metric}-${year}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4"
        >
          <div className="rounded-xl px-4 py-4 flex flex-col gap-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700 }}>
              Indicateur affiché
            </p>
            <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{currentMetric.label}</p>
            <p className="text-small leading-relaxed" style={{ color: "var(--ink-2)" }}>{currentMetric.description}</p>
          </div>

          <div className="rounded-xl px-4 py-4 flex flex-col gap-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700 }}>
              Période
            </p>
            <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
              {ytdMode && isCurrentYear
                ? `${year} · ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`
                : year}
            </p>
            <p className="text-small" style={{ color: "var(--ink-3)" }}>
              {ytdMode && isCurrentYear
                ? `PIB généré depuis le 1er janvier ${year} — prorata au jour actuel`
                : year === 2020
                ? "Année COVID-19 — forte contraction mondiale"
                : year === 2025
                ? "Projections FMI avril 2025 — données les plus récentes"
                : `Données économiques mondiales ${year}`}
            </p>
          </div>

          <div className="rounded-xl px-4 py-4 flex flex-col gap-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700 }}>
              Couverture
            </p>
            <div className="space-y-2 mt-1">
              {ECONOMY_METRICS.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-2">
                  <span className="text-small" style={{ color: "var(--ink-3)" }}>{m.label}</span>
                  <span className="text-small font-semibold" style={{ color: m.id === metric ? "var(--accent)" : "var(--ink)" }}>
                    {m.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl px-4 py-4 flex flex-col gap-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700 }}>
              Source des données
            </p>
            <p className="text-small leading-relaxed" style={{ color: "var(--ink-4)" }}>
              {economyYear.dataNote}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

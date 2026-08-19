"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Maximize2, Minimize2, ChevronLeft, Map, Globe } from "lucide-react";
import { EconomyInteractiveMap } from "./EconomyInteractiveMap";
import dynamic from "next/dynamic";

// WebGL and the world file are only paid for when the reader asks for the globe.
const EconomyGlobe = dynamic(() => import("./EconomyGlobe").then((m) => m.EconomyGlobe), {
  ssr: false,
  loading: () => null,
});
import { EconomySidePanel } from "@/components/sidebar/EconomySidePanel";
import { EconomyRankingsTable } from "./EconomyRankingsTable";
import { EconomyYearTimeline } from "./EconomyYearTimeline";
import { ECONOMY_METRICS, ECONOMY_YEARS, ECONOMY_YEAR_VALUES, getYearData, DEFAULT_YEAR } from "@/data/economy/economy";
import type { EconomyMetricId, EconomyYear } from "@/types";
import { MapArticleSection } from "@/components/articles/MapArticleSection";
import { AdRail, AdBanner } from "@/components/layout/AdRail";
import { SectionFlowCurves } from "./SectionFlowCurves";
import { useScrollTeleport } from "@/hooks/useScrollTeleport";
import { ECONOMY_ARTICLES } from "@/data/articles";

const SLIDER_MIN = 1950;
const SLIDER_MAX = 2025;

// Top toolbar only ever showed the 4 main metrics. Their family sub-metrics (PIB/hab.,
// Balance commerciale, Montant dette, Inflation, Pop. active, Âge retraite) are switched
// from the side panel's clickable boxes instead (see EconomySidePanel).
const SIDE_PANEL_ONLY_METRICS: EconomyMetricId[] = [
  "gdp_per_capita", "trade_balance", "debt_amount", "inflation", "active_population", "retirement_age",
];
const TOOLBAR_METRICS = ECONOMY_METRICS.filter(
  (m) => !SIDE_PANEL_ONLY_METRICS.includes(m.id)
);

// When a side-panel sub-metric is active, highlight its parent toolbar button
function getToolbarParent(metric: EconomyMetricId): EconomyMetricId {
  if (metric === "gdp_per_capita" || metric === "trade_balance") return "gdp";
  if (metric === "debt_amount" || metric === "inflation") return "debt_ratio";
  if (metric === "active_population" || metric === "retirement_age") return "unemployment";
  return metric;
}

function findNearestDataYear(target: number): number {
  return ECONOMY_YEAR_VALUES.reduce((prev, curr) =>
    Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
  );
}

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
    label: "En direct",
    dataNote: `Prorata ${baseYear.year} au ${dateStr} (jour ${dayOfYear}/365). PIB = annuel × fraction. Taux : derniers chiffres disponibles.`,
    countries: liveCountries,
  };
}

export function EconomyMapView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ytdMode, setYtdMode] = useState(false);
  const [view, setView] = useState<"map" | "globe">("map");
  const mapSectionRef = useRef<HTMLElement>(null);
  const rankSectionRef = useRef<HTMLElement>(null);
  const articleSectionRef = useRef<HTMLElement>(null);
  // Local slider position: 2000-2025 (continuous), separate from data year
  const [sliderYear, setSliderYear] = useState(DEFAULT_YEAR);

  const metric = (searchParams.get("metric") ?? "gdp") as EconomyMetricId;
  const year = parseInt(searchParams.get("year") ?? String(DEFAULT_YEAR));
  const economyYear = getYearData(year) ?? ECONOMY_YEARS[ECONOMY_YEARS.length - 1];
  const isCurrentYear = year === DEFAULT_YEAR;

  // Keep the rail in sync when the URL year changes from somewhere else, but
  // never overwrite a pick the reader just made: a year the dataset does not
  // cover resolves to a neighbouring data year, and re-seeding from that year
  // would silently snap the rail back off the mark they aimed at.
  useEffect(() => {
    setSliderYear((prev) => (findNearestDataYear(prev) === year ? prev : year));
  }, [year]);

  // For "En direct": use previous year as base for prorating (2024 → live 2025 estimate)
  const prevEconomyYear = useMemo(
    () => ECONOMY_YEARS.find((y) => y.year === year - 1) ?? economyYear,
    [year, economyYear]
  );

  const activeEconomyYear = useMemo(
    () => (ytdMode && isCurrentYear ? computeLiveYearData(prevEconomyYear) : economyYear),
    [economyYear, ytdMode, isCurrentYear, prevEconomyYear]
  );

  // One gesture, one section — see the hook for what it deliberately leaves
  // alone. Suspended in fullscreen, where the page is not what is being read.
  useScrollTeleport({ selector: ".eco-snap-target", offset: 64, enabled: !isFullscreen });

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
    // Three full-bleed stops. Each section owns a viewport: its mint ground
    // runs edge to edge, it holds at least the full height under the navbar,
    // and it is a scroll-snap target — so arriving at one means seeing only
    // that one, never the tail of the block before it.
    <div className="eco-snap">
      {/* ── Carte interactive ── */}
      <section
        ref={mapSectionRef}
        className={isFullscreen ? undefined : "eco-section eco-snap-target"}
      >
        {!isFullscreen && <SectionFlowCurves sectionRef={mapSectionRef} index={0} />}
        <div className="eco-section-body">
          <div className="eco-section-row">
          <AdRail side="left" />
          <div className="eco-section-main">
            <AdBanner />
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
            {/* Metric selector */}
            <div className="flex items-center gap-1 flex-wrap">
              {TOOLBAR_METRICS.map((m) => {
                const isActive = m.id === getToolbarParent(metric);
                const isSubMetric = isActive && m.id !== metric;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleMetricChange(m.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                    style={
                      isActive
                        ? { background: "var(--accent-dim)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.3)", fontWeight: 700, opacity: isSubMetric ? 0.7 : 1 }
                        : { background: "transparent", color: "var(--ink-3)", border: "1px solid transparent" }
                    }
                  >
                    {m.shortLabel}
                    {isSubMetric && <span style={{ fontSize: "0.55rem", marginLeft: 3, opacity: 0.8 }}>▾</span>}
                  </button>
                );
              })}
            </div>

          </div>

          <div className="flex items-center gap-2">
            {/* Flat map or globe — same data, same colours, same click. */}
            <div
              className="flex items-center rounded-lg overflow-hidden"
              style={{ border: "1px solid var(--border)" }}
            >
              {([
                { id: "map" as const, label: "Carte", Icon: Map },
                { id: "globe" as const, label: "Globe", Icon: Globe },
              ]).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-all duration-150"
                  style={
                    view === id
                      ? { background: "var(--accent-dim)", color: "#0D7A40", fontWeight: 700 }
                      : { background: "transparent", color: "var(--ink-3)" }
                  }
                  aria-pressed={view === id}
                >
                  <Icon size={13} />
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
        <EconomyYearTimeline
          min={SLIDER_MIN}
          max={SLIDER_MAX}
          dataYears={ECONOMY_YEAR_VALUES}
          value={sliderYear}
          dataYear={year}
          onChange={(y) => {
            setSliderYear(y);
            const target = findNearestDataYear(y);
            if (target !== year) handleYearChange(target);
            setYtdMode(false);
          }}
          countryCount={Object.keys(activeEconomyYear.countries).length}
          liveMode={ytdMode}
          onLive={() => {
            setSliderYear(DEFAULT_YEAR);
            handleYearChange(DEFAULT_YEAR);
            setYtdMode(true);
          }}
        />

        {/* Map + Side panel */}
        {/* The map area gives way on short screens: the card also carries a
            toolbar, the year rail and a source line, and the section around it
            has its own padding, so a fixed height overflowed a 1440x800
            laptop. */}
        <div
          className={`flex flex-col lg:flex-row${isFullscreen ? " flex-1 overflow-hidden" : ""}`}
          style={
            isFullscreen
              ? {}
              : {
                  // A definite height, not a range. The card also carries a
                  // toolbar, the year rail and a source line, and the section
                  // around it has its own padding — 330px in all, which is why
                  // an intrinsic height ran past the bottom of a 1440x800
                  // laptop. And with only a min and a max, selecting a country
                  // grew the side panel, which grew the row, which resized the
                  // globe's canvas: the sphere rescaled on every click.
                  height: "clamp(320px, calc(100vh - 330px), 520px)",
                  overflow: "hidden",
                }
          }
        >
          <div className="flex-1 overflow-hidden" style={{ minWidth: 0 }}>
            {view === "globe" ? (
              <EconomyGlobe
                economyYear={activeEconomyYear}
                metric={metric}
                selectedCountry={selectedCountry}
                onCountryClick={handleCountryClick}
              />
            ) : (
              <EconomyInteractiveMap
                economyYear={activeEconomyYear}
                metric={metric}
                selectedCountry={selectedCountry}
                onCountryClick={handleCountryClick}
              />
            )}
          </div>

          <EconomySidePanel
            countryName={selectedCountry}
            yearData={activeEconomyYear}
            metric={metric}
            open={sidePanelOpen}
            onClose={() => setSidePanelOpen(false)}
            onMetricChange={handleMetricChange}
          />
        </div>

        {/* Source note */}
        <div
          className="px-5 py-1.5 border-t flex items-center justify-end"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <p style={{ color: "var(--ink-4)", fontSize: "0.6rem" }}>
            {activeEconomyYear.dataNote}
          </p>
        </div>
      </div>

          </div>
          <AdRail side="right" />
          </div>
        </div>
      </section>

      {/* ── Classement mondial ── */}
      <section ref={rankSectionRef} className="eco-section eco-snap-target">
        <SectionFlowCurves sectionRef={rankSectionRef} index={1} />
        <div className="eco-section-body">
          <div className="eco-section-row">
          <AdRail side="left" />
          <div className="eco-section-main">
            <AdBanner />
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
          </div>
          <AdRail side="right" />
          </div>
        </div>
      </section>

      {/* ── Articles ── */}
      <section ref={articleSectionRef} className="eco-section eco-snap-target">
        <SectionFlowCurves sectionRef={articleSectionRef} index={2} />
        <div className="eco-section-body">
          <div className="eco-section-row">
          <AdRail side="left" />
          <div className="eco-section-main">
            <AdBanner />
            <MapArticleSection
              themeArticles={ECONOMY_ARTICLES}
              selectedCountry={selectedCountry}
              themeLabel="Économie mondiale"
              spacing={0}
            />
          </div>
          <AdRail side="right" />
          </div>
        </div>
      </section>
    </div>
  );
}

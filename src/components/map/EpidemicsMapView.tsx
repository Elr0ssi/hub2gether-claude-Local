"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Maximize2, Minimize2, ChevronLeft, PenLine, Map, Navigation, Satellite, CalendarDays } from "lucide-react";
import { EpidemicsInteractiveMap } from "./EpidemicsInteractiveMap";
import { EpidemicsLeafletMap, type LeafletTileStyle } from "./EpidemicsLeafletMap";
import { EpidemicsSidePanel } from "@/components/sidebar/EpidemicsSidePanel";
import { ThemeDropdown } from "./ThemeDropdown";
import { EPIDEMICS, getDiseaseById } from "@/data/epidemics/epidemics";
import { MapArticleSection } from "@/components/articles/MapArticleSection";
import { EPIDEMICS_ARTICLES } from "@/data/articles";
import { useDragScroll } from "@/hooks/useDragScroll";
import type { EpidemicDiseaseId, EpidemicDisease } from "@/types";

function computeYtdDisease(disease: EpidemicDisease): EpidemicDisease {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const dayOfYear = Math.ceil((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const fraction = dayOfYear / 365;

  const ytdCountries: EpidemicDisease["countries"] = {};
  for (const [country, data] of Object.entries(disease.countries)) {
    const annualDeaths = data.deaths_per_year ?? 0;
    ytdCountries[country] = {
      ...data,
      infected: Math.round((data.infected / Math.max(data.deaths, 1)) * annualDeaths * fraction),
      deaths: Math.round(annualDeaths * fraction),
    };
  }
  return { ...disease, countries: ytdCountries };
}

type MapStyle = "editorial" | LeafletTileStyle;

const MAP_STYLES: { id: MapStyle; label: string; Icon: React.ElementType }[] = [
  { id: "editorial", label: "Éditorial",  Icon: PenLine   },
  { id: "standard",  label: "Standard",   Icon: Map       },
  { id: "detailed",  label: "Détaillé",   Icon: Navigation },
  { id: "satellite", label: "Satellite",  Icon: Satellite  },
];

export function EpidemicsMapView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyle>("editorial");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ytdMode, setYtdMode] = useState(false);
  const { ref: diseaseRowRef, onMouseDown: onDiseaseRowDown, onMouseUp: onDiseaseRowUp, onMouseLeave: onDiseaseRowLeave, onMouseMove: onDiseaseRowMove } = useDragScroll();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsFullscreen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const diseaseId = (searchParams.get("disease") ?? "covid") as EpidemicDiseaseId;
  const disease = getDiseaseById(diseaseId) ?? EPIDEMICS[0];

  const activeDisease = useMemo(
    () => (ytdMode && disease.ongoing ? computeYtdDisease(disease) : disease),
    [disease, ytdMode]
  );

  const totalYtdCases = useMemo(() => {
    if (!ytdMode || !disease.ongoing) return null;
    return Object.values(activeDisease.countries).reduce((sum, c) => sum + (c.infected || 0), 0);
  }, [ytdMode, disease.ongoing, activeDisease]);

  const handleDiseaseChange = useCallback(
    (id: EpidemicDiseaseId) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("disease", id);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      setSelectedCountry(null);
      setYtdMode(false);
    },
    [router, pathname, searchParams]
  );

  const handleCountryClick = useCallback((countryName: string) => {
    setSelectedCountry(countryName);
    setSidePanelOpen(true);
  }, []);

  return (
    <>
      {/* Map card */}
      <div
        className={`border rounded-2xl overflow-hidden${isFullscreen ? " fixed inset-0 z-[9999] rounded-none flex flex-col" : ""}`}
        style={{
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-float)",
          background: "var(--surface)",
        }}
      >
        {/* Main toolbar */}
        <div
          className="px-4 py-3 border-b flex items-center justify-between gap-4 flex-wrap"
          style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
        >
          <div className="flex items-center gap-3">
            <ThemeDropdown currentTheme="epidemics" />
          </div>

          <div className="flex items-center gap-2">
            {/* Map style switcher */}
            <div
              className="flex items-center rounded-lg overflow-hidden"
              style={{ border: "1px solid var(--border)" }}
            >
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

        {/* Disease selector (équivalent du sélecteur d'années en économie) */}
        <div
          ref={diseaseRowRef}
          className="px-5 py-2 border-b flex items-center gap-3 overflow-x-auto"
          style={{ borderColor: "var(--border)", background: "var(--surface)", scrollbarWidth: "none", cursor: "grab" }}
          onMouseDown={onDiseaseRowDown}
          onMouseUp={onDiseaseRowUp}
          onMouseLeave={onDiseaseRowLeave}
          onMouseMove={onDiseaseRowMove}
        >
          <span className="text-xs font-semibold shrink-0" style={{ color: "var(--ink-3)" }}>Épidémie :</span>
          <div className="flex items-center gap-1">
            {EPIDEMICS.map((d) => (
              <button
                key={d.id}
                onClick={() => handleDiseaseChange(d.id as EpidemicDiseaseId)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 shrink-0"
                style={
                  d.id === diseaseId
                    ? { background: "var(--accent-dim)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.3)", fontWeight: 700 }
                    : { background: "transparent", color: "var(--ink-3)", border: "1px solid transparent" }
                }
              >
                {d.label}
              </button>
            ))}

            {/* "Depuis 2026" — uniquement pour les épidémies en cours */}
            {disease.ongoing && (
              <>
                <div className="w-px h-4 shrink-0 mx-1" style={{ background: "var(--border)" }} />
                <button
                  onClick={() => setYtdMode((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 shrink-0"
                  title="Cas estimés depuis le 1er janvier 2026"
                  style={
                    ytdMode
                      ? { background: "var(--accent-dim)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.3)", fontWeight: 700 }
                      : { background: "transparent", color: "var(--ink-3)", border: "1px solid var(--border)" }
                  }
                >
                  <CalendarDays size={11} />
                  Depuis 2026
                </button>
              </>
            )}
          </div>
          {ytdMode && disease.ongoing && totalYtdCases !== null && (
            <span className="ml-auto text-xs shrink-0" style={{ color: "var(--ink-4)" }}>
              {totalYtdCases.toLocaleString("fr-FR")} cas en 2026
            </span>
          )}
        </div>

        {/* Sub-header */}
        <div
          className="px-5 py-2 border-b flex items-center gap-2 flex-wrap"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
            {disease.label}
          </span>
          <span className="text-xs" style={{ color: "var(--ink-4)" }}>
            · {disease.period}
          </span>
          <span className="text-xs ml-auto" style={{ color: "var(--ink-4)" }}>
            {Object.keys(disease.countries).length} pays documentés
          </span>
        </div>

        {/* Map + Side panel */}
        <div className={`flex flex-col lg:flex-row${isFullscreen ? " flex-1 overflow-hidden" : ""}`} style={isFullscreen ? {} : { minHeight: "480px" }}>
          <div className="flex-1 overflow-hidden" style={{ minWidth: 0 }}>
            {mapStyle === "editorial" ? (
              <EpidemicsInteractiveMap
                disease={activeDisease}
                selectedCountry={selectedCountry}
                onCountryClick={handleCountryClick}
              />
            ) : (
              <EpidemicsLeafletMap
                disease={activeDisease}
                selectedCountry={selectedCountry}
                onCountryClick={handleCountryClick}
                tileStyle={mapStyle}
                fillHeight={isFullscreen}
              />
            )}
          </div>

          <EpidemicsSidePanel
            disease={activeDisease}
            countryName={selectedCountry}
            open={sidePanelOpen}
            onClose={() => setSidePanelOpen(false)}
            isYtd={ytdMode && !!disease.ongoing}
          />
        </div>

        {/* Source note */}
        <div
          className="px-5 py-1.5 border-t flex items-center justify-end"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <p style={{ color: "var(--ink-4)", fontSize: "0.6rem" }}>
            {disease.dataNote}
            {ytdMode && disease.ongoing && " · Vue 2026 : prorata annuel 2024 × jours écoulés / 365."}
          </p>
        </div>
      </div>

      <MapArticleSection
        themeArticles={EPIDEMICS_ARTICLES}
        selectedCountry={selectedCountry}
        themeLabel="Épidémies & Santé"
      />
    </>
  );
}

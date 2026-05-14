"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Maximize2, Minimize2, ChevronLeft, PenLine, Map, Navigation, Satellite, CalendarDays } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { EpidemicsInteractiveMap } from "./EpidemicsInteractiveMap";
import { EpidemicsLeafletMap, type LeafletTileStyle } from "./EpidemicsLeafletMap";
import { EpidemicsSidePanel } from "@/components/sidebar/EpidemicsSidePanel";
import { ThemeDropdown } from "./ThemeDropdown";
import { EPIDEMICS, getDiseaseById } from "@/data/epidemics/epidemics";
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
  const cardRef = useRef<HTMLDivElement>(null);

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
        ref={cardRef}
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
          <div className="flex items-center gap-3 flex-wrap">
            <ThemeDropdown currentTheme="epidemics" />
            <div className="h-4 w-px" style={{ background: "var(--border)" }} />

            {/* Disease selector */}
            <div className="flex items-center gap-1 flex-wrap">
              {EPIDEMICS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleDiseaseChange(d.id as EpidemicDiseaseId)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                  style={
                    d.id === diseaseId
                      ? { background: "var(--accent-dim)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.3)", fontWeight: 700 }
                      : { background: "transparent", color: "var(--ink-3)", border: "1px solid transparent" }
                  }
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* YTD toggle — only for ongoing diseases */}
            {disease.ongoing && (
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
                  title="Estimation au prorata du nombre de jours écoulés depuis le 1er janvier"
                >
                  <CalendarDays size={11} />
                  Depuis le 1er jan.
                </button>
              </>
            )}
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
              {isFullscreen ? "Réduire" : "Expand"}
            </button>
          </div>
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
          {ytdMode && disease.ongoing && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: "var(--accent-dim)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.25)" }}
            >
              Estimation {new Date().getFullYear()} · au {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
            </span>
          )}
          <span className="text-xs ml-auto" style={{ color: "var(--ink-4)" }}>
            {Object.keys(disease.countries).length} pays documentés
          </span>
        </div>

        {/* Map + Side panel */}
        <div className={`flex${isFullscreen ? " flex-1 overflow-hidden" : ""}`} style={isFullscreen ? {} : { minHeight: "480px" }}>
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
      </div>

      {/* Disease info blocks */}
      <AnimatePresence mode="wait">
        <motion.div
          key={diseaseId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4"
        >
          <div className="rounded-xl px-4 py-4 flex flex-col gap-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700 }}>
              À propos de {disease.label}
            </p>
            <p className="text-small leading-relaxed" style={{ color: "var(--ink-2)" }}>
              {disease.description}
            </p>
          </div>

          <div className="rounded-xl px-4 py-4 flex flex-col gap-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700 }}>
              Agent pathogène
            </p>
            <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
              {disease.pathogen}
            </p>
          </div>

          <div className="rounded-xl px-4 py-4 flex flex-col gap-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700 }}>
              {ytdMode && disease.ongoing
                ? `Estimation ${new Date().getFullYear()} · au ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`
                : "Chiffres mondiaux"}
            </p>
            <div className="space-y-2 mt-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-small" style={{ color: "var(--ink-3)" }}>
                  {ytdMode && disease.ongoing ? "Cas estimés YTD" : "Cas totaux"}
                </span>
                <span className="text-small font-semibold" style={{ color: "var(--ink)" }}>{disease.globalCases}</span>
              </div>
              <div style={{ height: "1px", background: "var(--border)" }} />
              <div className="flex items-center justify-between gap-2">
                <span className="text-small" style={{ color: "var(--ink-3)" }}>
                  {ytdMode && disease.ongoing ? "Décès estimés YTD" : "Décès totaux"}
                </span>
                <span className="text-small font-semibold" style={{ color: "var(--accent)" }}>{disease.globalDeaths}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl px-4 py-4 flex flex-col gap-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700 }}>
              Source des données
            </p>
            <p className="text-small leading-relaxed" style={{ color: "var(--ink-4)" }}>
              {disease.dataNote}
              {ytdMode && disease.ongoing && (
                <> · <span style={{ color: "var(--accent)" }}>Vue YTD : prorata annuel 2024 × jours écoulés / 365.</span></>
              )}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

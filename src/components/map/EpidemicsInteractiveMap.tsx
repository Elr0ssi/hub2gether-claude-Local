"use client";

import { useState, useCallback } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, type GeographyItem } from "react-simple-maps";
import { Plus, Minus, Maximize } from "lucide-react";
import type { EpidemicDisease } from "@/types";
import { getMaxDeaths, getCountryFillColor, GRADIENT_CSS } from "@/lib/epidemicsColors";

const WORLD_MAP_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface EpidemicsInteractiveMapProps {
  disease: EpidemicDisease;
  selectedCountry: string | null;
  onCountryClick: (countryName: string) => void;
}

export function EpidemicsInteractiveMap({ disease, selectedCountry, onCountryClick }: EpidemicsInteractiveMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [flashCountry, setFlashCountry] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([20, 10]);
  const maxDeaths = getMaxDeaths(disease.countries);

  const handleClick = useCallback((name: string, hasData: boolean) => {
    if (!hasData) return;
    onCountryClick(name);
    setFlashCountry(name);
    setTimeout(() => setFlashCountry(null), 700);
  }, [onCountryClick]);

  return (
    <div className="relative w-full" style={{ aspectRatio: "16/9", minHeight: "420px" }}>
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ center: [20, 10], scale: 155 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          zoom={zoom}
          center={center}
          onMoveEnd={({ coordinates, zoom: z }) => {
            setCenter(coordinates);
            setZoom(z);
          }}
        >
          <Geographies geography={WORLD_MAP_URL}>
            {({ geographies }) =>
              geographies.map((geo: GeographyItem) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const name: string = (geo as any).properties?.name ?? "";
                const isHovered = hoveredCountry === name;
                const isSelected = selectedCountry === name;
                const isFlashing = flashCountry === name;
                const hasData = Boolean(disease.countries[name]);
                const fill = getCountryFillColor(name, disease.countries, maxDeaths, isHovered, false);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={isSelected ? "#fff" : "#C8C8C8"}
                    strokeWidth={isSelected ? 1.4 : 0.35}
                    className={isFlashing ? "map-white-flash" : ""}
                    onClick={() => handleClick(name, hasData)}
                    onMouseEnter={() => setHoveredCountry(name)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{
                      default: { outline: "none", cursor: hasData ? "pointer" : "default" },
                      hover: { outline: "none", cursor: hasData ? "pointer" : "default" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Zoom controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
        {[
          { icon: Plus,     action: () => setZoom((z) => Math.min(z * 1.5, 10)), label: "Zoom +" },
          { icon: Minus,    action: () => setZoom((z) => Math.max(z / 1.5, 1)),  label: "Zoom −" },
          { icon: Maximize, action: () => { setZoom(1); setCenter([20, 10]); },   label: "Reset" },
        ].map(({ icon: Icon, action, label }) => (
          <button
            key={label}
            onClick={action}
            aria-label={label}
            className="w-7 h-7 flex items-center justify-center rounded-lg"
            style={{
              background: "rgba(255,255,255,0.92)",
              border: "1px solid var(--border)",
              color: "var(--ink-2)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <Icon size={13} />
          </button>
        ))}
      </div>

      {/* Legend */}
      <div
        className="absolute bottom-3 left-3 px-3 py-2.5 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.93)",
          border: "1px solid var(--border)",
          backdropFilter: "blur(8px)",
          minWidth: "130px",
        }}
      >
        <p style={{ color: "var(--ink-3)", fontSize: "0.62rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, marginBottom: "6px" }}>
          Décès cumulés
        </p>
        <div className="h-2 rounded-full mb-1" style={{ background: GRADIENT_CSS }} />
        <div className="flex justify-between">
          <span style={{ color: "var(--ink-4)", fontSize: "0.6rem" }}>Faible</span>
          <span style={{ color: "var(--ink-4)", fontSize: "0.6rem" }}>Élevé</span>
        </div>
        <p style={{ color: "var(--ink-4)", fontSize: "0.58rem", marginTop: "5px" }}>
          Gris clair = données insuffisantes
        </p>
      </div>

      {!selectedCountry && (
        <div
          className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid var(--border)",
            color: "var(--ink-3)",
            backdropFilter: "blur(8px)",
          }}
        >
          Cliquez sur un pays
        </div>
      )}
      <style>{`
        @keyframes map-white-flash-anim {
          0%   { filter: drop-shadow(0 0 0px rgba(255,255,255,0)); }
          20%  { filter: drop-shadow(0 0 10px rgba(255,255,255,1)) drop-shadow(0 0 22px rgba(255,255,255,0.6)); }
          60%  { filter: drop-shadow(0 0 6px rgba(255,255,255,0.4)); }
          100% { filter: drop-shadow(0 0 0px rgba(255,255,255,0)); }
        }
        .map-white-flash { animation: map-white-flash-anim 0.65s ease-out forwards; }
      `}</style>
    </div>
  );
}

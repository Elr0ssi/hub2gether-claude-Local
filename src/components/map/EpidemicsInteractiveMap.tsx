"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, type GeographyItem } from "react-simple-maps";
import type { EpidemicDisease } from "@/types";

const WORLD_MAP_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface EpidemicsInteractiveMapProps {
  disease: EpidemicDisease;
  selectedCountry: string | null;
  onCountryClick: (countryName: string) => void;
}

function getMaxDeaths(disease: EpidemicDisease): number {
  return Math.max(...Object.values(disease.countries).map((d) => d.deaths), 1);
}

function getCountryIntensity(countryName: string, disease: EpidemicDisease, maxDeaths: number): number {
  const data = disease.countries[countryName];
  if (!data || data.deaths === 0) return 0;
  return Math.log10(data.deaths + 1) / Math.log10(maxDeaths + 1);
}

function getCountryFill(countryName: string, disease: EpidemicDisease, maxDeaths: number, isHovered: boolean, isSelected: boolean): string {
  if (isSelected) return "rgba(57, 255, 136, 0.85)";
  const intensity = getCountryIntensity(countryName, disease, maxDeaths);
  if (intensity === 0) return isHovered ? "#EBEBEB" : "#F2F2F2";
  const base = 0.12 + intensity * 0.6;
  const opacity = isHovered ? Math.min(base + 0.15, 0.95) : base;
  return `rgba(57, 255, 136, ${opacity.toFixed(2)})`;
}

export function EpidemicsInteractiveMap({ disease, selectedCountry, onCountryClick }: EpidemicsInteractiveMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const maxDeaths = getMaxDeaths(disease);

  return (
    <div className="relative w-full" style={{ aspectRatio: "16/9", minHeight: "420px" }}>
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ center: [20, 10], scale: 155 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={WORLD_MAP_URL}>
          {({ geographies }) =>
            geographies.map((geo: GeographyItem) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const name: string = (geo as any).properties?.name ?? "";
              const isHovered = hoveredCountry === name;
              const isSelected = selectedCountry === name;
              const hasData = Boolean(disease.countries[name]);
              const fill = getCountryFill(name, disease, maxDeaths, isHovered, isSelected);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke={isSelected ? "#39FF88" : "#D8D8D8"}
                  strokeWidth={isSelected ? 1.2 : 0.4}
                  onClick={() => {
                    if (hasData) onCountryClick(name);
                  }}
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
      </ComposableMap>

      {/* Legend */}
      <div
        className="absolute bottom-3 left-3 px-3 py-2 rounded-xl text-xs"
        style={{
          background: "rgba(255,255,255,0.92)",
          border: "1px solid var(--border)",
          backdropFilter: "blur(8px)",
        }}
      >
        <p className="font-semibold mb-1.5" style={{ color: "var(--ink-2)", fontSize: "0.65rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Décès cumulés
        </p>
        <div className="flex items-center gap-2">
          <div
            className="w-20 h-2 rounded-full"
            style={{ background: "linear-gradient(to right, rgba(57,255,136,0.12), rgba(57,255,136,0.85))" }}
          />
          <div className="flex justify-between w-20" style={{ marginLeft: "-80px", position: "relative", top: "12px" }}>
            <span style={{ color: "var(--ink-4)", fontSize: "0.6rem" }}>Bas</span>
            <span style={{ color: "var(--ink-4)", fontSize: "0.6rem" }}>Élevé</span>
          </div>
        </div>
        <p className="mt-3" style={{ color: "var(--ink-4)", fontSize: "0.6rem" }}>
          Gris = données insuffisantes
        </p>
      </div>

      {/* Hover prompt */}
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
          Cliquez sur un pays pour voir les données
        </div>
      )}
    </div>
  );
}

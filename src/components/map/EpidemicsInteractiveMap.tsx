"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, type GeographyItem } from "react-simple-maps";
import { Plus, Minus, Maximize } from "lucide-react";
import type { EpidemicDisease } from "@/types";

const WORLD_MAP_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Gradient stops: light mint → medium green → forest → dark kaki
const COLOR_STOPS: [number, number, number][] = [
  [210, 245, 220],  // very light mint (t=0, lowest)
  [80,  195, 115],  // medium green   (t=0.33)
  [28,  120,  60],  // forest green   (t=0.66)
  [10,   50,  22],  // dark kaki      (t=1, highest)
];

function interpolateGreen(t: number): string {
  const n = COLOR_STOPS.length - 1;
  const seg = Math.min(t * n, n - 0.001);
  const i = Math.floor(seg);
  const lt = seg - i;
  const [r1, g1, b1] = COLOR_STOPS[i];
  const [r2, g2, b2] = COLOR_STOPS[i + 1];
  const r = Math.round(r1 + (r2 - r1) * lt);
  const g = Math.round(g1 + (g2 - g1) * lt);
  const b = Math.round(b1 + (b2 - b1) * lt);
  return `rgb(${r},${g},${b})`;
}

function brighten(color: string, amount: number): string {
  const m = color.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (!m) return color;
  const clamp = (v: number) => Math.min(255, Math.max(0, v));
  return `rgb(${clamp(+m[1] + amount)},${clamp(+m[2] + amount)},${clamp(+m[3] + amount)})`;
}

function getMaxDeaths(disease: EpidemicDisease): number {
  return Math.max(...Object.values(disease.countries).map((d) => d.deaths), 1);
}

function getIntensity(countryName: string, disease: EpidemicDisease, maxDeaths: number): number {
  const data = disease.countries[countryName];
  if (!data || data.deaths === 0) return 0;
  return Math.log10(data.deaths + 1) / Math.log10(maxDeaths + 1);
}

function getCountryFill(
  countryName: string,
  disease: EpidemicDisease,
  maxDeaths: number,
  isHovered: boolean,
  isSelected: boolean
): string {
  if (isSelected) return "#39FF88";
  const t = getIntensity(countryName, disease, maxDeaths);
  if (t === 0) return isHovered ? "#DCDCDC" : "#EBEBEB";
  const base = interpolateGreen(t);
  return isHovered ? brighten(base, 20) : base;
}

interface EpidemicsInteractiveMapProps {
  disease: EpidemicDisease;
  selectedCountry: string | null;
  onCountryClick: (countryName: string) => void;
}

export function EpidemicsInteractiveMap({ disease, selectedCountry, onCountryClick }: EpidemicsInteractiveMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([20, 10]);
  const maxDeaths = getMaxDeaths(disease);

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
                const hasData = Boolean(disease.countries[name]);
                const fill = getCountryFill(name, disease, maxDeaths, isHovered, isSelected);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={isSelected ? "#39FF88" : "#C8C8C8"}
                    strokeWidth={isSelected ? 1.4 : 0.35}
                    onClick={() => { if (hasData) onCountryClick(name); }}
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
        <div
          className="h-2 rounded-full mb-1"
          style={{ background: "linear-gradient(to right, rgb(210,245,220), rgb(80,195,115), rgb(28,120,60), rgb(10,50,22))" }}
        />
        <div className="flex justify-between">
          <span style={{ color: "var(--ink-4)", fontSize: "0.6rem" }}>Faible</span>
          <span style={{ color: "var(--ink-4)", fontSize: "0.6rem" }}>Élevé</span>
        </div>
        <p style={{ color: "var(--ink-4)", fontSize: "0.58rem", marginTop: "5px" }}>
          Gris clair = données insuffisantes
        </p>
      </div>

      {/* Hint */}
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
    </div>
  );
}

"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, type GeographyItem } from "react-simple-maps";
import { Plus, Minus, Maximize } from "lucide-react";
import type { PoliticalPeriod } from "@/data/politics/politics";
import { getCountryFillColorPolitics, ORIENTATION_COLORS, ORIENTATION_LABELS, ORIENTATION_ORDER } from "@/lib/politicsColors";

const WORLD_MAP_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface PoliticsInteractiveMapProps {
  politicsData: Record<string, PoliticalPeriod>;
  selectedCountry: string | null;
  onCountryClick: (name: string) => void;
}

export function PoliticsInteractiveMap({ politicsData, selectedCountry, onCountryClick }: PoliticsInteractiveMapProps) {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([20, 10]);

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
                const isSelected = selectedCountry === name;
                const hasData = Boolean(politicsData[name]);
                const fill = getCountryFillColorPolitics(name, politicsData, isSelected);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={isSelected ? "#39FF88" : "#C8C8C8"}
                    strokeWidth={isSelected ? 1.4 : 0.35}
                    onClick={() => { if (hasData) onCountryClick(name); }}
                    style={{
                      default: { outline: "none", cursor: hasData ? "pointer" : "default", opacity: hasData ? 1 : 0.6 },
                      hover: { outline: "none", cursor: hasData ? "pointer" : "default", opacity: 0.85 },
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
          background: "rgba(255,255,255,0.95)",
          border: "1px solid var(--border)",
          backdropFilter: "blur(8px)",
        }}
      >
        <p style={{ color: "var(--ink-3)", fontSize: "0.62rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>
          Orientation politique
        </p>
        <div className="flex flex-col gap-1.5">
          {ORIENTATION_ORDER.map((ori) => (
            <div key={ori} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: ORIENTATION_COLORS[ori] }} />
              <span style={{ color: "var(--ink-3)", fontSize: "0.6rem" }}>{ORIENTATION_LABELS[ori]}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-1" style={{ borderTop: "1px solid var(--border)", paddingTop: "6px" }}>
            <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: "#EBEBEB" }} />
            <span style={{ color: "var(--ink-4)", fontSize: "0.6rem" }}>Données indisponibles</span>
          </div>
        </div>
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
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, type GeographyItem } from "react-simple-maps";
import { Plus, Minus } from "lucide-react";
import type { MilitaryMetricId, MilitaryCountryData } from "@/data/military/military";
import { getColorForMilitary } from "@/data/military/military";

const WORLD_MAP_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface MilitaryInteractiveMapProps {
  data: Record<string, MilitaryCountryData>;
  metric: MilitaryMetricId;
  selectedCountry: string | null;
  onCountryClick: (name: string) => void;
}

export function MilitaryInteractiveMap({ data, metric, selectedCountry, onCountryClick }: MilitaryInteractiveMapProps) {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([20, 10]);
  const [flashCountry, setFlashCountry] = useState<string | null>(null);
  const [flashColor, setFlashColor] = useState("#ffffff");

  const handleClick = useCallback((name: string, hasData: boolean, color: string) => {
    if (!hasData) return;
    onCountryClick(name);
    setFlashCountry(name);
    setFlashColor(color);
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
          onMoveEnd={({ coordinates, zoom: z }) => { setCenter(coordinates); setZoom(z); }}
        >
          <Geographies geography={WORLD_MAP_URL}>
            {({ geographies }) =>
              geographies.map((geo: GeographyItem) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const name: string = (geo as any).properties?.name ?? "";
                const isSelected = selectedCountry === name;
                const isFlashing = flashCountry === name;
                const hasData = Boolean(data[name]);
                const fill = getColorForMilitary(name, metric, data);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={isSelected ? "#fff" : "#D0D0D0"}
                    strokeWidth={isSelected ? 1.4 : 0.35}
                    style={{
                      default: {
                        outline: "none",
                        cursor: hasData ? "pointer" : "default",
                      },
                      hover: { outline: "none", opacity: hasData ? 0.85 : 1, cursor: hasData ? "pointer" : "default" },
                      pressed: { outline: "none" },
                    }}
                    className={isFlashing ? "military-flash" : ""}
                    onClick={() => handleClick(name, hasData, fill)}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1">
        {[
          { icon: <Plus size={13} />, action: () => setZoom(z => Math.min(z * 1.5, 12)) },
          { icon: <Minus size={13} />, action: () => setZoom(z => Math.max(z / 1.5, 1)) },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--ink-2)", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
          >
            {btn.icon}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes military-flash-anim {
          0%   { filter: drop-shadow(0 0 0px ${flashColor}00); }
          15%  { filter: drop-shadow(0 0 18px ${flashColor}ee) drop-shadow(0 0 40px ${flashColor}99) drop-shadow(0 0 70px ${flashColor}44); }
          50%  { filter: drop-shadow(0 0 10px ${flashColor}99) drop-shadow(0 0 24px ${flashColor}55); }
          100% { filter: drop-shadow(0 0 0px ${flashColor}00); }
        }
        .military-flash { animation: military-flash-anim 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
}

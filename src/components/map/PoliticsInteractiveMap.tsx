"use client";

import { useState, useCallback } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, type GeographyItem } from "react-simple-maps";
import { Plus, Minus, Maximize } from "lucide-react";
import type { PoliticalOrientation, PoliticalPeriod } from "@/data/politics/politics";
import { getCountryFillColorPolitics, ORIENTATION_COLORS, ORIENTATION_LABELS, ORIENTATION_ORDER } from "@/lib/politicsColors";

const WORLD_MAP_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const HIDDEN_FILL = "#D4D4D4";

interface PoliticsInteractiveMapProps {
  politicsData: Record<string, PoliticalPeriod>;
  selectedCountry: string | null;
  onCountryClick: (name: string) => void;
}

export function PoliticsInteractiveMap({ politicsData, selectedCountry, onCountryClick }: PoliticsInteractiveMapProps) {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([20, 10]);
  const [flashCountry, setFlashCountry] = useState<string | null>(null);
  const [flashColor, setFlashColor] = useState("#ffffff");
  const [hiddenOrientations, setHiddenOrientations] = useState<Set<PoliticalOrientation>>(new Set());

  const handleCountryClick = useCallback((name: string, hasData: boolean, color: string) => {
    if (!hasData) return;
    onCountryClick(name);
    setFlashCountry(name);
    setFlashColor(color);
    setTimeout(() => setFlashCountry(null), 700);
  }, [onCountryClick]);

  const toggleOrientation = useCallback((ori: PoliticalOrientation) => {
    setHiddenOrientations(prev => {
      const next = new Set(prev);
      if (next.has(ori)) next.delete(ori);
      else next.add(ori);
      return next;
    });
  }, []);

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
                const isFlashing = flashCountry === name;
                const hasData = Boolean(politicsData[name]);
                const period = politicsData[name];
                const orientation = period?.orientation;
                const isHidden = orientation ? hiddenOrientations.has(orientation) : false;
                const fill = isHidden ? HIDDEN_FILL : getCountryFillColorPolitics(name, politicsData);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={isSelected ? "#fff" : "#C8C8C8"}
                    strokeWidth={isSelected ? 1.2 : 0.35}
                    className={isFlashing ? "politics-flash" : ""}
                    onClick={() => handleCountryClick(name, hasData && !isHidden, fill)}
                    style={{
                      default: {
                        outline: "none",
                        cursor: (hasData && !isHidden) ? "pointer" : "default",
                        opacity: (isHidden && hasData) ? 0.45 : 1,
                      },
                      hover: { outline: "none", cursor: (hasData && !isHidden) ? "pointer" : "default", opacity: 0.85 },
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

      {/* Legend — filterable checkboxes */}
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
        <div className="flex flex-col gap-1">
          {ORIENTATION_ORDER.map((ori) => {
            const hidden = hiddenOrientations.has(ori);
            const color = ORIENTATION_COLORS[ori];
            return (
              <button
                key={ori}
                onClick={() => toggleOrientation(ori)}
                className="flex items-center gap-2 rounded-md px-1 py-0.5 transition-all text-left w-full"
                style={{ background: hidden ? "transparent" : `${color}14` }}
              >
                <div
                  className="w-3 h-3 rounded-sm shrink-0 flex items-center justify-center"
                  style={{
                    background: hidden ? "transparent" : color,
                    border: `1.5px solid ${color}`,
                  }}
                >
                  {!hidden && (
                    <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                      <path d="M1 2.5L2.8 4L6 1" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{
                  color: hidden ? "var(--ink-4)" : "var(--ink-3)",
                  fontSize: "0.6rem",
                  textDecoration: hidden ? "line-through" : "none",
                  opacity: hidden ? 0.6 : 1,
                }}>
                  {ORIENTATION_LABELS[ori]}
                </span>
              </button>
            );
          })}
          <div className="flex items-center gap-2 mt-1 pl-1" style={{ borderTop: "1px solid var(--border)", paddingTop: "6px" }}>
            <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: "#EBEBEB", border: "1.5px solid #D0D0D0" }} />
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

      <style>{`
        @keyframes politics-flash-anim {
          0%   { filter: drop-shadow(0 0 0px ${flashColor}00); }
          15%  { filter: drop-shadow(0 0 18px ${flashColor}ee) drop-shadow(0 0 40px ${flashColor}99) drop-shadow(0 0 70px ${flashColor}44); }
          50%  { filter: drop-shadow(0 0 10px ${flashColor}99) drop-shadow(0 0 24px ${flashColor}55); }
          100% { filter: drop-shadow(0 0 0px ${flashColor}00); }
        }
        .politics-flash { animation: politics-flash-anim 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
}

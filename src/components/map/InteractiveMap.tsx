"use client";

import { useEffect, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, type GeographyItem } from "react-simple-maps";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus, Maximize } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

const WORLD_MAP_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface InteractiveMapProps {
  geojsonFile: string;
  onTerritoryClick?: () => void;
  mapCenter?: [number, number];
  mapScale?: number;
}

export function InteractiveMap({
  geojsonFile,
  onTerritoryClick,
  mapCenter = [20, 42],
  mapScale = 600,
}: InteractiveMapProps) {
  const [empireData, setEmpireData] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>(mapCenter);
  const cache = useRef<Map<string, object>>(new Map());

  // Reset view when empire/center changes
  useEffect(() => {
    setCenter(mapCenter);
    setZoom(1);
  }, [mapCenter[0], mapCenter[1]]);

  useEffect(() => {
    const url = geojsonFile;
    if (cache.current.has(url)) {
      setEmpireData(cache.current.get(url)!);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        cache.current.set(url, data);
        setEmpireData(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [geojsonFile]);

  return (
    <div className="relative w-full" style={{ aspectRatio: "16/9", minHeight: "420px" }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "var(--surface)" }}>
          <div className="text-center">
            <Skeleton className="w-48 h-4 mx-auto mb-2" />
            <Skeleton className="w-32 h-3 mx-auto" />
          </div>
        </div>
      )}

      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ center: mapCenter, scale: mapScale }}
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
          {/* World base layer — light gray, empire territory will be bright green overlay */}
          <Geographies geography={WORLD_MAP_URL}>
            {({ geographies }) =>
              geographies.map((geo: GeographyItem) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#ECECEC"
                  stroke="#D8D8D8"
                  strokeWidth={0.35}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "#E2E2E2" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Empire territory — solid neon green */}
          <AnimatePresence mode="wait">
            {empireData && (
              <motion.g
                key={geojsonFile}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Geographies geography={empireData}>
                  {({ geographies }) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    geographies.map((geo: any) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={hovering ? "#39FF88" : "rgba(57,255,136,0.82)"}
                        stroke="#1AD965"
                        strokeWidth={hovering ? 1.2 : 0.7}
                        onClick={onTerritoryClick}
                        onMouseEnter={() => setHovering(true)}
                        onMouseLeave={() => setHovering(false)}
                        style={{
                          default: {
                            outline: "none",
                            cursor: "pointer",
                            filter: "drop-shadow(0 0 3px rgba(57,255,136,0.35))",
                          },
                          hover: {
                            fill: "#39FF88",
                            stroke: "#1AD965",
                            strokeWidth: 1.4,
                            filter: "drop-shadow(0 0 8px rgba(57,255,136,0.55))",
                            outline: "none",
                            cursor: "pointer",
                          },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>
              </motion.g>
            )}
          </AnimatePresence>
        </ZoomableGroup>
      </ComposableMap>

      {/* Zoom controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
        {[
          { icon: Plus, action: () => setZoom((z) => Math.min(z * 1.5, 10)), label: "Zoom in" },
          { icon: Minus, action: () => setZoom((z) => Math.max(z / 1.5, 1)), label: "Zoom out" },
          { icon: Maximize, action: () => { setZoom(1); setCenter(mapCenter); }, label: "Reset view" },
        ].map(({ icon: Icon, action, label }) => (
          <button
            key={label}
            onClick={action}
            aria-label={label}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
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
        className="absolute bottom-3 left-3 px-3 py-2 rounded-xl flex items-center gap-2"
        style={{ background: "rgba(255,255,255,0.92)", border: "1px solid var(--border)", backdropFilter: "blur(8px)" }}
      >
        <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(57,255,136,0.82)", border: "1px solid #1AD965" }} />
        <span style={{ color: "var(--ink-3)", fontSize: "0.62rem", fontWeight: 600 }}>Territoire de l'empire</span>
      </div>

      {/* Click hint */}
      {empireData && !isLoading && (
        <div
          className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid var(--border)",
            color: "var(--ink-3)",
            backdropFilter: "blur(8px)",
          }}
        >
          Scroll pour zoomer · Cliquez sur le territoire
        </div>
      )}
    </div>
  );
}

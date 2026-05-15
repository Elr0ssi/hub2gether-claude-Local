"use client";

import { useEffect, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, type GeographyItem } from "react-simple-maps";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus, Maximize } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

const WORLD_MAP_URL = "/geojson/world-110m.json";

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

  useEffect(() => {
    setCenter(mapCenter);
    setZoom(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: "var(--surface)" }}>
          <div className="text-center">
            <Skeleton className="w-48 h-4 mx-auto mb-2" />
            <Skeleton className="w-32 h-3 mx-auto" />
          </div>
        </div>
      )}

      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ center: mapCenter, scale: mapScale }}
        style={{ width: "100%", height: "100%", background: "#B8CCE0" }}
      >
        <ZoomableGroup
          zoom={zoom}
          center={center}
          onMoveEnd={({ coordinates, zoom: z }) => {
            setCenter(coordinates);
            setZoom(z);
          }}
        >
          {/* World base layer */}
          <Geographies geography={WORLD_MAP_URL}>
            {({ geographies }) =>
              geographies.map((geo: GeographyItem) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#E8E2D4"
                  stroke="#C8C0A8"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "#D8D0B8" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Empire territory overlay */}
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
                        fill={hovering ? "#39FF88" : "rgba(57,255,136,0.88)"}
                        stroke="#1AD965"
                        strokeWidth={hovering ? 1.2 : 0.8}
                        onClick={onTerritoryClick}
                        onMouseEnter={() => setHovering(true)}
                        onMouseLeave={() => setHovering(false)}
                        style={{
                          default: {
                            outline: "none",
                            cursor: "pointer",
                            filter: "drop-shadow(0 0 4px rgba(57,255,136,0.45))",
                          },
                          hover: {
                            fill: "#39FF88",
                            stroke: "#1AD965",
                            strokeWidth: 1.4,
                            filter: "drop-shadow(0 0 10px rgba(57,255,136,0.65))",
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
          { icon: Plus, action: () => setZoom((z) => Math.min(z * 1.5, 12)), label: "Zoom in" },
          { icon: Minus, action: () => setZoom((z) => Math.max(z / 1.5, 1)), label: "Zoom out" },
          { icon: Maximize, action: () => { setZoom(1); setCenter(mapCenter); }, label: "Reset view" },
        ].map(({ icon: Icon, action, label }) => (
          <button
            key={label}
            onClick={action}
            aria-label={label}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
            style={{
              background: "rgba(255,255,255,0.95)",
              border: "1px solid var(--border)",
              color: "var(--ink-2)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
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
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(57,255,136,0.88)", border: "1px solid #1AD965" }} />
          <span style={{ color: "var(--ink-3)", fontSize: "0.62rem", fontWeight: 600 }}>Territoire de l&apos;empire</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: "#E8E2D4", border: "1px solid #C8C0A8" }} />
          <span style={{ color: "var(--ink-4)", fontSize: "0.62rem", fontWeight: 500 }}>Hors empire</span>
        </div>
      </div>

      {/* Interaction hint */}
      {empireData && !isLoading && (
        <div
          className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.92)",
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

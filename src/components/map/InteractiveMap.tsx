"use client";

import { useEffect, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography, type GeographyItem } from "react-simple-maps";
import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";

const WORLD_MAP_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface InteractiveMapProps {
  geojsonFile: string;
  onTerritoryClick?: () => void;
}

export function InteractiveMap({ geojsonFile, onTerritoryClick }: InteractiveMapProps) {
  const [empireData, setEmpireData] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hovering, setHovering] = useState(false);
  const cache = useRef<Map<string, object>>(new Map());

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
        projectionConfig={{ center: [20, 40], scale: 550 }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* World base layer */}
        <Geographies geography={WORLD_MAP_URL}>
          {({ geographies }) =>
            geographies.map((geo: GeographyItem) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#F2F2F2"
                stroke="#E0E0E0"
                strokeWidth={0.4}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", fill: "#EBEBEB" },
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
                      fill={hovering ? "rgba(57,255,136,0.55)" : "rgba(57,255,136,0.35)"}
                      stroke="#39FF88"
                      strokeWidth={0.8}
                      onClick={onTerritoryClick}
                      onMouseEnter={() => setHovering(true)}
                      onMouseLeave={() => setHovering(false)}
                      style={{
                        default: { outline: "none", cursor: "pointer" },
                        hover: {
                          fill: "rgba(57,255,136,0.6)",
                          stroke: "#39FF88",
                          strokeWidth: 1.2,
                          filter: "drop-shadow(0 0 6px rgba(57,255,136,0.4))",
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
      </ComposableMap>

      {/* Click prompt */}
      {empireData && !isLoading && (
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-xs font-medium pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid var(--border)",
            color: "var(--ink-3)",
            backdropFilter: "blur(8px)",
          }}
        >
          Click territory to view details
        </div>
      )}
    </div>
  );
}

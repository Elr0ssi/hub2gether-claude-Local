"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap } from "react-leaflet";
import type { FeatureCollection } from "geojson";
import type { PathOptions } from "leaflet";
import L from "leaflet";

const TILES = {
  standard: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  detailed: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
} as const;

export type EmpireTileStyle = keyof typeof TILES;

// Auto-fit the map to the empire GeoJSON bounds on load/change
function FitToEmpire({ geoJson }: { geoJson: FeatureCollection | null }) {
  const map = useMap();
  useEffect(() => {
    if (!geoJson) return;
    try {
      const bounds = L.geoJSON(geoJson).getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [32, 32], maxZoom: 7, animate: true, duration: 0.5 });
      }
    } catch {
      // ignore invalid bounds
    }
  }, [geoJson, map]);
  return null;
}

interface EmpireLeafletMapProps {
  geojsonFile: string;
  empireName: string;
  tileStyle?: EmpireTileStyle;
  onTerritoryClick?: () => void;
  fillHeight?: boolean;
}

const empireStyle: PathOptions = {
  fillColor: "#39FF88",
  fillOpacity: 0.55,
  color: "#1AD965",
  weight: 1.5,
};

const empireHoverStyle: PathOptions = {
  fillColor: "#39FF88",
  fillOpacity: 0.75,
  color: "#1AD965",
  weight: 2.5,
};

export function EmpireLeafletMap({
  geojsonFile,
  empireName,
  tileStyle = "standard",
  onTerritoryClick,
  fillHeight = false,
}: EmpireLeafletMapProps) {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const cacheRef = useRef<Map<string, FeatureCollection>>(new Map());

  useEffect(() => {
    if (cacheRef.current.has(geojsonFile)) {
      setGeoData(cacheRef.current.get(geojsonFile)!);
      return;
    }
    setGeoData(null);
    fetch(geojsonFile)
      .then((r) => r.json())
      .then((data: FeatureCollection) => {
        cacheRef.current.set(geojsonFile, data);
        setGeoData(data);
      })
      .catch(() => {});
  }, [geojsonFile]);

  const height = fillHeight ? "100%" : "480px";

  return (
    <div
      className="relative w-full"
      style={fillHeight ? { height: "100%" } : { height: "480px", minHeight: "480px" }}
    >
      <MapContainer
        center={[30, 20]}
        zoom={3}
        minZoom={1}
        maxZoom={18}
        style={{
          width: "100%",
          height,
          background: tileStyle === "satellite" ? "#0a0a0a" : "#e8e4d8",
        }}
        zoomControl={false}
      >
        <ZoomControl position="topright" />
        <TileLayer
          key={tileStyle}
          url={TILES[tileStyle].url}
          attribution={TILES[tileStyle].attribution}
          maxZoom={18}
        />
        {geoData && (
          <>
            <FitToEmpire geoJson={geoData} />
            <GeoJSON
              key={geojsonFile}
              data={geoData}
              style={() => empireStyle}
              onEachFeature={(_, layer) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const l = layer as any;
                l.bindTooltip(empireName, {
                  direction: "center",
                  className: "empire-tooltip",
                  sticky: true,
                });
                l.on("mouseover", () => { l.setStyle(empireHoverStyle); l.bringToFront(); });
                l.on("mouseout", () => l.setStyle(empireStyle));
                if (onTerritoryClick) l.on("click", onTerritoryClick);
              }}
            />
          </>
        )}
      </MapContainer>

      {/* Legend */}
      <div
        className="absolute bottom-3 left-3 px-3 py-2 rounded-xl z-[1000] flex items-center gap-3"
        style={{
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(0,0,0,0.08)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(57,255,136,0.55)", border: "1.5px solid #1AD965" }} />
          <span style={{ color: "#3a3a3a", fontSize: "0.62rem", fontWeight: 600 }}>Territoire de l&apos;empire</span>
        </div>
      </div>

      {!geoData && (
        <div className="absolute inset-0 flex items-center justify-center z-[1000]" style={{ pointerEvents: "none" }}>
          <div className="px-4 py-2 rounded-xl text-xs" style={{ background: "rgba(255,255,255,0.9)", color: "#6b6b6b" }}>
            Chargement de la carte…
          </div>
        </div>
      )}

      <style>{`
        .empire-tooltip {
          background: rgba(255,255,255,0.95);
          border: 1px solid #E8E8E8;
          border-radius: 8px;
          padding: 5px 10px;
          font-size: 12px;
          font-weight: 600;
          color: #0A0A0A;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }
        .empire-tooltip::before { display: none; }
      `}</style>
    </div>
  );
}

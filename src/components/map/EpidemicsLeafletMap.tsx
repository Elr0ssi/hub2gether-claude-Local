"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import type { FeatureCollection, Feature } from "geojson";
import type { PathOptions, Layer } from "leaflet";
import type { EpidemicDisease } from "@/types";
import {
  getMaxDeaths,
  getDeathIntensity,
  interpolateGreen,
  GRADIENT_CSS,
} from "@/lib/epidemicsColors";

// Natural Earth 110m countries GeoJSON — same source as world-atlas, with `name` field
const GEO_URL =
  "/geo/ne_110m_admin_0_countries.geojson";

const TILES = {
  standard: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  detailed: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  },
} as const;

export type LeafletTileStyle = keyof typeof TILES;

interface EpidemicsLeafletMapProps {
  disease: EpidemicDisease;
  selectedCountry: string | null;
  onCountryClick: (name: string) => void;
  tileStyle: LeafletTileStyle;
  fillHeight?: boolean;
}

// Convert hex/rgb fill to an actual rgb string for PathOptions
function rgbStringToHex(rgb: string): string {
  // Leaflet accepts rgb() strings directly as fillColor
  return rgb;
}

export function EpidemicsLeafletMap({
  disease,
  selectedCountry,
  onCountryClick,
  tileStyle,
  fillHeight = false,
}: EpidemicsLeafletMapProps) {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const cacheRef = useRef<FeatureCollection | null>(null);

  useEffect(() => {
    if (cacheRef.current) { setGeoData(cacheRef.current); return; }
    fetch(GEO_URL)
      .then((r) => r.json())
      .then((data: FeatureCollection) => {
        cacheRef.current = data;
        setGeoData(data);
      })
      .catch(() => {/* silent — map still renders without choropleth */});
  }, []);

  const maxDeaths = getMaxDeaths(disease.countries);

  const getFeatureStyle = (feature: Feature | undefined): PathOptions => {
    const name: string = (feature?.properties as Record<string, string>)?.name ?? "";
    const t = getDeathIntensity(name, disease.countries, maxDeaths);
    const isSelected = selectedCountry === name;

    if (isSelected) {
      return {
        fillColor: "#39FF88",
        fillOpacity: 0.9,
        color: "#39FF88",
        weight: 2,
      };
    }
    if (t === 0) {
      return {
        fillColor: tileStyle === "satellite" ? "transparent" : "#EBEBEB",
        fillOpacity: tileStyle === "satellite" ? 0 : 0.55,
        color: "#BBBBBB",
        weight: 0.4,
      };
    }
    return {
      fillColor: rgbStringToHex(interpolateGreen(t)),
      fillOpacity: tileStyle === "satellite" ? 0.75 : 0.82,
      color: tileStyle === "satellite" ? "rgba(255,255,255,0.4)" : "#A0A0A0",
      weight: 0.5,
    };
  };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    const name: string = (feature.properties as Record<string, string>)?.name ?? "";
    const hasData = Boolean(disease.countries[name]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const l = layer as any;

    // Tooltip
    l.bindTooltip(
      hasData
        ? `<strong>${name}</strong><br/>Décès : <strong>${disease.countries[name].deaths.toLocaleString("fr-FR")}</strong>`
        : name,
      { direction: "auto", className: "leaflet-epidemic-tooltip" }
    );

    if (hasData) {
      l.on("click", () => onCountryClick(name));
      l.on("mouseover", () => {
        const t = getDeathIntensity(name, disease.countries, maxDeaths);
        const base = interpolateGreen(t);
        // lighten slightly on hover
        l.setStyle({ fillOpacity: 1, weight: 1.5 });
        l.bringToFront();
      });
      l.on("mouseout", () => {
        const isSelected = selectedCountry === name;
        const t = getDeathIntensity(name, disease.countries, maxDeaths);
        l.setStyle({
          fillOpacity: isSelected ? 0.9 : tileStyle === "satellite" ? 0.75 : 0.82,
          weight: isSelected ? 2 : 0.5,
        });
      });
      l.getElement && (l.getElement().style.cursor = "pointer");
    }
  };

  return (
    <div className={`relative w-full${fillHeight ? " h-full" : ""}`} style={fillHeight ? {} : { minHeight: "480px", height: "480px" }}>
      <MapContainer
        center={[20, 10]}
        zoom={2}
        minZoom={1}
        maxZoom={18}
        style={{ width: "100%", height: fillHeight ? "100%" : "480px", background: tileStyle === "satellite" ? "#0a0a0a" : "#F5F5F5" }}
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
          <GeoJSON
            key={`${disease.id}-${selectedCountry ?? "none"}-${tileStyle}`}
            data={geoData}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      {/* Legend */}
      <div
        className="absolute bottom-5 left-3 px-3 py-2.5 rounded-xl z-[1000]"
        style={{
          background: "rgba(255,255,255,0.93)",
          border: "1px solid rgba(0,0,0,0.1)",
          backdropFilter: "blur(8px)",
          minWidth: "130px",
        }}
      >
        <p style={{ color: "#555", fontSize: "0.62rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, marginBottom: "6px" }}>
          Décès cumulés
        </p>
        <div className="h-2 rounded-full mb-1" style={{ background: GRADIENT_CSS }} />
        <div className="flex justify-between">
          <span style={{ color: "#888", fontSize: "0.6rem" }}>Faible</span>
          <span style={{ color: "#888", fontSize: "0.6rem" }}>Élevé</span>
        </div>
        <p style={{ color: "#aaa", fontSize: "0.58rem", marginTop: "5px" }}>
          Transparent = données insuffisantes
        </p>
      </div>

      {/* Tooltip CSS */}
      <style>{`
        .leaflet-epidemic-tooltip {
          background: rgba(255,255,255,0.95);
          border: 1px solid #E8E8E8;
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 12px;
          color: #0A0A0A;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }
        .leaflet-epidemic-tooltip::before {
          display: none;
        }
      `}</style>
    </div>
  );
}

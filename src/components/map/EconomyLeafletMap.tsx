"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap } from "react-leaflet";
import type { FeatureCollection, Feature } from "geojson";
import type { PathOptions, Layer, LatLngBoundsExpression } from "leaflet";
import type { EconomyYear, EconomyMetricId } from "@/types";
import { ECONOMY_METRICS } from "@/data/economy/economy";
import {
  getMaxMetricValue,
  getValueIntensity,
  interpolateGreen,
  GRADIENT_CSS,
} from "@/lib/economyColors";

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

/**
 * The whole world and no further. Cut at ±85° because Mercator sends the poles
 * to infinity — past that there is no map to show, only the blank the reader
 * was falling into.
 */
/** Country names come from a data file; they are never trusted as markup. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const WORLD: LatLngBoundsExpression = [
  [-85, -180],
  [85, 180],
];

/**
 * Keeps the map full of map.
 *
 * Two faults have the same cause — a viewport free to leave the world. Below a
 * certain zoom the projection is narrower than the box, which is where the
 * bands above and below the map came from; and with no bounds the reader could
 * drag the world off the side entirely. The floor is recomputed on resize
 * because it depends on the box, not on the data.
 */
function HoldTheWorld() {
  const map = useMap();

  useEffect(() => {
    const apply = () => {
      // `inside` asks for the zoom at which the bounds *fill* the container
      // rather than fit inside it: exactly the level below which bands appear.
      const floor = map.getBoundsZoom(WORLD, true);
      map.setMinZoom(floor);
      map.setMaxBounds(WORLD);
      if (map.getZoom() < floor) map.setZoom(floor);
    };
    apply();
    map.on("resize", apply);
    return () => {
      map.off("resize", apply);
    };
  }, [map]);

  return null;
}

interface EconomyLeafletMapProps {
  economyYear: EconomyYear;
  metric: EconomyMetricId;
  selectedCountry: string | null;
  onCountryClick: (name: string) => void;
  tileStyle: LeafletTileStyle;
  fillHeight?: boolean;
}

export function EconomyLeafletMap({
  economyYear,
  metric,
  selectedCountry,
  onCountryClick,
  tileStyle,
  fillHeight = false,
}: EconomyLeafletMapProps) {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const cacheRef = useRef<FeatureCollection | null>(null);
  const metricDef = ECONOMY_METRICS.find((m) => m.id === metric);

  useEffect(() => {
    if (cacheRef.current) { setGeoData(cacheRef.current); return; }
    fetch(GEO_URL)
      .then((r) => r.json())
      .then((data: FeatureCollection) => {
        cacheRef.current = data;
        setGeoData(data);
      })
      .catch(() => {});
  }, []);

  const maxValue = getMaxMetricValue(economyYear.countries, metric);

  const getFeatureStyle = (feature: Feature | undefined): PathOptions => {
    const name: string = (feature?.properties as Record<string, string>)?.name ?? "";
    const t = getValueIntensity(name, economyYear.countries, maxValue, metric);
    const isSelected = selectedCountry === name;

    if (isSelected) {
      return { fillColor: "#39FF88", fillOpacity: 0.9, color: "#39FF88", weight: 2 };
    }
    if (t === null) {
      return {
        fillColor: tileStyle === "satellite" ? "transparent" : "#EBEBEB",
        fillOpacity: tileStyle === "satellite" ? 0 : 0.55,
        color: "#BBBBBB",
        weight: 0.4,
      };
    }
    return {
      fillColor: interpolateGreen(t),
      fillOpacity: tileStyle === "satellite" ? 0.75 : 0.82,
      color: tileStyle === "satellite" ? "rgba(255,255,255,0.4)" : "#A0A0A0",
      weight: 0.5,
    };
  };

  const tooltipFor = (name: string): string => {
    const data = economyYear.countries[name];
    const label = escapeHtml(name);
    if (!data) return `<span class="ta-country">${label}</span>`;
    const v = data[metric] as number;
    const unit = metricDef?.unit ?? "";
    return [
      `<span class="ta-country">${label}</span>`,
      `<span class="ta-metric">${escapeHtml(metricDef?.label ?? "")}</span>`,
      `<span class="ta-value">${v.toLocaleString("fr-FR")} ${escapeHtml(unit)}</span>`,
    ].join("");
  };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    const name: string = (feature.properties as Record<string, string>)?.name ?? "";
    const hasData = Boolean(economyYear.countries[name]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const l = layer as any;

    // Sticky: the label follows the cursor instead of anchoring at the
    // polygon's centre, which on a country the size of Russia put the name
    // several hundred pixels from the pointer.
    l.bindTooltip(tooltipFor(name), {
      sticky: true,
      direction: "top",
      offset: [0, -8],
      opacity: 1,
      className: "eco-map-tip",
    });

    if (hasData) {
      l.on("click", () => onCountryClick(name));
      l.on("mouseover", () => { l.bringToFront(); });
      l.on("mouseout", () => {
        const isSel = selectedCountry === name;
        l.setStyle({ weight: isSel ? 2 : 0.5 });
      });
    }
  };

  return (
    <div className={`relative w-full${fillHeight ? " h-full" : ""}`} style={fillHeight ? {} : { minHeight: "480px", height: "480px" }}>
      <MapContainer
        center={[20, 10]}
        zoom={2}
        maxZoom={18}
        // Fractional zoom, so the floor can sit exactly where the world fills
        // the box instead of one whole level above or below it.
        zoomSnap={0}
        zoomDelta={0.4}
        maxBounds={WORLD}
        maxBoundsViscosity={1}
        worldCopyJump={false}
        style={{ width: "100%", height: fillHeight ? "100%" : "480px", background: tileStyle === "satellite" ? "#0a0a0a" : "#F5F5F5" }}
        zoomControl={false}
      >
        <HoldTheWorld />
        <ZoomControl position="topright" />
        <TileLayer
          key={tileStyle}
          url={TILES[tileStyle].url}
          attribution={TILES[tileStyle].attribution}
          maxZoom={18}
          noWrap
          bounds={WORLD}
        />
        {geoData && (
          <GeoJSON
            key={`${economyYear.year}-${metric}-${selectedCountry ?? "none"}-${tileStyle}`}
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
          minWidth: "150px",
        }}
      >
        <p style={{ color: "#555", fontSize: "0.62rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, marginBottom: "6px" }}>
          {metricDef?.label} ({metricDef?.unit})
        </p>
        <div className="h-2 rounded-full mb-1" style={{ background: GRADIENT_CSS }} />
        <div className="flex justify-between">
          <span style={{ color: "#888", fontSize: "0.6rem" }}>
            {metric === "trade_balance" ? "Déficit" : "Faible"}
          </span>
          <span style={{ color: "#888", fontSize: "0.6rem" }}>
            {metric === "trade_balance" ? "Excédent" : "Élevé"}
          </span>
        </div>
        <p style={{ color: "#aaa", fontSize: "0.58rem", marginTop: "5px" }}>
          Transparent = données insuffisantes
        </p>
      </div>

      <style>{`
        .leaflet-economy-tooltip {
          background: rgba(255,255,255,0.95);
          border: 1px solid #E8E8E8;
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 12px;
          color: #0A0A0A;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }
        .leaflet-economy-tooltip::before { display: none; }
      `}</style>
    </div>
  );
}

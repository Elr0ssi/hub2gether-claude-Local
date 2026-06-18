"use client";

import { useEffect, useRef } from "react";
import type { CityResult } from "@/data/politics/municipalElections";
import { ORIENTATION_COLORS_MUNICIPAL } from "@/data/politics/municipalElections";

interface MunicipalCityMapProps {
  cities: CityResult[];
  country: string;
  selectedCity: string | null;
  onCityClick: (city: CityResult) => void;
}

// Country view bounds: [lat, lon, zoom]
const COUNTRY_VIEWS: Record<string, { center: [number, number]; zoom: number }> = {
  France:  { center: [46.8, 2.3],  zoom: 5 },
  Germany: { center: [51.2, 10.4], zoom: 5 },
};

export function MunicipalCityMap({ cities, country, selectedCity, onCityClick }: MunicipalCityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletMapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    import("leaflet").then((L) => {
      // Remove default icon issue in webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const view = COUNTRY_VIEWS[country] ?? { center: [20, 0] as [number, number], zoom: 3 };
      const map = L.map(mapRef.current!, {
        center: view.center,
        zoom: view.zoom,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 18,
      }).addTo(map);

      leafletMapRef.current = map;

      // Draw markers
      drawMarkers(L, map, cities, selectedCity, onCityClick);
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers when cities or selection changes
  useEffect(() => {
    if (!leafletMapRef.current) return;
    import("leaflet").then((L) => {
      // Remove old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      drawMarkers(L, leafletMapRef.current, cities, selectedCity, onCityClick);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities, selectedCity]);

  function drawMarkers(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map: any,
    cityList: CityResult[],
    selected: string | null,
    onClick: (city: CityResult) => void
  ) {
    cityList.forEach((city) => {
      const isSelected = selected === city.city;
      const color = ORIENTATION_COLORS_MUNICIPAL[city.orientation] ?? "#888888";
      const radius = isSelected ? 14 : 10;

      const marker = L.circleMarker([city.lat, city.lon], {
        radius,
        fillColor: color,
        color: isSelected ? "#fff" : "rgba(255,255,255,0.7)",
        weight: isSelected ? 3 : 1.5,
        opacity: 1,
        fillOpacity: isSelected ? 1 : 0.85,
      });

      marker.bindTooltip(city.city, {
        permanent: false,
        direction: "top",
        className: "leaflet-municipal-tooltip",
        offset: [0, -8],
      });

      marker.on("click", () => onClick(city));
      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }

  return (
    <>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "100%", minHeight: "360px", borderRadius: "0" }}
      />
      <style>{`
        .leaflet-municipal-tooltip {
          background: var(--surface, #fff);
          border: 1px solid var(--border, #e5e7eb);
          border-radius: 6px;
          padding: 2px 7px;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--ink, #111);
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
          white-space: nowrap;
        }
        .leaflet-municipal-tooltip::before {
          display: none;
        }
      `}</style>
    </>
  );
}

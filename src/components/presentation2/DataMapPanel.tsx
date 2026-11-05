"use client";

import { useRef, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, type GeographyItem } from "react-simple-maps";
import { Plus, Minus, Maximize } from "lucide-react";

const GEO_URL = "/geojson/world-110m.json";

export interface MapCallout {
  label: string;
  value: string;
  delta?: string;
  source?: string;
}

interface DataMapPanelProps {
  accent: string;
  landFill: string;
  oceanFill: string;
  highlight: { name: string; coordinates: [number, number] };
  callout: MapCallout;
  /** Returns the same shape as `callout`, so the card layout never changes. */
  getCountryCallout: (countryName: string) => MapCallout;
}

export function DataMapPanel({ accent, landFill, oceanFill, highlight, callout, getCountryCallout }: DataMapPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mapScale, setMapScale] = useState(1);

  // One card, one layout. Hovering swaps its contents for the country under
  // the pointer; leaving the map restores the category's own highlight. Hover
  // only — no click-to-pin, which used to leave a stale country on screen.
  const shown: MapCallout = hovered ? getCountryCallout(hovered) : callout;

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: oceanFill,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${mapScale})`,
          transformOrigin: "center center",
          transition: "transform 0.35s var(--ease-spring, cubic-bezier(0.16,1,0.3,1))",
        }}
      >
        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{ scale: 155, center: [12, 8] }}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo: GeographyItem) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const name: string = (geo as any).properties?.name ?? "";
                const isHovered = hovered === name;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isHovered ? accent : landFill}
                    stroke={oceanFill}
                    strokeWidth={0.5}
                    onMouseEnter={() => setHovered(name)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      default: { outline: "none", cursor: "pointer", transition: "fill 0.15s ease" },
                      hover: { outline: "none", cursor: "pointer" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>

          <Marker coordinates={highlight.coordinates}>
            <circle r={9} fill={accent} opacity={0.22} />
            <circle r={4} fill={accent} stroke="#fff" strokeWidth={1.5} />
          </Marker>
        </ComposableMap>
      </div>

      {/* Zoom controls */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 14,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          zIndex: 4,
        }}
      >
        {[
          { Icon: Plus, label: "Zoomer", action: () => setMapScale((s) => Math.min(2.4, +(s * 1.35).toFixed(2))) },
          { Icon: Minus, label: "Dézoomer", action: () => setMapScale((s) => Math.max(1, +(s / 1.35).toFixed(2))) },
          { Icon: Maximize, label: "Réinitialiser", action: () => setMapScale(1) },
        ].map(({ Icon, label, action }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            aria-label={label}
            className="w-7 h-7 flex items-center justify-center rounded-lg"
            style={{
              background: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(10,20,15,0.08)",
              color: "#3A3A3A",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <Icon size={13} />
          </button>
        ))}
      </div>

      {/* Readout card — the default highlight, replaced live by whatever
          country is under the pointer. One panel, never two. */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          width: 210,
          background: "#fff",
          borderRadius: 14,
          padding: "12px 15px",
          boxShadow: "0 10px 26px rgba(10,20,15,0.14)",
          zIndex: 4,
          transition: "box-shadow 0.2s ease",
        }}
      >
        <p
          style={{
            fontSize: "0.58rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: accent,
            marginBottom: 4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {shown.label}
        </p>
        <p style={{ fontSize: "1.15rem", fontWeight: 900, color: "#0A0A0A", letterSpacing: "-0.02em" }}>
          {shown.value}
        </p>
        {shown.delta && (
          <p style={{ fontSize: "0.64rem", fontWeight: 600, color: accent, marginTop: 2 }}>{shown.delta}</p>
        )}
        {shown.source && (
          <p style={{ fontSize: "0.58rem", color: "#9B9B9B", marginTop: 3 }}>Source : {shown.source}</p>
        )}
      </div>

    </div>
  );
}

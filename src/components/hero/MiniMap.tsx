"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const GEO_URL = "/geojson/world-110m.json";

const THEME_STYLE: Record<string, { fill: string; stroke: string; ocean: string }> = {
  economy:   { fill: "#BBF7D0", stroke: "#4ADE80", ocean: "#F0FDF4" },
  politics:  { fill: "#DDD6FE", stroke: "#A78BFA", ocean: "#F5F3FF" },
  epidemics: { fill: "#FECACA", stroke: "#F87171", ocean: "#FFF1F2" },
  military:  { fill: "#FDE68A", stroke: "#FBBF24", ocean: "#FFFBEB" },
  empires:   { fill: "#A7F3D0", stroke: "#34D399", ocean: "#ECFDF5" },
};

interface MiniMapProps {
  themeId: string;
}

export default function MiniMap({ themeId }: MiniMapProps) {
  const theme = THEME_STYLE[themeId] ?? { fill: "#E5E7EB", stroke: "#D1D5DB", ocean: "#F9FAFB" };

  return (
    <div style={{ width: "100%", height: "100%", background: theme.ocean }}>
      <ComposableMap
        projection="geoNaturalEarth1"
        style={{ width: "100%", height: "100%" }}
        projectionConfig={{ scale: 118, center: [10, 10] }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={theme.fill}
                stroke={theme.stroke}
                strokeWidth={0.4}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", fill: theme.stroke },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}

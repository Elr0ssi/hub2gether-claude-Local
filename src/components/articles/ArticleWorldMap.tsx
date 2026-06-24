"use client";

import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const GEO_URL = "/geojson/world-110m.json";

// Map from country name (as used in article data) to ISO alpha-3 (used in topojson)
const NAME_TO_A3: Record<string, string> = {
  "Afghanistan": "AFG", "Albania": "ALB", "Algeria": "DZA", "Angola": "AGO",
  "Argentina": "ARG", "Australia": "AUS", "Austria": "AUT", "Azerbaijan": "AZE",
  "Bangladesh": "BGD", "Belarus": "BLR", "Belgium": "BEL", "Bolivia": "BOL",
  "Brazil": "BRA", "Bulgaria": "BGR", "Burkina Faso": "BFA", "Cambodia": "KHM",
  "Cameroon": "CMR", "Canada": "CAN", "Chad": "TCD", "Chile": "CHL",
  "China": "CHN", "Colombia": "COL", "Congo": "COG", "Croatia": "HRV",
  "Cuba": "CUB", "Czech Republic": "CZE", "Denmark": "DNK", "Ecuador": "ECU",
  "Egypt": "EGY", "Ethiopia": "ETH", "Finland": "FIN", "France": "FRA",
  "Germany": "DEU", "Ghana": "GHA", "Greece": "GRC", "Guatemala": "GTM",
  "Hungary": "HUN", "India": "IND", "Indonesia": "IDN", "Iran": "IRN",
  "Iraq": "IRQ", "Ireland": "IRL", "Israel": "ISR", "Italy": "ITA",
  "Japan": "JPN", "Jordan": "JOR", "Kazakhstan": "KAZ", "Kenya": "KEN",
  "Libya": "LBY", "Malaysia": "MYS", "Mali": "MLI", "Mexico": "MEX",
  "Morocco": "MAR", "Mozambique": "MOZ", "Myanmar": "MMR", "Nepal": "NPL",
  "Netherlands": "NLD", "New Zealand": "NZL", "Niger": "NER", "Nigeria": "NGA",
  "North Korea": "PRK", "Norway": "NOR", "Pakistan": "PAK", "Palestine": "PSE",
  "Peru": "PER", "Philippines": "PHL", "Poland": "POL", "Portugal": "PRT",
  "Romania": "ROU", "Russia": "RUS", "Saudi Arabia": "SAU", "Serbia": "SRB",
  "Somalia": "SOM", "South Africa": "ZAF", "South Korea": "KOR", "South Sudan": "SSD",
  "Spain": "ESP", "Sri Lanka": "LKA", "Sudan": "SDN", "Sweden": "SWE",
  "Switzerland": "CHE", "Syria": "SYR", "Taiwan": "TWN", "Tanzania": "TZA",
  "Thailand": "THA", "Tunisia": "TUN", "Turkey": "TUR", "Uganda": "UGA",
  "Ukraine": "UKR", "United Arab Emirates": "ARE", "United Kingdom": "GBR",
  "United States": "USA", "United States of America": "USA", "Uruguay": "URY",
  "Venezuela": "VEN", "Vietnam": "VNM", "Yemen": "YEM", "Zambia": "ZMB",
  "Zimbabwe": "ZWE", "Democratic Republic of Congo": "COD", "DR Congo": "COD",
  "North Macedonia": "MKD", "Bosnia": "BIH", "Bosnia and Herzegovina": "BIH",
  "Kosovo": "XKX", "Montenegro": "MNE", "Slovakia": "SVK", "Slovenia": "SVN",
  "Estonia": "EST", "Latvia": "LVA", "Lithuania": "LTU",
  "Armenia": "ARM", "Georgia": "GEO", "Kyrgyzstan": "KGZ", "Tajikistan": "TJK",
  "Turkmenistan": "TKM", "Uzbekistan": "UZB", "Mongolia": "MNG",
  "Senegal": "SEN", "Ivory Coast": "CIV", "Côte d'Ivoire": "CIV",
  "Guinea": "GIN", "Sierra Leone": "SLE", "Liberia": "LBR",
  "Benin": "BEN", "Togo": "TGO", "Rwanda": "RWA", "Burundi": "BDI",
  "Eritrea": "ERI", "Djibouti": "DJI", "Malawi": "MWI", "Botswana": "BWA",
  "Namibia": "NAM", "Lesotho": "LSO", "Eswatini": "SWZ",
  "Madagascar": "MDG", "Mauritania": "MRT", "Gambia": "GMB",
  "Guinea-Bissau": "GNB", "Cape Verde": "CPV",
  "Honduras": "HND", "Nicaragua": "NIC", "El Salvador": "SLV",
  "Costa Rica": "CRI", "Panama": "PAN", "Haiti": "HTI",
  "Dominican Republic": "DOM", "Jamaica": "JAM", "Trinidad and Tobago": "TTO",
  "Paraguay": "PRY", "Guyana": "GUY", "Suriname": "SUR",
  "Lebanon": "LBN", "Cyprus": "CYP", "Kuwait": "KWT", "Oman": "OMN",
  "Qatar": "QAT", "Bahrain": "BHR",
  "Laos": "LAO", "Bhutan": "BTN", "Maldives": "MDV",
  "Timor-Leste": "TLS", "Brunei": "BRN", "Singapore": "SGP",
  "Papua New Guinea": "PNG", "Fiji": "FJI", "Vanuatu": "VUT",
  "Solomon Islands": "SLB", "New Caledonia": "NCL", "French Polynesia": "PYF",
  "Iceland": "ISL", "Luxembourg": "LUX", "Malta": "MLT",
  "Moldova": "MDA",
};

interface ArticleWorldMapProps {
  title: string;
  subtitle?: string;
  countries: Record<string, { color: string; label?: string }>;
  legend?: { color: string; label: string }[];
}

export function ArticleWorldMap({ title, subtitle, countries, legend }: ArticleWorldMapProps) {
  const [tooltip, setTooltip] = useState<{ name: string; label?: string } | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Build a2→color lookup
  const a3ToConfig: Record<string, { color: string; label?: string }> = {};
  for (const [name, cfg] of Object.entries(countries)) {
    const a3 = NAME_TO_A3[name];
    if (a3) a3ToConfig[a3] = { ...cfg };
  }

  return (
    <div
      className="my-8 rounded-2xl overflow-hidden"
      style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="px-5 py-3 border-b flex items-start justify-between gap-2" style={{ borderColor: "var(--border)" }}>
        <div>
          <p className="text-xs font-bold" style={{ color: "var(--ink)" }}>{title}</p>
          {subtitle && <p className="text-xs mt-0.5" style={{ color: "var(--ink-4)" }}>{subtitle}</p>}
        </div>
        {tooltip && (
          <div className="text-right">
            <p className="text-xs font-semibold" style={{ color: "var(--ink)" }}>{tooltip.name}</p>
            {tooltip.label && <p className="text-xs" style={{ color: "var(--ink-3)" }}>{tooltip.label}</p>}
          </div>
        )}
      </div>

      {/* Map */}
      <div style={{ height: "260px", position: "relative" }}>
        <ComposableMap
          projectionConfig={{ scale: 118, center: [10, 10] }}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const props = geo.properties as Record<string, string> | null;
                const a3 = props?.ADM0_A3 ?? (geo as { id?: string }).id ?? "";
                const cfg = a3ToConfig[a3];
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={cfg ? cfg.color : "var(--surface)"}
                    stroke="var(--border)"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: "none", cursor: cfg ? "pointer" : "default", opacity: cfg ? 1 : 0.6 },
                      hover: { outline: "none", opacity: cfg ? 0.85 : 0.6 },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={() => cfg && setTooltip({ name: Object.entries(countries).find(([n]) => NAME_TO_A3[n] === a3)?.[0] ?? a3, label: cfg.label })}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Legend */}
      {legend && legend.length > 0 && (
        <div className="px-5 py-3 border-t flex items-center gap-4 flex-wrap" style={{ borderColor: "var(--border)" }}>
          {legend.map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: l.color }} />
              <span className="text-xs" style={{ color: "var(--ink-3)" }}>{l.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

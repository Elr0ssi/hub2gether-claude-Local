"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EconomyInteractiveMap } from "@/components/map/EconomyInteractiveMap";
import { EconomyRankingsTable } from "@/components/map/EconomyRankingsTable";
import { ECONOMY_METRICS, ECONOMY_YEARS, getYearData, DEFAULT_YEAR } from "@/data/economy/economy";
import type { EconomyMetricId } from "@/types";

const SHOWCASE_METRICS: EconomyMetricId[] = ["gdp", "debt_ratio", "unemployment"];

/**
 * Shared state + markup for the two economy panels shown inside the scroll journey.
 * Both panels live in the DOM from the very first frame — the journey only ever
 * scales and translates them, so nothing is mounted or revealed mid-scroll.
 */
export function useEconomyShowcase() {
  const [metric, setMetric] = useState<EconomyMetricId>("gdp");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const year = DEFAULT_YEAR;
  const yearData = useMemo(
    () => getYearData(year) ?? ECONOMY_YEARS[ECONOMY_YEARS.length - 1],
    [year]
  );
  const metricDef = ECONOMY_METRICS.find((m) => m.id === metric) ?? ECONOMY_METRICS[0];

  const mapPanel = (
    <div className="journey-panel">
      <div className="journey-panel-head">
        <div style={{ minWidth: 0 }}>
          <p className="journey-eyebrow">Carte interactive · Économie mondiale</p>
          <h2 className="journey-panel-title">
            {metricDef.label} par pays{" "}
            <span style={{ color: "#10B981" }}>{year}</span>
          </h2>
        </div>

        <div className="journey-chips">
          {SHOWCASE_METRICS.map((id) => {
            const m = ECONOMY_METRICS.find((x) => x.id === id);
            if (!m) return null;
            const isActive = id === metric;
            return (
              <button
                key={id}
                onClick={() => setMetric(id)}
                className="journey-chip"
                style={
                  isActive
                    ? {
                        background: "var(--accent-dim)",
                        color: "#0D7A40",
                        border: "1px solid rgba(57,255,136,0.35)",
                        fontWeight: 700,
                      }
                    : {
                        background: "transparent",
                        color: "var(--ink-3)",
                        border: "1px solid var(--border)",
                      }
                }
              >
                {m.shortLabel}
              </button>
            );
          })}
          <Link href={`/map/economy?metric=${metric}`} className="journey-open">
            Carte complète <ArrowUpRight size={11} />
          </Link>
        </div>
      </div>

      <div className="journey-map-body">
        <EconomyInteractiveMap
          economyYear={yearData}
          metric={metric}
          selectedCountry={selectedCountry}
          onCountryClick={setSelectedCountry}
        />
      </div>

      <div className="journey-panel-foot">
        <p>{yearData.dataNote}</p>
      </div>
    </div>
  );

  const rankingsPanel = (
    <div className="journey-panel journey-panel--rank">
      <div className="journey-rank-body">
        <EconomyRankingsTable
          metric={metric}
          year={year}
          activeEconomyYear={yearData}
          ytdMode={false}
          onCountryClick={setSelectedCountry}
        />
      </div>
      <div className="journey-rank-foot">
        <Link href={`/map/economy?metric=${metric}`} className="journey-open">
          Voir le classement complet <ArrowUpRight size={11} />
        </Link>
      </div>
    </div>
  );

  return { mapPanel, rankingsPanel };
}

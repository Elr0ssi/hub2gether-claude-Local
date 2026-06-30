"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, TrendingUp, Percent, Users, Building2, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { useState } from "react";
import type { EconomyMetricId } from "@/types";
import { ECONOMY_METRICS, ECONOMY_YEARS } from "@/data/economy/economy";
import { getDebtByCountry } from "@/data/economy/debtData";
import { getLaborByCountry } from "@/data/economy/laborData";
import { getTradeByCountry, fmtTradeBalance } from "@/data/economy/tradeData";
import { COMPARISON_COUNTRIES } from "@/data/comparison/comparisonData";
import type { CountryEconomyData } from "@/types";

const _compIndex = new Map(COMPARISON_COUNTRIES.map(c => [c.name, c]));

interface EconomySidePanelProps {
  countryName: string | null;
  yearData: { year: number; countries: Record<string, CountryEconomyData> } | undefined;
  metric: EconomyMetricId;
  open: boolean;
  onClose: () => void;
}

function fmtNumber(v: number): string {
  return v.toLocaleString("fr-FR");
}

function fmtMetric(v: number | undefined, metric: EconomyMetricId): string {
  if (v === undefined) return "—";
  if (metric === "gdp")             return `${fmtNumber(v)} Mds€`;
  if (metric === "companies")       return `${fmtNumber(v)} k`;
  if (metric === "gdp_per_capita")  return `${fmtNumber(Math.round(v))} $`;
  if (metric === "trade_balance")   return `${v > 0 ? "+" : ""}${fmtNumber(Math.round(v))} Mds$`;
  return `${v.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`;
}

function fmtDebtAmount(gdp: number, debtRatio: number): string {
  const amount = Math.round(gdp * debtRatio / 100);
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)} T€`;
  return `${fmtNumber(amount)} Mds€`;
}

function getMaxForTrend(countryName: string, metric: EconomyMetricId): number {
  let max = 1;
  for (const yr of ECONOMY_YEARS) {
    const d = yr.countries[countryName];
    if (d) { const v = d[metric] as number; if (v > max) max = v; }
  }
  return max;
}

// Min-max range across years for signed/optional metrics (e.g. trade balance can be negative)
function getTrendRange(countryName: string, metric: EconomyMetricId): { min: number; max: number } {
  let min = metric === "trade_balance" ? Infinity : 0;
  let max = metric === "trade_balance" ? -Infinity : 1;
  for (const yr of ECONOMY_YEARS) {
    const d = yr.countries[countryName];
    const v = d ? (d[metric] as number | undefined) : undefined;
    if (v === undefined) continue;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (min === Infinity) min = 0;
  if (max === -Infinity) max = 1;
  if (max === min) max = min + 1;
  return { min, max };
}

// ─────────────────────────────────────────────────────────────
// View: GDP or DEBT
// ─────────────────────────────────────────────────────────────
function EconomicView({ countryName, yearData, metric }: { countryName: string; yearData: EconomySidePanelProps["yearData"]; metric: EconomyMetricId }) {
  const data = yearData?.countries[countryName];
  const debt = getDebtByCountry(countryName);
  if (!data) return null;
  const trendRange = getTrendRange(countryName, metric);

  return (
    <div className="px-4 py-4 flex flex-col gap-5">
      <p className="text-xs" style={{ color: "var(--ink-4)" }}>Données {yearData?.year}</p>

      {/* Active metric highlighted */}
      <div className="rounded-xl px-4 py-4 flex flex-col gap-1" style={{ background: "var(--accent-dim)", border: "1px solid rgba(57,255,136,0.3)" }}>
        <span className="text-xs font-semibold" style={{ color: "#0D7A40" }}>
          {metric === "debt_ratio" ? `Montant de la dette ${yearData?.year}` : ECONOMY_METRICS.find(m => m.id === metric)?.label}
        </span>
        <span className="text-2xl font-bold tabular-nums" style={{ color: "#0D7A40" }}>
          {metric === "debt_ratio"
            ? fmtDebtAmount(data.gdp, data.debt_ratio)
            : fmtMetric(data[metric] as number | undefined, metric)}
        </span>
        {metric === "debt_ratio" && debt && (
          <span className="text-xs mt-1" style={{ color: "#0D7A40", opacity: 0.8 }}>{debt.creditor}</span>
        )}
      </div>

      {/* GDP context grid */}
      {metric === "gdp" && (() => {
        const comp = _compIndex.get(countryName);
        const trade = getTradeByCountry(countryName);
        return (
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl px-3 py-2.5" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <p style={{ color: "var(--ink-3)", fontSize: "0.6rem", textTransform: "uppercase", fontWeight: 700 }}>PIB / habitant</p>
              <p className="text-sm font-bold tabular-nums mt-0.5" style={{ color: "var(--ink)" }}>
                {comp ? `${comp.gdp_per_capita_usd.toLocaleString("fr-FR")} €` : "—"}
              </p>
              <p style={{ color: "var(--ink-4)", fontSize: "0.58rem" }}>par personne</p>
            </div>
            <div className="rounded-xl px-3 py-2.5" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <p style={{ color: "var(--ink-3)", fontSize: "0.6rem", textTransform: "uppercase", fontWeight: 700 }}>Balance commerciale</p>
              <p
                className="text-sm font-bold tabular-nums mt-0.5"
                style={{ color: trade ? (trade.balance_bn >= 0 ? "#16a34a" : "#dc2626") : "var(--ink)" }}
              >
                {trade ? fmtTradeBalance(trade.balance_bn) : "—"}
              </p>
              <p style={{ color: "var(--ink-4)", fontSize: "0.58rem" }}>exports − imports</p>
            </div>
          </div>
        );
      })()}

      {/* Debt context grid */}
      {metric === "debt_ratio" && debt && (
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl px-3 py-2.5" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <p style={{ color: "var(--ink-3)", fontSize: "0.6rem", textTransform: "uppercase", fontWeight: 700 }}>Inflation 2024</p>
            <p className="text-sm font-bold tabular-nums mt-0.5" style={{ color: "var(--ink)" }}>{debt.inflation_2024} %</p>
          </div>
          <div className="rounded-xl px-3 py-2.5" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <p style={{ color: "var(--ink-3)", fontSize: "0.6rem", textTransform: "uppercase", fontWeight: 700 }}>% Dette / PIB</p>
            <p className="text-sm font-bold tabular-nums mt-0.5" style={{ color: "var(--ink)" }}>
              {data.debt_ratio.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %
            </p>
            <p style={{ color: "var(--ink-4)", fontSize: "0.58rem" }}>{yearData?.year}</p>
          </div>
        </div>
      )}

      {/* Year trend */}
      <div>
        <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>
          Évolution — {ECONOMY_METRICS.find(m => m.id === metric)?.label}
        </p>
        <div className="flex flex-col gap-1.5">
          {ECONOMY_YEARS.map((yr) => {
            const d = yr.countries[countryName];
            const v = d ? (d[metric] as number | undefined) : undefined;
            if (v === undefined) return null;
            const isCurrent = yr.year === yearData?.year;
            const pct = Math.min(Math.max(((v - trendRange.min) / (trendRange.max - trendRange.min)) * 100, 0), 100);
            return (
              <div key={yr.year} className="flex items-center gap-2">
                <span className="text-xs tabular-nums" style={{ color: isCurrent ? "#0D7A40" : "var(--ink-3)", fontWeight: isCurrent ? 700 : 400, minWidth: 36 }}>{yr.year}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: isCurrent ? "#39FF88" : "var(--ink-4)", transition: "width 0.4s ease" }} />
                </div>
                <span className="text-xs tabular-nums text-right" style={{ color: isCurrent ? "#0D7A40" : "var(--ink-3)", minWidth: 72 }}>{fmtMetric(v, metric)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// View: UNEMPLOYMENT
// ─────────────────────────────────────────────────────────────
function UnemploymentView({ countryName, yearData }: { countryName: string; yearData: EconomySidePanelProps["yearData"] }) {
  const data = yearData?.countries[countryName];
  const labor = getLaborByCountry(countryName);
  const maxVal = getMaxForTrend(countryName, "unemployment");
  if (!data) return null;

  return (
    <div className="px-4 py-4 flex flex-col gap-5">
      <p className="text-xs" style={{ color: "var(--ink-4)" }}>Données {yearData?.year}</p>

      {/* Main rate */}
      <div className="rounded-xl px-4 py-4 flex flex-col gap-1" style={{ background: "var(--accent-dim)", border: "1px solid rgba(57,255,136,0.3)" }}>
        <span className="text-xs font-semibold" style={{ color: "#0D7A40" }}>Taux de chômage</span>
        <span className="text-3xl font-bold tabular-nums" style={{ color: "#0D7A40" }}>{data.unemployment.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %</span>
      </div>

      {/* Active population + retirement */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl px-3 py-3 flex flex-col gap-1" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
          <p style={{ color: "var(--ink-3)", fontSize: "0.6rem", textTransform: "uppercase", fontWeight: 700 }}>Pop. active</p>
          <p className="text-base font-bold tabular-nums" style={{ color: "var(--ink)" }}>
            {labor ? `${labor.active_population_millions.toLocaleString("fr-FR")} M` : "—"}
          </p>
          <p style={{ color: "var(--ink-4)", fontSize: "0.58rem" }}>personnes</p>
        </div>
        <div className="rounded-xl px-3 py-3 flex flex-col gap-1" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
          <p style={{ color: "var(--ink-3)", fontSize: "0.6rem", textTransform: "uppercase", fontWeight: 700 }}>Âge retraite</p>
          <p className="text-base font-bold tabular-nums" style={{ color: "var(--ink)" }}>
            {labor ? `${labor.retirement_age} ans` : "—"}
          </p>
          <p style={{ color: "var(--ink-4)", fontSize: "0.58rem" }}>officiel</p>
        </div>
      </div>

      {/* Trend */}
      <div>
        <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>Évolution du chômage</p>
        <div className="flex flex-col gap-1.5">
          {ECONOMY_YEARS.map((yr) => {
            const d = yr.countries[countryName];
            if (!d) return null;
            const v = d.unemployment;
            const isCurrent = yr.year === yearData?.year;
            return (
              <div key={yr.year} className="flex items-center gap-2">
                <span className="text-xs tabular-nums" style={{ color: isCurrent ? "#0D7A40" : "var(--ink-3)", fontWeight: isCurrent ? 700 : 400, minWidth: 36 }}>{yr.year}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min((v / maxVal) * 100, 100)}%`, background: isCurrent ? "#39FF88" : "var(--ink-4)", transition: "width 0.4s ease" }} />
                </div>
                <span className="text-xs tabular-nums text-right" style={{ color: isCurrent ? "#0D7A40" : "var(--ink-3)", minWidth: 48 }}>{v.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// View: COMPANIES
// ─────────────────────────────────────────────────────────────
function CompaniesView({ countryName, yearData }: { countryName: string; yearData: EconomySidePanelProps["yearData"] }) {
  const data = yearData?.countries[countryName];
  const labor = getLaborByCountry(countryName);
  const comp = _compIndex.get(countryName);
  const activePct = labor && comp ? ((labor.active_population_millions / comp.population_millions) * 100) : null;

  const year2023Data = ECONOMY_YEARS.find(y => y.year === 2023)?.countries[countryName];
  const topCompanies = year2023Data?.top_companies;
  const maxVal = getMaxForTrend(countryName, "companies");

  if (!data) return null;

  return (
    <div className="px-4 py-4 flex flex-col gap-5">
      <p className="text-xs" style={{ color: "var(--ink-4)" }}>Données {yearData?.year}</p>

      {/* Total count */}
      <div className="rounded-xl px-3 py-3 flex items-center justify-between gap-3" style={{ background: "var(--accent-dim)", border: "1px solid rgba(57,255,136,0.3)" }}>
        <span className="text-xs font-semibold" style={{ color: "#0D7A40" }}>Entreprises enregistrées</span>
        <span className="text-xl font-bold tabular-nums" style={{ color: "#0D7A40" }}>{fmtNumber(data.companies)} k</span>
      </div>

      {/* Active population */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl px-3 py-3 flex flex-col gap-1" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
          <p style={{ color: "var(--ink-3)", fontSize: "0.6rem", textTransform: "uppercase", fontWeight: 700 }}>Pop. active</p>
          <p className="text-base font-bold tabular-nums" style={{ color: "var(--ink)" }}>
            {labor ? `${labor.active_population_millions.toLocaleString("fr-FR")} M` : "—"}
          </p>
          <p style={{ color: "var(--ink-4)", fontSize: "0.58rem" }}>personnes (15-64 ans)</p>
        </div>
        <div className="rounded-xl px-3 py-3 flex flex-col gap-1" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
          <p style={{ color: "var(--ink-3)", fontSize: "0.6rem", textTransform: "uppercase", fontWeight: 700 }}>% Pop. active</p>
          <p className="text-base font-bold tabular-nums" style={{ color: "var(--ink)" }}>
            {activePct !== null ? `${activePct.toFixed(1)} %` : "—"}
          </p>
          <p style={{ color: "var(--ink-4)", fontSize: "0.58rem" }}>sur {comp ? `${comp.population_millions.toLocaleString("fr-FR")} M hab.` : "—"}</p>
        </div>
      </div>

      {/* Year trend */}
      <div>
        <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>
          Évolution des entreprises
        </p>
        <div className="flex flex-col gap-1.5">
          {ECONOMY_YEARS.map((yr) => {
            const d = yr.countries[countryName];
            if (!d) return null;
            const v = d.companies;
            const isCurrent = yr.year === yearData?.year;
            return (
              <div key={yr.year} className="flex items-center gap-2">
                <span className="text-xs tabular-nums" style={{ color: isCurrent ? "#0D7A40" : "var(--ink-3)", fontWeight: isCurrent ? 700 : 400, minWidth: 36 }}>{yr.year}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min((v / maxVal) * 100, 100)}%`, background: isCurrent ? "#39FF88" : "var(--ink-4)", transition: "width 0.4s ease" }} />
                </div>
                <span className="text-xs tabular-nums text-right" style={{ color: isCurrent ? "#0D7A40" : "var(--ink-3)", minWidth: 52 }}>{fmtNumber(v)} k</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top companies (always from 2023) */}
      {topCompanies && topCompanies.length > 0 ? (
        <div>
          <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>
            Top {topCompanies.length} entreprises <span style={{ color: "var(--ink-4)", textTransform: "none", fontWeight: 400 }}>(2023)</span>
          </p>
          <div className="flex flex-col gap-1.5">
            {topCompanies.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                <span className="text-xs font-bold tabular-nums" style={{ color: "var(--accent)", minWidth: 18 }}>{i + 1}</span>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-semibold truncate" style={{ color: "var(--ink)" }}>{c.name}</span>
                  <span style={{ color: "var(--ink-4)", fontSize: "0.6rem" }}>{c.sector}</span>
                </div>
                <span className="text-xs tabular-nums whitespace-nowrap" style={{ color: "var(--ink-2)" }}>{c.revenue_bn} Mds€</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl px-3 py-3 text-center" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--ink-4)" }}>Données top entreprises disponibles pour l'année 2023</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main panel
// ─────────────────────────────────────────────────────────────
export function EconomySidePanel({ countryName, yearData, metric, open, onClose }: EconomySidePanelProps) {
  const hasData = Boolean(countryName && yearData?.countries[countryName ?? ""]);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex-shrink-0 overflow-hidden w-full lg:w-[300px] lg:min-w-[300px] border-t lg:border-t-0 lg:border-l"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 sticky top-0" style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)", zIndex: 10 }}>
              <span className="text-sm font-bold" style={{ color: "#0D7A40" }}>
                {countryName ?? "Sélection"}
              </span>
              <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg"><X size={14} /></button>
            </div>

            {/* Empty state */}
            {!hasData ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
                <TrendingUp size={28} style={{ color: "var(--ink-4)" }} />
                <p className="text-sm" style={{ color: "var(--ink-3)" }}>Cliquez sur un pays pour voir ses données économiques</p>
              </div>
            ) : metric === "companies" ? (
              <CompaniesView countryName={countryName!} yearData={yearData} />
            ) : metric === "unemployment" ? (
              <UnemploymentView countryName={countryName!} yearData={yearData} />
            ) : (
              <EconomicView countryName={countryName!} yearData={yearData} metric={metric} />
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

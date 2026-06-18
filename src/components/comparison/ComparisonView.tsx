"use client";

import { useState, useRef, useEffect } from "react";
import { BarChart2, Globe, Zap, Shield, ArrowRight, ChevronDown, Search } from "lucide-react";
import { COMPARISON_COUNTRIES, getComparisonByName, getMilitaryCap, MILITARY_CAPABILITIES, type ComparisonCountry } from "@/data/comparison/comparisonData";
import { getYearData } from "@/data/economy/economy";
import { getDebtByCountry } from "@/data/economy/debtData";

const CATEGORIES = [
  { id: "economy",   label: "Économie",   Icon: BarChart2 },
  { id: "geo",       label: "Géographie", Icon: Globe     },
  { id: "resources", label: "Ressources", Icon: Zap       },
  { id: "military",  label: "Militaire",  Icon: Shield    },
] as const;
type CategoryId = typeof CATEGORIES[number]["id"];

interface ComparisonRow {
  label: string;
  unit: string;
  valueA: number | null;
  valueB: number | null;
  higherLabel?: string;
  rankA?: number | null;
  rankB?: number | null;
}

function fmt(v: number, unit: string): string {
  if (unit === "Mds$")    return `${v.toLocaleString("fr-FR")} Mds$`;
  if (unit === "USD/hab") return `${v.toLocaleString("fr-FR")} $`;
  if (unit === "km²")     return `${v.toLocaleString("fr-FR")} km²`;
  if (unit === "M hab")   return `${v.toLocaleString("fr-FR")} M`;
  if (unit === "kbd")     return `${v.toLocaleString("fr-FR")} kb/j`;
  if (unit === "Bcm/an")  return `${v.toLocaleString("fr-FR")} Bcm/an`;
  if (unit === "Mt/an")   return `${v.toLocaleString("fr-FR")} Mt/an`;
  if (unit === "hab/km²") return `${v.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} hab/km²`;
  if (unit === "%")       return `${v.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`;
  return `${v.toLocaleString("fr-FR")} ${unit}`;
}

// Calcule le classement d'un pays parmi une liste de valeurs (1 = le plus élevé)
function rankAmongCmp(
  countryName: string,
  getValue: (c: (typeof COMPARISON_COUNTRIES)[number]) => number | null | undefined
): number | null {
  const sorted = COMPARISON_COUNTRIES
    .map((c) => ({ name: c.name, value: getValue(c) ?? 0 }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value);
  const idx = sorted.findIndex((c) => c.name === countryName);
  return idx >= 0 ? idx + 1 : null;
}

function rankAmongEco(
  countryName: string,
  countries: Record<string, { gdp?: number; debt_ratio?: number; unemployment?: number; companies?: number }>,
  field: "gdp" | "debt_ratio" | "unemployment" | "companies"
): number | null {
  const sorted = Object.entries(countries)
    .map(([name, d]) => ({ name, value: (d[field] as number) ?? 0 }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value);
  const idx = sorted.findIndex((c) => c.name === countryName);
  return idx >= 0 ? idx + 1 : null;
}

function rankAmongMil(countryName: string, field: "tanks" | "infantry_k" | "ships" | "aircraft"): number | null {
  const sorted = Object.entries(MILITARY_CAPABILITIES)
    .map(([name, d]) => ({ name, value: d[field] ?? 0 }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value);
  const idx = sorted.findIndex((c) => c.name === countryName);
  return idx >= 0 ? idx + 1 : null;
}

// ── Searchable country combobox ───────────────────────────────────────────────
function CountryCombobox({
  value,
  onChange,
  countries,
}: {
  value: string;
  onChange: (name: string) => void;
  countries: ComparisonCountry[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = countries.find((c) => c.name === value);
  const filtered = query.trim()
    ? countries.filter(
        (c) =>
          c.name_fr.toLowerCase().includes(query.toLowerCase()) ||
          c.name.toLowerCase().includes(query.toLowerCase())
      )
    : countries;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-1 w-full">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          color: "var(--ink)",
          outline: "none",
          cursor: "pointer",
        }}
      >
        <span className="text-base shrink-0">{selected?.flag ?? "🌍"}</span>
        <span className="flex-1 text-left truncate">{selected?.name_fr ?? value}</span>
        <ChevronDown size={13} style={{ color: "var(--ink-4)", flexShrink: 0 }} />
      </button>

      {open && (
        <div
          className="absolute top-full mt-1 left-0 right-0 z-50 rounded-xl overflow-hidden shadow-xl"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            maxHeight: "260px",
            overflowY: "auto",
          }}
        >
          <div
            className="sticky top-0 px-3 py-2 flex items-center gap-2"
            style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)", zIndex: 10 }}
          >
            <Search size={12} style={{ color: "var(--ink-4)", flexShrink: 0 }} />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un pays…"
              className="bg-transparent outline-none text-xs w-full"
              style={{ color: "var(--ink)" }}
            />
          </div>
          {filtered.length === 0 && (
            <div className="px-4 py-3 text-xs" style={{ color: "var(--ink-4)" }}>
              Aucun résultat
            </div>
          )}
          {filtered.map((c) => (
            <button
              key={c.code}
              onClick={() => { onChange(c.name); setOpen(false); setQuery(""); }}
              className="w-full px-3 py-2 flex items-center gap-2 text-left transition-colors"
              style={{
                background: c.name === value ? "var(--accent-dim)" : "transparent",
                color: c.name === value ? "#0D7A40" : "var(--ink)",
                borderBottom: "1px solid var(--border-light)",
                fontSize: "0.875rem",
              }}
              onMouseEnter={(e) => {
                if (c.name !== value) (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
              }}
              onMouseLeave={(e) => {
                if (c.name !== value) (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <span className="text-base shrink-0">{c.flag}</span>
              <span>{c.name_fr}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ComparisonRow({
  label, unit, valueA, valueB, flagA, flagB, nameA, nameB,
  higherLabel = "plus élevé", rankA, rankB,
}: ComparisonRow & { flagA: string; flagB: string; nameA: string; nameB: string }) {
  if (valueA === null && valueB === null) return null;
  const a = valueA ?? 0;
  const b = valueB ?? 0;
  const max = Math.max(a, b, 1);
  const pctA = (a / max) * 100;
  const pctB = (b / max) * 100;
  const ratio = a > 0 && b > 0 ? Math.max(a, b) / Math.min(a, b) : null;
  const winner = a > b ? nameA : b > a ? nameB : null;
  const winnerFlag = a > b ? flagA : b > a ? flagB : null;

  return (
    <div className="flex flex-col gap-3 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold" style={{ color: "var(--ink-2)" }}>{label}</span>
        <span className="text-xs" style={{ color: "var(--ink-4)" }}>{unit}</span>
      </div>

      {/* Pays A */}
      <div className="flex items-center gap-3">
        <span className="text-lg shrink-0">{flagA}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs" style={{ color: "var(--ink-3)" }}>{nameA}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold tabular-nums" style={{ color: a >= b ? "#0D7A40" : "var(--ink-3)" }}>
                {valueA !== null ? fmt(a, unit) : "—"}
              </span>
              {rankA !== null && rankA !== undefined && (
                <span className="tabular-nums px-1.5 py-0.5 rounded-md font-bold" style={{ color: "#0D7A40", background: "rgba(57,255,136,0.12)", border: "1px solid rgba(57,255,136,0.3)", fontSize: "0.58rem" }}>
                  #{rankA}
                </span>
              )}
            </div>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pctA}%`, background: a >= b ? "#0D7A40" : "var(--ink-4)", opacity: valueA === null ? 0.2 : 1 }}
            />
          </div>
        </div>
      </div>

      {/* Pays B */}
      <div className="flex items-center gap-3">
        <span className="text-lg shrink-0">{flagB}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs" style={{ color: "var(--ink-3)" }}>{nameB}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold tabular-nums" style={{ color: b >= a ? "#0D7A40" : "var(--ink-3)" }}>
                {valueB !== null ? fmt(b, unit) : "—"}
              </span>
              {rankB !== null && rankB !== undefined && (
                <span className="tabular-nums px-1.5 py-0.5 rounded-md font-bold" style={{ color: "#0D7A40", background: "rgba(57,255,136,0.12)", border: "1px solid rgba(57,255,136,0.3)", fontSize: "0.58rem" }}>
                  #{rankB}
                </span>
              )}
            </div>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pctB}%`, background: b >= a ? "#0D7A40" : "var(--ink-4)", opacity: valueB === null ? 0.2 : 1 }}
            />
          </div>
        </div>
      </div>

      {/* Ratio */}
      {ratio !== null && winner && (
        <div className="flex items-center gap-1.5 self-end">
          <span className="text-lg">{winnerFlag}</span>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "var(--accent-dim)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.3)" }}>
            {ratio >= 2 ? `${ratio.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}×` : `+${((ratio - 1) * 100).toFixed(0)}%`} {higherLabel}
          </span>
        </div>
      )}
      {ratio === null && (
        <span className="text-xs self-end" style={{ color: "var(--ink-4)" }}>Données indisponibles</span>
      )}
    </div>
  );
}

export function ComparisonView() {
  const [countryA, setCountryA] = useState("France");
  const [countryB, setCountryB] = useState("Germany");
  const [category, setCategory] = useState<CategoryId>("economy");

  const ecoData2023 = getYearData(2023);
  const cmpA = getComparisonByName(countryA);
  const cmpB = getComparisonByName(countryB);
  const ecoA = ecoData2023?.countries[countryA];
  const ecoB = ecoData2023?.countries[countryB];
  const debtA = getDebtByCountry(countryA);
  const debtB = getDebtByCountry(countryB);
  const milA = getMilitaryCap(countryA);
  const milB = getMilitaryCap(countryB);

  const sortedCountries = [...COMPARISON_COUNTRIES].sort((a, b) => a.name_fr.localeCompare(b.name_fr, "fr"));

  const ecoCountries = ecoData2023?.countries ?? {};

  const economyRows: ComparisonRow[] = [
    {
      label: "PIB", unit: "Mds$",
      valueA: ecoA?.gdp ?? null, valueB: ecoB?.gdp ?? null, higherLabel: "plus grand",
      rankA: rankAmongEco(countryA, ecoCountries, "gdp"),
      rankB: rankAmongEco(countryB, ecoCountries, "gdp"),
    },
    {
      label: "PIB / habitant", unit: "USD/hab",
      valueA: cmpA?.gdp_per_capita_usd ?? null, valueB: cmpB?.gdp_per_capita_usd ?? null, higherLabel: "plus riche",
      rankA: rankAmongCmp(countryA, (c) => c.gdp_per_capita_usd),
      rankB: rankAmongCmp(countryB, (c) => c.gdp_per_capita_usd),
    },
    {
      label: "Dette / PIB", unit: "%",
      valueA: debtA?.debt_2024_pct ?? ecoA?.debt_ratio ?? null, valueB: debtB?.debt_2024_pct ?? ecoB?.debt_ratio ?? null, higherLabel: "plus endetté",
      rankA: rankAmongEco(countryA, ecoCountries, "debt_ratio"),
      rankB: rankAmongEco(countryB, ecoCountries, "debt_ratio"),
    },
    {
      label: "Dette 2024", unit: "Mds$",
      valueA: debtA ? debtA.debt_2024_bn * 1.09 : null, valueB: debtB ? debtB.debt_2024_bn * 1.09 : null, higherLabel: "plus de dette",
      rankA: null, rankB: null,
    },
    {
      label: "Taux de chômage", unit: "%",
      valueA: ecoA?.unemployment ?? null, valueB: ecoB?.unemployment ?? null, higherLabel: "plus de chômage",
      rankA: rankAmongEco(countryA, ecoCountries, "unemployment"),
      rankB: rankAmongEco(countryB, ecoCountries, "unemployment"),
    },
    {
      label: "Inflation 2024", unit: "%",
      valueA: debtA?.inflation_2024 ?? null, valueB: debtB?.inflation_2024 ?? null, higherLabel: "plus d'inflation",
      rankA: null, rankB: null,
    },
    {
      label: "Entreprises", unit: "k",
      valueA: ecoA?.companies ?? null, valueB: ecoB?.companies ?? null, higherLabel: "plus d'entreprises",
      rankA: rankAmongEco(countryA, ecoCountries, "companies"),
      rankB: rankAmongEco(countryB, ecoCountries, "companies"),
    },
  ];

  const geoRows: ComparisonRow[] = [
    {
      label: "Superficie", unit: "km²",
      valueA: cmpA?.surface_km2 ?? null, valueB: cmpB?.surface_km2 ?? null, higherLabel: "plus grand",
      rankA: rankAmongCmp(countryA, (c) => c.surface_km2),
      rankB: rankAmongCmp(countryB, (c) => c.surface_km2),
    },
    {
      label: "Population", unit: "M hab",
      valueA: cmpA?.population_millions ?? null, valueB: cmpB?.population_millions ?? null, higherLabel: "plus peuplé",
      rankA: rankAmongCmp(countryA, (c) => c.population_millions),
      rankB: rankAmongCmp(countryB, (c) => c.population_millions),
    },
    {
      label: "Densité", unit: "hab/km²",
      valueA: cmpA ? cmpA.population_millions * 1_000_000 / cmpA.surface_km2 : null,
      valueB: cmpB ? cmpB.population_millions * 1_000_000 / cmpB.surface_km2 : null,
      higherLabel: "plus dense",
      rankA: rankAmongCmp(countryA, (c) => c.population_millions * 1_000_000 / c.surface_km2),
      rankB: rankAmongCmp(countryB, (c) => c.population_millions * 1_000_000 / c.surface_km2),
    },
  ];

  const resourceRows: ComparisonRow[] = [
    {
      label: "Production pétrole", unit: "kbd",
      valueA: cmpA?.oil_kbd ?? null, valueB: cmpB?.oil_kbd ?? null, higherLabel: "plus producteur",
      rankA: rankAmongCmp(countryA, (c) => c.oil_kbd),
      rankB: rankAmongCmp(countryB, (c) => c.oil_kbd),
    },
    {
      label: "Production gaz", unit: "Bcm/an",
      valueA: cmpA?.gas_bcm ?? null, valueB: cmpB?.gas_bcm ?? null, higherLabel: "plus producteur",
      rankA: rankAmongCmp(countryA, (c) => c.gas_bcm),
      rankB: rankAmongCmp(countryB, (c) => c.gas_bcm),
    },
    {
      label: "Production blé", unit: "Mt/an",
      valueA: cmpA?.wheat_mt ?? null, valueB: cmpB?.wheat_mt ?? null, higherLabel: "plus producteur",
      rankA: rankAmongCmp(countryA, (c) => c.wheat_mt),
      rankB: rankAmongCmp(countryB, (c) => c.wheat_mt),
    },
    {
      label: "Production charbon", unit: "Mt/an",
      valueA: cmpA?.coal_mt ?? null, valueB: cmpB?.coal_mt ?? null, higherLabel: "plus producteur",
      rankA: rankAmongCmp(countryA, (c) => c.coal_mt),
      rankB: rankAmongCmp(countryB, (c) => c.coal_mt),
    },
  ];

  const militaryRows: ComparisonRow[] = [
    {
      label: "Budget militaire", unit: "Mds$",
      valueA: cmpA?.military_budget_bn ?? null, valueB: cmpB?.military_budget_bn ?? null, higherLabel: "plus dépensier",
      rankA: rankAmongCmp(countryA, (c) => c.military_budget_bn),
      rankB: rankAmongCmp(countryB, (c) => c.military_budget_bn),
    },
    {
      label: "Chars d'assaut", unit: "chars",
      valueA: milA.tanks ?? null, valueB: milB.tanks ?? null, higherLabel: "plus de chars",
      rankA: rankAmongMil(countryA, "tanks"),
      rankB: rankAmongMil(countryB, "tanks"),
    },
    {
      label: "Forces terrestres", unit: "k pers.",
      valueA: milA.infantry_k ?? null, valueB: milB.infantry_k ?? null, higherLabel: "plus d'effectifs",
      rankA: rankAmongMil(countryA, "infantry_k"),
      rankB: rankAmongMil(countryB, "infantry_k"),
    },
    {
      label: "Marine militaire", unit: "navires",
      valueA: milA.ships ?? null, valueB: milB.ships ?? null, higherLabel: "plus de navires",
      rankA: rankAmongMil(countryA, "ships"),
      rankB: rankAmongMil(countryB, "ships"),
    },
    {
      label: "Aviation militaire", unit: "appareils",
      valueA: milA.aircraft ?? null, valueB: milB.aircraft ?? null, higherLabel: "plus d'appareils",
      rankA: rankAmongMil(countryA, "aircraft"),
      rankB: rankAmongMil(countryB, "aircraft"),
    },
  ];

  const rowsMap: Record<CategoryId, ComparisonRow[]> = {
    economy:   economyRows,
    geo:       geoRows,
    resources: resourceRows,
    military:  militaryRows,
  };

  const activeRows = rowsMap[category];

  return (
    <div className="flex flex-col gap-8">
      {/* Sélecteurs de pays */}
      <div
        className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}
      >
        {/* Pays A */}
        <div className="flex-1 flex flex-col gap-1.5 w-full">
          <label className="text-xs font-semibold" style={{ color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Pays A</label>
          <CountryCombobox value={countryA} onChange={setCountryA} countries={sortedCountries} />
          {cmpA && (
            <p className="text-xs" style={{ color: "var(--ink-4)" }}>
              {cmpA.capital} · {cmpA.population_millions.toLocaleString("fr-FR")} M hab.
            </p>
          )}
        </div>

        {/* VS */}
        <div className="flex items-center justify-center">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ background: "var(--accent-dim)", color: "#0D7A40", border: "2px solid rgba(57,255,136,0.4)" }}
          >
            VS
          </div>
        </div>

        {/* Pays B */}
        <div className="flex-1 flex flex-col gap-1.5 w-full">
          <label className="text-xs font-semibold" style={{ color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Pays B</label>
          <CountryCombobox value={countryB} onChange={setCountryB} countries={sortedCountries} />
          {cmpB && (
            <p className="text-xs" style={{ color: "var(--ink-4)" }}>
              {cmpB.capital} · {cmpB.population_millions.toLocaleString("fr-FR")} M hab.
            </p>
          )}
        </div>
      </div>

      {/* Onglets de catégorie */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setCategory(id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150"
            style={
              id === category
                ? { background: "var(--accent-dim)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.3)", fontWeight: 700 }
                : { background: "var(--surface)", color: "var(--ink-3)", border: "1px solid var(--border)" }
            }
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Résultats de comparaison */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}
      >
        {/* En-tête */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{cmpA?.flag}</span>
            <span className="text-sm font-bold" style={{ color: "var(--ink)" }}>{cmpA?.name_fr ?? countryA}</span>
            <ArrowRight size={14} style={{ color: "var(--ink-4)" }} />
            <span className="text-xl">{cmpB?.flag}</span>
            <span className="text-sm font-bold" style={{ color: "var(--ink)" }}>{cmpB?.name_fr ?? countryB}</span>
          </div>
          <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "var(--accent-dim)", color: "#0D7A40", fontWeight: 600 }}>
            {CATEGORIES.find((c) => c.id === category)?.label}
          </span>
        </div>

        {/* Lignes de comparaison */}
        <div className="px-6">
          {activeRows.map((row) => (
            <ComparisonRow
              key={row.label}
              {...row}
              flagA={cmpA?.flag ?? "🌍"}
              flagB={cmpB?.flag ?? "🌍"}
              nameA={cmpA?.name_fr ?? countryA}
              nameB={cmpB?.name_fr ?? countryB}
            />
          ))}
        </div>
      </div>

      {/* Note de source */}
      <p className="text-xs text-center" style={{ color: "var(--ink-4)" }}>
        Sources : Banque mondiale, FMI, OIT, BP Statistical Review, SIPRI, FAO, IISS Military Balance — données 2023/2024
      </p>
    </div>
  );
}

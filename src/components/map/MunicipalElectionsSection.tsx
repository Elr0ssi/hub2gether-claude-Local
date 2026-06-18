"use client";

import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { ChevronDown, Search, Building2, AlertCircle, Calendar, X, MapPin } from "lucide-react";
import { useDragScroll } from "@/hooks/useDragScroll";
import {
  MUNICIPAL_ELECTIONS,
  ALL_POLITICS_COUNTRIES,
  COUNTRY_NAMES_FR,
  ORIENTATION_COLORS_MUNICIPAL,
  ORIENTATION_LABELS_MUNICIPAL,
  getMunicipalData,
  type ElectionRound,
  type CityResult,
} from "@/data/politics/municipalElections";

const MunicipalCityMap = lazy(() =>
  import("./MunicipalCityMap").then((m) => ({ default: m.MunicipalCityMap }))
);

const COUNTRIES_WITH_DATA = new Set(MUNICIPAL_ELECTIONS.map((d) => d.country));

// ── Country dropdown ──────────────────────────────────────────────────────────
function CountryDropdown({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = ALL_POLITICS_COUNTRIES.find((c) => c.name === value);
  const filtered = query.trim()
    ? ALL_POLITICS_COUNTRIES.filter(
        (c) =>
          (COUNTRY_NAMES_FR[c.name] ?? c.name).toLowerCase().includes(query.toLowerCase()) ||
          c.name.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_POLITICS_COUNTRIES;

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
    <div ref={ref} className="relative w-full sm:w-72">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          color: value ? "var(--ink)" : "var(--ink-4)",
        }}
      >
        <span className="text-base">{selected?.flag ?? "🌍"}</span>
        <span className="flex-1 text-left">
          {value ? (COUNTRY_NAMES_FR[value] ?? value) : "Sélectionner un pays…"}
        </span>
        <ChevronDown size={13} style={{ color: "var(--ink-4)" }} />
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
            <Search size={12} style={{ color: "var(--ink-4)" }} />
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

          {filtered.map((c) => {
            const hasData = COUNTRIES_WITH_DATA.has(c.name);
            const isSelected = c.name === value;
            return (
              <button
                key={c.name}
                onClick={() => { onChange(c.name); setOpen(false); setQuery(""); }}
                className="w-full px-3 py-2 flex items-center justify-between gap-2 text-left transition-colors"
                style={{
                  background: isSelected ? "var(--accent-dim)" : "transparent",
                  color: isSelected ? "#0D7A40" : "var(--ink)",
                  borderBottom: "1px solid var(--border-light)",
                }}
                onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; }}
                onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{c.flag}</span>
                  <span className="text-sm">{COUNTRY_NAMES_FR[c.name] ?? c.name}</span>
                </div>
                {hasData && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-medium shrink-0"
                    style={{ background: "var(--accent-dim)", color: "#0D7A40", fontSize: "0.55rem" }}
                  >
                    données
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── City side panel ───────────────────────────────────────────────────────────
function CitySidePanel({ city, onClose }: { city: CityResult | null; onClose: () => void }) {
  if (!city) return null;
  const oriColor = ORIENTATION_COLORS_MUNICIPAL[city.orientation] ?? "#888";
  const oriLabel = ORIENTATION_LABELS_MUNICIPAL[city.orientation] ?? city.orientation;

  return (
    <div
      className="flex-shrink-0 w-full lg:w-[260px] lg:min-w-[260px] border-t lg:border-t-0 lg:border-l flex flex-col"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}
      >
        <div className="flex items-center gap-2">
          <MapPin size={13} style={{ color: oriColor }} />
          <span className="text-sm font-bold" style={{ color: "var(--ink)" }}>{city.city}</span>
        </div>
        <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg"><X size={14} /></button>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4 overflow-y-auto">
        {/* Orientation badge */}
        <div
          className="rounded-xl px-4 py-3 flex flex-col gap-1"
          style={{ background: `${oriColor}18`, border: `1px solid ${oriColor}44` }}
        >
          <span className="text-xs font-semibold" style={{ color: oriColor }}>{oriLabel}</span>
          <span className="text-lg font-bold" style={{ color: oriColor }}>{city.party}</span>
        </div>

        {/* Winner */}
        <div>
          <p style={{ color: "var(--ink-3)", fontSize: "0.62rem", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 4 }}>
            Maire élu(e)
          </p>
          <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{city.winner}</p>
        </div>

        {/* Vote share */}
        <div>
          <p style={{ color: "var(--ink-3)", fontSize: "0.62rem", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 6 }}>
            Part des votes
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${city.voteShare}%`, background: oriColor }}
              />
            </div>
            <span className="text-sm font-bold tabular-nums" style={{ color: oriColor }}>{city.voteShare.toFixed(1)} %</span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          <p style={{ color: "var(--ink-3)", fontSize: "0.62rem", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 8 }}>
            Légende carte
          </p>
          <div className="flex flex-col gap-1.5">
            {Object.entries(ORIENTATION_LABELS_MUNICIPAL).map(([k, label]) => (
              <div key={k} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: ORIENTATION_COLORS_MUNICIPAL[k] }} />
                <span style={{ color: "var(--ink-3)", fontSize: "0.6rem" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── City results grid (fallback / no-map view) ────────────────────────────────
function CityResultsGrid({ round }: { round: ElectionRound }) {
  if (round.cities.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-10 rounded-xl gap-2"
        style={{ background: "var(--surface-2)", border: "1px dashed var(--border)" }}
      >
        <Calendar size={22} style={{ color: "var(--ink-4)" }} />
        <p className="text-sm font-medium" style={{ color: "var(--ink-3)" }}>Scrutin à venir</p>
        <p style={{ color: "var(--ink-4)", fontSize: "0.72rem" }}>
          Les résultats seront disponibles après le {round.date.split("-").reverse().join("/")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {round.cities.map((city) => (
        <div
          key={city.city}
          className="rounded-xl px-4 py-3 flex flex-col gap-1.5"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold" style={{ color: "var(--ink)" }}>{city.city}</p>
            <span
              className="text-xs px-1.5 py-0.5 rounded font-semibold shrink-0"
              style={{ background: `${city.partyColor}22`, color: city.partyColor, border: `1px solid ${city.partyColor}44`, fontSize: "0.58rem" }}
            >
              {city.party}
            </span>
          </div>
          <p className="text-xs font-medium" style={{ color: "var(--ink-2)" }}>{city.winner}</p>
          <div className="mt-1">
            <div className="flex items-center justify-between mb-1">
              <p style={{ color: "var(--ink-4)", fontSize: "0.6rem" }}>Part des votes</p>
              <p style={{ color: city.partyColor, fontSize: "0.65rem", fontWeight: 700 }}>{city.voteShare.toFixed(1)} %</p>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface)" }}>
              <div className="h-full rounded-full" style={{ width: `${city.voteShare}%`, background: city.partyColor }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function MunicipalElectionsSection() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedRoundIdx, setSelectedRoundIdx] = useState(0);
  const [selectedCity, setSelectedCity] = useState<CityResult | null>(null);
  const { ref: yearsRef, onMouseDown, onMouseUp, onMouseLeave, onMouseMove } = useDragScroll();

  const data = selectedCountry ? getMunicipalData(selectedCountry) : null;
  const hasData = Boolean(data);

  const years = data?.elections.map((e) => e.year) ?? [];
  const activeYear = selectedYear ?? years[years.length - 1] ?? null;
  const activeElection = data?.elections.find((e) => e.year === activeYear);
  const activeRound = activeElection?.rounds[selectedRoundIdx];
  const hasCities = (activeRound?.cities.length ?? 0) > 0;

  const handleCountryChange = (name: string) => {
    setSelectedCountry(name);
    setSelectedYear(null);
    setSelectedRoundIdx(0);
    setSelectedCity(null);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setSelectedRoundIdx(0);
    setSelectedCity(null);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden mt-6"
      style={{ border: "1px solid var(--border)", background: "var(--surface)", boxShadow: "var(--shadow-float)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b flex items-center gap-3 flex-wrap"
        style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
      >
        <Building2 size={16} style={{ color: "var(--ink-3)" }} />
        <div className="flex-1">
          <p className="text-xs font-bold" style={{ color: "var(--ink-2)" }}>Élections municipales</p>
          <p style={{ color: "var(--ink-4)", fontSize: "0.65rem" }}>
            Résultats par ville · Données disponibles pour la France et l'Allemagne
          </p>
        </div>
        <CountryDropdown value={selectedCountry} onChange={handleCountryChange} />
      </div>

      <div className="px-5 py-4 flex flex-col gap-4">
        {/* No country selected */}
        {!selectedCountry && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <Building2 size={28} style={{ color: "var(--ink-4)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--ink-3)" }}>
              Sélectionnez un pays pour explorer ses élections municipales
            </p>
          </div>
        )}

        {/* Country selected but no data */}
        {selectedCountry && !hasData && (
          <div
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
          >
            <AlertCircle size={16} style={{ color: "var(--ink-3)", flexShrink: 0, marginTop: 1 }} />
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--ink-2)" }}>
                Données non disponibles pour {COUNTRY_NAMES_FR[selectedCountry] ?? selectedCountry}
              </p>
              <p style={{ color: "var(--ink-4)", fontSize: "0.72rem", marginTop: "4px" }}>
                Les données municipales sont actuellement disponibles uniquement pour la France et l'Allemagne.
                D'autres pays seront ajoutés prochainement.
              </p>
            </div>
          </div>
        )}

        {/* Country with data */}
        {selectedCountry && hasData && data && (
          <>
            {/* Year selector */}
            <div>
              <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>
                Scrutin
              </p>
              <div
                ref={yearsRef}
                className="flex gap-2 overflow-x-auto pb-1"
                style={{ scrollbarWidth: "none", cursor: "grab" }}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onMouseMove={onMouseMove}
              >
                {years.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => handleYearChange(yr)}
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shrink-0"
                    style={
                      yr === activeYear
                        ? { background: "var(--accent-dim)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.3)", fontWeight: 700 }
                        : { background: "var(--surface-2)", color: "var(--ink-3)", border: "1px solid var(--border)" }
                    }
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Round / Region selector */}
            {activeElection && activeElection.rounds.length > 1 && (
              <div>
                <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>
                  Tour / Région
                </p>
                <div className="flex gap-2 flex-wrap">
                  {activeElection.rounds.map((round, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setSelectedRoundIdx(idx); setSelectedCity(null); }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={
                        idx === selectedRoundIdx
                          ? { background: "var(--accent-dim)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.3)", fontWeight: 700 }
                          : { background: "var(--surface-2)", color: "var(--ink-3)", border: "1px solid var(--border)" }
                      }
                    >
                      {round.region ?? round.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Round label */}
            {activeRound && (
              <p className="text-xs font-semibold" style={{ color: "var(--ink-3)" }}>
                {activeRound.label}
              </p>
            )}

            {/* Map + side panel (only when there are cities) */}
            {activeRound && hasCities && (
              <div
                className="rounded-xl overflow-hidden flex flex-col lg:flex-row"
                style={{ border: "1px solid var(--border)", minHeight: "360px" }}
              >
                <div className="flex-1 overflow-hidden" style={{ minWidth: 0 }}>
                  <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center" style={{ minHeight: "360px", background: "var(--surface-2)" }}>
                      <span className="text-xs" style={{ color: "var(--ink-4)" }}>Chargement de la carte…</span>
                    </div>
                  }>
                    <MunicipalCityMap
                      cities={activeRound.cities}
                      country={selectedCountry}
                      selectedCity={selectedCity?.city ?? null}
                      onCityClick={(city) => setSelectedCity((prev) => prev?.city === city.city ? null : city)}
                    />
                  </Suspense>
                </div>

                {selectedCity ? (
                  <CitySidePanel city={selectedCity} onClose={() => setSelectedCity(null)} />
                ) : (
                  <div
                    className="flex-shrink-0 w-full lg:w-[200px] lg:min-w-[200px] border-t lg:border-t-0 lg:border-l flex flex-col items-center justify-center gap-2 py-6"
                    style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                  >
                    <MapPin size={20} style={{ color: "var(--ink-4)" }} />
                    <p className="text-xs text-center px-4" style={{ color: "var(--ink-4)" }}>
                      Cliquez sur une ville pour voir ses résultats
                    </p>
                    {/* Orientation legend */}
                    <div className="flex flex-col gap-1.5 mt-3 px-4">
                      {Object.entries(ORIENTATION_LABELS_MUNICIPAL).map(([k, label]) => (
                        <div key={k} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ background: ORIENTATION_COLORS_MUNICIPAL[k] }} />
                          <span style={{ color: "var(--ink-3)", fontSize: "0.6rem" }}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Empty round */}
            {activeRound && !hasCities && <CityResultsGrid round={activeRound} />}
          </>
        )}
      </div>

      {/* Source note */}
      <div
        className="px-5 py-2 border-t flex items-center justify-end"
        style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
      >
        <p style={{ color: "var(--ink-4)", fontSize: "0.6rem" }}>
          Sources : Ministère de l'Intérieur (France), Bundeswahlleiterin (Allemagne) — données à titre informatif
        </p>
      </div>
    </div>
  );
}

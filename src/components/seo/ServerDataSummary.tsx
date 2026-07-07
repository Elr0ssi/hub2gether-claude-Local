import { ECONOMY_YEARS } from "@/data/economy/economy";
import { EPIDEMICS } from "@/data/epidemics/epidemics";
import { getMilitaryData } from "@/data/military/military";
import { POLITICS_COUNTRIES } from "@/data/politics/politics";
import { ROMAN_TIMELINE } from "@/data/timeline";

interface Props {
  theme: string;
}

function Table({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "6px 10px",
                  borderBottom: "1px solid var(--border)",
                  color: "var(--ink-3)",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: "5px 10px",
                    borderBottom: "1px solid var(--border)",
                    color: "var(--ink-2)",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EconomySummary() {
  const year2025 = ECONOMY_YEARS.find((y) => y.year === 2025);
  if (!year2025) return null;

  const entries = Object.entries(year2025.countries);

  const topGdp = [...entries]
    .sort((a, b) => b[1].gdp - a[1].gdp)
    .slice(0, 15)
    .map(([name, d], i) => [i + 1, name, `${d.gdp.toLocaleString("fr-FR")} Mds €`, `${d.debt_ratio} %`, `${d.unemployment} %`]);

  const topDebt = [...entries]
    .filter(([, d]) => d.debt_ratio != null)
    .sort((a, b) => b[1].debt_ratio - a[1].debt_ratio)
    .slice(0, 15)
    .map(([name, d], i) => [i + 1, name, `${d.debt_ratio} %`, `${(d.debt_amount ?? 0).toLocaleString("fr-FR")} Mds €`]);

  return (
    <section aria-label="Données économiques mondiales 2025">
      <h2>Top 15 PIB mondial 2025 (FMI)</h2>
      <Table
        headers={["#", "Pays", "PIB (Mds €)", "Dette/PIB", "Chômage"]}
        rows={topGdp}
      />
      <h3 style={{ marginTop: "1.5rem" }}>Top 15 dette publique / PIB 2025</h3>
      <Table
        headers={["#", "Pays", "Dette/PIB", "Montant dette"]}
        rows={topDebt}
      />
    </section>
  );
}

function EpidemicsSummary() {
  const covid = EPIDEMICS.find((e) => e.id === "covid");
  if (!covid) return null;

  const topDeaths = Object.entries(covid.countries)
    .sort((a, b) => b[1].deaths - a[1].deaths)
    .slice(0, 15)
    .map(([name, d], i) => [
      i + 1,
      name,
      d.infected.toLocaleString("fr-FR"),
      d.deaths.toLocaleString("fr-FR"),
    ]);

  const hiv = EPIDEMICS.find((e) => e.id === "hiv");
  const topHiv = hiv
    ? Object.entries(hiv.countries)
        .sort((a, b) => b[1].infected - a[1].infected)
        .slice(0, 10)
        .map(([name, d], i) => [i + 1, name, d.infected.toLocaleString("fr-FR"), d.deaths.toLocaleString("fr-FR")])
    : [];

  return (
    <section aria-label="Données épidémies mondiales">
      <h2>COVID-19 — Top 15 pays par décès cumulés (source OMS)</h2>
      <Table
        headers={["#", "Pays", "Cas confirmés", "Décès"]}
        rows={topDeaths}
      />
      {topHiv.length > 0 && (
        <>
          <h3 style={{ marginTop: "1.5rem" }}>VIH/SIDA — Top 10 pays prévalence (source ONUSIDA)</h3>
          <Table
            headers={["#", "Pays", "Personnes infectées", "Décès cumulés"]}
            rows={topHiv}
          />
        </>
      )}
    </section>
  );
}

function MilitarySummary() {
  const data2024 = getMilitaryData(2024);
  const entries = Object.entries(data2024);

  const topBudget = [...entries]
    .sort((a, b) => b[1].budget - a[1].budget)
    .slice(0, 15)
    .map(([name, d], i) => [
      i + 1,
      name,
      `${d.budget} Mds€`,
      `${d.soldiers.toLocaleString("fr-FR")} k`,
      d.tanks.toLocaleString("fr-FR"),
      d.aircraft.toLocaleString("fr-FR"),
    ]);

  return (
    <section aria-label="Données militaires mondiales 2024">
      <h2>Top 15 budgets militaires mondiaux 2024 (source SIPRI)</h2>
      <Table
        headers={["#", "Pays", "Budget défense", "Soldats actifs", "Chars", "Avions"]}
        rows={topBudget}
      />
    </section>
  );
}

function PoliticsSummary() {
  const currentYear = 2025;
  const currentLeaders = POLITICS_COUNTRIES.map((country) => {
    const current = country.periods.find((p) => p.from <= currentYear && p.to >= currentYear);
    if (!current) return null;
    return [country.name, current.regime, current.orientation, current.leader, current.party ?? "—"];
  }).filter(Boolean) as (string | number)[][];

  return (
    <section aria-label="Régimes politiques mondiaux 2025">
      <h2>Régimes politiques et gouvernements en cours (2025)</h2>
      <Table
        headers={["Pays", "Régime", "Orientation", "Dirigeant", "Parti"]}
        rows={currentLeaders}
      />
    </section>
  );
}

function EmpiresSummary() {
  const rows = ROMAN_TIMELINE.map((entry) => [
    entry.year > 0 ? `${entry.year} ap. J.-C.` : `${Math.abs(entry.year)} av. J.-C.`,
    entry.label,
    entry.description ?? "—",
  ]);

  return (
    <section aria-label="Chronologie empire romain">
      <h2>Chronologie de l&apos;Empire romain — 500 av. J.-C. à 1453 ap. J.-C.</h2>
      <Table
        headers={["Année", "Période", "Description"]}
        rows={rows}
      />
    </section>
  );
}

export function ServerDataSummary({ theme }: Props) {
  return (
    <div
      className="max-w-7xl mx-auto px-6 py-8"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <h2
        className="text-sm font-bold mb-4 uppercase tracking-widest"
        style={{ color: "var(--ink-3)" }}
      >
        Données de référence
      </h2>
      {theme === "economy" && <EconomySummary />}
      {theme === "epidemics" && <EpidemicsSummary />}
      {theme === "military" && <MilitarySummary />}
      {theme === "politics" && <PoliticsSummary />}
      {theme === "empires" && <EmpiresSummary />}
    </div>
  );
}

"use client";

import { Rise, Rule, useInk } from "@/components/presentation/primitives";
import {
  ANNEX_COMPETITION,
  ANNEX_FINANCE,
  ANNEX_FINANCE_NOTE,
  ANNEX_FUNDING,
  ANNEX_LEGAL,
  ANNEX_LEGAL_NOTE,
  ANNEX_SENSITIVITY,
  ANNEX_SOURCES,
  TO_CONFIRM,
} from "@/data/soutenance2/soutenance2Data";
import { useAccent } from "./visuals";

/**
 * Annexes are not part of the fifteen. They live behind "A" and are there for
 * questions, so they are allowed to be dense in a way no slide is.
 */

const euro = (n: number) => `${n.toLocaleString("fr-FR")} €`;

function AnnexShell({
  index,
  title,
  note,
  children,
}: {
  index: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  const ink = useInk();
  const accent = useAccent();
  return (
    <div style={{ padding: "8px 4px 4px" }}>
      <Rise y={10}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <span className="t-index" style={{ color: accent, fontSize: 16 }}>
            Annexe {index}
          </span>
          <span
            style={{ fontSize: 34, fontWeight: 800, color: ink.primary, letterSpacing: "-0.03em" }}
          >
            {title}
          </span>
        </div>
      </Rise>
      <div style={{ margin: "20px 0 30px" }}>
        <Rule accentWidth={70} />
      </div>
      {children}
      {note && (
        <Rise delay={0.35} y={8}>
          <p className="t-small" style={{ color: ink.faint, marginTop: 26, maxWidth: 900 }}>
            {note}
          </p>
        </Rise>
      )}
    </div>
  );
}

function Table({
  head,
  rows,
  highlightLast,
}: {
  head: readonly string[];
  rows: readonly (readonly (string | number | null)[])[];
  highlightLast?: boolean;
}) {
  const ink = useInk();
  const accent = useAccent();
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 17 }}>
        <thead>
          <tr>
            {head.map((h, i) => (
              <th
                key={h}
                className="t-micro"
                style={{
                  textAlign: i === 0 ? "left" : "right",
                  padding: "0 18px 12px",
                  color: ink.muted,
                  borderBottom: `1px solid ${ink.rule}`,
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => {
                const missing = cell === null;
                const strong = highlightLast && ri === rows.length - 1;
                return (
                  <td
                    key={ci}
                    style={{
                      textAlign: ci === 0 ? "left" : "right",
                      padding: "14px 18px",
                      color: missing ? ink.faint : strong ? accent : ink.secondary,
                      fontWeight: ci === 0 || strong ? 700 : 500,
                      borderBottom: `1px solid ${ink.rule}`,
                      fontVariantNumeric: "tabular-nums",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {missing ? (
                      <span className="ted-data-slot" data-tone={ink.tone} style={{ fontSize: 13 }}>
                        {TO_CONFIRM}
                      </span>
                    ) : (
                      cell
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── 01 — finance ─────────────────────────────────────────────────────── */

function AnnexFinance() {
  return (
    <AnnexShell index="01" title="Finance détaillée" note={ANNEX_FINANCE_NOTE}>
      <Table
        head={["", "Revenu web", "Revenu social", "Revenu total", "Charges", "Résultat net"]}
        rows={ANNEX_FINANCE.map((r) => [
          r.year,
          r.web === null ? null : euro(r.web),
          r.social === null ? null : euro(r.social),
          euro(r.total),
          r.costs === null ? null : euro(r.costs),
          r.net === null ? null : euro(r.net),
        ])}
        highlightLast
      />
    </AnnexShell>
  );
}

/* ── 02 — sensitivity ─────────────────────────────────────────────────── */

function AnnexSensitivity() {
  return (
    <AnnexShell
      index="02"
      title="Sensibilité"
      note="Scénarios −30 % / central / +30 % appliqués aux revenus projetés. Projections du business plan."
    >
      <Table
        head={["", ...ANNEX_SENSITIVITY.scenarios]}
        rows={ANNEX_SENSITIVITY.rows.map((r) => [r.year, ...r.values.map(euro)])}
      />
    </AnnexShell>
  );
}

/* ── 03 — funding ─────────────────────────────────────────────────────── */

function AnnexFunding() {
  const ink = useInk();
  const accent = useAccent();
  return (
    <AnnexShell index="03" title="Financement" note={ANNEX_FUNDING.note}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 44 }}>
        <div>
          <div className="t-micro" style={{ color: ink.muted }}>
            {ANNEX_FUNDING.need.label}
          </div>
          <div
            style={{ fontSize: 62, fontWeight: 800, color: accent, letterSpacing: "-0.04em", marginTop: 8 }}
          >
            {ANNEX_FUNDING.need.value}
          </div>
        </div>
        <div>
          <div className="t-micro" style={{ color: ink.muted }}>
            {ANNEX_FUNDING.ticket.label}
          </div>
          <div
            style={{ fontSize: 62, fontWeight: 800, color: ink.primary, letterSpacing: "-0.04em", marginTop: 8 }}
          >
            {ANNEX_FUNDING.ticket.value}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <div className="t-micro" style={{ color: ink.muted, marginBottom: 10 }}>
          Instrument
        </div>
        <div className="t-body" style={{ color: ink.secondary }}>
          {ANNEX_FUNDING.instrument}
        </div>
      </div>

      <div style={{ marginTop: 34, display: "flex", gap: 44 }}>
        {[
          { label: "Valorisation", value: ANNEX_FUNDING.valuation },
          { label: "Dilution", value: ANNEX_FUNDING.dilution },
        ].map((r) => (
          <div key={r.label}>
            <div className="t-micro" style={{ color: ink.muted, marginBottom: 10 }}>
              {r.label}
            </div>
            <span className="ted-data-slot" data-tone={ink.tone}>
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </AnnexShell>
  );
}

/* ── 04 — source panel ────────────────────────────────────────────────── */

function AnnexSources() {
  const ink = useInk();
  const accent = useAccent();

  const column = (label: string, items: readonly string[]) => (
    <div>
      <div className="t-micro" style={{ color: accent, marginBottom: 14 }}>
        {label} · {items.length}
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 9 }}>
        {items.map((s, i) => (
          <li key={`${s}-${i}`}>
            {s === TO_CONFIRM ? (
              <span className="ted-data-slot" data-tone={ink.tone} style={{ fontSize: 13 }}>
                {TO_CONFIRM}
              </span>
            ) : (
              <span className="t-body" style={{ color: ink.secondary }}>
                {s}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <AnnexShell index="04" title="Panel de sources" note={ANNEX_SOURCES.note}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 70 }}>
        {column("Titres français", ANNEX_SOURCES.french)}
        {column("Titres internationaux", ANNEX_SOURCES.international)}
      </div>
      <div style={{ marginTop: 40, display: "flex", alignItems: "baseline", gap: 18 }}>
        <span style={{ fontSize: 44, fontWeight: 800, color: accent, letterSpacing: "-0.035em" }}>
          {ANNEX_SOURCES.cost.value}
        </span>
        <span className="t-body" style={{ color: ink.secondary }}>
          {ANNEX_SOURCES.cost.label}
        </span>
      </div>
    </AnnexShell>
  );
}

/* ── 05 — competition ─────────────────────────────────────────────────── */

function AnnexCompetition() {
  const ink = useInk();
  const accent = useAccent();
  return (
    <AnnexShell
      index="05"
      title="Concurrence détaillée"
      note="Lecture retenue dans le business plan. Chaque acteur conserve des forces propres."
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
          <thead>
            <tr>
              {["", "Modèle", "Sources", "Data", "Transparence"].map((h, i) => (
                <th
                  key={h}
                  className="t-micro"
                  style={{
                    textAlign: "left",
                    padding: "0 16px 12px",
                    color: ink.muted,
                    borderBottom: `1px solid ${ink.rule}`,
                    width: i === 0 ? 240 : undefined,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ANNEX_COMPETITION.map((r) => (
              <tr key={r.name}>
                {[r.name, r.model, r.sources, r.data, r.transparency].map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: "14px 16px",
                      color: r.us ? (ci === 0 ? accent : ink.primary) : ink.secondary,
                      fontWeight: ci === 0 ? 700 : 500,
                      borderBottom: `1px solid ${ink.rule}`,
                      lineHeight: 1.45,
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
    </AnnexShell>
  );
}

/* ── 06 — legal ───────────────────────────────────────────────────────── */

function AnnexLegal() {
  const ink = useInk();
  const accent = useAccent();
  return (
    <AnnexShell index="06" title="Juridique" note={ANNEX_LEGAL_NOTE}>
      <div style={{ display: "grid", gap: 26 }}>
        {ANNEX_LEGAL.map((item) => (
          <div key={item.id} style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 30 }}>
            <span className="t-micro" style={{ color: accent, letterSpacing: "0.13em" }}>
              {item.label}
            </span>
            <span className="t-body" style={{ color: ink.secondary, lineHeight: 1.6 }}>
              {item.body}
            </span>
          </div>
        ))}
      </div>
    </AnnexShell>
  );
}

export const ANNEX_VIEWS: Record<string, React.ComponentType> = {
  finance: AnnexFinance,
  sensibilite: AnnexSensitivity,
  financement: AnnexFunding,
  sources: AnnexSources,
  concurrence: AnnexCompetition,
  juridique: AnnexLegal,
};

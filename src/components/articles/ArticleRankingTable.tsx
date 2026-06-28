"use client";

import { motion } from "framer-motion";

interface ArticleRankingTableProps {
  title: string;
  subtitle?: string;
  unit?: string;
  rows: {
    rank?: number;
    label: string;
    flag?: string; // ISO 2-letter lowercase code for flagcdn.com
    value: number;
    formattedValue?: string;
    note?: string;
    color?: string; // optional bar color
  }[];
  maxValue?: number; // if not provided, use max of rows
}

export function ArticleRankingTable({
  title,
  subtitle,
  unit,
  rows,
  maxValue,
}: ArticleRankingTableProps) {
  const max = maxValue ?? Math.max(...rows.map((r) => r.value), 1);

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "16px",
        background: "var(--surface)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
        }}
      >
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--ink)", margin: 0 }}>
          {title}
        </p>
        {subtitle && (
          <p
            style={{
              fontSize: "0.72rem",
              color: "var(--ink-4)",
              margin: "3px 0 0",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--surface-2)" }}>
              <th
                style={{
                  padding: "8px 12px",
                  textAlign: "left",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--ink-4)",
                  whiteSpace: "nowrap",
                  width: "36px",
                }}
              >
                #
              </th>
              <th
                style={{
                  padding: "8px 12px",
                  textAlign: "left",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--ink-4)",
                  whiteSpace: "nowrap",
                }}
              >
                Pays
              </th>
              <th
                style={{
                  padding: "8px 12px",
                  textAlign: "left",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--ink-4)",
                  width: "40%",
                }}
              >
                &nbsp;
              </th>
              <th
                style={{
                  padding: "8px 12px",
                  textAlign: "right",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--ink-4)",
                  whiteSpace: "nowrap",
                }}
              >
                {unit ?? "Valeur"}
              </th>
              <th
                style={{
                  padding: "8px 12px",
                  textAlign: "right",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--ink-4)",
                  whiteSpace: "nowrap",
                }}
              >
                Note
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const pct = max > 0 ? (row.value / max) * 100 : 0;
              const barColor = row.color ?? "var(--accent)";
              const isEven = i % 2 === 0;

              return (
                <tr
                  key={`${row.label}-${i}`}
                  style={{
                    borderTop: "1px solid var(--border)",
                    background: isEven ? "var(--surface)" : "var(--surface-2)",
                  }}
                >
                  {/* Rank */}
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: "var(--surface-2)",
                        border: "1px solid var(--border)",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        color: "var(--ink-3)",
                      }}
                    >
                      {row.rank ?? i + 1}
                    </span>
                  </td>

                  {/* Flag + name */}
                  <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                      {row.flag && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://flagcdn.com/20x15/${row.flag}.png`}
                          alt=""
                          width={20}
                          height={15}
                          style={{ borderRadius: "2px", objectFit: "cover", flexShrink: 0 }}
                        />
                      )}
                      <span
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 500,
                          color: "var(--ink-2)",
                        }}
                      >
                        {row.label}
                      </span>
                    </div>
                  </td>

                  {/* Progress bar */}
                  <td style={{ padding: "10px 12px" }}>
                    <div
                      style={{
                        position: "relative",
                        height: "8px",
                        borderRadius: "9999px",
                        background: "var(--surface-2)",
                        overflow: "hidden",
                        border: "1px solid var(--border-light)",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, delay: i * 0.05, ease: "easeOut" }}
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          height: "100%",
                          borderRadius: "9999px",
                          background: barColor,
                          opacity: 0.85,
                        }}
                      />
                    </div>
                  </td>

                  {/* Value */}
                  <td style={{ padding: "10px 12px", textAlign: "right", whiteSpace: "nowrap" }}>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        fontVariantNumeric: "tabular-nums",
                        color: barColor === "var(--accent)" ? "#0D7A40" : barColor,
                      }}
                    >
                      {row.formattedValue ?? row.value.toLocaleString("fr-FR")}
                    </span>
                    {unit && (
                      <span
                        style={{
                          fontSize: "0.65rem",
                          color: "var(--ink-4)",
                          marginLeft: "3px",
                        }}
                      >
                        {unit}
                      </span>
                    )}
                  </td>

                  {/* Note */}
                  <td
                    style={{
                      padding: "10px 12px",
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.note && (
                      <span
                        style={{
                          fontSize: "0.6rem",
                          color: "var(--ink-4)",
                        }}
                      >
                        {row.note}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

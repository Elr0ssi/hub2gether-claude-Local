"use client";

import Link from "next/link";
import { DataMapPanel } from "./DataMapPanel";
import { AnimatedKpi } from "./AnimatedKpi";
import { CATEGORIES } from "./DataStoryScene";

/**
 * The first category's panel, laid out at a fixed design width so it can be
 * scaled as a whole.
 *
 * This is what sits inside the hero's pane while the pane grows: the section
 * that follows is already there, small, and it becomes readable as the pane
 * opens out — rather than the pane arriving empty and the content being faded
 * in afterwards. It is built from the same `DataMapPanel` and `AnimatedKpi`
 * the story scene uses, so the frame the reader is looking at when the hero
 * hands over is the frame the scene takes up.
 */

/** Design width. Everything below is measured against it; scale the wrapper. */
export const STORY_PREVIEW_WIDTH = 1240;

export function StoryPreview() {
  const c = CATEGORIES[0];

  return (
    <div
      aria-hidden="true"
      style={{
        width: STORY_PREVIEW_WIDTH,
        display: "flex",
        flexDirection: "column",
        gap: 26,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 44 }}>
        <div
          style={{
            position: "relative",
            borderRadius: 22,
            overflow: "hidden",
            background: "#fff",
            border: "1px solid rgba(10,20,15,0.06)",
            boxShadow: "0 16px 40px rgba(10,20,15,0.08)",
            aspectRatio: "16 / 11",
          }}
        >
          <DataMapPanel
            accent={c.accent}
            landFill={c.landFill}
            oceanFill="#FAFCFB"
            highlight={c.highlight}
            callout={c.callout}
            getCountryCallout={c.getCountryCallout}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ marginBottom: 16 }}>
            <span
              style={{
                display: "inline-block",
                padding: "9px 16px",
                background: "#fff",
                borderRadius: 12,
                border: "1px solid rgba(10,20,15,0.06)",
                boxShadow: "0 10px 26px rgba(10,20,15,0.06)",
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: c.accent,
              }}
            >
              {c.label}
            </span>
          </div>
          <h2
            style={{
              fontSize: "2.2rem",
              fontWeight: 900,
              color: "#0A0A0A",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: 14,
            }}
          >
            {c.title}
          </h2>
          <p style={{ fontSize: "0.92rem", color: "#5C5C5C", lineHeight: 1.65, marginBottom: 20, maxWidth: 420 }}>
            {c.description}
          </p>
          <Link
            href={c.href}
            tabIndex={-1}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.82rem",
              fontWeight: 700,
              color: c.accent,
              textDecoration: "none",
            }}
          >
            Explorer la carte {c.label.toLowerCase()} →
          </Link>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          border: "1px solid rgba(10,20,15,0.06)",
          boxShadow: "0 10px 26px rgba(10,20,15,0.06)",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        {c.kpis.map((kpi, i) => (
          <div
            key={`${c.id}-${i}`}
            style={{
              padding: "18px 20px",
              borderLeft: i === 0 ? "none" : "1px solid rgba(10,20,15,0.06)",
              minWidth: 0,
            }}
          >
            <p
              style={{
                fontSize: "1.6rem",
                fontWeight: 900,
                color: "#0A0A0A",
                letterSpacing: "-0.03em",
                whiteSpace: "nowrap",
                lineHeight: 1.1,
              }}
            >
              <AnimatedKpi target={kpi.target} decimals={kpi.decimals} prefix={kpi.prefix} suffix={kpi.suffix} />
            </p>
            <p
              style={{
                fontSize: "0.72rem",
                color: "#8A8A8A",
                marginTop: 5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {kpi.label}
            </p>
            {kpi.delta && (
              <p style={{ fontSize: "0.64rem", fontWeight: 600, color: c.accent, marginTop: 3 }}>
                {kpi.delta}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

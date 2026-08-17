"use client";

import {
  PART_THREE_OPENER,
  AUDIENCE_NOW,
  BENCHMARK,
  TRAJECTORY,
  REVENUE_CHANNELS,
  REVENUE_CHANNELS_HEADLINE,
  REVENUE_CHANNELS_NOTE,
  REVENUE_MODEL,
} from "@/data/presentation/presentationData";
import {
  Eyebrow,
  Rise,
  Rule,
  SlideBody,
  DataPlaceholder,
  useInk,
  DUR,
} from "../primitives";
import { FlowField } from "../visuals/FlowField";
import { BenchmarkBars, TrajectoryChart } from "../visuals/charts";

/* ═══════════════════════════════════════════════════════════════════════════
   PART III OPENER
   ═══════════════════════════════════════════════════════════════════════════ */

export function PartThreeOpenerSlide() {
  const ink = useInk();

  return (
    <>
      <FlowField act={4} seed={83} intensity={0.22} particles={3} />

      <SlideBody center>
        <Rise delay={0.2} y={12}>
          <div className="t-eyebrow accent">{PART_THREE_OPENER.part}</div>
        </Rise>

        <Rise delay={0.4} y={26} duration={DUR.slow}>
          <h2
            className="t-display"
            style={{ color: ink.primary, marginTop: 34, maxWidth: 1500 }}
          >
            {PART_THREE_OPENER.title}
          </h2>
        </Rise>

        <div style={{ marginTop: 52, maxWidth: 900 }}>
          <Rule delay={1} width={200} accentWidth={200} />
          <Rise delay={1.2} y={16} duration={DUR.slow}>
            <p className="t-lead" style={{ color: ink.muted, marginTop: 30 }}>
              {PART_THREE_OPENER.lead}
            </p>
          </Rise>
        </div>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   A — OÙ EN EST L'AUDIENCE
   ═══════════════════════════════════════════════════════════════════════════ */

export function AudienceNowSlide() {
  const ink = useInk();

  return (
    <>
      <FlowField act={3} seed={89} intensity={0.14} />

      <SlideBody padding="104px 120px">
        <Eyebrow index="§ 19">Audience</Eyebrow>

        <Rise delay={0.28} y={18} duration={DUR.slow}>
          <h2
            className="t-h1"
            style={{ color: ink.primary, marginTop: 26, fontSize: 64 }}
          >
            {AUDIENCE_NOW.headline}
          </h2>
        </Rise>

        {/* Two rows of three — measured, not claimed */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(2, auto)",
            gap: "60px 56px",
            alignContent: "center",
            marginTop: 48,
          }}
        >
          {AUDIENCE_NOW.kpis.map((kpi, i) => (
            <Rise key={kpi.id} delay={0.55 + i * 0.1} y={18}>
              <div
                style={{
                  borderTop: `1px solid ${ink.rule}`,
                  paddingTop: 28,
                }}
              >
                <DataPlaceholder
                  label={kpi.label}
                  value={kpi.value}
                  hint={kpi.hint}
                />
              </div>
            </Rise>
          ))}
        </div>

        <Rise delay={1.4} y={16} duration={DUR.slow}>
          <div style={{ marginTop: 30 }}>
            <Rule delay={1.3} width="100%" accentWidth={200} />
            <p
              className="t-lead"
              style={{ color: ink.secondary, marginTop: 26, maxWidth: 1300 }}
            >
              {AUDIENCE_NOW.note}
            </p>
          </div>
        </Rise>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   B — BENCHMARK CONCURRENTIEL
   ═══════════════════════════════════════════════════════════════════════════ */

export function BenchmarkSlide() {
  const ink = useInk();

  return (
    <>
      <SlideBody padding="88px 120px">
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 60,
          }}
        >
          <div>
            <Eyebrow index="§ 20">Benchmark</Eyebrow>
            <Rise delay={0.28} y={18} duration={DUR.slow}>
              <h2
                className="t-h1"
                style={{ color: ink.primary, marginTop: 26, fontSize: 62 }}
              >
                {BENCHMARK.headline}
              </h2>
            </Rise>
          </div>
          <Rise delay={0.5} y={12}>
            <p
              className="t-micro"
              style={{ color: ink.faint, textAlign: "right" }}
            >
              {BENCHMARK.source ?? "Source à citer"}
            </p>
          </Rise>
        </div>

        <div
          style={{
            flex: 1,
            display: "grid",
            placeItems: "center",
            marginTop: 20,
          }}
        >
          <BenchmarkBars
            rows={BENCHMARK.rows}
            unit={BENCHMARK.unit}
            startDelay={0.55}
          />
        </div>

        <Rise delay={1.6} y={16} duration={DUR.slow}>
          <div>
            <Rule delay={1.5} width="100%" accentWidth={200} />
            <p
              className="t-lead"
              style={{ color: ink.secondary, marginTop: 26, maxWidth: 1400 }}
            >
              {BENCHMARK.caption}
            </p>
          </div>
        </Rise>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   C — PRÉVISIONNEL D'AUDIENCE
   ═══════════════════════════════════════════════════════════════════════════ */

export function TrajectorySlide() {
  const ink = useInk();

  return (
    <>
      <SlideBody padding="80px 120px 64px">
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 60,
          }}
        >
          <div>
            <Eyebrow index="§ 21">Prévisionnel</Eyebrow>
            <Rise delay={0.28} y={18} duration={DUR.slow}>
              <h2
                className="t-h1"
                style={{ color: ink.primary, marginTop: 24, fontSize: 60 }}
              >
                {TRAJECTORY.headline}
              </h2>
            </Rise>
          </div>
          <Rise delay={0.5} y={12}>
            <p
              className="t-micro"
              style={{ color: ink.faint, textAlign: "right", maxWidth: 420 }}
            >
              {TRAJECTORY.note}
            </p>
          </Rise>
        </div>

        <div style={{ display: "grid", placeItems: "center", marginTop: 24 }}>
          <TrajectoryChart
            points={TRAJECTORY.points}
            unit={TRAJECTORY.unit}
            startDelay={0.55}
          />
        </div>

        {/* The levers behind the curve */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 56,
            marginTop: 16,
          }}
        >
          {TRAJECTORY.levers.map((lever, i) => (
            <Rise key={lever.index} delay={1.5 + i * 0.16} y={18}>
              <div
                style={{
                  borderTop: `1px solid ${ink.rule}`,
                  paddingTop: 24,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 14,
                    marginBottom: 12,
                  }}
                >
                  <span className="t-index accent">{lever.index}</span>
                  <span
                    className="t-h3"
                    style={{ color: ink.primary, fontSize: 26 }}
                  >
                    {lever.title}
                  </span>
                </div>
                <p className="t-body" style={{ color: ink.muted }}>
                  {lever.body}
                </p>
              </div>
            </Rise>
          ))}
        </div>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   D — LES TROIS CANAUX DE REVENUS
   ═══════════════════════════════════════════════════════════════════════════ */

export function RevenueChannelsSlide() {
  const ink = useInk();

  return (
    <>
      <FlowField act={3} seed={97} intensity={0.12} particles={3} />

      <SlideBody padding="96px 120px">
        <div style={{ textAlign: "center" }}>
          <Rise delay={0.15} y={10}>
            <div className="t-eyebrow accent">§ 22 — Monétisation</div>
          </Rise>
          <Rise delay={0.3} y={20} duration={DUR.slow}>
            <h2
              className="t-h1"
              style={{ color: ink.primary, marginTop: 24, fontSize: 62 }}
            >
              {REVENUE_CHANNELS_HEADLINE}
            </h2>
          </Rise>
        </div>

        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            marginTop: 66,
          }}
        >
          {REVENUE_CHANNELS.map((channel, i) => (
            <Rise key={channel.index} delay={0.6 + i * 0.22} y={22}>
              <div
                style={{
                  height: "100%",
                  padding: i === 0 ? "0 56px 0 0" : "0 56px",
                  borderLeft: i === 0 ? "none" : `1px solid ${ink.rule}`,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 16,
                    marginBottom: 10,
                  }}
                >
                  <span className="t-index accent">{channel.index}</span>
                  <h3
                    className="t-h2"
                    style={{
                      color: ink.primary,
                      textTransform: "uppercase",
                      fontSize: 44,
                    }}
                  >
                    {channel.name}
                  </h3>
                </div>

                <div
                  className="t-micro"
                  style={{ color: ink.faint, marginBottom: 30 }}
                >
                  {channel.role}
                </div>

                <ul
                  style={{
                    listStyle: "none",
                    display: "grid",
                    gap: 14,
                    flex: 1,
                  }}
                >
                  {channel.mechanics.map((m) => (
                    <li
                      key={m}
                      className="t-lead"
                      style={{
                        color: ink.secondary,
                        display: "flex",
                        alignItems: "baseline",
                        gap: 14,
                      }}
                    >
                      <span
                        style={{
                          width: 14,
                          height: 2,
                          background: "var(--accent)",
                          flexShrink: 0,
                          transform: "translateY(-9px)",
                        }}
                      />
                      {m}
                    </li>
                  ))}
                </ul>

                <div
                  style={{
                    borderTop: `1px solid ${ink.rule}`,
                    paddingTop: 20,
                    marginTop: 26,
                  }}
                >
                  <div className="t-micro" style={{ color: ink.faint }}>
                    Moteur
                  </div>
                  <div
                    className="t-body"
                    style={{
                      color: ink.primary,
                      fontWeight: 700,
                      marginTop: 7,
                    }}
                  >
                    {channel.driver}
                  </div>
                  <div
                    className="t-micro accent"
                    style={{ marginTop: 14 }}
                  >
                    {channel.status}
                  </div>
                </div>
              </div>
            </Rise>
          ))}
        </div>

        <Rise delay={1.5} y={16} duration={DUR.slow}>
          <p
            className="t-h3 t-editorial"
            style={{
              color: ink.primary,
              fontSize: 34,
              marginTop: 46,
              textAlign: "center",
            }}
          >
            {REVENUE_CHANNELS_NOTE}
          </p>
        </Rise>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   E — CE QUE CELA PEUT RAPPORTER
   ═══════════════════════════════════════════════════════════════════════════ */

export function RevenueModelSlide() {
  const ink = useInk();

  return (
    <>
      <SlideBody padding="96px 120px">
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 60,
          }}
        >
          <div>
            <Eyebrow index="§ 23">Modèle économique</Eyebrow>
            <Rise delay={0.28} y={18} duration={DUR.slow}>
              <h2
                className="t-h1"
                style={{ color: ink.primary, marginTop: 26, fontSize: 62 }}
              >
                {REVENUE_MODEL.headline}
              </h2>
            </Rise>
          </div>
          <Rise delay={0.5} y={12}>
            <div
              className="t-micro"
              style={{ color: ink.faint, textAlign: "right" }}
            >
              {REVENUE_MODEL.horizon}
            </div>
          </Rise>
        </div>

        {/* Formulas first, amounts second — the structure is the argument */}
        <div style={{ flex: 1, marginTop: 56 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "300px 1fr 300px 300px",
              gap: 40,
              paddingBottom: 18,
              borderBottom: `1px solid ${ink.rule}`,
            }}
          >
            {["Canal", "Moteur de revenu", "Hypothèse unitaire", "Revenu"].map(
              (h, i) => (
                <Rise key={h} delay={0.5 + i * 0.06} y={10}>
                  <div className="t-micro" style={{ color: ink.faint }}>
                    {h}
                  </div>
                </Rise>
              )
            )}
          </div>

          {REVENUE_MODEL.rows.map((row, i) => (
            <Rise key={row.channel} delay={0.7 + i * 0.18} y={16}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "300px 1fr 300px 300px",
                  gap: 40,
                  alignItems: "center",
                  padding: "34px 0",
                  borderBottom: `1px solid ${ink.rule}`,
                }}
              >
                <div
                  className="t-h3"
                  style={{ color: ink.primary, fontSize: 30 }}
                >
                  {row.channel}
                </div>
                <div className="t-lead" style={{ color: ink.secondary }}>
                  {row.driver}
                </div>
                <div>
                  {row.unit ? (
                    <span className="t-lead" style={{ color: ink.secondary }}>
                      {row.unit}
                    </span>
                  ) : (
                    <span className="ted-data-slot" data-tone={ink.tone}>
                      {"{DATA_TO_FILL}"}
                    </span>
                  )}
                </div>
                <div>
                  {row.revenue ? (
                    <span
                      className="t-h3"
                      style={{ color: ink.primary, fontSize: 30 }}
                    >
                      {row.revenue}
                    </span>
                  ) : (
                    <span className="ted-data-slot" data-tone={ink.tone}>
                      {"{DATA_TO_FILL}"}
                    </span>
                  )}
                </div>
              </div>
            </Rise>
          ))}

          {/* Total */}
          <Rise delay={1.4} y={16}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "300px 1fr 300px 300px",
                gap: 40,
                alignItems: "center",
                paddingTop: 30,
              }}
            >
              <div
                className="t-h3"
                style={{
                  color: ink.primary,
                  textTransform: "uppercase",
                  fontSize: 26,
                }}
              >
                Total
              </div>
              <div />
              <div />
              <div>
                {REVENUE_MODEL.total ? (
                  <span
                    className="t-h2"
                    style={{ color: "var(--accent)", fontSize: 44 }}
                  >
                    {REVENUE_MODEL.total}
                  </span>
                ) : (
                  <span className="ted-data-slot" data-tone={ink.tone}>
                    {"{DATA_TO_FILL}"}
                  </span>
                )}
              </div>
            </div>
          </Rise>
        </div>

        <Rise delay={1.7} y={16} duration={DUR.slow}>
          <p
            className="t-body"
            style={{ color: ink.muted, maxWidth: 1400, marginTop: 20 }}
          >
            {REVENUE_MODEL.note}
          </p>
        </Rise>
      </SlideBody>
    </>
  );
}

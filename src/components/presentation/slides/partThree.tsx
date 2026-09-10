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
  resolve,
  isDemo,
  DEMO_DATA,
} from "@/data/presentation/presentationData";
import {
  Eyebrow,
  Rise,
  Rule,
  SlideBody,
  useInk,
  DUR,
} from "../primitives";
import { FlowField } from "../visuals/FlowField";
import {
  BenchmarkBars,
  TrajectoryChart,
  RevenueMix,
  Sparkline,
  DemoBadge,
  formatEuro,
} from "../visuals/charts";

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
   One hero number carries the slide; the rest supports it. A grid of six
   equal figures made every number look equally unimportant.
   ═══════════════════════════════════════════════════════════════════════════ */

export function AudienceNowSlide() {
  const ink = useInk();

  const hero = resolve(AUDIENCE_NOW.hero.value, AUDIENCE_NOW.hero.demo);
  const series = resolve(
    AUDIENCE_NOW.heroSeries as number[] | null,
    AUDIENCE_NOW.heroSeriesDemo as unknown as number[]
  );
  const trend = resolve(AUDIENCE_NOW.heroTrend.value, AUDIENCE_NOW.heroTrend.demo);
  const showBadge = isDemo(AUDIENCE_NOW.hero.value);

  return (
    <>
      <FlowField act={3} seed={89} intensity={0.14} />

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
            <Eyebrow index="§ 19">Audience</Eyebrow>
            <Rise delay={0.28} y={18} duration={DUR.slow}>
              <h2
                className="t-h1"
                style={{ color: ink.primary, marginTop: 24, fontSize: 60 }}
              >
                {AUDIENCE_NOW.headline}
              </h2>
            </Rise>
          </div>
          {showBadge && <DemoBadge delay={0.5} />}
        </div>

        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "760px 1fr",
            gap: 90,
            alignItems: "center",
            marginTop: 30,
          }}
        >
          {/* Hero figure */}
          <div>
            <Rise delay={0.5} y={20} duration={DUR.slow}>
              <div>
                <div className="t-micro" style={{ color: ink.faint }}>
                  {AUDIENCE_NOW.hero.label}
                </div>
                {hero ? (
                  <div
                    style={{
                      fontSize: 148,
                      fontWeight: 900,
                      letterSpacing: "-0.05em",
                      lineHeight: 1,
                      color: ink.primary,
                      marginTop: 16,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {hero}
                  </div>
                ) : (
                  <div style={{ marginTop: 22 }}>
                    <span className="ted-data-slot" data-tone={ink.tone}>
                      {"{DATA_TO_FILL}"}
                    </span>
                  </div>
                )}
              </div>
            </Rise>

            {series && series.length > 1 && (
              <div style={{ marginTop: 26 }}>
                <Sparkline series={series} width={520} height={92} delay={0.9} />
                <Rise delay={1.6} y={8}>
                  <div
                    className="t-micro"
                    style={{ color: ink.faint, marginTop: 12 }}
                  >
                    {trend}
                  </div>
                </Rise>
              </div>
            )}
          </div>

          {/* Supporting figures */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "36px 56px" }}>
            {AUDIENCE_NOW.stats.map((stat, i) => {
              const v = resolve(stat.value, stat.demo);
              return (
                <Rise key={stat.id} delay={0.8 + i * 0.09} y={16}>
                  <div style={{ borderTop: `1px solid ${ink.rule}`, paddingTop: 22 }}>
                    {v ? (
                      <div
                        className="t-h2"
                        style={{
                          color: ink.primary,
                          fontSize: 46,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {v}
                      </div>
                    ) : (
                      <span className="ted-data-slot" data-tone={ink.tone}>
                        {"{DATA_TO_FILL}"}
                      </span>
                    )}
                    <div
                      className="t-micro"
                      style={{ color: ink.muted, marginTop: 12 }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </Rise>
              );
            })}
          </div>
        </div>

        <Rise delay={1.5} y={16} duration={DUR.slow}>
          <div>
            <Rule delay={1.4} width="100%" accentWidth={200} />
            <p
              className="t-lead"
              style={{ color: ink.secondary, marginTop: 24, maxWidth: 1400 }}
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

  const rows = BENCHMARK.rows.map((r) => ({
    name: r.name,
    value: resolve(r.monthlyVisits, r.demo),
    isUs: r.isUs,
  }));
  const source = resolve(BENCHMARK.source, BENCHMARK.sourceDemo);
  const showBadge = isDemo(BENCHMARK.rows[0].monthlyVisits);

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
            <Eyebrow index="§ 20">Benchmark</Eyebrow>
            <Rise delay={0.28} y={18} duration={DUR.slow}>
              <h2
                className="t-h1"
                style={{ color: ink.primary, marginTop: 24, fontSize: 60 }}
              >
                {BENCHMARK.headline}
              </h2>
            </Rise>
          </div>
          <div style={{ textAlign: "right" }}>
            {showBadge && <DemoBadge delay={0.5} />}
            <Rise delay={0.6} y={10}>
              <p
                className="t-micro"
                style={{ color: ink.faint, marginTop: showBadge ? 14 : 0 }}
              >
                {source ?? "Source à citer"}
              </p>
            </Rise>
          </div>
        </div>

        <div style={{ flex: 1, display: "grid", placeItems: "center" }}>
          <BenchmarkBars rows={rows} unit={BENCHMARK.unit} startDelay={0.55} />
        </div>

        <Rise delay={1.8} y={16} duration={DUR.slow}>
          <div>
            <Rule delay={1.7} width="100%" accentWidth={200} />
            <p
              className="t-h3 t-editorial"
              style={{ color: ink.primary, fontSize: 34, marginTop: 24, maxWidth: 1500 }}
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

  const points = TRAJECTORY.points.map((p) => ({
    label: p.label,
    value: resolve(p.value, p.demo),
    state: p.state,
  }));
  const showBadge = isDemo(TRAJECTORY.points[0].value);

  return (
    <>
      <SlideBody padding="72px 120px 56px">
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
                style={{ color: ink.primary, marginTop: 22, fontSize: 58 }}
              >
                {TRAJECTORY.headline}
              </h2>
            </Rise>
          </div>
          <div style={{ textAlign: "right", maxWidth: 460 }}>
            {showBadge && <DemoBadge delay={0.5} />}
            <Rise delay={0.6} y={10}>
              <p
                className="t-micro"
                style={{ color: ink.faint, marginTop: showBadge ? 14 : 0 }}
              >
                {TRAJECTORY.note}
              </p>
            </Rise>
          </div>
        </div>

        <div style={{ display: "grid", placeItems: "center", marginTop: 34 }}>
          <TrajectoryChart
            points={points}
            unit={TRAJECTORY.unit}
            startDelay={0.55}
            height={460}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 56,
            marginTop: 10,
          }}
        >
          {TRAJECTORY.levers.map((lever, i) => (
            <Rise key={lever.index} delay={1.6 + i * 0.16} y={18}>
              <div style={{ borderTop: `1px solid ${ink.rule}`, paddingTop: 22 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 14,
                    marginBottom: 10,
                  }}
                >
                  <span className="t-index accent">{lever.index}</span>
                  <span className="t-h3" style={{ color: ink.primary, fontSize: 26 }}>
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
            <div className="t-eyebrow accent">§ 22 · Monétisation</div>
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

                <div className="t-micro" style={{ color: ink.faint, marginBottom: 30 }}>
                  {channel.role}
                </div>

                <ul style={{ listStyle: "none", display: "grid", gap: 14, flex: 1 }}>
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
                    style={{ color: ink.primary, fontWeight: 700, marginTop: 7 }}
                  >
                    {channel.driver}
                  </div>
                  <div className="t-micro accent" style={{ marginTop: 14 }}>
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
   The mix bar carries the answer; the formulas underneath carry the defence.
   ═══════════════════════════════════════════════════════════════════════════ */

export function RevenueModelSlide() {
  const ink = useInk();

  const rows = REVENUE_MODEL.rows.map((r) => ({
    ...r,
    resolvedUnit: resolve(r.unit, r.unitDemo),
    resolvedRevenue: resolve(r.revenue, r.revenueDemo),
  }));
  const segments = rows.map((r) => ({
    label: r.channel,
    value: r.resolvedRevenue,
  }));
  const total = segments.reduce<number | null>(
    (acc, s) => (s.value === null ? acc : (acc ?? 0) + s.value),
    null
  );
  const showBadge = isDemo(REVENUE_MODEL.rows[0].revenue);

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
            <Eyebrow index="§ 23">Modèle économique</Eyebrow>
            <Rise delay={0.28} y={18} duration={DUR.slow}>
              <h2
                className="t-h1"
                style={{ color: ink.primary, marginTop: 24, fontSize: 60 }}
              >
                {REVENUE_MODEL.headline}
              </h2>
            </Rise>
          </div>

          {/* Total, given the weight of a conclusion */}
          <div style={{ textAlign: "right" }}>
            {showBadge && <DemoBadge delay={0.5} />}
            <Rise delay={0.55} y={14}>
              <div style={{ marginTop: showBadge ? 18 : 0 }}>
                <div className="t-micro" style={{ color: ink.faint }}>
                  {REVENUE_MODEL.horizon}
                </div>
                {total !== null ? (
                  <div
                    style={{
                      fontSize: 76,
                      fontWeight: 900,
                      letterSpacing: "-0.045em",
                      lineHeight: 1,
                      color: ink.primary,
                      marginTop: 10,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatEuro(total)}
                  </div>
                ) : (
                  <div style={{ marginTop: 14 }}>
                    <span className="ted-data-slot" data-tone={ink.tone}>
                      {"{DATA_TO_FILL}"}
                    </span>
                  </div>
                )}
              </div>
            </Rise>
          </div>
        </div>

        {/* Revenue mix */}
        <div style={{ marginTop: 54 }}>
          <RevenueMix segments={segments} startDelay={0.8} />
        </div>

        {/* The formulas behind each segment */}
        <div style={{ flex: 1, marginTop: 56 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "280px 1fr 340px",
              gap: 48,
              paddingBottom: 16,
              borderBottom: `1px solid ${ink.rule}`,
            }}
          >
            {["Canal", "Moteur de revenu", "Hypothèse unitaire"].map((h, i) => (
              <Rise key={h} delay={1.3 + i * 0.06} y={10}>
                <div className="t-micro" style={{ color: ink.faint }}>
                  {h}
                </div>
              </Rise>
            ))}
          </div>

          {rows.map((row, i) => (
            <Rise key={row.channel} delay={1.45 + i * 0.14} y={14}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "280px 1fr 340px",
                  gap: 48,
                  alignItems: "center",
                  padding: "26px 0",
                  borderBottom: `1px solid ${ink.rule}`,
                }}
              >
                <div className="t-h3" style={{ color: ink.primary, fontSize: 28 }}>
                  {row.channel}
                </div>
                <div className="t-lead" style={{ color: ink.secondary }}>
                  {row.driver}
                </div>
                <div>
                  {row.resolvedUnit ? (
                    <span
                      className="t-lead"
                      style={{ color: ink.primary, fontWeight: 700 }}
                    >
                      {row.resolvedUnit}
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
        </div>

        <Rise delay={2} y={14} duration={DUR.slow}>
          <p className="t-body" style={{ color: ink.muted, maxWidth: 1400 }}>
            {REVENUE_MODEL.note}
            {DEMO_DATA && showBadge
              ? " Les montants affichés sont des ordres de grandeur de démonstration."
              : ""}
          </p>
        </Rise>
      </SlideBody>
    </>
  );
}

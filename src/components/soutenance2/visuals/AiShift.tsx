"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { EASE, q, useDeckReducedMotion, useInk } from "@/components/presentation/primitives";
import { AI_SHIFT } from "@/data/soutenance2/soutenance2Data";
import { useAccent } from "./index";

/* ═══════════════════════════════════════════════════════════════════════════
   AI SHIFT — slide 08, six states

   One scene that transforms, not six slides that replace each other. The
   chain's pills are the same DOM nodes throughout: they travel, dim and
   re-link as the states advance, so the jury watches a diagram change its
   mind rather than watching diagrams succeed one another.

   The one element that survives every state is The Essential Data itself —
   it starts at the end of the chain, where a search engine used to deliver
   readers, and ends at its beginning, where an answer engine draws from it.
   That single journey is the argument of the slide.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Composition box. Everything below is expressed in these coordinates. */
const W = 1680;
const H = 620;

interface Pos {
  x: number;
  y: number;
  o: number;
  scale?: number;
}

const OFF: Pos = { x: W / 2, y: 286, o: 0 };

/**
 * Half the drawn width of each pill, in composition px. Connectors stop short
 * of these rather than of a single global padding, so a line meets "IA" and
 * "The Essential Data" at the same distance from each.
 */
const HALF: Record<string, number> = {
  user: 80,
  google: 62,
  ted: 120,
  info: 82,
  ai: 42,
  answer: 68,
  data: 52,
};
/** Air between a pill's edge and the line that leaves it. */
const GAP = 26;

/**
 * Where each pill sits in each of the six states. Reading a column top to
 * bottom is reading one state; reading a row left to right is watching one
 * node's journey.
 */
const SPINE: Record<string, readonly Pos[]> = {
  user: [
    { x: 250, y: 286, o: 1 },
    { x: 250, y: 286, o: 1 },
    { x: 1440, y: 158, o: 1 },
    { x: 1440, y: 158, o: 1 },
    OFF,
    OFF,
  ],
  google: [
    { x: 790, y: 286, o: 1 },
    { x: 790, y: 404, o: 0.16 },
    OFF,
    OFF,
    OFF,
    OFF,
  ],
  ai: [
    { x: 790, y: 286, o: 0 },
    { x: 790, y: 286, o: 1 },
    { x: 1080, y: 158, o: 1 },
    { x: 1080, y: 158, o: 1 },
    OFF,
    OFF,
  ],
  answer: [OFF, { x: 1330, y: 286, o: 1 }, OFF, OFF, OFF, OFF],
  data: [
    OFF,
    OFF,
    { x: 700, y: 158, o: 1 },
    { x: 700, y: 158, o: 0.32 },
    OFF,
    OFF,
  ],
  // L'information ne pend plus sous le média : elle est posée sur la courbe
  // de retour, à son sommet, là où le lecteur suit des yeux ce qui lui revient.
  // L'information est posée sous le sommet de la courbe de retour, à son
  // milieu : c'est ce que la courbe transporte, et la lire sous le trait dit
  // qu'elle voyage avec lui plutôt qu'elle ne l'interrompt.
  info: [{ x: 815, y: 512, o: 1 }, { x: 815, y: 512, o: 0 }, OFF, OFF, OFF, OFF],
  ted: [
    { x: 1330, y: 286, o: 1 },
    { x: 1330, y: 476, o: 0.34 },
    { x: 250, y: 158, o: 1 },
    { x: 250, y: 158, o: 1 },
    { x: 840, y: 66, o: 1 },
    { x: 840, y: 172, o: 1, scale: 1.2 },
  ],
};

const posOf = (key: string, step: number): Pos => SPINE[key]?.[step] ?? OFF;

/* ── Pieces ─────────────────────────────────────────────────────────────── */

/** A drawn connector: reveals along its own length rather than fading in. */
function Line({
  d,
  stroke,
  width = 1.3,
  dashed,
  delay = 0,
  duration = 0.9,
}: {
  d: string;
  stroke: string;
  width?: number;
  dashed?: boolean;
  delay?: number;
  duration?: number;
}) {
  const reduced = useDeckReducedMotion();
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={dashed ? "3 8" : undefined}
      initial={reduced ? { opacity: 1 } : { pathLength: 0, opacity: 1 }}
      animate={reduced ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : duration, delay, ease: EASE }}
    />
  );
}

/** A single travelling dot — one packet, sent along a path and back. */
function Packet({
  path,
  delay = 0,
  duration = 2.6,
  colour,
  r = 5,
}: {
  path: string;
  delay?: number;
  duration?: number;
  colour: string;
  r?: number;
}) {
  const reduced = useDeckReducedMotion();
  if (reduced) return null;
  return (
    <circle r={r} fill={colour} opacity={0}>
      <animateMotion
        dur={`${duration}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
        path={path}
        keyPoints="0;1"
        keyTimes="0;1"
      />
      <animate
        attributeName="opacity"
        dur={`${duration}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
        values="0;1;1;0"
        keyTimes="0;0.08;0.86;1"
      />
    </circle>
  );
}

/** The chain's node. One shape, four registers. */
function Pill({
  children,
  accent,
  strong,
  dashed,
  small,
  ink,
}: {
  children: ReactNode;
  accent?: string;
  strong?: boolean;
  dashed?: boolean;
  small?: boolean;
  ink: ReturnType<typeof useInk>;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        whiteSpace: "nowrap",
        padding: small ? "8px 16px" : "13px 26px",
        borderRadius: 100,
        border: `1px ${dashed ? "dashed" : "solid"} ${accent ?? ink.rule}`,
        background: accent
          ? ink.tone === "dark"
            ? "rgba(57,255,136,0.11)"
            : "rgba(13,122,64,0.08)"
          : ink.tone === "dark"
          ? "#0B0B0B"
          : "#fff",
        color: accent ?? (strong ? ink.primary : ink.secondary),
        fontSize: small ? 15 : 20,
        fontWeight: strong || accent ? 800 : 600,
        letterSpacing: small ? "0.04em" : "-0.01em",
      }}
    >
      {children}
    </span>
  );
}

/** A pill anchored to the composition box, animating between states. */
function Anchored({
  pos,
  children,
  style,
}: {
  pos: Pos;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const reduced = useDeckReducedMotion();
  return (
    <motion.div
      animate={{ x: pos.x, y: pos.y, opacity: pos.o, scale: pos.scale ?? 1 }}
      initial={false}
      transition={{ duration: reduced ? 0 : 0.85, ease: EASE }}
      style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", ...style }}
    >
      {/* The anchor is the pill's centre: `x`/`y` place it, this pulls the box
          back onto that point. Two nested transforms rather than one so the
          animated values stay clean numbers. */}
      <div style={{ transform: "translate(-50%, -50%)" }}>{children}</div>
    </motion.div>
  );
}

/** A layer that belongs to one state and cross-fades with its neighbours. */
function Layer({ children }: { children: ReactNode }) {
  const reduced = useDeckReducedMotion();
  return (
    <motion.div
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
      transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {children}
    </motion.div>
  );
}

/* ── Connectors ─────────────────────────────────────────────────────────── */

function Connectors({ step }: { step: number }) {
  const ink = useInk();
  const accent = useAccent();

  const p = (key: string) => posOf(key, step);

  // A run between two pills, stopping short of each by that pill's own width.
  const seg = (from: string, to: string) => {
    const a = p(from);
    const b = p(to);
    return `M ${q(a.x + HALF[from] + GAP)} ${a.y} L ${q(b.x - HALF[to] - GAP)} ${b.y}`;
  };

  if (step === 0) {
    const search = seg("user", "google");
    const fetchTed = seg("google", "ted");
    // Le retour part du média lui-même et remonte vers le lecteur en une seule
    // courbe. L'information est posée à son sommet : c'est ce que la courbe
    // transporte, et non un maillon de plus accroché sous le média.
    const ted = p("ted");
    const user = p("user");
    // Du dessous du média, au dessous du lecteur : la courbe part et arrive
    // au milieu de chaque pastille, pas sur un flanc.
    const back = `M ${q(ted.x)} ${q(ted.y + 34)} Q ${q(W / 2)} ${q(620)} ${q(user.x)} ${q(
      user.y + 34
    )}`;
    return (
      <>
        <Line d={search} stroke={ink.rule} />
        <Line d={fetchTed} stroke={ink.rule} delay={0.15} />
        <Line d={back} stroke={accent} width={1.6} delay={0.7} duration={1.2} />
        <Packet path={search} colour={accent} delay={0.2} duration={1.5} />
        <Packet path={fetchTed} colour={accent} delay={0.9} duration={1.5} />
        <Packet path={back} colour={accent} delay={1.9} duration={2.4} r={6} />
      </>
    );
  }

  if (step === 1) {
    const ask = seg("user", "ai");
    const reply = seg("ai", "answer");
    // What the chain used to reach, now a stub that arrives nowhere.
    const ted = p("ted");
    const severed = `M ${ted.x} ${q(ted.y - 40)} L ${ted.x} ${q(ted.y - 118)}`;
    return (
      <>
        <Line d={ask} stroke={ink.rule} />
        <Line d={reply} stroke={ink.rule} delay={0.12} />
        <Line d={severed} stroke={ink.rule} width={1} dashed delay={0.5} />
        <Packet path={ask} colour={accent} delay={0.2} duration={1.4} />
        <Packet path={reply} colour={accent} delay={0.85} duration={1.4} />
      </>
    );
  }

  if (step === 2 || step === 3) {
    const feed = seg("ted", "data");
    const ingest = seg("data", "ai");
    const serve = seg("ai", "user");
    // The base hangs under the node it feeds.
    const roots = `M ${p("data").x} ${q(p("data").y + 32)} L ${p("data").x} 252`;
    return (
      <>
        <Line d={feed} stroke={accent} width={1.5} />
        <Line d={ingest} stroke={accent} width={1.5} delay={0.12} />
        <Line d={serve} stroke={ink.rule} delay={0.24} />
        {step === 2 && (
          <>
            <Line d={roots} stroke={accent} width={1.2} delay={0.4} duration={0.5} />
            <Packet path={feed} colour={accent} delay={0.3} duration={1.5} />
            <Packet path={ingest} colour={accent} delay={0.9} duration={1.5} />
            <Packet path={serve} colour={accent} delay={1.5} duration={1.5} />
          </>
        )}
      </>
    );
  }

  return null;
}

/* ── State 03 — the structured base ─────────────────────────────────────── */

function DataCluster() {
  const ink = useInk();
  const accent = useAccent();
  const { dataset } = AI_SHIFT;

  return (
    <Layer>
      <div
        style={{ position: "absolute", left: 250, top: 252, width: 1190 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
          style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: 18 }}
        >
          <span className="t-micro" style={{ color: accent }}>
            {dataset.liveLabel}
          </span>
          <span style={{ flex: 1, height: 1, background: ink.rule }} />
        </motion.div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {dataset.live.map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 + i * 0.06, ease: EASE }}
            >
              <Pill ink={ink} accent={accent} small>
                {label}
              </Pill>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9, ease: EASE }}
          style={{ display: "flex", alignItems: "baseline", gap: 18, margin: "30px 0 18px" }}
        >
          <span className="t-micro" style={{ color: ink.faint }}>
            {dataset.plannedLabel}
          </span>
          <span style={{ flex: 1, height: 1, background: ink.rule }} />
        </motion.div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {dataset.planned.map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.95 + i * 0.08, ease: EASE }}
            >
              <Pill ink={ink} dashed small>
                {label}
              </Pill>
            </motion.div>
          ))}
        </div>
      </div>
    </Layer>
  );
}

/* ── State 04 — the citation and the return ─────────────────────────────── */

/** From the citation at the card's foot, up and left to the media itself. */
const RETURN_PATH = "M 894 596 C 830 470, 830 268, 520 188";

function AnswerCard() {
  const ink = useInk();
  const accent = useAccent();
  const reduced = useDeckReducedMotion();
  const { answer, gestureStatement } = AI_SHIFT;

  return (
    <Layer>
      {/* The answer the engine gives, in its three tiers. */}
      <div
        style={{
          position: "absolute",
          left: 900,
          top: 214,
          width: 620,
          border: `1px solid ${ink.rule}`,
          borderRadius: 20,
          background: ink.tone === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
          padding: "26px 30px 24px",
        }}
      >
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15, ease: EASE }}
        >
          <div className="t-micro" style={{ color: accent, marginBottom: 12 }}>
            {answer.engine}
          </div>
          <div className="t-h3" style={{ color: ink.primary, letterSpacing: "-0.025em" }}>
            {answer.question}
          </div>
          <p className="t-body" style={{ color: ink.muted, marginTop: 14, lineHeight: 1.55 }}>
            {answer.body}
          </p>
          <div style={{ height: 1, background: ink.rule, margin: "20px 0 16px" }} />
        </motion.div>

        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.95, ease: EASE }}
          className="t-small"
          style={{ color: accent, fontWeight: 700 }}
        >
          {answer.citation}
        </motion.div>
      </div>

      {/* The click coming back, and what it finds. */}
      {/* The click on the citation, coming back up to the media. Routed along
          the card's own edge so it never crosses the text it is answering. */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <Line d={RETURN_PATH} stroke={accent} width={1.6} delay={1.1} duration={1} />
        <Packet path={RETURN_PATH} colour={accent} delay={1.7} duration={2.2} r={6} />
      </svg>

      {/* Les quatre gestes qui occupaient cette moitié sortent : la slide dit
          ce que la citation ramène, pas ce que le site sait faire. Reste la
          phrase, seule, en regard de la réponse. */}
      <div style={{ position: "absolute", left: 130, top: 330, width: 580 }}>
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2, ease: EASE }}
        >
          {gestureStatement.map((line, i) => (
            <div
              key={line}
              className="t-h3"
              style={{ color: i === 1 ? accent : ink.muted, letterSpacing: "-0.025em" }}
            >
              {line}
            </div>
          ))}
        </motion.div>
      </div>
    </Layer>
  );
}

/* ── State 05 — the three flows ─────────────────────────────────────────── */

function FlowColumns() {
  const ink = useInk();
  const accent = useAccent();
  const reduced = useDeckReducedMotion();
  const { flows, flowsNote } = AI_SHIFT;

  return (
    <Layer>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {flows.map((f, i) => {
          const x = 280 + i * 560;
          const d = `M 840 108 Q ${q((840 + x) / 2)} 150 ${x} 196`;
          return (
            <g key={f.id}>
              <Line
                d={d}
                stroke={f.planned ? ink.rule : accent}
                width={f.planned ? 1 : 1.5}
                dashed={f.planned}
                delay={0.1 + i * 0.12}
                duration={0.8}
              />
              {!f.planned && (
                <Packet path={d} colour={accent} delay={0.6 + i * 0.3} duration={2.2} />
              )}
            </g>
          );
        })}
      </svg>

      {flows.map((f, i) => (
        <motion.div
          key={f.id}
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 + i * 0.16, ease: EASE }}
          // Left rather than a centring transform: `animate` owns the
          // element's transform, and a static one here would be overwritten.
          style={{ position: "absolute", left: 60 + i * 560, top: 206, width: 440 }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 6 }}>
            <span className="t-h3" style={{ color: ink.primary, letterSpacing: "-0.025em" }}>
              {f.title}
            </span>
          </div>
          <div
            className="t-micro"
            style={{ color: f.planned ? ink.faint : accent, marginBottom: 22 }}
          >
            {f.status}
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {f.steps.map((line, j) => (
              <motion.div
                key={line}
                initial={reduced ? { opacity: 1 } : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.75 + i * 0.16 + j * 0.12, ease: EASE }}
                style={{ display: "flex", alignItems: "baseline", gap: 14 }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 6,
                    marginTop: 2,
                    flexShrink: 0,
                    background: f.planned ? ink.faint : accent,
                  }}
                />
                <span className="t-body" style={{ color: ink.secondary }}>
                  {line}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5, ease: EASE }}
        className="t-small"
        style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", color: ink.faint }}
      >
        {flowsNote}
      </motion.div>
    </Layer>
  );
}

/* ── State 06 — the close ───────────────────────────────────────────────── */

function Close() {
  const ink = useInk();
  const accent = useAccent();
  const reduced = useDeckReducedMotion();
  const { close } = AI_SHIFT;

  return (
    <Layer>
      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 232,
          display: "flex",
          justifyContent: "center",
          gap: 44,
        }}
      >
        {close.facets.map((facet) => (
          <span key={facet} className="t-micro" style={{ color: ink.muted }}>
            {facet}
          </span>
        ))}
      </motion.div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 320, textAlign: "center" }}>
        {close.statement.map((line, i) => (
          <motion.div
            key={line}
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 + i * 0.35, ease: EASE }}
            className="t-h2"
            style={{ color: i === 1 ? accent : ink.muted, letterSpacing: "-0.032em" }}
          >
            {line}
          </motion.div>
        ))}

        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6, ease: EASE }}
          className="t-lead"
          style={{ color: ink.faint, marginTop: 26 }}
        >
          {close.coda}
        </motion.div>
      </div>
    </Layer>
  );
}

/* ── The scene ──────────────────────────────────────────────────────────── */

export function AiShiftScene({ step }: { step: number }) {
  const ink = useInk();
  const accent = useAccent();
  const reduced = useDeckReducedMotion();
  const { chain, engines, tension } = AI_SHIFT;

  return (
    <div style={{ position: "relative", width: W, height: H }}>
      {/* Connectors sit under the pills. */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <AnimatePresence mode="wait">
          <g key={step <= 1 ? `spine-${step}` : step <= 3 ? "spine-chain" : "spine-none"}>
            <Connectors step={step} />
          </g>
        </AnimatePresence>
      </svg>

      {/* The pills: the same seven nodes, from first state to last. */}
      <Anchored pos={posOf("user", step)}>
        <Pill ink={ink}>{chain.user}</Pill>
      </Anchored>
      <Anchored pos={posOf("google", step)}>
        <Pill ink={ink}>{chain.google}</Pill>
      </Anchored>
      <Anchored pos={posOf("ai", step)}>
        <div style={{ position: "relative" }}>
          <Pill ink={ink} strong>
            {chain.ai}
          </Pill>
          {/* Named, not badged — and taken out of the flow so the pill itself
              stays on the spine. */}
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 14px)",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 16,
              opacity: step === 1 ? 1 : step === 2 ? 0.35 : 0,
              transition: "opacity .5s",
            }}
          >
            {engines.map((e) => (
              <span key={e} className="t-micro" style={{ color: ink.faint }}>
                {e}
              </span>
            ))}
          </div>
        </div>
      </Anchored>
      <Anchored pos={posOf("answer", step)}>
        <Pill ink={ink}>{chain.answer}</Pill>
      </Anchored>
      <Anchored pos={posOf("data", step)}>
        <Pill ink={ink} accent={accent}>
          {chain.data}
        </Pill>
      </Anchored>
      <Anchored pos={posOf("info", step)}>
        <Pill ink={ink}>{chain.info}</Pill>
      </Anchored>
      <Anchored pos={posOf("ted", step)}>
        <Pill ink={ink} accent={accent} strong>
          {chain.ted}
        </Pill>
      </Anchored>

      {/* The tension line, and only in the state that carries it. */}
      <AnimatePresence>
        {step === 1 && (
          <motion.div
            key="tension"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 1.5, ease: EASE }}
            className="t-h3"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 548,
              textAlign: "center",
              color: ink.muted,
              letterSpacing: "-0.025em",
            }}
          >
            {tension}
          </motion.div>
        )}
      </AnimatePresence>

      {/* State-specific compositions. */}
      <AnimatePresence mode="wait">
        {step === 2 && <DataCluster key="cluster" />}
        {step === 3 && <AnswerCard key="answer" />}
        {step === 4 && <FlowColumns key="flows" />}
        {step === 5 && <Close key="close" />}
      </AnimatePresence>
    </div>
  );
}

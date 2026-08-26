"use client";

/* ═══════════════════════════════════════════════════════════════════════════
   SOUTENANCE 3 — VISUELS PROPRES À LA V3

   Ce fichier ne contient que ce que la V2 n'avait pas. Tout le reste — éventail
   de sources, convergence, matrice de couverture, courbe de revenus, frise
   d'état, plan de travail — est importé de `soutenance2/visuals` sans y toucher.

   Deux règles tenues partout ici :
     · la typographie est calibrée pour une projection, pas pour un écran à
       cinquante centimètres. Aucun texte porteur d'argument sous 18 px de
       scène ; les libellés secondaires ne descendent pas sous 16.
     · l'animation sert la démonstration. Une chose apparaît quand elle est
       dite, dans l'ordre où elle est dite, et rien ne bouge ensuite.
   ═══════════════════════════════════════════════════════════════════════════ */

import { motion } from "framer-motion";
import {
  EASE,
  Rise,
  useDeckReducedMotion,
  useInk,
} from "@/components/presentation/primitives";
import { DrawPath, useAccent } from "@/components/soutenance2/visuals";

/* ═══════════════════════════════════════════════════════════════════════════
   CHAÎNE D'OPÉRATIONS — slide 03

   Ce que le lecteur doit faire lui-même, en colonne, chaque geste tombant sous
   le précédent. La flèche entre deux gestes est tracée, pas dessinée d'un
   coup : c'est l'enchaînement qui est pénible, pas chaque geste pris seul.
   ═══════════════════════════════════════════════════════════════════════════ */

export function OperationChain({
  steps,
  startDelay = 0,
}: {
  steps: readonly string[];
  startDelay?: number;
}) {
  const ink = useInk();
  const accent = useAccent();

  return (
    <div style={{ display: "grid", gap: 0 }}>
      {steps.map((s, i) => (
        <div key={s}>
          <Rise delay={startDelay + i * 0.16} y={12}>
            <div
              style={{
                fontSize: 27,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: i === steps.length - 1 ? accent : ink.secondary,
              }}
            >
              {s}
            </div>
          </Rise>
          {i < steps.length - 1 && (
            <svg width="14" height="26" aria-hidden="true" style={{ display: "block", marginLeft: 5 }}>
              <DrawPath
                d="M 7 2 L 7 24"
                stroke={ink.rule}
                width={2}
                opacity={0.9}
                delay={startDelay + i * 0.16 + 0.1}
                duration={0.28}
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LES VERBES — slide 04

   Cinq mots, très grands, qui arrivent l'un après l'autre. C'est le seul
   contenu de la moitié droite de la slide : ce qui manque se nomme, il ne
   s'explique pas.
   ═══════════════════════════════════════════════════════════════════════════ */

export function VerbStack({
  verbs,
  startDelay = 0,
}: {
  verbs: readonly string[];
  startDelay?: number;
}) {
  const accent = useAccent();
  const ink = useInk();

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {verbs.map((v, i) => (
        <Rise key={v} delay={startDelay + i * 0.14} y={18}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: accent,
                flexShrink: 0,
                transform: "translateY(-6px)",
              }}
            />
            <span
              style={{
                fontSize: 52,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: ink.primary,
                lineHeight: 1.05,
              }}
            >
              {v}
            </span>
          </div>
        </Rise>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   L'INTERSECTION — slide 11

   Quatre disques qui se recouvrent au centre. Le message est géométrique : la
   place n'est pas « à côté » des quatre familles, elle est là où elles se
   croisent et où aucune ne va seule.

   Les disques sont posés sur un carré, pas en fleur : quatre cercles à 90°
   laissent une intersection centrale nette, là où cinq ou six donnent une
   bouillie. Le libellé de chaque disque est en dehors, jamais dessus.
   ═══════════════════════════════════════════════════════════════════════════ */

export function Intersection({
  axes,
  center,
  startDelay = 0,
  size = 560,
}: {
  axes: readonly string[];
  center: string;
  startDelay?: number;
  size?: number;
}) {
  const ink = useInk();
  const accent = useAccent();
  const reduced = useDeckReducedMotion();

  const R = 148;
  const OFF = 92;
  const C = size / 2;
  const discs = [
    { x: C - OFF, y: C - OFF, lx: C - OFF - R - 6, ly: C - OFF - R + 4, anchor: "end" as const },
    { x: C + OFF, y: C - OFF, lx: C + OFF + R + 6, ly: C - OFF - R + 4, anchor: "start" as const },
    { x: C - OFF, y: C + OFF, lx: C - OFF - R - 6, ly: C + OFF + R - 2, anchor: "end" as const },
    { x: C + OFF, y: C + OFF, lx: C + OFF + R + 6, ly: C + OFF + R - 2, anchor: "start" as const },
  ];

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      style={{ width: "100%", maxWidth: size, height: "auto", overflow: "visible" }}
      aria-hidden="true"
    >
      {discs.map((d, i) => (
        <motion.circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={R}
          fill={accent}
          stroke={accent}
          strokeWidth={1.5}
          initial={reduced ? { opacity: 0.1, scale: 1 } : { opacity: 0, scale: 0.86 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: reduced ? 0.001 : 0.6, delay: startDelay + i * 0.16, ease: EASE }}
          style={{ transformOrigin: `${d.x}px ${d.y}px` }}
        />
      ))}

      {discs.map((d, i) => (
        <motion.text
          key={`l-${i}`}
          x={d.lx}
          y={d.ly}
          textAnchor={d.anchor}
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0.001 : 0.45, delay: startDelay + 0.2 + i * 0.16, ease: EASE }}
          style={{ fontSize: 25, fontWeight: 800, letterSpacing: "-0.02em", fill: ink.primary }}
        >
          {axes[i]}
        </motion.text>
      ))}

      {/* Le centre : le seul endroit où les quatre se superposent. */}
      <motion.circle
        cx={C}
        cy={C}
        r={62}
        fill={accent}
        initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduced ? 0.001 : 0.55, delay: startDelay + 0.95, ease: EASE }}
        style={{ transformOrigin: `${C}px ${C}px` }}
      />
      <motion.text
        x={C}
        y={C + 6}
        textAnchor="middle"
        initial={reduced ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0.001 : 0.4, delay: startDelay + 1.2, ease: EASE }}
        style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.01em", fill: "#0B0B0B" }}
      >
        {center}
      </motion.text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LES DEUX CHAÎNES — slide 12

   Hier au-dessus, demain en dessous, les mêmes pastilles décalées d'un cran.
   Ce qui doit se voir, c'est le maillon qui disparaît : le média n'est plus au
   bout de la chaîne, il est devenu une source parmi celles que l'IA consulte.
   ═══════════════════════════════════════════════════════════════════════════ */

export function ShiftChain({
  label,
  chain,
  caption,
  startDelay = 0,
  highlightLast = false,
}: {
  label: string;
  chain: readonly string[];
  /** Une ligne sous la chaîne : ce qu'elle raconte, en une phrase. */
  caption?: string;
  startDelay?: number;
  highlightLast?: boolean;
}) {
  const ink = useInk();
  const accent = useAccent();

  return (
    <div>
      <Rise delay={startDelay} y={10}>
        <div
          className="t-micro"
          style={{ color: accent, letterSpacing: "0.16em", marginBottom: 18 }}
        >
          {label}
        </div>
      </Rise>
      <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "nowrap" }}>
        {chain.map((node, i) => {
          const last = i === chain.length - 1;
          const strong = highlightLast && last;
          return (
            <div key={node} style={{ display: "flex", alignItems: "center" }}>
              <Rise delay={startDelay + 0.15 + i * 0.18} y={0}>
                <span
                  style={{
                    display: "inline-block",
                    whiteSpace: "nowrap",
                    padding: "16px 30px",
                    borderRadius: 100,
                    border: `2px solid ${strong ? accent : ink.rule}`,
                    background: strong ? accent : "transparent",
                    color: strong ? "#0B0B0B" : ink.primary,
                    fontSize: 26,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {node}
                </span>
              </Rise>
              {!last && (
                <svg width="70" height="14" aria-hidden="true" style={{ display: "block" }}>
                  <DrawPath
                    d="M 4 7 L 58 7"
                    stroke={ink.rule}
                    width={2}
                    opacity={1}
                    delay={startDelay + 0.15 + i * 0.18 + 0.12}
                    duration={0.3}
                  />
                  <motion.path
                    d="M 56 3 L 64 7 L 56 11"
                    stroke={ink.rule}
                    strokeWidth={2}
                    fill="none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: startDelay + 0.15 + i * 0.18 + 0.36 }}
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {caption && (
        <Rise delay={startDelay + 0.15 + chain.length * 0.18} y={8}>
          <p style={{ marginTop: 16, fontSize: 22, color: ink.secondary, letterSpacing: "-0.014em" }}>
            {caption}
          </p>
        </Rise>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LE PARTAGE — slide 19

   Deux colonnes qui se répondent, et un verbe très grand au-dessus de chacune.
   Ce sont les deux verbes qu'il faut retenir, pas les douze tâches en dessous :
   ils sont donc plus gros que le reste de la slide.
   ═══════════════════════════════════════════════════════════════════════════ */

export function SplitPanel({
  label,
  role,
  items,
  startDelay = 0,
  strong = false,
}: {
  label: string;
  role: string;
  items: readonly string[];
  startDelay?: number;
  strong?: boolean;
}) {
  const ink = useInk();
  const accent = useAccent();

  return (
    <div
      style={{
        border: `1px solid ${strong ? accent : ink.rule}`,
        borderRadius: 4,
        padding: "38px 40px 42px",
        background: strong ? `color-mix(in srgb, ${accent} 7%, transparent)` : "transparent",
        height: "100%",
      }}
    >
      <Rise delay={startDelay} y={12}>
        <div style={{ fontSize: 25, fontWeight: 700, color: ink.muted, letterSpacing: "-0.015em" }}>
          {label}
        </div>
        <div
          style={{
            fontSize: 62,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: strong ? accent : ink.primary,
            lineHeight: 1.02,
            marginTop: 2,
          }}
        >
          {role}
        </div>
      </Rise>

      <div style={{ marginTop: 34, display: "grid", gap: 15 }}>
        {items.map((it, i) => (
          <Rise key={it} delay={startDelay + 0.28 + i * 0.09} y={10}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: strong ? accent : ink.muted,
                  flexShrink: 0,
                  transform: "translateY(-4px)",
                }}
              />
              <span style={{ fontSize: 25, fontWeight: 600, color: ink.secondary, letterSpacing: "-0.015em" }}>
                {it}
              </span>
            </div>
          </Rise>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA COURBE DE COÛT MARGINAL — slide 20

   Deux courbes, aucune graduation chiffrée : les coûts de production n'ont pas
   encore été relevés, et une échelle inventée pour faire joli serait exactement
   ce que le projet reproche aux autres. C'est la FORME qui porte le message —
   l'une reste plate, l'autre descend — et la forme, elle, est démontrable.
   ═══════════════════════════════════════════════════════════════════════════ */

export function MarginalCurve({
  classicLabel,
  classicDetail,
  pipelineLabel,
  pipelineDetail,
  xLabel,
  yLabel,
  axisNote,
  startDelay = 0,
  width = 1380,
  height = 470,
}: {
  classicLabel: string;
  classicDetail?: string;
  pipelineLabel: string;
  pipelineDetail?: string;
  xLabel: string;
  yLabel: string;
  axisNote: string;
  startDelay?: number;
  width?: number;
  height?: number;
}) {
  const ink = useInk();
  const accent = useAccent();

  const L = 30;
  const R = width - 400;
  const T = 40;
  const B = height - 84;

  // Classique : le coût par article ne baisse pas, chaque article est refait.
  const classic = `M ${L} ${T + 26} C ${L + 260} ${T + 22}, ${R - 260} ${T + 40}, ${R} ${T + 34}`;
  // Pipeline : la chaîne est écrite une fois, puis rejouée — la courbe s'aplatit bas.
  const pipeline = `M ${L} ${T + 58} C ${L + 220} ${B - 60}, ${R - 380} ${B - 18}, ${R} ${B - 22}`;

  return (
    <div style={{ width: "100%" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: "auto", overflow: "visible" }}
        aria-hidden="true"
      >
        {/* Un seul axe, celui du volume. L'ordonnée n'est pas graduée — les
            coûts n'ont pas été relevés — et un axe vertical sans graduation ne
            fait qu'encombrer. */}
        <line x1={L} y1={B} x2={R + 40} y2={B} stroke={ink.rule} strokeWidth={1.5} />

        <DrawPath d={classic} stroke={ink.muted} width={3.5} opacity={0.8} delay={startDelay} duration={1.1} />
        <DrawPath d={pipeline} stroke={accent} width={5} opacity={1} delay={startDelay + 0.55} duration={1.3} />

        {/* Les légendes au bout de leur propre courbe : une légende séparée
            oblige l'œil à faire l'appariement lui-même. */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: startDelay + 1.05 }}
        >
          <text x={R + 26} y={T + 32} style={{ fontSize: 30, fontWeight: 800, fill: ink.muted }}>
            {classicLabel}
          </text>
          {classicDetail && (
            <text x={R + 26} y={T + 62} style={{ fontSize: 20, fontWeight: 500, fill: ink.faint }}>
              {classicDetail}
            </text>
          )}
        </motion.g>

        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: startDelay + 1.7 }}
        >
          <text x={R + 26} y={B - 26} style={{ fontSize: 30, fontWeight: 800, fill: accent }}>
            {pipelineLabel}
          </text>
          {pipelineDetail && (
            <text x={R + 26} y={B + 4} style={{ fontSize: 20, fontWeight: 500, fill: ink.faint }}>
              {pipelineDetail}
            </text>
          )}
        </motion.g>

        <text x={L} y={T - 12} style={{ fontSize: 21, fontWeight: 700, fill: ink.secondary }}>
          {yLabel}
        </text>
        <text x={L} y={B + 36} style={{ fontSize: 21, fontWeight: 600, fill: ink.faint }}>
          {xLabel}
        </text>
        {/* La note est dans le SVG et non sous lui : posée dans le flux, elle
            venait se coucher sur la phrase de bas de slide dès que la courbe
            occupait toute la hauteur qu'on lui laissait. */}
        <text x={L} y={B + 60} style={{ fontSize: 17, fontStyle: "italic", fill: ink.faint }}>
          {axisNote}
        </text>
      </svg>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   EMPLACEMENT DE MESURE — slide 20 et slide 24

   Un chiffre qui n'a pas été mesuré ne s'écrit pas : il se réserve. Rendu
   comme un cadre pointillé, assez visible pour qu'un jury comprenne que
   l'absence est assumée et non oubliée.
   ═══════════════════════════════════════════════════════════════════════════ */

export function PendingValue({ label, unit }: { label: string; unit?: string }) {
  const ink = useInk();
  const accent = useAccent();

  return (
    <div>
      <div className="t-micro" style={{ color: ink.muted, letterSpacing: "0.14em", marginBottom: 10 }}>
        {label}
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          border: `2px dashed ${accent}`,
          borderRadius: 4,
          padding: "12px 22px",
          color: accent,
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
        }}
      >
        à mesurer
      </div>
      {unit && (
        <div style={{ fontSize: 17, color: ink.faint, marginTop: 8 }}>{unit}</div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA FRISE DES SÉRIES — slide 08

   Une règle graduée qui se remplit de gauche à droite, et « en direct » au
   bout. C'est la profondeur temporelle qui distingue une série d'un chiffre,
   et elle se montre mieux qu'elle ne se dit.
   ═══════════════════════════════════════════════════════════════════════════ */

export function SeriesTimeline({
  from,
  to,
  live,
  startDelay = 0,
}: {
  from: string;
  to: string;
  live: string;
  startDelay?: number;
}) {
  const ink = useInk();
  const accent = useAccent();
  const reduced = useDeckReducedMotion();

  const ticks = Array.from({ length: 14 }, (_, i) => i);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: 30, fontWeight: 800, color: ink.primary, letterSpacing: "-0.03em" }}>
          {from}
        </span>
        <span style={{ fontSize: 30, fontWeight: 800, color: ink.primary, letterSpacing: "-0.03em" }}>
          {to}
        </span>
      </div>

      <div style={{ position: "relative", height: 26 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 12,
            height: 2,
            background: ink.rule,
          }}
        />
        <motion.div
          initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: reduced ? 0.001 : 1.5, delay: startDelay, ease: EASE }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 11,
            height: 4,
            background: accent,
            transformOrigin: "left center",
          }}
        />
        {ticks.map((i) => (
          <motion.span
            key={i}
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: startDelay + (i / ticks.length) * 1.5 }}
            style={{
              position: "absolute",
              left: `${(i / (ticks.length - 1)) * 100}%`,
              top: 6,
              width: 2,
              height: 14,
              marginLeft: -1,
              background: ink.muted,
            }}
          />
        ))}
      </div>

      <Rise delay={startDelay + 1.55} y={8}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 22px",
              borderRadius: 100,
              background: accent,
              color: "#0B0B0B",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#0B0B0B" }} />
            {live}
          </span>
        </div>
      </Rise>
    </div>
  );
}

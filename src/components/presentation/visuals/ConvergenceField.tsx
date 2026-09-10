"use client";

import { motion } from "framer-motion";
import { useDeckReducedMotion, useInk, EASE } from "../primitives";

/**
 * SLIDE 02 — fragmentation → convergence.
 *
 * Source names sit scattered in the composition, unconnected. After a beat,
 * a thin line is traced from each one toward a single point and every node
 * drifts slightly along that axis: the same information, finally pulled into
 * one reading. No logos — text and abstract marks only.
 */

interface Node {
  label: string;
  x: number;
  y: number;
}

/** Focus point every source converges toward, in local SVG coordinates. */
const FOCUS = { x: 782, y: 396 };

const W = 900;
const H = 792;

/** Hand-placed so the scatter reads as genuinely disordered. */
const LAYOUT: Array<[string, number, number]> = [
  ["FMI", 66, 96],
  ["Banque mondiale", 292, 44],
  ["Eurostat", 32, 300],
  ["Presse", 214, 236],
  ["Études", 420, 178],
  ["Institutions", 96, 470],
  ["Bases statistiques", 300, 560],
  ["Rapports", 520, 392],
  ["Think tanks", 148, 676],
];

export function ConvergenceField({
  labels,
  startDelay = 0.5,
}: {
  labels: readonly string[];
  startDelay?: number;
}) {
  const reduced = useDeckReducedMotion();
  const ink = useInk();

  const nodes: Node[] = labels.map((label, i) => {
    const [, x, y] = LAYOUT[i % LAYOUT.length];
    return { label, x, y };
  });

  return (
    /* Le champ était posé à sa taille de dessin, 900 px, dans une colonne qui
       n'en fait pas toujours autant : la dernière pastille sortait de l'écran.
       Il tient maintenant dans ce qu'on lui donne, et garde ses proportions. */
    <div style={{ position: "relative", width: W, maxWidth: "100%", aspectRatio: `${W} / ${H}` }}>
      {/* Converging lines + focus point */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="100%"
        aria-hidden="true"
        style={{ position: "absolute", inset: 0 }}
      >
        {nodes.map((n, i) => (
          <motion.line
            key={`l-${i}`}
            x1={n.x + 8}
            y1={n.y + 8}
            x2={FOCUS.x}
            y2={FOCUS.y}
            stroke="var(--accent)"
            strokeWidth={1}
            initial={reduced ? { opacity: 0.3 } : { pathLength: 0, opacity: 0 }}
            animate={
              reduced ? { opacity: 0.3 } : { pathLength: 1, opacity: 0.34 }
            }
            transition={{
              duration: 1.15,
              delay: startDelay + 1.5 + i * 0.11,
              ease: EASE,
            }}
          />
        ))}

        {/* Focus node — the single reading the sources resolve into */}
        <motion.circle
          cx={FOCUS.x}
          cy={FOCUS.y}
          r={7}
          fill="var(--accent)"
          initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: startDelay + 1.3, ease: EASE }}
          style={{ transformOrigin: `${FOCUS.x}px ${FOCUS.y}px` }}
        />
        {!reduced && (
          <motion.circle
            cx={FOCUS.x}
            cy={FOCUS.y}
            r={7}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0, 0.55, 0], scale: [1, 3.4, 4.2] }}
            transition={{
              duration: 2.8,
              delay: startDelay + 1.9,
              repeat: Infinity,
              repeatDelay: 0.9,
              ease: "easeOut",
            }}
            style={{ transformOrigin: `${FOCUS.x}px ${FOCUS.y}px` }}
          />
        )}
      </svg>

      {/* Source labels */}
      {nodes.map((n, i) => {
        // Each node eases a short way along its axis toward the focus point.
        const dx = (FOCUS.x - n.x) * 0.11;
        const dy = (FOCUS.y - n.y) * 0.11;

        return (
          <motion.div
            key={n.label}
            initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
            animate={
              reduced
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, x: [0, 0, dx], y: [0, 0, dy] }
            }
            transition={{
              opacity: { duration: 0.55, delay: startDelay + i * 0.09, ease: EASE },
              scale: { duration: 0.55, delay: startDelay + i * 0.09, ease: EASE },
              x: { duration: 2.6, delay: startDelay + 1.6, ease: EASE },
              y: { duration: 2.6, delay: startDelay + 1.6, ease: EASE },
            }}
            style={{
              position: "absolute",
              // Une pastille de la moitié droite s'ancre par sa droite : posée
              // par la gauche, un intitulé long poussait son texte hors du
              // cadre, et la dernière source sortait de l'écran.
              ...(n.x > W * 0.5
                ? { right: `${(1 - n.x / W) * 100}%`, flexDirection: "row-reverse" as const }
                : { left: `${(n.x / W) * 100}%` }),
              top: `${(n.y / H) * 100}%`,
              display: "flex",
              alignItems: "center",
              gap: 9,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: ink.faint,
                flexShrink: 0,
              }}
            />
            <span
              className="t-small"
              style={{ color: ink.secondary, letterSpacing: "0.01em" }}
            >
              {n.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

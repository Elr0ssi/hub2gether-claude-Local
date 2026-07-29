"use client";

import type { LucideIcon } from "lucide-react";

export interface FloatingIcon {
  id: string;
  icon: LucideIcon;
  /** Horizontal position, % of the hero width. */
  x: number;
  /** Vertical position, % of the hero height. */
  y: number;
}

interface FloatingIconFieldProps {
  icons: FloatingIcon[];
  accent: string;
}

/**
 * The category's icon badges, scattered around the globe.
 *
 * Each badge drifts on a long, phase-shifted cycle — the outer element owns the
 * drift, the inner one the hover response, so the two transforms never fight.
 * Both are compositor-only (transform/opacity).
 */
export function FloatingIconField({ icons, accent }: FloatingIconFieldProps) {
  return (
    <div className="cat-icons" aria-hidden>
      {icons.map((item, i) => {
        const Icon = item.icon;
        return (
          <span
            key={item.id}
            className="cat-icon-float"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              // Detuned durations and offsets keep the field from pulsing in unison.
              animationDuration: `${8.5 + (i % 5) * 1.6}s`,
              animationDelay: `${-i * 1.35}s`,
            }}
          >
            <span className="cat-icon">
              <span
                className="cat-icon-halo"
                style={{ background: `radial-gradient(circle, ${accent}33 0%, ${accent}00 70%)` }}
              />
              <Icon size={20} color={accent} strokeWidth={2.2} style={{ position: "relative" }} />
            </span>
          </span>
        );
      })}

      <style>{`
        .cat-icons { position: absolute; inset: 0; }
        .cat-icon-float {
          position: absolute;
          transform: translate(-50%, -50%);
          animation-name: cat-icon-drift;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .cat-icon {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: clamp(42px, 3.6vw, 54px);
          height: clamp(42px, 3.6vw, 54px);
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 6px 18px rgba(16,24,20,0.10), 0 0 0 1px rgba(16,24,20,0.04);
          cursor: default;
          /* The layer above sets pointer-events: none so the globe stays
             draggable — badges opt back in for their hover state. */
          pointer-events: auto;
          transition: transform 420ms var(--ease-spring), box-shadow 420ms var(--ease-smooth);
        }
        .cat-icon-halo {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 380ms var(--ease-smooth);
        }
        .cat-icon:hover {
          transform: translateY(-4px) scale(1.06);
          box-shadow: 0 14px 30px rgba(16,24,20,0.14), 0 0 0 1px rgba(16,24,20,0.05);
        }
        .cat-icon:hover .cat-icon-halo { opacity: 1; }

        @keyframes cat-icon-drift {
          0%   { transform: translate(-50%, -50%); }
          50%  { transform: translate(calc(-50% + 3px), calc(-50% - 7px)); }
          100% { transform: translate(-50%, -50%); }
        }

        /* Below tablet the badges would crowd the title and the globe, so the
           field steps back and the scene stays legible. */
        @media (max-width: 760px) { .cat-icons { display: none; } }
        @media (prefers-reduced-motion: reduce) {
          .cat-icon-float { animation: none; }
          .cat-icon { transition: none; }
        }
      `}</style>
    </div>
  );
}

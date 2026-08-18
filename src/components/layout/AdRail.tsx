"use client";

/**
 * Vertical advertising slot living in the margin outside the site's content
 * column. Nothing is served into it yet, so it renders as a reserved, clearly
 * labelled frame: the space is held from the first paint, and the section will
 * not reflow the day a creative is dropped in.
 *
 * The rails only appear once the viewport is wide enough to hold them beside a
 * full-width content column — below that they are removed from the layout by
 * `.eco-ad-rail` rather than squeezed.
 */
export function AdRail({ side }: { side: "left" | "right" }) {
  return (
    <aside
      className="eco-ad-rail"
      aria-label={`Emplacement publicitaire ${side === "left" ? "gauche" : "droit"}`}
    >
      <div className="eco-ad-slot">
        <span className="eco-ad-slot-label">Emplacement publicitaire</span>
        <span className="eco-ad-slot-size">160 × 600</span>
      </div>
    </aside>
  );
}

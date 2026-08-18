"use client";

/**
 * Vertical advertising slot living in the margin outside the site's content
 * column. Nothing is sold into it yet, so it renders a house placeholder at
 * the exact 160×600 of the format it will carry: an abstract visual panel, a
 * line of copy and a button, all clearly labelled as an empty slot. The space
 * is held from the first paint, so the section will not reflow the day a
 * creative lands.
 *
 * The rails leave the layout below the width at which they would start eating
 * into the content column — see `.eco-ad-rail`.
 */
export function AdRail({ side }: { side: "left" | "right" }) {
  return (
    <aside
      className="eco-ad-rail"
      aria-label={`Emplacement publicitaire ${side === "left" ? "gauche" : "droit"}`}
    >
      <div className="eco-ad-slot">
        {/* Visual half — abstract shapes rather than a photograph, so nothing
            here can be mistaken for a real advertiser. */}
        <div
          style={{
            position: "relative",
            flex: "0 0 46%",
            overflow: "hidden",
            background: "linear-gradient(155deg, #0B2F1D 0%, #114A2C 55%, #0D7A40 100%)",
          }}
        >
          <svg
            viewBox="0 0 160 280"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <circle cx="118" cy="62" r="52" fill="#39FF88" fillOpacity="0.16" />
            <circle cx="118" cy="62" r="30" fill="#39FF88" fillOpacity="0.22" />
            <path
              d="M -10 210 C 40 168, 76 232, 122 186 S 178 150, 200 168"
              fill="none"
              stroke="#39FF88"
              strokeOpacity="0.55"
              strokeWidth="2"
            />
            <path
              d="M -10 236 C 44 200, 84 252, 128 214 S 180 186, 200 200"
              fill="none"
              stroke="#39FF88"
              strokeOpacity="0.25"
              strokeWidth="2"
            />
            <rect x="22" y="120" width="26" height="46" rx="4" fill="#39FF88" fillOpacity="0.3" />
            <rect x="56" y="102" width="26" height="64" rx="4" fill="#39FF88" fillOpacity="0.45" />
            <rect x="90" y="132" width="26" height="34" rx="4" fill="#39FF88" fillOpacity="0.22" />
          </svg>

          <span
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              padding: "2px 7px",
              borderRadius: 100,
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(57,255,136,0.35)",
              color: "#39FF88",
              fontSize: "0.52rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Publicité
          </span>
        </div>

        {/* Copy half — the shape of a creative, filled with placeholder rules
            rather than invented claims. */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 9,
            padding: "14px 14px 16px",
          }}
        >
          <span
            style={{
              fontSize: "0.62rem",
              fontWeight: 800,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: "#0D7A40",
              lineHeight: 1.35,
            }}
          >
            Emplacement
            <br />
            publicitaire
          </span>

          <span aria-hidden="true" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[100, 86, 64].map((w) => (
              <span
                key={w}
                style={{
                  height: 6,
                  width: `${w}%`,
                  borderRadius: 100,
                  background: "var(--surface-2)",
                }}
              />
            ))}
          </span>

          <span
            aria-hidden="true"
            style={{
              marginTop: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 26,
              borderRadius: 8,
              border: "1px dashed var(--border)",
              color: "var(--ink-4)",
              fontSize: "0.58rem",
              fontWeight: 600,
            }}
          >
            160 × 600
          </span>
        </div>
      </div>
    </aside>
  );
}

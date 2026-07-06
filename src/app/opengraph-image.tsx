import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "The Essential Data — Cartes géopolitiques interactives";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #111827 60%, #0d1a12 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(57,255,136,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,136,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Globe emoji */}
        <div style={{ fontSize: 72, marginBottom: 24, display: "flex" }}>🌍</div>

        {/* Brand */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            marginBottom: 12,
            display: "flex",
          }}
        >
          The Essential Data
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.6)",
            marginBottom: 32,
            display: "flex",
          }}
        >
          Cartes géopolitiques interactives · Data journalism
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 12 }}>
          {["PIB mondial", "Épidémies", "Empires historiques", "Militaire"].map((tag) => (
            <div
              key={tag}
              style={{
                background: "rgba(57,255,136,0.15)",
                border: "1px solid rgba(57,255,136,0.4)",
                color: "#39ff88",
                fontSize: 14,
                fontWeight: 600,
                padding: "6px 16px",
                borderRadius: 9999,
                display: "flex",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Visualize · Le monde en chiffres, sans le bruit";
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
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "0 96px",
          background: "linear-gradient(135deg, #0a0912 0%, #1b1240 60%, #3a1d8a 100%)",
          fontFamily: "system-ui, sans-serif",
          color: "#f5f3ff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, width: 76, height: 76, padding: 16, borderRadius: 22, background: "linear-gradient(140deg, #5b2de0, #a583ff)" }}>
            <div style={{ width: 11, height: 18, borderRadius: 4, background: "#fff" }} />
            <div style={{ width: 11, height: 28, borderRadius: 4, background: "#fff" }} />
            <div style={{ width: 11, height: 42, borderRadius: 4, background: "#fff" }} />
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -2 }}>Visualize</div>
        </div>
        <div style={{ marginTop: 48, fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1.02 }}>
          Le monde en chiffres, sans le bruit.
        </div>
        <div style={{ marginTop: 28, fontSize: 32, color: "#bdb8da" }}>
          PIB, dette, chômage, population : plus de 200 pays, sourcés.
        </div>
      </div>
    ),
    { ...size },
  );
}

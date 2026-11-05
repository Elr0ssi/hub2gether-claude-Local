import { ImageResponse } from "next/og";
import { paireParSlug } from "@/data/seo/pays";
import { fmtHabCourt, fmtMdCourt } from "@/data/seo/francais";

export const dynamic = "force-dynamic";
export const alt = "Comparaison de deux pays, sur Visualize";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ paire: string }> }) {
  const { paire } = await params;
  const p = paireParSlug(paire);
  const bloc = (f: NonNullable<typeof p>["a"], couleur: string) => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "30px 34px", borderRadius: 32, background: "rgba(255,255,255,0.09)", border: `3px solid ${couleur}` }}>
      <div style={{ fontSize: 66, fontWeight: 800, letterSpacing: -2, display: "flex" }}>{f.fr}</div>
      <div style={{ marginTop: 18, fontSize: 34, color: "#d9d4f5", display: "flex" }}>{f.population ? `${fmtHabCourt(f.population.v)} d'habitants` : ""}</div>
      <div style={{ marginTop: 6, fontSize: 34, color: "#d9d4f5", display: "flex" }}>{f.pib ? `PIB : ${fmtMdCourt(f.pib.v)}` : ""}</div>
    </div>
  );
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", background: "linear-gradient(135deg, #0a0912 0%, #1b1240 60%, #3a1d8a 100%)", color: "#f5f3ff", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: "#a583ff", display: "flex" }}>Visualize · Comparaison</div>
        <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 24 }}>
          {p ? bloc(p.a, "#8b5cff") : null}
          <div style={{ fontSize: 50, fontWeight: 800, color: "#a583ff", display: "flex" }}>vs</div>
          {p ? bloc(p.b, "#ff6fa5") : null}
        </div>
      </div>
    ),
    { ...size },
  );
}

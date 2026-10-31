import { ImageResponse } from "next/og";
import { paysParSlug } from "@/data/seo/pays";
import { fmtHabCourt, fmtMdCourt, nf } from "@/data/seo/francais";

/* La carte de partage d'un pays, dessinée à la demande : la construire pour
   chacune des pages alourdirait le déploiement pour rien. */
export const dynamic = "force-dynamic";
export const alt = "Un pays en chiffres, sur Visualize";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = paysParSlug(slug);
  const chiffres = f
    ? [
        f.population ? { v: fmtHabCourt(f.population.v), l: "habitants" } : null,
        f.pib ? { v: fmtMdCourt(f.pib.v), l: "PIB" } : null,
        f.pibHab ? { v: `${nf(f.pibHab.v)} $`, l: "par habitant" } : null,
      ].filter((x): x is { v: string; l: string } => x !== null)
    : [];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 90px", background: "linear-gradient(135deg, #0a0912 0%, #1b1240 60%, #3a1d8a 100%)", color: "#f5f3ff", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: "#a583ff", display: "flex" }}>Visualize · Pays en chiffres</div>
        <div style={{ marginTop: 22, fontSize: 120, fontWeight: 800, letterSpacing: -4, lineHeight: 1, display: "flex" }}>{f?.fr ?? "Pays"}</div>
        <div style={{ marginTop: 56, display: "flex", gap: 28 }}>
          {chiffres.map((c) => (
            <div key={c.l} style={{ display: "flex", flexDirection: "column", padding: "22px 30px", borderRadius: 28, background: "rgba(255,255,255,0.1)" }}>
              <div style={{ fontSize: 54, fontWeight: 800, display: "flex" }}>{c.v}</div>
              <div style={{ fontSize: 26, color: "#bdb8da", display: "flex" }}>{c.l}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}

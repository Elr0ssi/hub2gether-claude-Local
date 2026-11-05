import { ImageResponse } from "next/og";
import { detteDerniere, ratioDernier } from "@/articles/dette/france/donnees/detteFrancaise";
import { dossierParSlug } from "@/data/dettes/dossiers";

/* L'image partagée de la page « dette publique » d'un pays. Elle est composée ici plutôt que
   dessinée à la main : le jour où la dette change dans la base, la vignette change avec elle.
   La France porte les chiffres de son article (INSEE) ; les autres pays ceux de la base de dette. */
export const dynamic = "force-dynamic";

export const alt = "Dette publique : montant et part du PIB";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const nb = (v: number) =>
  v.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = dossierParSlug(slug);
  const france = slug === "france";
  const nom = france ? "FRANCE" : (d?.fr ?? "PAYS").toUpperCase();
  const montant = france ? `${nb(detteDerniere.valeur)} Md€` : d ? `${nb(d.d2024)} Md€` : "";
  const ratio = france ? ratioDernier.valeur : (d?.p2024 ?? 0);
  const source = france ? "INSEE · 1er trimestre 2026" : "Base de dette Visualize · 2024";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(140deg, #04070d 0%, #0a1526 55%, #04070d 100%)",
          color: "#f4f6f8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#9ccbff" }}>{nom}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 128, letterSpacing: -4, lineHeight: 1 }}>
            {montant}
          </div>
          <div style={{ display: "flex", fontSize: 40, marginTop: 14, color: "#b6c0ca" }}>
            de dette publique
          </div>
          <div style={{ display: "flex", fontSize: 52, marginTop: 30, color: "#5aa5ff" }}>
            {nb(ratio)} % du PIB
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", fontSize: 30, letterSpacing: 4 }}>Visualize</div>
          <div style={{ display: "flex", fontSize: 20, color: "#7d8894" }}>
            {source}
          </div>
        </div>
      </div>
    ),
    size,
  );
}

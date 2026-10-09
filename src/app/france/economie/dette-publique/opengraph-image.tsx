import { ImageResponse } from "next/og";
import { detteDerniere, ratioDernier } from "@/data/articles/detteFrancaise";

/* L'image partagée. Elle est composée ici plutôt que dessinée à la main : le
   jour où la dette change dans la base, la vignette change avec elle. */

export const alt = "Dette publique française : montant et part du PIB";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const nb = (v: number) =>
  v.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function Image() {
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
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#9ccbff" }}>FRANCE</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 128, letterSpacing: -4, lineHeight: 1 }}>
            {nb(detteDerniere.valeur)} Md€
          </div>
          <div style={{ display: "flex", fontSize: 40, marginTop: 14, color: "#b6c0ca" }}>
            de dette publique
          </div>
          <div style={{ display: "flex", fontSize: 52, marginTop: 30, color: "#5aa5ff" }}>
            {nb(ratioDernier.valeur)} % du PIB
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", fontSize: 30, letterSpacing: 4 }}>Visualize</div>
          <div style={{ display: "flex", fontSize: 20, color: "#7d8894" }}>
            INSEE · 1er trimestre 2026
          </div>
        </div>
      </div>
    ),
    size,
  );
}

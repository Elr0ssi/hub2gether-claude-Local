import { NextResponse } from "next/server";
import { ANNEES, CHAMPS, serie, type Champ } from "@/data/neo/series";

/**
 * Les séries demandées, et rien d'autre.
 *
 * Le tableau de bord ne charge que ce que le lecteur a sélectionné : quatre
 * pays sur un indicateur, c'est quatre tableaux de 66 nombres, pas la base
 * entière. Les trous de la source restent des `null`.
 */
export function GET(req: Request) {
  const url = new URL(req.url);
  const champ = (url.searchParams.get("champ") ?? "gdp") as Champ;
  if (!(champ in CHAMPS)) {
    return NextResponse.json({ erreur: "indicateur inconnu" }, { status: 400 });
  }

  const cles = (url.searchParams.get("pays") ?? "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);

  const series: Record<string, (number | null)[]> = {};
  for (const cle of cles) series[cle] = serie(cle, champ);

  return NextResponse.json(
    { annees: ANNEES, champ, series },
    { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } }
  );
}

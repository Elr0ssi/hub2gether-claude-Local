import { NextResponse } from "next/server";
import { ANNEES, CHAMPS, serie, type Champ } from "@/data/neo/series";

/**
 * Les quatre indicateurs des pays demandés, en une seule requête.
 *
 * Le tableau de bord croise plusieurs indicateurs à l'écran en même temps :
 * les renvoyer séparément le ferait attendre à chaque changement de widget.
 * Six pays × quatre séries × soixante-six ans, cela reste quelques milliers
 * de nombres — sans commune mesure avec les 283 Ko du socle, qui ne quitte
 * jamais le serveur.
 *
 * Les trous de la source restent des `null`.
 */
export function GET(req: Request) {
  const url = new URL(req.url);

  const cles = (url.searchParams.get("pays") ?? "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);

  const champs = Object.keys(CHAMPS) as Champ[];
  const series: Record<string, Record<Champ, (number | null)[]>> = {};

  for (const cle of cles) {
    const parChamp = {} as Record<Champ, (number | null)[]>;
    for (const c of champs) parChamp[c] = serie(cle, c);
    series[cle] = parChamp;
  }

  return NextResponse.json(
    { annees: ANNEES, series },
    { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } }
  );
}

import { readFileSync } from "node:fs";
import { join } from "node:path";

/* Le centre de chaque pays, tiré du fond de carte du site : la boîte
   englobante de sa plus grande terre. C'est assez précis pour y poser un
   repère sur un globe. Lecture côté serveur uniquement, une seule fois. */

type Anneau = number[][];
let cache: Record<string, { lat: number; lon: number }> | null = null;

export function centresPays(): Record<string, { lat: number; lon: number }> {
  if (cache) return cache;
  const sortie: Record<string, { lat: number; lon: number }> = {};
  try {
    const g = JSON.parse(readFileSync(join(process.cwd(), "public/geo/ne_110m_admin_0_countries.geojson"), "utf8")) as {
      features: { properties: { name?: string }; geometry: { type: string; coordinates: unknown } }[];
    };
    for (const f of g.features) {
      const nom = f.properties?.name;
      if (!nom) continue;
      const polys: Anneau[] =
        f.geometry.type === "Polygon"
          ? [(f.geometry.coordinates as Anneau[])[0]]
          : f.geometry.type === "MultiPolygon"
            ? (f.geometry.coordinates as Anneau[][]).map((p) => p[0])
            : [];
      let meilleur: { aire: number; lat: number; lon: number } | null = null;
      for (const a of polys) {
        if (!a?.length) continue;
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        for (const [x, y] of a) {
          x0 = Math.min(x0, x); x1 = Math.max(x1, x);
          y0 = Math.min(y0, y); y1 = Math.max(y1, y);
        }
        const aire = (x1 - x0) * (y1 - y0);
        if (!meilleur || aire > meilleur.aire) meilleur = { aire, lon: (x0 + x1) / 2, lat: (y0 + y1) / 2 };
      }
      if (meilleur) sortie[nom] = { lat: meilleur.lat, lon: meilleur.lon };
    }
  } catch {
    /* Sans fond de carte, le sélecteur de globe n'a simplement aucun pays. */
  }
  cache = sortie;
  return sortie;
}

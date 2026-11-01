import type { VueGlobe } from "./GlobeExplorer";

/* Les cadrages du globe calculés à partir des géométries : partagés par les pages Conflits et Ressources. */

/** La boîte d'un pays (sa plus grande masse), pour cadrer le globe sans rien inventer. */
export function boiteDe(geo: GeoJSON.FeatureCollection, nom: string) {
  const f = geo.features.find((x) => (x.properties as { name: string }).name === nom);
  if (!f) return null;
  const g = f.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
  const polys = (g.type === "MultiPolygon" ? g.coordinates : [g.coordinates]) as number[][][][];
  let best: number[] | null = null;
  let max = -1;
  for (const p of polys) {
    const xs = p[0].map((c) => c[0]);
    const ys = p[0].map((c) => c[1]);
    const b = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
    const a = (b[2] - b[0]) * (b[3] - b[1]);
    if (a > max) {
      max = a;
      best = b;
    }
  }
  return best;
}

/** Le cadrage qui contient plusieurs pays ; si l'ensemble est trop étendu (la Russie et l'Ukraine), on garde le premier. */
export function vueDePays(geo: GeoJSON.FeatureCollection, pays: string[]): VueGlobe | null {
  const boites = pays.map((p) => boiteDe(geo, p)).filter(Boolean) as number[][];
  if (!boites.length) return null;
  const un = (b: number[]): VueGlobe => ({ lon: (b[0] + b[2]) / 2, lat: (b[1] + b[3]) / 2, largeur: b[2] - b[0], hauteur: (b[3] - b[1]) * 1.2 });
  if (boites.length === 1) return un(boites[0]);
  const u = [Math.min(...boites.map((b) => b[0])), Math.min(...boites.map((b) => b[1])), Math.max(...boites.map((b) => b[2])), Math.max(...boites.map((b) => b[3]))];
  if (u[2] - u[0] > 45 || u[3] - u[1] > 40) return un(boites[0]);
  return un(u);
}


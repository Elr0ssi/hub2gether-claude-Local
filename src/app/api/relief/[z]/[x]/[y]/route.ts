/* ═══════════════════════════════════════════════════════════════════════════
   LES TUILES DE RELIEF DE L'ONGLET EXPLORER

   Quand on s'approche d'un pays, le globe charge le relief fin de la zone. Les tuiles
   viennent des « Terrain Tiles » publiques d'Amazon (données SRTM, GMTED et autres,
   format Terrarium : l'altitude est codée dans les trois couleurs du pixel).

   Le navigateur ne peut pas les lire directement — elles n'envoient pas d'en-tête CORS —
   donc le serveur les relaie. Une tuile ne change jamais : on la garde un an, et le CDN
   ne la redemande qu'une fois.
   ═══════════════════════════════════════════════════════════════════════════ */

const SOURCE = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium";

export async function GET(_req: Request, { params }: { params: Promise<{ z: string; x: string; y: string }> }) {
  const { z, x, y } = await params;
  const [Z, X, Y] = [z, x, y].map((v) => (/^\d{1,5}$/.test(v) ? Number(v) : NaN));
  if (![Z, X, Y].every(Number.isInteger) || Z < 0 || Z > 10 || X >= 2 ** Z || Y >= 2 ** Z) {
    return new Response("Tuile inconnue", { status: 400 });
  }
  try {
    const r = await fetch(`${SOURCE}/${Z}/${X}/${Y}.png`, { next: { revalidate: 31536000 } });
    if (!r.ok) return new Response("Tuile indisponible", { status: 404 });
    return new Response(await r.arrayBuffer(), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      },
    });
  } catch {
    return new Response("Source injoignable", { status: 502 });
  }
}

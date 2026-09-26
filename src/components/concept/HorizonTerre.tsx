"use client";

import { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   L'HORIZON

   La courbe d'une planète vue de nuit, posée au bas de la page. Les terres
   n'y sont pas des aplats mais des lumières : un semis de points tirés du
   même fond de carte que le globe interactif, plus dense là où le hasard le
   décide, jamais là où il n'y a pas de terre.

   Rien n'est cliquable, rien n'est une donnée — c'est une fin de page. Le
   semis vient de la géométrie réelle des continents, pas d'une image.
   ═══════════════════════════════════════════════════════════════════════════ */

const RAD = Math.PI / 180;
/** Assez de germes pour que les côtes se lisent, pas assez pour saturer. */
const GERMES = 62000;

export function HorizonTerre() {
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = cv.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let vivant = true;
    let brut = 0;
    /** lon, lat, éclat */
    let lumieres: [number, number, number][] = [];

    fetch("/geo/ne_110m_admin_0_countries.geojson")
      .then((r) => r.json())
      .then((g: { features: { geometry: { type: string; coordinates: unknown } }[] }) => {
        if (!vivant) return;
        /* On rastérise les terres une fois, en équirectangulaire : tester
           l'appartenance point par point contre 180 polygones coûterait
           mille fois plus cher pour le même résultat. */
        const MW = 720;
        const MH = 360;
        const m = document.createElement("canvas");
        m.width = MW;
        m.height = MH;
        const mc = m.getContext("2d", { willReadFrequently: true });
        if (!mc) return;
        mc.fillStyle = "#000";
        mc.fillRect(0, 0, MW, MH);
        mc.fillStyle = "#fff";
        for (const f of g.features) {
          if (!f.geometry) continue;
          const polys =
            f.geometry.type === "Polygon"
              ? [f.geometry.coordinates as number[][][]]
              : (f.geometry.coordinates as number[][][][]);
          for (const poly of polys) {
            mc.beginPath();
            for (const ring of poly) {
              ring.forEach(([lon, lat], i) => {
                const x = ((lon + 180) / 360) * MW;
                const y = ((90 - lat) / 180) * MH;
                if (i === 0) mc.moveTo(x, y);
                else mc.lineTo(x, y);
              });
              mc.closePath();
            }
            mc.fill("evenodd");
          }
        }
        const px = mc.getImageData(0, 0, MW, MH).data;

        /* Répartition de Fibonacci : une grille en lon/lat entasserait les
           points aux pôles et clairsèmerait l'équateur. */
        const or = Math.PI * (3 - Math.sqrt(5));
        const out: [number, number, number][] = [];
        for (let i = 0; i < GERMES; i++) {
          const lat = Math.asin(1 - (i / (GERMES - 1)) * 2) / RAD;
          const lon = (((i * or) / RAD) % 360) - 180;
          const x = Math.floor(((lon + 180) / 360) * MW);
          const y = Math.floor(((90 - lat) / 180) * MH);
          if (x < 0 || y < 0 || x >= MW || y >= MH) continue;
          if (px[(y * MW + x) * 4] < 128) continue;
          const h = Math.sin(lon * 12.9898 + lat * 78.233) * 43758.5453;
          const f = h - Math.floor(h);
          /* Deux tiers des germes s'éteignent : une densité uniforme donne
             un continent en feutrine, pas une terre habitée. */
          if (f < 0.46) continue;
          /* Élevé au carré : quelques foyers très vifs et beaucoup de points
             faibles. Une densité plate donne un champ d'étoiles, pas des
             villes. */
          const b0 = (f - 0.46) / 0.54;
          out.push([lon, lat, b0 * b0]);
        }
        lumieres = out;
      })
      .catch(() => {
        /* Pas de fond de carte : il reste la courbe et son halo. */
      });

    let L = 0;
    let H = 0;
    const redim = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      L = r.width;
      H = r.height;
      c.width = Math.round(L * dpr);
      c.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    redim();
    const ro = new ResizeObserver(redim);
    ro.observe(c);

    const doux = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();

    const boucle = (t: number) => {
      const s = (t - t0) / 1000;
      ctx.clearRect(0, 0, L, H);

      /* La sphère déborde très largement par le bas : on n'en voit que la
         courbe supérieure, comme depuis une orbite basse. */
      /* On montre un tiers de la sphère, pas une mince tranche : au-delà, le
         bord visible ne couvre plus que les pôles — et il n'y a pas de villes
         au pôle. */
      /* Le disque tient dans la largeur et sa calotte reste entière : trop
         gros, on ne voyait plus le haut de la courbe et beaucoup trop de
         corps en dessous. */
      const R = Math.max(L * 0.4, 340);
      const cx = L * 0.5;
      const cy = H + R * 0.45;

      /* Cadré sur l'Atlantique : une face tout en terres donnerait un semis
         uniforme, où l'on ne reconnaît plus rien. C'est le vide de l'océan
         qui fait apparaître les côtes. */
      const lon0 = doux ? -42 : -42 + s * 1.4;
      const lat0 = 6;
      const sl = Math.sin(lon0 * RAD);
      const cl = Math.cos(lon0 * RAD);
      const sp = Math.sin(lat0 * RAD);
      const cp = Math.cos(lat0 * RAD);

      /* Le halo d'atmosphère, au-dessus de la courbe. */
      const halo = ctx.createRadialGradient(cx, cy, R * 0.985, cx, cy, R * 1.1);
      halo.addColorStop(0, "rgba(120,180,255,0.30)");
      halo.addColorStop(0.45, "rgba(90,150,235,0.10)");
      halo.addColorStop(1, "rgba(70,130,220,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.1, 0, Math.PI * 2);
      ctx.fill();

      /* Le corps : une nuit, à peine plus claire que la page. */
      const corps = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.5, R * 0.04, cx, cy, R);
      corps.addColorStop(0, "#0a1426");
      corps.addColorStop(0.62, "#060c18");
      corps.addColorStop(1, "#03060e");
      ctx.fillStyle = corps;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      /* Les lumières. Un rectangle par point : à ce nombre, tracer un arc
         coûterait cinq fois plus pour un rond qu'on ne distingue pas. */
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();
      for (const [lon, lat, eclat] of lumieres) {
        const a = lon * RAD;
        const b = lat * RAD;
        const x = Math.cos(b) * Math.sin(a);
        const y = Math.sin(b);
        const z = Math.cos(b) * Math.cos(a);
        const x1 = x * cl - z * sl;
        const z1 = x * sl + z * cl;
        const y2 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        if (z2 <= 0.02) continue;
        const px2 = cx + x1 * R;
        const py2 = cy - y2 * R;
        if (py2 > H + 4 || py2 < -4) continue;
        /* Les lumières s'éteignent vers le limbe : l'incidence rasante, et
           un bord net ferait ressortir le découpage du masque. */
        const bord = Math.min(1, z2 / 0.32);
        const al = eclat * bord;
        if (al < 0.05) continue;
        /* Une minorité vire au blanc chaud : ce sont elles qui donnent
           l'impression de villes et non de poussière. */
        /* Le côté éclairé réchauffe les lumières et le côté nuit les
           refroidit : c'est ce dégradé, pas une ligne, qui fait lire un
           terminateur. */
        const chaud = Math.max(0, Math.min(1, (x1 + 0.55) / 1.3));
        ctx.fillStyle =
          eclat > 0.93
            ? `rgba(255,${Math.round(244 - chaud * 26)},${Math.round(226 - chaud * 60)},${Math.min(1, al * 1.35)})`
            : `rgba(255,${Math.round(196 - chaud * 30)},${Math.round(130 - chaud * 60)},${Math.min(1, al * 1.05)})`;
        const d = eclat > 0.93 ? 1.8 : 1.15;
        ctx.fillRect(px2, py2, d, d);
      }
      ctx.restore();

      /* Le liseré du limbe : chaud d'un côté, froid de l'autre — c'est lui
         qui fait lire une sphère plutôt qu'un disque. */
      ctx.save();
      ctx.lineWidth = 1.4;
      const liseré = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy - R * 0.2);
      liseré.addColorStop(0, "rgba(140,190,255,0.20)");
      liseré.addColorStop(0.42, "rgba(190,220,255,0.75)");
      liseré.addColorStop(0.72, "rgba(255,196,130,0.85)");
      liseré.addColorStop(1, "rgba(255,150,80,0.25)");
      ctx.strokeStyle = liseré;
      ctx.beginPath();
      ctx.arc(cx, cy, R, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      brut = requestAnimationFrame(boucle);
    };
    brut = requestAnimationFrame(boucle);

    return () => {
      vivant = false;
      cancelAnimationFrame(brut);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={cv} className="cg-terre" aria-hidden="true" />;
}

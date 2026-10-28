"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { COUCHE, type Repere, type Riviere } from "@/data/explorer/couches";

/* ═══════════════════════════════════════════════════════════════════════════
   LE GLOBE DE L'ONGLET EXPLORER

   Une sphère claire en relief (la carte d'altitude du site sert à la fois de relief
   et d'ombrage), peinte pays par pays, sur laquelle on pose :
     - des repères (points) — une seule géométrie, un seul appel de dessin ;
     - des tracés (rivières) ;
     - des cartes blanches qui suivent les repères choisis.

   Le globe ne connaît pas les couches : on lui passe des repères et des tracés déjà
   filtrés, et il dit ce qu'on survole ou ce qu'on clique.
   ═══════════════════════════════════════════════════════════════════════════ */

const DEG = Math.PI / 180;
const ELEV = 0.032;
const SURF = 1.05;
const LIGNE = 1.043;
const PATCH = 1.037;

function versXYZ(lat: number, lon: number, r: number, out = new THREE.Vector3()) {
  const la = lat * DEG;
  const lo = lon * DEG;
  return out.set(r * Math.cos(lo) * Math.cos(la), r * Math.sin(la), -r * Math.sin(lo) * Math.cos(la));
}

type Anneau = number[][];
interface PaysGeo { nom: string; polys: Anneau[][]; boites: [number, number, number, number][] }

function lirePays(geo: GeoJSON.FeatureCollection): PaysGeo[] {
  return geo.features.map((f) => {
    const g = f.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
    const polys = (g.type === "MultiPolygon" ? g.coordinates : [g.coordinates]) as Anneau[][];
    const boites = polys.map((p) => {
      const xs = p[0].map((c) => c[0]);
      const ys = p[0].map((c) => c[1]);
      return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] as [number, number, number, number];
    });
    return { nom: (f.properties as { name: string }).name, polys, boites };
  });
}

function dansAnneau(x: number, y: number, ring: Anneau) {
  let dedans = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 1e-12) + xi) dedans = !dedans;
  }
  return dedans;
}

export function paysEn(pays: PaysGeo[], lat: number, lon: number): string | null {
  for (const p of pays)
    for (let i = 0; i < p.polys.length; i++) {
      const b = p.boites[i];
      if (lon < b[0] || lon > b[2] || lat < b[1] || lat > b[3]) continue;
      const poly = p.polys[i];
      if (dansAnneau(lon, lat, poly[0]) && !poly.slice(1).some((t) => dansAnneau(lon, lat, t))) return p.nom;
    }
  return null;
}

/** Le centre et l'envergure d'un pays (en degrés), pour y amener la caméra. */
export function cadrage(geo: GeoJSON.FeatureCollection, nom: string): { lat: number; lon: number; envergure: number; largeur: number; hauteur: number } | null {
  const p = lirePays(geo).find((x) => x.nom === nom);
  if (!p) return null;
  let k = 0;
  let max = -1;
  p.boites.forEach((b, i) => {
    const a = (b[2] - b[0]) * (b[3] - b[1]);
    if (a > max) {
      max = a;
      k = i;
    }
  });
  const b = p.boites[k];
  return { lat: (b[1] + b[3]) / 2, lon: (b[0] + b[2]) / 2, envergure: Math.max(b[2] - b[0], (b[3] - b[1]) * 1.2), largeur: b[2] - b[0], hauteur: b[3] - b[1] };
}

/** La boîte d'un pays (sa plus grande île ou masse continentale), élargie d'une marge, en degrés. */
function boite(geo: GeoJSON.FeatureCollection, nom: string): { lat0: number; lat1: number; lon0: number; lon1: number } | null {
  const p = lirePays(geo).find((x) => x.nom === nom);
  if (!p) return null;
  let k = 0;
  let max = -1;
  p.boites.forEach((b, i) => {
    const a = (b[2] - b[0]) * (b[3] - b[1]);
    if (a > max) {
      max = a;
      k = i;
    }
  });
  const b = p.boites[k];
  const mx = Math.max(2, (b[2] - b[0]) * 0.32);
  const my = Math.max(2, (b[3] - b[1]) * 0.32);
  return { lon0: Math.max(-180, b[0] - mx), lon1: Math.min(180, b[2] + mx), lat0: Math.max(-84, b[1] - my), lat1: Math.min(84, b[3] + my) };
}

type Boite = { lat0: number; lat1: number; lon0: number; lon1: number };

/** Le relief fin d'une zone, peint en blanc ombré sur fond d'eau bleutée : chaque pixel vient d'une altitude réelle. */
async function peindreRelief(
  b: Boite,
  geo: GeoJSON.FeatureCollection,
  pays: string | null,
  nuit: boolean,
  tuile: (z: number, x: number, y: number) => Promise<ImageBitmap | null>,
): Promise<HTMLCanvasElement | null> {
  const lonSpan = b.lon1 - b.lon0;
  const latSpan = b.lat1 - b.lat0;
  const mercY = (lat: number, z: number) => ((1 - Math.asinh(Math.tan(lat * DEG)) / Math.PI) / 2) * 2 ** z * 256;
  const mercX = (lon: number, z: number) => ((lon + 180) / 360) * 2 ** z * 256;
  /* Le plus fin niveau qui tient dans une mosaïque raisonnable. */
  let z = 3;
  for (let t = 9; t >= 3; t--) {
    const nx = Math.floor(mercX(b.lon1, t) / 256) - Math.floor(mercX(b.lon0, t) / 256) + 1;
    const ny = Math.floor(mercY(b.lat0, t) / 256) - Math.floor(mercY(b.lat1, t) / 256) + 1;
    if (nx * ny <= 100 && mercX(b.lon1, t) - mercX(b.lon0, t) <= 3000) {
      z = t;
      break;
    }
  }
  const x0 = Math.floor(mercX(b.lon0, z) / 256);
  const x1 = Math.floor(mercX(b.lon1, z) / 256);
  const y0 = Math.floor(mercY(b.lat1, z) / 256);
  const y1 = Math.floor(mercY(b.lat0, z) / 256);
  const nx = x1 - x0 + 1;
  const ny = y1 - y0 + 1;
  const jobs: Promise<ImageBitmap | null>[] = [];
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) jobs.push(tuile(z, x, y));
  const images = await Promise.all(jobs);
  const mos = document.createElement("canvas");
  mos.width = nx * 256;
  mos.height = ny * 256;
  const mc = mos.getContext("2d", { willReadFrequently: true })!;
  images.forEach((im, i) => im && mc.drawImage(im, (i % nx) * 256, Math.floor(i / nx) * 256));
  const src = mc.getImageData(0, 0, mos.width, mos.height).data;
  const alt = (px: number, py: number) => {
    const x = Math.min(mos.width - 2, Math.max(0, px));
    const y = Math.min(mos.height - 2, Math.max(0, py));
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const h = (i: number) => src[i] * 256 + src[i + 1] + src[i + 2] / 256 - 32768;
    const i0 = (iy * mos.width + ix) * 4;
    const i1 = i0 + 4;
    const i2 = i0 + mos.width * 4;
    const i3 = i2 + 4;
    return (h(i0) * (1 - fx) + h(i1) * fx) * (1 - fy) + (h(i2) * (1 - fx) + h(i3) * fx) * fy;
  };

  const W = Math.min(2048, Math.max(768, Math.round(mercX(b.lon1, z) - mercX(b.lon0, z))));
  const H = Math.max(256, Math.min(2048, Math.round((W * latSpan) / lonSpan)));
  const hauteurs = new Float32Array(W * H);
  const ox = x0 * 256;
  const oy = y0 * 256;
  for (let j = 0; j < H; j++) {
    const lat = b.lat1 - (j / (H - 1)) * latSpan;
    const py = mercY(lat, z) - oy;
    for (let i = 0; i < W; i++) {
      const lon = b.lon0 + (i / (W - 1)) * lonSpan;
      hauteurs[j * W + i] = alt(mercX(lon, z) - ox, py);
    }
  }

  /* L'ombrage : la lumière vient du nord-ouest, le relief est exagéré pour qu'on le lise de loin. */
  const toile = document.createElement("canvas");
  toile.width = W;
  toile.height = H;
  const ctx = toile.getContext("2d")!;
  const img = ctx.createImageData(W, H);
  const pal = nuit
    ? { terre: [112, 122, 168], mer: [24, 31, 56], fond: [10, 14, 30] }
    : { terre: [252, 251, 255], mer: [206, 220, 242], fond: [188, 204, 232] };
  const mPx = (lonSpan / W) * 111320;
  const mPy = (latSpan / H) * 110540;
  const az = (315 * DEG);
  const al = 42 * DEG;
  const exag = 3.2;
  for (let j = 0; j < H; j++) {
    const lat = b.lat1 - (j / (H - 1)) * latSpan;
    const dx = mPx * Math.max(0.15, Math.cos(lat * DEG));
    for (let i = 0; i < W; i++) {
      const k = j * W + i;
      const h = hauteurs[k];
      const o = k * 4;
      let r: number, g: number, bl: number;
      if (h <= 0) {
        /* L'eau : un aplat bleuté, un peu plus profond au large. */
        const t = Math.min(1, -h / 3500);
        r = pal.mer[0] + (pal.fond[0] - pal.mer[0]) * t;
        g = pal.mer[1] + (pal.fond[1] - pal.mer[1]) * t;
        bl = pal.mer[2] + (pal.fond[2] - pal.mer[2]) * t;
      } else {
        const hx = hauteurs[j * W + Math.min(W - 1, i + 1)] - hauteurs[j * W + Math.max(0, i - 1)];
        const hy = hauteurs[Math.min(H - 1, j + 1) * W + i] - hauteurs[Math.max(0, j - 1) * W + i];
        const dzdx = (hx / (2 * dx)) * exag;
        const dzdy = (hy / (2 * mPy)) * exag;
        const pente = Math.atan(Math.hypot(dzdx, dzdy));
        const expo = Math.atan2(dzdy, -dzdx);
        const ombre = Math.cos(Math.PI / 2 - al) * Math.cos(pente) + Math.sin(Math.PI / 2 - al) * Math.sin(pente) * Math.cos(az - expo);
        /* Plat = presque blanc ; une pente tournée vers l'ombre s'assombrit franchement. */
        const c = Math.max(0.42, Math.min(1, 0.93 + (ombre - 0.67) * 1.05));
        /* Un peu plus gris vers les sommets, pour séparer les plaines des massifs. */
        const e = Math.min(1, h / 4200) * 0.1;
        const k2 = c * (1 - e);
        r = pal.terre[0] * k2;
        g = pal.terre[1] * k2;
        bl = pal.terre[2] * Math.min(1, k2 * 1.02);
      }
      img.data[o] = r;
      img.data[o + 1] = g;
      img.data[o + 2] = bl;
      img.data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  /* Les frontières, tracées en vecteur à la résolution de la zone, et le pays choisi. */
  const px = (lon: number) => ((lon - b.lon0) / lonSpan) * W;
  const py = (lat: number) => ((b.lat1 - lat) / latSpan) * H;
  const trace = (f: GeoJSON.Feature) => {
    const g = f.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
    const polys = (g.type === "MultiPolygon" ? g.coordinates : [g.coordinates]) as Anneau[][];
    ctx.beginPath();
    for (const p of polys)
      for (const ring of p) {
        ring.forEach(([lon, lat], i) => (i === 0 ? ctx.moveTo(px(lon), py(lat)) : ctx.lineTo(px(lon), py(lat))));
        ctx.closePath();
      }
  };
  ctx.lineJoin = "round";
  ctx.strokeStyle = nuit ? "rgba(190,200,255,0.4)" : "rgba(76,64,160,0.42)";
  ctx.lineWidth = Math.max(1.2, W / 1100);
  for (const f of geo.features) {
    trace(f);
    ctx.stroke();
  }
  if (pays) {
    const f = geo.features.find((x) => (x.properties as { name: string }).name === pays);
    if (f) {
      trace(f);
      ctx.fillStyle = nuit ? "rgba(140,110,255,0.22)" : "rgba(104,72,240,0.1)";
      ctx.fill("evenodd");
      ctx.strokeStyle = nuit ? "#b9a6ff" : "#5b3df0";
      ctx.lineWidth = Math.max(2.4, W / 560);
      ctx.stroke();
    }
  }

  /* Les bords se fondent dans le globe : l'opacité décroît sur les derniers pourcents. */
  const masque = document.createElement("canvas");
  masque.width = W;
  masque.height = H;
  const mk = masque.getContext("2d")!;
  const mi = mk.createImageData(W, H);
  const f = Math.max(8, Math.min(W, H) * 0.12);
  for (let j = 0; j < H; j++)
    for (let i = 0; i < W; i++) {
      const d = Math.min(i, W - 1 - i, j, H - 1 - j);
      const t = Math.min(1, d / f);
      mi.data[(j * W + i) * 4 + 3] = 255 * (t * t * (3 - 2 * t));
    }
  mk.putImageData(mi, 0, 0);
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(masque, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  return toile;
}

function peindre(geo: GeoJSON.FeatureCollection, nuit: boolean, pays: string | null, toile: HTMLCanvasElement) {
  const W = toile.width;
  const H = toile.height;
  const ctx = toile.getContext("2d")!;
  const c = nuit
    ? { mer: "#141a30", terre: "#2b3454", bord: "rgba(170,185,255,0.16)" }
    : { mer: "#dbe4f3", terre: "#fcfcff", bord: "rgba(120,110,175,0.2)" };
  ctx.fillStyle = c.mer;
  ctx.fillRect(0, 0, W, H);
  const trace = (f: GeoJSON.Feature) => {
    const g = f.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
    const polys = (g.type === "MultiPolygon" ? g.coordinates : [g.coordinates]) as Anneau[][];
    ctx.beginPath();
    for (const p of polys)
      for (const ring of p) {
        ring.forEach(([lon, lat], i) => {
          const x = ((lon + 180) / 360) * W;
          const y = ((90 - lat) / 180) * H;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
      }
  };
  ctx.fillStyle = c.terre;
  ctx.strokeStyle = c.bord;
  ctx.lineWidth = 1.1;
  ctx.lineJoin = "round";
  for (const f of geo.features) {
    trace(f);
    ctx.fill("evenodd");
    ctx.stroke();
  }
  if (pays) {
    for (const f of geo.features) {
      if ((f.properties as { name: string }).name !== pays) continue;
      trace(f);
      ctx.fillStyle = nuit ? "rgba(140,110,255,0.34)" : "rgba(104,72,240,0.16)";
      ctx.fill("evenodd");
      ctx.strokeStyle = nuit ? "#b9a6ff" : "#5b3df0";
      ctx.lineWidth = 2.8;
      ctx.stroke();
    }
  }
}

export interface GlobeExplorerHandle {
  zoomer: (facteur: number) => void;
  recentrer: () => void;
}

interface Props {
  geo: GeoJSON.FeatureCollection;
  nuit: boolean;
  /** Les repères à dessiner (déjà filtrés par couche et par pays). */
  reperes: Repere[];
  /** Les tracés (rivières) à dessiner, et ceux qu'on met en avant. */
  rivieres: Riviere[];
  rivieresVives: Set<Riviere>;
  pays: string | null;
  /** Le repère survolé ou choisi, et ceux qui portent une carte permanente. */
  survol: string | null;
  choisi: string | null;
  cartes: string[];
  /** Vue du monde : de tout petits points rouges, rien d'autre. Dans un pays : les repères complets. */
  monde: boolean;
  /** Des liens courbes entre deux repères (identifiants). */
  arcs: [string, string][];
  onSurvol: (id: string | null) => void;
  onChoix: (id: string) => void;
  onPays: (nom: string | null) => void;
}

export const GlobeExplorer = forwardRef<GlobeExplorerHandle, Props>(function GlobeExplorer(props, ref) {
  const { geo, nuit, reperes, rivieres, rivieresVives, pays, survol, choisi, cartes, monde, arcs } = props;
  const hote = useRef<HTMLDivElement>(null);
  const cartesEls = useRef<Map<string, HTMLDivElement>>(new Map());
  /* Tout ce que la boucle de dessin lit, sans qu'un changement de props la relance. */
  const etat = useRef({ reperes, survol, choisi, cartes, props });
  etat.current = { reperes, survol, choisi, cartes, props };
  const scene = useRef<{
    maj: () => void;
    peindre: () => void;
    cadrer: () => void;
    zoomer: (f: number) => void;
    recentrer: () => void;
    majReperes: () => void;
    majLignes: () => void;
    majArcs: () => void;
  } | null>(null);
  const geoPays = useRef<PaysGeo[]>([]);

  useImperativeHandle(ref, () => ({
    zoomer: (f) => scene.current?.zoomer(f),
    recentrer: () => scene.current?.recentrer(),
  }));

  /* ── La scène : montée une fois ─────────────────────────────────────────── */
  useEffect(() => {
    const el = hote.current;
    if (!el) return;
    geoPays.current = lirePays(geo);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:grab";
    el.prepend(renderer.domElement);
    const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    const sc = new THREE.Scene();

    const toile = document.createElement("canvas");
    toile.width = 4096;
    toile.height = 2048;
    peindre(geo, nuit, pays, toile);
    const texture = new THREE.CanvasTexture(toile);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    /* Le relief : la carte d'altitude du site, agrandie et adoucie pour effacer l'escalier des 256 niveaux de gris. */
    const reliefToile = document.createElement("canvas");
    reliefToile.width = 4096;
    reliefToile.height = 2048;
    const relief = new THREE.CanvasTexture(reliefToile);
    relief.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const img = new Image();
    img.onload = () => {
      const rc = reliefToile.getContext("2d")!;
      rc.imageSmoothingQuality = "high";
      rc.filter = "blur(1.6px)";
      rc.drawImage(img, 0, 0, reliefToile.width, reliefToile.height);
      relief.needsUpdate = true;
    };
    img.src = "/geo/earth-topology.png";
    const matiere = new THREE.MeshStandardMaterial({
      map: texture, bumpMap: relief, bumpScale: 3.2, displacementMap: relief, displacementScale: ELEV, roughness: 0.92, metalness: 0,
    });
    const globe = new THREE.Group();
    const boule = new THREE.Mesh(new THREE.SphereGeometry(1, 384, 192), matiere);
    globe.add(boule);
    sc.add(globe);

    const soleil = new THREE.DirectionalLight(0xffffff, nuit ? 1.7 : 1.35);
    soleil.position.set(-4, 3.2, 2.4);
    const ambiance = new THREE.AmbientLight(0xffffff, nuit ? 0.6 : 2.0);
    sc.add(soleil, ambiance);

    /* L'atmosphère : un halo violet pâle sur le bord. */
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(1.1, 64, 48),
      new THREE.ShaderMaterial({
        transparent: true, side: THREE.BackSide, depthWrite: false,
        uniforms: { couleur: { value: new THREE.Color(nuit ? "#6d7dff" : "#8f7dff") }, force: { value: nuit ? 0.8 : 0.28 } },
        vertexShader: "varying vec3 n; void main(){ n = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
        fragmentShader: "varying vec3 n; uniform vec3 couleur; uniform float force; void main(){ float i = pow(max(0.0, 0.72 - dot(n, vec3(0.0,0.0,1.0))), 3.0); gl_FragColor = vec4(couleur, clamp(i * force, 0.0, 1.0)); }",
      }),
    );
    sc.add(halo);

    /* Les repères : un seul nuage de points. */
    const ptsGeo = new THREE.BufferGeometry();
    const ptsMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { echelle: { value: renderer.getPixelRatio() } },
      vertexShader:
        "attribute float taille; attribute vec3 teinte; varying vec3 t; varying float s; uniform float echelle; void main(){ t = teinte; s = taille; gl_PointSize = taille * echelle; vec3 w = (modelMatrix * vec4(position,1.0)).xyz; float face = dot(normalize(w), normalize(cameraPosition)); gl_Position = face < 0.3 ? vec4(2.0, 2.0, 2.0, 1.0) : projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader:
        "varying vec3 t; varying float s; void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; vec3 c = (d > 0.36 && s > 6.0) ? vec3(1.0) : t; gl_FragColor = vec4(c, 1.0); }",
    });
    const points = new THREE.Points(ptsGeo, ptsMat);
    points.frustumCulled = false;
    globe.add(points);
    let positions: THREE.Vector3[] = [];

    /* Les tracés. */
    const lignes = new THREE.Group();
    globe.add(lignes);

    /* Les liens : des courbes qui s'élèvent au-dessus du globe, et un point qui les parcourt. */
    const arcsGroupe = new THREE.Group();
    globe.add(arcsGroupe);
    let arcsPts: THREE.Vector3[][] = [];
    const pastille = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const x = c.getContext("2d")!;
      x.fillStyle = "#fff";
      x.beginPath();
      x.arc(32, 32, 30, 0, 7);
      x.fill();
      x.fillStyle = "#5b3df0";
      x.beginPath();
      x.arc(32, 32, 20, 0, 7);
      x.fill();
      return new THREE.CanvasTexture(c);
    })();
    const pulseGeo = new THREE.BufferGeometry();
    const pulse = new THREE.Points(pulseGeo, new THREE.PointsMaterial({ size: 11, sizeAttenuation: false, map: pastille, transparent: true, depthWrite: false }));
    pulse.frustumCulled = false;
    globe.add(pulse);

    const tout = { rx: 0.35, ry: -Math.PI / 2 + 0.3, d: 4.25, trx: 0.35, try_: -Math.PI / 2 + 0.3, td: 4.25, vit: 0, glisse: false, dernierGeste: 0 };
    const ecran = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      return { w, h, fit: Math.max(1, h / w) };
    };
    const distMonde = () => 4.25 * ecran().fit;

    const majTaille = () => {
      const { w, h } = ecran();
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      /* Sur grand écran, le panneau de gauche prend de la place : le globe se décale vers la droite. */
      const dx = w > 1000 ? 0.03 : 0;
      const dy = w <= 700 ? 0.07 : 0;
      cam.setViewOffset(w, h, -w * dx, h * dy, w, h);
      cam.updateProjectionMatrix();
      if (!etat.current.props.pays) tout.td = Math.max(tout.td, distMonde());
    };
    majTaille();
    tout.d = tout.td = distMonde();
    const ro = new ResizeObserver(majTaille);
    ro.observe(el);

    const poserCap = (lat: number, lon: number) => {
      tout.trx = lat * DEG;
      let a = -Math.PI / 2 - lon * DEG;
      /* Le plus court chemin : on ramène l'angle cible près de l'angle courant. */
      while (a - tout.ry > Math.PI) a -= 2 * Math.PI;
      while (a - tout.ry < -Math.PI) a += 2 * Math.PI;
      tout.try_ = a;
    };

    /* ── Le relief fin : une zone peinte à partir de vraies altitudes, posée sur le globe ───────── */
    let patch: THREE.Mesh | null = null;
    let patchBoite: Boite | null = null;
    let jeton = 0;
    const tuiles = new Map<string, Promise<ImageBitmap | null>>();
    const tuile = (z: number, x: number, y: number) => {
      const k = `${z}/${x}/${y}`;
      let p = tuiles.get(k);
      if (!p) {
        if (tuiles.size > 320) tuiles.clear();
        p = fetch(`/api/relief/${z}/${x}/${y}`)
          .then((r) => (r.ok ? r.blob() : Promise.reject(new Error("tuile"))))
          .then((b) => createImageBitmap(b))
          .catch(() => null);
        tuiles.set(k, p);
      }
      return p;
    };
    const retirerPatch = () => {
      if (!patch) return;
      globe.remove(patch);
      patch.geometry.dispose();
      (patch.material as THREE.MeshBasicMaterial).map?.dispose();
      (patch.material as THREE.Material).dispose();
      patch = null;
      patchBoite = null;
    };
    const poserPatch = async (b: Boite) => {
      const mon = ++jeton;
      const p = etat.current.props;
      const toile = await peindreRelief(b, p.geo, p.pays, p.nuit, tuile);
      if (mon !== jeton || !toile) return;
      const n = 120;
      const pos = new Float32Array((n + 1) * (n + 1) * 3);
      const uv = new Float32Array((n + 1) * (n + 1) * 2);
      const v = new THREE.Vector3();
      for (let j = 0; j <= n; j++)
        for (let i = 0; i <= n; i++) {
          const k = j * (n + 1) + i;
          versXYZ(b.lat1 - (j / n) * (b.lat1 - b.lat0), b.lon0 + (i / n) * (b.lon1 - b.lon0), PATCH, v);
          pos.set([v.x, v.y, v.z], k * 3);
          uv.set([i / n, 1 - j / n], k * 2);
        }
      const idx: number[] = [];
      for (let j = 0; j < n; j++)
        for (let i = 0; i < n; i++) {
          const a = j * (n + 1) + i;
          idx.push(a, a + n + 1, a + 1, a + 1, a + n + 1, a + n + 2);
        }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
      g.setIndex(idx);
      const tex = new THREE.CanvasTexture(toile);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.FrontSide }));
      mesh.renderOrder = 1;
      retirerPatch();
      globe.add(mesh);
      patch = mesh;
      patchBoite = b;
    };

    const api = {
      maj: () => {},
      peindre: () => {
        const p = etat.current.props;
        peindre(p.geo, p.nuit, p.pays, toile);
        texture.needsUpdate = true;
        (halo.material as THREE.ShaderMaterial).uniforms.couleur.value.set(p.nuit ? "#6d7dff" : "#8f7dff");
        (halo.material as THREE.ShaderMaterial).uniforms.force.value = p.nuit ? 0.8 : 0.28;
        soleil.intensity = p.nuit ? 1.7 : 1.35;
        ambiance.intensity = p.nuit ? 0.6 : 2.0;
        majLignes();
        const bp = patchBoite;
        if (bp) void poserPatch(bp);
      },
      cadrer: () => {
        const p = etat.current.props;
        if (!p.pays) {
          tout.td = distMonde();
          retirerPatch();
          return;
        }
        const c = cadrage(p.geo, p.pays);
        if (!c) return;
        poserCap(c.lat, c.lon);
        /* Le pays doit remplir la scène : on cherche la hauteur d'image qui contient sa hauteur et sa largeur. */
        const { w, h } = ecran();
        const visible = Math.max(c.hauteur * 1.95, (c.largeur * 1.85) / Math.max(0.8, Math.min(1.6, w / h)));
        tout.td = Math.min(distMonde(), Math.max(1.16, 1 + (visible * DEG) / (2 * Math.tan(16 * DEG))));
        const bx = boite(p.geo, p.pays);
        if (bx) void poserPatch(bx);
      },
      zoomer: (f: number) => {
        tout.td = Math.min(5.2, Math.max(1.1, tout.td * f));
      },
      recentrer: () => {
        tout.dernierGeste = 0;
        tout.td = distMonde();
      },
      majReperes: () => {
        const r = etat.current.reperes;
        positions = r.map((x) => versXYZ(x.lat, x.lon, etat.current.props.monde ? 1.012 : SURF));
        const pos = new Float32Array(r.length * 3);
        const col = new Float32Array(r.length * 3);
        const tai = new Float32Array(r.length);
        const c = new THREE.Color();
        r.forEach((x, i) => {
          pos.set([positions[i].x, positions[i].y, positions[i].z], i * 3);
          c.set(etat.current.props.monde ? "#e11d48" : COUCHE[x.couche].couleur);
          /* Le nuage de points n'est pas converti en sortie : on lui donne les valeurs sRGB brutes. */
          const srgb = c.getRGB({ r: 0, g: 0, b: 0 } as THREE.RGB, THREE.SRGBColorSpace);
          col.set([srgb.r, srgb.g, srgb.b], i * 3);
          tai[i] = etat.current.props.monde ? 3.6 : 9;
        });
        ptsGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        ptsGeo.setAttribute("teinte", new THREE.BufferAttribute(col, 3));
        ptsGeo.setAttribute("taille", new THREE.BufferAttribute(tai, 1));
        ptsGeo.computeBoundingSphere();
      },
      majLignes: () => {
        majLignes();
      },
      majArcs: () => majArcs(),
    };

    const majArcs = () => {
      while (arcsGroupe.children.length) {
        const o = arcsGroupe.children.pop() as THREE.Line;
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      }
      arcsPts = [];
      const e = etat.current;
      const par = new Map(e.reperes.map((r) => [r.id, r]));
      for (const [a, b] of e.props.arcs) {
        const ra = par.get(a);
        const rb = par.get(b);
        if (!ra || !rb) continue;
        const va = versXYZ(ra.lat, ra.lon, 1);
        const vb = versXYZ(rb.lat, rb.lon, 1);
        const ang = va.angleTo(vb);
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 56; i++) {
          const t = i / 56;
          const base = new THREE.Vector3().copy(va).lerp(vb, t).normalize();
          pts.push(base.multiplyScalar(SURF + Math.sin(Math.PI * t) * (0.03 + ang * 0.22)));
        }
        arcsPts.push(pts);
        const g = new THREE.BufferGeometry().setFromPoints(pts);
        arcsGroupe.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: e.props.nuit ? "#9d8cff" : "#4f3be0", transparent: true, opacity: 0.85 })));
      }
    };

    const majLignes = () => {
      while (lignes.children.length) {
        const o = lignes.children.pop() as THREE.LineSegments;
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      }
      const p = etat.current.props;
      const faire = (liste: Riviere[], couleur: string, opacite: number) => {
        const v: number[] = [];
        const t = new THREE.Vector3();
        for (const riv of liste)
          for (const l of riv.l)
            for (let i = 0; i + 1 < l.length; i++) {
              versXYZ(l[i][1], l[i][0], LIGNE, t);
              v.push(t.x, t.y, t.z);
              versXYZ(l[i + 1][1], l[i + 1][0], LIGNE, t);
              v.push(t.x, t.y, t.z);
            }
        if (!v.length) return;
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
        lignes.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: couleur, transparent: true, opacity: opacite })));
      };
      const vives = p.rivieresVives;
      const bleu = COUCHE.rivieres.couleur;
      faire(p.rivieres.filter((r) => !vives.has(r)), bleu, vives.size ? 0.35 : 0.85);
      faire(p.rivieres.filter((r) => vives.has(r)), nuit ? "#7fb2ff" : "#1d4ed8", 1);
    };
    scene.current = api;
    api.majReperes();
    api.majLignes();
    api.majArcs();
    api.cadrer();

    /* ── Gestes : glisser, pincer, molette ───────────────────────────────── */
    const doigts = new Map<number, { x: number; y: number }>();
    let depart = { x: 0, y: 0, t: 0 };
    let pincement = 0;
    const surPointeur = { x: -1, y: -1, dans: false };
    const bas = (e: PointerEvent) => {
      renderer.domElement.setPointerCapture(e.pointerId);
      doigts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (doigts.size === 1) depart = { x: e.clientX, y: e.clientY, t: performance.now() };
      if (doigts.size === 2) {
        const [a, b] = [...doigts.values()];
        pincement = Math.hypot(a.x - b.x, a.y - b.y);
      }
      tout.glisse = true;
      tout.vit = 0;
      renderer.domElement.style.cursor = "grabbing";
    };
    const bouge = (e: PointerEvent) => {
      const r = renderer.domElement.getBoundingClientRect();
      surPointeur.x = e.clientX - r.left;
      surPointeur.y = e.clientY - r.top;
      surPointeur.dans = true;
      const d = doigts.get(e.pointerId);
      if (!d) return;
      if (doigts.size === 2) {
        doigts.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const [a, b] = [...doigts.values()];
        const n = Math.hypot(a.x - b.x, a.y - b.y);
        if (pincement > 0) tout.td = Math.min(5.2, Math.max(1.1, tout.td * (pincement / n)));
        pincement = n;
        return;
      }
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      doigts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      /* La vitesse de rotation suit la taille à l'écran : plus on est proche, plus on glisse finement. */
      const k = ((tout.d - 1) / 2.4) * 0.0062;
      tout.try_ += dx * k;
      tout.trx = Math.max(-1.35, Math.min(1.35, tout.trx + dy * k));
      tout.ry = tout.try_;
      tout.rx = tout.trx;
      tout.vit = dx * k;
      tout.dernierGeste = performance.now();
    };
    const haut = (e: PointerEvent) => {
      const bougé = Math.hypot(e.clientX - depart.x, e.clientY - depart.y);
      doigts.delete(e.pointerId);
      if (doigts.size < 2) pincement = 0;
      if (doigts.size === 0) {
        tout.glisse = false;
        renderer.domElement.style.cursor = "grab";
        if (bougé < 6 && performance.now() - depart.t < 600) cliquer(e);
      }
    };
    const quitte = () => {
      surPointeur.dans = false;
      etat.current.props.onSurvol(null);
    };
    const roue = (e: WheelEvent) => {
      e.preventDefault();
      tout.td = Math.min(5.2, Math.max(1.1, tout.td * Math.exp(e.deltaY * 0.0012)));
    };

    const rayon = new THREE.Raycaster();
    const cliquer = (e: PointerEvent) => {
      const r = renderer.domElement.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const proche = plusProche(x, y, 16);
      if (proche) {
        etat.current.props.onChoix(proche);
        return;
      }
      const ndc = new THREE.Vector2((x / r.width) * 2 - 1, -(y / r.height) * 2 + 1);
      rayon.setFromCamera(ndc, cam);
      const hit = rayon.intersectObject(boule, false)[0];
      if (!hit) {
        etat.current.props.onPays(null);
        return;
      }
      const l = globe.worldToLocal(hit.point.clone()).normalize();
      const lat = Math.asin(l.y) / DEG;
      const lon = Math.atan2(-l.z, l.x) / DEG;
      etat.current.props.onPays(paysEn(geoPays.current, lat, lon));
    };

    renderer.domElement.addEventListener("pointerdown", bas);
    renderer.domElement.addEventListener("pointermove", bouge);
    renderer.domElement.addEventListener("pointerup", haut);
    renderer.domElement.addEventListener("pointercancel", haut);
    renderer.domElement.addEventListener("pointerleave", quitte);
    renderer.domElement.addEventListener("wheel", roue, { passive: false });

    /* ── La boucle ────────────────────────────────────────────────────────── */
    const v = new THREE.Vector3();
    const camDir = new THREE.Vector3();
    const proj: { x: number; y: number; vu: boolean }[] = [];
    const plusProche = (x: number, y: number, rayonPx: number): string | null => {
      let best: string | null = null;
      let min = rayonPx;
      const r = etat.current.reperes;
      for (let i = 0; i < r.length; i++) {
        const p = proj[i];
        if (!p || !p.vu) continue;
        const dd = Math.hypot(p.x - x, p.y - y);
        if (dd < min) {
          min = dd;
          best = r[i].id;
        }
      }
      return best;
    };

    /* Sans pays choisi : quand on s'approche et qu'on s'arrête, la zone regardée reçoit son relief fin. */
    let calmeDepuis = 0;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dernierSurvol: string | null = null;
    let brut = 0;
    let avant = performance.now();
    const boucle = () => {
      brut = requestAnimationFrame(boucle);
      /* Les mouvements suivent le temps, pas le nombre d'images : sur un appareil lent, le globe arrive au même moment. */
      const nowT = performance.now();
      const dt = Math.min(120, nowT - avant);
      avant = nowT;
      const doux = 1 - Math.exp(-dt / 170);
      const e = etat.current;
      /* Le globe tourne tout seul tant qu'on ne l'a pas touché et qu'aucun pays n'est choisi. */
      if (!tout.glisse && !e.props.pays && !reduit && performance.now() - tout.dernierGeste > 2500) tout.try_ -= 0.00007 * dt;
      if (!tout.glisse) {
        tout.ry += (tout.try_ - tout.ry) * doux;
        tout.rx += (tout.trx - tout.rx) * doux;
        /* L'élan qui reste après un lancer. */
        if (Math.abs(tout.vit) > 0.0001) {
          tout.try_ += tout.vit;
          tout.vit *= 0.94;
        }
      }
      tout.d += (tout.td - tout.d) * doux;
      if (!e.props.pays) {
        const calme = !tout.glisse && Math.abs(tout.try_ - tout.ry) < 0.003 && Math.abs(tout.trx - tout.rx) < 0.003 && Math.abs(tout.td - tout.d) < 0.02;
        const maintenant = performance.now();
        if (tout.d > 3.4 && patch) retirerPatch();
        else if (calme && tout.d < 2.6) {
          if (!calmeDepuis) calmeDepuis = maintenant;
          else if (calmeDepuis > 0 && maintenant - calmeDepuis > 500) {
            calmeDepuis = -1;
            const lat = tout.rx / DEG;
            let lon = (-Math.PI / 2 - tout.ry) / DEG;
            lon = ((((lon + 180) % 360) + 360) % 360) - 180;
            const dedans = patchBoite && lat > patchBoite.lat0 + (patchBoite.lat1 - patchBoite.lat0) * 0.3 && lat < patchBoite.lat1 - (patchBoite.lat1 - patchBoite.lat0) * 0.3 && lon > patchBoite.lon0 + (patchBoite.lon1 - patchBoite.lon0) * 0.3 && lon < patchBoite.lon1 - (patchBoite.lon1 - patchBoite.lon0) * 0.3;
            if (!dedans) {
              const demi = Math.min(26, 8 + 15 * (tout.d - 1.2));
              void poserPatch({ lat0: Math.max(-84, lat - demi), lat1: Math.min(84, lat + demi), lon0: Math.max(-180, lon - demi * 1.3), lon1: Math.min(180, lon + demi * 1.3) });
            }
          }
        } else if (!calme) calmeDepuis = 0;
      }
      globe.rotation.set(tout.rx, tout.ry, 0);
      cam.position.set(0, 0, tout.d);
      cam.lookAt(0, 0, 0);
      globe.updateMatrixWorld(true);
      cam.updateMatrixWorld(true);

      const { w, h } = ecran();
      camDir.copy(cam.position).normalize();
      const n = positions.length;
      const tai = ptsGeo.getAttribute("taille") as THREE.BufferAttribute | undefined;
      for (let i = 0; i < n; i++) {
        v.copy(positions[i]).applyMatrix4(globe.matrixWorld);
        const face = v.clone().normalize().dot(camDir);
        const vu = face > 0.2 && !e.props.monde;
        v.project(cam);
        proj[i] = { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, vu };
      }
      proj.length = n;
      if (tai) {
        const act = e.survol ?? null;
        for (let i = 0; i < n; i++) {
          const id = e.reperes[i]?.id;
          const grand = id === e.choisi ? 17 : id === act ? 15 : e.props.monde ? 3.6 : 9;
          if (tai.array[i] !== grand) {
            (tai.array as Float32Array)[i] = grand;
            tai.needsUpdate = true;
          }
        }
      }
      /* Les points de lumière parcourent les liens. */
      if (arcsPts.length) {
        const arr = new Float32Array(arcsPts.length * 3);
        const tt = performance.now() * 0.00035;
        arcsPts.forEach((pts, i) => {
          const f = (tt + i * 0.37) % 1;
          const k = Math.min(pts.length - 1, Math.floor(f * (pts.length - 1)));
          arr.set([pts[k].x, pts[k].y, pts[k].z], i * 3);
        });
        pulseGeo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
        pulse.visible = true;
      } else pulse.visible = false;
      /* Le survol : le repère le plus proche du pointeur. */
      if (surPointeur.dans && !tout.glisse) {
        const id = plusProche(surPointeur.x, surPointeur.y, 14);
        renderer.domElement.style.cursor = id ? "pointer" : "grab";
        if (id !== dernierSurvol) {
          dernierSurvol = id;
          e.props.onSurvol(id);
        }
      }
      /* Les cartes suivent leur repère. */
      const idx = new Map(e.reperes.map((x, i) => [x.id, i]));
      cartesEls.current.forEach((div, id) => {
        const i = idx.get(id);
        const p = i === undefined ? undefined : proj[i];
        if (!p || !p.vu) {
          div.style.opacity = "0";
          div.style.pointerEvents = "none";
          return;
        }
        div.style.opacity = "1";
        /* La carte reste dans la scène, même quand son repère est près du bord. */
        const demi = div.offsetWidth / 2 + 8;
        const x = Math.min(w - demi, Math.max(demi, p.x));
        div.style.transform = `translate(${x}px, ${p.y}px) translate(-50%, calc(-100% - 14px))`;
        div.style.zIndex = id === e.choisi || id === e.survol ? "5" : "3";
      });
      renderer.render(sc, cam);
    };
    boucle();

    return () => {
      cancelAnimationFrame(brut);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", bas);
      renderer.domElement.removeEventListener("pointermove", bouge);
      renderer.domElement.removeEventListener("pointerup", haut);
      renderer.domElement.removeEventListener("pointercancel", haut);
      renderer.domElement.removeEventListener("pointerleave", quitte);
      renderer.domElement.removeEventListener("wheel", roue);
      renderer.dispose();
      matiere.dispose();
      texture.dispose();
      relief.dispose();
      ptsGeo.dispose();
      ptsMat.dispose();
      pulseGeo.dispose();
      pastille.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      scene.current = null;
    };
    // La scène se monte une fois ; tout le reste passe par les effets ci-dessous.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo]);

  useEffect(() => scene.current?.peindre(), [nuit, pays, geo]);
  useEffect(() => scene.current?.cadrer(), [pays]);
  useEffect(() => {
    scene.current?.majReperes();
    scene.current?.majArcs();
  }, [reperes, monde, nuit]);
  useEffect(() => scene.current?.majArcs(), [arcs]);
  useEffect(() => scene.current?.majLignes(), [rivieres, rivieresVives]);

  const aCarte = reperes.filter((r) => cartes.includes(r.id));
  return (
    <div ref={hote} className="xp-globe">
      <div className="xp-cartes" aria-hidden="true">
        {aCarte.map((r) => {
          const c = COUCHE[r.couche];
          const Icone = c.icone;
          return (
            <div
              key={r.id}
              className={`xp-carte${r.id === choisi ? " xp-carte-on" : ""}`}
              style={{ "--c": c.couleur, opacity: 0 } as React.CSSProperties}
              ref={(d) => {
                if (d) cartesEls.current.set(r.id, d);
                else cartesEls.current.delete(r.id);
              }}
            >
              <span className="xp-carte-i"><Icone size={14} aria-hidden="true" /></span>
              <span className="xp-carte-t">
                <small>{r.nom}</small>
                <b>{r.detail}</b>
              </span>
              {c.exemple && <i className="xp-carte-ex">exemple</i>}
            </div>
          );
        })}
      </div>
    </div>
  );
});

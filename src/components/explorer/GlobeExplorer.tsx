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
const ELEV = 0.028;
const SURF = 1.075;
const LIGNE = 1;
const BORD = 1;
/* Le relief en volume peut monter jusqu'à ELEV * 1.7 : tout ce qu'on pose dessus reste au-dessus. */

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

/** Le pays choisi : un voile violet sur le globe. Les frontières sont des lignes vectorielles (toujours nettes), pas de la texture. */
function peindreSelection(geo: GeoJSON.FeatureCollection, nuit: boolean, pays: string | null, toile: HTMLCanvasElement, force = 1, colorations: Coloration[] = []) {
  const W = toile.width;
  const H = toile.height;
  const ctx = toile.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);
  /* Les pays colorés d'abord : le pays choisi, s'il y en a un, se peint par-dessus. */
  if (colorations.length) {
    const par = new Map(colorations.map((c) => [c.nom, c]));
    for (const f of geo.features) {
      const c = par.get((f.properties as { name: string }).name);
      if (!c) continue;
      const g = f.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
      const polys = (g.type === "MultiPolygon" ? g.coordinates : [g.coordinates]) as Anneau[][];
      ctx.beginPath();
      for (const pl of polys)
        for (const ring of pl) {
          ring.forEach(([lon, lat], i) => {
            const x = ((lon + 180) / 360) * W;
            const y = ((90 - lat) / 180) * H;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.closePath();
        }
      ctx.globalAlpha = c.opacite ?? 0.5;
      ctx.fillStyle = c.couleur;
      ctx.fill("evenodd");
    }
    ctx.globalAlpha = 1;
  }
  if (!pays || colorations.length) return;
  for (const f of geo.features) {
    if ((f.properties as { name: string }).name !== pays) continue;
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
    ctx.fillStyle = nuit ? `rgba(140,110,255,${0.3 * force})` : `rgba(104,72,240,${0.14 * force})`;
    ctx.fill("evenodd");
  }
}

/* ── Le relief lu en JavaScript, pour que tout ce qu'on pose sur le globe épouse sa surface ───────────────────────
   Les hauteurs (la même image que celle qui soulève la sphère) sont lues une fois. `altitude(lat, lon)` rend de 0 à 1 ;
   les lignes en tirent un attribut par sommet, et leur matière recalcule la distance au centre à chaque image avec
   l'échelle du relief du moment : frontières, contour du pays et rivières suivent donc les montagnes, y compris quand
   on incline le globe. */
const HAUT: { w: number; h: number; d: Uint8ClampedArray | null; attente: (() => void)[] } = { w: 0, h: 0, d: null, attente: [] };
function chargerHauteurs(quand: () => void) {
  if (HAUT.d) return quand();
  HAUT.attente.push(quand);
  if (HAUT.attente.length > 1) return;
  const img = new Image();
  img.onload = () => {
    const w = 2048;
    const h = 1024;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d", { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0, w, h);
    const px = ctx.getImageData(0, 0, w, h).data;
    const g = new Uint8ClampedArray(w * h);
    for (let i = 0; i < g.length; i++) g[i] = px[i * 4];
    HAUT.w = w;
    HAUT.h = h;
    HAUT.d = g;
    const f = HAUT.attente.splice(0);
    f.forEach((q) => q());
  };
  img.src = "/explorer/relief-h.jpg";
}
function altitude(lat: number, lon: number): number {
  const d = HAUT.d;
  if (!d) return 0;
  const x = (((lon + 180) / 360) * HAUT.w) % HAUT.w;
  const y = Math.min(HAUT.h - 1.001, Math.max(0, ((90 - lat) / 180) * HAUT.h));
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const x1 = (x0 + 1) % HAUT.w;
  const a = d[y0 * HAUT.w + x0] * (1 - fx) + d[y0 * HAUT.w + x1] * fx;
  const b = d[(y0 + 1) * HAUT.w + x0] * (1 - fx) + d[(y0 + 1) * HAUT.w + x1] * fx;
  return (a * (1 - fy) + b * fy) / 255;
}

/** Une matière de ligne qui épouse le relief : le sommet est ramené sur la sphère puis poussé de `altitude * échelle + décalage`. */
function drapee(mat: THREE.LineBasicMaterial, echelle: { value: number }, decalage: number) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uEl = echelle;
    sh.uniforms.uOff = { value: decalage };
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float alt;\nuniform float uEl;\nuniform float uOff;")
      .replace("#include <begin_vertex>", "vec3 transformed = normalize(position) * (1.0 + alt * uEl + uOff);");
  };
  mat.needsUpdate = true;
  return mat;
}

/** Les lignes d'un ensemble de pays : une seule géométrie de segments. `decalage` (en degrés) épaissit le trait en le dessinant plusieurs fois. */
function lignesPays(geo: GeoJSON.FeatureCollection, nom: string | string[] | null, r: number, decalage = 0): THREE.BufferGeometry {
  const noms = nom === null ? null : new Set(Array.isArray(nom) ? nom : [nom]);
  const v: number[] = [];
  const al: number[] = [];
  const t = new THREE.Vector3();
  const decs: [number, number][] = decalage ? [[0, 0], [decalage, 0], [-decalage, 0], [0, decalage], [0, -decalage]] : [[0, 0]];
  for (const f of geo.features) {
    if (noms !== null && !noms.has((f.properties as { name: string }).name)) continue;
    const g = f.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
    const polys = (g.type === "MultiPolygon" ? g.coordinates : [g.coordinates]) as Anneau[][];
    for (const p of polys)
      for (const ring of p)
        for (let i = 0; i + 1 < ring.length; i++)
          for (const [dx, dy] of decs) {
            versXYZ(ring[i][1] + dy, ring[i][0] + dx, r, t);
            v.push(t.x, t.y, t.z);
            al.push(altitude(ring[i][1], ring[i][0]));
            versXYZ(ring[i + 1][1] + dy, ring[i + 1][0] + dx, r, t);
            v.push(t.x, t.y, t.z);
            al.push(altitude(ring[i + 1][1], ring[i + 1][0]));
          }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
  g.setAttribute("alt", new THREE.Float32BufferAttribute(al, 1));
  return g;
}

/** Un pays peint d'une couleur sur le globe (la page Conflits colore ainsi les pays concernés). */
export interface Coloration {
  /** Le nom anglais du pays (clé de la géométrie). */
  nom: string;
  couleur: string;
  /** De 0 à 1 (0,5 par défaut). */
  opacite?: number;
}

/** Un cadrage demandé de l'extérieur : un centre, et la taille de ce qu'on veut voir (en degrés). */
export interface VueGlobe {
  lat: number;
  lon: number;
  largeur: number;
  hauteur: number;
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
  /** Le relief en volume : la caméra s'incline et les montagnes se dressent. */
  relief3D: boolean;
  /** Le pays sous le curseur (nom anglais et position à l'écran), ou null. */
  onPaysSurvol: (info: { nom: string; x: number; y: number } | null) => void;
  /** Mode compact (la page Conflits) : définition d'image plafonnée, sphère un peu moins détaillée. */
  compact?: boolean;
  /** Des pays peints d'une couleur, sous le contour du pays choisi. */
  colorations?: Coloration[];
  /** Des pays dont on trace le contour, en plus du pays choisi. */
  contours?: string[];
  /** Un cadrage imposé quand aucun pays n'est choisi (une région, plusieurs pays) ; le globe n'y tourne plus seul. */
  vue?: VueGlobe | null;
  /** Des liens courbes entre deux repères (identifiants). */
  arcs: [string, string][];
  /** Des liens entre deux coordonnées [lat, lon, lat, lon], sans repère à chaque bout. */
  arcsLL?: [number, number, number, number][];
  onSurvol: (id: string | null) => void;
  onChoix: (id: string) => void;
  onPays: (nom: string | null) => void;
}

export const GlobeExplorer = forwardRef<GlobeExplorerHandle, Props>(function GlobeExplorer(props, ref) {
  const { geo, nuit, reperes, rivieres, rivieresVives, pays, survol, choisi, cartes, monde, arcs, arcsLL, compact, colorations, contours, vue } = props;
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

    /* Le globe : une image de relief déjà ombrée (peinte à partir de vraies altitudes, voir scripts/explorer/relief.js).
       Trois définitions se succèdent sans qu'on le voie : le globe est net dès qu'elle arrivent, et ne recharge plus rien ensuite. */
    const maxTex = renderer.capabilities.maxTextureSize;
    const gros = !compact && maxTex >= 16384 && !window.matchMedia("(pointer: coarse)").matches && ((navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8) >= 8;
    const definitions = ["/explorer/relief-4k.jpg", ...(maxTex >= 8192 ? ["/explorer/relief-8k.jpg"] : []), ...(gros ? ["/explorer/relief-16k.jpg"] : [])];
    const attente = document.createElement("canvas");
    attente.width = 256;
    attente.height = 128;
    {
      const c = attente.getContext("2d")!;
      c.fillStyle = "#e3ebf8";
      c.fillRect(0, 0, 256, 128);
    }
    const texture = new THREE.CanvasTexture(attente);
    texture.colorSpace = THREE.SRGBColorSpace;
    /* Les hauteurs : racine carrée de l'altitude, 4096 x 2048 (voir scripts/explorer/relief.js). */
    const relief = new THREE.TextureLoader().load("/explorer/relief-h.jpg");
    relief.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const matiere = new THREE.MeshStandardMaterial({ map: texture, displacementMap: relief, displacementScale: ELEV, roughness: 0.95, metalness: 0 });
    matiere.color.set(nuit ? "#7a83b4" : "#ffffff");
    const globe = new THREE.Group();
    const geoBoule = new THREE.SphereGeometry(1, compact ? 384 : 512, compact ? 192 : 256);
    const boule = new THREE.Mesh(geoBoule, matiere);
    globe.add(boule);
    sc.add(globe);
    let actifs = true;
    let texturesPosees: THREE.Texture[] = [];
    (async () => {
      for (const url of definitions) {
        if (!actifs) return;
        try {
          const tex = await new Promise<THREE.Texture>((ok, ko) => new THREE.TextureLoader().load(url, ok, undefined, ko));
          if (!actifs) {
            tex.dispose();
            return;
          }
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
          matiere.map = tex;
          matiere.needsUpdate = true;
          texturesPosees.forEach((t) => t.dispose());
          texturesPosees = [tex];
        } catch {
          /* Une définition qui manque : on garde la précédente. */
        }
      }
    })();

    /* Le voile du pays choisi, posé sur le globe (même relief que lui, juste au-dessus). */
    const voileToile = document.createElement("canvas");
    voileToile.width = 2048;
    voileToile.height = 1024;
    peindreSelection(geo, nuit, pays, voileToile, 1, colorations);
    const voileTex = new THREE.CanvasTexture(voileToile);
    voileTex.colorSpace = THREE.SRGBColorSpace;
    /* Le voile est la même sphère, avec les mêmes hauteurs : il épouse chaque montagne au lieu de flotter au-dessus. */
    const voileGeo = geoBoule;
    const voileMat = (carte: THREE.Texture) =>
      new THREE.MeshStandardMaterial({ map: carte, transparent: true, depthWrite: false, displacementMap: relief, displacementScale: ELEV, roughness: 0.95, metalness: 0, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const voileM = voileMat(voileTex);
    const voile = new THREE.Mesh(voileGeo, voileM);
    voile.renderOrder = 1;
    globe.add(voile);

    /* Le pays sous le curseur : un voile plus léger et un trait fin. */
    const survolToile = document.createElement("canvas");
    survolToile.width = 2048;
    survolToile.height = 1024;
    const survolTex = new THREE.CanvasTexture(survolToile);
    survolTex.colorSpace = THREE.SRGBColorSpace;
    const survolM = voileMat(survolTex);
    const survolVoile = new THREE.Mesh(voileGeo, survolM);
    survolVoile.renderOrder = 1;
    survolVoile.visible = false;
    globe.add(survolVoile);
    const echelleRelief = { value: ELEV };
    const survolMat = drapee(new THREE.LineBasicMaterial({ color: nuit ? "#c9bfff" : "#7c6cf0", transparent: true, opacity: 0.9 }), echelleRelief, 0.0045);
    let survolLigne: THREE.LineSegments | null = null;
    let survolPays: string | null = null;
    const majSurvolPays = () => {
      if (survolLigne) {
        globe.remove(survolLigne);
        survolLigne.geometry.dispose();
        survolLigne = null;
      }
      const p = etat.current.props;
      if (!survolPays || survolPays === p.pays) {
        survolVoile.visible = false;
        return;
      }
      peindreSelection(p.geo, p.nuit, survolPays, survolToile, 0.7);
      survolTex.needsUpdate = true;
      survolVoile.visible = true;
      survolLigne = new THREE.LineSegments(lignesPays(p.geo, survolPays, BORD), survolMat);
      survolLigne.frustumCulled = false;
      survolLigne.renderOrder = 2;
      globe.add(survolLigne);
    };

    /* Les frontières et le contour du pays choisi : des lignes, donc nettes à tous les zooms. */
    const bordsMat = drapee(new THREE.LineBasicMaterial({ color: nuit ? "#aab4ff" : "#5b4bb0", transparent: true, opacity: nuit ? 0.3 : 0.24 }), echelleRelief, 0.004);
    const bords = new THREE.LineSegments(lignesPays(geo, null, BORD), bordsMat);
    bords.frustumCulled = false;
    bords.renderOrder = 2;
    globe.add(bords);
    const contourMat = drapee(new THREE.LineBasicMaterial({ color: nuit ? "#b9a6ff" : "#5b3df0" }), echelleRelief, 0.0055);
    let contour: THREE.LineSegments | null = null;
    const majContour = () => {
      if (contour) {
        globe.remove(contour);
        contour.geometry.dispose();
        contour = null;
      }
      const p = etat.current.props;
      const noms = [...(p.pays ? [p.pays] : []), ...(p.contours ?? [])];
      if (!noms.length) return;
      contour = new THREE.LineSegments(lignesPays(p.geo, noms, BORD, 0.018), contourMat);
      contour.frustumCulled = false;
      contour.renderOrder = 3;
      globe.add(contour);
    };
    majContour();

    const soleil = new THREE.DirectionalLight(0xffffff, nuit ? 1.7 : 0.9);
    soleil.position.set(-4, 3.2, 2.4);
    const ambiance = new THREE.AmbientLight(0xffffff, nuit ? 0.9 : 3.0);
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
        "attribute float taille; attribute vec3 teinte; varying vec3 t; varying float s; uniform float echelle; void main(){ t = teinte; s = taille; gl_PointSize = taille * echelle; vec3 w = (modelMatrix * vec4(position,1.0)).xyz; float face = dot(normalize(w), normalize(cameraPosition - w)); gl_Position = face < 0.16 ? vec4(2.0, 2.0, 2.0, 1.0) : projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
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

    const tout = { rx: 0.35, ry: -Math.PI / 2 + 0.3, d: 4.25, trx: 0.35, try_: -Math.PI / 2 + 0.3, td: 4.25, vit: 0, glisse: false, dernierGeste: 0, incl: 0, tincl: 0 };
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

    const api = {
      maj: () => {},
      peindre: () => {
        const p = etat.current.props;
        peindreSelection(p.geo, p.nuit, p.pays, voileToile, 1, p.colorations);
        voileTex.needsUpdate = true;
        matiere.color.set(p.nuit ? "#7a83b4" : "#ffffff");
        bordsMat.color.set(p.nuit ? "#aab4ff" : "#5b4bb0");
        bordsMat.opacity = p.nuit ? 0.3 : 0.24;
        contourMat.color.set(p.nuit ? "#b9a6ff" : "#5b3df0");
        majContour();
        (halo.material as THREE.ShaderMaterial).uniforms.couleur.value.set(p.nuit ? "#6d7dff" : "#8f7dff");
        (halo.material as THREE.ShaderMaterial).uniforms.force.value = p.nuit ? 0.8 : 0.28;
        soleil.intensity = p.nuit ? 1.7 : 0.9;
        ambiance.intensity = p.nuit ? 0.9 : 3.0;
        majLignes();
      },
      cadrer: () => {
        const p = etat.current.props;
        if (!p.pays && p.vue) {
          poserCap(p.vue.lat, p.vue.lon);
          const { w, h } = ecran();
          const visible = Math.max(p.vue.hauteur * 1.95, (p.vue.largeur * 1.85) / Math.max(0.8, Math.min(1.6, w / h)));
          tout.td = Math.min(distMonde(), Math.max(1.5, 1 + (visible * DEG) / (2 * Math.tan(16 * DEG))));
          return;
        }
        if (!p.pays) {
          tout.td = distMonde();
          return;
        }
        const c = cadrage(p.geo, p.pays);
        if (!c) return;
        poserCap(c.lat, c.lon);
        /* Le pays doit remplir la scène : on cherche la hauteur d'image qui contient sa hauteur et sa largeur. */
        const { w, h } = ecran();
        const visible = Math.max(c.hauteur * 1.95, (c.largeur * 1.85) / Math.max(0.8, Math.min(1.6, w / h)));
        tout.td = Math.min(distMonde(), Math.max(1.5, 1 + (visible * DEG) / (2 * Math.tan(16 * DEG))));
      },
      zoomer: (f: number) => {
        tout.td = Math.min(5.2, Math.max(1.28, tout.td * f));
      },
      recentrer: () => {
        tout.dernierGeste = 0;
        tout.td = distMonde();
      },
      majReperes: () => {
        const r = etat.current.reperes;
        positions = r.map((x) => versXYZ(x.lat, x.lon, etat.current.props.monde ? 1.04 : SURF));
        const pos = new Float32Array(r.length * 3);
        const col = new Float32Array(r.length * 3);
        const tai = new Float32Array(r.length);
        const c = new THREE.Color();
        r.forEach((x, i) => {
          pos.set([positions[i].x, positions[i].y, positions[i].z], i * 3);
          c.set(etat.current.props.monde ? "#e11d48" : x.couleur ?? COUCHE[x.couche].couleur);
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
      const liens: [number, number, number, number][] = [];
      for (const [a, b] of e.props.arcs) {
        const ra = par.get(a);
        const rb = par.get(b);
        if (ra && rb) liens.push([ra.lat, ra.lon, rb.lat, rb.lon]);
      }
      for (const l of e.props.arcsLL ?? []) liens.push(l);
      for (const [la, oa, lb, ob] of liens) {
        const va = versXYZ(la, oa, 1);
        const vb = versXYZ(lb, ob, 1);
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
        const al: number[] = [];
        const t = new THREE.Vector3();
        for (const riv of liste)
          for (const l of riv.l)
            for (let i = 0; i + 1 < l.length; i++) {
              versXYZ(l[i][1], l[i][0], LIGNE, t);
              v.push(t.x, t.y, t.z);
              al.push(altitude(l[i][1], l[i][0]));
              versXYZ(l[i + 1][1], l[i + 1][0], LIGNE, t);
              v.push(t.x, t.y, t.z);
              al.push(altitude(l[i + 1][1], l[i + 1][0]));
            }
        if (!v.length) return;
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
        g.setAttribute("alt", new THREE.Float32BufferAttribute(al, 1));
        lignes.add(new THREE.LineSegments(g, drapee(new THREE.LineBasicMaterial({ color: couleur, transparent: true, opacity: opacite }), echelleRelief, 0.0035)));
      };
      const vives = p.rivieresVives;
      const bleu = COUCHE.rivieres.couleur;
      faire(p.rivieres.filter((r) => !vives.has(r)), bleu, vives.size ? 0.35 : 0.85);
      faire(p.rivieres.filter((r) => vives.has(r)), nuit ? "#7fb2ff" : "#1d4ed8", 1);
    };
    scene.current = api;
    api.majReperes();
    api.majLignes();
    /* Dès que les hauteurs sont lues, toutes les lignes sont refaites pour épouser le relief. */
    let vivant = true;
    chargerHauteurs(() => {
      if (!vivant) return;
      bords.geometry.dispose();
      bords.geometry = lignesPays(geo, null, BORD);
      majContour();
      majSurvolPays();
      majLignes();
    });
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
        if (pincement > 0) tout.td = Math.min(5.2, Math.max(1.28, tout.td * (pincement / n)));
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
      tout.td = Math.min(5.2, Math.max(1.28, tout.td * Math.exp(e.deltaY * 0.0012)));
    };

    const rayon = new THREE.Raycaster();
    /* Le point du globe sous un pixel : l'intersection du rayon avec la sphère, sans parcourir ses triangles. */
    const pointSurGlobe = (x: number, y: number): { lat: number; lon: number } | null => {
      const r = renderer.domElement.getBoundingClientRect();
      rayon.setFromCamera(new THREE.Vector2((x / r.width) * 2 - 1, -(y / r.height) * 2 + 1), cam);
      const o = rayon.ray.origin;
      const d = rayon.ray.direction;
      const b = o.dot(d);
      const disc = b * b - (o.dot(o) - 1);
      if (disc < 0) return null;
      const t = -b - Math.sqrt(disc);
      if (t < 0) return null;
      const hit = o.clone().addScaledVector(d, t);
      const l = globe.worldToLocal(hit).normalize();
      return { lat: Math.asin(l.y) / DEG, lon: Math.atan2(-l.z, l.x) / DEG };
    };
    const cliquer = (e: PointerEvent) => {
      const r = renderer.domElement.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const proche = plusProche(x, y, 16);
      if (proche) {
        etat.current.props.onChoix(proche);
        return;
      }
      const pt = pointSurGlobe(x, y);
      if (!pt) {
        etat.current.props.onPays(null);
        return;
      }
      const { lat, lon } = pt;
      etat.current.props.onPays(paysEn(geoPays.current, lat, lon));
    };

    renderer.domElement.addEventListener("pointerdown", bas);
    renderer.domElement.addEventListener("pointermove", bouge);
    renderer.domElement.addEventListener("pointerup", haut);
    renderer.domElement.addEventListener("pointercancel", haut);
    renderer.domElement.addEventListener("pointerleave", quitte);
    renderer.domElement.addEventListener("wheel", roue, { passive: false });
    /* Au clavier : flèches pour tourner, + et - pour zoomer, Échap pour revenir au monde. */
    renderer.domElement.tabIndex = 0;
    renderer.domElement.setAttribute("aria-label", "Globe interactif : flèches pour tourner, plus et moins pour zoomer");
    renderer.domElement.style.outline = "none";
    const touche = (e: KeyboardEvent) => {
      const pas = 0.05 + ((tout.d - 1) / 3) * 0.12;
      tout.dernierGeste = performance.now();
      if (e.key === "ArrowLeft") tout.try_ += pas;
      else if (e.key === "ArrowRight") tout.try_ -= pas;
      else if (e.key === "ArrowUp") tout.trx = Math.min(1.35, tout.trx + pas);
      else if (e.key === "ArrowDown") tout.trx = Math.max(-1.35, tout.trx - pas);
      else if (e.key === "+" || e.key === "=") tout.td = Math.max(1.28, tout.td * 0.85);
      else if (e.key === "-") tout.td = Math.min(5.2, tout.td * 1.18);
      else if (e.key === "Escape") etat.current.props.onPays(null);
      else return;
      e.preventDefault();
    };
    renderer.domElement.addEventListener("keydown", touche);

    /* ── La boucle ────────────────────────────────────────────────────────── */
    const v = new THREE.Vector3();
    const lumiereCible = new THREE.Vector3();
    const tmpDir = new THREE.Vector3();
    const tmpN = new THREE.Vector3();
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

    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dernierSurvol: string | null = null;
    let dernierPays = 0;
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
      if (!tout.glisse && !e.props.pays && !e.props.vue && !reduit && performance.now() - tout.dernierGeste > 2500) tout.try_ -= 0.00007 * dt;
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
      globe.rotation.set(tout.rx, tout.ry, 0);
      /* Le relief en volume : la caméra descend vers le sud et regarde le point visé, les montagnes se dressent. */
      tout.tincl = e.props.relief3D ? 1 : 0;
      if (tout.tincl > 0.5 && tout.td < 1.6) tout.td = 1.6;
      tout.incl += (tout.tincl - tout.incl) * doux;
      const incl = Math.abs(tout.tincl - tout.incl) < 0.001 ? tout.tincl : tout.incl;
      const ang = incl * 58 * DEG;
      /* La caméra reste à la même hauteur au-dessus du point visé, mais glisse vers le sud le long de la surface. */
      const L = tout.d - 1;
      cam.position.set(0, -Math.sin(ang) * L, 1 + Math.cos(ang) * L);
      cam.lookAt(0, 0, 1);
      matiere.displacementScale = ELEV * (1 + 0.7 * incl);
      voileM.displacementScale = matiere.displacementScale;
      survolM.displacementScale = matiere.displacementScale;
      echelleRelief.value = matiere.displacementScale;
      {
        const { w: ww, h: hh } = ecran();
        const px = surPointeur.dans ? surPointeur.x / ww : 0.35;
        const py = surPointeur.dans ? surPointeur.y / hh : 0.3;
        lumiereCible.set(-4 + (px - 0.5) * 2.4, 3.2 + (0.5 - py) * 1.6, 2.4);
        soleil.position.lerp(lumiereCible, doux * 0.6);
      }
      globe.updateMatrixWorld(true);
      cam.updateMatrixWorld(true);

      const { w, h } = ecran();
      const n = positions.length;
      const tai = ptsGeo.getAttribute("taille") as THREE.BufferAttribute | undefined;
      for (let i = 0; i < n; i++) {
        v.copy(positions[i]).applyMatrix4(globe.matrixWorld);
        tmpDir.copy(cam.position).sub(v).normalize();
        const face = tmpN.copy(v).normalize().dot(tmpDir);
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
      const maintenantPays = performance.now();
      if (surPointeur.dans && !tout.glisse) {
        const id = plusProche(surPointeur.x, surPointeur.y, 14);
        renderer.domElement.style.cursor = id ? "pointer" : "grab";
        if (id !== dernierSurvol) {
          dernierSurvol = id;
          e.props.onSurvol(id);
        }
        /* Le pays sous le curseur, quand aucun repère n'est survolé. */
        if (maintenantPays - dernierPays > 80) {
          dernierPays = maintenantPays;
          const pt = id ? null : pointSurGlobe(surPointeur.x, surPointeur.y);
          const nom = pt ? paysEn(geoPays.current, pt.lat, pt.lon) : null;
          if (nom !== survolPays) {
            survolPays = nom;
            majSurvolPays();
          }
          e.props.onPaysSurvol(nom ? { nom, x: surPointeur.x, y: surPointeur.y } : null);
          if (!id) renderer.domElement.style.cursor = nom ? "pointer" : "grab";
        }
      } else if (survolPays) {
        survolPays = null;
        majSurvolPays();
        e.props.onPaysSurvol(null);
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
      renderer.domElement.removeEventListener("keydown", touche);
      renderer.dispose();
      actifs = false;
      vivant = false;
      matiere.dispose();
      texture.dispose();
      texturesPosees.forEach((t) => t.dispose());
      relief.dispose();
      voileTex.dispose();
      survolTex.dispose();
      survolMat.dispose();
      bordsMat.dispose();
      contourMat.dispose();
      geoBoule.dispose();
      voileM.dispose();
      survolM.dispose();
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

  useEffect(() => scene.current?.peindre(), [nuit, pays, geo, colorations, contours]);
  useEffect(() => scene.current?.cadrer(), [pays, vue]);
  useEffect(() => {
    scene.current?.majReperes();
    scene.current?.majArcs();
  }, [reperes, monde, nuit]);
  useEffect(() => scene.current?.majArcs(), [arcs, arcsLL]);
  useEffect(() => scene.current?.majLignes(), [rivieres, rivieresVives]);

  const aCarte = reperes.filter((r) => cartes.includes(r.id));
  return (
    <div ref={hote} className="xp-globe">
      <div className="xp-cartes" aria-hidden="true">
        {aCarte.map((r) => {
          const c = { ...COUCHE[r.couche], couleur: r.couleur ?? COUCHE[r.couche].couleur, icone: r.icone ?? COUCHE[r.couche].icone };
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

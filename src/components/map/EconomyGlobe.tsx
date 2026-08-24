"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import type { EconomyMetricId, EconomyYear } from "@/types";
import { getCountryFillColorEconomy, getMaxMetricValue } from "@/lib/economyColors";

/* ═══════════════════════════════════════════════════════════════════════════
   ECONOMY GLOBE
   The same machinery as the politics globe, in our own palette rather than in
   photography: a deep green ocean, land carrying the metric's own ramp, white
   hairline borders, a graticule, a halo and two orbital arcs.

   Where the politics globe answers "what does the world look like from up
   there", this one answers "where is the value" — so nothing on it is
   decorative for its own sake. The greens are the map's greens, so a country
   reads the same whether the reader is looking at the flat map or the sphere.
   ═══════════════════════════════════════════════════════════════════════════ */

const RADIUS = 1;
/**
 * Painted texture size, and the zoom it can carry.
 *
 * Not constants: sharpness is bounded by texels, and how many the device can
 * hold is not knowable until there is a renderer to ask. A laptop with memory
 * to spare gets four times the texels and twice the zoom; a phone keeps what
 * it had. Both are set once, before anything is painted.
 */
let TEXTURE_W = 4096;
let TEXTURE_H = 2048;
let ZOOM_CEILING = 2.6;
/** Field of view at rest. Zooming past the dolly limit narrows it. */
const BASE_FOV = 34;

function chooseTextureSize(renderer: THREE.WebGLRenderer) {
  const maxTex = renderer.capabilities.maxTextureSize;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const roomy = maxTex >= 8192 && memory >= 8 && !coarse;

  TEXTURE_W = roomy ? 8192 : 4096;
  TEXTURE_H = TEXTURE_W / 2;
  // Capped where the texture still has texels to give: past it the map stops
  // gaining detail and only gains blur.
  ZOOM_CEILING = roomy ? 5 : 2.6;
}
const PICK_W = 2048;
const PICK_H = 1024;

/**
 * Brand palette. The water is a clear teal rather than a deep one: the map is
 * read for its greens, and a dark sea drags every one of them down with it.
 */
const OCEAN_DEEP = "#7DB4C4";
const OCEAN_MID = "#8DC3D2";
const OCEAN_SHELF = "#9DD1DE";
/** Not a class on the ramp: pale and washed out, so it never reads as one. */
const LAND_NO_DATA = "#A6C7B7";
/**
 * Borders have to survive two neighbouring greens a class apart — and the
 * texture is minified about two to one on screen, so a line painted at a
 * hairline arrives softer than a hairline. Wide enough to land on a crisp
 * couple of pixels, and no wider: past this an archipelago disappears inside
 * its own outline.
 */
const BORDER = "rgba(255,255,255,0.97)";
const BORDER_WIDTH = 3.2;
const GRATICULE = "rgba(255,255,255,0.10)";
const ACCENT = "#39FF88";
/** Land raised off the water, in texels: white is land, black is sea. */
const RELIEF_BLUR = 4;
const RELIEF_SCALE = 0.028;
/**
 * Where the land's own surface sits, so a highlight is drawn *on* the country
 * rather than hovering above it. Clearing the full displacement left the
 * outline detached from the ground at the limb — a ring in the air around a
 * country instead of a border drawn on it.
 */
const PLATEAU_TOP = RELIEF_SCALE * 0.62 + 0.0012;
/**
 * NASA Blue Marble and its elevation companion — public-domain scientific
 * rasters, not decoration. The photograph is not shown for its own sake: its
 * luminosity is folded into the choropleth so a country carries its real
 * deserts, forests, ice and mountains while keeping the colour of its class.
 */
const IMAGERY = "/geo/earth-blue-marble.jpg";
const TOPOLOGY = "/geo/earth-topology.png";
/** How much of the terrain's texture comes through the class colour. */
const TERRAIN_AMOUNT = 0.78;
/** How much class colour is washed over the photography in satellite mode. */
const SATELLITE_TINT = 0.46;
/** The sea of the tiled satellite map, so both views show the same water. */
const SATELLITE_SEA = "#0B3B5C";
/**
 * How much the sea's own surface colours the water.
 *
 * Not bathymetry: the elevation raster shipped with the globe holds the
 * ocean at zero everywhere — it carries land only. Anything the water shows
 * has to be built, not read.
 */
const SEA_TINT_AMOUNT = 0.38;
/**
 * Amplitude of the sea floor in the *displacement* field. Kept tiny on
 * purpose: the ocean has to stay at sea level. Its relief is carried by the
 * shading field below, which the light reads and the geometry does not.
 */
const OCEAN_RELIEF = 0.06;
/** Strength of the surface the light is shaded from. */
const BUMP_SCALE = 8;
/** Sea state — swell stretched along the wind, then a finer chop over it. */
/** Sea state: a long swell running with the wind, then a chop across it. */
const SWELL_CELLS = 90;
const SWELL_STRETCH = 4.5;
const CHOP_CELLS = 300;
const CHOP_STRETCH = 2.2;

interface PickMap {
  data: Uint8ClampedArray;
  width: number;
  height: number;
  names: string[];
}

function ringsOf(feature: GeoJSON.Feature): GeoJSON.Position[][] {
  const geom = feature.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon | null;
  if (!geom) return [];
  return geom.type === "Polygon"
    ? (geom.coordinates as GeoJSON.Position[][])
    : (geom.coordinates as GeoJSON.Position[][][]).flat(1);
}

function traceFeature(
  ctx: CanvasRenderingContext2D,
  feature: GeoJSON.Feature,
  w: number,
  h: number
) {
  const geom = feature.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon | null;
  if (!geom) return;
  const polygons: GeoJSON.Position[][][] =
    geom.type === "Polygon"
      ? [geom.coordinates as GeoJSON.Position[][]]
      : (geom.coordinates as GeoJSON.Position[][][]);

  ctx.beginPath();
  for (const polygon of polygons) {
    for (const ring of polygon) {
      ring.forEach(([lon, lat], i) => {
        const px = ((lon + 180) / 360) * w;
        const py = ((90 - lat) / 180) * h;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
    }
  }
}

/**
 * Ocean, graticule, land in the neutral tone and every border — painted once.
 * A metric or year change is then a blit plus the countries that carry a
 * value, which is what keeps scrubbing the timeline smooth.
 */
function buildBaseMap(geojson: GeoJSON.FeatureCollection): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_W;
  canvas.height = TEXTURE_H;
  const ctx = canvas.getContext("2d")!;

  // Ocean: lighter and warmer towards the equator, deep at the poles, so the
  // water has somewhere to go rather than reading as one flat field.
  const ocean = ctx.createLinearGradient(0, 0, 0, TEXTURE_H);
  ocean.addColorStop(0, OCEAN_DEEP);
  ocean.addColorStop(0.3, OCEAN_MID);
  ocean.addColorStop(0.5, OCEAN_SHELF);
  ocean.addColorStop(0.7, OCEAN_MID);
  ocean.addColorStop(1, OCEAN_DEEP);
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, TEXTURE_W, TEXTURE_H);

  // The water, given a surface. Broad slow variation so the sea is never one
  // flat field of colour, then the swell itself, faint — the light does most
  // of the work on the water and the colour only has to stop being uniform.
  grain(ctx, TEXTURE_W, TEXTURE_H, 26, 3.4, SEA_TINT_AMOUNT, "soft-light");
  grain(ctx, TEXTURE_W, TEXTURE_H, SWELL_CELLS, SWELL_STRETCH, SEA_TINT_AMOUNT * 0.6, "soft-light");

  // Graticule every 15°, under the land.
  ctx.strokeStyle = GRATICULE;
  ctx.lineWidth = 1.6;
  for (let lon = -180; lon <= 180; lon += 15) {
    const x = ((lon + 180) / 360) * TEXTURE_W;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, TEXTURE_H);
    ctx.stroke();
  }
  for (let lat = -75; lat <= 75; lat += 15) {
    const y = ((90 - lat) / 180) * TEXTURE_H;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(TEXTURE_W, y);
    ctx.stroke();
  }

  // No painted shade under the coastlines: the land is genuinely raised off
  // the sphere now, so it casts its own edge and a blur would only soften
  // what the relief draws sharply.
  ctx.fillStyle = LAND_NO_DATA;
  for (const feat of geojson.features) {
    traceFeature(ctx, feat, TEXTURE_W, TEXTURE_H);
    ctx.fill("evenodd");
  }

  ctx.strokeStyle = BORDER;
  ctx.lineWidth = BORDER_WIDTH;
  ctx.lineJoin = "round";
  for (const feat of geojson.features) {
    traceFeature(ctx, feat, TEXTURE_W, TEXTURE_H);
    ctx.stroke();
  }

  return canvas;
}

/**
 * The satellite base: the photography as it is, with the map's own borders and
 * graticule laid over it. No class colour — in this mode the reader is looking
 * at the ground, and the data is carried by the selection and the side panel.
 */
function buildSatelliteMap(
  geojson: GeoJSON.FeatureCollection,
  imagery: HTMLImageElement | null
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_W;
  canvas.height = TEXTURE_H;
  const ctx = canvas.getContext("2d")!;

  if (imagery) {
    ctx.drawImage(imagery, 0, 0, TEXTURE_W, TEXTURE_H);
  }

  // The water, flattened to the tone the tiled satellite map shows. The
  // photography's ocean is a different blue from Esri's, and switching between
  // the flat map and the globe should not switch seas.
  const water = document.createElement("canvas");
  water.width = TEXTURE_W;
  water.height = TEXTURE_H;
  const wc = water.getContext("2d")!;
  wc.fillStyle = SATELLITE_SEA;
  wc.fillRect(0, 0, TEXTURE_W, TEXTURE_H);
  wc.globalCompositeOperation = "destination-out";
  wc.drawImage(buildLandMask(geojson, TEXTURE_W, TEXTURE_H), 0, 0);
  ctx.drawImage(water, 0, 0);

  // A quieter graticule than the editorial map's: over photography a grid has
  // to be found rather than seen.
  ctx.strokeStyle = "rgba(255,255,255,0.07)";
  ctx.lineWidth = 1.4;
  for (let lon = -180; lon <= 180; lon += 15) {
    const x = ((lon + 180) / 360) * TEXTURE_W;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, TEXTURE_H);
    ctx.stroke();
  }
  for (let lat = -75; lat <= 75; lat += 15) {
    const y = ((90 - lat) / 180) * TEXTURE_H;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(TEXTURE_W, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = BORDER_WIDTH * 0.62;
  ctx.lineJoin = "round";
  for (const feat of geojson.features) {
    traceFeature(ctx, feat, TEXTURE_W, TEXTURE_H);
    ctx.stroke();
  }

  return canvas;
}

/**
 * The stock map lookup, with a negative mipmap bias.
 *
 * Mipmapping is correct and, head-on to a sphere, soft: at the globe's resting
 * size the map is minified about four to one, so the level sampled sits two
 * removed from the one that was painted. Pulling the sample back toward the
 * source is what the flat map gets for free by being vector. The anisotropic
 * filter, already at its maximum, absorbs most of what the bias costs.
 */
const SHARPENED_MAP_FRAGMENT = THREE.ShaderChunk.map_fragment.replace(
  "texture2D( map, vMapUv )",
  "texture2D( map, vMapUv, -0.75 )"
);

/** Solid white over land, transparent over water. Masks everything else. */
function buildLandMask(
  geojson: GeoJSON.FeatureCollection,
  w: number,
  h: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  for (const feat of geojson.features) {
    traceFeature(ctx, feat, w, h);
    ctx.fill("evenodd");
  }
  return canvas;
}

/**
 * A height field in two storeys. The lower one is the land itself, a plateau
 * lifted off the water with a soft wall at the coast. The upper one is the
 * real elevation map laid on top of it, so the Andes, the Himalayas and the
 * Rift stand above their own continents rather than the whole landmass rising
 * as one flat slab. Drives the vertex displacement and the shading together,
 * which is what keeps the light on a ridge agreeing with its shape.
 */
function buildReliefMap(
  geojson: GeoJSON.FeatureCollection,
  topo: HTMLImageElement | null
): HTMLCanvasElement {
  const w = TEXTURE_W / 2;
  const h = TEXTURE_H / 2;
  const mask = buildLandMask(geojson, w, h);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, w, h);

  // The sea floor first, at a shallow amplitude. It barely displaces the
  // surface — the ocean has to stay at sea level — but it carries enough
  // slope for the light to find the ridges, the trenches and the shelves,
  // which is what makes water read as water rather than as a flat field.
  if (topo) {
    ctx.save();
    ctx.globalAlpha = OCEAN_RELIEF;
    ctx.drawImage(topo, 0, 0, w, h);
    ctx.restore();
  }

  ctx.save();
  ctx.filter = `blur(${RELIEF_BLUR}px)`;
  ctx.globalAlpha = 0.6;
  ctx.drawImage(mask, 0, 0);
  ctx.restore();

  if (topo) {
    const relief = document.createElement("canvas");
    relief.width = w;
    relief.height = h;
    const rc = relief.getContext("2d")!;
    rc.drawImage(topo, 0, 0, w, h);
    rc.globalCompositeOperation = "destination-in";
    rc.drawImage(mask, 0, 0);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.4;
    ctx.drawImage(relief, 0, 0);
    ctx.restore();
  }

  return canvas;
}

/**
 * Soft procedural grain, built by letting the browser upscale a small field of
 * random values. Cheaper than a per-pixel loop over eight million texels, and
 * the bilinear filter does the smoothing for free — which is what turns noise
 * into swell rather than static.
 *
 * `stretch` squashes the source horizontally before it is blown up, so the
 * result runs in bands: read on water, that is wind.
 */
function grain(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cells: number,
  stretch: number,
  alpha: number,
  mode: GlobalCompositeOperation = "source-over"
) {
  const small = document.createElement("canvas");
  small.width = Math.max(2, Math.round(cells / stretch));
  small.height = Math.max(2, cells);
  const sc = small.getContext("2d")!;
  const img = sc.createImageData(small.width, small.height);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.round(Math.random() * 255);
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  sc.putImageData(img, 0, 0);

  ctx.save();
  ctx.globalCompositeOperation = mode;
  ctx.globalAlpha = alpha;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(small, 0, 0, w, h);
  ctx.restore();
}

/** The image, kept only where the mask is opaque. */
function maskedTo(
  source: CanvasImageSource,
  mask: HTMLCanvasElement,
  w: number,
  h: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(source, 0, 0, w, h);
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(mask, 0, 0, w, h);
  return canvas;
}

/**
 * The surface the light is shaded from — a real relief globe's own material,
 * before any colour is put on it.
 *
 * The elevation raster goes down whole, so the sea floor keeps its ridges and
 * trenches and the land keeps its ranges. On top of the water goes a sea
 * state: a long swell stretched along the wind, then a finer chop across it.
 * On the land goes a much finer grain, the tooth of rock.
 *
 * Deliberately a different field from the one that displaces the geometry.
 * Shading a trench costs nothing; displacing one would lift the ocean off sea
 * level, and the globe would read as a relief map of the sea rather than as
 * the sea.
 */
function buildShadingMap(
  geojson: GeoJSON.FeatureCollection,
  topo: HTMLImageElement | null
): HTMLCanvasElement {
  const w = TEXTURE_W / 2;
  const h = TEXTURE_H / 2;
  const mask = buildLandMask(geojson, w, h);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, w, h);

  /* ── The sea's surface ──────────────────────────────────────────────────
     Built, not read. Two octaves: a long swell stretched along the wind, and
     a shorter chop lying across it. Blended toward mid-grey rather than
     replacing it, so the amplitude stays a sea and not a static field. */
  const sea = document.createElement("canvas");
  sea.width = w;
  sea.height = h;
  const sc = sea.getContext("2d")!;
  sc.fillStyle = "#808080";
  sc.fillRect(0, 0, w, h);
  grain(sc, w, h, SWELL_CELLS, SWELL_STRETCH, 0.66);
  grain(sc, w, h, CHOP_CELLS, CHOP_STRETCH, 0.52);

  /* ── The land's ─────────────────────────────────────────────────────────
     Read, not built. The raster holds every range, plateau and rift above sea
     level; the grain over it is only the tooth of rock, laid in soft light so
     it seasons the relief instead of replacing it. */
  const land = document.createElement("canvas");
  land.width = w;
  land.height = h;
  const lc = land.getContext("2d")!;
  lc.fillStyle = "#404040";
  lc.fillRect(0, 0, w, h);
  if (topo) lc.drawImage(topo, 0, 0, w, h);
  grain(lc, w, h, 820, 1, 0.55, "soft-light");

  ctx.drawImage(sea, 0, 0);
  ctx.drawImage(maskedTo(land, mask, w, h), 0, 0);

  // The coast, reinforced: the land stands on a wall the light has to find.
  ctx.save();
  ctx.filter = `blur(${RELIEF_BLUR}px)`;
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.34;
  ctx.drawImage(mask, 0, 0, w, h);
  ctx.restore();

  return canvas;
}

function buildPickMap(geojson: GeoJSON.FeatureCollection): PickMap {
  const canvas = document.createElement("canvas");
  canvas.width = PICK_W;
  canvas.height = PICK_H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.imageSmoothingEnabled = false;

  const names: string[] = [""];
  for (const feat of geojson.features) {
    const name = feat.properties?.name as string | undefined;
    if (!name) continue;
    const id = names.length;
    names.push(name);
    ctx.fillStyle = `rgb(${(id >> 16) & 0xff},${(id >> 8) & 0xff},${id & 0xff})`;
    traceFeature(ctx, feat, PICK_W, PICK_H);
    ctx.fill("evenodd");
  }

  const { data } = ctx.getImageData(0, 0, PICK_W, PICK_H);
  return { data, width: PICK_W, height: PICK_H, names };
}

function countryAt(pick: PickMap, lat: number, lon: number): string | null {
  const px = Math.floor(((lon + 180) / 360) * pick.width);
  const py = Math.floor(((90 - lat) / 180) * pick.height);
  if (px < 0 || py < 0 || px >= pick.width || py >= pick.height) return null;
  const i = (py * pick.width + px) * 4;
  const id = (pick.data[i] << 16) | (pick.data[i + 1] << 8) | pick.data[i + 2];
  return id > 0 && id < pick.names.length ? pick.names[id] : null;
}

/** One country's rings as a flat list of segment endpoints on the sphere. */
function outlineVerts(feature: GeoJSON.Feature, radius: number): number[] {
  const verts: number[] = [];
  for (const ring of ringsOf(feature)) {
    for (let i = 0; i < ring.length - 1; i++) {
      for (const [lon, lat] of [ring[i], ring[i + 1]]) {
        const phi = ((90 - lat) * Math.PI) / 180;
        const theta = ((lon + 180) * Math.PI) / 180;
        verts.push(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          -radius * Math.sin(phi) * Math.sin(theta)
        );
      }
    }
  }
  return verts;
}

/** A stroke of a given screen width, plus a soft one under it. */
interface OutlineLayer {
  /** Width in screen pixels — WebGL's own lines are stuck at one. */
  width: number;
  opacity: number;
}

/**
 * A country's border as screen-width strokes rather than as a hairline: a
 * wide, faint pass reads as a glow lifting the country off the sphere, and a
 * narrower opaque pass on top of it draws the border itself. Nothing here
 * touches the country's fill, so its class colour survives untouched.
 */
function buildOutline(
  feature: GeoJSON.Feature,
  radius: number,
  colour: number,
  layers: OutlineLayer[],
  resolution: THREE.Vector2,
  registry: Set<LineMaterial>
): THREE.Group | null {
  const verts = outlineVerts(feature, radius);
  if (verts.length === 0) return null;

  const group = new THREE.Group();
  for (const layer of layers) {
    const geometry = new LineSegmentsGeometry();
    geometry.setPositions(verts);
    const material = new LineMaterial({
      color: colour,
      linewidth: layer.width,
      transparent: true,
      opacity: layer.opacity,
    });
    material.resolution.copy(resolution);
    registry.add(material);
    group.add(new LineSegments2(geometry, material));
  }
  return group;
}

/** Takes an outline out of the scene and gives its GPU memory back. */
function disposeOutline(group: THREE.Group | null, registry: Set<LineMaterial>) {
  if (!group) return;
  group.parent?.remove(group);
  for (const child of group.children) {
    const mesh = child as LineSegments2;
    mesh.geometry.dispose();
    const material = mesh.material as LineMaterial;
    registry.delete(material);
    material.dispose();
  }
}

/** A tilted ring around the globe, with a light running along it. */
function buildOrbit(radius: number, tilt: number, yaw: number) {
  const points: THREE.Vector3[] = [];
  const SEGMENTS = 220;
  for (let i = 0; i <= SEGMENTS; i++) {
    const a = (i / SEGMENTS) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  const ring = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({
      color: new THREE.Color(ACCENT),
      transparent: true,
      opacity: 0.22,
    })
  );
  ring.rotation.x = tilt;
  ring.rotation.y = yaw;

  const bead = new THREE.Mesh(
    new THREE.SphereGeometry(0.012, 12, 12),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(ACCENT) })
  );
  ring.add(bead);

  return { ring, bead, radius };
}

interface Props {
  economyYear: EconomyYear;
  metric: EconomyMetricId;
  selectedCountry: string | null;
  onCountryClick: (name: string) => void;
  /** Show the photography instead of the choropleth. */
  satellite?: boolean;
}

export function EconomyGlobe({
  economyYear,
  metric,
  selectedCountry,
  onCountryClick,
  satellite = false,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  const byNameRef = useRef<Map<string, GeoJSON.Feature>>(new Map());
  const baseMapRef = useRef<HTMLCanvasElement | null>(null);
  const satelliteMapRef = useRef<HTMLCanvasElement | null>(null);
  const geojsonRef = useRef<GeoJSON.FeatureCollection | null>(null);
  const imageryRef = useRef<HTMLImageElement | null>(null);
  /** The live uniform, so the terrain blend can be switched off in place. */
  const terrainAmountRef = useRef<{ value: number } | null>(null);
  const fillCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const pickRef = useRef<PickMap | null>(null);
  const globeRef = useRef<THREE.Group | null>(null);
  const outlineRef = useRef<THREE.Group | null>(null);
  const hoverRef = useRef<THREE.Group | null>(null);
  /** Screen-width lines need the viewport size; it changes, they must follow. */
  const resolutionRef = useRef<THREE.Vector2>(new THREE.Vector2(1, 1));
  const lineMatsRef = useRef<Set<LineMaterial>>(new Set());
  const onClickRef = useRef(onCountryClick);
  const documentedRef = useRef<Set<string>>(new Set());

  onClickRef.current = onCountryClick;
  documentedRef.current = new Set(Object.keys(economyYear.countries));

  /* ── Repaint: base blit, then the countries carrying a value ──────────── */
  useEffect(() => {
    if (satellite && !satelliteMapRef.current && geojsonRef.current) {
      satelliteMapRef.current = buildSatelliteMap(geojsonRef.current, imageryRef.current);
    }
    const base = satellite ? satelliteMapRef.current : baseMapRef.current;
    const canvas = fillCanvasRef.current;
    const texture = textureRef.current;
    const byName = byNameRef.current;
    if (!base || !canvas || !texture) return;

    // The photography carries its own colour; folding the imagery into it a
    // second time would only wash it out.
    if (terrainAmountRef.current) {
      terrainAmountRef.current.value = satellite ? 0 : TERRAIN_AMOUNT;
    }

    // Coalesced to one frame, so dragging the year rail cannot queue repaints.
    const handle = requestAnimationFrame(() => {
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(base, 0, 0);

      const maxValue = getMaxMetricValue(economyYear.countries, metric);

      // Over the photography the class colour is a wash, not a fill: light
      // enough that the ground stays readable, strong enough that two
      // countries can still be told apart — the flat satellite map's bargain.
      if (satellite) {
        ctx.save();
        ctx.globalAlpha = SATELLITE_TINT;
        for (const name of Object.keys(economyYear.countries)) {
          const feat = byName.get(name);
          if (!feat) continue;
          const fill = getCountryFillColorEconomy(name, economyYear.countries, maxValue, metric);
          if (fill === "#EBEBEB") continue;
          ctx.fillStyle = fill;
          traceFeature(ctx, feat, TEXTURE_W, TEXTURE_H);
          ctx.fill("evenodd");
        }
        ctx.restore();

        // Restated over the wash, which would otherwise soften them.
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = BORDER_WIDTH * 0.62;
        ctx.lineJoin = "round";
        for (const feat of geojsonRef.current?.features ?? []) {
          traceFeature(ctx, feat, TEXTURE_W, TEXTURE_H);
          ctx.stroke();
        }

        texture.needsUpdate = true;
        return;
      }

      for (const name of Object.keys(economyYear.countries)) {
        const feat = byName.get(name);
        if (!feat) continue;
        const fill = getCountryFillColorEconomy(name, economyYear.countries, maxValue, metric);
        // The flat map's "no value" grey would punch a hole in the ocean here.
        if (fill === "#EBEBEB") continue;
        ctx.fillStyle = fill;
        traceFeature(ctx, feat, TEXTURE_W, TEXTURE_H);
        ctx.fill("evenodd");
        ctx.strokeStyle = BORDER;
        ctx.lineWidth = BORDER_WIDTH;
        ctx.stroke();
      }

      texture.needsUpdate = true;
    });
    return () => cancelAnimationFrame(handle);
  }, [economyYear, metric, ready, satellite]);

  /* ── Selection: an outline in 3D, so picking never repaints the map ───── */
  useEffect(() => {
    const globe = globeRef.current;
    const byName = byNameRef.current;
    if (!globe) return;

    disposeOutline(outlineRef.current, lineMatsRef.current);
    outlineRef.current = null;
    if (!selectedCountry) return;

    const feat = byName.get(selectedCountry);
    if (!feat) return;

    const outline = buildOutline(
      feat,
      RADIUS + PLATEAU_TOP,
      new THREE.Color(ACCENT).getHex(),
      // The same stroke a hover leaves, only held: a selection should read as
      // the hover staying put, not as a heavier ring standing off the globe.
      [{ width: 2.4, opacity: 1 }],
      resolutionRef.current,
      lineMatsRef.current
    );
    if (!outline) return;
    globe.add(outline);
    outlineRef.current = outline;
  }, [selectedCountry, ready]);

  /* ── Scene ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 0.1, 100);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    chooseTextureSize(renderer);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.style.touchAction = "none";

    const globe = new THREE.Group();
    globe.rotation.x = 0.26;
    globe.rotation.y = 1.4;
    scene.add(globe);
    globeRef.current = globe;

    const fillCanvas = document.createElement("canvas");
    fillCanvas.width = TEXTURE_W;
    fillCanvas.height = TEXTURE_H;
    fillCanvasRef.current = fillCanvas;

    const texture = new THREE.CanvasTexture(fillCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    textureRef.current = texture;

    // Almost entirely ambient: the map has to read at its own brightness, so
    // the light is there to let the elevation map raise the continents and
    // for nothing else. A key light strong enough to model a sphere would lay
    // a terminator across a choropleth and darken the very countries being
    // compared — and the whole map would read as sitting under a filter.
    scene.add(new THREE.AmbientLight(0xffffff, 2.32));
    // Two lights, both weak: one over the reader's shoulder to keep the map
    // even, one grazing from the side so the raised coastlines catch a lit
    // edge and cast a shaded one. Between them they model the relief without
    // laying a terminator across the choropleth.
    const key = new THREE.DirectionalLight(0xffffff, 0.86);
    key.position.set(-1.5, 1.5, 0.75);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.2);
    fill.position.set(1.4, -0.6, 2.4);
    scene.add(fill);

    // Lambert, not Phong: no specular term, so nothing lays a sheen over the
    // greens.
    const material = new THREE.MeshLambertMaterial({ map: texture });

    // The satellite imagery is folded into the map in the shader rather than
    // painted into the texture: a country keeps the colour of its class and
    // gains the terrain's own texture — the Sahara reads as sand, Siberia as
    // taiga, the Alps as ridges — at no cost when the year or the metric
    // changes. Soft light because it modulates lightness around what is
    // already there instead of replacing it: the classes stay apart.
    //
    // The uniform objects are created here and handed to the shader as they
    // are, so filling them in once the rasters land reaches the live program.
    const terrainUniforms = {
      uTerrain: { value: null as THREE.Texture | null },
      uTerrainMask: { value: null as THREE.Texture | null },
      uTerrainAmount: { value: 0 },
    };
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, terrainUniforms);
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
           uniform sampler2D uTerrain;
           uniform sampler2D uTerrainMask;
           uniform float uTerrainAmount;`
        )
        .replace(
          "#include <map_fragment>",
          // The chunk is expanded here rather than left as an include, because
          // three resolves includes after this hook runs — a bias written
          // against the include's text would never find it.
          `${SHARPENED_MAP_FRAGMENT}
           if (uTerrainAmount > 0.0) {
             float lum = dot(texture2D(uTerrain, vMapUv).rgb, vec3(0.2126, 0.7152, 0.0722));
             float onLand = smoothstep(0.3, 0.58, texture2D(uTerrainMask, vMapUv).r);
             vec3 b = diffuseColor.rgb;
             // Centred on the imagery's own average rather than on mid-grey:
             // the land is darker than mid-grey almost everywhere, so an
             // uncentred soft light would crush the top of the ramp into
             // black and cost the reader the classes it is there to show.
             vec3 s = vec3(clamp(0.5 + (lum - 0.34) * 1.2, 0.0, 1.0));
             vec3 soft = mix(
               2.0 * b * s + b * b * (1.0 - 2.0 * s),
               sqrt(b) * (2.0 * s - 1.0) + 2.0 * b * (1.0 - s),
               step(0.5, s)
             );
             diffuseColor.rgb = mix(b, soft, uTerrainAmount * onLand);
           }`
        );
    };

    // Enough segments that a country's outline survives the displacement —
    // below this the raised edge follows the mesh rather than the coast, and
    // the relief has to be faked in the shading, which is what leaves a globe
    // looking soft rather than modelled.
    const earth = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, 768, 384), material);
    // SphereGeometry lays its UVs out with x and z inverted relative to the
    // lon/lat convention the texture, the outlines and the hit test all use.
    earth.rotation.y = Math.PI;
    globe.add(earth);

    const orbits = [buildOrbit(1.34, 1.16, 0.35), buildOrbit(1.26, -0.98, 1.9)];
    for (const o of orbits) scene.add(o.ring);

    // Distance is derived from the box rather than fixed: the sphere is framed
    // by whichever of the two axes is tighter, so its whole circumference is
    // always inside the frame with an even margin, at any aspect ratio.
    const MARGIN = 1.18;
    let baseDistance = 3.5;
    let zoom = 1;
    const ZOOM_MIN = 1;
    // Capped where the texture still has texels to spare: past this the map
    // stops gaining detail and only gains blur.
    const ZOOM_MAX = ZOOM_CEILING;
    /**
     * How far in the camera itself is allowed to come.
     *
     * Zooming by moving closer stops working before the zoom ceiling does: at
     * the far end the camera would pass inside the sphere and the globe would
     * simply vanish. Up to here the camera moves in; past it, it stays put and
     * the field of view narrows instead — which is what a map does anyway.
     */
    const DOLLY_MAX = 2.2;

    const applyCamera = () => {
      const dolly = Math.min(zoom, DOLLY_MAX);
      camera.position.z = (baseDistance * MARGIN) / dolly;
      // A projection scales with 1 / tan(fov / 2): narrowing the field by this
      // much magnifies by exactly the zoom the dolly did not deliver.
      camera.fov =
        (2 * Math.atan(Math.tan((BASE_FOV * Math.PI) / 360) * (dolly / zoom)) * 180) / Math.PI;
      camera.updateProjectionMatrix();
    };

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      resolutionRef.current.set(width, height);
      for (const mat of lineMatsRef.current) mat.resolution.copy(resolutionRef.current);

      // Framed from the base field of view, never the narrowed one: the
      // resting distance must not follow the zoom.
      const vFov = (BASE_FOV * Math.PI) / 180;
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
      baseDistance = RADIUS / Math.sin(Math.min(vFov, hFov) / 2);
      applyCamera();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let cancelled = false;

    /** A raster, or null if it will not come — the globe is drawn either way. */
    const loadImage = (src: string): Promise<HTMLImageElement | null> =>
      new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

    Promise.all([
      fetch("/geo/ne_50m_countries.geojson").then((r) => r.json()),
      loadImage(TOPOLOGY),
      loadImage(IMAGERY),
    ])
      .then(([geojson, topo, imagery]: [GeoJSON.FeatureCollection, HTMLImageElement | null, HTMLImageElement | null]) => {
        if (cancelled) return;

        const byName = new Map<string, GeoJSON.Feature>();
        for (const feat of geojson.features) {
          const name = feat.properties?.name as string | undefined;
          if (name) byName.set(name, feat);
        }
        byNameRef.current = byName;

        baseMapRef.current = buildBaseMap(geojson);
        pickRef.current = buildPickMap(geojson);
        // The satellite base is a second full-size canvas with every border
        // stroked onto it. Built the first time it is asked for rather than on
        // every mount, so the editorial globe pays nothing for a mode it does
        // not use.
        geojsonRef.current = geojson;
        imageryRef.current = imagery;

        // The same height field drives the geometry and its shading: the land
        // is pushed out along the normal, and the wall it now stands on is lit
        // from the field's own slope.
        const relief = new THREE.CanvasTexture(buildReliefMap(geojson, topo));
        relief.colorSpace = THREE.NoColorSpace;
        relief.anisotropy = renderer.capabilities.getMaxAnisotropy();
        material.displacementMap = relief;
        material.displacementScale = RELIEF_SCALE;

        // The light is shaded from its own surface, not from the field that
        // lifts the land: the sea can have a floor and a swell without the
        // ocean itself rising off sea level.
        const shading = new THREE.CanvasTexture(buildShadingMap(geojson, topo));
        shading.colorSpace = THREE.NoColorSpace;
        shading.anisotropy = renderer.capabilities.getMaxAnisotropy();
        material.bumpMap = shading;
        material.bumpScale = BUMP_SCALE;

        if (imagery) {
          const terrain = new THREE.Texture(imagery);
          terrain.colorSpace = THREE.SRGBColorSpace;
          terrain.anisotropy = renderer.capabilities.getMaxAnisotropy();
          terrain.needsUpdate = true;
          terrainUniforms.uTerrain.value = terrain;
          terrainUniforms.uTerrainMask.value = relief;
          terrainUniforms.uTerrainAmount.value = TERRAIN_AMOUNT;
        }
        terrainAmountRef.current = terrainUniforms.uTerrainAmount;
        material.needsUpdate = true;

        fillCanvas.getContext("2d")!.drawImage(baseMapRef.current, 0, 0);
        texture.needsUpdate = true;
        setReady(true);
      })
      .catch(() => {
        /* The globe stays empty; the flat map is one click away. */
      });

    /* ── Turning ────────────────────────────────────────────────────────── */
    let dragging = false;
    let prevX = 0;
    let prevY = 0;
    let startX = 0;
    let startY = 0;
    let spin = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      prevX = startX = e.clientX;
      prevY = startY = e.clientY;
      spin = 0;
      renderer.domElement.style.cursor = "grabbing";
      renderer.domElement.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;
      globe.rotation.y += dx * 0.0062;
      globe.rotation.x = Math.max(-0.85, Math.min(0.85, globe.rotation.x + dy * 0.0034));
      spin = dx * 0.0062;
    };

    const hitTest = (clientX: number, clientY: number): string | null => {
      const pick = pickRef.current;
      if (!pick) return null;

      const rect = mount.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(ndc, camera);
      const point = new THREE.Vector3();
      if (!raycaster.ray.intersectSphere(new THREE.Sphere(new THREE.Vector3(), RADIUS), point)) {
        return null;
      }
      point.applyQuaternion(new THREE.Quaternion().setFromEuler(globe.rotation).invert());

      const lat = 90 - (Math.acos(Math.max(-1, Math.min(1, point.y / RADIUS))) * 180) / Math.PI;
      let theta = Math.atan2(-point.z, point.x);
      if (theta < 0) theta += 2 * Math.PI;
      const lon = theta * (180 / Math.PI) - 180;

      return countryAt(pick, lat, lon);
    };

    const onUp = (e: PointerEvent) => {
      const moved = Math.hypot(e.clientX - startX, e.clientY - startY);
      dragging = false;
      renderer.domElement.style.cursor = "grab";
      if (moved > 5) return;
      // A click leaves no residual spin: the globe must not lurch the moment a
      // country is selected.
      spin = 0;
      const name = hitTest(e.clientX, e.clientY);
      if (name && documentedRef.current.has(name)) onClickRef.current(name);
    };

    let hoveredName: string | null = null;

    const clearHover = () => {
      disposeOutline(hoverRef.current, lineMatsRef.current);
      hoverRef.current = null;
    };

    const onHover = (e: PointerEvent) => {
      if (dragging) return;
      const name = hitTest(e.clientX, e.clientY);
      const live = name && documentedRef.current.has(name) ? name : null;
      renderer.domElement.style.cursor = live ? "pointer" : "grab";

      if (live === hoveredName) return;
      hoveredName = live;
      clearHover();
      if (!live) return;

      // The country's own separation, redrawn in the accent — the same green
      // a click leaves behind, so the hover reads as the beginning of the
      // gesture rather than as a different language. Lifted clear of the
      // raised land, and the fill is never touched: the class colour stands.
      const feat = byNameRef.current.get(live);
      if (!feat) return;
      const outline = buildOutline(
        feat,
        RADIUS + PLATEAU_TOP,
        new THREE.Color(ACCENT).getHex(),
        [{ width: 2.4, opacity: 0.9 }],
        resolutionRef.current,
        lineMatsRef.current
      );
      if (!outline) return;
      globe.add(outline);
      hoverRef.current = outline;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Normalised so a trackpad and a mouse wheel travel at the same rate.
      const step = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) / 320, 0.18);
      zoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoom * (1 - step)));
      applyCamera();
    };

    // Pinch: two pointers, the distance between them drives the same zoom.
    const active = new Map<number, { x: number; y: number }>();
    let pinchStart = 0;
    let pinchZoom = 1;

    const onPinchDown = (e: PointerEvent) => {
      active.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (active.size === 2) {
        const [a, c] = [...active.values()];
        pinchStart = Math.hypot(a.x - c.x, a.y - c.y);
        pinchZoom = zoom;
      }
    };
    const onPinchMove = (e: PointerEvent) => {
      if (!active.has(e.pointerId)) return;
      active.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (active.size !== 2 || pinchStart === 0) return;
      const [a, c] = [...active.values()];
      const d = Math.hypot(a.x - c.x, a.y - c.y);
      zoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, (pinchZoom * d) / pinchStart));
      applyCamera();
    };
    const onPinchUp = (e: PointerEvent) => {
      active.delete(e.pointerId);
      if (active.size < 2) pinchStart = 0;
    };

    const el = renderer.domElement;
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPinchDown);
    el.addEventListener("pointermove", onPinchMove);
    el.addEventListener("pointerup", onPinchUp);
    el.addEventListener("pointercancel", onPinchUp);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointermove", onHover);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    /* ── Loop ───────────────────────────────────────────────────────────── */
    let frame = 0;
    const start = performance.now();
    const tick = () => {
      const t = (performance.now() - start) / 1000;

      if (!dragging) {
        // No idle drift: the globe holds where it was left. What remains here
        // is only the throw of a drag, spending itself.
        globe.rotation.y += spin;
        spin *= 0.955;
        if (Math.abs(spin) < 0.00002) spin = 0;
      }

      // The beads run their rings at their own pace — the only motion on the
      // page that is not the globe itself.
      orbits.forEach((o, i) => {
        const a = t * (0.34 + i * 0.11) + i * 2.1;
        o.bead.position.set(Math.cos(a) * o.radius, 0, Math.sin(a) * o.radius);
      });

      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      ro.disconnect();
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPinchDown);
      el.removeEventListener("pointermove", onPinchMove);
      el.removeEventListener("pointerup", onPinchUp);
      el.removeEventListener("pointercancel", onPinchUp);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointermove", onHover);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Line || o instanceof THREE.LineSegments) {
          o.geometry.dispose();
          const m = o.material as THREE.Material & { map?: THREE.Texture };
          m.map?.dispose();
          m.dispose();
        }
      });
      renderer.dispose();
      if (el.parentNode === mount) mount.removeChild(el);
      lineMatsRef.current.clear();
      globeRef.current = null;
      outlineRef.current = null;
      hoverRef.current = null;
      textureRef.current = null;
      fillCanvasRef.current = null;
      baseMapRef.current = null;
      satelliteMapRef.current = null;
      geojsonRef.current = null;
      imageryRef.current = null;
      terrainAmountRef.current = null;
      pickRef.current = null;
    };
  }, []);

  return (
    <div
      className="relative w-full"
      // The wheel and the finger belong to the globe here — zoom and rotation,
      // never the page moving on to the next section.
      data-scroll-region
      style={{ aspectRatio: "16/9", minHeight: 320, height: "100%" }}
    >
      <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />
      {!ready && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ color: "var(--ink-4)", fontSize: "0.72rem" }}
        >
          Chargement du globe…
        </div>
      )}
      <div
        className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg"
        style={{
          background: "rgba(255,255,255,0.93)",
          border: "1px solid var(--border)",
          color: "var(--ink-4)",
          fontSize: "0.62rem",
          pointerEvents: "none",
        }}
      >
        Faites tourner le globe · molette pour zoomer · cliquez sur un pays
      </div>
    </div>
  );
}

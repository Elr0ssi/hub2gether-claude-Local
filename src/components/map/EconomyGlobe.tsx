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
const TEXTURE_W = 4096;
const TEXTURE_H = 2048;
const PICK_W = 2048;
const PICK_H = 1024;

/** Brand palette. Deep enough that the ramp's own greens read against it. */
const OCEAN_DEEP = "#0E3B4E";
const OCEAN_MID = "#12506A";
const OCEAN_SHELF = "#1A6B84";
const LAND_NO_DATA = "#2C5F4A";
/** Borders have to survive two neighbouring greens a class apart. */
const BORDER = "rgba(255,255,255,0.82)";
const BORDER_WIDTH = 3.2;
const GRATICULE = "rgba(255,255,255,0.09)";
const ACCENT = "#39FF88";
/** Grayscale elevation, used as a bump map — relief without photorealism. */
const TOPOLOGY = "/geo/earth-topology.png";

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

  // A soft dark halo under the coastlines: the continents read as sitting on
  // the water rather than being cut out of it.
  ctx.save();
  ctx.shadowColor = "rgba(2,20,28,0.75)";
  ctx.shadowBlur = 14;
  ctx.fillStyle = LAND_NO_DATA;
  for (const feat of geojson.features) {
    traceFeature(ctx, feat, TEXTURE_W, TEXTURE_H);
    ctx.fill("evenodd");
  }
  ctx.restore();

  ctx.strokeStyle = BORDER;
  ctx.lineWidth = BORDER_WIDTH;
  ctx.lineJoin = "round";
  for (const feat of geojson.features) {
    traceFeature(ctx, feat, TEXTURE_W, TEXTURE_H);
    ctx.stroke();
  }

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

/** Rim light — the halo the sphere is set into. */
function haloMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color(ACCENT) } },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float rim = 1.0 - abs(dot(vNormal, vView));
        gl_FragColor = vec4(uColor, pow(rim, 3.0) * 0.42);
      }
    `,
  });
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
}

export function EconomyGlobe({
  economyYear,
  metric,
  selectedCountry,
  onCountryClick,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  const byNameRef = useRef<Map<string, GeoJSON.Feature>>(new Map());
  const baseMapRef = useRef<HTMLCanvasElement | null>(null);
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
    const base = baseMapRef.current;
    const canvas = fillCanvasRef.current;
    const texture = textureRef.current;
    const byName = byNameRef.current;
    if (!base || !canvas || !texture) return;

    // Coalesced to one frame, so dragging the year rail cannot queue repaints.
    const handle = requestAnimationFrame(() => {
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(base, 0, 0);

      const maxValue = getMaxMetricValue(economyYear.countries, metric);
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
  }, [economyYear, metric, ready]);

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
      RADIUS * 1.006,
      new THREE.Color(ACCENT).getHex(),
      [
        { width: 6, opacity: 0.24 },
        { width: 2.6, opacity: 1 },
      ],
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
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

    // Ambient-dominant lighting: enough for the elevation map to raise the
    // continents and dimple the sea floor, not enough to lay a terminator
    // across a choropleth and darken the very countries being compared.
    scene.add(new THREE.AmbientLight(0xffffff, 1.62));
    const key = new THREE.DirectionalLight(0xffffff, 0.42);
    key.position.set(-1.2, 1.1, 2.6);
    scene.add(key);

    const material = new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 6,
      specular: new THREE.Color(0x0f2f28),
    });
    new THREE.TextureLoader().load(TOPOLOGY, (topo) => {
      topo.colorSpace = THREE.NoColorSpace;
      material.bumpMap = topo;
      material.bumpScale = 3.4;
      material.needsUpdate = true;
    });

    const earth = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, 160, 96), material);
    // SphereGeometry lays its UVs out with x and z inverted relative to the
    // lon/lat convention the texture, the outlines and the hit test all use.
    earth.rotation.y = Math.PI;
    globe.add(earth);

    const halo = new THREE.Mesh(new THREE.SphereGeometry(RADIUS * 1.06, 64, 48), haloMaterial());
    scene.add(halo);

    const orbits = [buildOrbit(1.34, 1.16, 0.35), buildOrbit(1.26, -0.98, 1.9)];
    for (const o of orbits) scene.add(o.ring);

    // Distance is derived from the box rather than fixed: the sphere is framed
    // by whichever of the two axes is tighter, so its whole circumference is
    // always inside the frame with an even margin, at any aspect ratio.
    const MARGIN = 1.18;
    let baseDistance = 3.5;
    let zoom = 1;
    const ZOOM_MIN = 1;
    // Capped where the 4096-wide texture still has texels to spare: past this
    // the map stops gaining detail and only gains blur.
    const ZOOM_MAX = 2.4;

    const applyCamera = () => {
      camera.position.z = (baseDistance * MARGIN) / zoom;
      camera.updateProjectionMatrix();
    };

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      resolutionRef.current.set(width, height);
      for (const mat of lineMatsRef.current) mat.resolution.copy(resolutionRef.current);

      const vFov = (camera.fov * Math.PI) / 180;
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
      baseDistance = RADIUS / Math.sin(Math.min(vFov, hFov) / 2);
      applyCamera();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let cancelled = false;
    fetch("/geo/ne_50m_countries.geojson")
      .then((r) => r.json())
      .then((geojson: GeoJSON.FeatureCollection) => {
        if (cancelled) return;

        const byName = new Map<string, GeoJSON.Feature>();
        for (const feat of geojson.features) {
          const name = feat.properties?.name as string | undefined;
          if (name) byName.set(name, feat);
        }
        byNameRef.current = byName;

        baseMapRef.current = buildBaseMap(geojson);
        pickRef.current = buildPickMap(geojson);

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

      // A thick white border and a soft white glow just off the surface. The
      // country keeps its own class colour — the outline is what says "this
      // one", never a recolour that would misreport its value.
      const feat = byNameRef.current.get(live);
      if (!feat) return;
      const outline = buildOutline(
        feat,
        RADIUS * 1.009,
        0xffffff,
        [
          { width: 7, opacity: 0.17 },
          { width: 3, opacity: 0.95 },
        ],
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
        globe.rotation.y += 0.00042 + spin;
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

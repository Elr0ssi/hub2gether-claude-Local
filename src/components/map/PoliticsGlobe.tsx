"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { PoliticalPeriod } from "@/data/politics/politics";
import { getCountryFillColorPolitics } from "@/lib/politicsColors";

/* ═══════════════════════════════════════════════════════════════════════════
   POLITICS GLOBE
   A sphere seen from orbit, carrying the same reading as the flat map: one
   colour per political orientation, one country per click.

   Three things decide whether it feels real rather than diagrammatic — the
   shapes are drawn from the 50m Natural Earth outlines rather than the coarse
   110m ones, the sphere is lit rather than flat-shaded, and nothing about the
   frame is allowed to stutter. The last one is the hardest and most of the
   work below is about it: the base map is painted once and cached, only the
   handful of documented countries are repainted when the year changes, the
   selection is a separate outline in 3D rather than a repaint of the texture,
   and a click never disturbs the rotation.
   ═══════════════════════════════════════════════════════════════════════════ */

const RADIUS = 1;
/** Fill texture. At the size the sphere is drawn this is already about twice
 *  oversampled at the equator; four thousand pixels wide only cost repaint
 *  time on every year change without adding anything the eye can see. */
const TEXTURE_W = 2048;
const TEXTURE_H = 1024;
/** Picking resolution — finer than a click can be. */
const PICK_W = 2048;
const PICK_H = 1024;

const LAND_NEUTRAL = "#E8EBE9";
const LAND_STROKE = "rgba(10,20,15,0.20)";
const OCEAN_TOP = "#EAF3F7";
const OCEAN_BOTTOM = "#DCE9EF";

interface PickMap {
  data: Uint8ClampedArray;
  width: number;
  height: number;
  /** id → country name; the id is packed into r,g,b. */
  names: string[];
}

/** Every ring of a feature, as [lon, lat] pairs. */
function ringsOf(feature: GeoJSON.Feature): GeoJSON.Position[][] {
  const geom = feature.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon | null;
  if (!geom) return [];
  return geom.type === "Polygon"
    ? (geom.coordinates as GeoJSON.Position[][])
    : (geom.coordinates as GeoJSON.Position[][][]).flat(1);
}

/** Trace a feature's rings into a 2D context, in equirectangular pixels. */
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
 * The ocean and every landmass in a neutral tone, painted once.
 *
 * Everything a year change needs is a blit of this plus a couple of dozen
 * fills, which is the difference between a scrub of the timeline being smooth
 * and it being a slideshow.
 */
function buildBaseMap(geojson: GeoJSON.FeatureCollection): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_W;
  canvas.height = TEXTURE_H;
  const ctx = canvas.getContext("2d")!;

  const ocean = ctx.createLinearGradient(0, 0, 0, TEXTURE_H);
  ocean.addColorStop(0, OCEAN_TOP);
  ocean.addColorStop(0.5, OCEAN_BOTTOM);
  ocean.addColorStop(1, OCEAN_TOP);
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, TEXTURE_W, TEXTURE_H);

  ctx.fillStyle = LAND_NEUTRAL;
  ctx.strokeStyle = LAND_STROKE;
  ctx.lineWidth = 0.9;
  ctx.lineJoin = "round";

  for (const feat of geojson.features) {
    traceFeature(ctx, feat, TEXTURE_W, TEXTURE_H);
    ctx.fill("evenodd");
    ctx.stroke();
  }

  return canvas;
}

/** One flat colour per country, never displayed — the click resolver. */
function buildPickMap(geojson: GeoJSON.FeatureCollection): PickMap {
  const canvas = document.createElement("canvas");
  canvas.width = PICK_W;
  canvas.height = PICK_H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.imageSmoothingEnabled = false;

  // id 0 means "no country here", so names[0] is never read.
  const names: string[] = [""];

  for (const feat of geojson.features) {
    const name = feat.properties?.name as string | undefined;
    if (!name) continue;
    const id = names.length;
    names.push(name);
    // 24 bits, against ~231 countries: ids survive the canvas round trip exactly.
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

/** Rim light: a shell lit only where it turns away from the camera. */
function atmosphereMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.NormalBlending,
    uniforms: { uColor: { value: new THREE.Color("#8FD3B4") } },
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
        float a = pow(rim, 3.2) * 0.55;
        gl_FragColor = vec4(uColor, a);
      }
    `,
  });
}

interface Props {
  politicsData: Record<string, PoliticalPeriod>;
  selectedCountry: string | null;
  onCountryClick: (name: string) => void;
  /** Orientations toggled off in the legend. */
  hiddenOrientations?: ReadonlySet<string>;
}

export function PoliticsGlobe({
  politicsData,
  selectedCountry,
  onCountryClick,
  hiddenOrientations,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // Everything the render loop needs from outside, in refs: the scene is
  // built exactly once, and a React render never disturbs it.
  const geojsonRef = useRef<GeoJSON.FeatureCollection | null>(null);
  const byNameRef = useRef<Map<string, GeoJSON.Feature>>(new Map());
  const baseMapRef = useRef<HTMLCanvasElement | null>(null);
  const fillCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const pickRef = useRef<PickMap | null>(null);
  const globeRef = useRef<THREE.Group | null>(null);
  const outlineRef = useRef<THREE.LineSegments | null>(null);
  const onClickRef = useRef(onCountryClick);
  /** Countries the selected year actually documents. */
  const documentedRef = useRef<Set<string>>(new Set());

  onClickRef.current = onCountryClick;
  documentedRef.current = new Set(Object.keys(politicsData));

  /* ── Repaint: base blit, then only the documented countries ───────────── */
  useEffect(() => {
    const base = baseMapRef.current;
    const canvas = fillCanvasRef.current;
    const texture = textureRef.current;
    const byName = byNameRef.current;
    if (!base || !canvas || !texture) return;

    // Coalesced to one frame. Dragging the year slider fires a change per
    // pixel of travel; without this the globe would repaint a four-megapixel
    // texture for each of them and the scrub would judder.
    const handle = requestAnimationFrame(() => repaint());
    return () => cancelAnimationFrame(handle);

    function repaint() {
    const ctx = canvas!.getContext("2d")!;
    ctx.drawImage(base!, 0, 0);

    const hidden = hiddenOrientations ?? new Set<string>();
    for (const [name, period] of Object.entries(politicsData)) {
      if (hidden.has(period.orientation)) continue;
      const feat = byName.get(name);
      if (!feat) continue;
      ctx.fillStyle = getCountryFillColorPolitics(name, politicsData);
      traceFeature(ctx, feat, TEXTURE_W, TEXTURE_H);
      ctx.fill("evenodd");
      ctx.strokeStyle = "rgba(10,20,15,0.28)";
      ctx.lineWidth = 0.9;
      ctx.stroke();
    }

    // Reusing the same canvas and texture: allocating a new CanvasTexture on
    // every year meant a fresh upload and a collection, which is what the
    // globe was hitching on.
    texture!.needsUpdate = true;
    }
  }, [politicsData, hiddenOrientations, ready]);

  /* ── Selection: an outline in 3D, so picking never repaints the map ───── */
  useEffect(() => {
    const globe = globeRef.current;
    const byName = byNameRef.current;
    if (!globe) return;

    if (outlineRef.current) {
      globe.remove(outlineRef.current);
      outlineRef.current.geometry.dispose();
      (outlineRef.current.material as THREE.Material).dispose();
      outlineRef.current = null;
    }
    if (!selectedCountry) return;

    const feat = byName.get(selectedCountry);
    if (!feat) return;

    const verts: number[] = [];
    for (const ring of ringsOf(feat)) {
      for (let i = 0; i < ring.length - 1; i++) {
        for (const [lon, lat] of [ring[i], ring[i + 1]]) {
          const phi = ((90 - lat) * Math.PI) / 180;
          const theta = ((lon + 180) * Math.PI) / 180;
          const r = RADIUS * 1.006;
          verts.push(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi),
            -r * Math.sin(phi) * Math.sin(theta)
          );
        }
      }
    }
    if (verts.length === 0) return;

    const outline = new THREE.LineSegments(
      new THREE.BufferGeometry().setAttribute(
        "position",
        new THREE.Float32BufferAttribute(verts, 3)
      ),
      new THREE.LineBasicMaterial({ color: 0x0a0a0a, transparent: true, opacity: 0.9 })
    );
    globe.add(outline);
    outlineRef.current = outline;
  }, [selectedCountry, ready]);

  /* ── Scene ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.z = 3.35;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.style.touchAction = "none";

    const globe = new THREE.Group();
    // A slight tilt so the sphere reads as a globe, and an opening rotation
    // that puts Europe and Africa in front — most of the documented countries
    // are on that face.
    globe.rotation.x = 0.26;
    globe.rotation.y = 1.4;
    scene.add(globe);
    globeRef.current = globe;

    // Lit rather than flat: a key light gives the sphere its roundness and a
    // terminator, which is most of what separates a globe from a disc.
    scene.add(new THREE.AmbientLight(0xffffff, 1.42));
    const key = new THREE.DirectionalLight(0xffffff, 0.62);
    key.position.set(-1.5, 0.8, 2.4);
    scene.add(key);

    const fillCanvas = document.createElement("canvas");
    fillCanvas.width = TEXTURE_W;
    fillCanvas.height = TEXTURE_H;
    fillCanvasRef.current = fillCanvas;

    const texture = new THREE.CanvasTexture(fillCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    textureRef.current = texture;

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 160, 96),
      new THREE.MeshLambertMaterial({ map: texture })
    );
    // SphereGeometry lays its UVs out with x and z inverted relative to the
    // lon/lat convention the texture, the outlines and the hit test all use.
    earth.rotation.y = Math.PI;
    globe.add(earth);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 1.045, 64, 48),
      atmosphereMaterial()
    );
    scene.add(atmosphere);

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    /* ── World file ─────────────────────────────────────────────────────── */
    let cancelled = false;
    fetch("/geo/ne_50m_countries.geojson")
      .then((r) => r.json())
      .then((geojson: GeoJSON.FeatureCollection) => {
        if (cancelled) return;
        geojsonRef.current = geojson;

        const byName = new Map<string, GeoJSON.Feature>();
        for (const feat of geojson.features) {
          const name = feat.properties?.name as string | undefined;
          if (name) byName.set(name, feat);
        }
        byNameRef.current = byName;

        baseMapRef.current = buildBaseMap(geojson);
        pickRef.current = buildPickMap(geojson);

        // First paint; the effects above take over from here.
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
      // Clamped so the globe can never roll past its own poles.
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

      // Back into the geojson frame: undo the globe's own rotation.
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

      if (moved > 5) return; // a turn, not a click
      // A click leaves no residual spin: the globe must not lurch under the
      // finger the moment a country is selected.
      spin = 0;
      const name = hitTest(e.clientX, e.clientY);
      // Countries the selected year does not document stay inert, as they do
      // on the flat map — the side panel would have nothing to show.
      if (name && documentedRef.current.has(name)) onClickRef.current(name);
    };

    const onHover = (e: PointerEvent) => {
      if (dragging) return;
      const name = hitTest(e.clientX, e.clientY);
      renderer.domElement.style.cursor =
        name && documentedRef.current.has(name) ? "pointer" : "grab";
    };

    const el = renderer.domElement;
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointermove", onHover);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    /* ── Loop ───────────────────────────────────────────────────────────── */
    let frame = 0;
    const tick = () => {
      if (!dragging) {
        // A slow orbit, plus whatever spin the last turn left behind.
        globe.rotation.y += 0.00042 + spin;
        spin *= 0.955;
        if (Math.abs(spin) < 0.00002) spin = 0;
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      ro.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointermove", onHover);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.LineSegments) {
          o.geometry.dispose();
          const m = o.material as THREE.Material & { map?: THREE.Texture };
          m.map?.dispose();
          m.dispose();
        }
      });
      renderer.dispose();
      if (el.parentNode === mount) mount.removeChild(el);
      globeRef.current = null;
      outlineRef.current = null;
      textureRef.current = null;
      fillCanvasRef.current = null;
      baseMapRef.current = null;
      geojsonRef.current = null;
      pickRef.current = null;
    };
  }, []);

  return (
    <div
      className="relative w-full"
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
        Faites tourner le globe · cliquez sur un pays
      </div>
    </div>
  );
}

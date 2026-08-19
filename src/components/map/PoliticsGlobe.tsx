"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { PoliticalPeriod } from "@/data/politics/politics";
import { getCountryFillColorPolitics } from "@/lib/politicsColors";

/* ═══════════════════════════════════════════════════════════════════════════
   POLITICS GLOBE
   A clickable sphere carrying the same reading as the flat map: one colour
   per political orientation, one country per click.

   Why not GlobeCanvas — it reads `properties.NAME`, `LABEL_X` and `LABEL_Y`,
   none of which exist in the world file this project ships (`properties.name`
   and geometry only). Its fills therefore never paint and its click
   resolution has no centroids to match against. Rather than change a
   component the legacy home still mounts, the geometry work is redone here
   against the file as it actually is, with the two things the flat map has
   and a globe needs: categorical colour and a hit test.
   ═══════════════════════════════════════════════════════════════════════════ */

const RADIUS = 1;
const TEXTURE_W = 2048;
const TEXTURE_H = 1024;
/** Picking resolution — half a degree per pixel is finer than any click. */
const PICK_W = 1440;
const PICK_H = 720;
const NO_DATA_FILL = "#EDEDED";
const OCEAN = "#FAFCFB";

/**
 * Country lookup by pixel.
 *
 * A second, never-displayed painting of the world where each country is
 * filled with a unique flat colour. A click is resolved by converting the
 * point on the sphere to a texture pixel and reading that colour back, so the
 * answer is the country actually under the cursor — borders included — rather
 * than whichever centroid happened to be nearest.
 */
interface PickMap {
  data: Uint8ClampedArray;
  width: number;
  height: number;
  /** id → country name. The id is packed into r,g,b. */
  names: string[];
}

/** Equirectangular paint used only for picking — one flat colour per country. */
function buildPickMap(geojson: GeoJSON.FeatureCollection): PickMap {
  const canvas = document.createElement("canvas");
  canvas.width = PICK_W;
  canvas.height = PICK_H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.imageSmoothingEnabled = false;

  // id 0 is "nothing here", so names[0] is never read.
  const names: string[] = [""];

  for (const feat of geojson.features) {
    const name = feat.properties?.name as string | undefined;
    if (!name) continue;

    const id = names.length;
    names.push(name);
    // 24 bits is far more than the ~180 countries in the file, so ids stay
    // exact through the canvas round trip.
    ctx.fillStyle = `rgb(${(id >> 16) & 0xff},${(id >> 8) & 0xff},${id & 0xff})`;

    const geom = feat.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon | null;
    if (!geom) continue;
    const polygons: GeoJSON.Position[][][] =
      geom.type === "Polygon"
        ? [geom.coordinates as GeoJSON.Position[][]]
        : (geom.coordinates as GeoJSON.Position[][][]);

    for (const polygon of polygons) {
      ctx.beginPath();
      for (const ring of polygon) {
        ring.forEach(([lon, lat], i) => {
          const px = ((lon + 180) / 360) * PICK_W;
          const py = ((90 - lat) / 180) * PICK_H;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
      }
      // evenodd so lakes and enclaves punch through instead of being claimed.
      ctx.fill("evenodd");
    }
  }

  const { data } = ctx.getImageData(0, 0, PICK_W, PICK_H);
  return { data, width: PICK_W, height: PICK_H, names };
}

/** The country at a lat/lon, or null over water. */
function countryAt(pick: PickMap, lat: number, lon: number): string | null {
  const px = Math.floor(((lon + 180) / 360) * pick.width);
  const py = Math.floor(((90 - lat) / 180) * pick.height);
  if (px < 0 || py < 0 || px >= pick.width || py >= pick.height) return null;
  const i = (py * pick.width + px) * 4;
  const id = (pick.data[i] << 16) | (pick.data[i + 1] << 8) | pick.data[i + 2];
  return id > 0 && id < pick.names.length ? pick.names[id] : null;
}

/** Equirectangular paint of every country in its orientation colour. */
function paintFills(
  geojson: GeoJSON.FeatureCollection,
  politicsData: Record<string, PoliticalPeriod>,
  selected: string | null,
  hidden: ReadonlySet<string>
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_W;
  canvas.height = TEXTURE_H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = OCEAN;
  ctx.fillRect(0, 0, TEXTURE_W, TEXTURE_H);

  for (const feat of geojson.features) {
    const name = feat.properties?.name as string | undefined;
    if (!name) continue;

    const period = politicsData[name];
    const orientationHidden = period ? hidden.has(period.orientation) : false;
    ctx.fillStyle = orientationHidden
      ? NO_DATA_FILL
      : period
      ? getCountryFillColorPolitics(name, politicsData)
      : NO_DATA_FILL;

    const geom = feat.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon | null;
    if (!geom) continue;
    const polygons: GeoJSON.Position[][][] =
      geom.type === "Polygon"
        ? [geom.coordinates as GeoJSON.Position[][]]
        : (geom.coordinates as GeoJSON.Position[][][]);

    for (const polygon of polygons) {
      for (const ring of polygon) {
        ctx.beginPath();
        ring.forEach(([lon, lat], i) => {
          const px = ((lon + 180) / 360) * TEXTURE_W;
          const py = ((90 - lat) / 180) * TEXTURE_H;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.fill();
      }

      // The selection is outlined rather than recoloured, so its orientation
      // stays readable while it is picked out.
      if (name === selected) {
        ctx.save();
        ctx.strokeStyle = "#0A0A0A";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        const ring = polygon[0];
        ring?.forEach(([lon, lat], i) => {
          const px = ((lon + 180) / 360) * TEXTURE_W;
          const py = ((90 - lat) / 180) * TEXTURE_H;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  return canvas;
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

  // Everything the render loop needs that changes from the outside, held in
  // refs so the scene is built exactly once.
  const geojsonRef = useRef<GeoJSON.FeatureCollection | null>(null);
  const pickRef = useRef<PickMap | null>(null);
  const fillMeshRef = useRef<THREE.Mesh | null>(null);
  const onClickRef = useRef(onCountryClick);
  const dataRef = useRef(politicsData);
  const selectedRef = useRef(selectedCountry);
  const hiddenRef = useRef<ReadonlySet<string>>(hiddenOrientations ?? new Set());

  onClickRef.current = onCountryClick;

  /* ── Repaint when the year, the selection or the legend changes ───────── */
  useEffect(() => {
    dataRef.current = politicsData;
    selectedRef.current = selectedCountry;
    hiddenRef.current = hiddenOrientations ?? new Set();

    const geo = geojsonRef.current;
    const mesh = fillMeshRef.current;
    if (!geo || !mesh) return;

    const canvas = paintFills(geo, politicsData, selectedCountry, hiddenRef.current);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = mesh.material as THREE.MeshBasicMaterial;
    material.map?.dispose();
    material.map = texture;
    material.needsUpdate = true;
  }, [politicsData, selectedCountry, hiddenOrientations]);

  /* ── Scene ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.z = 3.1;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.cursor = "grab";

    const globe = new THREE.Group();
    // A slight tilt so the sphere reads as a globe and not as a disc, and an
    // opening rotation that puts Europe and Africa in front: most of the
    // documented countries are on that face, so the globe arrives with
    // something to click rather than showing the empty Pacific.
    globe.rotation.x = 0.28;
    globe.rotation.y = 1.4;
    scene.add(globe);

    // Fill sphere — the country colours live on its texture.
    const fillMesh = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 96, 64),
      new THREE.MeshBasicMaterial({ transparent: false })
    );
    // SphereGeometry lays its UVs out with x and z inverted relative to the
    // lon/lat convention the borders, the texture and the hit test all use:
    // without this half turn the painted countries sit on the opposite side of
    // the globe from their own outlines, which reads as two maps at once and
    // makes every click land on the wrong country.
    fillMesh.rotation.y = Math.PI;
    globe.add(fillMesh);
    fillMeshRef.current = fillMesh;

    // A hairline sphere over it, so borders and the terminator read.
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 1.002, 64, 48),
      new THREE.MeshBasicMaterial({
        color: 0x0a140f,
        wireframe: true,
        transparent: true,
        opacity: 0.06,
      })
    );
    globe.add(shell);

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      if (!width || !height) return;
      // `updateStyle` left at its default: without the CSS size the canvas
      // displays at its drawing-buffer size, which the pixel ratio has already
      // doubled — the sphere rendered twice as large as its box.
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    /* ── Country outlines, and the pick map the hit test reads ─────────── */
    let cancelled = false;
    fetch("/geo/ne_110m_admin_0_countries.geojson")
      .then((r) => r.json())
      .then((geojson: GeoJSON.FeatureCollection) => {
        if (cancelled) return;
        geojsonRef.current = geojson;

        const verts: number[] = [];

        for (const feat of geojson.features) {
          const geom = feat.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon | null;
          if (!geom) continue;
          const rings =
            geom.type === "Polygon"
              ? (geom.coordinates as GeoJSON.Position[][])
              : (geom.coordinates as GeoJSON.Position[][][]).flat(1);

          for (const ring of rings) {
            for (let i = 0; i < ring.length - 1; i++) {
              for (const [lon, lat] of [ring[i], ring[i + 1]]) {
                const phi = ((90 - lat) * Math.PI) / 180;
                const theta = ((lon + 180) * Math.PI) / 180;
                const r = RADIUS * 1.003;
                verts.push(
                  r * Math.sin(phi) * Math.cos(theta),
                  r * Math.cos(phi),
                  -r * Math.sin(phi) * Math.sin(theta)
                );
              }
            }
          }
        }

        pickRef.current = buildPickMap(geojson);

        const lines = new THREE.LineSegments(
          new THREE.BufferGeometry().setAttribute(
            "position",
            new THREE.Float32BufferAttribute(verts, 3)
          ),
          new THREE.LineBasicMaterial({ color: 0x0a140f, transparent: true, opacity: 0.26 })
        );
        globe.add(lines);

        const canvas = paintFills(
          geojson,
          dataRef.current,
          selectedRef.current,
          hiddenRef.current
        );
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const material = fillMesh.material as THREE.MeshBasicMaterial;
        material.map = texture;
        material.needsUpdate = true;

        setReady(true);
      })
      .catch(() => {
        /* The globe stays empty; the flat map is one click away. */
      });

    /* ── Drag to turn, with inertia ─────────────────────────────────────── */
    let dragging = false;
    let prevX = 0;
    let prevY = 0;
    let startX = 0;
    let startY = 0;
    let velocity = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      prevX = startX = e.clientX;
      prevY = startY = e.clientY;
      velocity = 0;
      renderer.domElement.style.cursor = "grabbing";
      renderer.domElement.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;
      globe.rotation.y += dx * 0.008;
      // Clamped so the globe can never roll past its own poles.
      globe.rotation.x = Math.max(-0.9, Math.min(0.9, globe.rotation.x + dy * 0.004));
      velocity = dx * 0.008;
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
      point.applyQuaternion(
        new THREE.Quaternion().setFromEuler(globe.rotation).invert()
      );

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
      // A turn is not a click.
      if (moved > 6) return;
      const name = hitTest(e.clientX, e.clientY);
      if (name && dataRef.current[name]) onClickRef.current(name);
    };

    const onHover = (e: PointerEvent) => {
      if (dragging) return;
      const name = hitTest(e.clientX, e.clientY);
      renderer.domElement.style.cursor =
        name && dataRef.current[name] ? "pointer" : "grab";
    };

    const el = renderer.domElement;
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointermove", onHover);
    el.addEventListener("pointerup", onUp);

    /* ── Loop ───────────────────────────────────────────────────────────── */
    let frame = 0;
    const tick = () => {
      if (!dragging) {
        // Idle drift, plus whatever spin the last drag left behind.
        globe.rotation.y += 0.0006 + velocity;
        velocity *= 0.94;
        if (Math.abs(velocity) < 0.00002) velocity = 0;
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
      fillMeshRef.current = null;
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

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { DollarSign, Euro, JapaneseYen, Landmark, BarChart3, Coins, type LucideIcon } from "lucide-react";

const GLOBE_RADIUS = 2.2;
// Sampling budget for a ~500px globe. Larger mounts scale up so continents keep
// the same apparent dot density instead of thinning out.
const DOT_SAMPLES = 9000;
const DOT_SAMPLES_MAX = 46000;
const CAMERA_Z = 7.6;
const MASK_W = 1024;
const MASK_H = 512;
const DEFAULT_ACCENT = "#10B981";

export interface GlobeMarker {
  id: string;
  lat: number;
  lon: number;
  icon: LucideIcon;
}

// Country-anchored icon badges, positioned by real lat/lon so they travel with globe rotation.
const DEFAULT_MARKERS: GlobeMarker[] = [
  { id: "usd", lat: 39, lon: -98, icon: DollarSign }, // United States
  { id: "eur", lat: 50, lon: 12, icon: Euro }, // Europe
  { id: "jpy", lat: 36, lon: 138, icon: JapaneseYen }, // Japan
  { id: "bank", lat: 4, lon: 21, icon: Landmark }, // Central Africa
  { id: "chart", lat: -12, lon: -55, icon: BarChart3 }, // Brazil
  { id: "gold", lat: -1, lon: 118, icon: Coins }, // Indonesia / SE Asia
];

function latLonTo3D(lat: number, lon: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    -r * Math.sin(phi) * Math.sin(theta)
  );
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// Land dots use three tints of the accent so continents read as a gradient
// rather than a flat mass. Derived from the accent instead of hardcoded, which
// is what makes the globe reusable across categories.
function buildDotPalette(accent: string): [number, number, number][] {
  const base = new THREE.Color(accent);
  const white = new THREE.Color(0xffffff);
  return [0.36, 0.17, 0].map((mix) => {
    const c = base.clone().lerp(white, mix);
    return [c.r, c.g, c.b] as [number, number, number];
  });
}

function buildLandMask(geojson: GeoJSON.FeatureCollection): ImageData {
  const canvas = document.createElement("canvas");
  canvas.width = MASK_W;
  canvas.height = MASK_H;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, MASK_W, MASK_H);
  ctx.fillStyle = "#000";

  for (const feat of geojson.features) {
    const geom = feat.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
    if (!geom) continue;
    const polygons: GeoJSON.Position[][][] =
      geom.type === "Polygon"
        ? [geom.coordinates as GeoJSON.Position[][]]
        : (geom.coordinates as GeoJSON.Position[][][]);

    for (const polygon of polygons) {
      for (const ring of polygon) {
        ctx.beginPath();
        let first = true;
        for (const [lon, lat] of ring) {
          const px = ((lon + 180) / 360) * MASK_W;
          const py = ((90 - lat) / 180) * MASK_H;
          if (first) {
            ctx.moveTo(px, py);
            first = false;
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  return ctx.getImageData(0, 0, MASK_W, MASK_H);
}

function isLand(lat: number, lon: number, mask: ImageData): boolean {
  const px = Math.min(MASK_W - 1, Math.max(0, Math.floor(((lon + 180) / 360) * MASK_W)));
  const py = Math.min(MASK_H - 1, Math.max(0, Math.floor(((90 - lat) / 180) * MASK_H)));
  const idx = (py * MASK_W + px) * 4;
  return mask.data[idx] < 128;
}

export interface InteractiveGlobeIconsProps {
  /** Category icon badges anchored to real coordinates. */
  markers?: GlobeMarker[];
  /** Category colour — drives land dots, coastlines, atmosphere and badges. */
  accent?: string;
  /** Badge diameter (any CSS length). */
  markerSize?: string;
  /** Set to false to skip rendering entirely (e.g. once scrolled past). */
  active?: boolean;
}

export default function InteractiveGlobeIcons({
  markers = DEFAULT_MARKERS,
  accent = DEFAULT_ACCENT,
  markerSize = "clamp(38px, 5.2vw, 56px)",
  active = true,
}: InteractiveGlobeIconsProps = {}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const markerElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const markerGlowsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const accentColor = new THREE.Color(accent);
    // Brighter, more saturated sibling of the accent — used for the rim light
    // and the atmosphere halo.
    const glowColor = accentColor.clone();
    const hsl = { h: 0, s: 0, l: 0 };
    glowColor.getHSL(hsl);
    glowColor.setHSL(hsl.h, Math.min(1, hsl.s + 0.16), Math.min(0.66, hsl.l + 0.22));
    const dotPalette = buildDotPalette(accent);

    let W = mount.clientWidth || 500;
    let H = mount.clientHeight || 500;
    // Dots cover a surface, so the budget follows the rendered area rather than
    // the width, and each dot shrinks to keep a constant apparent size.
    const sizeRatio = Math.max(1, W / 500);
    const dotSamples = Math.min(DOT_SAMPLES_MAX, Math.round(DOT_SAMPLES * Math.pow(sizeRatio, 1.7)));
    // Dots stay a touch larger than a pure inverse scale, so continents read as
    // a dense matrix rather than a dusting.
    const dotScale = Math.max(0.72, 1 / Math.sqrt(sizeRatio));

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.z = CAMERA_Z;

    const globeGroup = new THREE.Group();
    // Start with Europe/Africa roughly facing the camera, echoing the reference layout.
    globeGroup.rotation.y = 1.4;
    scene.add(globeGroup);

    // --- Lighting for a soft shaded "ball" look ---
    scene.add(new THREE.AmbientLight(0xffffff, 2.6));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(-4, 5, 6);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(glowColor.getHex(), 0.6);
    fillLight.position.set(3, -4, -2);
    scene.add(fillLight);

    // --- Solid base sphere ---
    const baseGeom = new THREE.SphereGeometry(GLOBE_RADIUS, 96, 96);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xf6f8f7,
      roughness: 0.92,
      metalness: 0.02,
    });
    globeGroup.add(new THREE.Mesh(baseGeom, baseMat));

    // --- Soft outer atmosphere ---
    const atmosGeom = new THREE.SphereGeometry(GLOBE_RADIUS + 0.16, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: glowColor.getHex(),
      transparent: true,
      opacity: 0.06 * Math.min(1, 620 / W),
      side: THREE.BackSide,
    });
    globeGroup.add(new THREE.Mesh(atmosGeom, atmosMat));

    // --- Land dot matrix (filled in once geo data is ready) ---
    const dotsMat = new THREE.PointsMaterial({
      size: 0.032 * dotScale,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const dotsPoints = new THREE.Points(new THREE.BufferGeometry(), dotsMat);
    globeGroup.add(dotsPoints);

    // --- Coastline outline ---
    const borderMat = new THREE.LineBasicMaterial({
      color: accentColor.getHex(),
      transparent: true,
      opacity: 0,
    });
    const borderLines = new THREE.LineSegments(new THREE.BufferGeometry(), borderMat);
    globeGroup.add(borderLines);

    let dotsFadeTarget = 0;
    let bordersFadeTarget = 0;
    let markersReady = false;
    const markerBasePositions = markers.map((m) => latLonTo3D(m.lat, m.lon, GLOBE_RADIUS + 0.02));

    fetch("/geo/ne_110m_admin_0_countries.geojson")
      .then((r) => r.json())
      .then((geojson: GeoJSON.FeatureCollection) => {
        const mask = buildLandMask(geojson);

        // Land-only dot cloud via deterministic golden-spiral sampling.
        const dotPositions: number[] = [];
        const dotColors: number[] = [];
        const golden = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < dotSamples; i++) {
          const y = 1 - (i / (dotSamples - 1)) * 2;
          const rr = Math.sqrt(Math.max(0, 1 - y * y));
          const th = golden * i;
          const x = rr * Math.cos(th);
          const z = rr * Math.sin(th);
          const lat = 90 - (Math.acos(Math.max(-1, Math.min(1, y))) * 180) / Math.PI;
          let thetaRad = Math.atan2(-z, x);
          if (thetaRad < 0) thetaRad += 2 * Math.PI;
          const lon = thetaRad * (180 / Math.PI) - 180;

          if (!isLand(lat, lon, mask)) continue;

          dotPositions.push(GLOBE_RADIUS * 1.006 * x, GLOBE_RADIUS * 1.006 * y, GLOBE_RADIUS * 1.006 * z);

          const rnd = (i * 1.618033) % 1;
          const tint = rnd < 0.45 ? dotPalette[0] : rnd < 0.8 ? dotPalette[1] : dotPalette[2];
          dotColors.push(tint[0], tint[1], tint[2]);
        }

        const dotsGeom = dotsPoints.geometry;
        dotsGeom.setAttribute("position", new THREE.Float32BufferAttribute(dotPositions, 3));
        dotsGeom.setAttribute("color", new THREE.Float32BufferAttribute(dotColors, 3));
        dotsFadeTarget = 0.95;

        // Coastline segments for crisp continent edges.
        const verts: number[] = [];
        for (const feat of geojson.features) {
          const geom = feat.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
          if (!geom) continue;
          const rings =
            geom.type === "Polygon"
              ? (geom.coordinates as GeoJSON.Position[][])
              : (geom.coordinates as GeoJSON.Position[][][]).flat(1);
          for (const ring of rings) {
            for (let i = 1; i < ring.length; i++) {
              const [lon0, lat0] = ring[i - 1];
              const [lon1, lat1] = ring[i];
              if (Math.abs(lon1 - lon0) > 90) continue;
              const p0 = latLonTo3D(lat0, lon0, GLOBE_RADIUS + 0.012);
              const p1 = latLonTo3D(lat1, lon1, GLOBE_RADIUS + 0.012);
              verts.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
            }
          }
        }
        borderLines.geometry.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
        // On a large globe a full-strength coastline turns the sphere into an
        // outline map — let the dot matrix carry it instead.
        bordersFadeTarget = 0.35 * Math.min(1, 640 / W);

        markersReady = true;
      })
      .catch(() => {
        /* silently ignore */
      });

    // --- Drag / rotate interaction ---
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let velX = 0;
    const AUTO_SPEED = prefersReduced ? 0 : 0.0014;

    // ── Le lancer ──────────────────────────────────────────────────────────
    // À l'arrivée, le globe part comme une toupie et perd sa vitesse peu à
    // peu, jusqu'à la dérive de fond. Sans cela il tournait déjà à son rythme
    // de croisière quand le lecteur posait les yeux dessus, et rien ne disait
    // que c'était un objet qu'on manipule. Le surplus décroît d'un facteur
    // constant par image : rapide d'abord, imperceptible au bout de quelques
    // secondes, et jamais un arrêt net.
    const SPIN_LAUNCH = prefersReduced ? 0 : 0.052;
    const SPIN_DECAY = 0.982;
    let launch = SPIN_LAUNCH;

    const onPointerDown = (clientX: number, clientY: number) => {
      isDragging = true;
      prevX = clientX;
      prevY = clientY;
      velX = 0;
      mount.style.cursor = "grabbing";
    };
    const onPointerMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;
      const dx = clientX - prevX;
      const dy = clientY - prevY;
      prevX = clientX;
      prevY = clientY;
      globeGroup.rotation.y += dx * 0.009;
      globeGroup.rotation.x = Math.max(
        -1.1,
        Math.min(1.1, globeGroup.rotation.x + dy * 0.004)
      );
      velX = dx * 0.009;
    };
    const onPointerUp = () => {
      isDragging = false;
      mount.style.cursor = "grab";
    };

    // Badge hover is resolved from the pointer position against each badge's
    // projected centre rather than with pointer events, so hovering an icon
    // never steals the drag gesture from the globe underneath.
    let rect = mount.getBoundingClientRect();
    let pointerX = -9999;
    let pointerY = -9999;
    const hoverFactors = markers.map(() => 0);
    const refreshRect = () => {
      rect = mount.getBoundingClientRect();
    };

    const onMouseDown = (e: MouseEvent) => onPointerDown(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => {
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
      onPointerMove(e.clientX, e.clientY);
    };
    const onMouseLeave = () => {
      pointerX = -9999;
      pointerY = -9999;
    };
    const onMouseUp = () => onPointerUp();
    const onTouchStart = (e: TouchEvent) => onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchEnd = () => onPointerUp();

    mount.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    mount.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", refreshRect, { passive: true });
    window.addEventListener("resize", refreshRect);
    mount.addEventListener("touchstart", onTouchStart, { passive: true });
    mount.addEventListener("touchmove", onTouchMove, { passive: true });
    mount.addEventListener("touchend", onTouchEnd);

    // --- RAF loop ---
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (!activeRef.current) return;

      const t = performance.now();

      if (!isDragging) {
        // Inertia bleeds off, then an almost imperceptible drift keeps the
        // globe alive; the tilt eases back to its resting horizon.
        velX *= 0.94;
        launch *= SPIN_DECAY;
        if (launch < 0.00004) launch = 0;
        globeGroup.rotation.y += AUTO_SPEED + velX + launch;
        globeGroup.rotation.x += (0 - globeGroup.rotation.x) * 0.006;
      }

      dotsMat.opacity += (dotsFadeTarget - dotsMat.opacity) * 0.04;
      borderMat.opacity += (bordersFadeTarget - borderMat.opacity) * 0.04;

      // Project country-anchored markers to screen space each frame.
      if (markersReady) {
        markerBasePositions.forEach((base, i) => {
          const el = markerElsRef.current[i];
          if (!el) return;
          const world = base.clone().applyQuaternion(globeGroup.quaternion);
          const front = world.z / GLOBE_RADIUS;
          const ndc = world.clone().project(camera);
          const x = (ndc.x * 0.5 + 0.5) * W;
          const y = (-ndc.y * 0.5 + 0.5) * H;
          const opacity = smoothstep(-0.32, 0.05, front);

          // Barely-there float, phase-shifted per badge.
          const floatY = prefersReduced ? 0 : Math.sin(t / 2600 + i * 1.7) * 2.6;
          const floatX = prefersReduced ? 0 : Math.cos(t / 3400 + i * 2.3) * 1.6;

          // Hover: only badges facing the camera can be picked up.
          const half = el.offsetWidth / 2 || 24;
          const near =
            opacity > 0.5 &&
            Math.abs(pointerX - x) < half + 4 &&
            Math.abs(pointerY - y) < half + 4;
          hoverFactors[i] += ((near ? 1 : 0) - hoverFactors[i]) * 0.14;
          const h = hoverFactors[i];

          const scale = 0.82 + 0.22 * Math.max(0, front) + 0.07 * h;
          el.style.transform = `translate(-50%, -50%) translate(${x + floatX}px, ${
            y + floatY - 4 * h
          }px) scale(${scale})`;
          el.style.opacity = String(opacity);
          el.style.zIndex = String(Math.round(front * 100) + 100 + Math.round(h * 40));

          const glow = markerGlowsRef.current[i];
          if (glow) glow.style.opacity = String(h);
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      W = w;
      H = h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      refreshRect();
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      mount.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      mount.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", refreshRect);
      window.removeEventListener("resize", refreshRect);
      mount.removeEventListener("touchstart", onTouchStart);
      mount.removeEventListener("touchmove", onTouchMove);
      mount.removeEventListener("touchend", onTouchEnd);
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        if (m.material) {
          const mat = m.material as THREE.Material | THREE.Material[];
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
          else mat.dispose();
        }
      });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
    // `markers` / `accent` are expected to be module-level constants (see
    // src/data/categoryHeroes.ts) so the scene is built once per category.
  }, [markers, accent]);

  return (
    <div
      ref={mountRef}
      style={{ position: "absolute", inset: 0, cursor: "grab" }}
    >
      {markers.map((marker, i) => {
        const Icon = marker.icon;
        return (
          <div
            key={marker.id}
            ref={(el) => {
              markerElsRef.current[i] = el;
            }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: markerSize,
              height: markerSize,
              borderRadius: "50%",
              background: "#fff",
              boxShadow: "0 8px 22px rgba(16,24,20,0.16), 0 0 0 1px rgba(16,24,20,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              opacity: 0,
              willChange: "transform, opacity",
            }}
          >
            {/* Hover halo — opacity is driven per frame, which keeps the
                highlight on the compositor rather than triggering repaints. */}
            <span
              ref={(el) => {
                markerGlowsRef.current[i] = el;
              }}
              style={{
                position: "absolute",
                inset: -7,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${accent}2E 0%, ${accent}00 72%)`,
                opacity: 0,
                pointerEvents: "none",
              }}
            />
            <Icon size={18} color={accent} strokeWidth={2.3} style={{ position: "relative" }} />
          </div>
        );
      })}
    </div>
  );
}

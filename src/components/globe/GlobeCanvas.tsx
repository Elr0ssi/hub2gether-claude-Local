"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { COUNTRIES } from "@/data/countryData";

const GLOBE_RADIUS = 2.2;
const DOT_COUNT = 3600;
const CAMERA_Z = 8.0;
const DRAW_DURATION = 9.0; // seconds to trace all borders
const TEXTURE_W = 2048;
const TEXTURE_H = 1024;

const THEME_COLORS_HEX: Record<string, number> = {
  pib: 0x10b981,
  chomage: 0xf59e0b,
  politique: 0x8b5cf6,
  demographie: 0x3b82f6,
};

const DEFAULT_COLOR_HEX = 0x39ff88;

interface Props {
  theme: string | null;
  onCountryClick?: (name: string | null, x: number, y: number) => void;
}

function latLonTo3D(lat: number, lon: number, r: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    -r * Math.sin(phi) * Math.sin(theta),
  ];
}

function haversineAngle(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function logNorm(value: number, min: number, max: number): number {
  if (value <= 0 || min <= 0) return 0;
  const logV = Math.log(value);
  const logMin = Math.log(min);
  const logMax = Math.log(max);
  if (logMax === logMin) return 0.5;
  return Math.max(0, Math.min(1, (logV - logMin) / (logMax - logMin)));
}

function linearNorm(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

function getIntensity(name: string, theme: string): number {
  const entry = COUNTRIES[name];
  if (!entry) return 0;
  switch (theme) {
    case "pib": {
      if (!entry.economy) return 0;
      return logNorm(entry.economy.gdpRaw, 0.12, 28.8);
    }
    case "chomage": {
      if (!entry.chomage) return 0;
      return linearNorm(entry.chomage.rateRaw, 1.1, 33.3);
    }
    case "politique": {
      if (!entry.politics || entry.politics.score == null) return 0;
      return linearNorm(entry.politics.score, 1.73, 9.81);
    }
    case "demographie": {
      if (!entry.demographie) return 0;
      return logNorm(entry.demographie.popRaw, 5.4, 1428);
    }
    default:
      return 0;
  }
}

function buildFillCanvas(
  geojson: GeoJSON.FeatureCollection,
  theme: string
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_W;
  canvas.height = TEXTURE_H;
  const ctx = canvas.getContext("2d")!;

  const hex = THEME_COLORS_HEX[theme] ?? DEFAULT_COLOR_HEX;
  const r = (hex >> 16) & 0xff;
  const g = (hex >> 8) & 0xff;
  const b = hex & 0xff;

  for (const feat of geojson.features) {
    const name = feat.properties?.NAME as string;
    const intensity = name ? getIntensity(name, theme) : 0;
    if (intensity <= 0) continue;

    const alpha = 0.08 + intensity * 0.55;
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;

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
          const px = ((lon + 180) / 360) * TEXTURE_W;
          const py = ((90 - lat) / 180) * TEXTURE_H;
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

  return canvas;
}

export default function GlobeCanvas({ theme, onCountryClick }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<string | null>(theme);
  const onClickRef = useRef(onCountryClick);
  const geojsonRef = useRef<GeoJSON.FeatureCollection | null>(null);
  const fillMeshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    onClickRef.current = onCountryClick;
  }, [onCountryClick]);

  // Rebuild fill texture when theme changes
  useEffect(() => {
    if (!geojsonRef.current || !fillMeshRef.current) return;
    if (!theme) {
      // No theme: clear texture
      const mat = fillMeshRef.current.material as THREE.MeshBasicMaterial;
      if (mat.map) {
        mat.map.dispose();
        mat.map = null;
        mat.needsUpdate = true;
      }
      return;
    }
    const canvas = buildFillCanvas(geojsonRef.current, theme);
    const texture = new THREE.CanvasTexture(canvas);
    const mat = fillMeshRef.current.material as THREE.MeshBasicMaterial;
    if (mat.map) mat.map.dispose();
    mat.map = texture;
    mat.needsUpdate = true;
  }, [theme]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const W = mount.clientWidth || 500;
    const H = mount.clientHeight || 500;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.z = CAMERA_Z;

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // --- Dot matrix (background sphere) ---
    const dotPositions = new Float32Array(DOT_COUNT * 3);
    const dotColors = new Float32Array(DOT_COUNT * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < DOT_COUNT; i++) {
      const y = 1 - (i / (DOT_COUNT - 1)) * 2;
      const rr = Math.sqrt(1 - y * y);
      const th = golden * i;
      dotPositions[i * 3] = GLOBE_RADIUS * rr * Math.cos(th);
      dotPositions[i * 3 + 1] = GLOBE_RADIUS * y;
      dotPositions[i * 3 + 2] = GLOBE_RADIUS * rr * Math.sin(th);
      const rnd = 0.3 + ((i * 1.618033) % 1) * 0.7; // deterministic variation
      if (rnd < 0.48) {
        dotColors[i * 3] = 0.62; dotColors[i * 3 + 1] = 0.68; dotColors[i * 3 + 2] = 0.80;
      } else if (rnd < 0.82) {
        dotColors[i * 3] = 0.78; dotColors[i * 3 + 1] = 0.83; dotColors[i * 3 + 2] = 0.92;
      } else {
        dotColors[i * 3] = 0.94; dotColors[i * 3 + 1] = 0.96; dotColors[i * 3 + 2] = 1.00;
      }
    }
    const dotsGeom = new THREE.BufferGeometry();
    dotsGeom.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
    dotsGeom.setAttribute("color", new THREE.BufferAttribute(dotColors, 3));
    const dotsMat = new THREE.PointsMaterial({
      size: 0.030,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
    });
    globeGroup.add(new THREE.Points(dotsGeom, dotsMat));

    // --- Soft atmosphere ---
    const atmosGeom = new THREE.SphereGeometry(GLOBE_RADIUS + 0.20, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0xc8e8ff,
      transparent: true,
      opacity: 0.055,
      side: THREE.BackSide,
    });
    globeGroup.add(new THREE.Mesh(atmosGeom, atmosMat));

    // --- Fill texture sphere ---
    const fillGeom = new THREE.SphereGeometry(GLOBE_RADIUS + 0.004, 64, 64);
    const fillMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 1,
      depthWrite: false,
      side: THREE.FrontSide,
    });
    const fillMesh = new THREE.Mesh(fillGeom, fillMat);
    globeGroup.add(fillMesh);
    fillMeshRef.current = fillMesh;

    // --- Thread-pull border line ---
    const borderMat = new THREE.LineBasicMaterial({
      color: DEFAULT_COLOR_HEX,
      transparent: true,
      opacity: 0,
    });
    let borderGeom: THREE.BufferGeometry | null = null;
    let totalVerts = 0;
    let drawProgress = 0; // 0 → 1
    let geoReady = false;

    // Glowing head sphere
    const headGeom = new THREE.SphereGeometry(0.025, 10, 10);
    const headMat = new THREE.MeshBasicMaterial({
      color: DEFAULT_COLOR_HEX,
      transparent: true,
      opacity: 0,
    });
    const headMesh = new THREE.Mesh(headGeom, headMat);
    globeGroup.add(headMesh);

    let centroids: { name: string; lat: number; lon: number }[] = [];

    const clock = new THREE.Clock();

    fetch("/geo/ne_110m_admin_0_countries.geojson")
      .then((r) => r.json())
      .then((geojson: GeoJSON.FeatureCollection) => {
        geojsonRef.current = geojson;

        // Collect all border vertices in one flat array
        const verts: number[] = [];

        for (const feat of geojson.features) {
          const name = feat.properties?.NAME as string;
          const lon = feat.properties?.LABEL_X as number;
          const lat = feat.properties?.LABEL_Y as number;
          if (name && typeof lon === "number" && typeof lat === "number") {
            centroids.push({ name, lat, lon });
          }

          const geom = feat.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
          if (!geom) continue;
          const rings =
            geom.type === "Polygon"
              ? geom.coordinates as GeoJSON.Position[][]
              : (geom.coordinates as GeoJSON.Position[][][]).flat(1);
          for (const ring of rings) {
            for (let i = 1; i < ring.length; i++) {
              const [lon0, lat0] = ring[i - 1];
              const [lon1, lat1] = ring[i];
              if (Math.abs(lon1 - lon0) > 90) continue;
              const [x0, y0, z0] = latLonTo3D(lat0, lon0, GLOBE_RADIUS + 0.013);
              const [x1, y1, z1] = latLonTo3D(lat1, lon1, GLOBE_RADIUS + 0.013);
              verts.push(x0, y0, z0, x1, y1, z1);
            }
          }
        }

        totalVerts = verts.length / 3; // number of vertex positions (each pair = 1 segment)
        borderGeom = new THREE.BufferGeometry();
        borderGeom.setAttribute(
          "position",
          new THREE.BufferAttribute(new Float32Array(verts), 3)
        );
        borderGeom.setDrawRange(0, 0);
        const borderLines = new THREE.LineSegments(borderGeom, borderMat);
        globeGroup.add(borderLines);

        // If theme already active, build initial fill
        if (themeRef.current) {
          const canvas = buildFillCanvas(geojson, themeRef.current);
          const texture = new THREE.CanvasTexture(canvas);
          fillMat.map = texture;
          fillMat.needsUpdate = true;
        }

        geoReady = true;
        clock.start();
      })
      .catch(() => {/* silently ignore */});

    // --- Drag / rotate interaction ---
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let velX = 0;
    let clickStartX = 0;
    let clickStartY = 0;
    const AUTO_SPEED = prefersReduced ? 0 : 0.0018;

    const raycaster = new THREE.Raycaster();
    const sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), GLOBE_RADIUS);

    const handleGlobeClick = (clientX: number, clientY: number) => {
      if (!geoReady || centroids.length === 0) return;
      const cb = onClickRef.current;
      if (!cb) return;

      const rect = mount.getBoundingClientRect();
      const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
      const hitPoint = new THREE.Vector3();
      const hit = raycaster.ray.intersectSphere(sphere, hitPoint);

      if (!hit) { cb(null, clientX, clientY); return; }

      // Un-rotate hit point to match GeoJSON coordinate frame
      const invQuat = new THREE.Quaternion()
        .setFromEuler(globeGroup.rotation)
        .invert();
      hitPoint.applyQuaternion(invQuat);

      const lat = 90 - (Math.acos(Math.max(-1, Math.min(1, hitPoint.y / GLOBE_RADIUS))) * 180) / Math.PI;
      // Normalize theta to [0, 2π] before converting to lon
      let thetaRad = Math.atan2(-hitPoint.z, hitPoint.x);
      if (thetaRad < 0) thetaRad += 2 * Math.PI;
      const lon = thetaRad * (180 / Math.PI) - 180;

      let nearest: { name: string; lat: number; lon: number } | null = null;
      let minDist = Infinity;
      for (const c of centroids) {
        const d = haversineAngle(lat, lon, c.lat, c.lon);
        if (d < minDist) { minDist = d; nearest = c; }
      }

      cb(nearest && minDist < 0.52 ? nearest.name : null, clientX, clientY);
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX; prevY = e.clientY;
      clickStartX = e.clientX; clickStartY = e.clientY;
      velX = 0;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX; prevY = e.clientY;
      globeGroup.rotation.y += dx * 0.009;
      globeGroup.rotation.x += dy * 0.004;
      velX = dx * 0.009;
    };
    const onMouseUp = (e: MouseEvent) => {
      const moved =
        Math.abs(e.clientX - clickStartX) < 5 &&
        Math.abs(e.clientY - clickStartY) < 5;
      if (moved) handleGlobeClick(e.clientX, e.clientY);
      isDragging = false;
    };
    const onTouchStart = (e: TouchEvent) => {
      isDragging = true;
      prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
      clickStartX = e.touches[0].clientX; clickStartY = e.touches[0].clientY;
      velX = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - prevX;
      const dy = e.touches[0].clientY - prevY;
      prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
      globeGroup.rotation.y += dx * 0.009;
      globeGroup.rotation.x += dy * 0.004;
      velX = dx * 0.009;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      const moved =
        Math.abs(t.clientX - clickStartX) < 10 &&
        Math.abs(t.clientY - clickStartY) < 10;
      if (moved) handleGlobeClick(t.clientX, t.clientY);
      isDragging = false;
    };

    mount.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    mount.addEventListener("touchstart", onTouchStart, { passive: true });
    mount.addEventListener("touchmove", onTouchMove, { passive: true });
    mount.addEventListener("touchend", onTouchEnd);

    // --- RAF loop ---
    const targetBorderColor = new THREE.Color(DEFAULT_COLOR_HEX);
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (!isDragging) {
        velX *= 0.94;
        globeGroup.rotation.y += AUTO_SPEED + velX;
      }

      if (geoReady && borderGeom) {
        const elapsed = clock.getElapsedTime();

        // Update border color from theme
        const t = themeRef.current;
        targetBorderColor.setHex(t && THEME_COLORS_HEX[t] ? THEME_COLORS_HEX[t] : DEFAULT_COLOR_HEX);
        borderMat.color.lerp(targetBorderColor, 0.04);
        headMat.color.copy(borderMat.color);

        // Thread-pull animation
        if (drawProgress < 1) {
          drawProgress = Math.min(1, elapsed / DRAW_DURATION);
          // Round to nearest pair (LineSegments needs pairs)
          const targetCount = Math.floor((drawProgress * totalVerts) / 2) * 2;
          borderGeom.setDrawRange(0, targetCount);

          // Fade in border opacity as drawing begins
          borderMat.opacity = Math.min(0.88, drawProgress * 2.2);

          // Move glowing head to tip of current drawing
          const currentPosArr = borderGeom.attributes.position.array as Float32Array;
          if (targetCount > 0 && currentPosArr) {
            const tipIdx = (targetCount - 1) * 3;
            headMesh.position.set(
              currentPosArr[tipIdx],
              currentPosArr[tipIdx + 1],
              currentPosArr[tipIdx + 2]
            );
            // Pulsing glow
            const pulse = 0.6 + Math.sin(elapsed * 12) * 0.4;
            headMat.opacity = pulse * (1 - drawProgress * 0.7);
          }
        } else {
          // Animation done: hide head, keep borders at final opacity
          headMat.opacity = 0;
          borderMat.opacity = 0.88;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // --- Resize observer ---
    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      mount.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      mount.removeEventListener("touchstart", onTouchStart);
      mount.removeEventListener("touchmove", onTouchMove);
      mount.removeEventListener("touchend", onTouchEnd);
      fillMeshRef.current = null;
      geojsonRef.current = null;
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
  }, []); // setup runs once; theme communicated via refs + separate effect

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, cursor: "grab" }}
    />
  );
}

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { DollarSign, Euro, JapaneseYen, Landmark, BarChart3, Coins, type LucideIcon } from "lucide-react";

const GLOBE_RADIUS = 2.2;
const DOT_SAMPLES = 9000;
const CAMERA_Z = 7.6;
const MASK_W = 1024;
const MASK_H = 512;
const ACCENT = 0x10b981;

interface Marker {
  id: string;
  lat: number;
  lon: number;
  icon: LucideIcon;
}

// Country-anchored icon badges, positioned by real lat/lon so they travel with globe rotation.
const MARKERS: Marker[] = [
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

export default function InteractiveGlobeIcons() {
  const mountRef = useRef<HTMLDivElement>(null);
  const markerElsRef = useRef<(HTMLDivElement | null)[]>([]);

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
    const fillLight = new THREE.DirectionalLight(0x39ff88, 0.6);
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
      color: 0x39ff88,
      transparent: true,
      opacity: 0.06,
      side: THREE.BackSide,
    });
    globeGroup.add(new THREE.Mesh(atmosGeom, atmosMat));

    // --- Land dot matrix (filled in once geo data is ready) ---
    const dotsMat = new THREE.PointsMaterial({
      size: 0.032,
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
      color: ACCENT,
      transparent: true,
      opacity: 0,
    });
    const borderLines = new THREE.LineSegments(new THREE.BufferGeometry(), borderMat);
    globeGroup.add(borderLines);

    let dotsFadeTarget = 0;
    let bordersFadeTarget = 0;
    let markersReady = false;
    const markerBasePositions = MARKERS.map((m) => latLonTo3D(m.lat, m.lon, GLOBE_RADIUS + 0.02));

    fetch("/geo/ne_110m_admin_0_countries.geojson")
      .then((r) => r.json())
      .then((geojson: GeoJSON.FeatureCollection) => {
        const mask = buildLandMask(geojson);

        // Land-only dot cloud via deterministic golden-spiral sampling.
        const dotPositions: number[] = [];
        const dotColors: number[] = [];
        const golden = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < DOT_SAMPLES; i++) {
          const y = 1 - (i / (DOT_SAMPLES - 1)) * 2;
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
          if (rnd < 0.45) {
            dotColors.push(0.66, 0.87, 0.78); // light mint
          } else if (rnd < 0.8) {
            dotColors.push(0.31, 0.75, 0.55); // mid green
          } else {
            dotColors.push(0.06, 0.72, 0.51); // accent green
          }
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
        bordersFadeTarget = 0.35;

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

    const onMouseDown = (e: MouseEvent) => onPointerDown(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => onPointerMove(e.clientX, e.clientY);
    const onMouseUp = () => onPointerUp();
    const onTouchStart = (e: TouchEvent) => onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchEnd = () => onPointerUp();

    mount.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    mount.addEventListener("touchstart", onTouchStart, { passive: true });
    mount.addEventListener("touchmove", onTouchMove, { passive: true });
    mount.addEventListener("touchend", onTouchEnd);

    // --- RAF loop ---
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (!isDragging) {
        velX *= 0.94;
        globeGroup.rotation.y += AUTO_SPEED + velX;
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
          const scale = 0.82 + 0.22 * Math.max(0, front);
          el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;
          el.style.opacity = String(opacity);
          el.style.zIndex = String(Math.round(front * 100) + 100);
        });
      }

      renderer.render(scene, camera);
    };
    animate();

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
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: "absolute", inset: 0, cursor: "grab" }}
    >
      {MARKERS.map((marker, i) => {
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
              width: "clamp(38px, 5.2vw, 56px)",
              height: "clamp(38px, 5.2vw, 56px)",
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
            <Icon size={18} color="#10B981" strokeWidth={2.3} />
          </div>
        );
      })}
    </div>
  );
}

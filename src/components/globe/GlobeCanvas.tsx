"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const GLOBE_RADIUS = 2.2;
const DOT_COUNT = 3600;
const CAMERA_Z = 8.0;
const BUILD_DURATION = 1.8; // seconds for each continent to fully appear

const CONTINENT_DELAYS: Record<string, number> = {
  "Oceania": 0,
  "Antarctica": 0.4,
  "South America": 1.1,
  "Africa": 2.4,
  "Europe": 3.8,
  "North America": 5.2,
  "Asia": 6.8,
};

const THEME_COLORS_HEX: Record<string, number> = {
  economy: 0x10b981,
  politics: 0x8b5cf6,
  epidemics: 0xef4444,
  military: 0xf59e0b,
  empires: 0x39ff88,
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

export default function GlobeCanvas({ theme, onCountryClick }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<string | null>(theme);
  const onClickRef = useRef(onCountryClick);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    onClickRef.current = onCountryClick;
  }, [onCountryClick]);

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
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      dotPositions[i * 3] = GLOBE_RADIUS * r * Math.cos(th);
      dotPositions[i * 3 + 1] = GLOBE_RADIUS * y;
      dotPositions[i * 3 + 2] = GLOBE_RADIUS * r * Math.sin(th);
      const rnd = Math.random();
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

    // --- Per-continent border segments with independent materials ---
    interface ContinentEntry {
      name: string;
      material: THREE.LineBasicMaterial;
      seed: number;
    }
    const continents: ContinentEntry[] = [];
    let centroids: { name: string; lat: number; lon: number }[] = [];
    let geoReady = false;
    const clock = new THREE.Clock();

    fetch("/geo/ne_110m_admin_0_countries.geojson")
      .then((r) => r.json())
      .then((geojson: GeoJSON.FeatureCollection) => {
        const byContinent = new Map<string, GeoJSON.Feature[]>();

        for (const feat of geojson.features) {
          const cont = (feat.properties?.CONTINENT as string) || "Other";
          if (!byContinent.has(cont)) byContinent.set(cont, []);
          byContinent.get(cont)!.push(feat);

          const name = feat.properties?.NAME as string;
          const lon = feat.properties?.LABEL_X as number;
          const lat = feat.properties?.LABEL_Y as number;
          if (name && typeof lon === "number" && typeof lat === "number") {
            centroids.push({ name, lat, lon });
          }
        }

        for (const [contName, features] of byContinent) {
          const verts: number[] = [];
          for (const feat of features) {
            const geom = feat.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
            if (!geom) continue;
            const rings =
              geom.type === "Polygon"
                ? geom.coordinates
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
          if (verts.length === 0) continue;

          const geom = new THREE.BufferGeometry();
          geom.setAttribute(
            "position",
            new THREE.BufferAttribute(new Float32Array(verts), 3)
          );
          const mat = new THREE.LineBasicMaterial({
            color: DEFAULT_COLOR_HEX,
            transparent: true,
            opacity: 0,
          });
          globeGroup.add(new THREE.LineSegments(geom, mat));
          continents.push({ name: contName, material: mat, seed: Math.random() * 100 });
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

      const lat = 90 - (Math.acos(hitPoint.y / GLOBE_RADIUS) * 180) / Math.PI;
      const lon = (Math.atan2(-hitPoint.z, hitPoint.x) * 180) / Math.PI;

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

      if (geoReady) {
        const elapsed = clock.getElapsedTime();

        // Update target border color from theme
        const t = themeRef.current;
        targetBorderColor.setHex(t && THEME_COLORS_HEX[t] ? THEME_COLORS_HEX[t] : DEFAULT_COLOR_HEX);

        for (const c of continents) {
          const delay = CONTINENT_DELAYS[c.name] ?? 9.0;
          const local = elapsed - delay;

          if (local < 0) {
            c.material.opacity = 0;
          } else {
            const progress = Math.min(1, local / BUILD_DURATION);
            // Twinkling: stronger during build, gentler after fully built
            const twinkle = Math.sin(elapsed * 9 + c.seed) * 0.13 * Math.min(1, progress + 0.2);
            c.material.opacity = Math.max(0, Math.min(0.92, progress * 0.88 + twinkle));
          }

          // Smooth color transition
          c.material.color.lerp(targetBorderColor, 0.04);
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
  }, []); // setup runs once; theme and callback communicated via refs

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, cursor: "grab" }}
    />
  );
}

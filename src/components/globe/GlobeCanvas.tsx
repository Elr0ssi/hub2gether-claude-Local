"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const GLOBE_RADIUS = 2.2;
const DOT_COUNT = 3800;

const CITIES: [number, number][] = [
  [48.85, 2.35],
  [40.71, -74.01],
  [35.68, 139.69],
  [51.51, -0.12],
  [-23.55, -46.63],
  [39.91, 116.39],
  [-33.87, 151.21],
  [55.75, 37.62],
  [28.61, 77.21],
  [1.35, 103.82],
];

function latLonTo3D(lat: number, lon: number, r: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    -r * Math.sin(phi) * Math.sin(theta),
  ];
}

export default function GlobeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const W = mount.clientWidth || 460;
    const H = mount.clientHeight || 460;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.z = 6.8;

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // --- Dots ---
    const positions = new Float32Array(DOT_COUNT * 3);
    const colors = new Float32Array(DOT_COUNT * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < DOT_COUNT; i++) {
      const y = 1 - (i / (DOT_COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;

      positions[i * 3] = GLOBE_RADIUS * r * Math.cos(theta);
      positions[i * 3 + 1] = GLOBE_RADIUS * y;
      positions[i * 3 + 2] = GLOBE_RADIUS * r * Math.sin(theta);

      const rnd = Math.random();
      if (rnd < 0.55) {
        colors[i * 3] = 0.04; colors[i * 3 + 1] = 0.22; colors[i * 3 + 2] = 0.10;
      } else if (rnd < 0.88) {
        colors[i * 3] = 0.07; colors[i * 3 + 1] = 0.55; colors[i * 3 + 2] = 0.24;
      } else {
        colors[i * 3] = 0.14; colors[i * 3 + 1] = 0.92; colors[i * 3 + 2] = 0.42;
      }
    }

    const dotsGeom = new THREE.BufferGeometry();
    dotsGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    dotsGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const dotsMat = new THREE.PointsMaterial({
      size: 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
      sizeAttenuation: true,
    });
    globeGroup.add(new THREE.Points(dotsGeom, dotsMat));

    // --- Atmosphere glow ---
    const atmosGeom = new THREE.SphereGeometry(GLOBE_RADIUS + 0.2, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x39ff88,
      transparent: true,
      opacity: 0.045,
      side: THREE.BackSide,
    });
    globeGroup.add(new THREE.Mesh(atmosGeom, atmosMat));

    // --- Hotspot cities ---
    const hotspotGeom = new THREE.SphereGeometry(0.048, 8, 8);
    const hotspotMat = new THREE.MeshBasicMaterial({ color: 0x39ff88 });
    CITIES.forEach(([lat, lon]) => {
      const [x, y, z] = latLonTo3D(lat, lon, GLOBE_RADIUS);
      const mesh = new THREE.Mesh(hotspotGeom, hotspotMat);
      mesh.position.set(x, y, z);
      globeGroup.add(mesh);
    });

    // --- Country borders from GeoJSON ---
    let borderGeom: THREE.BufferGeometry | null = null;
    fetch("/geo/ne_110m_admin_0_countries.geojson")
      .then((r) => r.json())
      .then((geojson: GeoJSON.FeatureCollection) => {
        const verts: number[] = [];
        for (const feature of geojson.features) {
          const geom = feature.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
          const rings =
            geom.type === "Polygon"
              ? geom.coordinates
              : (geom.coordinates as GeoJSON.Position[][][]).flat(1);

          for (const ring of rings) {
            for (let i = 1; i < ring.length; i++) {
              const [lon0, lat0] = ring[i - 1];
              const [lon1, lat1] = ring[i];
              if (Math.abs(lon1 - lon0) > 90) continue; // skip antimeridian segments
              const [x0, y0, z0] = latLonTo3D(lat0, lon0, GLOBE_RADIUS + 0.012);
              const [x1, y1, z1] = latLonTo3D(lat1, lon1, GLOBE_RADIUS + 0.012);
              verts.push(x0, y0, z0, x1, y1, z1);
            }
          }
        }

        borderGeom = new THREE.BufferGeometry();
        borderGeom.setAttribute(
          "position",
          new THREE.BufferAttribute(new Float32Array(verts), 3)
        );
        const borderMat = new THREE.LineBasicMaterial({
          color: 0x39ff88,
          transparent: true,
          opacity: 0.55,
        });
        globeGroup.add(new THREE.LineSegments(borderGeom, borderMat));
      })
      .catch(() => {/* silently skip if fetch fails */});

    // --- Interaction ---
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let vX = 0;
    const AUTO_SPEED = prefersReduced ? 0 : 0.0028;

    const onDown = (cx: number, cy: number) => {
      isDragging = true;
      prevX = cx;
      prevY = cy;
      vX = 0;
    };
    const onMove = (cx: number, cy: number) => {
      if (!isDragging) return;
      const dx = cx - prevX;
      const dy = cy - prevY;
      prevX = cx;
      prevY = cy;
      globeGroup.rotation.y += dx * 0.009;
      globeGroup.rotation.x += dy * 0.004;
      vX = dx * 0.009;
    };
    const onUp = () => { isDragging = false; };

    const onMouseDown = (e: MouseEvent) => onDown(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouchStart = (e: TouchEvent) => onDown(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientX, e.touches[0].clientY);

    mount.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onUp);
    mount.addEventListener("touchstart", onTouchStart, { passive: true });
    mount.addEventListener("touchmove", onTouchMove, { passive: true });
    mount.addEventListener("touchend", onUp);

    // --- Animation ---
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isDragging) {
        vX *= 0.94;
        globeGroup.rotation.y += AUTO_SPEED + vX;
      }
      renderer.render(scene, camera);
    };
    animate();

    // --- Resize ---
    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      mount.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onUp);
      mount.removeEventListener("touchstart", onTouchStart);
      mount.removeEventListener("touchmove", onTouchMove);
      mount.removeEventListener("touchend", onUp);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          const mat = mesh.material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      });
      if (borderGeom) borderGeom.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, cursor: "grab" }}
    />
  );
}

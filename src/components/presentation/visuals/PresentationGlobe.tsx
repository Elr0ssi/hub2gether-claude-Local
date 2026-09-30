"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Presentation variant of the product globe.
 *
 * Derived from src/components/globe/GlobeCanvas.tsx and visually identical —
 * same radius, same 3 600-point matrix, same progressive border tracing in the
 * accent green, same slow rotation. Three deliberate differences:
 *
 *   1. no fill sphere. GlobeCanvas carries a MeshBasicMaterial with no colour
 *      and no map until a theme is set, which renders as an opaque white
 *      sphere. That is invisible against the white homepage but becomes a grey
 *      disc on the deck's dark slides, swallowing the type on top of it.
 *   2. no raycasting, no drag, no country centroids — the deck's globe is a
 *      backdrop and never handles a pointer, so none of that work is needed.
 *   3. tunable trace duration, so the cover can finish drawing during the
 *      speaker's opening sentence instead of nine seconds in.
 *
 * The product component is left untouched.
 */

const GLOBE_RADIUS = 2.2;
const DOT_COUNT = 3600;
const CAMERA_Z = 8.0;

const ACCENT_HEX = 0x39ff88;

interface Props {
  /** Seconds for the borders to finish tracing. */
  traceDuration?: number;
  /** Slide tone — drives the dot palette. */
  tone?: "light" | "dark";
  /** Multiplier on dot opacity, for use behind type. */
  dotOpacity?: number;
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

export default function PresentationGlobe({
  traceDuration = 6,
  tone = "dark",
  dotOpacity = 0.6,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const W = mount.clientWidth || 600;
    const H = mount.clientHeight || 600;

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

    /* ── Dot matrix ─────────────────────────────────────────────────────── */
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

      // Same deterministic three-tone palette as the product globe.
      const rnd = 0.3 + ((i * 1.618033) % 1) * 0.7;
      if (tone === "dark") {
        if (rnd < 0.48) {
          dotColors[i * 3] = 0.42; dotColors[i * 3 + 1] = 0.48; dotColors[i * 3 + 2] = 0.6;
        } else if (rnd < 0.82) {
          dotColors[i * 3] = 0.6; dotColors[i * 3 + 1] = 0.66; dotColors[i * 3 + 2] = 0.76;
        } else {
          dotColors[i * 3] = 0.82; dotColors[i * 3 + 1] = 0.87; dotColors[i * 3 + 2] = 0.95;
        }
      } else {
        if (rnd < 0.48) {
          dotColors[i * 3] = 0.62; dotColors[i * 3 + 1] = 0.68; dotColors[i * 3 + 2] = 0.8;
        } else if (rnd < 0.82) {
          dotColors[i * 3] = 0.78; dotColors[i * 3 + 1] = 0.83; dotColors[i * 3 + 2] = 0.92;
        } else {
          dotColors[i * 3] = 0.94; dotColors[i * 3 + 1] = 0.96; dotColors[i * 3 + 2] = 1.0;
        }
      }
    }

    const dotsGeom = new THREE.BufferGeometry();
    dotsGeom.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
    dotsGeom.setAttribute("color", new THREE.BufferAttribute(dotColors, 3));
    const dotsMat = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: dotOpacity,
      sizeAttenuation: true,
    });
    globeGroup.add(new THREE.Points(dotsGeom, dotsMat));

    /* ── Atmosphere rim ─────────────────────────────────────────────────── */
    const atmosGeom = new THREE.SphereGeometry(GLOBE_RADIUS + 0.2, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: tone === "dark" ? 0x39ff88 : 0xc8e8ff,
      transparent: true,
      opacity: tone === "dark" ? 0.035 : 0.055,
      side: THREE.BackSide,
    });
    globeGroup.add(new THREE.Mesh(atmosGeom, atmosMat));

    /* ── Progressively traced borders ───────────────────────────────────── */
    const borderMat = new THREE.LineBasicMaterial({
      color: ACCENT_HEX,
      transparent: true,
      opacity: 0,
    });
    let borderGeom: THREE.BufferGeometry | null = null;
    let totalVerts = 0;
    let drawProgress = 0;
    let geoReady = false;

    const headGeom = new THREE.SphereGeometry(0.025, 10, 10);
    const headMat = new THREE.MeshBasicMaterial({
      color: ACCENT_HEX,
      transparent: true,
      opacity: 0,
    });
    const headMesh = new THREE.Mesh(headGeom, headMat);
    globeGroup.add(headMesh);

    const clock = new THREE.Clock();
    let disposed = false;

    fetch("/geo/ne_110m_admin_0_countries.geojson")
      .then((r) => r.json())
      .then((geojson: GeoJSON.FeatureCollection) => {
        if (disposed) return;

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
              // Skip the seam so borders never streak across the sphere.
              if (Math.abs(lon1 - lon0) > 90) continue;
              const [x0, y0, z0] = latLonTo3D(lat0, lon0, GLOBE_RADIUS + 0.013);
              const [x1, y1, z1] = latLonTo3D(lat1, lon1, GLOBE_RADIUS + 0.013);
              verts.push(x0, y0, z0, x1, y1, z1);
            }
          }
        }

        totalVerts = verts.length / 3;
        borderGeom = new THREE.BufferGeometry();
        borderGeom.setAttribute(
          "position",
          new THREE.BufferAttribute(new Float32Array(verts), 3)
        );
        // Reduced motion: show the finished globe rather than animating to it.
        borderGeom.setDrawRange(0, prefersReduced ? totalVerts : 0);
        if (prefersReduced) {
          borderMat.opacity = 0.88;
          drawProgress = 1;
        }
        globeGroup.add(new THREE.LineSegments(borderGeom, borderMat));

        geoReady = true;
        clock.start();
      })
      .catch(() => {
        /* Without the geojson the dot sphere still reads as a globe. */
      });

    /* ── Render loop ────────────────────────────────────────────────────── */
    const AUTO_SPEED = prefersReduced ? 0 : 0.0014;
    let frameId = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      globeGroup.rotation.y += AUTO_SPEED;

      if (geoReady && borderGeom && drawProgress < 1) {
        const elapsed = clock.getElapsedTime();
        drawProgress = Math.min(1, elapsed / traceDuration);

        // LineSegments consumes vertices in pairs.
        const targetCount = Math.floor((drawProgress * totalVerts) / 2) * 2;
        borderGeom.setDrawRange(0, targetCount);
        borderMat.opacity = Math.min(0.88, drawProgress * 2.2);

        const pos = borderGeom.attributes.position.array as Float32Array;
        if (targetCount > 0) {
          const tip = (targetCount - 1) * 3;
          headMesh.position.set(pos[tip], pos[tip + 1], pos[tip + 2]);
          const pulse = 0.6 + Math.sin(elapsed * 12) * 0.4;
          headMat.opacity = pulse * (1 - drawProgress * 0.7);
        }
        if (drawProgress >= 1) {
          headMat.opacity = 0;
          borderMat.opacity = 0.88;
        }
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
      disposed = true;
      cancelAnimationFrame(frameId);
      ro.disconnect();
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
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [traceDuration, tone, dotOpacity]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0 }}
    />
  );
}

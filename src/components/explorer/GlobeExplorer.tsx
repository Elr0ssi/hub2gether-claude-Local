"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { COUCHE, type Repere, type Riviere } from "@/data/explorer/couches";

/* ═══════════════════════════════════════════════════════════════════════════
   LE GLOBE DE L'ONGLET EXPLORER

   Une sphère claire en relief (la carte d'altitude du site sert à la fois de relief
   et d'ombrage), peinte pays par pays, sur laquelle on pose :
     - des repères (points) — une seule géométrie, un seul appel de dessin ;
     - des tracés (rivières) ;
     - des cartes blanches qui suivent les repères choisis.

   Le globe ne connaît pas les couches : on lui passe des repères et des tracés déjà
   filtrés, et il dit ce qu'on survole ou ce qu'on clique.
   ═══════════════════════════════════════════════════════════════════════════ */

const DEG = Math.PI / 180;
const ELEV = 0.032;
const SURF = 1.05;
const LIGNE = 1.038;

function versXYZ(lat: number, lon: number, r: number, out = new THREE.Vector3()) {
  const la = lat * DEG;
  const lo = lon * DEG;
  return out.set(r * Math.cos(lo) * Math.cos(la), r * Math.sin(la), -r * Math.sin(lo) * Math.cos(la));
}

type Anneau = number[][];
interface PaysGeo { nom: string; polys: Anneau[][]; boites: [number, number, number, number][] }

function lirePays(geo: GeoJSON.FeatureCollection): PaysGeo[] {
  return geo.features.map((f) => {
    const g = f.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
    const polys = (g.type === "MultiPolygon" ? g.coordinates : [g.coordinates]) as Anneau[][];
    const boites = polys.map((p) => {
      const xs = p[0].map((c) => c[0]);
      const ys = p[0].map((c) => c[1]);
      return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] as [number, number, number, number];
    });
    return { nom: (f.properties as { name: string }).name, polys, boites };
  });
}

function dansAnneau(x: number, y: number, ring: Anneau) {
  let dedans = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 1e-12) + xi) dedans = !dedans;
  }
  return dedans;
}

export function paysEn(pays: PaysGeo[], lat: number, lon: number): string | null {
  for (const p of pays)
    for (let i = 0; i < p.polys.length; i++) {
      const b = p.boites[i];
      if (lon < b[0] || lon > b[2] || lat < b[1] || lat > b[3]) continue;
      const poly = p.polys[i];
      if (dansAnneau(lon, lat, poly[0]) && !poly.slice(1).some((t) => dansAnneau(lon, lat, t))) return p.nom;
    }
  return null;
}

/** Le centre et l'envergure d'un pays (en degrés), pour y amener la caméra. */
export function cadrage(geo: GeoJSON.FeatureCollection, nom: string): { lat: number; lon: number; envergure: number } | null {
  const p = lirePays(geo).find((x) => x.nom === nom);
  if (!p) return null;
  let k = 0;
  let max = -1;
  p.boites.forEach((b, i) => {
    const a = (b[2] - b[0]) * (b[3] - b[1]);
    if (a > max) {
      max = a;
      k = i;
    }
  });
  const b = p.boites[k];
  return { lat: (b[1] + b[3]) / 2, lon: (b[0] + b[2]) / 2, envergure: Math.max(b[2] - b[0], (b[3] - b[1]) * 1.2) };
}

function peindre(geo: GeoJSON.FeatureCollection, nuit: boolean, pays: string | null, toile: HTMLCanvasElement) {
  const W = toile.width;
  const H = toile.height;
  const ctx = toile.getContext("2d")!;
  const c = nuit
    ? { mer: "#141a30", terre: "#2b3454", bord: "rgba(170,185,255,0.16)" }
    : { mer: "#f1f3fa", terre: "#fbfbfe", bord: "rgba(120,110,175,0.16)" };
  ctx.fillStyle = c.mer;
  ctx.fillRect(0, 0, W, H);
  const trace = (f: GeoJSON.Feature) => {
    const g = f.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
    const polys = (g.type === "MultiPolygon" ? g.coordinates : [g.coordinates]) as Anneau[][];
    ctx.beginPath();
    for (const p of polys)
      for (const ring of p) {
        ring.forEach(([lon, lat], i) => {
          const x = ((lon + 180) / 360) * W;
          const y = ((90 - lat) / 180) * H;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
      }
  };
  ctx.fillStyle = c.terre;
  ctx.strokeStyle = c.bord;
  ctx.lineWidth = 0.7;
  ctx.lineJoin = "round";
  for (const f of geo.features) {
    trace(f);
    ctx.fill("evenodd");
    ctx.stroke();
  }
  if (pays) {
    for (const f of geo.features) {
      if ((f.properties as { name: string }).name !== pays) continue;
      trace(f);
      ctx.fillStyle = nuit ? "rgba(140,110,255,0.34)" : "rgba(104,72,240,0.16)";
      ctx.fill("evenodd");
      ctx.strokeStyle = nuit ? "#b9a6ff" : "#5b3df0";
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }
  }
}

export interface GlobeExplorerHandle {
  zoomer: (facteur: number) => void;
  recentrer: () => void;
}

interface Props {
  geo: GeoJSON.FeatureCollection;
  nuit: boolean;
  /** Les repères à dessiner (déjà filtrés par couche et par pays). */
  reperes: Repere[];
  /** Les tracés (rivières) à dessiner, et ceux qu'on met en avant. */
  rivieres: Riviere[];
  rivieresVives: Set<Riviere>;
  pays: string | null;
  /** Le repère survolé ou choisi, et ceux qui portent une carte permanente. */
  survol: string | null;
  choisi: string | null;
  cartes: string[];
  /** Vue du monde : les repères se regroupent en hexagones, seuls ceux qui portent une carte restent des points. */
  monde: boolean;
  /** Des liens courbes entre deux repères (identifiants). */
  arcs: [string, string][];
  onSurvol: (id: string | null) => void;
  onChoix: (id: string) => void;
  onPays: (nom: string | null) => void;
}

export const GlobeExplorer = forwardRef<GlobeExplorerHandle, Props>(function GlobeExplorer(props, ref) {
  const { geo, nuit, reperes, rivieres, rivieresVives, pays, survol, choisi, cartes, monde, arcs } = props;
  const hote = useRef<HTMLDivElement>(null);
  const cartesEls = useRef<Map<string, HTMLDivElement>>(new Map());
  /* Tout ce que la boucle de dessin lit, sans qu'un changement de props la relance. */
  const etat = useRef({ reperes, survol, choisi, cartes, props });
  etat.current = { reperes, survol, choisi, cartes, props };
  const scene = useRef<{
    maj: () => void;
    peindre: () => void;
    cadrer: () => void;
    zoomer: (f: number) => void;
    recentrer: () => void;
    majReperes: () => void;
    majLignes: () => void;
    majHex: () => void;
    majArcs: () => void;
  } | null>(null);
  const geoPays = useRef<PaysGeo[]>([]);

  useImperativeHandle(ref, () => ({
    zoomer: (f) => scene.current?.zoomer(f),
    recentrer: () => scene.current?.recentrer(),
  }));

  /* ── La scène : montée une fois ─────────────────────────────────────────── */
  useEffect(() => {
    const el = hote.current;
    if (!el) return;
    geoPays.current = lirePays(geo);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:grab";
    el.prepend(renderer.domElement);
    const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    const sc = new THREE.Scene();

    const toile = document.createElement("canvas");
    toile.width = 2048;
    toile.height = 1024;
    peindre(geo, nuit, pays, toile);
    const texture = new THREE.CanvasTexture(toile);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    const relief = new THREE.TextureLoader().load("/geo/earth-topology.png");
    const matiere = new THREE.MeshStandardMaterial({
      map: texture, bumpMap: relief, bumpScale: 5, displacementMap: relief, displacementScale: ELEV, roughness: 0.92, metalness: 0,
    });
    const globe = new THREE.Group();
    const boule = new THREE.Mesh(new THREE.SphereGeometry(1, 384, 192), matiere);
    globe.add(boule);
    sc.add(globe);

    const soleil = new THREE.DirectionalLight(0xffffff, nuit ? 1.7 : 1.9);
    soleil.position.set(-4, 3.2, 2.4);
    const ambiance = new THREE.AmbientLight(0xffffff, nuit ? 0.6 : 1.6);
    sc.add(soleil, ambiance);

    /* L'atmosphère : un halo violet pâle sur le bord. */
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(1.1, 64, 48),
      new THREE.ShaderMaterial({
        transparent: true, side: THREE.BackSide, depthWrite: false,
        uniforms: { couleur: { value: new THREE.Color(nuit ? "#6d7dff" : "#8f7dff") }, force: { value: nuit ? 0.9 : 0.5 } },
        vertexShader: "varying vec3 n; void main(){ n = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
        fragmentShader: "varying vec3 n; uniform vec3 couleur; uniform float force; void main(){ float i = pow(max(0.0, 0.72 - dot(n, vec3(0.0,0.0,1.0))), 3.0); gl_FragColor = vec4(couleur, clamp(i * force, 0.0, 1.0)); }",
      }),
    );
    sc.add(halo);

    /* Les repères : un seul nuage de points. */
    const ptsGeo = new THREE.BufferGeometry();
    const ptsMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { echelle: { value: renderer.getPixelRatio() } },
      vertexShader:
        "attribute float taille; attribute vec3 teinte; varying vec3 t; uniform float echelle; void main(){ t = teinte; gl_PointSize = taille * echelle; vec3 w = (modelMatrix * vec4(position,1.0)).xyz; float face = dot(normalize(w), normalize(cameraPosition)); gl_Position = face < 0.2 ? vec4(2.0, 2.0, 2.0, 1.0) : projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader:
        "varying vec3 t; void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; vec3 c = d > 0.36 ? vec3(1.0) : t; gl_FragColor = vec4(c, 1.0); }",
    });
    const points = new THREE.Points(ptsGeo, ptsMat);
    points.frustumCulled = false;
    globe.add(points);
    let positions: THREE.Vector3[] = [];

    /* Les tracés. */
    const lignes = new THREE.Group();
    globe.add(lignes);

    /* Les hexagones : la densité des repères, par case, quand on regarde le monde entier. */
    const hexGeo = new THREE.CircleGeometry(1, 6);
    const hexMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.92, side: THREE.DoubleSide, depthWrite: false });
    let hexMesh: THREE.InstancedMesh | null = null;

    /* Les liens : des courbes qui s'élèvent au-dessus du globe, et un point qui les parcourt. */
    const arcsGroupe = new THREE.Group();
    globe.add(arcsGroupe);
    let arcsPts: THREE.Vector3[][] = [];
    const pastille = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const x = c.getContext("2d")!;
      x.fillStyle = "#fff";
      x.beginPath();
      x.arc(32, 32, 30, 0, 7);
      x.fill();
      x.fillStyle = "#5b3df0";
      x.beginPath();
      x.arc(32, 32, 20, 0, 7);
      x.fill();
      return new THREE.CanvasTexture(c);
    })();
    const pulseGeo = new THREE.BufferGeometry();
    const pulse = new THREE.Points(pulseGeo, new THREE.PointsMaterial({ size: 11, sizeAttenuation: false, map: pastille, transparent: true, depthWrite: false }));
    pulse.frustumCulled = false;
    globe.add(pulse);

    const tout = { rx: 0.35, ry: -Math.PI / 2 + 0.3, d: 4.25, trx: 0.35, try_: -Math.PI / 2 + 0.3, td: 4.25, vit: 0, glisse: false, dernierGeste: 0 };
    const ecran = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      return { w, h, fit: Math.max(1, h / w) };
    };
    const distMonde = () => 4.25 * ecran().fit;

    const majTaille = () => {
      const { w, h } = ecran();
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      /* Sur grand écran, le panneau de gauche prend de la place : le globe se décale vers la droite. */
      const dx = w > 1000 ? 0.03 : 0;
      const dy = w <= 700 ? 0.07 : 0;
      cam.setViewOffset(w, h, -w * dx, h * dy, w, h);
      cam.updateProjectionMatrix();
      if (!etat.current.props.pays) tout.td = Math.max(tout.td, distMonde());
    };
    majTaille();
    tout.d = tout.td = distMonde();
    const ro = new ResizeObserver(majTaille);
    ro.observe(el);

    const poserCap = (lat: number, lon: number) => {
      tout.trx = lat * DEG;
      let a = -Math.PI / 2 - lon * DEG;
      /* Le plus court chemin : on ramène l'angle cible près de l'angle courant. */
      while (a - tout.ry > Math.PI) a -= 2 * Math.PI;
      while (a - tout.ry < -Math.PI) a += 2 * Math.PI;
      tout.try_ = a;
    };

    const api = {
      maj: () => {},
      peindre: () => {
        const p = etat.current.props;
        peindre(p.geo, p.nuit, p.pays, toile);
        texture.needsUpdate = true;
        (halo.material as THREE.ShaderMaterial).uniforms.couleur.value.set(p.nuit ? "#6d7dff" : "#8f7dff");
        (halo.material as THREE.ShaderMaterial).uniforms.force.value = p.nuit ? 0.9 : 0.5;
        soleil.intensity = p.nuit ? 1.7 : 1.9;
        ambiance.intensity = p.nuit ? 0.6 : 1.6;
        majLignes();
      },
      cadrer: () => {
        const p = etat.current.props;
        if (!p.pays) {
          tout.td = distMonde();
          return;
        }
        const c = cadrage(p.geo, p.pays);
        if (!c) return;
        poserCap(c.lat, c.lon);
        const arc = c.envergure * DEG;
        tout.td = Math.min(distMonde(), Math.max(1.55, 1 + arc * 3.2));
      },
      zoomer: (f: number) => {
        tout.td = Math.min(5.2, Math.max(1.25, tout.td * f));
      },
      recentrer: () => {
        tout.dernierGeste = 0;
        tout.td = distMonde();
      },
      majReperes: () => {
        const r = etat.current.reperes;
        positions = r.map((x) => versXYZ(x.lat, x.lon, SURF));
        const pos = new Float32Array(r.length * 3);
        const col = new Float32Array(r.length * 3);
        const tai = new Float32Array(r.length);
        const c = new THREE.Color();
        r.forEach((x, i) => {
          pos.set([positions[i].x, positions[i].y, positions[i].z], i * 3);
          c.set(COUCHE[x.couche].couleur);
          /* Le nuage de points n'est pas converti en sortie : on lui donne les valeurs sRGB brutes. */
          const srgb = c.getRGB({ r: 0, g: 0, b: 0 } as THREE.RGB, THREE.SRGBColorSpace);
          col.set([srgb.r, srgb.g, srgb.b], i * 3);
          tai[i] = 9;
        });
        ptsGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        ptsGeo.setAttribute("teinte", new THREE.BufferAttribute(col, 3));
        ptsGeo.setAttribute("taille", new THREE.BufferAttribute(tai, 1));
        ptsGeo.computeBoundingSphere();
      },
      majLignes: () => {
        majLignes();
      },
      majHex: () => majHex(),
      majArcs: () => majArcs(),
    };

    const majHex = () => {
      if (hexMesh) {
        globe.remove(hexMesh);
        hexMesh.dispose();
        hexMesh = null;
      }
      const e = etat.current;
      if (!e.props.monde) return;
      const pas = 4.6;
      const cases = new Map<string, { lat: number; lon: number; n: number; par: Record<string, number> }>();
      for (const r of e.reperes) {
        const ligne = Math.round(r.lat / pas);
        const lat = ligne * pas;
        const pasLon = pas / Math.max(0.25, Math.cos(lat * DEG));
        const col = Math.round(r.lon / pasLon - (ligne % 2 ? 0.5 : 0));
        const lon = (col + (ligne % 2 ? 0.5 : 0)) * pasLon;
        const k = `${ligne}:${col}`;
        const c = cases.get(k) ?? { lat, lon, n: 0, par: {} };
        c.n++;
        c.par[r.couche] = (c.par[r.couche] ?? 0) + 1;
        cases.set(k, c);
      }
      const liste = [...cases.values()];
      if (!liste.length) return;
      const max = Math.max(...liste.map((c) => c.n));
      hexMesh = new THREE.InstancedMesh(hexGeo, hexMat, liste.length);
      const m = new THREE.Matrix4();
      const q = new THREE.Quaternion();
      const z = new THREE.Vector3(0, 0, 1);
      const col = new THREE.Color();
      const blanc = new THREE.Color("#ffffff");
      liste.forEach((c, i) => {
        const n = versXYZ(c.lat, c.lon, 1);
        q.setFromUnitVectors(z, n);
        const t = c.n / max;
        const rayon = pas * DEG * (0.34 + 0.2 * Math.sqrt(t));
        m.compose(n.clone().multiplyScalar(SURF - 0.004), q, new THREE.Vector3(rayon, rayon, rayon));
        hexMesh!.setMatrixAt(i, m);
        const dom = Object.entries(c.par).sort((a, b) => b[1] - a[1])[0][0] as keyof typeof COUCHE;
        col.set(COUCHE[dom].couleur).lerp(blanc, 0.5 - 0.42 * t);
        hexMesh!.setColorAt(i, col);
      });
      hexMesh.frustumCulled = false;
      globe.add(hexMesh);
    };

    const majArcs = () => {
      while (arcsGroupe.children.length) {
        const o = arcsGroupe.children.pop() as THREE.Line;
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      }
      arcsPts = [];
      const e = etat.current;
      const par = new Map(e.reperes.map((r) => [r.id, r]));
      for (const [a, b] of e.props.arcs) {
        const ra = par.get(a);
        const rb = par.get(b);
        if (!ra || !rb) continue;
        const va = versXYZ(ra.lat, ra.lon, 1);
        const vb = versXYZ(rb.lat, rb.lon, 1);
        const ang = va.angleTo(vb);
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 56; i++) {
          const t = i / 56;
          const base = new THREE.Vector3().copy(va).lerp(vb, t).normalize();
          pts.push(base.multiplyScalar(SURF + Math.sin(Math.PI * t) * (0.03 + ang * 0.22)));
        }
        arcsPts.push(pts);
        const g = new THREE.BufferGeometry().setFromPoints(pts);
        arcsGroupe.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: e.props.nuit ? "#9d8cff" : "#4f3be0", transparent: true, opacity: 0.85 })));
      }
    };

    const majLignes = () => {
      while (lignes.children.length) {
        const o = lignes.children.pop() as THREE.LineSegments;
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      }
      const p = etat.current.props;
      const faire = (liste: Riviere[], couleur: string, opacite: number) => {
        const v: number[] = [];
        const t = new THREE.Vector3();
        for (const riv of liste)
          for (const l of riv.l)
            for (let i = 0; i + 1 < l.length; i++) {
              versXYZ(l[i][1], l[i][0], LIGNE, t);
              v.push(t.x, t.y, t.z);
              versXYZ(l[i + 1][1], l[i + 1][0], LIGNE, t);
              v.push(t.x, t.y, t.z);
            }
        if (!v.length) return;
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
        lignes.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: couleur, transparent: true, opacity: opacite })));
      };
      const vives = p.rivieresVives;
      const bleu = COUCHE.rivieres.couleur;
      faire(p.rivieres.filter((r) => !vives.has(r)), bleu, vives.size ? 0.35 : 0.85);
      faire(p.rivieres.filter((r) => vives.has(r)), nuit ? "#7fb2ff" : "#1d4ed8", 1);
    };
    scene.current = api;
    api.majReperes();
    api.majLignes();
    api.majHex();
    api.majArcs();
    api.cadrer();

    /* ── Gestes : glisser, pincer, molette ───────────────────────────────── */
    const doigts = new Map<number, { x: number; y: number }>();
    let depart = { x: 0, y: 0, t: 0 };
    let pincement = 0;
    const surPointeur = { x: -1, y: -1, dans: false };
    const bas = (e: PointerEvent) => {
      renderer.domElement.setPointerCapture(e.pointerId);
      doigts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (doigts.size === 1) depart = { x: e.clientX, y: e.clientY, t: performance.now() };
      if (doigts.size === 2) {
        const [a, b] = [...doigts.values()];
        pincement = Math.hypot(a.x - b.x, a.y - b.y);
      }
      tout.glisse = true;
      tout.vit = 0;
      renderer.domElement.style.cursor = "grabbing";
    };
    const bouge = (e: PointerEvent) => {
      const r = renderer.domElement.getBoundingClientRect();
      surPointeur.x = e.clientX - r.left;
      surPointeur.y = e.clientY - r.top;
      surPointeur.dans = true;
      const d = doigts.get(e.pointerId);
      if (!d) return;
      if (doigts.size === 2) {
        doigts.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const [a, b] = [...doigts.values()];
        const n = Math.hypot(a.x - b.x, a.y - b.y);
        if (pincement > 0) tout.td = Math.min(5.2, Math.max(1.25, tout.td * (pincement / n)));
        pincement = n;
        return;
      }
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      doigts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      /* La vitesse de rotation suit la taille à l'écran : plus on est proche, plus on glisse finement. */
      const k = ((tout.d - 1) / 2.4) * 0.0062;
      tout.try_ += dx * k;
      tout.trx = Math.max(-1.35, Math.min(1.35, tout.trx + dy * k));
      tout.ry = tout.try_;
      tout.rx = tout.trx;
      tout.vit = dx * k;
      tout.dernierGeste = performance.now();
    };
    const haut = (e: PointerEvent) => {
      const bougé = Math.hypot(e.clientX - depart.x, e.clientY - depart.y);
      doigts.delete(e.pointerId);
      if (doigts.size < 2) pincement = 0;
      if (doigts.size === 0) {
        tout.glisse = false;
        renderer.domElement.style.cursor = "grab";
        if (bougé < 6 && performance.now() - depart.t < 600) cliquer(e);
      }
    };
    const quitte = () => {
      surPointeur.dans = false;
      etat.current.props.onSurvol(null);
    };
    const roue = (e: WheelEvent) => {
      e.preventDefault();
      tout.td = Math.min(5.2, Math.max(1.25, tout.td * Math.exp(e.deltaY * 0.0012)));
    };

    const rayon = new THREE.Raycaster();
    const cliquer = (e: PointerEvent) => {
      const r = renderer.domElement.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const proche = plusProche(x, y, 16);
      if (proche) {
        etat.current.props.onChoix(proche);
        return;
      }
      const ndc = new THREE.Vector2((x / r.width) * 2 - 1, -(y / r.height) * 2 + 1);
      rayon.setFromCamera(ndc, cam);
      const hit = rayon.intersectObject(boule, false)[0];
      if (!hit) {
        etat.current.props.onPays(null);
        return;
      }
      const l = globe.worldToLocal(hit.point.clone()).normalize();
      const lat = Math.asin(l.y) / DEG;
      const lon = Math.atan2(-l.z, l.x) / DEG;
      etat.current.props.onPays(paysEn(geoPays.current, lat, lon));
    };

    renderer.domElement.addEventListener("pointerdown", bas);
    renderer.domElement.addEventListener("pointermove", bouge);
    renderer.domElement.addEventListener("pointerup", haut);
    renderer.domElement.addEventListener("pointercancel", haut);
    renderer.domElement.addEventListener("pointerleave", quitte);
    renderer.domElement.addEventListener("wheel", roue, { passive: false });

    /* ── La boucle ────────────────────────────────────────────────────────── */
    const v = new THREE.Vector3();
    const camDir = new THREE.Vector3();
    const proj: { x: number; y: number; vu: boolean }[] = [];
    const plusProche = (x: number, y: number, rayonPx: number): string | null => {
      let best: string | null = null;
      let min = rayonPx;
      const r = etat.current.reperes;
      for (let i = 0; i < r.length; i++) {
        const p = proj[i];
        if (!p || !p.vu) continue;
        const dd = Math.hypot(p.x - x, p.y - y);
        if (dd < min) {
          min = dd;
          best = r[i].id;
        }
      }
      return best;
    };

    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dernierSurvol: string | null = null;
    let brut = 0;
    const boucle = () => {
      brut = requestAnimationFrame(boucle);
      const e = etat.current;
      /* Le globe tourne tout seul tant qu'on ne l'a pas touché et qu'aucun pays n'est choisi. */
      if (!tout.glisse && !e.props.pays && !reduit && performance.now() - tout.dernierGeste > 2500) tout.try_ -= 0.0012;
      if (!tout.glisse) {
        tout.ry += (tout.try_ - tout.ry) * 0.09;
        tout.rx += (tout.trx - tout.rx) * 0.09;
        /* L'élan qui reste après un lancer. */
        if (Math.abs(tout.vit) > 0.0001) {
          tout.try_ += tout.vit;
          tout.vit *= 0.94;
        }
      }
      tout.d += (tout.td - tout.d) * 0.09;
      globe.rotation.set(tout.rx, tout.ry, 0);
      cam.position.set(0, 0, tout.d);
      cam.lookAt(0, 0, 0);
      globe.updateMatrixWorld(true);
      cam.updateMatrixWorld(true);

      const { w, h } = ecran();
      camDir.copy(cam.position).normalize();
      const n = positions.length;
      const tai = ptsGeo.getAttribute("taille") as THREE.BufferAttribute | undefined;
      for (let i = 0; i < n; i++) {
        v.copy(positions[i]).applyMatrix4(globe.matrixWorld);
        const face = v.clone().normalize().dot(camDir);
        const cache = e.props.monde && !e.cartes.includes(e.reperes[i]?.id ?? "");
        const vu = face > 0.2 && !cache;
        v.project(cam);
        proj[i] = { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, vu };
      }
      proj.length = n;
      if (tai) {
        const act = e.survol ?? null;
        for (let i = 0; i < n; i++) {
          const id = e.reperes[i]?.id;
          const grand = id === e.choisi ? 17 : id === act ? 15 : e.props.monde && !e.cartes.includes(id ?? "") ? 0 : 9;
          if (tai.array[i] !== grand) {
            (tai.array as Float32Array)[i] = grand;
            tai.needsUpdate = true;
          }
        }
      }
      /* Les hexagones s'effacent quand on s'approche ; les points de lumière parcourent les liens. */
      const proche = Math.min(1, Math.max(0, (tout.d - 2.3) / 1.1));
      hexMat.opacity = 0.92 * proche;
      if (hexMesh) hexMesh.visible = proche > 0.02;
      if (arcsPts.length) {
        const arr = new Float32Array(arcsPts.length * 3);
        const tt = performance.now() * 0.00035;
        arcsPts.forEach((pts, i) => {
          const f = (tt + i * 0.37) % 1;
          const k = Math.min(pts.length - 1, Math.floor(f * (pts.length - 1)));
          arr.set([pts[k].x, pts[k].y, pts[k].z], i * 3);
        });
        pulseGeo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
        pulse.visible = true;
      } else pulse.visible = false;
      /* Le survol : le repère le plus proche du pointeur. */
      if (surPointeur.dans && !tout.glisse) {
        const id = plusProche(surPointeur.x, surPointeur.y, 14);
        renderer.domElement.style.cursor = id ? "pointer" : "grab";
        if (id !== dernierSurvol) {
          dernierSurvol = id;
          e.props.onSurvol(id);
        }
      }
      /* Les cartes suivent leur repère. */
      const idx = new Map(e.reperes.map((x, i) => [x.id, i]));
      cartesEls.current.forEach((div, id) => {
        const i = idx.get(id);
        const p = i === undefined ? undefined : proj[i];
        if (!p || !p.vu) {
          div.style.opacity = "0";
          div.style.pointerEvents = "none";
          return;
        }
        div.style.opacity = "1";
        /* La carte reste dans la scène, même quand son repère est près du bord. */
        const demi = div.offsetWidth / 2 + 8;
        const x = Math.min(w - demi, Math.max(demi, p.x));
        div.style.transform = `translate(${x}px, ${p.y}px) translate(-50%, calc(-100% - 14px))`;
        div.style.zIndex = id === e.choisi || id === e.survol ? "5" : "3";
      });
      renderer.render(sc, cam);
    };
    boucle();

    return () => {
      cancelAnimationFrame(brut);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", bas);
      renderer.domElement.removeEventListener("pointermove", bouge);
      renderer.domElement.removeEventListener("pointerup", haut);
      renderer.domElement.removeEventListener("pointercancel", haut);
      renderer.domElement.removeEventListener("pointerleave", quitte);
      renderer.domElement.removeEventListener("wheel", roue);
      renderer.dispose();
      matiere.dispose();
      texture.dispose();
      relief.dispose();
      ptsGeo.dispose();
      ptsMat.dispose();
      hexGeo.dispose();
      hexMat.dispose();
      pulseGeo.dispose();
      pastille.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      scene.current = null;
    };
    // La scène se monte une fois ; tout le reste passe par les effets ci-dessous.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo]);

  useEffect(() => scene.current?.peindre(), [nuit, pays, geo]);
  useEffect(() => scene.current?.cadrer(), [pays]);
  useEffect(() => {
    scene.current?.majReperes();
    scene.current?.majHex();
    scene.current?.majArcs();
  }, [reperes, monde, nuit]);
  useEffect(() => scene.current?.majArcs(), [arcs]);
  useEffect(() => scene.current?.majLignes(), [rivieres, rivieresVives]);

  const aCarte = reperes.filter((r) => cartes.includes(r.id));
  return (
    <div ref={hote} className="xp-globe">
      <div className="xp-cartes" aria-hidden="true">
        {aCarte.map((r) => {
          const c = COUCHE[r.couche];
          const Icone = c.icone;
          return (
            <div
              key={r.id}
              className={`xp-carte${r.id === choisi ? " xp-carte-on" : ""}`}
              style={{ "--c": c.couleur, opacity: 0 } as React.CSSProperties}
              ref={(d) => {
                if (d) cartesEls.current.set(r.id, d);
                else cartesEls.current.delete(r.id);
              }}
            >
              <span className="xp-carte-i"><Icone size={14} aria-hidden="true" /></span>
              <span className="xp-carte-t">
                <small>{r.nom}</small>
                <b>{r.detail}</b>
              </span>
              {c.exemple && <i className="xp-carte-ex">exemple</i>}
            </div>
          );
        })}
      </div>
    </div>
  );
});

"use client";

import { useEffect, useRef } from "react";
import type { Topic } from "@/data/concept/conceptData";

/* ═══════════════════════════════════════════════════════════════════════════
   LE GLOBE — L'UNIVERS THE ESSENTIAL DATA

   Ce n'est pas la Terre. C'est une sphère d'information : un nuage de
   particules, quelques grands cercles, des arcs qui relient deux points de
   la surface, et six orbites qui portent les rubriques du média.

   Pourquoi un canvas 2D plutôt qu'une scène Three ?
   La difficulté ici n'est pas l'éclairage, c'est la PROFONDEUR : il faut que
   certaines orbites passent devant la sphère et d'autres derrière, et que
   les étiquettes HTML suivent exactement leur point 3D. En projetant
   soi-même et en triant par z, on obtient ce résultat au pixel près, à
   soixante images par seconde, sans monter un moteur 3D pour une maquette.

   Rien ici ne re-rend React : la boucle écrit dans le canvas, et pousse la
   position des étiquettes directement dans le DOM via `onNodes`.
   ═══════════════════════════════════════════════════════════════════════════ */

const ENCRE = "244, 242, 238";

export interface PositionNoeud {
  id: string;
  x: number;
  y: number;
  /** 0 derrière la sphère, 1 devant : pilote l'opacité et l'échelle. */
  avant: number;
}

interface Props {
  topics: Topic[];
  /** Appelée à chaque image avec la position projetée de chaque rubrique. */
  onNodes: (n: PositionNoeud[]) => void;
  /** 0 → 1, l'avancement de la construction au chargement. */
  actif: string | null;
  /** Décalage de la souris, en fraction de l'écran (−0,5 → 0,5). */
  souris: { x: number; y: number };
}

/* ── Un peu de géométrie ─────────────────────────────────────────────────── */

type V3 = [number, number, number];

function rotY(p: V3, a: number): V3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
}
function rotX(p: V3, a: number): V3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
}

/** Répartition de Fibonacci : des points réellement équidistants sur la sphère. */
function fibonacci(n: number): V3[] {
  const pts: V3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = phi * i;
    pts.push([Math.cos(t) * r, y, Math.sin(t) * r]);
  }
  return pts;
}

export function UniverseGlobe({ topics, onNodes, actif, souris }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  /* Les props qui changent souvent passent par des refs : la boucle les lit
     sans que le composant se re-rende. */
  const refActif = useRef(actif);
  const refSouris = useRef(souris);
  const refNodes = useRef(onNodes);
  refActif.current = actif;
  refSouris.current = souris;
  refNodes.current = onNodes;

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext("2d", { alpha: true });
    if (!ctx) return;

    const doux = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── Le contenu de la sphère, calculé une fois ───────────────────────── */
    const particules = fibonacci(820);
    const halo = fibonacci(260).map((p) => p.map((v) => v * 1.06) as V3);

    /* Quatre grands cercles, orientés différemment : ils donnent la surface
       sans la remplir. */
    const cercles: V3[][] = [];
    for (let c = 0; c < 4; c++) {
      const inc = (c / 4) * Math.PI;
      const anneau: V3[] = [];
      for (let k = 0; k <= 120; k++) {
        const t = (k / 120) * Math.PI * 2;
        anneau.push(rotX([Math.cos(t), 0, Math.sin(t)], inc));
      }
      cercles.push(anneau);
    }

    /* Des arcs qui relient deux points de la surface en passant au-dessus :
       les trajectoires d'information. */
    const arcs: V3[][] = [];
    for (let a = 0; a < 7; a++) {
      const d = particules[(a * 137) % particules.length];
      const f = particules[(a * 311 + 53) % particules.length];
      const seg: V3[] = [];
      for (let k = 0; k <= 34; k++) {
        const t = k / 34;
        const m: V3 = [d[0] + (f[0] - d[0]) * t, d[1] + (f[1] - d[1]) * t, d[2] + (f[2] - d[2]) * t];
        const n = Math.hypot(m[0], m[1], m[2]) || 1;
        const bosse = 1 + Math.sin(t * Math.PI) * 0.22;
        seg.push([(m[0] / n) * bosse, (m[1] / n) * bosse, (m[2] / n) * bosse]);
      }
      arcs.push(seg);
    }

    /* Les orbites : un cercle incliné par rubrique, échantillonné finement. */
    const orbites = topics.map((t) => {
      const inc = (t.inclinaison * Math.PI) / 180;
      const pts: V3[] = [];
      for (let k = 0; k <= 200; k++) {
        const a = (k / 200) * Math.PI * 2;
        pts.push(rotX([Math.cos(a) * t.rayon, 0, Math.sin(a) * t.rayon], inc));
      }
      return { topic: t, pts, inc };
    });

    let l = 0;
    let h = 0;
    let dpr = 1;
    const redim = () => {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      l = r.width;
      h = r.height;
      cv.width = Math.round(l * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    redim();
    const ro = new ResizeObserver(redim);
    ro.observe(cv);

    const t0 = performance.now();
    let brut = 0;
    /* Inclinaison suivie en douceur : la souris ne pilote pas directement,
       elle tire une valeur qui rattrape. Sans ce lissage, le globe est
       nerveux et le mouvement se voit — c'est exactement ce qu'on ne veut
       pas. */
    let tiltX = 0;
    let tiltY = 0;

    const dessine = (maintenant: number) => {
      const temps = (maintenant - t0) / 1000;
      /* La construction : particules, puis cercles, puis orbites. */
      const phase = doux ? 1 : Math.min(1, temps / 2.6);
      const pParticules = Math.min(1, phase / 0.42);
      const pCercles = Math.max(0, Math.min(1, (phase - 0.3) / 0.35));
      const pOrbites = Math.max(0, Math.min(1, (phase - 0.5) / 0.5));

      const cibleY = refSouris.current.x * 0.34;
      const cibleX = -refSouris.current.y * 0.22;
      tiltY += (cibleY - tiltY) * 0.045;
      tiltX += (cibleX - tiltX) * 0.045;

      const rot = doux ? 0.6 : temps * 0.045;
      const R = Math.min(l, h) * 0.295;
      const cx = l / 2;
      const cy = h / 2;
      /* Perspective légère : le facteur d'échelle dépend de la profondeur.
         Faible exprès — trop de perspective sur une sphère donne un ballon. */
      const persp = (z: number) => 1 / (1 - z * 0.22);

      const place = (p: V3) => {
        const q = rotX(rotY(p, rot + tiltY), tiltX);
        const e = persp(q[2]);
        return { x: cx + q[0] * R * e, y: cy + q[1] * R * e, z: q[2], e };
      };

      ctx.clearRect(0, 0, l, h);

      const focus = refActif.current;
      const attenue = (id: string) => (focus && focus !== id ? 0.22 : 1);

      /* ── Le halo, en premier : il pose le volume ──────────────────────── */
      const g = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.5);
      g.addColorStop(0, `rgba(158, 199, 216, ${0.055 * phase})`);
      g.addColorStop(0.55, `rgba(214, 167, 122, ${0.03 * phase})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.5, 0, Math.PI * 2);
      ctx.fill();

      /* ── Tout ce qui se dessine, rassemblé puis trié par profondeur ───── */
      type Trait = { z: number; peint: () => void };
      const traits: Trait[] = [];

      const pousseLigne = (pts: V3[], couleur: string, epaisseur: number, alpha: number, avance = 1) => {
        const n = Math.max(2, Math.floor(pts.length * avance));
        /* On découpe la courbe en tronçons et on trie chaque tronçon : c'est
           ce qui fait qu'une orbite passe derrière la sphère puis repasse
           devant, au lieu d'être entièrement au-dessus ou en dessous. */
        const pas = 4;
        for (let k = 0; k < n - pas; k += pas) {
          const a = place(pts[k]);
          const b = place(pts[Math.min(k + pas, n - 1)]);
          const z = (a.z + b.z) / 2;
          traits.push({
            z,
            peint: () => {
              /* Derrière la sphère, le trait s'efface : la sphère est opaque
                 à l'information, pas transparente. */
              const derriere = z < 0 && Math.hypot(a.x - cx, a.y - cy) < R * 0.98;
              ctx.globalAlpha = alpha * (derriere ? 0.18 : z < 0 ? 0.45 : 1);
              ctx.strokeStyle = couleur;
              ctx.lineWidth = epaisseur;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            },
          });
        }
      };

      /* Les particules de surface */
      const nP = Math.floor(particules.length * pParticules);
      for (let k = 0; k < nP; k++) {
        const p = place(particules[k]);
        traits.push({
          z: p.z,
          peint: () => {
            const a = (0.2 + (p.z + 1) * 0.3) * (focus ? 0.5 : 1);
            ctx.globalAlpha = a;
            ctx.fillStyle = `rgb(${ENCRE})`;
            ctx.fillRect(p.x, p.y, 1.35, 1.35);
          },
        });
      }

      /* Le voile extérieur, plus diffus */
      const nH = Math.floor(halo.length * pParticules);
      for (let k = 0; k < nH; k++) {
        const p = place(halo[k]);
        traits.push({
          z: p.z,
          peint: () => {
            ctx.globalAlpha = 0.1 + (p.z + 1) * 0.08;
            ctx.fillStyle = "#9EC7D8";
            ctx.fillRect(p.x, p.y, 1, 1);
          },
        });
      }

      /* Les grands cercles */
      if (pCercles > 0) for (const c of cercles) pousseLigne(c, `rgba(${ENCRE}, 0.5)`, 0.6, 0.3 * pCercles);

      /* Les arcs d'information : un point court le long de chacun */
      if (pCercles > 0)
        for (let i = 0; i < arcs.length; i++) {
          pousseLigne(arcs[i], "#D6A77A", 0.7, 0.3 * pCercles);
          if (!doux) {
            const t = (temps * 0.12 + i * 0.17) % 1;
            const p = place(arcs[i][Math.floor(t * (arcs[i].length - 1))]);
            traits.push({
              z: p.z,
              peint: () => {
                ctx.globalAlpha = p.z < 0 ? 0.25 : 0.85;
                ctx.fillStyle = "#D6A77A";
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2);
                ctx.fill();
              },
            });
          }
        }

      /* Les orbites, et la position de chaque rubrique */
      const noeuds: PositionNoeud[] = [];
      for (const o of orbites) {
        const a = attenue(o.topic.id);
        const vif = focus === o.topic.id;
        if (pOrbites > 0) {
          pousseLigne(
            o.pts,
            o.topic.teinte,
            vif ? 1.1 : 0.7,
            (vif ? 0.6 : 0.26) * pOrbites * (focus && !vif ? 0.45 : 1),
            pOrbites
          );
        }

        const tour = doux ? o.topic.phase : (o.topic.phase + temps * o.topic.vitesse) % 1;
        const ang = tour * Math.PI * 2;
        const brutP = rotX([Math.cos(ang) * o.topic.rayon, 0, Math.sin(ang) * o.topic.rayon], o.inc);
        const p = place(brutP);
        noeuds.push({ id: o.topic.id, x: p.x, y: p.y, avant: (p.z + 1) / 2 });

        if (pOrbites > 0.4) {
          traits.push({
            z: p.z + 0.001,
            peint: () => {
              ctx.globalAlpha = (0.4 + ((p.z + 1) / 2) * 0.6) * a;
              ctx.fillStyle = o.topic.teinte;
              ctx.beginPath();
              ctx.arc(p.x, p.y, vif ? 4 : 2.6, 0, Math.PI * 2);
              ctx.fill();
              /* Un halo net autour du point actif : c'est le seul endroit où
                 l'on s'autorise une lueur. */
              if (vif) {
                ctx.globalAlpha = 0.2;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
                ctx.fill();
              }
            },
          });
        }
      }

      traits.sort((x, y) => x.z - y.z);
      for (const t of traits) t.peint();
      ctx.globalAlpha = 1;

      refNodes.current(noeuds);
      brut = requestAnimationFrame(dessine);
    };

    brut = requestAnimationFrame(dessine);
    return () => {
      cancelAnimationFrame(brut);
      ro.disconnect();
    };
  }, [topics]);

  return <canvas ref={canvas} className="cg-canvas" aria-hidden="true" />;
}

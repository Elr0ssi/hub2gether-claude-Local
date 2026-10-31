"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  BarChart3,
  BookOpen,
  Check,
  Globe,
  Landmark,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { EnTete, Pied } from "@/components/concept/pieces";
import { Odometre } from "@/components/concept/Roulement";
import { Lettres } from "@/components/concept/Lettres";
import { Faq } from "@/components/seo/Elements";
import { FAQ_ACCUEIL } from "@/data/seo/faqAccueil";
import "@/components/seo/seo.css";
import { useGlisser } from "@/lib/useGlisser";
import { PresseCarousel } from "@/components/presse/PresseCarousel";
import { PRESSE_MONDE } from "@/data/concept/presse";
import { ETAPES } from "@/data/concept/conceptData";
import type { FichePays, Repere } from "@/data/concept/conceptGeo";
import "@/components/concept/concept.css";
import "./analyses.css";

/* ═══════════════════════════════════════════════════════════════════════════
   ANALYSES — LA PAGE D'ACCUEIL DE DEMAIN, EN ESSAI

   Un langage néo-média : des cartes très arrondies, un violet qui tient la
   une, de gros chiffres posés d'emblée, des mouvements qui reviennent quand on
   change de lecture. Tout le mouvement est du CSS ; les seuls écouteurs de
   défilement sont deux lectures de position, sans rendu à chaque image.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Props {
  reperes: Repere[];
  donnees: Record<string, FichePays>;
  annee: number;
  dette: { montant: number; ratio: number; deficit: number };
  /** Le PIB mondial du dernier millésime, pour le compteur en direct. */
  pib: { total: number; n: number; annee: number };
  /** La population mondiale et son accroissement par seconde (naissances moins décès). */
  population: { total: number; parSeconde: number };
  /** Les articles de dette (analyses et dossiers) qui entrent dans la file. */
  articlesDette?: { rubrique: string; titre: string; href: string }[];
}

const fmtPib = (v: number) =>
  Math.abs(v) >= 1000 ? `${(v / 1000).toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}\u00a0T$` : `${Math.round(v).toLocaleString("fr-FR")}\u00a0Md$`;

const nf = (v: number, d = 1) =>
  v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

/* ── L'apparition au défilement ──────────────────────────────────────────
   Un seul écouteur pour toute la page : il passe `data-vu` à 1 sur chaque
   élément marqué `data-rev` quand il entre dans l'écran, puis l'oublie.
   Avant le premier rendu client, rien n'est masqué : sans JavaScript, la page
   se lit entière. */
function useApparitions(racine: React.RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    racine.current?.setAttribute("data-js", "1");
  }, [racine]);

  useEffect(() => {
    const r = racine.current;
    if (!r) return;
    let restants = Array.from(r.querySelectorAll<HTMLElement>("[data-rev]"));
    let rendez = false;
    const passe = () => {
      rendez = false;
      const h = window.innerHeight;
      restants = restants.filter((n) => {
        const b = n.getBoundingClientRect();
        if (b.top < h - 60 && b.bottom > -40) {
          n.setAttribute("data-vu", "1");
          return false;
        }
        return true;
      });
      if (!restants.length) {
        window.removeEventListener("scroll", plan);
        window.removeEventListener("resize", plan);
      }
    };
    const plan = () => {
      if (!rendez) {
        rendez = true;
        requestAnimationFrame(passe);
      }
    };
    window.addEventListener("scroll", plan, { passive: true });
    window.addEventListener("resize", plan);
    plan();
    return () => {
      window.removeEventListener("scroll", plan);
      window.removeEventListener("resize", plan);
    };
  }, [racine]);
}

/* ── Le fond de courbes : elles tournent autour du globe, nous suivent, puis tournent autour de l'horizon ──────────
   Trois courbes. Au départ, chacune fait des tours autour du globe de l'accueil (un point lumineux la parcourt).
   Au défilement, elle se déroule et traverse la page en nous suivant, puis, arrivée en bas, s'enroule en orbite autour
   de l'horizon final, sur les mêmes ellipses que ses satellites. Le tracé est lissé dans le temps (il glisse au lieu
   de sauter), et recalculé aux dimensions et aux positions réelles des deux globes. */
interface GeoCourbe {
  d: string;
  /** Où la courbe quitte l'orbite du globe, et où elle rejoint celle de l'horizon. */
  sortie: [number, number];
  arrivee: [number, number];
  jalons: [number, number][];
}

const DEUX_PI = Math.PI * 2;
const norme = (x: number, y: number) => {
  const n = Math.hypot(x, y) || 1;
  return [x / n, y / n] as const;
};

/** Un point d'une ellipse inclinée, et sa tangente (dans le sens `sens`). */
function ellipse(cx: number, cy: number, rx: number, ry: number, rot: number, sens: 1 | -1, t: number) {
  const th = sens * t;
  const ex = rx * Math.cos(th);
  const ey = ry * Math.sin(th);
  const tx = -sens * rx * Math.sin(th);
  const ty = sens * ry * Math.cos(th);
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  return { x: cx + ex * c - ey * s, y: cy + ex * s + ey * c, tx: tx * c - ty * s, ty: tx * s + ty * c };
}

/** Comment chaque courbe se comporte dans chaque partie de la page : des repères (hauteur dans la partie, de 0 à 1 ; position horizontale, de 0 à 1).
 *  Ce sont les parties qui dictent le mouvement : des rails le long des marges quand la partie est dense, un croisement quand
 *  elle est aérée, une convergence vers le centre devant deux cartes, une diagonale devant une file qui défile. */
const PROFILS: { sel: string; courbes: [number, number][][] }[] = [
  { sel: "#presentation", courbes: [[[0.05, 0.1], [0.5, 0.93], [0.95, 0.12]], [[0.05, 0.9], [0.5, 0.5], [0.95, 0.88]], [[0.05, 0.5], [0.5, 0.06], [0.95, 0.5]]] },
  { sel: "#direct", courbes: [[[0, 0.05], [0.5, 0.075], [1, 0.05]], [[0, 0.5], [0.5, 0.5], [1, 0.5]], [[0, 0.955], [0.5, 0.93], [1, 0.955]]] },
  { sel: "#classements", courbes: [[[0, 0.1], [0.35, 0.03], [0.7, 0.14], [1, 0.06]], [[0, 0.46], [0.3, 0.3], [0.65, 0.6], [1, 0.4]], [[0, 0.96], [0.5, 0.985], [1, 0.95]]] },
  { sel: "#cartes", courbes: [[[0, 0.18], [0.5, 0.49], [1, 0.16]], [[0, 0.82], [0.5, 0.51], [1, 0.84]], [[0, 0.5], [0.5, 0.5], [1, 0.5]]] },
  { sel: "#articles", courbes: [[[0, 0.02], [0.5, 0.3], [1, 0.72]], [[0, 0.22], [0.5, 0.58], [1, 0.97]], [[0, 0.5], [0.5, 0.78], [1, 0.3]]] },
  { sel: "#position", courbes: [[[0, 0.92], [0.5, 0.08], [1, 0.9]], [[0, 0.08], [0.5, 0.92], [1, 0.14]], [[0, 0.5], [0.5, 0.5], [1, 0.5]]] },
  { sel: ".ax-presse", courbes: [[[0, 0.1], [1, 0.88]], [[0, 0.9], [1, 0.12]], [[0, 0.5], [1, 0.5]]] },
  { sel: "#fonctionnement", courbes: [[[0, 0.04], [0.5, 0.12], [1, 0.04]], [[0, 0.96], [0.5, 0.88], [1, 0.96]], [[0, 0.5], [0.5, 0.28], [1, 0.62]]] },
  { sel: ".ax-faq", courbes: [[[0, 0.04], [1, 0.05]], [[0, 0.96], [1, 0.95]], [[0, 0.5], [0.5, 0.97], [1, 0.5]]] },
  { sel: ".ax-fin", courbes: [[[0, 0.1], [1, 0.46]], [[0, 0.9], [1, 0.54]], [[0, 0.5], [1, 0.5]]] },
];

function construireCourbes(zone: HTMLElement): GeoCourbe[] | null {
  const zr = zone.getBoundingClientRect();
  const W = zr.width;
  const H = zr.height;
  const globe = zone.querySelector<HTMLElement>(".ax-globe-c");
  const orb = zone.querySelector<HTMLElement>(".ax-hz-orbite-1");
  if (!globe || !orb || W < 10) return null;
  const gr = globe.getBoundingClientRect();
  const or = orb.getBoundingClientRect();
  const cx1 = gr.left - zr.left + gr.width / 2;
  const cy1 = gr.top - zr.top + gr.height / 2;
  const R = Math.max(60, gr.width / 2);
  const cx2 = or.left - zr.left + or.width / 2;
  const cy2 = or.top - zr.top + or.height / 2;
  const rx2 = orb.offsetWidth / 2;
  const ry2 = orb.offsetHeight / 2;
  const etroit = W < 700;

  /* Les trois courbes : inclinaison de l'orbite du globe, sens, et profil de la traversée. */
  const profils = [
    { rot1: (-24 * Math.PI) / 180, k1: [1.2, 0.46], sens: 1 as const, t0: -0.6, A: 0.4, ph: 0, om: 1.9, k2: [1, 1], rot2: (-6 * Math.PI) / 180 },
    { rot1: (18 * Math.PI) / 180, k1: [1.34, 0.52], sens: -1 as const, t0: 2.2, A: 0.4, ph: Math.PI, om: 1.9, k2: [0.8, 0.72], rot2: (5 * Math.PI) / 180 },
    { rot1: (64 * Math.PI) / 180, k1: [1.1, 0.4], sens: 1 as const, t0: 4.1, A: 0.2, ph: 1.2, om: 2.3, k2: [0.62, 0.52], rot2: (-2 * Math.PI) / 180 },
  ];

  const yDebut = cy1 + R * 1.05;
  const yFin = cy2 - ry2 * 1.7;
  const n = Math.max(6, Math.min(20, Math.round((yFin - yDebut) / 650)));

  return profils.map((pf, c) => {
    const rx1 = R * pf.k1[0];
    const ry1 = R * pf.k1[1];
    const jal: [number, number][] = [];
    const etapes: [number, number][] = [];
    /* Les repères viennent des parties de la page, à leurs vraies positions. */
    for (const pr of PROFILS) {
      const el = zone.querySelector<HTMLElement>(pr.sel);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const top = r.top - zr.top;
      if (top + r.height < yDebut || top > yFin) continue;
      for (const [u, x] of pr.courbes[c]) {
        const y = top + r.height * u;
        if (y < yDebut + 40 || y > yFin - 20) continue;
        /* Sur petit écran, tout se rapproche du centre : les marges n'existent plus. */
        etapes.push([(etroit ? 0.5 + (x - 0.5) * 0.7 : x) * W, y]);
      }
    }
    etapes.sort((p, q) => p[1] - q[1]);
    /* Deux repères trop proches en hauteur feraient une boucle : on garde le premier. */
    for (let i = etapes.length - 1; i > 0; i--) if (etapes[i][1] - etapes[i - 1][1] < 70) etapes.splice(i, 1);
    if (etapes.length < 2) {
      etapes.length = 0;
      for (let k = 0; k < n; k++) {
        const u = k / (n - 1);
        etapes.push([(0.5 + 0.35 * Math.sin(pf.ph + k * pf.om)) * W, yDebut + (yFin - yDebut) * u]);
      }
    }
    /* Le point de sortie de l'orbite du globe : celui dont la tangente vise la première étape. */
    let t1 = DEUX_PI + 0.4;
    let meilleur = -2;
    for (let t = DEUX_PI + 0.3; t < 2 * DEUX_PI; t += 0.04) {
      const e = ellipse(cx1, cy1, rx1, ry1, pf.rot1, pf.sens, pf.t0 + t);
      const [tx, ty] = norme(e.tx, e.ty);
      const [dx, dy] = norme(etapes[0][0] - e.x, etapes[0][1] - e.y);
      const sc = tx * dx + ty * dy;
      if (sc > meilleur) {
        meilleur = sc;
        t1 = t;
      }
    }
    const orbite1: [number, number][] = [];
    for (let t = 0; t <= t1; t += 0.07) {
      const e = ellipse(cx1, cy1, rx1, ry1, pf.rot1, pf.sens, pf.t0 + t);
      orbite1.push([e.x, e.y]);
    }
    const sE = ellipse(cx1, cy1, rx1, ry1, pf.rot1, pf.sens, pf.t0 + t1);
    orbite1.push([sE.x, sE.y]);

    /* Le point d'arrivée sur l'orbite de l'horizon : celui dont la tangente prolonge la dernière étape. */
    const sens2: 1 | -1 = pf.sens === 1 ? -1 : 1;
    const dern = etapes[etapes.length - 1];
    let psi = 0;
    let m2 = -2;
    const rx = rx2 * pf.k2[0];
    const ry = ry2 * pf.k2[1];
    for (let t = 0; t < DEUX_PI; t += 0.04) {
      const e = ellipse(cx2, cy2, rx, ry, pf.rot2, sens2, t);
      const [tx, ty] = norme(e.tx, e.ty);
      const [dx, dy] = norme(e.x - dern[0], e.y - dern[1]);
      const sc = tx * dx + ty * dy;
      if (sc > m2) {
        m2 = sc;
        psi = t;
      }
    }
    const aE = ellipse(cx2, cy2, rx, ry, pf.rot2, sens2, psi);
    const orbite2: [number, number][] = [];
    for (let t = 0.07; t <= DEUX_PI * 1.15; t += 0.07) {
      const e = ellipse(cx2, cy2, rx, ry, pf.rot2, sens2, psi + t);
      orbite2.push([e.x, e.y]);
    }

    /* La traversée : une courbe de Hermite qui part tangente à l'orbite et arrive tangente à l'autre. */
    const ctrl: [number, number][] = [[sE.x, sE.y], ...etapes, [aE.x, aE.y]];
    const m: [number, number][] = ctrl.map((p, i) => {
      if (i === 0) {
        const [tx, ty] = norme(sE.tx, sE.ty);
        const L = Math.hypot(ctrl[1][0] - p[0], ctrl[1][1] - p[1]);
        return [tx * L, ty * L];
      }
      if (i === ctrl.length - 1) {
        const [tx, ty] = norme(aE.tx, aE.ty);
        const L = Math.hypot(p[0] - ctrl[i - 1][0], p[1] - ctrl[i - 1][1]);
        return [tx * L, ty * L];
      }
      return [(ctrl[i + 1][0] - ctrl[i - 1][0]) / 2, (ctrl[i + 1][1] - ctrl[i - 1][1]) / 2];
    });
    const trav: [number, number][] = [];
    for (let i = 0; i < ctrl.length - 1; i++) {
      const p0 = ctrl[i];
      const p1 = ctrl[i + 1];
      const pas = Math.max(6, Math.ceil(Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / 26));
      for (let j = 0; j < pas; j++) {
        const u = j / pas;
        const u2 = u * u;
        const u3 = u2 * u;
        const h00 = 2 * u3 - 3 * u2 + 1;
        const h10 = u3 - 2 * u2 + u;
        const h01 = -2 * u3 + 3 * u2;
        const h11 = u3 - u2;
        trav.push([h00 * p0[0] + h10 * m[i][0] + h01 * p1[0] + h11 * m[i + 1][0], h00 * p0[1] + h10 * m[i][1] + h01 * p1[1] + h11 * m[i + 1][1]]);
      }
    }
    trav.push([aE.x, aE.y]);
    for (let k = 1; k <= 7; k++) jal.push(trav[Math.round(((trav.length - 1) * k) / 8)]);

    /* Tout le tracé, lissé en courbes de Bézier. */
    const pts = [...orbite1, ...trav.slice(1), ...orbite2];
    let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      d += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)}, ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    void H;
    return { d, sortie: [sE.x, sE.y] as [number, number], arrivee: [aE.x, aE.y] as [number, number], jalons: jal };
  });
}

const CLASSES_COURBES = ["a", "b", "c"] as const;

function FondCourbes({ racine }: { racine: React.RefObject<HTMLElement | null> }) {
  const chemins = useRef<(SVGPathElement | null)[]>([]);
  const lueurs = useRef<(SVGPathElement | null)[]>([]);
  const pointes = useRef<(HTMLSpanElement | null)[]>([]);
  const jalonsEls = useRef<(HTMLSpanElement | null)[]>([]);
  const [taille, setTaille] = useState({ w: 0, h: 0 });
  const [geo, setGeo] = useState<GeoCourbe[] | null>(null);

  /* Les dimensions de la page, et la géométrie qui en découle (après le chargement des polices et des globes). */
  useEffect(() => {
    const zone = racine.current;
    if (!zone) return;
    const lire = () => {
      const r = zone.getBoundingClientRect();
      setTaille((t) => (Math.abs(t.w - r.width) < 2 && Math.abs(t.h - r.height) < 24 ? t : { w: Math.round(r.width), h: Math.round(r.height) }));
    };
    lire();
    const ro = new ResizeObserver(lire);
    ro.observe(zone);
    const tard = window.setTimeout(lire, 1200);
    return () => {
      ro.disconnect();
      window.clearTimeout(tard);
    };
  }, [racine]);

  useEffect(() => {
    const zone = racine.current;
    if (!zone || !taille.w) return;
    setGeo(construireCourbes(zone));
  }, [racine, taille]);

  /* Le mouvement : une boucle légère, lissée dans le temps. */
  useEffect(() => {
    const zone = racine.current;
    if (!zone || !geo) return;
    const SAMPLES = 900;
    const tables = geo.map((g, c) => {
      const p = chemins.current[c];
      if (!p) return null;
      const L = p.getTotalLength();
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i <= SAMPLES; i++) {
        const q = p.getPointAtLength((L * i) / SAMPLES);
        pts.push({ x: q.x, y: q.y });
      }
      /* La fraction du tracé qui correspond à un point connu (le plus proche, parmi les échantillons du bon voisinage). */
      const frac = (cible: [number, number], depuis: number) => {
        let best = depuis;
        let dmin = Infinity;
        for (let i = Math.floor(depuis * SAMPLES); i <= SAMPLES; i++) {
          const dd = Math.hypot(pts[i].x - cible[0], pts[i].y - cible[1]);
          if (dd < dmin) {
            dmin = dd;
            best = i / SAMPLES;
          }
          if (dd > dmin + 80 && dmin < 8) break;
        }
        return best;
      };
      const f1 = frac(g.sortie, 0.05);
      const f2 = frac(g.arrivee, f1 + 0.02);
      return { L, pts, f1, f2 };
    });
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const courant = geo.map(() => ({ f: 0, dot: 0 }));
    let id = 0;
    let avant = performance.now();
    let immobile = 0;
    const boucle = (maintenant: number) => {
      id = requestAnimationFrame(boucle);
      if (document.hidden) {
        avant = maintenant;
        return;
      }
      const dt = Math.min(100, maintenant - avant);
      avant = maintenant;
      const haut = zone.getBoundingClientRect();
      const H = haut.height;
      const regard = Math.min(H, Math.max(0, -haut.top + window.innerHeight * 0.68));
      const lisse = 1 - Math.exp(-dt / 170);
      geo.forEach((g, c) => {
        const tb = tables[c];
        const p = chemins.current[c];
        if (!tb || !p) return;
        const ya = g.sortie[1];
        const yb = g.arrivee[1];
        /* Où le tracé doit être arrivé : tout le premier tour tant qu'on est en haut, puis la traversée au rythme du regard, puis le dernier tour. */
        let cible: number;
        let phase: "haut" | "traverse" | "bas";
        if (regard <= ya) {
          cible = tb.f1;
          phase = "haut";
        } else if (regard < yb) {
          let k = Math.floor(tb.f1 * SAMPLES);
          const kmax = Math.ceil(tb.f2 * SAMPLES);
          let dernier = k;
          for (; k <= kmax; k++) if (tb.pts[k].y <= regard) dernier = k;
          cible = Math.min(tb.f2, Math.max(tb.f1, dernier / SAMPLES));
          phase = "traverse";
        } else {
          const u = Math.min(1, (regard - yb) / Math.max(40, H - yb));
          const e = u * u * (3 - 2 * u);
          cible = tb.f2 + (1 - tb.f2) * e;
          phase = "bas";
        }
        if (reduit) {
          courant[c].f = 1;
        } else {
          /* Au tout début, le premier tour se dessine de lui-même ; ensuite le tracé glisse vers sa cible. */
          const v = courant[c].f + (cible - courant[c].f) * (courant[c].f < tb.f1 * 0.98 && phase === "haut" ? 1 - Math.exp(-dt / 520) : lisse);
          courant[c].f = Math.abs(cible - v) < 0.00005 ? cible : v;
        }
        const f = courant[c].f;
        p.style.strokeDashoffset = String(1 - f);
        const g2 = lueurs.current[c];
        if (g2) g2.style.strokeDashoffset = String(1 - f);

        /* La pointe : elle tourne seule autour du globe en haut, suit le tracé au milieu, tourne autour de l'horizon en bas. */
        let pos = f;
        if (!reduit) {
          const tour = ((maintenant / 9000 + c * 0.31) % 1);
          if (phase === "haut" && f >= tb.f1 * 0.98) pos = tour * tb.f1;
          else if (phase === "bas" && f >= 0.985) pos = tb.f2 + tour * (1 - tb.f2);
        }
        courant[c].dot = pos;
        const q = p.getPointAtLength(tb.L * pos);
        const tip = pointes.current[c];
        if (tip) {
          tip.style.transform = `translate(${q.x}px, ${q.y}px)`;
          tip.style.opacity = reduit ? "0" : f > 0.003 ? "1" : "0";
        }
      });
      jalonsEls.current.forEach((j) => {
        if (!j) return;
        const on = Number(j.dataset.y) <= regard ? "1" : "0";
        if (j.dataset.on !== on) j.dataset.on = on;
      });
      immobile = 0;
      void immobile;
    };
    id = requestAnimationFrame(boucle);
    return () => cancelAnimationFrame(id);
  }, [racine, geo]);

  if (!taille.w || !geo) return <div className="ax-courbes" aria-hidden="true" />;
  return (
    <div className="ax-courbes" aria-hidden="true">
      <svg viewBox={`0 0 ${taille.w} ${taille.h}`} width={taille.w} height={taille.h}>
        {geo.map((g, i) => (
          <g key={CLASSES_COURBES[i]} className={`ax-co ax-co-${CLASSES_COURBES[i]}`}>
            <path d={g.d} pathLength={1} className="ax-co-fond" />
            <path d={g.d} pathLength={1} className="ax-co-lueur" ref={(el) => { lueurs.current[i] = el; }} />
            <path d={g.d} pathLength={1} className="ax-co-trait" ref={(el) => { chemins.current[i] = el; }} />
          </g>
        ))}
      </svg>
      {geo.map((g, i) => (
        <span key={CLASSES_COURBES[i]} className={`ax-co-pointe ax-co-${CLASSES_COURBES[i]}`} ref={(el) => { pointes.current[i] = el; }} />
      ))}
      {geo.flatMap((g, c) =>
        g.jalons.map((p, k) => (
          <span
            key={`${c}-${k}`}
            className={`ax-co-jalon ax-co-${CLASSES_COURBES[c]}`}
            data-y={p[1]}
            data-on="0"
            ref={(el) => { jalonsEls.current[c * 8 + k] = el; }}
            style={{ left: p[0], top: p[1] }}
          />
        )),
      )}
    </div>
  );
}

/** Un bloc qui se lève. `d` est le retard, en millisecondes. */
function Rev({
  children,
  d = 0,
  className = "",
  as: Tag = "div",
  href,
}: {
  children: React.ReactNode;
  d?: number;
  className?: string;
  as?: "div" | "li" | "article" | "p" | "h2" | "a";
  href?: string;
}) {
  const T = Tag as React.ElementType;
  return (
    <T data-rev="" href={href} className={className} style={{ "--d": `${d}ms` } as React.CSSProperties}>
      {children}
    </T>
  );
}

/** Un cadre immobile autour d'une carte qui se soulève : c'est lui qui reçoit le survol,
    pour que la carte ne clignote pas en montant sous le curseur. */
function Lift({ children }: { children: React.ReactNode }) {
  return <div className="ax-hit">{children}</div>;
}

/** Un nombre qui roule d'une valeur à l'autre au lieu de sauter. */
function Roule({ v, f }: { v: number | null; f: (x: number) => string }) {
  const [aff, setAff] = useState<number | null>(v);
  const depuis = useRef<number | null>(v);
  useEffect(() => {
    if (v === null) {
      depuis.current = null;
      setAff(null);
      return;
    }
    const d0 = depuis.current ?? v;
    if (d0 === v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      depuis.current = v;
      setAff(v);
      return;
    }
    const t0 = performance.now();
    const DUREE = 900;
    let id = 0;
    const pas = (t: number) => {
      const u = Math.min(1, Math.max(0, (t - t0) / DUREE));
      const e = 1 - Math.pow(1 - u, 4);
      const x = d0 + (v - d0) * e;
      depuis.current = x;
      setAff(x);
      if (u < 1) id = requestAnimationFrame(pas);
    };
    id = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(id);
  }, [v]);
  return <>{aff === null ? "" : f(aff)}</>;
}

/* ── Un nombre qui monte jusqu'à sa valeur ───────────────────────────────── */

function Monte({ texte }: { texte: string }) {
  const m = texte.match(/^([^\d-]*)(-?\d[\d\s  ]*(?:,\d+)?)(.*)$/);
  const cible = m ? parseFloat(m[2].replace(/[\s  ]/g, "").replace(",", ".")) : NaN;
  const dec = m && m[2].includes(",") ? m[2].split(",")[1].length : 0;
  const [v, setV] = useState<number | null>(null);

  useEffect(() => {
    if (!Number.isFinite(cible)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let f = 0;
    const t0 = performance.now();
    const pas = (t: number) => {
      const u = Math.min(1, (t - t0) / 1100);
      setV(cible * (1 - Math.pow(1 - u, 4)));
      if (u < 1) f = requestAnimationFrame(pas);
      else setV(null);
    };
    setV(0);
    f = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(f);
  }, [cible]);

  if (!m || !Number.isFinite(cible)) return <>{texte}</>;
  return (
    <>
      {m[1]}
      {v === null ? m[2] : nf(v, dec)}
      {m[3]}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1 · L'OUVERTURE — le nom, un slogan, un globe qui porte les chiffres
   ═══════════════════════════════════════════════════════════════════════════ */

/* Le globe en points du site : une scène WebGL, montée seulement côté client
   et une fois le titre posé, pour ne pas disputer le fil principal. */
const GlobePoints = dynamic(() => import("@/components/globe/InteractiveGlobeIcons"), {
  ssr: false,
  loading: () => null,
});

function Mots({ texte, depart = 0 }: { texte: string; depart?: number }) {
  return (
    <>
      {texte.split(" ").map((m, i) => (
        <span key={`${m}-${i}`} className="ax-mot">
          <span style={{ "--i": i + depart } as React.CSSProperties}>{m}&nbsp;</span>
        </span>
      ))}
    </>
  );
}

function Ouverture({ reperes, donnees, annee, dette }: Props) {
  const top = useMemo(
    () =>
      Object.values(donnees)
        .filter((d): d is FichePays & { pib: number } => typeof d.pib === "number")
        .sort((a, b) => b.pib - a.pib),
    [donnees],
  );
  const pibMonde = reperes.find((r) => r.nom === "PIB mondial");
  const pop = reperes.find((r) => r.nom === "Population");

  /* Le globe arrive après le titre ; sa teinte suit le thème du site. */
  const [globe, setGlobe] = useState(false);
  const [sombre, setSombre] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setGlobe(true), 120);
    const lit = () => setSombre(document.documentElement.dataset.concept !== "clair");
    lit();
    const o = new MutationObserver(lit);
    o.observe(document.documentElement, { attributes: true, attributeFilter: ["data-concept"] });
    return () => {
      window.clearTimeout(t);
      o.disconnect();
    };
  }, []);

  /* Les chiffres sont posés sur la sphère, à de vraies coordonnées : ils
     tournent avec elle, et il faut la faire tourner pour tous les voir. */
  const marqueurs = useMemo(
    () => [
      { id: "pib", lat: 42, lon: -96, icon: Landmark, texte: { chiffre: pibMonde?.valeur ?? "—", label: `PIB mondial ${annee}` } },
      { id: "top", lat: 34, lon: 108, icon: Landmark, texte: { chiffre: top[0] ? fmtPib(top[0].pib) : "—", label: top[0]?.fr ?? "1re économie" } },
      { id: "pop", lat: 8, lon: 22, icon: Users, texte: { chiffre: pop?.valeur ?? "—", label: "Population" } },
      { id: "fr", lat: 47, lon: 3, icon: Banknote, texte: { chiffre: `${nf(dette.ratio)} %`, label: "Dette France / PIB" } },
      { id: "pays", lat: -18, lon: -58, icon: Globe, texte: { chiffre: "200+", label: "pays suivis" } },
    ],
    [pibMonde, pop, top, annee, dette.ratio],
  );

  return (
    <header className="ax-ouv">
      <div className="ax-ouv-g">
        <div className="ax-ouv-t">
          <h1 className="ax-h1">
            <Mots texte="Visualize" />
          </h1>
          <p className="ax-ouv-s ax-in" style={{ "--d": "500ms" } as React.CSSProperties}>
            Chaque chiffre du monde, enfin lisible.
          </p>
          <div className="ax-ouv-c ax-in" style={{ "--d": "650ms" } as React.CSSProperties}>
            <a className="ax-bouton ax-bouton-vif" href="#presentation">
              Explorer notre site <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="ax-globe-zone">
          <div className="ax-globe-halo" aria-hidden="true" />
          <div className="ax-globe-c">
            {globe && (
              <GlobePoints
                markers={marqueurs}
                accent="#8b5cff"
                sphereColor={sombre ? "#15102c" : "#e9e3fb"}
                badgeBackground={sombre ? "rgba(22,17,44,0.82)" : "rgba(255,255,255,0.9)"}
                badgeShadow={
                  sombre
                    ? "0 12px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(165,131,255,0.35)"
                    : "0 12px 28px rgba(60,30,140,0.22), 0 0 0 1px rgba(91,45,224,0.18)"
                }
                iconColor={sombre ? "#cdbcff" : "#5b2de0"}
                carte={
                  sombre
                    ? undefined
                    : { fond: "rgba(255,255,255,0.82)", bord: "rgba(91,45,224,0.16)", ombre: "0 12px 28px rgba(60,30,140,0.2)", chiffre: "#17112e", label: "rgba(23,17,46,0.62)" }
                }
                markerSize="clamp(30px, 3.4vw, 40px)"
                atmosphere={false}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1 bis · CE QUE NOUS FAISONS — un tableau de bord de quatre blocs
   ═══════════════════════════════════════════════════════════════════════════ */

function Presentation() {
  return (
    <section className="ax-sec" id="presentation" aria-labelledby="ax-pr-t">
      <Rev as="h2" className="ax-h2">
        <span id="ax-pr-t">Nos fonctionnalités</span>
      </Rev>
      <Rev as="p" className="ax-sous ax-sous-ligne" d={80}>
        Des chiffres rassemblés, des globes à manipuler, des articles pour comprendre et un forum pour en discuter.
      </Rev>
      <div className="ax-dash">
        <Lift>
        <Rev as="a" href="#direct" className="ax-bloc ax-bloc-a" d={0}>
          <span className="ax-bloc-i"><Activity size={18} aria-hidden="true" /></span>
          <h3>Des données en temps réel</h3>
          <p>PIB, dépenses, naissances, décès : des compteurs qui avancent à la seconde.</p>
          <span className="ax-bloc-l">Voir les compteurs <ArrowUpRight size={14} aria-hidden="true" /></span>
        </Rev>
        </Lift>
        <Lift>
        <Rev as="a" href="/economie" className="ax-bloc ax-bloc-b" d={90}>
          <span className="ax-bloc-i"><Globe size={18} aria-hidden="true" /></span>
          <h3>Des globes interactifs</h3>
          <p>Plus de 200 pays, de 1960 à aujourd’hui, à tourner, comparer, zoomer.</p>
          <span className="ax-bloc-l">Ouvrir les globes <ArrowUpRight size={14} aria-hidden="true" /></span>
        </Rev>
        </Lift>
        <Lift>
        <Rev as="a" href="/pays/france/dette-publique" className="ax-bloc ax-bloc-c" d={180}>
          <span className="ax-bloc-i"><BookOpen size={18} aria-hidden="true" /></span>
          <h3>Des articles décortiqués</h3>
          <p>Le montant d’abord, l’explication ensuite, la source toujours.</p>
          <span className="ax-bloc-l">Lire un dossier <ArrowUpRight size={14} aria-hidden="true" /></span>
        </Rev>
        </Lift>
        <Lift>
        <Rev as="a" href="/forum" className="ax-bloc ax-bloc-d" d={270}>
          <span className="ax-bloc-i"><MessageCircle size={18} aria-hidden="true" /></span>
          <h3>Un forum pour en débattre</h3>
          <p>Posez vos questions, contestez un chiffre, comparez vos lectures.</p>
          <span className="ax-bloc-l">Rejoindre le forum <ArrowUpRight size={14} aria-hidden="true" /></span>
        </Rev>
        </Lift>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2 · EN DIRECT — la page s'arrête, les chiffres tournent, puis ce que l'on fait
   ═══════════════════════════════════════════════════════════════════════════ */

const AN_SECONDES = 365.2425 * 24 * 3600;
const EPOQUE_DEPENSES = Date.UTC(2026, 0, 1);
const DIRECT = [
  { nom: "PIB mondial", unite: " Md $", dec: 3, note: "Produit intérieur brut du monde, ramené à la seconde" },
  { nom: "Dépenses militaires", parSeconde: 55_160, unite: " $", dec: 0, note: "Dans le monde, depuis le 1er janvier 2026" },
  { nom: "Dépenses médicales", parSeconde: 200_130, unite: " $", dec: 0, note: "Dans le monde, depuis le 1er janvier 2026" },
  { nom: "Dépenses éducatives", parSeconde: 132_610, unite: " $", dec: 0, note: "Dans le monde, depuis le 1er janvier 2026" },
  { nom: "Population mondiale", unite: "", dec: 0, note: "Au rythme des naissances et des décès de l'année, depuis le 1er janvier" },
] as const;

/** Sur téléphone, la liste des rubriques devient un rail : la rubrique en cours
    est au centre, ses voisines s'estompent de part et d'autre, et le rail glisse
    quand elle change. Sur grand écran la liste reste une liste (le CSS ignore --dx). */
function useCentre(actif: number) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const pose = () => {
      const w = ref.current;
      const ol = w?.querySelector("ol");
      const li = ol?.children[actif] as HTMLElement | undefined;
      if (!w || !ol || !li) return;
      ol.style.setProperty("--dx", `${w.clientWidth / 2 - (li.offsetLeft + li.offsetWidth / 2)}px`);
    };
    pose();
    window.addEventListener("resize", pose);
    void document.fonts?.ready.then(pose);
    return () => window.removeEventListener("resize", pose);
  }, [actif]);
  return ref;
}

function EnDirect({ pib, population }: { pib: Props["pib"]; population: Props["population"] }) {
  const zone = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  const [p, setP] = useState(0);
  const total = DIRECT.length;

  const departAnnee = useMemo(() => {
    const t = new Date(new Date().getFullYear(), 0, 1).getTime();
    return performance.now() - (Date.now() - t);
  }, []);
  const departDepenses = useMemo(() => performance.now() - (Date.now() - EPOQUE_DEPENSES), []);

  useEffect(() => {
    let rendez = false;
    const lis = () => {
      rendez = false;
      const z = zone.current;
      if (!z) return;
      const b = z.getBoundingClientRect();
      const course = b.height - window.innerHeight;
      const u = course > 0 ? Math.min(1, Math.max(0, -b.top / course)) : 0;
      setP(u);
      setN(Math.min(total - 1, Math.floor(u * total)));
    };
    const plan = () => {
      if (!rendez) {
        rendez = true;
        requestAnimationFrame(lis);
      }
    };
    window.addEventListener("scroll", plan, { passive: true });
    window.addEventListener("resize", plan);
    lis();
    return () => {
      window.removeEventListener("scroll", plan);
      window.removeEventListener("resize", plan);
    };
  }, [total]);

  const saute = (i: number) => {
    const z = zone.current;
    if (!z) return;
    const course = z.offsetHeight - window.innerHeight;
    window.scrollTo({ top: z.offsetTop + ((i + 0.5) / total) * course, behavior: "smooth" });
  };

  const d = n < DIRECT.length ? DIRECT[n] : null;
  const rail = useCentre(Math.min(n, DIRECT.length - 1));

  return (
    <section
      ref={zone}
      className="ax-cles" id="direct"
      style={{ height: `${total * 58 + 40}vh`, "--p": p, "--t": n } as React.CSSProperties}
      aria-label="Données en temps réel"
    >
      <div className="ax-cles-col">
        <div className="ax-cles-lueur" aria-hidden="true" />
        <div className="ax-cles-g">
          <div className="ax-cles-gauche">
            <p className="ax-etiq">En temps réel</p>
            <div key={n} className="ax-cles-bloc">
              {d ? (
                <>
                  {(() => {
                    const estPib = d.nom === "PIB mondial";
                    const estPop = d.nom === "Population mondiale";
                    const rythme = estPop ? population.parSeconde : "parSeconde" in d ? d.parSeconde : pib.total / AN_SECONDES;
                    const base = estPop ? population.total : 0;
                    const origine = "parSeconde" in d ? departDepenses : departAnnee;
                    return (
                      <>
                        <p className="ax-cles-v ax-cles-v-d">
                          <Odometre valeur={base} parSeconde={rythme} depuis={origine} dec={d.dec} unite={d.unite} />
                        </p>
                        <p className="ax-cles-n">{d.nom}</p>
                        {/* Le même montant, dit en toutes lettres : il bouge moins vite, et se lit d'un coup d'œil. */}
                        <Lettres
                          className="ax-cles-lettres"
                          base={base}
                          parSeconde={estPib ? rythme * 1e9 : rythme}
                          depuis={origine}
                          mot={estPop ? "habitants" : "dollars"}
                        />
                        <p className="ax-cles-note">{d.note}</p>
                      </>
                    );
                  })()}
                </>
              ) : null}
            </div>
          </div>
          <div className="ax-rail-c" ref={rail}>
          <ol className="ax-cles-liste" aria-label="Choisir un chiffre">
            {DIRECT.map((x) => x.nom).map((nom, i) => (
              <li key={nom}>
                <button type="button" className={i === n ? "ax-cles-on" : undefined} onClick={() => saute(i)}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {nom}
                </button>
              </li>
            ))}
          </ol>
          </div>
        </div>
        <div className="ax-cles-rail" aria-hidden="true" style={{ opacity: p > 0.985 ? 0 : 1 }}>
          <span style={{ transform: `scaleX(${p})` }} />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3 · LES CLASSEMENTS — le podium en haut, la suite en dessous, le tout défile
   ═══════════════════════════════════════════════════════════════════════════ */

const INDICS = [
  { id: "pib", label: "PIB", titre: "Les plus grandes économies", unite: "md", href: "/economie" },
  { id: "pibHab", label: "PIB par habitant", titre: "Les pays les plus riches par habitant", unite: "usd", href: "/economie" },
  { id: "dette", label: "Dette publique", titre: "Les pays les plus endettés", unite: "pct", href: "/economie" },
  { id: "population", label: "Population", titre: "Les pays les plus peuplés", unite: "hab", href: "/demographie" },
] as const;

function fmt(v: number, u: (typeof INDICS)[number]["unite"]) {
  /* Espaces insécables : un compteur ne doit jamais passer sur deux lignes pendant qu'il roule. */
  if (u === "hab") return `${nf(v, v >= 100 ? 0 : 1)}\u00a0M`;
  if (u === "pct") return `${nf(v)}\u00a0%`;
  if (u === "usd") return `${Math.round(v).toLocaleString("fr-FR")}\u00a0$`;
  return fmtPib(v);
}

/** Un texte qui se renouvelle sans que son cadre bouge : seul lui rejoue un fondu. */
function Change({ texte }: { texte: string }) {
  return (
    <span key={texte} className="ax-change">
      {texte}
    </span>
  );
}

function Classements({ donnees, annee }: { donnees: Record<string, FichePays>; annee: number }) {
  const fiches = useMemo(
    () =>
      INDICS.map((ind) => {
        const l = Object.values(donnees)
          .map((d) => ({ fr: d.fr, v: d[ind.id] ?? null }))
          .filter((o): o is { fr: string; v: number } => typeof o.v === "number" && Number.isFinite(o.v))
          .sort((a, b) => b.v - a.v)
          .slice(0, 8);
        return { ...ind, lignes: l };
      }),
    [donnees],
  );

  const zone = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  const [p, setP] = useState(0);
  useEffect(() => {
    let rendez = false;
    const lis = () => {
      rendez = false;
      const z = zone.current;
      if (!z) return;
      const b = z.getBoundingClientRect();
      const course = b.height - window.innerHeight;
      const u = course > 0 ? Math.min(1, Math.max(0, -b.top / course)) : 0;
      setP(u);
      setN(Math.min(fiches.length - 1, Math.floor(u * fiches.length)));
    };
    const plan = () => {
      if (!rendez) {
        rendez = true;
        requestAnimationFrame(lis);
      }
    };
    window.addEventListener("scroll", plan, { passive: true });
    window.addEventListener("resize", plan);
    lis();
    return () => {
      window.removeEventListener("scroll", plan);
      window.removeEventListener("resize", plan);
    };
  }, [fiches.length]);

  const rail = useCentre(n);
  const f = fiches[n];
  /* Le podium se lit 2 · 1 · 3 : le premier au milieu, plus haut. Les cellules
     gardent leur place d'un classement à l'autre — seuls les noms et les
     montants changent. */
  const ordre = [1, 0, 2];

  return (
    <section
      ref={zone}
      className="ax-cl2"
      id="classements"
      style={{ height: `${fiches.length * 50 + 40}vh` }}
      aria-labelledby="ax-cl-t"
    >
      <div className="ax-cl2-colle">
        <div className="ax-cl2-g">
          <div className="ax-cl2-gauche">
            <h2 id="ax-cl-t" className="ax-h2">Nos classements</h2>
            {/* Les titres ne se cliquent pas : ils suivent le défilement. */}
            <div className="ax-rail-c" ref={rail}>
            <ol className="ax-cl2-liste">
              {fiches.map((x, i) => (
                <li key={x.id} className={i === n ? "ax-cl2-on" : i < n ? "ax-cl2-fait" : undefined}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {x.label}
                </li>
              ))}
            </ol>
            </div>
            <div className="ax-cl2-rail" aria-hidden="true"><span style={{ transform: `scaleY(${p})` }} /></div>
          </div>

          <div className="ax-cl2-carte">
            <p className="ax-cl2-t"><Change texte={f.titre} /></p>
            <div className="ax-pod2">
              {ordre.map((i) => {
                const o = f.lignes[i];
                return (
                  <div key={i} className={`ax-pod2-c ax-pod2-${i + 1}`}>
                    <span className="ax-pod2-r">{i + 1}</span>
                    <span className="ax-pod2-n"><Change texte={o?.fr ?? ""} /></span>
                    <span className="ax-pod2-v"><Roule v={o?.v ?? null} f={(x) => fmt(x, f.unite)} /></span>
                  </div>
                );
              })}
            </div>
            <ol className="ax-suite" start={4}>
              {[3, 4, 5, 6, 7].map((i) => {
                const o = f.lignes[i];
                return (
                  <li key={i}>
                    <i className="ax-suite-b" style={{ width: o && f.lignes[0] ? `${Math.max(6, (o.v / f.lignes[0].v) * 100)}%` : "0%" }} />
                    <span className="ax-suite-r">{i + 1}</span>
                    <span className="ax-suite-n"><Change texte={o?.fr ?? ""} /></span>
                    <span className="ax-suite-v"><Roule v={o?.v ?? null} f={(x) => fmt(x, f.unite)} /></span>
                  </li>
                );
              })}
            </ol>
            <div className="ax-cl2-pied">
              <p className="ax-source">Banque mondiale (WDI), FMI · {annee}</p>
              <a className="ax-voir ax-voir-l" href={f.href}>
                En voir plus <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4 · NOS GLOBES INTERACTIFS
   ═══════════════════════════════════════════════════════════════════════════ */

function Cartes() {
  const items = [
    { href: "/economie", classe: "eco", titre: "Économie", ligne: "PIB, dette, chômage, inflation, balance. 200 pays, de 1960 à aujourd'hui.", icone: Landmark },
    { href: "/demographie", classe: "dem", titre: "Démographie", ligne: "Population, naissances, décès et causes de mortalité, en temps réel.", icone: Users },
  ];
  return (
    <section className="ax-sec ax-sec-large" id="cartes" aria-labelledby="ax-ca-t">
      <Rev as="h2" className="ax-h2">
        <span id="ax-ca-t">Nos globes interactifs</span>
      </Rev>
      <div className="ax-cartes">
        {items.map((g, i) => {
          const Ic = g.icone;
          return (
            <Lift key={g.href}>
            <Rev as="a" href={g.href} className={`ax-globe ax-globe-${g.classe}`} d={i * 120}>
              <span className="ax-sph" aria-hidden="true"><i /><b /></span>
              <span className="ax-globe-i"><Ic size={18} aria-hidden="true" /></span>
              <h3>{g.titre}</h3>
              <p>{g.ligne}</p>
              <span className="ax-globe-cta">
                Ouvrir le globe <ArrowUpRight size={15} aria-hidden="true" />
              </span>
            </Rev>
            </Lift>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5 · NOS ARTICLES — un grand chiffre, une file d'articles, le forum
   ═══════════════════════════════════════════════════════════════════════════ */

const FILE_ARTICLES = [
  { rubrique: "Économie", titre: "PIB mondial : qui produit quoi" },
  { rubrique: "Démographie", titre: "Naissances et décès dans le monde, depuis le 1er janvier" },
  { rubrique: "Démographie", titre: "Les causes de mortalité, pays par pays" },
  { rubrique: "Démographie", titre: "Population : qui grandit, qui recule" },
] as const;

function Articles({ dette, lus = [] }: { dette: Props["dette"]; lus?: { rubrique: string; titre: string; href: string }[] }) {
  const glisse = useGlisser<HTMLUListElement>();
  /* La vague se rejoue à chaque retour sur la section (elle se réarme quand la file sort de l'écran), jamais quand on la fait défiler. */
  useEffect(() => {
    const el = glisse.ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.35) {
          if (el.dataset.vague === "1") return;
          el.dataset.vague = "0";
          void el.offsetWidth; // relance l'animation depuis le début
          el.dataset.vague = "1";
        } else if (!e.isIntersecting) {
          delete el.dataset.vague;
        }
      },
      { threshold: [0, 0.35] },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className="ax-sec ax-sec-large" id="articles" aria-labelledby="ax-ar-t">
      <Rev as="h2" className="ax-h2">
        <span id="ax-ar-t">Nos articles</span>
      </Rev>
      <div className="ax-na">
        <Lift>
        <Rev as="a" href="/pays/france/dette-publique" className="ax-dos ax-dos-une ax-na-une" d={0}>
          <span className="ax-dos-e">Dette publique · France</span>
          <p className="ax-dos-v">
            {nf(dette.montant)}
            <small>Md€</small>
          </p>
          <p className="ax-dos-s">{nf(dette.ratio)} % du PIB · déficit de {nf(dette.deficit)} Md€ en 2025</p>
          <span className="ax-dos-c">
            Lire l’analyse <ArrowRight size={15} aria-hidden="true" />
          </span>
        </Rev>
        </Lift>

        <Rev className="ax-na-rail" d={120}>
          <ul className="ax-na-piste" {...glisse}>
            {[...lus, ...FILE_ARTICLES].map((a, i) => {
              const lien = "href" in a ? a.href : undefined;
              const corps = (
                <>
                  <span className="ax-na-r">{a.rubrique}</span>
                  <span className="ax-na-t">{a.titre}</span>
                  {lien ? (
                    <ArrowUpRight size={18} aria-hidden="true" className="ax-na-f" />
                  ) : (
                    <em>Bientôt</em>
                  )}
                </>
              );
              return (
                <li
                  key={a.titre}
                  className={`ax-na-c ax-na-c${i % 4}`}
                  style={{ "--i": i, "--v": `${Math.round(Math.sin(i * 0.85) * 34)}px` } as React.CSSProperties}
                >
                  {lien ? <a href={lien}>{corps}</a> : <div className="ax-na-attente">{corps}</div>}
                </li>
              );
            })}
          </ul>
        </Rev>

        <Lift>
        <Rev as="a" href="/forum" className="ax-dos ax-na-forum" d={200}>
          <span className="ax-bloc-i"><MessageCircle size={18} aria-hidden="true" /></span>
          <div>
            <h3>Un forum pour en débattre</h3>
            <p>Posez vos questions, contestez un chiffre, comparez vos lectures.</p>
          </div>
          <ArrowUpRight size={20} aria-hidden="true" className="ax-dos-fl" />
        </Rev>
        </Lift>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5 bis · NOTRE PLACE — entre le média et le site de données
   ═══════════════════════════════════════════════════════════════════════════ */

const SOURCES_FLUX = [
  { nom: "Médias", pastilles: ["Presse", "Télévision", "Agences"] },
  { nom: "Sites de données", pastilles: ["Worldometer", "Statista", "Bases ouvertes"] },
  { nom: "Institutions", pastilles: ["Banque mondiale", "FMI", "ONU", "INSEE"] },
] as const;

const SORTIES = ["Interprétation et décortication des chiffres", "Globes interactifs", "Données en temps réel", "Plus de 1 000 sources fiables"];

function Position() {
  return (
    <section className="ax-sec ax-sec-large" id="position" aria-labelledby="ax-po-t">
      <Rev as="h2" className="ax-h2">
        <span id="ax-po-t">Pourquoi Visualize ?</span>
      </Rev>
      <Rev as="p" className="ax-sous ax-sous-ligne" d={80}>
        Ce qui nous différencie : à la jonction des médias et des sites de données, tout arrive au même endroit, clair et condensé.
      </Rev>
      <Rev className="ax-flux" d={120}>
        <svg className="ax-flux-svg" viewBox="0 0 1000 320" aria-hidden="true" preserveAspectRatio="none">
          <defs>
            <marker id="ax-fl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M1 1 L9 5 L1 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>
          <path className="ax-flux-l" style={{ "--k": 0 } as React.CSSProperties} d="M340 52 C 420 52, 420 160, 452 160" markerEnd="url(#ax-fl)" />
          <path className="ax-flux-l" style={{ "--k": 1 } as React.CSSProperties} d="M340 160 L 452 160" markerEnd="url(#ax-fl)" />
          <path className="ax-flux-l" style={{ "--k": 2 } as React.CSSProperties} d="M340 268 C 420 268, 420 160, 452 160" markerEnd="url(#ax-fl)" />
          <path className="ax-flux-l" style={{ "--k": 3 } as React.CSSProperties} d="M548 160 L 652 160" markerEnd="url(#ax-fl)" />
        </svg>
        <div className="ax-flux-g">
          {SOURCES_FLUX.map((g, k) => (
            <div key={g.nom} className="ax-flux-grp" style={{ "--k": k } as React.CSSProperties}>
              <b>{g.nom}</b>
              <span>
                {g.pastilles.map((x) => (
                  <i key={x}>{x}</i>
                ))}
              </span>
            </div>
          ))}
        </div>
        <div className="ax-flux-v">
          <span className="ax-flux-halo" />
          <span className="ax-flux-logo">
            <BarChart3 size={22} aria-hidden="true" />
          </span>
          <strong>Visualize</strong>
        </div>
        <div className="ax-flux-s">
          {SORTIES.map((x, k) => (
            <span key={x} style={{ "--k": k } as React.CSSProperties}>
              {x}
            </span>
          ))}
        </div>
      </Rev>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   6 · NOTRE FONCTIONNEMENT — une ligne qui se remplit, des sources qui défilent
   ═══════════════════════════════════════════════════════════════════════════ */

const SOURCES_DEFILE = [
  "Banque mondiale",
  "FMI",
  "Nations Unies",
  "INSEE",
  "Eurostat",
  "OCDE",
  "Banque de France",
  "Agence France Trésor",
  "OMS",
  "OIT",
];

/** Les sources, en défilement continu : on peut les saisir à la souris, les faire glisser
    au doigt, et elles reprennent leur course ensuite. */
function Defile() {
  const arret = useRef(false);
  const glisse = useGlisser<HTMLDivElement>((actif) => {
    arret.current = actif;
  });
  const piste = glisse.ref;
  useEffect(() => {
    const el = piste.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = 0;
    let pos = el.scrollLeft;
    const pas = () => {
      const moitie = el.scrollWidth / 2;
      if (!arret.current && moitie > 0) {
        if (Math.abs(el.scrollLeft - pos) > 1.5) pos = el.scrollLeft;
        pos += 0.55;
        if (pos >= moitie) pos -= moitie;
        el.scrollLeft = pos;
      } else {
        pos = el.scrollLeft;
      }
      /* Au-delà de la moitié (au doigt ou à la souris), on reboucle sans à-coup. */
      if (el.scrollLeft >= moitie) el.scrollLeft -= moitie;
      else if (el.scrollLeft <= 0 && moitie > 0 && arret.current) el.scrollLeft += moitie;
      id = requestAnimationFrame(pas);
    };
    id = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(id);
  }, [piste]);
  return (
    <div className="ax-defile" aria-label="Nos sources" {...glisse}>
      <div className="ax-defile-p">
        {[...SOURCES_DEFILE, ...SOURCES_DEFILE].map((s, i) => (
          <span key={`${s}-${i}`} aria-hidden={i >= SOURCES_DEFILE.length ? "true" : undefined}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function Fonctionnement() {
  const zone = useRef<HTMLOListElement>(null);

  useEffect(() => {
    let rendez = false;
    const lis = () => {
      rendez = false;
      const z = zone.current;
      if (!z) return;
      const b = z.getBoundingClientRect();
      const u = Math.min(1, Math.max(0, (window.innerHeight * 0.62 - b.top) / b.height));
      z.style.setProperty("--ligne", u.toFixed(3));
      z.querySelectorAll<HTMLElement>("li").forEach((li, i, tous) => {
        const seuil = (i + 0.4) / tous.length;
        li.toggleAttribute("data-atteint", u >= seuil);
      });
    };
    const plan = () => {
      if (!rendez) {
        rendez = true;
        requestAnimationFrame(lis);
      }
    };
    window.addEventListener("scroll", plan, { passive: true });
    window.addEventListener("resize", plan);
    lis();
    return () => {
      window.removeEventListener("scroll", plan);
      window.removeEventListener("resize", plan);
    };
  }, []);

  return (
    <section className="ax-sec" id="fonctionnement" aria-labelledby="ax-fo-t">
      <Rev as="h2" className="ax-h2">
        <span id="ax-fo-t">Notre fonctionnement</span>
      </Rev>
      <Rev as="p" className="ax-sous" d={80}>
        Rien ne sort qui n’ait été vu par plusieurs sources. Les convergences font la donnée, les
        divergences font l’article.
      </Rev>

      <Defile />

      <ol ref={zone} className="ax-etapes">
        <span className="ax-etapes-fil" aria-hidden="true" />
        {ETAPES.map((e) => (
          <li key={e.n}>
            <span className="ax-etape-p">
              <Check size={14} aria-hidden="true" />
            </span>
            <div className="ax-etape-c">
              <span className="ax-etape-n">{e.n}</span>
              <h3>{e.titre}</h3>
              <p>{e.ligne}</p>
            </div>
          </li>
        ))}
      </ol>

      <Rev className="ax-sortie">
        <Sparkles size={22} aria-hidden="true" />
        <p>
          <b>Visualize</b> : recoupé, daté, sourcé.
        </p>
        <span>100 % gratuit pour nos lecteurs</span>
      </Rev>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export function AnalysesPage(props: Props) {
  const racine = useRef<HTMLDivElement>(null);
  useApparitions(racine);

  return (
    <div className="cg ax" ref={racine}>
      <EnTete />
      <div className="ax-fond" aria-hidden="true" />
      <FondCourbes racine={racine} />

      <Ouverture {...props} />
      <div className="ax-col ax-col-haut">
        <Presentation />
      </div>
      <EnDirect pib={props.pib} population={props.population} />

      <div className="ax-col">
        <Classements donnees={props.donnees} annee={props.annee} />
        <Cartes />
        <Articles dette={props.dette} lus={props.articlesDette} />
        <Position />
        <Rev className="ax-presse">
          <PresseCarousel
            id="presse"
            titre="Ils en parlent"
            intro="Les grands médias qui traitent de ces sujets : nos sources, et de quoi aller plus loin."
            citations={PRESSE_MONDE}
          />
        </Rev>
        <Fonctionnement />

        <div className="sg ax-faq">
          <Faq titre="Questions fréquentes" questions={FAQ_ACCUEIL} />
        </div>

        <Rev className="ax-fin">
          <h2>Prêt à explorer ?</h2>
          <div>
            <a className="ax-bouton ax-bouton-blanc" href="/economie">
              <Globe size={17} aria-hidden="true" /> Globe économie
            </a>
            <a className="ax-bouton ax-bouton-clair" href="/demographie">
              <Users size={17} aria-hidden="true" /> Globe démographie
            </a>
          </div>
        </Rev>
      </div>

      {/* Un horizon pour finir : la moitié d'une planète qui se lève. */}
      <div className="ax-horizon" aria-hidden="true">
        <span className="ax-hz-etoiles" />
        <span className="ax-hz-aurore" />
        <span className="ax-hz-orbite ax-hz-orbite-1"><em /></span>
        <span className="ax-hz-orbite ax-hz-orbite-2"><em /></span>
        <span className="ax-hz-astre"><i /><b /><u /></span>
      </div>

      <Pied />
    </div>
  );
}

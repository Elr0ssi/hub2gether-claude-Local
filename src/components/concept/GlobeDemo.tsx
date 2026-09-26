"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FichePaysDemo } from "@/data/concept/conceptDemographie";
import { cle } from "@/data/concept/cle";

/* ═══════════════════════════════════════════════════════════════════════════
   LE GLOBE DÉMOGRAPHIQUE

   Le même tracé que GlobeMonde — projection orthographique en canvas 2D,
   pays vectorisés une fois pour toutes — mais sur le fond de carte à 50m
   (231 entités) plutôt que le 110m (177) : les petits territoires du socle
   démographique (îles, micro-États) n'existent qu'à cette résolution.

   Les valeurs viennent du socle des Nations Unies, pas de la maquette.
   ═══════════════════════════════════════════════════════════════════════════ */

const RAD = Math.PI / 180;

const ARC = (t: number) => (Math.asin(Math.max(-1, Math.min(1, t))) * 180) / Math.PI;

const ecart = (x: number, ref: number) => Math.abs(((x - ref + 540) % 360) - 180);
const plusProche = (cands: number[], ref: number) =>
  cands
    .map((x) => ((x + 540) % 360) - 180)
    .reduce((m, x) => (ecart(x, ref) < ecart(m, ref) ? x : m));

type Anneau = [number, number][];
interface Pays {
  nom: string;
  anneaux: Anneau[];
  vecteurs: Float64Array[];
  coupe: boolean[];
  centre: [number, number];
  aire: number;
}

interface Props {
  donnees: Record<string, FichePaysDemo>;
  choisi?: string | null;
  onChoisi?: (nom: string | null) => void;
  indicateurs?: Indic[];
  montrerRegions?: boolean;
  montrerIndicateurs?: boolean;
  regionPilotee?: string;
  indicateurPilote?: Indic;
  explorable?: boolean;
  sousLeGlobe?: React.ReactNode;
  annee: number;
  regions: readonly { id: string; label: string; pays: readonly string[] }[];
  vues: Record<string, { lat: number; lon: number }>;
}

function fmt(v: number | null | undefined, genre: "hab" | "pour1000"): string {
  if (v === null || v === undefined) return "—";
  if (genre === "pour1000") return `${v.toFixed(1).replace(".", ",")} ‰`;
  const a = Math.abs(v);
  if (a >= 1e6) return `${(v / 1e6).toFixed(2).replace(".", ",")} M`;
  if (a >= 1e3) return `${(v / 1e3).toFixed(1).replace(".", ",")} k`;
  return `${Math.round(v).toLocaleString("fr-FR")}`;
}

export type Indic = "population" | "natalite" | "mortalite" | "croissance";

interface SpecIndic {
  id: Indic;
  label: string;
  genre: "hab" | "pour1000";
  forme: "log" | "signe";
  sens: 1 | -1;
  note: string;
}

const CATALOGUE: Record<Indic, SpecIndic> = {
  population: { id: "population", label: "Population", genre: "hab", forme: "log", sens: 1, note: "échelle logarithmique" },
  natalite: { id: "natalite", label: "Natalité", genre: "pour1000", forme: "log", sens: 1, note: "échelle logarithmique" },
  mortalite: { id: "mortalite", label: "Mortalité", genre: "pour1000", forme: "log", sens: 1, note: "échelle logarithmique" },
  croissance: { id: "croissance", label: "Accroissement naturel", genre: "pour1000", forme: "signe", sens: 1, note: "échelle centrée sur zéro" },
};

const DEFAUT: Indic[] = ["population", "natalite", "mortalite", "croissance"];

const INDIC_VERS_ADRESSE: Record<Indic, string> = {
  population: "population",
  natalite: "natalite",
  mortalite: "mortalite",
  croissance: "croissance",
};
function cleIndic(id: Indic): string {
  return INDIC_VERS_ADRESSE[id];
}

const BLEUS = [
  "#104281", "#184f95", "#1c5cab", "#256abf", "#2a78d6", "#3987e5",
  "#5598e7", "#6da7ec", "#86b6ef", "#9ec5f4", "#b7d3f6", "#cde2fb",
];

const DIVERGENTE = [
  "#b7d3f6", "#86b6ef", "#5598e7", "#2a78d6", "#1c5cab",
  "#5c6371",
  "#9c3737", "#bd3a3a", "#d03b3b", "#dc5a52", "#e6796b",
];

const SANS = "#1b212b";

function palier(rampe: string[], t: number): string {
  const i = Math.round(Math.max(0, Math.min(1, t)) * (rampe.length - 1));
  return rampe[i];
}

export function GlobeDemo({
  donnees,
  annee,
  regions,
  vues,
  choisi: choisiPilote,
  onChoisi,
  indicateurs = DEFAUT,
  montrerRegions = true,
  montrerIndicateurs = true,
  regionPilotee,
  indicateurPilote,
  explorable = true,
  sousLeGlobe,
}: Props) {
  const cv = useRef<HTMLCanvasElement>(null);
  const [pays, setPays] = useState<Pays[]>([]);
  const [choisiLocal, setChoisiLocal] = useState<string | null>(() => {
    if (regionPilotee) {
      const r = regions.find((x) => x.id === regionPilotee);
      const premier = r?.pays.find((n) => donnees[n]);
      if (premier) return premier;
    }
    return "France";
  });
  const choisi = choisiPilote !== undefined ? choisiPilote : choisiLocal;
  const setChoisi = useCallback(
    (n: string | null) => {
      if (onChoisi) onChoisi(n);
      else setChoisiLocal(n);
    },
    [onChoisi],
  );
  const [survol, setSurvol] = useState<string | null>(null);
  const [region, setRegion] = useState(regionPilotee ?? "monde");
  const [indic, setIndic] = useState<Indic>(indicateurPilote ?? (indicateurs[0] ?? "population"));

  useEffect(() => {
    if (regionPilotee === undefined || regionPilotee === region) return;
    setRegion(regionPilotee);
    const r = regions.find((x) => x.id === regionPilotee);
    const premier = r?.pays.find((n) => donnees[n]);
    if (premier) setChoisi(premier);
    const v = vues[regionPilotee];
    if (v) cible.current = { lon: v.lon, lat: v.lat };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionPilotee]);

  useEffect(() => {
    if (indicateurPilote === undefined) return;
    setIndic(indicateurPilote);
  }, [indicateurPilote]);

  const vueDepart = (regionPilotee && vues[regionPilotee]) || { lat: 14, lon: -30 };
  const cam = useRef({ lon: vueDepart.lon, lat: vueDepart.lat });
  const cible = useRef({ lon: vueDepart.lon, lat: vueDepart.lat });
  const glisse = useRef<{ x: number; y: number; a: number; b: number; lon: number; lat: number } | null>(null);
  const aBouge = useRef(false);
  const touche = useRef(false);
  const debut = useRef<number | null>(null);
  const fini = useRef(false);
  const [entre, setEntre] = useState(false);
  const refChoisi = useRef(choisi);
  const refSurvol = useRef(survol);
  const refRegion = useRef(region);
  refChoisi.current = choisi;
  refSurvol.current = survol;
  refRegion.current = region;

  /* ── Le tracé des pays ─────────────────────────────────────────────────── */
  useEffect(() => {
    let vivant = true;
    fetch("/geo/ne_50m_countries.geojson")
      .then((r) => r.json())
      .then((g: { features: { properties: { name?: string }; geometry: { type: string; coordinates: unknown } }[] }) => {
        if (!vivant) return;
        const out: Pays[] = [];
        for (const f of g.features) {
          const nom = f.properties?.name;
          if (!nom) continue;
          const brut =
            f.geometry.type === "Polygon"
              ? [f.geometry.coordinates as number[][][]]
              : (f.geometry.coordinates as number[][][][]);
          const anneaux: Anneau[] = [];
          const vecteurs: Float64Array[] = [];
          const coupe: boolean[] = [];
          let aire = 0;
          let plusGrand = { aire: -1, centre: [0, 0] as [number, number] };
          for (const poly of brut) {
            const ext = poly[0];
            if (!ext) continue;
            const a: Anneau = ext.map((c) => [c[0], c[1]] as [number, number]);
            anneaux.push(a);
            const v = new Float64Array(a.length * 3);
            let franchit = false;
            for (let i = 0; i < a.length; i++) {
              const lo = a[i][0] * RAD;
              const la = a[i][1] * RAD;
              const co = Math.cos(la);
              v[i * 3] = co * Math.sin(lo);
              v[i * 3 + 1] = Math.sin(la);
              v[i * 3 + 2] = co * Math.cos(lo);
              if (i > 0 && Math.abs(a[i][0] - a[i - 1][0]) > 180) franchit = true;
            }
            vecteurs.push(v);
            coupe.push(franchit);
            let lacet = 0;
            let gx = 0;
            let gy = 0;
            let deux = 0;
            let sx = 0;
            let sy = 0;
            for (let i = 0, j = a.length - 1; i < a.length; j = i++) {
              const k = Math.cos((((a[i][1] + a[j][1]) / 2) * Math.PI) / 180);
              lacet += (a[j][0] - a[i][0]) * (a[j][1] + a[i][1]) * k;
              const croix = a[j][0] * a[i][1] - a[i][0] * a[j][1];
              deux += croix;
              gx += (a[j][0] + a[i][0]) * croix;
              gy += (a[j][1] + a[i][1]) * croix;
              sx += a[i][0];
              sy += a[i][1];
            }
            const sa = Math.abs(lacet) / 2;
            aire += sa;
            const centreAnneau: [number, number] =
              Math.abs(deux) > 1e-9
                ? [gx / (3 * deux), gy / (3 * deux)]
                : [sx / a.length, sy / a.length];
            if (sa > plusGrand.aire) plusGrand = { aire: sa, centre: centreAnneau };
          }
          if (!anneaux.length) continue;
          out.push({ nom, anneaux, vecteurs, coupe, centre: plusGrand.centre, aire });
        }
        setPays(out);
      })
      .catch(() => {
        /* Le fond de carte n'a pas pu être chargé : le panneau reste utilisable. */
      });
    return () => {
      vivant = false;
    };
  }, []);

  useEffect(() => {
    const c = cv.current;
    if (!c) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      debut.current = performance.now() - 5000;
      setEntre(true);
      return;
    }
    let io: IntersectionObserver | null = null;
    const t = setTimeout(() => {
      io = new IntersectionObserver(
        (entrees) => {
          const dedans = Boolean(entrees[0]?.isIntersecting);
          if (dedans) {
            if (debut.current === null) debut.current = performance.now();
          } else {
            debut.current = null;
            fini.current = false;
            setEntre(false);
          }
        },
        { threshold: 0.4 },
      );
      io.observe(c);
    }, 700);
    return () => {
      clearTimeout(t);
      io?.disconnect();
    };
  }, []);

  /* ── Le rendu ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    const c = cv.current;
    if (!c || !pays.length) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const doux = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let L = 0;
    let H = 0;
    const redim = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      L = r.width;
      H = r.height;
      c.width = Math.round(L * dpr);
      c.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    redim();
    const ro = new ResizeObserver(redim);
    ro.observe(c);

    const hach = document.createElement("canvas");
    hach.width = 8;
    hach.height = 8;
    const hctx = hach.getContext("2d");
    if (hctx) {
      hctx.fillStyle = SANS;
      hctx.fillRect(0, 0, 8, 8);
      hctx.strokeStyle = "rgba(150,170,200,0.28)";
      hctx.lineWidth = 1;
      hctx.beginPath();
      hctx.moveTo(-2, 6);
      hctx.lineTo(6, -2);
      hctx.moveTo(2, 10);
      hctx.lineTo(10, 2);
      hctx.stroke();
    }
    const motif = hctx ? ctx.createPattern(hach, "repeat") : null;

    let brut = 0;
    const boucle = () => {
      const dl = ((cible.current.lon - cam.current.lon + 540) % 360) - 180;
      const dp = cible.current.lat - cam.current.lat;
      if (Math.abs(dl) < 0.05 && Math.abs(dp) < 0.05) {
        cam.current.lon = cible.current.lon;
        cam.current.lat = cible.current.lat;
      } else {
        cam.current.lon += dl * 0.07;
        cam.current.lat += dp * 0.07;
      }
      if (!doux && !touche.current && !glisse.current) {
        cam.current.lon += 0.035;
        cible.current.lon += 0.035;
      }
      cible.current.lon = ((cible.current.lon + 540) % 360) - 180;

      const brutAp = debut.current === null ? 0 : (performance.now() - debut.current) / 1050;
      const ap = Math.max(0, Math.min(1, brutAp));
      const e = 1 - Math.pow(1 - ap, 3);
      if (ap >= 1 && !fini.current) {
        fini.current = true;
        setEntre(true);
      }
      const tour = (1 - e) * (1 - e) * 330;

      const R = Math.min(L, H) * 0.44 * (0.07 + 0.93 * e);
      const cx = L / 2;
      const cy = H / 2 + (1 - e) * H * 0.5;
      const lonVue = cam.current.lon + tour;
      const sl = Math.sin(lonVue * RAD);
      const cl = Math.cos(lonVue * RAD);
      const sp = Math.sin(cam.current.lat * RAD);
      const cp = Math.cos(cam.current.lat * RAD);

      const proj = (lon: number, lat: number) => {
        const a = lon * RAD;
        const b = lat * RAD;
        const x = Math.cos(b) * Math.sin(a);
        const y = Math.sin(b);
        const z = Math.cos(b) * Math.cos(a);
        const x1 = x * cl - z * sl;
        const z1 = x * sl + z * cl;
        const y2 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        return { x: cx + x1 * R, y: cy - y2 * R, z: z2, visible: z2 > 0 };
      };

      ctx.clearRect(0, 0, L, H);
      if (e <= 0) {
        brut = requestAnimationFrame(boucle);
        return;
      }
      ctx.globalAlpha = e;

      const large = ctx.createRadialGradient(cx, cy, R * 0.72, cx, cy, R * 1.55);
      large.addColorStop(0, "rgba(64,120,220,0.22)");
      large.addColorStop(0.42, "rgba(70,130,230,0.11)");
      large.addColorStop(0.72, "rgba(80,140,235,0.04)");
      large.addColorStop(1, "rgba(80,140,235,0)");
      ctx.fillStyle = large;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.55, 0, Math.PI * 2);
      ctx.fill();

      const serre = ctx.createRadialGradient(cx, cy, R * 0.965, cx, cy, R * 1.11);
      serre.addColorStop(0, "rgba(150,205,255,0)");
      serre.addColorStop(0.32, "rgba(150,205,255,0.5)");
      serre.addColorStop(0.55, "rgba(120,180,250,0.24)");
      serre.addColorStop(1, "rgba(110,170,245,0)");
      ctx.fillStyle = serre;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.11, 0, Math.PI * 2);
      ctx.fill();

      const mer = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
      mer.addColorStop(0, "#0d1b3e");
      mer.addColorStop(0.7, "#070f24");
      mer.addColorStop(1, "#04081a");
      ctx.fillStyle = mer;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(120,170,255,0.09)";
      ctx.lineWidth = 0.6;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let ouvert = false;
        for (let lon = -180; lon <= 180; lon += 4) {
          const p = proj(lon, lat);
          if (!p.visible) {
            ouvert = false;
            continue;
          }
          if (ouvert) ctx.lineTo(p.x, p.y);
          else ctx.moveTo(p.x, p.y);
          ouvert = true;
        }
        ctx.stroke();
      }
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let ouvert = false;
        for (let lat = -90; lat <= 90; lat += 4) {
          const p = proj(lon, lat);
          if (!p.visible) {
            ouvert = false;
            continue;
          }
          if (ouvert) ctx.lineTo(p.x, p.y);
          else ctx.moveTo(p.x, p.y);
          ouvert = true;
        }
        ctx.stroke();
      }

      const sel = refChoisi.current;
      const sur = refSurvol.current;
      const dessinePays = (p: Pays, mode: "fond" | "survol" | "actif") => {
        ctx.beginPath();
        let quelqueChose = false;
        for (const v of p.vecteurs) {
          let ouvert = false;
          let ax = 0;
          let ay = 0;
          let az = 0;
          let premier = true;
          for (let i = 0; i < v.length; i += 3) {
            const x = v[i];
            const y = v[i + 1];
            const z = v[i + 2];
            const x1 = x * cl - z * sl;
            const z1 = x * sl + z * cl;
            const y2 = y * cp - z1 * sp;
            const z2 = y * sp + z1 * cp;

            if (!premier && az * z2 < 0) {
              const t = az / (az - z2);
              const bx = ax + (x1 - ax) * t;
              const by = ay + (y2 - ay) * t;
              const n = Math.hypot(bx, by) || 1;
              const sx = cx + (bx / n) * R;
              const sy = cy - (by / n) * R;
              if (ouvert) ctx.lineTo(sx, sy);
              else ctx.moveTo(sx, sy);
              ouvert = true;
              quelqueChose = true;
            }

            if (z2 > 0) {
              const sx = cx + x1 * R;
              const sy = cy - y2 * R;
              if (ouvert) ctx.lineTo(sx, sy);
              else ctx.moveTo(sx, sy);
              ouvert = true;
              quelqueChose = true;
            } else {
              ouvert = false;
            }

            ax = x1;
            ay = y2;
            az = z2;
            premier = false;
          }
          ctx.closePath();
        }
        if (!quelqueChose) return;
        const teinte = refCouleurs.current.get(p.nom);
        ctx.fillStyle = teinte ?? (motif ?? SANS);
        ctx.fill();
        if (mode === "actif") {
          ctx.shadowColor = "rgba(180,215,255,0.9)";
          ctx.shadowBlur = 24;
          ctx.strokeStyle = "rgba(240,248,255,0.98)";
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else if (mode === "survol") {
          ctx.fillStyle = "rgba(255,255,255,0.22)";
          ctx.fill();
          ctx.strokeStyle = "rgba(210,232,255,0.75)";
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.strokeStyle = "rgba(90,130,210,0.35)";
          ctx.lineWidth = 0.55;
          ctx.stroke();
        }
      };

      for (const p of pays) if (p.nom !== sel && p.nom !== sur) dessinePays(p, "fond");
      for (const p of pays) if (p.nom === sur && p.nom !== sel) dessinePays(p, "survol");
      for (const p of pays) if (p.nom === sel) dessinePays(p, "actif");

      ctx.save();
      ctx.shadowColor = "rgba(150,205,255,0.75)";
      ctx.shadowBlur = 16;
      ctx.strokeStyle = "rgba(186,222,255,0.8)";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.globalAlpha = 1;
      brut = requestAnimationFrame(boucle);
    };
    brut = requestAnimationFrame(boucle);
    return () => {
      cancelAnimationFrame(brut);
      ro.disconnect();
    };
  }, [pays, regions]);

  /* ── Le pointage ───────────────────────────────────────────────────────── */
  const disque = useCallback((ev: { clientX: number; clientY: number }) => {
    const c = cv.current;
    if (!c) return null;
    const r = c.getBoundingClientRect();
    const R = Math.min(r.width, r.height) * 0.44;
    if (R <= 0) return null;
    return {
      u: (ev.clientX - r.left - r.width / 2) / R,
      v: -(ev.clientY - r.top - r.height / 2) / R,
    };
  }, []);

  const versLonLat = useCallback(
    (ev: React.PointerEvent) => {
      const c = cv.current;
      if (!c) return null;
      const r = c.getBoundingClientRect();
      const R = Math.min(r.width, r.height) * 0.44;
      const dx = (ev.clientX - r.left - r.width / 2) / R;
      const dy = -(ev.clientY - r.top - r.height / 2) / R;
      const d2 = dx * dx + dy * dy;
      if (d2 > 1) return null;
      const z = Math.sqrt(1 - d2);
      const sp = Math.sin(cam.current.lat * RAD);
      const cp = Math.cos(cam.current.lat * RAD);
      const y1 = dy * cp + z * sp;
      const z1 = -dy * sp + z * cp;
      const sl = Math.sin(cam.current.lon * RAD);
      const cl = Math.cos(cam.current.lon * RAD);
      const x0 = dx * cl + z1 * sl;
      const z0 = -dx * sl + z1 * cl;
      const lat = Math.asin(Math.max(-1, Math.min(1, y1))) / RAD;
      const lon = Math.atan2(x0, z0) / RAD;
      return { lon, lat };
    },
    []
  );

  const paysSous = useCallback(
    (lon: number, lat: number) => {
      const tries = [...pays].sort((a, b) => a.aire - b.aire);
      for (const p of tries) {
        for (let k = 0; k < p.anneaux.length; k++) {
          const a = p.anneaux[k];
          const dec = p.coupe[k];
          const nx = (x: number) => (dec && x < 0 ? x + 360 : x);
          const px = dec && lon < 0 ? lon + 360 : lon;
          let dedans = false;
          for (let i = 0, j = a.length - 1; i < a.length; j = i++) {
            const xi = nx(a[i][0]);
            const yi = a[i][1];
            const xj = nx(a[j][0]);
            const yj = a[j][1];
            if (yi > lat !== yj > lat && px < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) dedans = !dedans;
          }
          if (dedans) return p;
        }
      }
      return null;
    },
    [pays]
  );

  /* ── L'échelle de couleurs ─────────────────────────────────────────────── */
  const echelle = useMemo(() => {
    const spec = CATALOGUE[indic] ?? CATALOGUE.population;
    const tri = Object.values(donnees)
      .map((d) => d[spec.id])
      .filter((v): v is number => typeof v === "number" && Number.isFinite(v))
      .sort((a, b) => a - b);
    const centile = (f: number) =>
      tri.length ? tri[Math.min(tri.length - 1, Math.max(0, Math.round(f * (tri.length - 1))))] : 0;

    const couleurs = new Map<string, string>();
    let gauche: string;
    let droite: string;
    let stops: string[];

    if (spec.forme === "log") {
      const bas = Math.max(centile(0.02), 0.01);
      const haut = Math.max(centile(1), bas * 10);
      const lb = Math.log10(bas);
      const lh = Math.log10(haut);
      for (const [nom, d] of Object.entries(donnees)) {
        const v = d[spec.id];
        if (typeof v !== "number" || !Number.isFinite(v) || v <= 0) continue;
        couleurs.set(nom, palier(BLEUS, (Math.log10(v) - lb) / (lh - lb)));
      }
      gauche = fmt(bas, spec.genre);
      droite = fmt(haut, spec.genre);
      stops = BLEUS;
    } else {
      const m = Math.max(Math.abs(centile(0.08)), Math.abs(centile(0.92)), 0.01);
      stops = spec.sens === 1 ? DIVERGENTE : [...DIVERGENTE].reverse();
      for (const [nom, d] of Object.entries(donnees)) {
        const v = d[spec.id];
        if (typeof v !== "number" || !Number.isFinite(v)) continue;
        couleurs.set(nom, palier(stops, (Math.max(-m, Math.min(m, v)) / m + 1) / 2));
      }
      const deborde = tri.length > 0 && (tri[0] < -m || tri[tri.length - 1] > m);
      gauche = (deborde ? "≤ " : "") + fmt(-m, spec.genre);
      droite = (deborde ? "≥ " : "") + fmt(m, spec.genre);
    }
    const absents = Object.keys(donnees).length - couleurs.size;
    return { spec, couleurs, gauche, droite, stops, absents };
  }, [donnees, indic]);

  const refCouleurs = useRef(echelle.couleurs);
  refCouleurs.current = echelle.couleurs;

  const fiche = choisi ? donnees[choisi] : undefined;
  const region_ =
    (choisi ? regions.find((r) => r.id !== "monde" && r.pays.includes(choisi)) : undefined) ??
    regions.find((r) => r.id === "monde");

  const rangMondial = useMemo(() => {
    const v = fiche ? fiche[echelle.spec.id] : null;
    if (typeof v !== "number" || !Number.isFinite(v)) return null;
    const mieux = Object.values(donnees).filter((d) => {
      const w = d[echelle.spec.id];
      return typeof w === "number" && Number.isFinite(w) && w > v;
    }).length;
    const total = Object.values(donnees).filter((d) => {
      const w = d[echelle.spec.id];
      return typeof w === "number" && Number.isFinite(w);
    }).length;
    return { rang: mieux + 1, total };
  }, [fiche, donnees, echelle]);

  return (
    <div className="gm">
      {montrerRegions && (
        <div className="gm-regions" role="tablist">
          {regions.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={region === r.id}
              className={`gm-region${region === r.id ? " gm-region-on" : ""}`}
              onClick={() => {
                setRegion(r.id);
                const premier = r.pays.find((n) => donnees[n]);
                if (premier) setChoisi(premier);
                const v = vues[r.id];
                if (v) cible.current = { lon: v.lon, lat: v.lat };
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}

      {montrerIndicateurs && (
        <div className="gm-indics" role="tablist" aria-label="Indicateur affiché">
          {indicateurs.map((k) => CATALOGUE[k]).map((i) => (
            <button
              key={i.id}
              type="button"
              role="tab"
              aria-selected={indic === i.id}
              className={`gm-indic${indic === i.id ? " gm-indic-on" : ""}`}
              onClick={() => setIndic(i.id)}
            >
              {i.label}
            </button>
          ))}
        </div>
      )}

      <div className="gm-corps">
        <div className="gm-colonne">
        <div className="gm-scene">
          <canvas
            ref={cv}
            className="gm-canvas"
            style={{ pointerEvents: entre ? "auto" : "none" }}
            onPointerDown={(e) => {
              const g = versLonLat(e);
              glisse.current = g
                ? { x: e.clientX, y: e.clientY, a: g.lon, b: g.lat, lon: cam.current.lon, lat: cam.current.lat }
                : null;
              aBouge.current = false;
              touche.current = true;
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (glisse.current) {
                const q = glisse.current;
                if (Math.abs(e.clientX - q.x) + Math.abs(e.clientY - q.y) > 3) aBouge.current = true;
                const d = disque(e);
                if (d) {
                  const cb = Math.cos(q.b * RAD);
                  let lon = q.lon;
                  if (cb > 0.08) {
                    const s0 = ARC(d.u / cb);
                    lon = plusProche([q.a - s0, q.a - (180 - s0)], q.lon);
                  }
                  const z1 = cb * Math.cos((q.a - lon) * RAD);
                  const yy = Math.sin(q.b * RAD);
                  const r = Math.hypot(yy, z1);
                  let lat = q.lat;
                  if (r > 1e-6) {
                    const k = (Math.acos(Math.max(-1, Math.min(1, d.v / r))) * 180) / Math.PI;
                    const phi = (Math.atan2(z1, yy) * 180) / Math.PI;
                    lat = plusProche([k - phi, -k - phi], q.lat);
                  }
                  lat = Math.max(-78, Math.min(78, lat));
                  cam.current.lon = lon;
                  cam.current.lat = lat;
                  cible.current.lon = lon;
                  cible.current.lat = lat;
                }
                return;
              }
              if (!explorable) return;
              const g = versLonLat(e);
              const p = g ? paysSous(g.lon, g.lat) : null;
              setSurvol(p?.nom ?? null);
            }}
            onPointerUp={(e) => {
              const bougeait = aBouge.current;
              glisse.current = null;
              if (bougeait || !explorable) return;
              const g = versLonLat(e);
              const p = g ? paysSous(g.lon, g.lat) : null;
              if (p) {
                touche.current = true;
                setChoisi(p.nom);
              }
            }}
            onPointerLeave={() => {
              glisse.current = null;
              setSurvol(null);
            }}
          />

          <div className="gm-echelle">
            <div className="gm-echelle-ligne">
              <span className="gm-echelle-b">{echelle.gauche}</span>
              <span
                className="gm-echelle-barre"
                style={{ background: `linear-gradient(90deg, ${echelle.stops.join(", ")})` }}
              />
              <span className="gm-echelle-b">{echelle.droite}</span>
            </div>
            <p className="gm-echelle-p">
              {echelle.spec.label} · {echelle.spec.note}
              {echelle.absents > 0 && (
                <>
                  {" · "}
                  <span className="gm-echelle-sans" aria-hidden="true" />
                  {echelle.absents} sans donnée
                </>
              )}
            </p>
          </div>

          <p className="gm-aide">
            {explorable ? "Faites tourner le globe · cliquez un pays" : "Faites tourner le globe"}
            {survol && <span className="gm-aide-survol"> — {donnees[survol]?.fr ?? survol}</span>}
          </p>
        </div>

        {sousLeGlobe && <div className="gm-sous">{sousLeGlobe}</div>}
        </div>

        <aside className="gm-panneau">
          <AnimatePresence mode="wait">
            <motion.div
              key={choisi ?? "vide"}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {fiche ? (
                <>
                  <p className="gm-panneau-sur">{region_?.label} · {annee}</p>
                  <h3 className="gm-panneau-t">{fiche.fr}</h3>

                  <p className="gm-vedette">{fmt(fiche[echelle.spec.id], echelle.spec.genre)}</p>
                  <p className="gm-vedette-l">
                    {echelle.spec.label}
                    {rangMondial && (
                      <>
                        {" · "}
                        <span className="gm-rang">
                          {rangMondial.rang}
                          <sup>e</sup> sur {rangMondial.total}
                        </span>
                      </>
                    )}
                  </p>

                  <dl className="gm-mesures">
                    {indicateurs
                      .map((k) => CATALOGUE[k])
                      .filter((i) => i.id !== echelle.spec.id)
                      .map((i) => (
                      <div key={i.id}>
                        <dt>
                          <button type="button" className="gm-mesure-b" onClick={() => setIndic(i.id)}>
                            {i.label}
                          </button>
                        </dt>
                        <dd>{fmt(fiche[i.id], i.genre)}</dd>
                      </div>
                    ))}
                  </dl>

                  <a
                    className="cg-lien-fleche"
                    href={
                      explorable
                        ? `/demographie?pays=${cle(fiche.fr)}&indicateur=${cleIndic(echelle.spec.id)}&annee=${annee}`
                        : `/demographie?indicateur=${cleIndic(echelle.spec.id)}&annee=${annee}`
                    }
                  >
                    {explorable ? "Voir la fiche pays" : "Voir le globe interactif complet"}{" "}
                    <span aria-hidden="true">→</span>
                  </a>
                  <p className="gm-source">Nations Unies, World Population Prospects 2024 · {annee}</p>
                </>
              ) : (
                <p className="gm-vide">Cliquez un pays sur le globe pour ouvrir sa fiche.</p>
              )}
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}

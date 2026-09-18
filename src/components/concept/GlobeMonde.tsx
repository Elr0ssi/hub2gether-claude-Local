"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FichePays } from "@/data/concept/conceptGeo";

/* ═══════════════════════════════════════════════════════════════════════════
   LE GLOBE DU MONDE

   Celui-ci EST la Terre — contrairement à la sphère abstraite du hero. On
   tourne à la main, on clique un pays, ses données s'affichent à droite.

   Projection orthographique en canvas 2D : à cette échelle, une scène 3D
   texturée coûterait plus cher qu'elle ne rapporterait, et le tracé vectoriel
   garde un bord net sur un pays sélectionné — ce qu'une texture ne fait pas.

   Les valeurs viennent du socle, pas de la maquette.
   ═══════════════════════════════════════════════════════════════════════════ */

const RAD = Math.PI / 180;

/** Arc sinus en degrés, borné : à l'écran, un déplacement n'est pas
    proportionnel à l'angle tourné — c'est son arc sinus. */
const ARC = (t: number) => (Math.asin(Math.max(-1, Math.min(1, t))) * 180) / Math.PI;

/** Un angle admet deux solutions ; on garde celle qui bouge le moins. */
const ecart = (x: number, ref: number) => Math.abs(((x - ref + 540) % 360) - 180);
const plusProche = (cands: number[], ref: number) =>
  cands
    .map((x) => ((x + 540) % 360) - 180)
    .reduce((m, x) => (ecart(x, ref) < ecart(m, ref) ? x : m));

type Anneau = [number, number][];
interface Pays {
  nom: string;
  anneaux: Anneau[];
  /** Le centre approché, pour poser l'étiquette et viser au clic. */
  centre: [number, number];
  aire: number;
}

interface Props {
  donnees: Record<string, FichePays>;
  annee: number;
  regions: readonly { id: string; label: string; pays: readonly string[] }[];
  vues: Record<string, { lat: number; lon: number }>;
}

function fmt(v: number | null, genre: "md" | "eur" | "pct"): string {
  if (v === null) return "—";
  if (genre === "pct") return `${v.toFixed(1).replace(".", ",")} %`;
  if (genre === "eur") return `${Math.round(v).toLocaleString("fr-FR")} €`;
  const a = Math.abs(v);
  if (a >= 1000) return `${(v / 1000).toFixed(1).replace(".", ",")} T€`;
  return `${Math.round(v).toLocaleString("fr-FR")} Md€`;
}

type Indic = "pib" | "pibHab" | "inflation" | "balance";

const INDICS: {
  id: Indic;
  label: string;
  genre: "md" | "eur" | "pct";
  forme: "log" | "signe";
  /** −1 : la rampe divergente est retournée (un déficit doit être rouge). */
  sens: 1 | -1;
  note: string;
}[] = [
  { id: "pib", label: "PIB", genre: "md", forme: "log", sens: 1, note: "échelle logarithmique" },
  { id: "pibHab", label: "PIB / habitant", genre: "eur", forme: "log", sens: 1, note: "échelle logarithmique" },
  { id: "inflation", label: "Inflation", genre: "pct", forme: "signe", sens: 1, note: "échelle centrée sur zéro" },
  { id: "balance", label: "Balance commerciale", genre: "md", forme: "signe", sens: -1, note: "échelle centrée sur zéro" },
];

/* Rampe séquentielle d'une seule teinte, du sombre au clair : sur un fond de
   nuit, c'est la clarté qui porte la magnitude. On s'arrête avant les pas les
   plus sombres, qui se confondraient avec l'océan. */
const BLEUS = [
  "#104281", "#184f95", "#1c5cab", "#256abf", "#2a78d6", "#3987e5",
  "#5598e7", "#6da7ec", "#86b6ef", "#9ec5f4", "#b7d3f6", "#cde2fb",
];

/* Rampe divergente : deux teintes opposées et un gris au milieu. Le milieu ne
   doit surtout pas être une couleur — sinon « zéro » se lit comme une valeur. */
const DIVERGENTE = [
  "#b7d3f6", "#86b6ef", "#5598e7", "#2a78d6", "#1c5cab",
  "#5c6371",
  "#9c3737", "#bd3a3a", "#d03b3b", "#dc5a52", "#e6796b",
];

/* Une donnée absente n'est pas une valeur basse : elle a sa propre couleur,
   hors rampe, et sa mention dans la légende. */
const SANS = "#1b212b";

function palier(rampe: string[], t: number): string {
  const i = Math.round(Math.max(0, Math.min(1, t)) * (rampe.length - 1));
  return rampe[i];
}

export function GlobeMonde({ donnees, annee, regions, vues }: Props) {
  const cv = useRef<HTMLCanvasElement>(null);
  const [pays, setPays] = useState<Pays[]>([]);
  const [choisi, setChoisi] = useState<string | null>("France");
  const [survol, setSurvol] = useState<string | null>(null);
  const [region, setRegion] = useState("monde");
  const [indic, setIndic] = useState<Indic>("pib");

  /* La caméra : deux angles, tirés vers une cible. Le rendu lit ces refs
     soixante fois par seconde sans repasser par React. */
  const cam = useRef({ lon: -30, lat: 14 });
  const cible = useRef({ lon: -30, lat: 14 });
  const glisse = useRef<{ x: number; y: number; a: number; b: number; lon: number; lat: number } | null>(null);
  const aBouge = useRef(false);
  /* Dès la première interaction, le globe cesse de dériver : sinon le pays
     qu'on vient de choisir repart tout seul hors du centre. */
  const touche = useRef(false);
  /* L'entrée en scène : le globe ne se montre pas avant que la section
     arrive. Il monte alors depuis le bas en grossissant, avec un tour sur
     lui-même qui s'amortit — le temps du relais avec le globe de fond. */
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
    fetch("/geo/ne_110m_admin_0_countries.geojson")
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
          /* L'aire vraie, par la formule du lacet pondérée par cos(lat). Le
             nombre de sommets ne dit rien de la taille — la Norvège en a plus
             que la Libye — et c'est l'aire qui départage deux pays au clic. */
          let aire = 0;
          let plusGrand = { aire: -1, centre: [0, 0] as [number, number] };
          for (const poly of brut) {
            const ext = poly[0];
            if (!ext) continue;
            const a: Anneau = ext.map((c) => [c[0], c[1]] as [number, number]);
            anneaux.push(a);
            let lacet = 0;
            /* Le centroïde pondéré par l'aire, pas la moyenne des sommets :
               une côte très découpée concentre les sommets et tirerait le
               centre vers elle — la caméra se recalait alors à côté du pays. */
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
            /* Le centre vient du plus grand morceau : celui de la France doit
               tomber sur l'Hexagone, pas au milieu de l'Atlantique entre la
               métropole et la Guyane. */
            if (sa > plusGrand.aire) plusGrand = { aire: sa, centre: centreAnneau };
          }
          if (!anneaux.length) continue;
          out.push({ nom, anneaux, centre: plusGrand.centre, aire });
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
    /* On n'observe qu'une fois la mise en page stabilisée : pendant le
       chargement, la page est plus courte et la section peut traverser le
       champ sans que personne ne l'ait vue — l'entrée se jouerait alors
       dans le vide. */
    let io: IntersectionObserver | null = null;
    const t = setTimeout(() => {
      io = new IntersectionObserver(
        (entrees) => {
          if (!entrees[0]?.isIntersecting || debut.current !== null) return;
          debut.current = performance.now();
          io?.disconnect();
        },
        { threshold: 0.45 },
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

    /* Une donnée absente reçoit une hachure, pas un gris : sur une rampe
       divergente, un gris uni se confondrait avec « autour de zéro ». */
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
      /* Rattrapage : la caméra glisse vers sa cible au lieu d'y sauter. */
      const dl = ((cible.current.lon - cam.current.lon + 540) % 360) - 180;
      const dp = cible.current.lat - cam.current.lat;
      /* On colle à la cible quand il ne reste presque rien : un rattrapage
         exponentiel ne l'atteint jamais tout à fait, et le pays qu'on vient
         de choisir continuerait de glisser imperceptiblement. */
      if (Math.abs(dl) < 0.05 && Math.abs(dp) < 0.05) {
        cam.current.lon = cible.current.lon;
        cam.current.lat = cible.current.lat;
      } else {
        cam.current.lon += dl * 0.07;
        cam.current.lat += dp * 0.07;
      }
      /* La dérive libre, avant toute interaction : elle emmène la cible avec
         elle, sinon elle tire contre le rattrapage et le globe fait du
         surplace. Au premier geste, elle s'arrête pour de bon. */
      if (!doux && !touche.current && !glisse.current) {
        cam.current.lon += 0.035;
        cible.current.lon += 0.035;
      }
      cible.current.lon = ((cible.current.lon + 540) % 360) - 180;

      /* L'entrée : de presque rien à sa taille, en montant depuis le bas.
         Le tour supplémentaire ne touche que le rendu, jamais la caméra —
         sinon le pointage serait faux pendant l'animation. */
      const brutAp = debut.current === null ? 0 : (performance.now() - debut.current) / 1900;
      const ap = Math.max(0, Math.min(1, brutAp));
      const e = 1 - Math.pow(1 - ap, 3);
      if (ap >= 1 && !fini.current) {
        fini.current = true;
        setEntre(true);
      }
      const tour = (1 - e) * (1 - e) * 430;

      const R = Math.min(L, H) * 0.44 * (0.07 + 0.93 * e);
      const cx = L / 2;
      const cy = H / 2 + (1 - e) * H * 0.5;
      /* cam.lon est la longitude au centre de l'écran. Avec le signe inverse,
         cliquer sur un pays envoyait la caméra sur son miroir : les États-Unis
         (−99°) faisaient basculer le globe sur la Chine (+99°). */
      const lonVue = cam.current.lon + tour;
      const sl = Math.sin(lonVue * RAD);
      const cl = Math.cos(lonVue * RAD);
      const sp = Math.sin(cam.current.lat * RAD);
      const cp = Math.cos(cam.current.lat * RAD);

      /* Orthographique : longitude/latitude → 3D → rotation → écran. */
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

      /* Le point exact où un segment franchit le bord du disque. Sans lui, un
         pays à cheval sur le limbe saute du dernier sommet vu au premier
         sommet revu — et se remplit en travers. Dichotomie : la trajectoire
         entre deux sommets n'est pas linéaire à l'écran. */
      const bord = (lo1: number, la1: number, lo2: number, la2: number) => {
        const vu1 = proj(lo1, la1).visible;
        let a = 0;
        let b = 1;
        for (let i = 0; i < 14; i++) {
          const m = (a + b) / 2;
          if (proj(lo1 + (lo2 - lo1) * m, la1 + (la2 - la1) * m).visible === vu1) a = m;
          else b = m;
        }
        const m = (a + b) / 2;
        return proj(lo1 + (lo2 - lo1) * m, la1 + (la2 - la1) * m);
      };

      ctx.clearRect(0, 0, L, H);
      if (e <= 0) {
        brut = requestAnimationFrame(boucle);
        return;
      }
      ctx.globalAlpha = e;

      /* L'océan, et l'atmosphère qui déborde du disque. */
      const atm = ctx.createRadialGradient(cx, cy, R * 0.86, cx, cy, R * 1.22);
      atm.addColorStop(0, "rgba(64,120,220,0.28)");
      atm.addColorStop(0.5, "rgba(64,120,220,0.10)");
      atm.addColorStop(1, "rgba(64,120,220,0)");
      ctx.fillStyle = atm;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.22, 0, Math.PI * 2);
      ctx.fill();

      const mer = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
      mer.addColorStop(0, "#0d1b3e");
      mer.addColorStop(0.7, "#070f24");
      mer.addColorStop(1, "#04081a");
      ctx.fillStyle = mer;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      /* La grille des parallèles et méridiens, discrète. */
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

      /* Les terres. Le pays choisi passe en dernier, en pleine lumière. */
      const sel = refChoisi.current;
      const sur = refSurvol.current;
      const dessinePays = (p: Pays, mode: "fond" | "survol" | "actif") => {
        ctx.beginPath();
        let quelqueChose = false;
        /* On relève l'emprise à l'écran au passage : la trame lumineuse du
           pays choisi a besoin de savoir où poser ses points. */
        const bbox = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
        const borne = (x: number, y: number) => {
          if (x < bbox.x0) bbox.x0 = x;
          if (y < bbox.y0) bbox.y0 = y;
          if (x > bbox.x1) bbox.x1 = x;
          if (y > bbox.y1) bbox.y1 = y;
        };
        for (const a of p.anneaux) {
          let ouvert = false;
          let prec: { lon: number; lat: number; vu: boolean } | null = null;
          for (const [lon, lat] of a) {
            const q = proj(lon, lat);
            /* Un anneau qui franchit l'antiméridien saute de +180 à −180 : sans
               coupure, le tracé traverse tout le globe en une barre. */
            const saut = prec !== null && Math.abs(lon - prec.lon) > 180;
            if (saut) ouvert = false;
            if (prec && !saut && prec.vu !== q.visible) {
              const b = bord(prec.lon, prec.lat, lon, lat);
              if (ouvert) ctx.lineTo(b.x, b.y);
              else ctx.moveTo(b.x, b.y);
              ouvert = true;
              quelqueChose = true;
            }
            if (q.visible) {
              if (ouvert) ctx.lineTo(q.x, q.y);
              else ctx.moveTo(q.x, q.y);
              borne(q.x, q.y);
              ouvert = true;
              quelqueChose = true;
            } else {
              ouvert = false;
            }
            prec = { lon, lat, vu: q.visible };
          }
          ctx.closePath();
        }
        if (!quelqueChose) return;
        /* Le pays garde sa couleur d'échelle même sélectionné : la sélection
           s'ajoute, elle n'efface pas la donnée. Sinon on ne lit plus la
           valeur de celui qu'on vient justement de choisir. */
        const teinte = refCouleurs.current.get(p.nom);
        ctx.fillStyle = teinte ?? (motif ?? SANS);
        ctx.fill();
        if (mode === "actif") {
          /* Le pays choisi s'allume de l'intérieur : une trame de points
             chauds, découpée au tracé du pays, puis un liseré net. C'est la
             lumière qui désigne, pas un aplat — un aplat effacerait la
             donnée et couperait le pays du reste de la carte. */
          ctx.save();
          ctx.clip();
          /* Le fond du pays choisi bascule dans le chaud : ce sont ses
             lumières qui doivent porter, et une teinte froide sous elles les
             éteignait. La valeur, elle, reste lisible dans le panneau. */
          ctx.fillStyle = "#1c1109";
          ctx.fill();
          const g = ctx.createRadialGradient(
            (bbox.x0 + bbox.x1) / 2,
            (bbox.y0 + bbox.y1) / 2,
            1,
            (bbox.x0 + bbox.x1) / 2,
            (bbox.y0 + bbox.y1) / 2,
            Math.max(24, Math.hypot(bbox.x1 - bbox.x0, bbox.y1 - bbox.y0) * 0.62),
          );
          g.addColorStop(0, "rgba(255,176,96,0.62)");
          g.addColorStop(0.55, "rgba(216,120,50,0.3)");
          g.addColorStop(1, "rgba(150,70,25,0.12)");
          ctx.fillStyle = g;
          ctx.fill();

          /* Grille en coordonnées écran, décalée par un bruit stable : une
             grille régulière se lit comme une texture imprimée, pas comme
             des lumières. Le pas suit la taille à l'écran, sinon un petit
             pays n'attrape aucun point. */
          const etendue = Math.max(bbox.x1 - bbox.x0, bbox.y1 - bbox.y0);
          const pasP = Math.max(2.6, Math.min(5.4, etendue / 20));
          for (let gy = bbox.y0; gy <= bbox.y1; gy += pasP) {
            for (let gx = bbox.x0; gx <= bbox.x1; gx += pasP) {
              const h = Math.sin(gx * 12.9898 + gy * 78.233) * 43758.5453;
              const f = h - Math.floor(h);
              if (f < 0.24) continue;
              const dx = ((f * 7) % 1) * pasP - pasP / 2;
              const dy = ((f * 13) % 1) * pasP - pasP / 2;
              const vif = f > 0.9;
              ctx.fillStyle = vif ? "rgba(255,250,236,1)" : `rgba(255,206,146,${0.42 + f * 0.55})`;
              ctx.beginPath();
              ctx.arc(gx + dx, gy + dy, vif ? 1.25 : 0.78, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.restore();

          ctx.shadowColor = "rgba(255,186,116,0.85)";
          ctx.shadowBlur = 26;
          ctx.strokeStyle = "rgba(255,226,190,0.98)";
          ctx.lineWidth = 1.6;
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

      /* Le liseré du limbe, par-dessus tout. */
      ctx.strokeStyle = "rgba(120,175,255,0.55)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

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
  /* Le rayon dessiné, et donc la conversion pixel → degré, dépend de la taille
     de la scène : on le relit à chaque geste plutôt que de le figer. */
  /* Un pas constant en degrés par pixel fait déraper le globe : à l'écran, un
     déplacement n'est pas proportionnel à l'angle — c'est son arc sinus. On
     ancre donc le geste au point saisi et on résout la rotation qui le ramène
     sous le curseur. Le pays qu'on attrape reste sous le doigt. */
  /* Les coordonnées du curseur ramenées au disque, en unités de rayon. */
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
      /* Inverse de la projection : on repasse de l'écran à la sphère. */
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
      /* Test d'appartenance en coordonnées géographiques, du plus petit pays
         au plus grand : sinon la Russie avale ses voisins. */
      const tries = [...pays].sort((a, b) => a.aire - b.aire);
      for (const p of tries) {
        for (const a of p.anneaux) {
          let dedans = false;
          for (let i = 0, j = a.length - 1; i < a.length; j = i++) {
            const [xi, yi] = a[i];
            const [xj, yj] = a[j];
            if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) dedans = !dedans;
          }
          if (dedans) return p;
        }
      }
      return null;
    },
    [pays]
  );

  /* ── L'échelle de couleurs ─────────────────────────────────────────────
     Les bornes sont prises aux centiles extrêmes, pas au min/max : un seul
     pays hors norme écraserait toute la rampe. Le PIB passe en logarithmique,
     faute de quoi la quasi-totalité du monde se retrouve au même pas. */
  const echelle = useMemo(() => {
    const spec = INDICS.find((i) => i.id === indic) ?? INDICS[0];
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
      /* En logarithmique, le maximum réel ne déforme pas la rampe — et le
         couper au 98e centile mettrait les quatre premières économies du
         monde au même pas, ce qui est exactement ce qu'on veut éviter. */
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
      /* Bornes au 8e / 92e centile : deux ou trois pays en hyperinflation
         suffiraient à ramener tout le reste sur le même pas. Ce qui dépasse
         est ramené à la borne — et la légende le dit avec un « ≤ / ≥ ». */
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
  /* L'en-tête du panneau suit le pays affiché, pas l'onglet : on peut cliquer
     un pays hors de la région courante, et annoncer « Europe » sur le Niger
     serait faux. */
  const region_ =
    (choisi ? regions.find((r) => r.id !== "monde" && r.pays.includes(choisi)) : undefined) ??
    regions.find((r) => r.id === "monde");

  const rangMondial = useMemo(() => {
    if (!fiche?.pib) return null;
    const mieux = Object.values(donnees).filter((d) => (d.pib ?? -1) > (fiche.pib as number)).length;
    return mieux + 1;
  }, [fiche, donnees]);

  return (
    <div className="gm">
      {/* ── Les régions ──────────────────────────────────────────────────── */}
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
              /* On bascule aussi la fiche : sans cela, le panneau garderait un
                 pays d'une autre région et l'en-tête deviendrait faux. */
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

      {/* ── L'indicateur qui colore le globe ──────────────────────────────── */}
      <div className="gm-indics" role="tablist" aria-label="Indicateur affiché">
        {INDICS.map((i) => (
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

      <div className="gm-corps">
        {/* ── Le globe ───────────────────────────────────────────────────── */}
        <div className="gm-scene">
          <canvas
            ref={cv}
            className="gm-canvas"
            style={{ pointerEvents: entre ? "auto" : "none" }}
            onPointerDown={(e) => {
              const g = versLonLat(e);
              /* On retient le point géographique saisi, pas un delta. À chaque
                 mouvement on résout la caméra qui le ramène exactement sous le
                 curseur : c'est ce qui fait qu'un pays attrapé ne glisse pas
                 entre les doigts, y compris en diagonale. */
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
                  /* Longitude : à l'écran, x = cos(lat)·sin(lon + camLon). */
                  let lon = q.lon;
                  if (cb > 0.08) {
                    const s0 = ARC(d.u / cb);
                    lon = plusProche([q.a - s0, q.a - (180 - s0)], q.lon);
                  }
                  /* Latitude : y = sin(lat)·cos(camLat) − z·sin(camLat), soit
                     une seule cosinusoïde une fois la longitude connue. */
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
              const g = versLonLat(e);
              const p = g ? paysSous(g.lon, g.lat) : null;
              setSurvol(p?.nom ?? null);
            }}
            onPointerUp={(e) => {
              const bougeait = aBouge.current;
              glisse.current = null;
              if (bougeait) return;
              const g = versLonLat(e);
              const p = g ? paysSous(g.lon, g.lat) : null;
              if (p) {
                /* On ne recentre pas : déplacer le globe sous le doigt de
                   quelqu'un qui vient de viser un pays lui fait perdre ce
                   qu'il regardait. Le choix s'affiche, la vue ne bouge pas. */
                touche.current = true;
                setChoisi(p.nom);
              }
            }}
            onPointerLeave={() => {
              glisse.current = null;
              setSurvol(null);
            }}
          />

          {/* Les pastilles flottantes, façon terminal de marché */}
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
            Faites tourner le globe · cliquez un pays
            {survol && <span className="gm-aide-survol"> — {donnees[survol]?.fr ?? survol}</span>}
          </p>
        </div>

        {/* ── Le panneau ─────────────────────────────────────────────────── */}
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
                  {rangMondial && <p className="gm-rang">{rangMondial}<sup>e</sup> PIB mondial</p>}

                  <dl className="gm-mesures">
                    {[
                      { l: "PIB", v: fmt(fiche.pib, "md") },
                      { l: "PIB par habitant", v: fmt(fiche.pibHab, "eur") },
                      { l: "Inflation", v: fmt(fiche.inflation, "pct") },
                      { l: "Balance commerciale", v: fmt(fiche.balance, "md") },
                    ].map((m) => (
                      <div key={m.l}>
                        <dt>{m.l}</dt>
                        <dd>{m.v}</dd>
                      </div>
                    ))}
                  </dl>

                  <button type="button" className="cg-lien-fleche">
                    Voir la fiche pays <span aria-hidden="true">→</span>
                  </button>
                  <p className="gm-source">Banque mondiale (WDI) · {annee}</p>
                </>
              ) : (
                <p className="gm-vide">Cliquez un pays sur le globe.</p>
              )}
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}

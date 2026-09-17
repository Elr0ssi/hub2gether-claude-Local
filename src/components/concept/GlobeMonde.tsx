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

export function GlobeMonde({ donnees, annee, regions, vues }: Props) {
  const cv = useRef<HTMLCanvasElement>(null);
  const [pays, setPays] = useState<Pays[]>([]);
  const [choisi, setChoisi] = useState<string | null>("France");
  const [survol, setSurvol] = useState<string | null>(null);
  const [region, setRegion] = useState("monde");
  const [etiquettes, setEtiquettes] = useState<{ nom: string; x: number; y: number; vu: boolean; dy: number }[]>([]);

  /* La caméra : deux angles, tirés vers une cible. Le rendu lit ces refs
     soixante fois par seconde sans repasser par React. */
  const cam = useRef({ lon: -30, lat: 14 });
  const cible = useRef({ lon: -30, lat: 14 });
  const glisse = useRef<{ x: number; y: number } | null>(null);
  const aBouge = useRef(false);
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
          let sx = 0;
          let sy = 0;
          let n = 0;
          let aire = 0;
          for (const poly of brut) {
            const ext = poly[0];
            if (!ext) continue;
            const a: Anneau = ext.map((c) => [c[0], c[1]] as [number, number]);
            anneaux.push(a);
            aire += a.length;
            for (const [x, y] of a) {
              sx += x;
              sy += y;
              n++;
            }
          }
          if (!anneaux.length) continue;
          out.push({ nom, anneaux, centre: [sx / n, sy / n], aire });
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

    let brut = 0;
    const boucle = () => {
      /* Rattrapage : la caméra glisse vers sa cible au lieu d'y sauter. */
      const dl = ((cible.current.lon - cam.current.lon + 540) % 360) - 180;
      cam.current.lon += dl * 0.07;
      cam.current.lat += (cible.current.lat - cam.current.lat) * 0.07;
      if (!doux && !glisse.current && Math.abs(dl) < 0.4) cam.current.lon -= 0.035;
      cible.current.lon = ((cible.current.lon + 540) % 360) - 180;

      const R = Math.min(L, H) * 0.44;
      const cx = L / 2;
      const cy = H / 2;
      const sl = Math.sin(-cam.current.lon * RAD);
      const cl = Math.cos(-cam.current.lon * RAD);
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
        return { x: cx + x1 * R, y: cy - y2 * R, visible: z2 > 0 };
      };

      ctx.clearRect(0, 0, L, H);

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
        for (const a of p.anneaux) {
          let ouvert = false;
          for (const [lon, lat] of a) {
            const q = proj(lon, lat);
            if (!q.visible) {
              ouvert = false;
              continue;
            }
            if (ouvert) ctx.lineTo(q.x, q.y);
            else ctx.moveTo(q.x, q.y);
            ouvert = true;
            quelqueChose = true;
          }
          ctx.closePath();
        }
        if (!quelqueChose) return;
        if (mode === "actif") {
          ctx.shadowColor = "rgba(150,200,255,0.85)";
          ctx.shadowBlur = 26;
          ctx.fillStyle = "#cfe2ff";
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = "rgba(226,240,255,0.95)";
          ctx.lineWidth = 1;
          ctx.stroke();
        } else if (mode === "survol") {
          ctx.fillStyle = "rgba(120,165,240,0.55)";
          ctx.fill();
          ctx.strokeStyle = "rgba(180,210,255,0.5)";
          ctx.lineWidth = 0.7;
          ctx.stroke();
        } else {
          ctx.fillStyle = "#16224a";
          ctx.fill();
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

      /* Les étiquettes flottantes de la région affichée. */
      const mis = regions.find((r) => r.id === refRegion.current)?.pays ?? [];
      const et: { nom: string; x: number; y: number; vu: boolean; dy: number }[] = [];
      /* En Europe, cinq pays tiennent dans un mouchoir de poche : sans
         déplacement, les pastilles se superposent et deviennent illisibles.
         On pose donc chaque pastille en la remontant tant qu'elle chevauche
         une voisine déjà posée. La largeur est estimée depuis le libellé :
         mesurer le DOM ici coûterait un reflow à chaque image. */
      const PAS = 52;
      const HAUT = 46;
      const boites: { x: number; y: number; demi: number }[] = [];
      /* Les pays les plus au sud d'abord : ils gardent leur place, les
         voisins du nord montent. L'ordre est stable d'une image à l'autre. */
      const ordre = mis
        .map((nom) => ({ nom, p: pays.find((q) => q.nom === nom) }))
        .filter((o): o is { nom: string; p: Pays } => Boolean(o.p))
        .map((o) => ({ ...o, q: proj(o.p.centre[0], o.p.centre[1]) }))
        .sort((a, b) => b.q.y - a.q.y);

      for (const o of ordre) {
        const d = donnees[o.nom];
        const demi = (Math.max(String(d?.fr ?? o.nom).length * 7.4 + 26, 78)) / 2;
        let dy = 0;
        if (o.q.visible) {
          /* On essaie au-dessus puis au-dessous, en s'éloignant par paliers :
             une pile qui ne monterait que vers le haut finirait par sortir de
             la scène et la pastille disparaîtrait. */
          for (const essai of [0, -PAS, PAS, -2 * PAS, 2 * PAS, -3 * PAS, 3 * PAS]) {
            dy = essai;
            const libre = !boites.some(
              (b) =>
                Math.abs(b.x - o.q.x) < b.demi + demi + 10 &&
                Math.abs(b.y - (o.q.y + dy)) < HAUT,
            );
            if (libre) break;
          }
          boites.push({ x: o.q.x, y: o.q.y + dy, demi });
        }
        et.push({ nom: o.nom, x: o.q.x, y: o.q.y, vu: o.q.visible, dy });
      }
      setEtiquettes(et);

      brut = requestAnimationFrame(boucle);
    };
    brut = requestAnimationFrame(boucle);
    return () => {
      cancelAnimationFrame(brut);
      ro.disconnect();
    };
  }, [pays, regions]);

  /* ── Le pointage ───────────────────────────────────────────────────────── */
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
      const sl = Math.sin(-cam.current.lon * RAD);
      const cl = Math.cos(-cam.current.lon * RAD);
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

      <div className="gm-corps">
        {/* ── Le globe ───────────────────────────────────────────────────── */}
        <div className="gm-scene">
          <canvas
            ref={cv}
            className="gm-canvas"
            onPointerDown={(e) => {
              glisse.current = { x: e.clientX, y: e.clientY };
              aBouge.current = false;
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (glisse.current) {
                const dx = e.clientX - glisse.current.x;
                const dy = e.clientY - glisse.current.y;
                if (Math.abs(dx) + Math.abs(dy) > 3) aBouge.current = true;
                cible.current.lon -= dx * 0.32;
                cible.current.lat = Math.max(-78, Math.min(78, cible.current.lat + dy * 0.28));
                cam.current.lon -= dx * 0.32;
                cam.current.lat = Math.max(-78, Math.min(78, cam.current.lat + dy * 0.28));
                glisse.current = { x: e.clientX, y: e.clientY };
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
                setChoisi(p.nom);
                /* On recentre doucement sur le pays choisi. */
                cible.current = { lon: p.centre[0], lat: Math.max(-60, Math.min(60, p.centre[1])) };
              }
            }}
            onPointerLeave={() => {
              glisse.current = null;
              setSurvol(null);
            }}
          />

          {/* Les pastilles flottantes, façon terminal de marché */}
          <div className="gm-etiquettes" aria-hidden="true">
            {etiquettes.map((e) => {
              const d = donnees[e.nom];
              if (!d || !e.vu) return null;
              return (
                <span
                  key={e.nom}
                  className={`gm-pastille${choisi === e.nom ? " gm-pastille-on" : ""}`}
                  style={{
                    transform: `translate3d(${e.x}px, ${e.y + e.dy}px, 0) translate(-50%, -140%)`,
                  }}
                >
                  <span className="gm-pastille-n">{d.fr}</span>
                  <span className="gm-pastille-v">{fmt(d.pib, "md")}</span>
                </span>
              );
            })}
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

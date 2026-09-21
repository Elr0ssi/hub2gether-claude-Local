"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   L'ODOMÈTRE

   Un compteur mécanique, pas une suite de nombres qui se remplacent. Chaque
   rouleau porte les dix chiffres et tourne sur lui-même ; sa position est un
   réel, pas un entier — c'est ce qui fait que le mouvement est continu et
   non saccadé. Les unités tournent sans arrêt, les dizaines dix fois moins
   vite, et ainsi de suite : c'est la mécanique d'un compteur, et elle dit la
   vitesse à laquelle la grandeur court.

   Rien de tout cela ne passe par React. Un seul requestAnimationFrame pour
   toute la page réécrit les transform directement sur les nœuds : à soixante
   images par seconde, refaire un rendu React serait le seul vrai coût.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── La boucle partagée ────────────────────────────────────────────────── */

type Tic = (t: number) => void;
const ABONNES = new Set<Tic>();
let BOUCLE = 0;

function tourne(t: number) {
  BOUCLE = requestAnimationFrame(tourne);
  for (const f of ABONNES) f(t);
}

function abonne(f: Tic) {
  ABONNES.add(f);
  if (!BOUCLE) BOUCLE = requestAnimationFrame(tourne);
  return () => {
    ABONNES.delete(f);
    if (!ABONNES.size && BOUCLE) {
      cancelAnimationFrame(BOUCLE);
      BOUCLE = 0;
    }
  };
}

/* ── Le gabarit ────────────────────────────────────────────────────────── */

/** Un rouleau (`k` = la puissance de dix) ou un caractère posé qui ne bouge pas. */
type Case = { r: true; k: number } | { r: false; c: string };

const MINCE = " "; // espace fine insécable : le séparateur de milliers français

function gabarit(entiers: number, dec: number, unite: string, negatif: boolean): Case[] {
  const cases: Case[] = [];
  if (negatif) cases.push({ r: false, c: "\u2212" });
  for (let k = entiers - 1; k >= 0; k--) {
    cases.push({ r: true, k });
    if (k > 0 && k % 3 === 0) cases.push({ r: false, c: MINCE });
  }
  if (dec > 0) {
    cases.push({ r: false, c: "," });
    for (let k = 1; k <= dec; k++) cases.push({ r: true, k: -k });
  }
  if (unite) cases.push({ r: false, c: unite });
  return cases;
}

function nbChiffres(v: number) {
  const a = Math.floor(Math.abs(v));
  return a < 1 ? 1 : Math.floor(Math.log10(a)) + 1;
}

const CHIFFRES = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const HAUTEUR = CHIFFRES.length; // dix chiffres plus le zéro de bouclage

function adoucit(u: number) {
  return 1 - Math.pow(1 - u, 3);
}

/* ── Le composant ──────────────────────────────────────────────────────── */

export interface OdometreProps {
  /** La valeur à afficher. En mode continu, c'est la valeur de départ. */
  valeur: number | null | undefined;
  /** Si fourni, la valeur avance d'elle-même de tant par seconde. */
  parSeconde?: number;
  /** L'instant d'origine de cette avance. */
  depuis?: number;
  /** Chiffres après la virgule. */
  dec?: number;
  /** Ce qui est collé à droite du nombre. */
  unite?: string;
  /** Durée du passage d'une valeur à l'autre, en millisecondes. */
  duree?: number;
  /** Tours supplémentaires à chaque changement, pour que même un écart d'un
      se voie tourner. */
  tours?: number;
  /** Vert à la hausse, rouge à la baisse, le temps du mouvement. */
  couleur?: boolean;
  /** L'ordre de grandeur qui fixe le nombre de rouleaux. */
  reference?: number;
  className?: string;
}

export function Odometre({
  valeur,
  parSeconde,
  depuis,
  dec = 0,
  unite = "",
  duree = 900,
  tours = 0,
  couleur = false,
  reference,
  className,
}: OdometreProps) {
  const vide = valeur === null || valeur === undefined || !Number.isFinite(valeur);
  const cible = vide ? 0 : (valeur as number);
  const continu = typeof parSeconde === "number" && parSeconde !== 0;

  const [doux, setDoux] = useState(false);
  useEffect(() => setDoux(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  /* Le nombre de rouleaux ne suit pas la valeur image par image : il ne
     change que quand l'ordre de grandeur change, sinon la ligne sauterait en
     largeur à chaque tour d'unité. */
  const entiers = useMemo(() => {
    /* On dimensionne sur la valeur d'aujourd'hui, pas sur celle de la fin de
       l'année : viser la fin ajoutait un zéro de tête qui se lisait comme une
       faute de frappe. Le rouleau supplémentaire arrivera quand la grandeur
       le mérite — au prix d'un remontage, une fois l'an. */
    const fin = continu
      ? Math.abs(cible + (parSeconde as number) * ((performance.now() - (depuis ?? 0)) / 1000))
      : Math.abs(reference ?? cible);
    const q = Math.pow(10, dec);
    return Math.max(1, nbChiffres(Math.round(fin * q) / q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continu, cible, parSeconde, reference, depuis, dec]);

  const negatif = cible < 0;
  const cases = useMemo(
    () => gabarit(entiers, dec, unite, negatif),
    [entiers, dec, unite, negatif],
  );

  const racine = useRef<HTMLSpanElement>(null);
  const rouleaux = useRef<(HTMLSpanElement | null)[]>([]);
  /* La valeur réellement peinte, pour repartir d'où l'on est quand la cible
     change en plein mouvement. */
  const peinte = useRef(cible);
  const depart = useRef(cible);
  const t0 = useRef(0);
  const sens = useRef(0);

  /* Un changement de cible relance le mouvement. On ne le fait pas dans un
     effet de rendu pour ne pas perdre une image : la comparaison suffit. */
  const derniere = useRef(cible);
  if (!continu && cible !== derniere.current) {
    depart.current = peinte.current;
    sens.current = cible > peinte.current ? 1 : cible < peinte.current ? -1 : 0;
    derniere.current = cible;
    t0.current = 0; // sera posé à la première image
  }

  useEffect(() => {
    if (doux || vide) return;
    const cols = rouleaux.current;
    const n = cases.length;

    const dit = new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    });
    let dernierDit = 0;

    const pose = (now: number) => {
      let v: number;
      let u = 1;
      if (continu) {
        v = cible + (parSeconde as number) * ((now - (depuis ?? now)) / 1000);
      } else {
        if (!t0.current) t0.current = now;
        u = Math.min(1, (now - t0.current) / duree);
        const e = adoucit(u);
        v = depart.current + (cible - depart.current) * e;
      }
      peinte.current = v;
      /* On travaille sur la valeur mise à l'échelle des décimales affichées,
         en nombre entier une fois le mouvement fini : « 3,95 » arrondi à une
         décimale doit donner 4,0 comme partout ailleurs sur la page, et non
         3,9 par troncature. */
      const q = Math.pow(10, dec);
      let ech = Math.abs(v) * q;
      if (!continu && u >= 1) ech = Math.round(ech);

      /* Le tour « dans le vide » : on part d'un décalage qui est un multiple
         exact de dix — donc invisible à l'arrêt — et on le ramène à zéro.
         Chaque rouleau fait ainsi ses tours puis se pose sur son chiffre. */
      let i = 0;
      for (const c of cases) {
        if (!c.r) continue;
        const el = cols[i++];
        if (!el) continue;
        const p = Math.pow(10, c.k + dec);
        const x = ech / p;
        const d = Math.floor(x);
        const f = x - d;
        /* Seul le dernier rouleau affiché d'un compteur qui court tourne en
           continu. Partout ailleurs, il ne bascule que sur la fin de sa
           course : « 19,5 » a une partie décimale, et un rouleau des unités
           laissé continu se serait posé entre le 9 et le 0 — le nombre
           devenait illisible à l'arrêt. Et une fois le mouvement fini, plus
           aucune fenêtre : un compteur posé montre ses chiffres pile, pas la
           retenue du suivant. */
        const fen = continu && c.k === -dec ? 1 : continu || u < 1 ? 0.14 : 0;
        const roule = fen > 0 && f > 1 - fen ? (f - (1 - fen)) / fen : 0;
        let pos = (d % 10) + roule;
        if (tours && !continu && u < 1) {
          const retard = Math.min(0.45, i * 0.05);
          const w = Math.max(0, Math.min(1, (u - retard) / (1 - retard)));
          pos += tours * 10 * (1 - adoucit(w));
        }
        el.style.transform = `translateY(${(-(pos % 10) / HAUTEUR) * 100}%)`;
      }

      if (racine.current && now - dernierDit > 900) {
        dernierDit = now;
        racine.current.setAttribute("aria-label", dit.format(v) + unite);
      }

      if (!continu && u >= 1) {
        if (sens.current && racine.current) {
          racine.current.classList.remove("rl-hausse", "rl-baisse");
          sens.current = 0;
        }
        return false;
      }
      if (!continu && u < 1 && couleur && sens.current && racine.current) {
        racine.current.classList.add(sens.current > 0 ? "rl-hausse" : "rl-baisse");
      }
      return true;
    };

    pose(performance.now());
    void n;
    return abonne((t) => {
      pose(t);
    });
  }, [cases, cible, continu, couleur, dec, depuis, doux, duree, parSeconde, tours, unite, vide]);

  if (vide) return <span className={className}>—</span>;

  if (doux) {
    const txt =
      new Intl.NumberFormat("fr-FR", {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec,
      }).format(cible) + unite.replace(/&nbsp;/g, "\u00a0");
    return <span className={className}>{txt}</span>;
  }

  let i = -1;
  return (
    <span ref={racine} className={`rl ${className ?? ""}`} role="text">
      {cases.map((c, k) => {
        if (!c.r) {
          return (
            <span key={`f${k}`} className="rl-fixe" aria-hidden="true">
              {c.c}
            </span>
          );
        }
        i += 1;
        const j = i;
        /* Un rouleau qui tourne plus vite que l'œil ne se lit pas : on le
           laisse tourner, mais en retrait, pour qu'il dise « ça défile » au
           lieu de brouiller le nombre. */
        const vitesse = continu ? Math.abs(parSeconde as number) / Math.pow(10, c.k) : 0;
        return (
          <span
            key={`r${k}`}
            className={`rl-fente${vitesse > 30 ? " rl-vite" : ""}`}
            aria-hidden="true"
          >
            <span className="rl-colonne" ref={(el) => void (rouleaux.current[j] = el)}>
              {CHIFFRES.map((d, z) => (
                <span key={z}>{d}</span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}

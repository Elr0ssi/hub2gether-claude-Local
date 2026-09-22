"use client";

/* ═══════════════════════════════════════════════════════════════════════════
   LES TUILES DE L'OUVERTURE

   Les signes de l'économie, posés en tuiles au-dessus de l'horizon : les
   monnaies, les grands indices, les secteurs qui font le produit intérieur.
   Tout est dessiné au trait ou écrit en toutes lettres — aucune image
   rapportée, et aucune marque reproduite.

   Ce choix n'est pas seulement graphique. Un indice ou un secteur, c'est ce
   dont la page parle et ce qu'elle mesure ; un logo d'entreprise, c'est une
   marque qui ne nous appartient pas et qui ne dirait rien de plus.

   Cinq couches, et chacune tient une seule chose : la place, l'écart au
   défilement, l'arrivée, la dérive continue, le relief au survol. Les
   empiler évite que deux mouvements se disputent la même propriété. Rien
   n'est calculé image par image : l'écart vient d'une seule variable CSS,
   le reste est en animations et en transitions.
   ═══════════════════════════════════════════════════════════════════════════ */

type Forme =
  | "courbe"
  | "barres"
  | "chandelier"
  | "usine"
  | "banque"
  | "panier"
  | "goutte"
  | "lingots"
  | "ble"
  | "curseurs"
  | "caisse"
  | "pourcent";

interface Tuile {
  /** Le dessin, ou rien quand la tuile porte du texte. */
  f?: Forme;
  /** Le texte porté : un symbole de monnaie, ou le nom court d'un indice. */
  t?: string;
  /** La teinte. Chaque famille de signe a la sienne. */
  c: string;
  /** Position dans l'ouverture, en pourcentage de sa largeur et de sa hauteur. */
  x: number;
  y: number;
  /** Côté de la tuile, en pixels. */
  k: number;
  /** Durée de la dérive, en secondes. */
  d: number;
  /** Profondeur : ce qui est près bouge plus au défilement que ce qui est loin. */
  z: number;
  /** Gardée sur une colonne étroite. */
  petit?: boolean;
  /** Le rang d'apparition. Volontairement dispersé : dans l'ordre de la
      liste, les tuiles arriveraient de gauche à droite comme un balayage. */
  o: number;
  /** Une tuile allumée : elle porte un halo de sa teinte, les autres non. */
  vif?: boolean;
}

const OR = "#e8b774";
const VERT = "#5fe0a2";
const BLEU = "#7cc0ff";
const PALE = "#9ec7d8";
const CORAIL = "#ff9e8a";
const VIOLET = "#b79cff";

/* Les tuiles laissent libre le couloir central, où se lisent le sceau et le
   titre. Les positions sont posées à la main : une dispersion tirée au sort
   fait des grappes et des trous.

   Celles marquées `petit` restent sur une colonne étroite. Elles sont
   choisies pour couvrir toute la hauteur, des deux côtés : sur un téléphone
   il n'y a pas de marges, le champ passe donc derrière le texte, et neuf
   tuiles réparties valent mieux que six tassées en haut. */
const TUILES: Tuile[] = [
  /* ── Le bord gauche ─────────────────────────────────────────────────── */
  { t: "€", c: OR, x: 8, y: 22, k: 46, d: 11, z: 1.1, petit: true, o: 3, vif: true },
  { f: "barres", c: BLEU, x: 17, y: 12, k: 40, d: 14, z: 0.8, petit: true, o: 11 },
  { t: "CAC 40", c: PALE, x: 5, y: 44, k: 52, d: 13, z: 1.2, o: 7 },
  { f: "usine", c: PALE, x: 21, y: 33, k: 42, d: 9, z: 0.9, petit: true, o: 16 },
  { f: "goutte", c: OR, x: 12, y: 58, k: 38, d: 16, z: 1, o: 1 },
  { f: "banque", c: BLEU, x: 26, y: 54, k: 44, d: 12, z: 1.15, o: 13 },
  { t: "$", c: OR, x: 30, y: 20, k: 38, d: 10, z: 0.75, o: 19 },
  { f: "panier", c: BLEU, x: 24, y: 71, k: 36, d: 15, z: 1.25, petit: true, o: 5 },
  { f: "chandelier", c: VERT, x: 34, y: 38, k: 34, d: 13, z: 0.7, o: 9 },
  { f: "ble", c: OR, x: 33, y: 63, k: 34, d: 11, z: 0.85, petit: true, o: 17 },

  /* ── Le bord droit ──────────────────────────────────────────────────── */
  { t: "₿", c: OR, x: 63, y: 30, k: 44, d: 12, z: 1.05, petit: true, o: 0, vif: true },
  { f: "pourcent", c: CORAIL, x: 70, y: 16, k: 36, d: 10, z: 0.8, o: 12 },
  { t: "S&P 500", c: PALE, x: 88, y: 28, k: 52, d: 14, z: 1.2, o: 6 },
  { f: "banque", c: BLEU, x: 76, y: 44, k: 42, d: 9, z: 0.95, petit: true, o: 15 },
  { f: "lingots", c: OR, x: 74, y: 24, k: 40, d: 15, z: 1.1, petit: true, o: 2, vif: true },
  { t: "¥", c: OR, x: 94, y: 52, k: 38, d: 11, z: 0.9, o: 18 },
  { f: "curseurs", c: VIOLET, x: 82, y: 66, k: 36, d: 13, z: 1.3, petit: true, o: 8 },
  { f: "caisse", c: PALE, x: 92, y: 70, k: 38, d: 10, z: 1.15, petit: true, o: 14 },
  { f: "chandelier", c: VERT, x: 66, y: 74, k: 34, d: 16, z: 1.25, o: 4 },
  { t: "£", c: OR, x: 79, y: 12, k: 34, d: 12, z: 0.7, petit: true, o: 20 },
  { f: "barres", c: BLEU, x: 96, y: 14, k: 36, d: 14, z: 0.75, o: 10 },
];

const TRAIT = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function Dessin({ f }: { f: Forme }) {
  switch (f) {
    case "courbe":
      /* Deux montées, un creux entre les deux, et rien d'autre. Pas de
         flèche : le sens de lecture suffit à dire que ça monte, et une
         pointe ajoutée ferait un pictogramme de plus au lieu d'un signe. */
      return (
        <svg viewBox="0 0 24 24">
          <path d="M3.5 18 L9.5 10.5 L13 14 L20.5 5" {...TRAIT} strokeWidth={2.1} />
        </svg>
      );
    case "barres":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M5 19 V13 M12 19 V7 M19 19 V10" {...TRAIT} strokeWidth={2} />
        </svg>
      );
    case "chandelier":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M8 4 V20 M16 3 V21" {...TRAIT} />
          <rect x="5.5" y="8" width="5" height="7" rx="1" {...TRAIT} />
          <rect x="13.5" y="6" width="5" height="9" rx="1" {...TRAIT} />
        </svg>
      );
    case "usine":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M3 20 V11 L9 14 V11 L15 14 V6 H20 V20 Z" {...TRAIT} />
        </svg>
      );
    case "banque":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M3 9 L12 4 L21 9 Z" {...TRAIT} />
          <path d="M6 11 V17 M10 11 V17 M14 11 V17 M18 11 V17 M3.5 20 H20.5" {...TRAIT} />
        </svg>
      );
    case "panier":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M3 4 H5.5 L8 14 H18 L20.5 7 H6.2" {...TRAIT} />
          <circle cx="9" cy="18.5" r="1.4" {...TRAIT} />
          <circle cx="17" cy="18.5" r="1.4" {...TRAIT} />
        </svg>
      );
    case "goutte":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M12 3 C12 3 5.5 10.5 5.5 14.5 A6.5 6.5 0 0 0 18.5 14.5 C18.5 10.5 12 3 12 3 Z" {...TRAIT} />
        </svg>
      );
    case "lingots":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M8.5 6 H15.5 L17 10 H7 Z" {...TRAIT} />
          <path d="M3.5 13 H10.5 L12 17 H2 Z" {...TRAIT} />
          <path d="M13.5 13 H20.5 L22 17 H12 Z" {...TRAIT} />
        </svg>
      );
    case "ble":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M12 21 V9" {...TRAIT} />
          <path d="M12 9 C9 8 8 6 8 3.5 C10.6 4 12 5.8 12 9 Z" {...TRAIT} />
          <path d="M12 9 C15 8 16 6 16 3.5 C13.4 4 12 5.8 12 9 Z" {...TRAIT} />
          <path d="M12 15 C9.5 14 8.5 12.5 8.5 10.5 C10.8 11 12 12.4 12 15 Z" {...TRAIT} />
          <path d="M12 15 C14.5 14 15.5 12.5 15.5 10.5 C13.2 11 12 12.4 12 15 Z" {...TRAIT} />
        </svg>
      );
    case "curseurs":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M4 7 H20 M4 12 H20 M4 17 H20" {...TRAIT} />
          <circle cx="9" cy="7" r="2" {...TRAIT} />
          <circle cx="15" cy="12" r="2" {...TRAIT} />
          <circle cx="7.5" cy="17" r="2" {...TRAIT} />
        </svg>
      );
    case "caisse":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M3.5 7.5 L12 3.5 L20.5 7.5 V16.5 L12 20.5 L3.5 16.5 Z" {...TRAIT} />
          <path d="M3.5 7.5 L12 11.5 L20.5 7.5 M12 11.5 V20.5" {...TRAIT} />
        </svg>
      );
    case "pourcent":
      return (
        <svg viewBox="0 0 24 24">
          <circle cx="7.5" cy="7.5" r="3" {...TRAIT} />
          <circle cx="16.5" cy="16.5" r="3" {...TRAIT} />
          <path d="M19 5 L5 19" {...TRAIT} />
        </svg>
      );
  }
}

export function Jetons() {
  return (
    <div className="cg-tuiles" aria-hidden="true">
      {TUILES.map((j, i) => (
        <span
          key={`${j.f ?? j.t}-${i}`}
          className={`cg-tuile${j.petit ? " cg-tuile-p" : ""}${j.vif ? " cg-tuile-vif" : ""}`}
          style={
            {
              "--x": j.x,
              "--y": j.y,
              "--k": `${j.k}px`,
              "--d": `${j.d}s`,
              "--z": j.z,
              /* Le sens de fuite : vers le bord le plus proche. C'est ce qui
                 fait que le champ s'écarte au lieu de glisser en bloc. */
              "--dx": (j.x - 50) * 1.6,
              "--c": j.c,
              "--i": i,
              "--o": j.o,
            } as React.CSSProperties
          }
        >
          <span className="cg-tuile-p2">
            <span className="cg-tuile-a">
              <span className="cg-tuile-d">
                <span className="cg-tuile-i">
                  {j.f ? <Dessin f={j.f} /> : <em className={(j.t ?? "").length > 2 ? "cg-tuile-long" : undefined}>{j.t}</em>}
                </span>
              </span>
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}

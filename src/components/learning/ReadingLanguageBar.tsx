"use client";

import { BookOpen } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   MODE APPRENTISSAGE — la commande, pas une annonce

   Elle occupait toute la largeur au-dessus de l'article, avec un cadre vert
   épais, une liste déroulante native et un drapeau collé à un code pays. Trois
   défauts en un : elle annonçait plus fort que le titre, la liste ne proposait
   qu'une seule langue, et le rendu natif d'un select n'est celui d'aucun autre
   élément du site. C'est maintenant une pastille posée à droite, à la taille
   d'une commande, et le couple de langues s'y lit sans liste puisqu'il n'y a
   rien à choisir. Le jour où une deuxième langue arrive, elle prendra la forme
   d'un menu dessiné par nous, pas celle du navigateur.
   ═══════════════════════════════════════════════════════════════════════════ */

const TARGET_LABEL: Record<string, string> = { en: "EN" };

interface Props {
  fromLang: string;
  toLang: string;
  onToLangChange: (lang: string) => void;
  enabled: boolean;
  onToggle: () => void;
  /** Conservé pour les appelants ; la barre a désormais un seul registre. */
  emphasis?: boolean;
}

export function ReadingLanguageBar({ fromLang, toLang, enabled, onToggle }: Props) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 9,
          padding: "5px 6px 5px 12px",
          borderRadius: 999,
          border: `1px solid ${enabled ? "rgba(57,255,136,0.45)" : "var(--border)"}`,
          background: enabled ? "rgba(57,255,136,0.07)" : "var(--surface-2)",
          transition: "all 0.2s ease",
        }}
      >
        <BookOpen
          size={13}
          style={{ color: enabled ? "#0D7A40" : "var(--ink-4)", flexShrink: 0 }}
        />

        <span
          style={{
            fontSize: "0.66rem",
            fontWeight: 700,
            color: enabled ? "var(--ink-2)" : "var(--ink-4)",
            whiteSpace: "nowrap",
          }}
        >
          Mode apprentissage
        </span>

        <span
          style={{
            fontSize: "0.6rem",
            fontWeight: 800,
            letterSpacing: "0.06em",
            color: enabled ? "#0D7A40" : "var(--ink-4)",
            whiteSpace: "nowrap",
          }}
        >
          {fromLang.toUpperCase()} → {TARGET_LABEL[toLang] ?? toLang.toUpperCase()}
        </span>

        <button
          onClick={onToggle}
          aria-pressed={enabled}
          style={{
            fontSize: "0.58rem",
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "4px 10px",
            borderRadius: 999,
            border: "none",
            background: enabled ? "#0D7A40" : "var(--border)",
            color: enabled ? "#fff" : "var(--ink-3)",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {enabled ? "Actif" : "Inactif"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { BookOpen } from "lucide-react";

const TARGET_LANGS = [
  { code: "en", label: "English 🇬🇧" },
];

interface Props {
  fromLang: string;
  toLang: string;
  onToLangChange: (lang: string) => void;
  enabled: boolean;
  onToggle: () => void;
  /**
   * Louder register. The bar is a quiet utility inside a published article,
   * where it must not compete with the text; in the format under test it is
   * one of the things being shown, so it says so.
   */
  emphasis?: boolean;
}

export function ReadingLanguageBar({
  toLang,
  onToLangChange,
  enabled,
  onToggle,
  emphasis = false,
}: Props) {
  const live = enabled && emphasis;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10,
        padding: emphasis ? "14px 18px" : "10px 14px",
        borderRadius: emphasis ? 14 : 12,
        background: live
          ? "linear-gradient(120deg, rgba(57,255,136,0.20), rgba(57,255,136,0.07))"
          : enabled
          ? "rgba(57,255,136,0.05)"
          : "var(--surface-2)",
        border: `${live ? 2 : 1}px solid ${
          live ? "#39FF88" : enabled ? "rgba(57,255,136,0.22)" : "var(--border)"
        }`,
        boxShadow: live ? "0 0 0 4px rgba(57,255,136,0.12)" : undefined,
        marginBottom: 28,
        transition: "all 0.25s ease",
      }}
    >
      <BookOpen
        size={emphasis ? 17 : 14}
        style={{
          color: live ? "#0D7A40" : enabled ? "#39FF88" : "var(--ink-4)",
          flexShrink: 0,
          transition: "color 0.25s",
        }}
      />

      <div style={{ flex: 1, minWidth: 120 }}>
        <p
          style={{
            fontSize: emphasis ? "0.7rem" : "0.6rem",
            fontWeight: 900,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: enabled ? "#0D7A40" : "var(--ink-4)",
            transition: "color 0.25s",
          }}
        >
          Mode apprentissage
        </p>
        {enabled && (
          <p
            style={{
              fontSize: emphasis ? "0.72rem" : "0.58rem",
              color: emphasis ? "var(--ink-2)" : "var(--ink-3)",
              marginTop: 3,
              lineHeight: 1.45,
            }}
          >
            Sélectionnez un mot ou une phrase pour voir sa traduction
          </p>
        )}
      </div>

      {/* Language selector */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
        <span
          style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.04em" }}
        >
          🇫🇷 FR
        </span>
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
          <path
            d="M0 5h16M12 1l4 4-4 4"
            stroke={enabled ? "#39FF88" : "var(--ink-5)"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <select
          value={toLang}
          onChange={(e) => onToLangChange(e.target.value)}
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "3px 6px",
            background: "var(--surface)",
            color: "var(--ink)",
            cursor: "pointer",
            outline: "none",
          }}
        >
          {TARGET_LANGS.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        style={{
          flexShrink: 0,
          fontSize: "0.6rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "5px 11px",
          borderRadius: 8,
          border: `1px solid ${enabled ? "rgba(57,255,136,0.4)" : "var(--border)"}`,
          background: enabled ? "rgba(57,255,136,0.1)" : "var(--surface-2)",
          color: enabled ? "#0D7A40" : "var(--ink-4)",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        {enabled ? "● Actif" : "○ Inactif"}
      </button>
    </div>
  );
}

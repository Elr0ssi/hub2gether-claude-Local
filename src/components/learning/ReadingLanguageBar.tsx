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
}

export function ReadingLanguageBar({ toLang, onToLangChange, enabled, onToggle }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 12,
        background: enabled ? "rgba(57,255,136,0.05)" : "var(--surface-2)",
        border: `1px solid ${enabled ? "rgba(57,255,136,0.22)" : "var(--border)"}`,
        marginBottom: 28,
        transition: "all 0.25s ease",
      }}
    >
      <BookOpen
        size={14}
        style={{ color: enabled ? "#39FF88" : "var(--ink-4)", flexShrink: 0, transition: "color 0.25s" }}
      />

      <div style={{ flex: 1, minWidth: 120 }}>
        <p
          style={{
            fontSize: "0.6rem",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: enabled ? "#0D7A40" : "var(--ink-4)",
            transition: "color 0.25s",
          }}
        >
          Mode apprentissage
        </p>
        {enabled && (
          <p style={{ fontSize: "0.58rem", color: "var(--ink-3)", marginTop: 2, lineHeight: 1.4 }}>
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

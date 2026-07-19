"use client";

import { useEffect, useState } from "react";

interface Props {
  text: string;
  rect: DOMRect;
  fromLang: string;
  toLang: string;
}

const LANG_LABELS: Record<string, string> = {
  fr: "FR",
  en: "EN",
  es: "ES",
  de: "DE",
  zh: "ZH",
  ar: "AR",
};

export function TranslationBubble({ text, rect, fromLang, toLang }: Props) {
  const [translation, setTranslation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTranslation(null);
    setError(false);

    const ctrl = new AbortController();

    fetch(
      `/api/translate?text=${encodeURIComponent(text)}&langpair=${encodeURIComponent(`${fromLang}|${toLang}`)}`,
      { signal: ctrl.signal }
    )
      .then((r) => r.json())
      .then((d) => {
        setTranslation(d.translation ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (!ctrl.signal.aborted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => ctrl.abort();
  }, [text, fromLang, toLang]);

  // Center the bubble on the selection, fixed to viewport
  const centerX = rect.left + rect.width / 2;
  const clampedX = Math.max(130, Math.min(window.innerWidth - 130, centerX));
  const showBelow = rect.top < 90;

  const fromLabel = LANG_LABELS[fromLang] ?? fromLang.toUpperCase();
  const toLabel = LANG_LABELS[toLang] ?? toLang.toUpperCase();

  return (
    <div
      style={{
        position: "fixed",
        left: clampedX,
        top: showBelow ? rect.bottom + 10 : rect.top - 10,
        transform: showBelow ? "translateX(-50%)" : "translate(-50%, -100%)",
        zIndex: 10000,
        pointerEvents: "none",
        maxWidth: 300,
        width: "max-content",
      }}
    >
      <div
        style={{
          background: "#0A0A0A",
          color: "#fff",
          borderRadius: 12,
          padding: "9px 14px 11px",
          boxShadow: "0 6px 28px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.25)",
          position: "relative",
          textAlign: "center",
          lineHeight: 1.45,
        }}
      >
        {/* Language tag */}
        <div
          style={{
            fontSize: "0.52rem",
            fontWeight: 800,
            letterSpacing: "0.14em",
            color: "#39FF88",
            marginBottom: 5,
            textTransform: "uppercase",
          }}
        >
          {fromLabel} → {toLabel}
        </div>

        {/* Original word (truncated) */}
        <div
          style={{
            fontSize: "0.6rem",
            color: "rgba(255,255,255,0.45)",
            marginBottom: 4,
            maxWidth: 260,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {text.length > 60 ? text.slice(0, 60) + "…" : text}
        </div>

        {/* Translated text */}
        <div
          style={{
            fontSize: "0.88rem",
            fontWeight: 600,
            color: loading ? "#6B6B6B" : error ? "#EF4444" : "#FFFFFF",
            minWidth: 60,
          }}
        >
          {loading ? "…" : error ? "Indisponible" : (translation ?? "—")}
        </div>

        {/* Caret arrow */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "7px solid transparent",
            borderRight: "7px solid transparent",
            ...(showBelow
              ? { top: -6, borderBottom: "7px solid #0A0A0A" }
              : { bottom: -6, borderTop: "7px solid #0A0A0A" }),
          }}
        />
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { formatYear } from "@/lib/utils";
import type { TimelineEntry } from "@/types";

interface TimelineSelectorProps {
  entries: TimelineEntry[];
  selectedYear: number;
  onChange: (year: number) => void;
}

export function TimelineSelector({
  entries,
  selectedYear,
  onChange,
}: TimelineSelectorProps) {
  return (
    <div
      className="w-full px-6 py-5 border-t"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <p className="section-title mb-4">Timeline</p>

      <div className="relative" role="radiogroup" aria-label="Select historical period">
        {/* Connecting line */}
        <div
          className="absolute top-3 left-0 right-0 h-px"
          style={{ background: "var(--border)", zIndex: 0 }}
        />

        {/* Progress line */}
        {(() => {
          const idx = entries.findIndex((e) => e.year === selectedYear);
          const pct = entries.length > 1 ? (idx / (entries.length - 1)) * 100 : 0;
          return (
            <div
              className="absolute top-3 left-0 h-px transition-all duration-500"
              style={{
                background: "var(--accent)",
                width: `${pct}%`,
                zIndex: 1,
                boxShadow: "var(--shadow-glow-sm)",
              }}
            />
          );
        })()}

        {/* Dots row */}
        <div className="relative flex items-start justify-between" style={{ zIndex: 2 }}>
          {entries.map((entry) => {
            const isActive = entry.year === selectedYear;
            return (
              <button
                key={entry.year}
                role="radio"
                aria-checked={isActive}
                aria-label={`${formatYear(entry.year)} — ${entry.label}`}
                onClick={() => onChange(entry.year)}
                className="flex flex-col items-center gap-2 group focus:outline-none"
                style={{ minWidth: 0 }}
              >
                {/* Dot */}
                <div className="relative">
                  <motion.div
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: isActive ? 14 : 8,
                      height: isActive ? 14 : 8,
                      background: isActive ? "var(--accent)" : "var(--border)",
                      boxShadow: isActive ? "var(--shadow-glow-sm)" : "none",
                      border: isActive ? "2px solid rgba(57,255,136,0.3)" : "none",
                    }}
                    layout
                  />
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: "rgba(57,255,136,0.2)" }}
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                </div>

                {/* Year label */}
                <span
                  className="text-xs font-medium transition-colors duration-200 select-none"
                  style={{
                    color: isActive ? "#0D7A40" : "var(--ink-4)",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "0.7rem",
                  }}
                >
                  {formatYear(entry.year)}
                </span>

                {/* Era label (only active) */}
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-caption text-center hidden sm:block"
                    style={{
                      color: "var(--ink-4)",
                      fontSize: "0.65rem",
                      maxWidth: "70px",
                      lineHeight: 1.3,
                    }}
                  >
                    {entry.label.split("—")[0].trim()}
                  </motion.span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

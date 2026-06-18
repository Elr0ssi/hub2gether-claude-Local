"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Vote, Calendar, Flag, User } from "lucide-react";
import type { PoliticalPeriod } from "@/data/politics/politics";
import { ORIENTATION_COLORS, ORIENTATION_LABELS } from "@/lib/politicsColors";

interface PoliticsSidePanelProps {
  countryName: string | null;
  period: PoliticalPeriod | undefined;
  year: number;
  open: boolean;
  onClose: () => void;
}

export function PoliticsSidePanel({ countryName, period, year, open, onClose }: PoliticsSidePanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex-shrink-0 overflow-hidden w-full lg:w-[300px] lg:min-w-[300px] border-t lg:border-t-0 lg:border-l"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 sticky top-0" style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)", zIndex: 10 }}>
              <span className="text-sm font-bold" style={{ color: "var(--ink)" }}>
                {countryName ?? "Sélection"}
              </span>
              <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg"><X size={14} /></button>
            </div>

            {/* Empty state */}
            {!period || !countryName ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
                <Vote size={28} style={{ color: "var(--ink-4)" }} />
                <p className="text-sm" style={{ color: "var(--ink-3)" }}>Cliquez sur un pays pour voir son régime politique en {year}</p>
              </div>
            ) : (
              <div className="px-4 py-4 flex flex-col gap-5">
                <p className="text-xs" style={{ color: "var(--ink-4)" }}>Données {year}</p>

                {/* Orientation badge */}
                <div
                  className="rounded-xl px-4 py-4 flex items-center gap-3"
                  style={{ background: `${ORIENTATION_COLORS[period.orientation]}18`, border: `1px solid ${ORIENTATION_COLORS[period.orientation]}44` }}
                >
                  <div
                    className="w-4 h-4 rounded-sm shrink-0"
                    style={{ background: ORIENTATION_COLORS[period.orientation] }}
                  />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: ORIENTATION_COLORS[period.orientation] }}>
                      {ORIENTATION_LABELS[period.orientation]}
                    </p>
                    <p className="text-base font-bold" style={{ color: ORIENTATION_COLORS[period.orientation] }}>
                      {period.regime}
                    </p>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 gap-2">
                  <div className="rounded-xl px-3 py-2.5 flex items-start gap-2.5" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                    <User size={13} style={{ color: "var(--ink-4)", marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <p style={{ color: "var(--ink-3)", fontSize: "0.6rem", textTransform: "uppercase", fontWeight: 700 }}>{period.leader_title}</p>
                      <p className="text-sm font-bold mt-0.5" style={{ color: "var(--ink)" }}>{period.leader}</p>
                    </div>
                  </div>

                  <div className="rounded-xl px-3 py-2.5 flex items-start gap-2.5" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                    <Calendar size={13} style={{ color: "var(--ink-4)", marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <p style={{ color: "var(--ink-3)", fontSize: "0.6rem", textTransform: "uppercase", fontWeight: 700 }}>Mandat</p>
                      <p className="text-sm font-bold mt-0.5" style={{ color: "var(--ink)" }}>{period.mandate}</p>
                    </div>
                  </div>

                  {period.party && (
                    <div className="rounded-xl px-3 py-2.5 flex items-start gap-2.5" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                      <Flag size={13} style={{ color: "var(--ink-4)", marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <p style={{ color: "var(--ink-3)", fontSize: "0.6rem", textTransform: "uppercase", fontWeight: 700 }}>Parti / Mouvement</p>
                        <p className="text-sm font-bold mt-0.5" style={{ color: "var(--ink)" }}>{period.party}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notable events */}
                {period.notable_events && period.notable_events.length > 0 && (
                  <div>
                    <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>
                      Faits marquants
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {period.notable_events.map((event, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span
                            className="w-1 h-1 rounded-full mt-2 shrink-0"
                            style={{ background: ORIENTATION_COLORS[period.orientation] }}
                          />
                          <span className="text-xs leading-relaxed" style={{ color: "var(--ink-2)" }}>{event}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Period range */}
                <div className="rounded-xl px-3 py-2.5" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                  <p style={{ color: "var(--ink-3)", fontSize: "0.6rem", textTransform: "uppercase", fontWeight: 700 }}>Période historique</p>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: "var(--ink-2)" }}>
                    {period.from} — {period.to === 9999 ? "présent" : period.to}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

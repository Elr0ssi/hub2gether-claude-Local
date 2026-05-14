"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, MapPin, Users, Calendar, Building } from "lucide-react";
import { formatYear, formatNumber } from "@/lib/utils";
import type { TimelineEntry } from "@/types";

interface SidePanelProps {
  entry: TimelineEntry | null;
  open: boolean;
  onClose: () => void;
  empireName?: string;
}

export function SidePanel({ entry, open, onClose, empireName = "Roman Empire" }: SidePanelProps) {
  return (
    <AnimatePresence>
      {open && entry && (
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col overflow-y-auto w-full lg:w-[320px] lg:min-w-[320px] border-t lg:border-t-0 lg:border-l"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          {/* Header */}
          <div
            className="px-5 py-4 border-b flex items-start justify-between gap-3"
            style={{ borderColor: "var(--border)" }}
          >
            <div>
              <span className="accent-badge text-xs mb-2 inline-flex">Empires</span>
              <h2 className="text-heading-2" style={{ color: "var(--ink)" }}>
                {empireName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="btn-ghost p-1.5 mt-0.5 shrink-0"
              aria-label="Close panel"
            >
              <X size={16} />
            </button>
          </div>

          {/* Period */}
          <AnimatePresence mode="wait">
            <motion.div
              key={entry.year}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex-1 overflow-y-auto"
            >
              {/* Period title */}
              <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border-light)" }}>
                <p className="text-caption mb-1">Selected period</p>
                <p className="text-heading-3" style={{ color: "var(--accent)", textShadow: "0 0 16px rgba(57,255,136,0.3)" }}>
                  {formatYear(entry.year)}
                </p>
                <p className="text-small font-medium mt-0.5" style={{ color: "var(--ink-2)" }}>
                  {entry.label}
                </p>
                <p className="text-caption mt-1" style={{ color: "var(--ink-4)" }}>
                  {entry.era}
                </p>
              </div>

              {/* Stats grid */}
              <div
                className="grid grid-cols-2 gap-px border-b"
                style={{ borderColor: "var(--border-light)", background: "var(--border)" }}
              >
                {[
                  {
                    icon: MapPin,
                    label: "Area",
                    value: `${formatNumber(entry.stats.areaSqKm)} km²`,
                  },
                  {
                    icon: Users,
                    label: "Population",
                    value: formatNumber(entry.stats.populationEstimate),
                  },
                  {
                    icon: Building,
                    label: "Capital",
                    value: entry.stats.capitalCity,
                  },
                  {
                    icon: Calendar,
                    label: "System",
                    value: entry.stats.politicalSystem,
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="px-4 py-3 flex flex-col gap-1"
                    style={{ background: "var(--surface)" }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon size={11} style={{ color: "var(--ink-4)" }} />
                      <span className="text-caption">{label}</span>
                    </div>
                    <span className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border-light)" }}>
                <p className="section-title mb-2.5">Summary</p>
                <p className="text-small leading-relaxed">{entry.description}</p>
              </div>

              {/* Key facts */}
              <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border-light)" }}>
                <p className="section-title mb-3">Key facts</p>
                <ul className="space-y-2">
                  {entry.stats.keyFacts.map((fact, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span
                        className="w-1 h-1 rounded-full mt-2 shrink-0"
                        style={{ background: "var(--accent)" }}
                      />
                      <span className="text-small">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Analysis */}
              <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border-light)" }}>
                <p className="section-title mb-2.5">Analysis</p>
                <p className="text-small leading-relaxed" style={{ color: "var(--ink-3)" }}>
                  {entry.analysis}
                </p>
              </div>

              {/* CTA */}
              <div className="px-5 py-5">
                <Link
                  href={`/map/empires/roman-empire-${entry.slug}`}
                  className="btn-primary w-full justify-center gap-2"
                >
                  Read full analysis
                  <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

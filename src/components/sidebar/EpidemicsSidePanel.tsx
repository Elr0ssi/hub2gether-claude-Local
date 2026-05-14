"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Users, Skull, AlertTriangle, Info } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { EpidemicDisease } from "@/types";

interface EpidemicsSidePanelProps {
  disease: EpidemicDisease;
  countryName: string | null;
  open: boolean;
  onClose: () => void;
}

function mortalityRate(infected: number, deaths: number): string {
  if (infected === 0) return "–";
  return ((deaths / infected) * 100).toFixed(1) + "%";
}

export function EpidemicsSidePanel({ disease, countryName, open, onClose }: EpidemicsSidePanelProps) {
  const data = countryName ? disease.countries[countryName] ?? null : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col overflow-y-auto"
          style={{
            width: "320px",
            minWidth: "320px",
            background: "var(--surface)",
            borderLeft: "1px solid var(--border)",
            height: "100%",
          }}
        >
          {/* Header */}
          <div
            className="px-5 py-4 border-b flex items-start justify-between gap-3"
            style={{ borderColor: "var(--border)" }}
          >
            <div>
              <span className="accent-badge text-xs mb-2 inline-flex">Épidémies</span>
              <h2 className="text-heading-2" style={{ color: "var(--ink)" }}>
                {countryName ?? "Sélectionnez un pays"}
              </h2>
              {countryName && (
                <p className="text-caption mt-0.5" style={{ color: "var(--ink-3)" }}>
                  {disease.label} · {disease.period}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="btn-ghost p-1.5 mt-0.5 shrink-0"
              aria-label="Close panel"
            >
              <X size={16} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {data && countryName ? (
              <motion.div
                key={countryName + disease.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex-1 overflow-y-auto"
              >
                {/* Stats grid */}
                <div
                  className="grid grid-cols-2 gap-px border-b"
                  style={{ borderColor: "var(--border)", background: "var(--border)" }}
                >
                  {[
                    {
                      icon: Users,
                      label: "Cas confirmés",
                      value: formatNumber(data.infected),
                      color: "var(--ink)",
                    },
                    {
                      icon: Skull,
                      label: "Décès",
                      value: formatNumber(data.deaths),
                      color: "var(--accent)",
                    },
                    {
                      icon: AlertTriangle,
                      label: "Létalité",
                      value: mortalityRate(data.infected, data.deaths),
                      color: "var(--ink)",
                    },
                    {
                      icon: Info,
                      label: "Maladie",
                      value: disease.label,
                      color: "var(--ink)",
                    },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div
                      key={label}
                      className="px-4 py-3 flex flex-col gap-1"
                      style={{ background: "var(--surface)" }}
                    >
                      <div className="flex items-center gap-1.5">
                        <Icon size={11} style={{ color: "var(--ink-4)" }} />
                        <span className="text-caption">{label}</span>
                      </div>
                      <span className="text-sm font-semibold" style={{ color }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Disease description */}
                <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border-light)" }}>
                  <p className="section-title mb-2.5">À propos de {disease.label}</p>
                  <p className="text-small leading-relaxed" style={{ color: "var(--ink-3)" }}>
                    {disease.description}
                  </p>
                </div>

                {/* Pathogen */}
                <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border-light)" }}>
                  <p className="section-title mb-2.5">Agent pathogène</p>
                  <p className="text-small font-medium" style={{ color: "var(--ink)" }}>
                    {disease.pathogen}
                  </p>
                </div>

                {/* Global figures */}
                <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border-light)" }}>
                  <p className="section-title mb-3">Chiffres mondiaux</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-small" style={{ color: "var(--ink-3)" }}>Cas totaux</span>
                      <span className="text-small font-semibold" style={{ color: "var(--ink)" }}>{disease.globalCases}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-small" style={{ color: "var(--ink-3)" }}>Décès totaux</span>
                      <span className="text-small font-semibold" style={{ color: "var(--accent)" }}>{disease.globalDeaths}</span>
                    </div>
                  </div>
                </div>

                {/* Data note */}
                <div className="px-5 py-4">
                  <p className="text-caption leading-relaxed" style={{ color: "var(--ink-4)" }}>
                    {disease.dataNote}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ background: "var(--surface-2)" }}
                >
                  <Users size={22} style={{ color: "var(--ink-4)" }} />
                </div>
                <p className="text-small font-medium mb-2" style={{ color: "var(--ink-2)" }}>
                  Aucun pays sélectionné
                </p>
                <p className="text-caption leading-relaxed" style={{ color: "var(--ink-4)" }}>
                  Cliquez sur un pays coloré sur la carte pour afficher les données épidémiologiques.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Users, Skull, AlertTriangle, MapPin } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { EpidemicDisease } from "@/types";

interface EpidemicsSidePanelProps {
  disease: EpidemicDisease;
  countryName: string | null;
  open: boolean;
  onClose: () => void;
  isYtd?: boolean;
}

function mortalityRate(infected: number, deaths: number): string {
  if (infected === 0) return "–";
  return ((deaths / infected) * 100).toFixed(1) + "%";
}

export function EpidemicsSidePanel({ disease, countryName, open, onClose, isYtd = false }: EpidemicsSidePanelProps) {
  const data = countryName ? disease.countries[countryName] ?? null : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col overflow-y-auto w-full lg:w-[300px] lg:min-w-[300px] border-t lg:border-t-0 lg:border-l"
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
              aria-label="Fermer"
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
                className="flex-1"
              >
                {/* Country stats */}
                <div
                  className="grid grid-cols-1 gap-px"
                  style={{ background: "var(--border)" }}
                >
                  {[
                    {
                      icon: Users,
                      label: isYtd ? "Cas estimés YTD" : "Cas confirmés",
                      value: formatNumber(data.infected),
                      sub: data.infected.toLocaleString("fr-FR"),
                      accent: false,
                    },
                    {
                      icon: Skull,
                      label: isYtd ? "Décès estimés YTD" : "Décès",
                      value: formatNumber(data.deaths),
                      sub: data.deaths.toLocaleString("fr-FR"),
                      accent: true,
                    },
                    {
                      icon: AlertTriangle,
                      label: "Taux de létalité",
                      value: mortalityRate(data.infected, data.deaths),
                      sub: "décès / cas confirmés",
                      accent: false,
                    },
                    {
                      icon: MapPin,
                      label: "Pays",
                      value: countryName,
                      sub: disease.label,
                      accent: false,
                    },
                  ].map(({ icon: Icon, label, value, sub, accent }) => (
                    <div
                      key={label}
                      className="px-5 py-4 flex items-center gap-4"
                      style={{ background: "var(--surface)" }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: accent ? "rgba(57,255,136,0.12)" : "var(--surface-2)" }}
                      >
                        <Icon size={15} style={{ color: accent ? "var(--accent)" : "var(--ink-3)" }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-caption mb-0.5">{label}</p>
                        <p
                          className="text-sm font-bold leading-none"
                          style={{ color: accent ? "var(--accent)" : "var(--ink)" }}
                        >
                          {value}
                        </p>
                        {sub && (
                          <p className="text-caption mt-0.5 truncate" style={{ color: "var(--ink-4)", fontSize: "0.6rem" }}>
                            {sub}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Source note */}
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
                  <MapPin size={20} style={{ color: "var(--ink-4)" }} />
                </div>
                <p className="text-small font-medium mb-2" style={{ color: "var(--ink-2)" }}>
                  Aucun pays sélectionné
                </p>
                <p className="text-caption leading-relaxed" style={{ color: "var(--ink-4)" }}>
                  Cliquez sur un pays coloré pour afficher ses données.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Shield, Users, Plane, Ship, Crosshair } from "lucide-react";
import { useDragScroll } from "@/hooks/useDragScroll";
import type { MilitaryMetricId, MilitaryCountryData } from "@/data/military/military";
import { MILITARY_METRICS } from "@/data/military/military";
import { MILITARY_EQUIPMENT, EQUIPMENT_TYPE_LABELS, EQUIPMENT_TYPE_ICONS } from "@/data/military/militaryEquipment";
import type { EquipmentType, MilitaryEquipment } from "@/data/military/militaryEquipment";

interface MilitarySidePanelProps {
  countryName: string | null;
  data: MilitaryCountryData | undefined;
  metric: MilitaryMetricId;
  year: number;
  open: boolean;
  onClose: () => void;
}

const METRIC_ICONS: Record<MilitaryMetricId, React.ElementType> = {
  budget:   Shield,
  soldiers: Users,
  tanks:    Crosshair,
  ships:    Ship,
  aircraft: Plane,
};

function fmtValue(value: number, metric: MilitaryMetricId): string {
  if (metric === "budget")   return `${value.toLocaleString("fr-FR")} Mds€`;
  if (metric === "soldiers") return `${value.toLocaleString("fr-FR")} k`;
  return value.toLocaleString("fr-FR");
}

const EQUIPMENT_FILTER_TYPES: { id: EquipmentType | "all"; label: string }[] = [
  { id: "all",       label: "Tout" },
  { id: "tank",      label: "Chars" },
  { id: "aircraft",  label: "Avions" },
  { id: "ship",      label: "Navires" },
  { id: "drone",     label: "Drones" },
  { id: "missile",   label: "Missiles" },
  { id: "system",    label: "Systèmes" },
];

function EquipmentCard({ equipment }: { equipment: MilitaryEquipment }) {
  const [imgErr, setImgErr] = useState(false);
  const icon = EQUIPMENT_TYPE_ICONS[equipment.type];

  return (
    <div
      className="flex-shrink-0 w-56 rounded-xl overflow-hidden flex flex-col"
      style={{ background: "var(--surface-2)", border: "1px solid var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
    >
      {/* Image */}
      <div className="w-full h-28 bg-gray-100 flex items-center justify-center overflow-hidden" style={{ background: "var(--surface)" }}>
        {!imgErr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={equipment.imageUrl}
            alt={equipment.name}
            className="w-full h-full object-cover"
            onError={() => setImgErr(true)}
          />
        ) : (
          <span className="text-4xl">{icon}</span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: "var(--ink-4)" }}>{icon}</span>
          <span className="text-xs font-semibold" style={{ color: "var(--accent)", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {EQUIPMENT_TYPE_LABELS[equipment.type]}
          </span>
        </div>
        <p className="text-xs font-bold leading-snug" style={{ color: "var(--ink)" }}>{equipment.name}</p>
        <p style={{ color: "var(--ink-4)", fontSize: "0.62rem", lineHeight: 1.4,
          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {equipment.description}
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: "1px solid var(--border)" }}>
          <div>
            <p style={{ color: "var(--ink-4)", fontSize: "0.55rem" }}>En service</p>
            <p className="font-bold tabular-nums" style={{ color: "var(--ink)", fontSize: "0.7rem" }}>
              {equipment.count > 0 ? equipment.count.toLocaleString("fr-FR") : "En commande"}
            </p>
          </div>
          <div className="text-right">
            <p style={{ color: "var(--ink-4)", fontSize: "0.55rem" }}>Coût unitaire</p>
            <p className="font-bold tabular-nums" style={{ color: "#0D7A40", fontSize: "0.7rem" }}>
              {equipment.unitCostM >= 1000
                ? `${(equipment.unitCostM / 1000).toFixed(1)} Mds€`
                : `${equipment.unitCostM} M€`}
            </p>
          </div>
        </div>

        <p style={{ color: "var(--ink-4)", fontSize: "0.55rem" }}>
          {equipment.origin} · depuis {equipment.inServiceSince}
        </p>
      </div>
    </div>
  );
}

export function MilitarySidePanel({ countryName, data, metric, year, open, onClose }: MilitarySidePanelProps) {
  const [filterType, setFilterType] = useState<EquipmentType | "all">("all");
  const { ref: carouselRef, onMouseDown, onMouseUp, onMouseLeave, onMouseMove } = useDragScroll();

  const equipment = countryName ? (MILITARY_EQUIPMENT[countryName] ?? []) : [];
  const filtered = filterType === "all" ? equipment : equipment.filter(e => e.type === filterType);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="military-panel"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex-shrink-0 overflow-hidden flex flex-col"
          style={{ borderLeft: "1px solid var(--border)", background: "var(--surface)", minHeight: 0 }}
        >
          <div className="w-80 h-full flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
              <p className="text-xs font-bold" style={{ color: "var(--ink)" }}>
                {countryName ?? "Sélectionnez un pays"}
              </p>
              <button onClick={onClose} className="btn-ghost p-1">
                <X size={13} />
              </button>
            </div>

            {countryName && data ? (
              <>
                {/* Stats grid */}
                <div className="p-4 grid grid-cols-2 gap-2">
                  {MILITARY_METRICS.map(({ id, label, unit, color }) => {
                    const Icon = METRIC_ICONS[id];
                    const isActive = id === metric;
                    const value = data[id];
                    return (
                      <div
                        key={id}
                        className="rounded-xl px-3 py-2.5 flex flex-col gap-1"
                        style={{
                          background: isActive ? "var(--accent-dim)" : "var(--surface-2)",
                          border: `1px solid ${isActive ? "rgba(57,255,136,0.3)" : "var(--border)"}`,
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          <Icon size={11} style={{ color: isActive ? "#0D7A40" : color }} />
                          <span style={{ color: "var(--ink-4)", fontSize: "0.58rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            {label}
                          </span>
                        </div>
                        <p className="text-base font-bold tabular-nums leading-none" style={{ color: isActive ? "#0D7A40" : "var(--ink)" }}>
                          {fmtValue(value, id)}
                        </p>
                        <p style={{ color: "var(--ink-4)", fontSize: "0.55rem" }}>{unit} · {year}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Equipment section */}
                {equipment.length > 0 && (
                  <div className="px-4 pb-4 flex flex-col gap-3 flex-1">
                    <div>
                      <p className="text-xs font-bold mb-2" style={{ color: "var(--ink-2)" }}>Équipements majeurs</p>

                      {/* Type filter */}
                      <div className="flex gap-1 flex-wrap mb-3">
                        {EQUIPMENT_FILTER_TYPES.map(({ id, label }) => {
                          const hasItems = id === "all" ? true : equipment.some(e => e.type === id);
                          if (!hasItems) return null;
                          return (
                            <button
                              key={id}
                              onClick={() => { setFilterType(id as EquipmentType | "all"); }}
                              className="px-2 py-0.5 rounded text-xs transition-all"
                              style={filterType === id
                                ? { background: "var(--accent-dim)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.3)", fontWeight: 700, fontSize: "0.62rem" }
                                : { background: "var(--surface-2)", color: "var(--ink-4)", border: "1px solid var(--border)", fontSize: "0.62rem" }
                              }
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Carousel drag-scroll */}
                      {filtered.length > 0 ? (
                        <div
                          ref={carouselRef}
                          className="flex gap-3 overflow-x-auto pb-2 select-none"
                          style={{ scrollbarWidth: "none", cursor: "grab", scrollSnapType: "x mandatory" }}
                          onMouseDown={onMouseDown}
                          onMouseUp={onMouseUp}
                          onMouseLeave={onMouseLeave}
                          onMouseMove={onMouseMove}
                        >
                          {filtered.map((eq) => (
                            <div key={eq.name} style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
                              <EquipmentCard equipment={eq} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: "var(--ink-4)", fontSize: "0.7rem" }}>Aucun équipement dans cette catégorie.</p>
                      )}
                    </div>

                    {/* Source */}
                    <p style={{ color: "var(--ink-4)", fontSize: "0.56rem", marginTop: "auto" }}>
                      Sources : SIPRI, Global Firepower, IISS Military Balance {year}
                    </p>
                  </div>
                )}

                {equipment.length === 0 && (
                  <div className="px-4 pb-4 flex-1 flex items-center justify-center">
                    <p style={{ color: "var(--ink-4)", fontSize: "0.72rem" }}>Données équipements non disponibles.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4 text-center">
                <Shield size={28} style={{ color: "var(--ink-4)", opacity: 0.4 }} />
                <p style={{ color: "var(--ink-3)", fontSize: "0.72rem" }}>
                  Cliquez sur un pays sur la carte pour voir ses capacités militaires et ses équipements.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Maximize2, ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { EpidemicsInteractiveMap } from "./EpidemicsInteractiveMap";
import { EpidemicsSidePanel } from "@/components/sidebar/EpidemicsSidePanel";
import { ThemeDropdown } from "./ThemeDropdown";
import { EPIDEMICS, getDiseaseById } from "@/data/epidemics/epidemics";
import type { EpidemicDiseaseId } from "@/types";


export function EpidemicsMapView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const diseaseId = (searchParams.get("disease") ?? "covid") as EpidemicDiseaseId;
  const disease = getDiseaseById(diseaseId) ?? EPIDEMICS[0];

  const handleDiseaseChange = useCallback(
    (id: EpidemicDiseaseId) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("disease", id);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      setSelectedCountry(null);
    },
    [router, pathname, searchParams]
  );

  const handleCountryClick = useCallback((countryName: string) => {
    setSelectedCountry(countryName);
    setSidePanelOpen(true);
  }, []);

  return (
    <>
      {/* Map card */}
      <div
        className="border rounded-2xl overflow-hidden"
        style={{
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-float)",
          background: "var(--surface)",
        }}
      >
        {/* Toolbar */}
        <div
          className="px-4 py-3 border-b flex items-center justify-between gap-4 flex-wrap"
          style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <ThemeDropdown currentTheme="epidemics" />
            <div className="h-4 w-px" style={{ background: "var(--border)" }} />

            {/* Disease selector */}
            <div className="flex items-center gap-1">
              {EPIDEMICS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleDiseaseChange(d.id as EpidemicDiseaseId)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                  style={
                    d.id === diseaseId
                      ? {
                          background: "var(--accent-dim)",
                          color: "#0D7A40",
                          border: "1px solid rgba(57,255,136,0.3)",
                          fontWeight: 700,
                        }
                      : {
                          background: "transparent",
                          color: "var(--ink-3)",
                          border: "1px solid transparent",
                        }
                  }
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {sidePanelOpen ? (
              <button
                onClick={() => setSidePanelOpen(false)}
                className="btn-ghost px-2.5 py-1.5 text-xs gap-1.5"
                title="Expand map"
              >
                <Maximize2 size={13} />
                Expand
              </button>
            ) : (
              <button
                onClick={() => setSidePanelOpen(true)}
                className="btn-ghost px-2.5 py-1.5 text-xs gap-1.5"
                title="Show details"
              >
                <ChevronLeft size={13} />
                Détails
              </button>
            )}
          </div>
        </div>

        {/* Sub-header: disease label + period + country count */}
        <div
          className="px-5 py-2 border-b flex items-center gap-2"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
            {disease.label}
          </span>
          <span className="text-xs" style={{ color: "var(--ink-4)" }}>
            · {disease.period}
          </span>
          <span className="text-xs ml-auto" style={{ color: "var(--ink-4)" }}>
            {Object.keys(disease.countries).length} pays documentés
          </span>
        </div>

        {/* Map + Side panel */}
        <div className="flex" style={{ minHeight: "480px" }}>
          <div className="flex-1" style={{ minWidth: 0 }}>
            <EpidemicsInteractiveMap
              disease={disease}
              selectedCountry={selectedCountry}
              onCountryClick={handleCountryClick}
            />
          </div>

          <EpidemicsSidePanel
            disease={disease}
            countryName={selectedCountry}
            open={sidePanelOpen}
            onClose={() => setSidePanelOpen(false)}
          />
        </div>
      </div>

      {/* Disease info blocks — below the map card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={diseaseId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4"
        >
          {/* Block 1: À propos */}
          <div
            className="rounded-xl px-4 py-4 flex flex-col gap-2"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700 }}>
              À propos de {disease.label}
            </p>
            <p className="text-small leading-relaxed" style={{ color: "var(--ink-2)" }}>
              {disease.description}
            </p>
          </div>

          {/* Block 2: Agent pathogène */}
          <div
            className="rounded-xl px-4 py-4 flex flex-col gap-2"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700 }}>
              Agent pathogène
            </p>
            <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
              {disease.pathogen}
            </p>
          </div>

          {/* Block 3: Chiffres mondiaux */}
          <div
            className="rounded-xl px-4 py-4 flex flex-col gap-2"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700 }}>
              Chiffres mondiaux
            </p>
            <div className="space-y-2 mt-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-small" style={{ color: "var(--ink-3)" }}>Cas totaux</span>
                <span className="text-small font-semibold" style={{ color: "var(--ink)" }}>{disease.globalCases}</span>
              </div>
              <div style={{ height: "1px", background: "var(--border)" }} />
              <div className="flex items-center justify-between gap-2">
                <span className="text-small" style={{ color: "var(--ink-3)" }}>Décès totaux</span>
                <span className="text-small font-semibold" style={{ color: "var(--accent)" }}>{disease.globalDeaths}</span>
              </div>
            </div>
          </div>

          {/* Block 4: Source */}
          <div
            className="rounded-xl px-4 py-4 flex flex-col gap-2"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p style={{ color: "var(--ink-3)", fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700 }}>
              Source des données
            </p>
            <p className="text-small leading-relaxed" style={{ color: "var(--ink-4)" }}>
              {disease.dataNote}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

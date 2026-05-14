"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Maximize2, ChevronLeft } from "lucide-react";
import { EpidemicsInteractiveMap } from "./EpidemicsInteractiveMap";
import { EpidemicsSidePanel } from "@/components/sidebar/EpidemicsSidePanel";
import { ThemeDropdown } from "./ThemeDropdown";
import { EPIDEMICS, getDiseaseById } from "@/data/epidemics/epidemics";
import type { EpidemicDiseaseId } from "@/types";

const DISEASE_COLORS: Record<EpidemicDiseaseId, string> = {
  covid: "#39FF88",
  "black-death": "#39FF88",
  hiv: "#39FF88",
  hantavirus: "#39FF88",
};

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

      {/* Map + Side panel */}
      <div className="flex" style={{ minHeight: "480px" }}>
        <div className="flex-1" style={{ minWidth: 0 }}>
          {/* Period label */}
          <div
            className="px-5 py-2 border-b flex items-center gap-2"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <span
              className="text-xs font-semibold"
              style={{ color: DISEASE_COLORS[diseaseId] }}
            >
              {disease.label}
            </span>
            <span className="text-xs" style={{ color: "var(--ink-4)" }}>
              · {disease.period}
            </span>
            <span className="text-xs ml-auto" style={{ color: "var(--ink-4)" }}>
              {Object.keys(disease.countries).length} pays documentés
            </span>
          </div>

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
  );
}

"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Maximize2, Minimize2, ChevronLeft } from "lucide-react";
import { InteractiveMap } from "./InteractiveMap";
import { TimelineSelector } from "./TimelineSelector";
import { ThemeDropdown } from "./ThemeDropdown";
import { SidePanel } from "@/components/sidebar/SidePanel";
import { EMPIRES, getEmpireById } from "@/data/empires/empires-index";
import { formatYear } from "@/lib/utils";
import type { ThemeId } from "@/types";

const EMPIRE_LABELS: Record<string, string> = {
  roman: "🏛️",
  napoleonic: "⚔️",
  "french-colonial": "🇫🇷",
  mongol: "🐴",
  ottoman: "🌙",
  macedonian: "🗡️",
};

interface MapViewProps {
  theme: ThemeId;
  initialYear?: number;
}

export function MapView({ theme, initialYear = 117 }: MapViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const empireId = searchParams.get("empire") ?? "roman";
  const currentEmpire = getEmpireById(empireId) ?? EMPIRES[0];

  const rawYear = parseInt(searchParams.get("year") ?? String(currentEmpire.defaultYear));
  const selectedYear = isNaN(rawYear) ? currentEmpire.defaultYear : rawYear;

  const currentEntry =
    currentEmpire.timeline.find((e) => e.year === selectedYear) ??
    currentEmpire.timeline[Math.floor(currentEmpire.timeline.length / 2)];

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) params.set(k, v);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const handleEmpireChange = useCallback(
    (id: string) => {
      const empire = getEmpireById(id);
      if (!empire) return;
      updateParams({ empire: id, year: String(empire.defaultYear) });
      setSidePanelOpen(true);
    },
    [updateParams]
  );

  const handleYearChange = useCallback(
    (year: number) => {
      updateParams({ year: String(year) });
      setSidePanelOpen(true);
    },
    [updateParams]
  );

  return (
    <div
      className={`border rounded-2xl overflow-hidden${isFullscreen ? " fixed inset-0 z-[9999] rounded-none flex flex-col" : ""}`}
      style={{
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-float)",
        background: "var(--surface)",
      }}
    >
      {/* Toolbar */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between gap-3"
        style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <ThemeDropdown currentTheme={theme} />
          <div className="h-4 w-px shrink-0" style={{ background: "var(--border)" }} />

          {/* Empire selector — horizontally scrollable on mobile */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: "none" }}>
            {EMPIRES.map((empire) => {
              const isActive = empire.id === empireId;
              return (
                <button
                  key={empire.id}
                  onClick={() => handleEmpireChange(empire.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shrink-0"
                  title={`${empire.name} — ${empire.period}`}
                  style={
                    isActive
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
                  <span>{EMPIRE_LABELS[empire.id] ?? "🗺️"}</span>
                  <span className="hidden md:inline">{empire.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs hidden sm:block" style={{ color: "var(--ink-4)" }}>
            {currentEmpire.period}
          </span>
          {sidePanelOpen ? (
            <button onClick={() => setSidePanelOpen(false)} className="btn-ghost px-2.5 py-1.5 text-xs gap-1.5">
              <ChevronLeft size={13} /> Réduire
            </button>
          ) : (
            <button onClick={() => setSidePanelOpen(true)} className="btn-ghost px-2.5 py-1.5 text-xs gap-1.5">
              <ChevronLeft size={13} /> Détails
            </button>
          )}
          <button
            onClick={() => setIsFullscreen((f) => !f)}
            className="btn-ghost px-2.5 py-1.5 text-xs gap-1.5"
            title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            <span className="hidden sm:inline">{isFullscreen ? "Réduire" : "Expand"}</span>
          </button>
        </div>
      </div>

      {/* Map + Side panel */}
      <div
        className={`flex flex-col lg:flex-row${isFullscreen ? " flex-1 overflow-hidden" : ""}`}
        style={isFullscreen ? {} : { minHeight: "500px" }}
      >
        {/* Map + Timeline */}
        <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
          <div className="flex-1">
            <InteractiveMap
              geojsonFile={currentEntry.geojsonFile}
              onTerritoryClick={() => setSidePanelOpen(true)}
              mapCenter={currentEmpire.mapCenter}
              mapScale={currentEmpire.mapScale}
            />
          </div>

          <TimelineSelector
            entries={currentEmpire.timeline}
            selectedYear={selectedYear}
            onChange={handleYearChange}
          />
        </div>

        {/* Side panel */}
        <SidePanel
          entry={currentEntry}
          open={sidePanelOpen}
          onClose={() => setSidePanelOpen(false)}
          empireName={currentEmpire.name}
        />
      </div>
    </div>
  );
}

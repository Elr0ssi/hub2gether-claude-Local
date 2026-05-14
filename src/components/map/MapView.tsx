"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Maximize2, ChevronLeft } from "lucide-react";
import { InteractiveMap } from "./InteractiveMap";
import { TimelineSelector } from "./TimelineSelector";
import { ThemeDropdown } from "./ThemeDropdown";
import { SidePanel } from "@/components/sidebar/SidePanel";
import { ROMAN_TIMELINE } from "@/data/timeline";
import { formatYear } from "@/lib/utils";
import type { ThemeId } from "@/types";

interface MapViewProps {
  theme: ThemeId;
  initialYear?: number;
}

export function MapView({ theme, initialYear = 117 }: MapViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sidePanelOpen, setSidePanelOpen] = useState(true);

  const selectedYear = parseInt(searchParams.get("year") ?? String(initialYear));

  const currentEntry =
    ROMAN_TIMELINE.find((e) => e.year === selectedYear) ?? ROMAN_TIMELINE[3];

  const handleYearChange = useCallback(
    (year: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("year", year.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      setSidePanelOpen(true);
    },
    [router, pathname, searchParams]
  );

  return (
    <div
      className="border rounded-2xl overflow-hidden"
      style={{
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-float)",
        background: "var(--surface)",
      }}
    >
      {/* Map toolbar */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between gap-4"
        style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
      >
        <div className="flex items-center gap-3">
          <ThemeDropdown currentTheme={theme} />
          <div
            className="h-4 w-px"
            style={{ background: "var(--border)" }}
          />
          <span className="text-small font-medium" style={{ color: "var(--ink-2)" }}>
            Roman Empire ·{" "}
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>
              {formatYear(currentEntry.year)}
            </span>
          </span>
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
              Details
            </button>
          )}
        </div>
      </div>

      {/* Map + Side panel row */}
      <div className="flex flex-col lg:flex-row" style={{ minHeight: "480px" }}>
        {/* Map area */}
        <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
          <div className="flex-1">
            <InteractiveMap
              geojsonFile={currentEntry.geojsonFile}
              onTerritoryClick={() => setSidePanelOpen(true)}
            />
          </div>

          {/* Timeline */}
          <TimelineSelector
            entries={ROMAN_TIMELINE}
            selectedYear={selectedYear}
            onChange={handleYearChange}
          />
        </div>

        {/* Side panel */}
        <SidePanel
          entry={currentEntry}
          open={sidePanelOpen}
          onClose={() => setSidePanelOpen(false)}
        />
      </div>
    </div>
  );
}

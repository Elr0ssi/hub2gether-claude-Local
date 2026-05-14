"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";

const EpidemicsMapView = dynamic(
  () => import("./EpidemicsMapView").then((m) => m.EpidemicsMapView),
  {
    ssr: false,
    loading: () => (
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ border: "1px solid var(--border)", height: "600px" }}
      >
        <div
          className="p-4 border-b flex items-center gap-3"
          style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
        >
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Skeleton className="h-4 w-48 mx-auto mb-2" />
            <Skeleton className="h-3 w-32 mx-auto" />
          </div>
        </div>
      </div>
    ),
  }
);

export function EpidemicsMapViewLoader() {
  return <EpidemicsMapView />;
}

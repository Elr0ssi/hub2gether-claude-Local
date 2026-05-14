"use client";

import dynamic from "next/dynamic";

const EconomyMapView = dynamic(
  () => import("./EconomyMapView").then((m) => ({ default: m.EconomyMapView })),
  { ssr: false }
);

export function EconomyMapViewLoader() {
  return <EconomyMapView />;
}

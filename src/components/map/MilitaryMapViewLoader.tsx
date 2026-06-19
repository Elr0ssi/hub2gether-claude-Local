"use client";

import dynamic from "next/dynamic";

const MilitaryMapView = dynamic(
  () => import("./MilitaryMapView").then((m) => ({ default: m.MilitaryMapView })),
  { ssr: false }
);

export function MilitaryMapViewLoader() {
  return <MilitaryMapView />;
}

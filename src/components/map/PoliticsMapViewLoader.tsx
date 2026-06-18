"use client";

import dynamic from "next/dynamic";

const PoliticsMapView = dynamic(
  () => import("./PoliticsMapView").then((m) => ({ default: m.PoliticsMapView })),
  { ssr: false }
);

export function PoliticsMapViewLoader() {
  return <PoliticsMapView />;
}

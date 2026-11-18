"use client";

import { useEffect, useState } from "react";
import type { SocleEco } from "@/data/concept/conceptEconomie";
import type { SocleDemo } from "@/data/concept/conceptDemographie";

/* Les deux bases complètes, téléchargées à la demande et une seule fois, quel que
   soit le nombre de widgets qui s'en servent. */
const promesses = new Map<string, Promise<unknown>>();

function charge<T>(url: string): Promise<T> {
  let p = promesses.get(url);
  if (!p) {
    p = fetch(url).then((r) => {
      if (!r.ok) throw new Error(url);
      return r.json();
    });
    p.catch(() => promesses.delete(url));
    promesses.set(url, p);
  }
  return p as Promise<T>;
}

function useSocle<T>(url: string): T | null {
  const [s, setS] = useState<T | null>(null);
  useEffect(() => {
    let vivant = true;
    charge<T>(url).then((x) => vivant && setS(x)).catch(() => {});
    return () => {
      vivant = false;
    };
  }, [url]);
  return s;
}

export const useSocleEco = () => useSocle<SocleEco>("/economie/socle.json");
export const useSocleDemo = () => useSocle<SocleDemo>("/demographie/socle.json");

/** La valeur d'un indicateur pour un pays, une année : null si la source ne la publie pas. */
export function valeurSocle(
  s: { pays: { nom: string }[]; cols: Record<number, Record<string, number>>; lignes: Record<number, (number | null)[][]> },
  nom: string,
  annee: number,
  champ: string,
): number | null {
  const idx = s.pays.findIndex((p) => p.nom === nom);
  const i = (s.cols[annee] ?? {})[champ];
  if (idx < 0 || i === undefined) return null;
  const l = (s.lignes[annee] ?? []).find((x) => x[0] === idx);
  const v = l ? l[i] : null;
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

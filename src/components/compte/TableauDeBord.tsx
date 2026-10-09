"use client";

import { useActionState, useMemo, useState } from "react";
import { Odometre } from "@/components/concept/Roulement";
import { CADENCES_EXEMPLE, POPULATION_PAR_AN, WIDGETS_POSSIBLES } from "@/data/concept/tempsReel";
import { majWidgets, type Retour } from "@/app/compte/actions";

/* ═══════════════════════════════════════════════════════════════════════════
   LE TABLEAU DE BORD PERSONNEL

   Une sélection de compteurs, gardée d'une visite à l'autre. Les cadences
   sont les mêmes que celles de la page d'accueil du concept — une seule
   liste de vérité, voir src/data/concept/tempsReel.ts — et portent donc les
   mêmes réserves : le produit intérieur brut et la population viennent du
   socle, le reste est une cadence d'exemple en attente de source.

   Le PIB s'affiche ici en dollars, sans sélecteur de monnaie : un tableau
   de bord n'a pas à porter tout l'appareil de la page économie pour une
   seule ligne.
   ═══════════════════════════════════════════════════════════════════════════ */

const AN = 365.2425 * 24 * 3600;

interface Widget {
  id: (typeof WIDGETS_POSSIBLES)[number];
  label: string;
  parSeconde: number;
  base: number;
  dec: number;
  unite: string;
  exemple?: boolean;
}

export function TableauDeBord({
  widgetsInitial,
  sommePib,
  sommePopulation,
}: {
  widgetsInitial: string[];
  /** Somme du socle, en dollars, à son dernier millésime publié. */
  sommePib: number;
  /** Somme du socle, en millions d'habitants. */
  sommePopulation: number;
}) {
  const [selection, setSelection] = useState<string[]>(widgetsInitial);
  const [etat, action] = useActionState<Retour, FormData>(majWidgets, {});

  const depart = useMemo(() => {
    const t = new Date(new Date().getFullYear(), 0, 1).getTime();
    return performance.now() - (Date.now() - t);
  }, []);

  const catalogue = useMemo<Widget[]>(() => {
    const l: Widget[] = [
      { id: "pib", label: "PIB mondial", base: 0, parSeconde: sommePib / AN, dec: 3, unite: " Md $" },
      {
        id: "population",
        label: "Population",
        base: sommePopulation * 1e6,
        parSeconde: POPULATION_PAR_AN / AN,
        dec: 0,
        unite: "",
      },
    ];
    for (const c of CADENCES_EXEMPLE) {
      l.push({ id: c.id as Widget["id"], label: c.label, base: 0, parSeconde: c.parAn / AN, dec: c.dec, unite: c.unite, exemple: true });
    }
    return l;
  }, [sommePib, sommePopulation]);

  const basculer = (id: string) => {
    setSelection((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= 4 ? s : [...s, id]));
  };

  const choisis = catalogue.filter((w) => selection.includes(w.id));

  return (
    <div className="cp-tdb">
      {choisis.length > 0 && (
        <div className="cp-tdb-live">
          {choisis.map((w) => (
            <div className="cp-tdb-carte" key={w.id}>
              <span className="cp-tdb-lab">
                {w.label}
                {w.exemple && <span className="cp-tdb-ex">exemple</span>}
              </span>
              <Odometre
                className="cp-tdb-v"
                valeur={w.base}
                parSeconde={w.parSeconde}
                depuis={depart}
                dec={w.dec}
                unite={w.unite}
              />
            </div>
          ))}
        </div>
      )}

      <form action={action} className="cp-tdb-form">
        <p className="cp-tdb-choix-t">Choisissez jusqu&apos;à quatre compteurs :</p>
        <div className="cp-tdb-choix">
          {catalogue.map((w) => (
            <label key={w.id} className="cp-tdb-case">
              <input
                type="checkbox"
                name="widget"
                value={w.id}
                checked={selection.includes(w.id)}
                onChange={() => basculer(w.id)}
                disabled={!selection.includes(w.id) && selection.length >= 4}
              />
              {w.label}
            </label>
          ))}
        </div>
        {etat.erreur && <p className="cp-erreur">{etat.erreur}</p>}
        {etat.message && <p className="cp-ok">{etat.message}</p>}
        <button type="submit" className="cp-envoi">
          Enregistrer ma sélection
        </button>
      </form>
    </div>
  );
}

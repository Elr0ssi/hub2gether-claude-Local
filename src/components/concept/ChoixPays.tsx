"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { drapeau } from "@/lib/drapeau";
import "./choixpays.css";

export interface OptionPays {
  nom: string;
  fr: string;
  iso2?: string;
}

/* Un sélecteur de pays qui se cherche : on tape quelques lettres, on valide. Il
   remplace le menu natif, trop long pour deux cents pays et illisible en sombre. */
export function ChoixPays({
  valeur,
  options,
  onChange,
  label,
  placeholder = "Choisir un pays",
  compact = false,
}: {
  valeur: string | null;
  options: OptionPays[];
  onChange: (nom: string) => void;
  label: string;
  placeholder?: string;
  compact?: boolean;
}) {
  const [ouvert, setOuvert] = useState(false);
  const [q, setQ] = useState("");
  const [vise, setVise] = useState(0);
  const racine = useRef<HTMLDivElement>(null);
  const champ = useRef<HTMLInputElement>(null);
  const liste = useRef<HTMLUListElement>(null);

  const courant = options.find((o) => o.nom === valeur);
  const vues = useMemo(() => {
    const n = q.trim().toLowerCase();
    return n ? options.filter((o) => o.fr.toLowerCase().includes(n) || o.nom.toLowerCase().includes(n)) : options;
  }, [options, q]);

  useEffect(() => {
    if (!ouvert) return;
    const ailleurs = (e: PointerEvent) => {
      if (!racine.current?.contains(e.target as Node)) setOuvert(false);
    };
    window.addEventListener("pointerdown", ailleurs);
    requestAnimationFrame(() => champ.current?.focus());
    return () => window.removeEventListener("pointerdown", ailleurs);
  }, [ouvert]);

  useEffect(() => {
    setVise(0);
  }, [q, ouvert]);
  useEffect(() => {
    (liste.current?.children[vise] as HTMLElement | undefined)?.scrollIntoView({ block: "nearest" });
  }, [vise]);

  const choisit = (o: OptionPays) => {
    onChange(o.nom);
    setOuvert(false);
    setQ("");
  };

  return (
    <div className={`chp${compact ? " chp-c" : ""}`} ref={racine}>
      <button type="button" className="chp-b" aria-haspopup="listbox" aria-expanded={ouvert} aria-label={label} onClick={() => setOuvert(!ouvert)}>
        <span className="chp-d" aria-hidden="true">{drapeau(courant?.iso2)}</span>
        <span className="chp-n">{courant?.fr ?? placeholder}</span>
        <ChevronDown size={15} aria-hidden="true" className={ouvert ? "chp-ouv" : undefined} />
      </button>
      {ouvert && (
        <div className="chp-p">
          <label className="chp-q">
            <Search size={14} aria-hidden="true" />
            <input
              ref={champ}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un pays"
              aria-label="Rechercher un pays"
              onKeyDown={(e) => {
                if (e.key === "Escape") setOuvert(false);
                else if (e.key === "ArrowDown") { e.preventDefault(); setVise((v) => Math.min(vues.length - 1, v + 1)); }
                else if (e.key === "ArrowUp") { e.preventDefault(); setVise((v) => Math.max(0, v - 1)); }
                else if (e.key === "Enter" && vues[vise]) { e.preventDefault(); choisit(vues[vise]); }
              }}
            />
          </label>
          <ul className="chp-l" role="listbox" ref={liste}>
            {vues.length === 0 && <li className="chp-vide">Aucun pays ne correspond</li>}
            {vues.map((o, i) => (
              <li key={o.nom} role="option" aria-selected={o.nom === valeur} className={`${i === vise ? "chp-vise" : ""}${o.nom === valeur ? " chp-on" : ""}`} onPointerEnter={() => setVise(i)} onClick={() => choisit(o)}>
                <span aria-hidden="true">{drapeau(o.iso2)}</span>
                {o.fr}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

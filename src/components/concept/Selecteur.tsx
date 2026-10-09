"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import "./selecteur.css";

/* Un sélecteur à la place du menu déroulant natif : le natif s'ouvre dans la
   couleur du système, ne se règle pas, et jure avec le reste. Celui-ci reprend
   les jetons de la page, défile proprement et se manie au clavier. */
export function Selecteur<T extends string | number>({
  valeur,
  options,
  onChange,
  label,
}: {
  valeur: T;
  options: T[];
  onChange: (v: T) => void;
  label: string;
}) {
  const [ouvert, setOuvert] = useState(false);
  const [vise, setVise] = useState(0);
  const racine = useRef<HTMLDivElement>(null);
  const liste = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!ouvert) return;
    const ailleurs = (e: PointerEvent) => {
      if (!racine.current?.contains(e.target as Node)) setOuvert(false);
    };
    window.addEventListener("pointerdown", ailleurs);
    return () => window.removeEventListener("pointerdown", ailleurs);
  }, [ouvert]);

  /* À l'ouverture, la valeur courante est visée et amenée au milieu. */
  useEffect(() => {
    if (!ouvert) return;
    const i = Math.max(0, options.indexOf(valeur));
    setVise(i);
    requestAnimationFrame(() => {
      const el = liste.current?.children[i] as HTMLElement | undefined;
      el?.scrollIntoView({ block: "center" });
    });
  }, [ouvert, options, valeur]);

  const choisit = (v: T) => {
    onChange(v);
    setOuvert(false);
  };

  const touche = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOuvert(false);
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!ouvert) return setOuvert(true);
      const n = Math.min(options.length - 1, Math.max(0, vise + (e.key === "ArrowDown" ? 1 : -1)));
      setVise(n);
      (liste.current?.children[n] as HTMLElement | undefined)?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter" && ouvert) {
      e.preventDefault();
      choisit(options[vise]);
    }
  };

  return (
    <div className="sl" ref={racine} onKeyDown={touche}>
      <button
        type="button"
        className="sl-b"
        aria-haspopup="listbox"
        aria-expanded={ouvert}
        aria-label={label}
        onClick={() => setOuvert(!ouvert)}
      >
        <span>{valeur}</span>
        <ChevronDown size={15} aria-hidden="true" className={ouvert ? "sl-ouv" : undefined} />
      </button>
      {ouvert && (
        <ul className="sl-l" role="listbox" aria-label={label} ref={liste}>
          {options.map((o, i) => (
            <li key={String(o)} role="option" aria-selected={o === valeur}>
              <button
                type="button"
                tabIndex={-1}
                className={`${o === valeur ? "sl-on" : ""}${i === vise ? " sl-vise" : ""}`}
                onClick={() => choisit(o)}
                onPointerEnter={() => setVise(i)}
              >
                {o}
                {o === valeur && <Check size={14} aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

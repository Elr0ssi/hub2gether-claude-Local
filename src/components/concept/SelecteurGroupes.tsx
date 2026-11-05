"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import "./selecteur.css";

/* Le même sélecteur que celui des classements (mêmes jetons, même liste qui s'ouvre sous le bouton), avec des options rangées par
   catégorie principale. Une option inactive est montrée mais ne se choisit pas. */

export interface OptionGroupe {
  id: string;
  label: string;
  /** Une précision à droite (la sous-famille). */
  detail?: string;
  actif: boolean;
}
export interface Groupe {
  titre: string;
  options: OptionGroupe[];
}

export function SelecteurGroupes({
  valeur, groupes, onChange, label,
}: {
  valeur: string | null;
  groupes: Groupe[];
  onChange: (id: string) => void;
  label: string;
}) {
  const [ouvert, setOuvert] = useState(false);
  const [vise, setVise] = useState<string | null>(null);
  const racine = useRef<HTMLDivElement>(null);
  const liste = useRef<HTMLUListElement>(null);

  const actives = useMemo(() => groupes.flatMap((g) => g.options.filter((o) => o.actif)), [groupes]);
  const courante = groupes.flatMap((g) => g.options).find((o) => o.id === valeur);

  useEffect(() => {
    if (!ouvert) return;
    const ailleurs = (e: PointerEvent) => {
      if (!racine.current?.contains(e.target as Node)) setOuvert(false);
    };
    window.addEventListener("pointerdown", ailleurs);
    return () => window.removeEventListener("pointerdown", ailleurs);
  }, [ouvert]);

  /* À l'ouverture, l'option courante est visée et amenée au milieu. */
  useEffect(() => {
    if (!ouvert) return;
    setVise(valeur);
    requestAnimationFrame(() => {
      liste.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(valeur ?? "")}"]`)?.scrollIntoView({ block: "center" });
    });
  }, [ouvert, valeur]);

  const choisit = (id: string) => {
    onChange(id);
    setOuvert(false);
  };

  const touche = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOuvert(false);
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!ouvert) return setOuvert(true);
      const i = Math.max(0, actives.findIndex((o) => o.id === vise));
      const n = actives[Math.min(actives.length - 1, Math.max(0, i + (e.key === "ArrowDown" ? 1 : -1)))];
      if (!n) return;
      setVise(n.id);
      liste.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(n.id)}"]`)?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter" && ouvert && vise) {
      e.preventDefault();
      choisit(vise);
    }
  };

  return (
    <div className="sl sl-groupes" ref={racine} onKeyDown={touche}>
      <button type="button" className="sl-b" aria-haspopup="listbox" aria-expanded={ouvert} aria-label={label} onClick={() => setOuvert(!ouvert)}>
        <span>{courante?.label ?? "Choisir"}</span>
        <ChevronDown size={15} aria-hidden="true" className={ouvert ? "sl-ouv" : undefined} />
      </button>
      {ouvert && (
        <ul className="sl-l" role="listbox" aria-label={label} ref={liste}>
          {groupes.map((g) => (
            <li key={g.titre} role="presentation" className="sl-g">
              <span className="sl-g-t">{g.titre}</span>
              <ul role="group" aria-label={g.titre}>
                {g.options.map((o) => (
                  <li key={o.id} role="option" aria-selected={o.id === valeur} aria-disabled={!o.actif}>
                    <button
                      type="button"
                      tabIndex={-1}
                      data-id={o.id}
                      disabled={!o.actif}
                      className={`${o.id === valeur ? "sl-on" : ""}${o.id === vise ? " sl-vise" : ""}${o.actif ? "" : " sl-off"}`}
                      onClick={() => o.actif && choisit(o.id)}
                      onPointerEnter={() => o.actif && setVise(o.id)}
                    >
                      <span>{o.label}</span>
                      {o.id === valeur ? <Check size={14} aria-hidden="true" /> : o.actif ? o.detail && <em>{o.detail}</em> : <em>bientôt</em>}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

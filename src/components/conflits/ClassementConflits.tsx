"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Selecteur } from "@/components/concept/Selecteur";
import { useVu } from "@/components/concept/ouverture";
import { useRechercheTableau } from "@/components/concept/rechercheTableau";
import { CATEGORIES, type Categorie } from "@/data/conflits";

/* ═══════════════════════════════════════════════════════════════════════════
   LE CLASSEMENT DES PAYS (page Conflits)

   Le même tableau qu'Économie : bande claire, colonnes triables, ligne qui s'allume sous le pointeur. Les pays sont rangés par nombre de
   fiches de l'inventaire qui les nomment ; chaque catégorie a sa colonne. La recherche ne masque rien : le rang reste celui du
   classement complet, et le tableau défile jusqu'au pays cherché.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface LignePays {
  nom: string;
  fr: string;
  total: number;
  parCat: Record<Categorie, number>;
  points: number;
}

type Col = "total" | "points" | Categorie;
const nomFr = (r: LignePays) => r.fr;

export const ClassementConflits = memo(function ClassementConflits({
  lignes, choisi, onChoisi, nombreFiches,
}: {
  lignes: LignePays[];
  choisi: string | null;
  onChoisi: (nom: string) => void;
  nombreFiches: number;
}) {
  const bande = useVu();
  const [col, setCol] = useState<Col>("total");
  const [sens, setSens] = useState<1 | -1>(-1);
  const [filtre, setFiltre] = useState("");
  const [cat, setCat] = useState<string>("Toutes");
  const cadre = useRef<HTMLDivElement>(null);
  const allumee = useRef<HTMLElement | null>(null);

  const valeur = (r: LignePays, c: Col) => (c === "total" ? r.total : c === "points" ? r.points : r.parCat[c]);
  const tries = useMemo(
    () =>
      [...lignes]
        .filter((r) => cat === "Toutes" || r.parCat[cat as Categorie] > 0)
        .sort((a, b) => (valeur(a, col) - valeur(b, col)) * sens || b.total - a.total || a.fr.localeCompare(b.fr, "fr")),
    [lignes, col, sens, cat],
  );
  useEffect(() => { cadre.current?.scrollTo({ top: 0 }); }, [col, sens, cat]);
  const trouvees = useRechercheTableau(cadre, tries, nomFr, filtre, 44);
  const trier = (c: Col) => { if (c === col) setSens((s) => (s === -1 ? 1 : -1)); else { setCol(c); setSens(-1); } };

  const suit = useCallback((e: React.PointerEvent<HTMLTableSectionElement>) => {
    const tr = (e.target as HTMLElement).closest("tr") as HTMLElement | null;
    if (!tr || !tr.dataset.pays) return;
    const r = tr.getBoundingClientRect();
    if (allumee.current && allumee.current !== tr) allumee.current.classList.remove("cg-tab-suivi");
    tr.classList.add("cg-tab-suivi");
    tr.style.setProperty("--x", `${e.clientX - r.left}px`);
    allumee.current = tr;
  }, []);
  const eteint = useCallback(() => { allumee.current?.classList.remove("cg-tab-suivi"); allumee.current = null; }, []);

  const colonnes: { id: Col; label: string }[] = [
    { id: "total", label: "Fiches" },
    ...CATEGORIES.map((c) => ({ id: c.id as Col, label: c.pluriel })),
    { id: "points", label: "Points précis" },
  ];

  return (
    <section ref={bande.ref as React.RefObject<HTMLElement>} className="cg-bande" data-vu={bande.vu ? "1" : "0"} id="classement">
      <div className="cg-bande-h">
        <h2 className="cg-bande-t">Le classement</h2>
        <p className="cg-bande-c">{lignes.length} pays nommés dans {nombreFiches} fiches. Triez la colonne qui vous intéresse.</p>
        <div className="cg-bande-ctrl">
          <label className="cg-an-choix">
            <span className="cg-an-choix-l">Catégorie</span>
            <Selecteur valeur={cat} options={["Toutes", ...CATEGORIES.map((c) => c.id)]} onChange={(v) => setCat(String(v))} label="Catégorie du classement" />
          </label>
          <input className="cg-filtre cg-filtre-clair" type="search" placeholder="Trouver un pays" value={filtre} onChange={(e) => setFiltre(e.target.value)} aria-label="Trouver un pays dans le classement" />
        </div>
      </div>
      <div className="cg-bande-bloc">
        <div className="cg-tab-cadre" ref={cadre}>
          <table className="cg-tab">
            <thead>
              <tr>
                <th className="cg-tab-r">#</th>
                <th className="cg-tab-p">Pays</th>
                {colonnes.map((c) => (
                  <th key={c.id}>
                    <button type="button" className={`cg-tri${col === c.id ? " cg-tri-on" : ""}`} onClick={() => trier(c.id)} aria-sort={col === c.id ? (sens === -1 ? "descending" : "ascending") : "none"}>
                      {c.label}
                      <span aria-hidden="true">{col === c.id ? (sens === -1 ? " ↓" : " ↑") : ""}</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody onPointerMove={suit} onPointerLeave={eteint}>
              {tries.map((r, i) => (
                <tr key={r.nom} data-pays={r.nom} className={`${choisi === r.nom ? "cg-tab-on" : ""}${trouvees?.has(r.fr) ? " cg-tab-trouve" : ""}` || undefined} onClick={() => onChoisi(r.nom)}>
                  <td className="cg-tab-r">{String(i + 1).padStart(2, "0")}</td>
                  <td className="cg-tab-p">{r.fr}</td>
                  {colonnes.map((c) => {
                    const v = valeur(r, c.id);
                    return <td key={c.id} className={v === 0 ? "cg-tab-vide" : undefined}>{v === 0 ? "–" : v}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="cg-bande-n">
          {filtre.trim() ? `${tries.filter((r) => r.fr.toLowerCase().includes(filtre.trim().toLowerCase())).length} correspondance(s) · ` : `${tries.length} pays · `}
          Une fiche peut nommer plusieurs pays : les colonnes ne se somment pas. Cliquez une ligne pour la retrouver sur le globe.
        </p>
      </div>
    </section>
  );
});

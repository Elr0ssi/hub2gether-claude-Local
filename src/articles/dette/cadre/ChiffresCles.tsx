"use client";

import type { LucideIcon } from "lucide-react";
import { Leve } from "./mouvement";

/** Les chiffres clés d'ouverture : jusqu'à SIX cartes, la première en grand et en couleur.
 *  La disposition (une grande carte, deux moyennes, trois petites) est fixée par le style ;
 *  on choisit seulement ce qu'on y met, dans l'ordre d'importance.
 *
 *    <ChiffresCles
 *      cartes={[
 *        { icone: Percent, valeur: "137 %", libelle: "de dette rapportée au PIB", texte: "Environ 1,4 année de richesse produite." },
 *        { icone: Scale, valeur: <>−{montant(152.5)}</>, libelle: "de déficit en 2025", texte: "…", negatif: true },
 *      ]}
 *    />
 *
 *  `icone` : une icône de lucide-react (https://lucide.dev). `valeur` : un texte ou du JSX ;
 *  pour un montant, utiliser `montant(...)` pour qu'il soit converti.
 */
export interface CarteChiffre {
  icone: LucideIcon;
  valeur: React.ReactNode;
  libelle: string;
  texte: string;
  /** Vrai pour un solde négatif : la valeur passe en rouge. */
  negatif?: boolean;
}

const PLACES = ["a", "b", "c", "d", "e", "f"] as const;
const RETARDS = [0, 70, 140, 70, 140, 210];

export function ChiffresCles({ cartes }: { cartes: CarteChiffre[] }) {
  return (
    <div className="dos-bento">
      {cartes.slice(0, 6).map((c, i) => {
        const Icone = c.icone;
        return (
          <Leve
            key={c.libelle}
            tag="figure"
            className={`dos-carte${i === 0 ? " dos-carte-vif" : ""} dos-c-${PLACES[i]}`}
            delai={RETARDS[i]}
          >
            <Icone size={20} className="dos-ico" aria-hidden="true" />
            <p className={`dos-carte-v${c.negatif ? " dos-neg" : ""}`}>{c.valeur}</p>
            <p className="dos-carte-l">{c.libelle}</p>
            <p className="dos-carte-t">{c.texte}</p>
          </Leve>
        );
      })}
    </div>
  );
}

/** Une rangée de gros chiffres, la première valeur en vedette. Pour « ce que ça coûte », « les échéances »…
 *
 *    <ChiffresGrille
 *      items={[
 *        { valeur: montant(64.7), libelle: "d'intérêts par an, toutes administrations" },
 *        { valeur: "2,9 %", libelle: "taux moyen des émissions de 2026" },
 *      ]}
 *    />
 */
export function ChiffresGrille({ items }: { items: { valeur: React.ReactNode; libelle: string }[] }) {
  return (
    <div className="dos-couts">
      {items.map((it, i) => (
        <Leve key={it.libelle} className={`dos-cout${i === 0 ? " dos-cout-g" : ""}`} delai={i * 60}>
          <b>{it.valeur}</b>
          <span>{it.libelle}</span>
        </Leve>
      ))}
    </div>
  );
}

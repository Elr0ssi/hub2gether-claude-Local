"use client";

/** « Voir les données » : le tableau qui accompagne un graphique, replié par défaut.
 *  Style : `.dp-donnees` (voir figures.css). */
export function Donnees({
  titre,
  colonnes,
  lignes,
}: {
  titre: string;
  colonnes: string[];
  lignes: (string | number)[][];
}) {
  return (
    <details className="dp-donnees">
      <summary>Voir les données</summary>
      <table>
        <caption>{titre}</caption>
        <thead>
          <tr>
            {colonnes.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lignes.map((l) => (
            <tr key={String(l[0])}>
              <th scope="row">{l[0]}</th>
              {l.slice(1).map((v, i) => (
                <td key={i}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

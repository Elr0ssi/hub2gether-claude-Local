"use client";

import { EUROPE_2026_T1, SOURCES } from '../donnees';
import { useVu, nf } from '@/articles/dette/cadre';

/** Reprend à l'identique les classes de la comparaison horizontale de la France. */
export function Comparaison() {
  const { ref, vu } = useVu<HTMLDivElement>(90);
  const max = Math.max(...EUROPE_2026_T1.map((c) => c.pct));
  return (
    <figure className="dp-fig">
      <div className="dp-comp" ref={ref} data-vu={vu ? '1' : '0'}>
        {EUROPE_2026_T1.map((c, i) => (
          <div key={c.pays}
            className={`dp-comp-l${c.pays === 'Allemagne' ? ' dp-comp-fr' : ''}${c.pays === 'UE' ? ' dp-comp-ag' : ''}`}
            style={{ '--i': i, '--p': `${(c.pct / max) * 100}%` } as React.CSSProperties}>
            <span className="dp-comp-n">{c.pays}</span>
            <span className="dp-comp-b" aria-hidden="true" />
            <span className="dp-comp-v">{nf(c.pct)} %</span>
          </div>
        ))}
      </div>
      <details className="dos-donnees">
        <summary>Voir les données</summary>
        <table>
          <caption>Dette publique Maastricht / PIB, premier trimestre 2026, Eurostat</caption>
          <thead><tr><th scope="col">Pays ou zone</th><th scope="col">Dette / PIB</th></tr></thead>
          <tbody>{EUROPE_2026_T1.map((c) => <tr key={c.pays}><th scope="row">{c.pays}</th><td>{nf(c.pct)} %</td></tr>)}</tbody>
        </table>
      </details>
      <p className="dp-fig-s"><a href={SOURCES.EUROSTAT} target="_blank" rel="noopener noreferrer">Source : Eurostat · dette publique de Maastricht, premier trimestre 2026 ↗</a></p>
    </figure>
  );
}
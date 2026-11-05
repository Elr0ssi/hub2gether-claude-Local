/** Le socle réduit aux années demandées — la dernière, d'ordinaire. La liste
    des années et des pays reste entière : la frise se dessine, le pays se
    retrouve ; seules les lignes des autres années attendent le socle complet. */
export function allegerSocle<
  T extends { annees: number[]; cols: Record<number, Record<string, number>>; lignes: Record<number, unknown[]> },
>(socle: T, garder: number[]): T {
  const cols: T["cols"] = {};
  const lignes: T["lignes"] = {};
  for (const a of garder) {
    if (socle.cols[a]) cols[a] = socle.cols[a];
    if (socle.lignes[a]) lignes[a] = socle.lignes[a];
  }
  return { ...socle, cols, lignes };
}

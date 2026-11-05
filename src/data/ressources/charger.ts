import type { EntreeIndex, JeuRessource } from "./types";

/* Le chargement : l'index (quelles ressources existent), puis le fichier de la ressource affichée, une seule fois.
   Pour une base (Supabase) : remplacer ces deux fonctions par des requêtes qui renvoient la même forme. */
const cache = new Map<string, Promise<unknown>>();

function une<T>(url: string): Promise<T> {
  if (!cache.has(url)) {
    cache.set(
      url,
      fetch(url).then((r) => {
        if (!r.ok) throw new Error(`${url} : ${r.status}`);
        return r.json();
      }),
    );
  }
  return cache.get(url) as Promise<T>;
}

export const chargerIndex = () => une<{ ressources: EntreeIndex[] }>("/ressources/index.json").then((x) => x.ressources);
/** Les unités d'élevage de FAOSTAT (« kg/An » = par animal) s'écrivent en clair à l'affichage ; les fichiers gardent l'unité d'origine. */
const UNITES_AFFICHEES: Record<string, string> = { "kg/An": "kg/animal", "g/An": "g/animal", "No/An": "œufs/animal" };

export const chargerJeu = (id: string) =>
  une<JeuRessource>(`/ressources/${id}.json`).then((j) => {
    for (const ind of Object.values(j.indicateurs)) if (UNITES_AFFICHEES[ind.unite]) ind.unite = UNITES_AFFICHEES[ind.unite];
    return j;
  });

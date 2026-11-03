import type { FicheArticle } from "@/data/concept/conceptGeo";
import type { FicheDebat } from "@/data/concept/conceptEconomie";
import { MILITARY_ARTICLES } from "@/data/military/articles";
import { countryFr } from "@/data/countryNamesFr";
import { CATEGORIES, compter, indexerParPays, type Conflit } from "./index";

/* ═══════════════════════════════════════════════════════════════════════════
   LES LECTURES DE LA PAGE CONFLITS

   Les articles sont ceux de la rubrique militaire du site. Les sujets de forum partent d'un chiffre CALCULÉ
   dans l'inventaire (comme ceux d'Économie partent d'un chiffre d'article) : la question est posée au lecteur,
   le chiffre qui la déclenche vient des données. Rien n'est écrit à la main.
   ═══════════════════════════════════════════════════════════════════════════ */

export function articlesConflits(): FicheArticle[] {
  return [...MILITARY_ARTICLES]
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .map((a) => ({
      slug: a.slug,
      titre: a.title,
      chapo: a.excerpt,
      rubrique: "Militaire",
      duree: a.readingTime ? `${a.readingTime} min` : "—",
      href: `/articles/${a.slug}`,
    }));
}

export function debatsConflits(conflits: Conflit[]): FicheDebat[] {
  const out: FicheDebat[] = [];
  const stats = compter(conflits);
  const n = conflits.length;
  const nomCat = (id: string) => CATEGORIES.find((c) => c.id === id)?.pluriel.toLowerCase() ?? id;

  const tensions = stats.parCategorie["Tension géopolitique"];
  if (tensions > 0 && n > 0) {
    out.push({
      id: "conf-tensions",
      question: "Une tension géopolitique sans combats est-elle un conflit ?",
      ancre: `${tensions} fiches de tension sur ${n}, à côté de ${stats.parCategorie["Conflit armé"]} conflits armés`,
      tags: ["conflits", "tensions", "définition"],
    });
  }
  const regions = Object.entries(stats.parRegion).sort((a, b) => b[1] - a[1]);
  if (regions.length) {
    out.push({
      id: "conf-region",
      question: "Pourquoi certaines régions concentrent-elles autant de foyers de conflit ?",
      ancre: `${regions[0][0]} : ${regions[0][1]} fiches sur ${n}`,
      tags: ["conflits", "régions", "géopolitique"],
    });
  }
  const parPays = [...indexerParPays(conflits).entries()].sort((a, b) => b[1].length - a[1].length);
  if (parPays.length) {
    out.push({
      id: "conf-pays",
      question: "Qu’est-ce qui fait qu’un pays se retrouve au cœur de plusieurs conflits à la fois ?",
      ancre: `${countryFr(parPays[0][0])} : ${parPays[0][1].length} fiches qui le nomment`,
      tags: ["conflits", "pays", "exposition"],
    });
  }
  const violences = stats.parCategorie["Violences armées"];
  if (violences > 0) {
    out.push({
      id: "conf-violences",
      question: "Les violences armées hors guerre déclarée doivent-elles compter comme des conflits ?",
      ancre: `${violences} fiches de ${nomCat("Violences armées")} dans l’inventaire`,
      tags: ["violences armées", "définition", "UCDP"],
    });
  }
  out.push({
    id: "conf-chiffres",
    question: "Peut-on comparer des fiches de conflit comme on compare des pays ?",
    ancre: `${n} fiches, qui regroupent des conflits armés, des violences et des tensions : elles ne se somment pas`,
    tags: ["conflits", "données", "méthode"],
  });
  return out;
}

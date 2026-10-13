import { PageArticleDette } from "@/articles/dette/rendu";
import { articleFrance } from "@/articles/dette/france/fiche";

/* ═══════════════════════════════════════════════════════════════════════════
   /france/economie/dette-publique

   L'article de référence sur la dette de la France. Son contenu, ses
   chiffres et son référencement sont dans `src/articles/dette/france/` ;
   cette route ne fait que les servir. Les autres pays passent par
   `/dette-publique/[slug]`.
   ═══════════════════════════════════════════════════════════════════════════ */

export const metadata = articleFrance.metadata;

export default function Page() {
  return <PageArticleDette article={articleFrance} />;
}

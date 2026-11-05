import { jsonLdString } from "@/lib/schema";
import type { ArticleDette } from "./types";

/** Rend la page d'un article de dette : son résumé masqué, ses données structurées, puis le composant.
 *  Utilisé par la route générique `/dette-publique/[slug]` et par la route propre de la France. */
export function PageArticleDette({ article }: { article: ArticleDette }) {
  return (
    <>
      {article.donneesStructurees().map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(d) }} />
      ))}
      {article.resume && <p className="sr-only">{article.resume()}</p>}
      <article.Composant />
    </>
  );
}

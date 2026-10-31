"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import type { FicheCatalogue } from "@/data/articles-catalogue";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** « Articles sur la France » : un carrousel qui défile, une barre de recherche dans ces articles
 *  seulement, et le lien vers tous les articles du pays. */
export function ArticlesPays({ articles, titreSection, lienTous }: { articles: FicheCatalogue[]; titreSection: string; lienTous: string }) {
  const [q, setQ] = useState("");
  const rail = useRef<HTMLUListElement>(null);
  const vus = useMemo(() => {
    const n = norm(q.trim());
    return n ? articles.filter((a) => norm(`${a.titre} ${a.chapo} ${a.rubrique} ${a.mots}`).includes(n)) : articles;
  }, [articles, q]);

  const defile = (sens: 1 | -1) => rail.current?.scrollBy({ left: sens * Math.max(240, rail.current.clientWidth * 0.8), behavior: "smooth" });

  return (
    <section className="sg-sec" aria-labelledby="sg-arts">
      <div className="sg-arts-tete">
        <h2 id="sg-arts" className="sg-h2">{titreSection}</h2>
        <div className="sg-arts-outils">
          {articles.length > 3 && (
            <label className="sg-arts-rech">
              <Search size={15} aria-hidden="true" />
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Chercher un article" aria-label="Chercher dans ces articles" />
            </label>
          )}
          <span className="sg-arts-fl">
            <button type="button" onClick={() => defile(-1)} aria-label="Articles précédents"><ArrowLeft size={16} aria-hidden="true" /></button>
            <button type="button" onClick={() => defile(1)} aria-label="Articles suivants"><ArrowRight size={16} aria-hidden="true" /></button>
          </span>
        </div>
      </div>

      {vus.length === 0 ? (
        <p className="sg-note">Aucun article ne correspond à « {q} ».</p>
      ) : (
        <ul className="sg-arts" ref={rail}>
          {vus.map((a, i) => (
            <li key={a.id}>
              <Link href={a.href} className={`sg-art${a.vedette && !q ? " sg-art-vif" : ""}`}>
                <span className="sg-art-r">{a.vedette && i === 0 && !q ? "Article phare" : a.type}</span>
                <strong>{a.titre}</strong>
                <span className="sg-art-c">{a.chapo}</span>
                <span className="sg-art-b">{a.rubrique}<ArrowRight size={15} aria-hidden="true" /></span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="sg-arts-tous"><Link href={lienTous}>Voir tous les articles →</Link></p>
    </section>
  );
}

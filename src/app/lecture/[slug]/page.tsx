import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LectureArticle } from "@/components/lecture/LectureArticle";
import { ARTICLES, getArticleBySlug, getArticlesByTheme } from "@/data/articles";
import { THEMES } from "@/data/themes";
import { COMPTES_ACTIFS } from "@/lib/supabase/config";
import { clientServeur, lireCompte } from "@/lib/supabase/serveur";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticleBySlug(slug);
  if (!a) return { title: "Article introuvable" };
  return {
    title: `${a.title} · Lecture | The Essential Data`,
    description: a.excerpt,
    alternates: { canonical: `/lecture/${slug}` },
    /* Un format en essai ne doit pas concurrencer l'article publié dans
       l'index : même contenu, deux adresses. */
    robots: { index: false, follow: true },
  };
}

/**
 * Le format de lecture.
 *
 * Il rend les articles existants dans une composition plus tenue : barre de
 * progression, sommaire qui suit la lecture, encadré de méthode, sources.
 * Le format publié sur `/articles/[slug]` n'est pas touché — les deux
 * cohabitent, et on peut comparer côte à côte.
 */
export default async function LecturePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const themeLabel = THEMES.find((t) => t.id === article.theme)?.label ?? article.theme;
  const suite = getArticlesByTheme(article.theme)
    .filter((a) => a.slug !== slug)
    .slice(0, 3)
    .map((a) => ({ slug: a.slug, titre: a.title, minutes: a.readingTime }));

  /* L'état d'enregistrement se lit sur le serveur, une fois, plutôt que de
     partir d'un bouton muet le temps d'un aller-retour côté client. */
  const compte = COMPTES_ACTIFS ? await lireCompte() : null;
  let enregistre = false;
  if (compte) {
    const sb = await clientServeur();
    const { data } = (await sb
      ?.from("favoris")
      .select("id")
      .eq("profil_id", compte.profil.id)
      .eq("article", slug)
      .maybeSingle()) ?? { data: null };
    enregistre = Boolean(data);
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ paddingTop: "var(--navbar-height)" }}>
        <LectureArticle
          article={article}
          themeLabel={themeLabel}
          suite={suite}
          connecte={Boolean(compte)}
          enregistre={enregistre}
        />
      </main>
      <Footer />
    </div>
  );
}

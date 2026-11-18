import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { PageArticleDette } from "@/articles/dette/rendu";
import { articleRedige } from "@/articles/dette/registre";
import { CATALOGUE_DETTE } from "@/articles/dette/catalogue";
import { dossierParSlug } from "@/data/dettes/dossiers";

/* ═══════════════════════════════════════════════════════════════════════════
   /pays/<pays>/dette-publique

   La page de dette publique d'un pays, sur sa fiche :
     - son article long, écrit à la main, s'il existe (src/articles/dette/<pays>/) ;
     - sinon, le dossier généré à partir de la base de dette (/dette-publique/<pays>).
   ═══════════════════════════════════════════════════════════════════════════ */

export const revalidate = 2592000;

export function generateStaticParams() {
  return CATALOGUE_DETTE.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return articleRedige(slug)?.metadata ?? {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articleRedige(slug);
  if (article) return <PageArticleDette article={article} />;
  if (dossierParSlug(slug)) permanentRedirect(`/dette-publique/${slug}`);
  notFound();
}

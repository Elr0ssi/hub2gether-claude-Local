import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EnTete, Pied } from "@/components/concept/pieces";
import { EspaceCompte } from "@/components/compte/EspaceCompte";
import { COMPTES_ACTIFS } from "@/lib/supabase/config";
import { clientServeur, lireCompte } from "@/lib/supabase/serveur";
import { filParId } from "@/data/community/fils";
import { donneesPays } from "@/data/concept/conceptGeo";
import { centresPays } from "@/data/concept/centres";
import { getArticleBySlug } from "@/data/articles";
import "@/components/concept/concept.css";

export const metadata: Metadata = {
  title: "Mon espace · Visualize",
  description: "Votre profil, vos messages.",
  alternates: { canonical: "/compte" },
  robots: { index: false, follow: false },
};

/* La page dépend de la session : elle ne peut pas être figée à la
   construction. */
export const dynamic = "force-dynamic";

export default async function ComptePage() {
  if (!COMPTES_ACTIFS) redirect("/compte/connexion");
  const compte = await lireCompte();
  if (!compte) redirect("/compte/connexion");

  const sb = await clientServeur();
  const { data: miens } = (await sb
    ?.from("messages")
    .select("id, cible_id, texte, cree_le")
    .eq("auteur", compte.profil.id)
    .order("cree_le", { ascending: false })
    .limit(20)) ?? { data: null };

  const messages = (miens ?? []) as { id: string; cible_id: string; texte: string; cree_le: string }[];

  const { data: mesFavoris } = (await sb
    ?.from("favoris")
    .select("article, cree_le")
    .eq("profil_id", compte.profil.id)
    .order("cree_le", { ascending: false })) ?? { data: null };
  const favoris = ((mesFavoris ?? []) as { article: string; cree_le: string }[])
    .map((f) => ({ article: getArticleBySlug(f.article), cree_le: f.cree_le, slug: f.article }))
    .filter((f): f is { article: NonNullable<ReturnType<typeof getArticleBySlug>>; cree_le: string; slug: string } =>
      Boolean(f.article),
    );

  /* Les sommes du socle, pour les deux compteurs réels du tableau de bord.
     Même source que la page d'accueil du concept : le dernier millésime
     publié. */
  const { pays: socle, annee: anneeSocle } = donneesPays();
  let sommePib = 0;
  let sommePopulation = 0;
  for (const f of Object.values(socle)) {
    if (typeof f.pib === "number") sommePib += f.pib;
    if (typeof f.population === "number") sommePopulation += f.population;
  }
  void anneeSocle;

  const centres = centresPays();
  const pays = Object.entries(socle)
    .filter(([, f]) => typeof f.pib === "number")
    .map(([nom, f]) => ({
      nom,
      fr: f.fr,
      pib: f.pib,
      pibHab: f.pibHab,
      population: f.population ?? null,
      dette: f.dette ?? null,
      inflation: f.inflation,
      lat: centres[nom]?.lat ?? null,
      lon: centres[nom]?.lon ?? null,
    }))
    .sort((x, y) => x.fr.localeCompare(y.fr, "fr"));

  return (
    <div className="cg">
      <EnTete />
      <main>
        <EspaceCompte
          pseudo={compte.profil.pseudo}
          email={compte.email}
          bio={compte.profil.bio}
          role={compte.profil.role}
          inscritLe={compte.profil.cree_le}
          widgets={compte.profil.widgets}
          sommePib={sommePib}
          sommePopulation={sommePopulation}
          messages={messages.map((m) => ({ ...m, titre: filParId(m.cible_id)?.titre ?? m.cible_id }))}
          favoris={favoris.map((f) => ({ slug: f.slug, titre: f.article.title, extrait: f.article.excerpt, cree_le: f.cree_le }))}
          pays={pays}
        />
      </main>
      <Pied />
    </div>
  );
}

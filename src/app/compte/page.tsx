import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FormProfil } from "@/components/compte/FormProfil";
import { Pastille } from "@/components/compte/Pastille";
import { deconnecter } from "./actions";
import { COMPTES_ACTIFS } from "@/lib/supabase/config";
import { clientServeur, lireCompte } from "@/lib/supabase/serveur";
import { filParId } from "@/data/community/fils";
import { donneesPays } from "@/data/concept/conceptGeo";
import { getArticleBySlug } from "@/data/articles";
import { TableauDeBord } from "@/components/compte/TableauDeBord";

export const metadata: Metadata = {
  title: "Mon espace · The Essential Data",
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

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ paddingTop: "var(--navbar-height)" }}>
        <div className="cp">
          <header className="cp-tete">
            <Pastille pseudo={compte.profil.pseudo} taille={56} />
            <div>
              <h1 className="cp-h1">{compte.profil.pseudo}</h1>
              <p className="cp-sous">
                {compte.email} · inscrit le{" "}
                {new Date(compte.profil.cree_le).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {compte.profil.role !== "lecteur" && <span className="cp-role">{compte.profil.role}</span>}
              </p>
            </div>
            <form action={deconnecter} className="cp-sortie">
              <button type="submit">Se déconnecter</button>
            </form>
          </header>

          <div className="cp-grille">
            <section className="cp-bloc">
              <h2 className="cp-h2">Profil</h2>
              <FormProfil pseudo={compte.profil.pseudo} bio={compte.profil.bio} />
            </section>

            <section className="cp-bloc">
              <h2 className="cp-h2">Mon tableau de bord</h2>
              <TableauDeBord
                widgetsInitial={compte.profil.widgets}
                sommePib={sommePib}
                sommePopulation={sommePopulation}
              />
            </section>

            <section className="cp-bloc">
              <h2 className="cp-h2">Mes articles enregistrés</h2>
              {favoris.length === 0 ? (
                <p className="cp-vide">
                  Vous n&apos;avez encore rien enregistré.{" "}
                  <Link href="/articles">Parcourir les articles</Link>
                </p>
              ) : (
                <ul className="cp-messages">
                  {favoris.map((f) => (
                    <li key={f.slug}>
                      <Link href={`/lecture/${f.slug}`} className="cp-msg-fil">
                        {f.article.title}
                      </Link>
                      <p className="cp-msg-texte">{f.article.excerpt}</p>
                      <span className="cp-msg-date">
                        Enregistré le{" "}
                        {new Date(f.cree_le).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="cp-bloc">
              <h2 className="cp-h2">Mes messages</h2>
              {messages.length === 0 ? (
                <p className="cp-vide">
                  Vous n&apos;avez encore rien écrit.{" "}
                  <Link href="/community">Ouvrir le forum</Link>
                </p>
              ) : (
                <ul className="cp-messages">
                  {messages.map((m) => {
                    const fil = filParId(m.cible_id);
                    return (
                      <li key={m.id}>
                        <Link href="/community" className="cp-msg-fil">
                          {fil?.titre ?? m.cible_id}
                        </Link>
                        <p className="cp-msg-texte">{m.texte}</p>
                        <span className="cp-msg-date">
                          {new Date(m.cree_le).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

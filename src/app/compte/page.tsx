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

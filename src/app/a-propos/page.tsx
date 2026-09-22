import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/layout/Layout";
import { jsonLdString } from "@/lib/schema";
import { CONTACT, EQUIPE } from "@/data/equipe";

/* ═══════════════════════════════════════════════════════════════════════════
   /a-propos — QUI FAIT CE TRAVAIL

   Sur des sujets d'argent public, les moteurs regardent qui parle autant que
   ce qui est dit. Cette page existe pour répondre : ce que le projet fait, ce
   qu'il refuse de faire, et comment le prendre en défaut.

   Elle ne nomme personne tant que `src/data/equipe.ts` est vide. Une équipe
   inventée sur une page « à propos » serait exactement le contenu fabriqué
   que le reste du projet refuse.
   ═══════════════════════════════════════════════════════════════════════════ */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";

export const metadata: Metadata = {
  title: { absolute: "À propos : qui nous sommes et comment nous travaillons | Visualize" },
  description:
    "Visualize rend lisibles des données publiques : diversification des sources, recoupement systématique, traçabilité de chaque chiffre. Notre méthode, nos limites et comment nous corriger.",
  keywords: ["à propos", "qui sommes-nous", "équipe", "méthode éditoriale", "données publiques"],
  alternates: { canonical: "/a-propos" },
  openGraph: {
    type: "website",
    url: `${siteUrl}/a-propos`,
    title: "À propos de Visualize",
    description:
      "Rendre lisibles des données publiques : diversification des sources, recoupement, traçabilité.",
  },
};

export default function Page() {
  /* Une page « à propos », pas une deuxième déclaration d'organisation : le
     gabarit du site en pose déjà une, et deux nœuds de même type au premier
     niveau se contredisent au lieu de se renforcer. Celle-ci est l'objet de
     la page, et le dit ainsi. */
  const organisation = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "À propos de Visualize",
    url: `${siteUrl}/a-propos`,
    mainEntity: {
    "@type": "Organization",
    name: "Visualize",
    url: siteUrl,
    description:
      "Visualize rend lisibles des données publiques en diversifiant ses sources, en les recoupant et en rendant chaque chiffre traçable jusqu'à sa publication d'origine.",
    ...(CONTACT ? { email: CONTACT } : {}),
    ...(EQUIPE.length
      ? {
          member: EQUIPE.map((m) => ({
            "@type": "Person",
            name: m.nom,
            jobTitle: m.role,
            ...(m.lien ? { sameAs: [m.lien] } : {}),
          })),
        }
      : {}),
    },
  };

  const fil = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "À propos", item: `${siteUrl}/a-propos` },
    ],
  };

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(organisation) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(fil) }} />
      <div className="hub">
        <nav className="hub-fil" aria-label="Fil d'Ariane">
          <Link href="/">Accueil</Link>
          <span aria-hidden="true">›</span>
          <span>À propos</span>
        </nav>

        <h1 className="hub-h1">À propos</h1>
        <p className="hub-chapo">
          Visualize rend lisibles des données publiques. Pas plus, et pas moins : nous ne
          produisons aucune mesure, nous reprenons celles d&apos;institutions qui les publient, et
          nous nous rendons responsables de la manière dont elles sont présentées.
        </p>

        <h2 className="hub-h2">Ce que nous faisons</h2>
        <ul className="hub-puces">
          <li>
            <b>Diversifier les sources.</b> Un chiffre confirmé par une seule publication reste un
            chiffre fragile. Nous cherchons systématiquement une deuxième institution qui mesure la
            même chose, même quand elle la mesure autrement.
          </li>
          <li>
            <b>Recouper.</b> Quand deux sources divergent, nous ne choisissons pas la plus
            commode : nous expliquons pourquoi elles divergent, parce que l&apos;écart est presque
            toujours une différence de périmètre, pas une erreur.
          </li>
          <li>
            <b>Rendre traçable.</b> Chaque valeur affichée porte son unité, sa période, son
            périmètre et l&apos;adresse de la publication d&apos;origine. Le lecteur doit pouvoir
            vérifier sans nous croire sur parole.
          </li>
        </ul>

        <h2 className="hub-h2">Ce que nous ne faisons pas</h2>
        <ul className="hub-puces">
          <li>
            <b>Nous ne comblons pas les trous.</b> Une année qu&apos;une source ne publie pas
            reste absente. Elle ne devient jamais zéro, ni une moyenne, ni la valeur de
            l&apos;année précédente.
          </li>
          <li>
            <b>Nous ne dramatisons pas un chiffre.</b> Les formules qui transforment un montant en
            catastrophe (« chaque habitant doit tant », « nos enfants rembourseront ») sont des
            raccourcis économiquement faux. Nous ne les employons pas.
          </li>
          <li>
            <b>Nous ne prétendons pas à la neutralité.</b> Choisir un indicateur, une période, une
            échelle, c&apos;est déjà un point de vue. Nous rendons ces choix visibles plutôt que
            de les présenter comme une objectivité de machine.
          </li>
        </ul>

        <h2 className="hub-h2">Le rôle des outils d&apos;intelligence artificielle</h2>
        <p className="hub-p">
          Nous nous en servons comme d&apos;une assistance : pour rapprocher des sources, repérer
          des écarts, harmoniser des terminologies entre publications de langues différentes. Les
          valeurs chiffrées viennent des institutions qui les publient et ne sont jamais générées.
          La responsabilité de ce qui est publié est humaine et ne se délègue pas.
        </p>

        {EQUIPE.length > 0 && (
          <>
            <h2 className="hub-h2">L&apos;équipe</h2>
            <ul className="hub-liste">
              {EQUIPE.map((m) => (
                <li key={m.nom}>
                  <div>
                    <b>{m.nom}</b>
                    <span>
                      {m.role}
                      {m.parcours ? ` — ${m.parcours}` : ""}
                    </span>
                    {m.lien && (
                      <a href={m.lien} rel="noopener noreferrer" target="_blank">
                        Profil public
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        <h2 className="hub-h2">Nous corriger</h2>
        <p className="hub-p">
          Une erreur de chiffre, de périmètre ou de source est une erreur que nous voulons
          connaître. {CONTACT ? (
            <>
              Écrivez-nous à <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
            </>
          ) : (
            <>Le forum est ouvert pour cela, et un signalement y vaut correction.</>
          )}{" "}
          Les fils de discussion sont sur <Link href="/community">la page communauté</Link>.
        </p>

        <p className="hub-note">
          Comment la base est construite et contrôlée :{" "}
          <Link href="/methodologie-donnees">méthodologie de la base</Link>. Comment un article
          s&apos;écrit : <Link href="/methodology">méthodologie éditoriale</Link>.
        </p>
      </div>
    </Layout>
  );
}

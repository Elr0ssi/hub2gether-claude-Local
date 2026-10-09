import type { Metadata } from "next";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { Layout } from "@/components/layout/Layout";
import { jsonLdString } from "@/lib/schema";

/* ═══════════════════════════════════════════════════════════════════════════
   /methodologie-donnees — COMMENT LA BASE EST FAITE

   Distincte de la méthodologie éditoriale, qui décrit comment un article
   s'écrit. Celle-ci décrit la base : sa forme, ses règles, ses contrôles.

   Les chiffres de cette page sont lus dans la base au moment de la
   construction, et non recopiés à la main. Une page qui décrit une base ne
   peut pas être la seule chose du projet à ne pas être vérifiable.
   ═══════════════════════════════════════════════════════════════════════════ */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";

interface Fiche {
  libelle: string;
  unite: string;
  categorie: string;
  sources: string[];
  annees: number[];
  paysCouverts: number;
  misAJour: string;
}

/** Les fiches d'indicateur, relues dans la base à la construction. */
function lisLaBase(): Fiche[] {
  const racine = path.join(process.cwd(), "data");
  const fiches: Fiche[] = [];
  const parcours = (dossier: string, profondeur: number) => {
    if (profondeur > 3) return;
    let entrees: fs.Dirent[];
    try {
      entrees = fs.readdirSync(dossier, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entrees) {
      if (e.isDirectory()) parcours(path.join(dossier, e.name), profondeur + 1);
      else if (e.name === "_indicateur.json") {
        try {
          fiches.push(JSON.parse(fs.readFileSync(path.join(dossier, e.name), "utf8")) as Fiche);
        } catch {
          /* Une fiche illisible ne doit pas faire tomber la page. */
        }
      }
    }
  };
  parcours(racine, 0);
  return fiches.sort((a, b) => a.categorie.localeCompare(b.categorie) || a.libelle.localeCompare(b.libelle));
}

export const metadata: Metadata = {
  title: { absolute: "Méthodologie de la base de données | Visualize" },
  description:
    "Comment la base est construite, contrôlée et publiée : structure, unités, périmètres, règle des données manquantes, contrôles automatiques et sources par indicateur.",
  keywords: [
    "méthodologie données",
    "sources données économiques",
    "données manquantes",
    "traçabilité des chiffres",
    "base de données ouverte",
  ],
  alternates: { canonical: "/methodologie-donnees" },
  openGraph: {
    type: "website",
    url: `${siteUrl}/methodologie-donnees`,
    title: "Méthodologie de la base de données",
    description:
      "Structure, unités, périmètres, règle des données manquantes, contrôles automatiques et sources par indicateur.",
  },
};

export default function Page() {
  const fiches = lisLaBase();
  const annees = fiches.flatMap((f) => f.annees ?? []);
  const premiere = annees.length ? Math.min(...annees) : 0;
  const derniere = annees.length ? Math.max(...annees) : 0;
  const pays = fiches.length ? Math.max(...fiches.map((f) => f.paysCouverts ?? 0)) : 0;
  const categories = [...new Set(fiches.map((f) => f.categorie.split("/")[0]))];

  const fil = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Méthodologie de la base", item: `${siteUrl}/methodologie-donnees` },
    ],
  };

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(fil) }} />
      <div className="hub">
        <nav className="hub-fil" aria-label="Fil d'Ariane">
          <Link href="/">Accueil</Link>
          <span aria-hidden="true">›</span>
          <span>Méthodologie de la base</span>
        </nav>

        <h1 className="hub-h1">Méthodologie de la base de données</h1>
        <p className="hub-chapo">
          Cette page décrit la base elle-même : sa forme, ses règles et ses contrôles. Les
          chiffres qui suivent ne sont pas recopiés, ils sont lus dans la base au moment où le
          site est construit. Une page qui prétend décrire une base ne peut pas être la seule
          chose du projet à ne pas être vérifiable.
        </p>

        <div className="hub-chiffres">
          <p>
            <b>{fiches.length}</b>
            <span>indicateurs publiés</span>
          </p>
          <p>
            <b>{pays}</b>
            <span>pays et territoires au maximum de couverture</span>
          </p>
          <p>
            <b>
              {premiere}&ndash;{derniere}
            </b>
            <span>années couvertes, selon l&apos;indicateur</span>
          </p>
        </div>

        <h2 className="hub-h2">Comment la base est rangée</h2>
        <p className="hub-p">
          Un chemin, une idée. Chaque valeur vit dans un fichier dont l&apos;emplacement dit ce
          qu&apos;elle mesure et de quel pays elle parle :
        </p>
        <pre className="hub-code">data/CATÉGORIE/SOUS-CATÉGORIE/INDICATEUR/&lt;ISO3&gt;.json</pre>
        <p className="hub-p">
          Les pays sont identifiés par leur code à trois lettres de la norme ISO 3166-1, jamais
          par leur nom : un nom change de graphie, de langue et de frontières, un code non. Les
          catégories publiées à ce jour sont {categories.join(", ")}.
        </p>
        <p className="hub-p">
          Chaque dossier d&apos;indicateur porte une fiche, <code>_indicateur.json</code>, qui
          déclare son libellé, son unité, ses sources, les années couvertes, le nombre de pays et
          la date de mise à jour. C&apos;est cette fiche qui alimente la table ci-dessous : rien
          n&apos;y est saisi deux fois.
        </p>

        <h2 className="hub-h2">La règle qui compte le plus</h2>
        <p className="hub-p">
          <b>Une année absente reste absente.</b> Lorsqu&apos;une source ne publie pas de valeur
          pour un pays et une année, rien n&apos;est écrit : ni zéro, ni moyenne, ni valeur
          reprise de l&apos;année précédente. Le pays sort simplement du classement de cette
          année-là.
        </p>
        <p className="hub-p">
          C&apos;est une règle coûteuse, parce qu&apos;elle laisse des trous visibles dans les
          courbes et des classements dont le nombre de pays varie d&apos;une année à l&apos;autre.
          Elle est tenue quand même : un zéro inventé est indiscernable d&apos;un zéro mesuré une
          fois qu&apos;il est dans un graphique, et c&apos;est exactement ce qui fait qu&apos;on
          ne peut plus faire confiance à un jeu de données.
        </p>

        <h2 className="hub-h2">Ce qu&apos;une valeur transporte avec elle</h2>
        <p className="hub-p">
          Un montant seul ne veut rien dire. Les valeurs publiées portent, selon les cas, leur
          unité, leur période, leur périmètre, leur base comptable, leur mode de valorisation,
          leur statut (définitif, provisoire, estimé) et l&apos;adresse de la publication
          d&apos;origine. C&apos;est ce qui permet de dire pourquoi deux chiffres justes ne
          disent pas la même chose, plutôt que de laisser croire que l&apos;un des deux est faux.
        </p>

        <h2 className="hub-h2">Les contrôles</h2>
        <ul className="hub-puces">
          <li>
            <b>Contrôle d&apos;intégrité.</b> Un script relit la base et compare chaque valeur à
            la source d&apos;origine du projet, fichier par fichier. Une différence, même
            d&apos;arrondi, arrête la publication.
          </li>
          <li>
            <b>Contrôle de forme.</b> Code pays valide, années entières, valeurs numériques
            finies, unité déclarée, fiche d&apos;indicateur présente.
          </li>
          <li>
            <b>Aucune donnée n&apos;est supprimée.</b> Les réorganisations de la base sont des
            déplacements vérifiés, jamais des réécritures : la structure change, les valeurs non.
          </li>
        </ul>

        <h2 className="hub-h2">Les indicateurs et leurs sources</h2>
        <div className="hub-tab-w">
          <table className="hub-tab">
            <thead>
              <tr>
                <th scope="col">Indicateur</th>
                <th scope="col">Unité</th>
                <th scope="col">Années</th>
                <th scope="col">Pays</th>
                <th scope="col">Source</th>
                <th scope="col">Mise à jour</th>
              </tr>
            </thead>
            <tbody>
              {fiches.map((f) => (
                <tr key={f.categorie + f.libelle}>
                  <th scope="row">
                    {f.libelle}
                    <span>{f.categorie}</span>
                  </th>
                  <td>{f.unite}</td>
                  <td>
                    {f.annees?.length ? `${Math.min(...f.annees)}–${Math.max(...f.annees)}` : "—"}
                  </td>
                  <td>{f.paysCouverts ?? "—"}</td>
                  <td>{(f.sources ?? []).join(" · ")}</td>
                  <td>{f.misAJour ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="hub-h2">Ce que cette page ne couvre pas</h2>
        <p className="hub-p">
          La manière dont un article est écrit, relu et corrigé relève de la{" "}
          <Link href="/methodology">méthodologie éditoriale</Link>. La liste des sources par
          publication est tenue sur la page <Link href="/sources">sources</Link>. Qui fait ce
          travail est dit sur la page <Link href="/a-propos">à propos</Link>.
        </p>
      </div>
    </Layout>
  );
}

import type { Metadata } from "next";
import { PageLegale } from "@/components/legal/PageLegale";

export const metadata: Metadata = {
  title: { absolute: "Conditions générales d'utilisation | Visualize" },
  description:
    "Les règles d'utilisation de Visualize : accès au site, contenus, données et sources, forum, responsabilité.",
  alternates: { canonical: "/cgu" },
};

export default function Page() {
  return (
    <PageLegale
      titre="Conditions générales d'utilisation"
      maj="octobre 2026"
      sections={[
        {
          titre: "Objet",
          paragraphes: [
            "Visualize est un site d'information qui présente des données économiques et démographiques sous forme de cartes, de classements et de dossiers. Utiliser le site implique d'accepter les présentes conditions.",
          ],
        },
        {
          titre: "Accès au site",
          paragraphes: [
            "La consultation est libre et gratuite. Un compte est nécessaire pour participer au forum. Nous pouvons modifier, suspendre ou interrompre tout ou partie du site, notamment pour sa maintenance, sans que cela ouvre droit à une compensation.",
          ],
        },
        {
          titre: "Données et sources",
          paragraphes: [
            "Les chiffres proviennent d'institutions citées sous chaque graphique (Banque mondiale, FMI, Nations Unies, INSEE, Banque de France, Agence France Trésor, Eurostat). Nous les présentons avec leur période et leur périmètre, mais ils peuvent être révisés par leurs producteurs. Ils ne constituent ni un conseil financier, ni un conseil juridique.",
          ],
        },
        {
          titre: "Propriété intellectuelle",
          paragraphes: [
            "La mise en forme, les textes et les visualisations de Visualize sont protégés. Vous pouvez citer un chiffre, un graphique ou un extrait en mentionnant Visualize et en renvoyant vers la page d'origine. Les données sources restent soumises aux licences de leurs producteurs.",
          ],
        },
        {
          titre: "Le forum",
          paragraphes: [
            "Vous êtes responsable de ce que vous publiez. Sont interdits les propos illicites, haineux, diffamatoires, les contenus publicitaires non sollicités et la publication de données personnelles d'autrui. Nous pouvons retirer un message ou suspendre un compte qui ne respecte pas ces règles.",
          ],
        },
        {
          titre: "Responsabilité",
          paragraphes: [
            "Nous faisons de notre mieux pour que les informations soient exactes et à jour, sans pouvoir garantir l'absence d'erreur. Visualize ne peut être tenu responsable d'une décision prise sur la seule base de son contenu, ni du contenu des sites vers lesquels il renvoie.",
          ],
        },
        {
          titre: "Droit applicable",
          paragraphes: [
            "Les présentes conditions sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action devant les tribunaux compétents.",
          ],
        },
      ]}
    />
  );
}

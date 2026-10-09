import type { Metadata } from "next";
import { PageLegale } from "@/components/legal/PageLegale";

export const metadata: Metadata = {
  title: { absolute: "Politique de confidentialité (RGPD) | Visualize" },
  description:
    "Quelles données Visualize collecte, pourquoi, combien de temps, et comment exercer vos droits d'accès, de rectification et de suppression.",
  alternates: { canonical: "/confidentialite" },
};

const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL
  ? `à ${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`
  : "à l'adresse de contact de l'éditeur";

export default function Page() {
  return (
    <PageLegale
      titre="Politique de confidentialité"
      maj="octobre 2026"
      sections={[
        {
          titre: "Ce que nous collectons",
          paragraphes: [
            "Si vous consultez Visualize sans compte, nous ne vous demandons rien : aucune donnée personnelle n'est collectée pour lire les pages, les cartes et les dossiers.",
            "Si vous créez un compte, nous enregistrons votre adresse e-mail et, selon le mode de connexion choisi, l'identifiant fourni par votre fournisseur (par exemple Google). Si vous publiez sur le forum, nous conservons vos messages et le nom sous lequel vous les signez.",
          ],
        },
        {
          titre: "Ce qui reste dans votre navigateur",
          paragraphes: [
            "Vos préférences d'affichage — thème clair ou sombre, monnaie choisie — sont mémorisées dans le stockage local de votre navigateur. Elles ne quittent pas votre appareil et ne servent à aucun suivi.",
            "Visualize n'utilise ni cookie publicitaire, ni outil de pistage, ni traceur tiers. Seul le cookie de session nécessaire à la connexion est déposé, et seulement si vous vous connectez.",
          ],
        },
        {
          titre: "Pourquoi et sur quelle base",
          paragraphes: [
            "Votre e-mail sert à créer et sécuriser votre compte ; vos messages servent à faire vivre le forum. Le traitement repose sur l'exécution du service que vous avez demandé et, pour le forum, sur votre consentement au moment de publier.",
          ],
        },
        {
          titre: "Qui y a accès",
          paragraphes: [
            "Les données de compte sont hébergées chez notre prestataire d'authentification et de base de données, et le site est servi par notre hébergeur. Ils les traitent pour notre compte, sans les utiliser à leurs propres fins. Nous ne vendons aucune donnée.",
          ],
        },
        {
          titre: "Combien de temps",
          paragraphes: [
            "Votre compte et vos messages sont conservés tant que le compte existe. Si vous le supprimez, vos données personnelles sont effacées ; vos messages publics peuvent être anonymisés plutôt qu'effacés pour ne pas casser les discussions.",
          ],
        },
        {
          titre: "Vos droits",
          paragraphes: [
            `Vous pouvez demander l'accès à vos données, leur rectification, leur effacement, leur portabilité, ou vous opposer à leur traitement, en écrivant ${CONTACT}. Vous pouvez aussi saisir la CNIL (www.cnil.fr) si vous estimez que vos droits ne sont pas respectés.`,
          ],
        },
      ]}
    />
  );
}

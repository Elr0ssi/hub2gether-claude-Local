import type { Metadata } from "next";
import { ForumPage } from "@/components/concept/ForumPage";

/* ═══════════════════════════════════════════════════════════════════════════
   /forum — LE FORUM, DANS LA DIRECTION ARTISTIQUE DU SITE

   Même moteur que /community — comptes, vote, fils, modération — sous la
   présentation d'Économie et de Démographie plutôt que sous l'ancienne. Les
   deux adresses restent vivantes ; celle-ci est celle vers laquelle le site
   renvoie désormais.
   ═══════════════════════════════════════════════════════════════════════════ */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";
const chemin = "/forum";

export const metadata: Metadata = {
  title: { absolute: "Forum : débattre des chiffres publiés | Visualize" },
  description:
    "Des fils ouverts sur des chiffres publiés — économie, démographie, épidémies, politique. On discute, on conteste, on apporte une source.",
  alternates: { canonical: chemin },
  openGraph: {
    type: "website",
    url: `${siteUrl}${chemin}`,
    title: "Forum : débattre des chiffres publiés",
    description: "Des fils ouverts sur des chiffres publiés. On discute, on conteste, on apporte une source.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forum : débattre des chiffres publiés",
    description: "Des fils ouverts sur des chiffres publiés.",
  },
};

export default function Page() {
  return <ForumPage />;
}

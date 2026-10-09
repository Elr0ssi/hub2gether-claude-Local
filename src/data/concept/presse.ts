/* ═══════════════════════════════════════════════════════════════════════════
   LES ARTICLES DE PRESSE CITÉS

   Ce fichier est fait pour être rempli à la main : une entrée par article
   que l'on veut citer, avec le média, le titre tel qu'il a été publié et
   l'adresse exacte de l'article.

   Tant qu'une entrée porte `exemple: true`, elle s'affiche comme un
   emplacement à renseigner — jamais comme un vrai article. On n'invente ni
   média, ni titre, ni adresse : une citation inventée serait une fausse
   source, et c'est exactement ce que ce bloc doit éviter. Dès qu'une entrée
   est renseignée et que `exemple` est retiré, elle devient un vrai lien
   sortant, repris dans les données structurées de la page.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Citation {
  /** Le nom du média, tel qu'il se présente. */
  media: string;
  /** Le titre de l'article, mot pour mot. */
  titre: string;
  /** L'adresse exacte de l'article. */
  url: string;
  /** La date de publication, au format AAAA-MM-JJ. */
  date?: string;
  /** Le sujet que cet article éclaire, en deux ou trois mots. */
  sujet: string;
  /** Vrai tant que l'emplacement n'est pas renseigné. */
  exemple?: boolean;
}

const vide = (sujet: string): Citation => ({
  media: "Média à renseigner",
  titre: "Titre de l'article à renseigner",
  url: "",
  sujet,
  exemple: true,
});

/** Les articles qui parlent de la dette publique française. */
export const PRESSE_DETTE: Citation[] = [
  vide("Montant de la dette"),
  vide("Déficit public"),
  vide("Charge des intérêts"),
  vide("Qui détient la dette"),
  vide("Budget et Parlement"),
  vide("Comparaison européenne"),
];

/** Ceux qui parlent de l'économie mondiale, pour la page d'analyses. */
export const PRESSE_MONDE: Citation[] = [
  vide("PIB mondial"),
  vide("Croissance"),
  vide("Inflation"),
  vide("Dette des États"),
  vide("Chômage"),
  vide("Démographie"),
];

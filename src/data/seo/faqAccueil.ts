import type { QR } from "./textes";

export const FAQ_ACCUEIL: QR[] = [
  {
    q: "Qu'est-ce que Visualize ?",
    r: "Visualize est un site de données qui rend lisibles les chiffres du monde : économie et démographie de plus de 200 pays, sur des globes interactifs, des compteurs en temps réel, des classements, des comparaisons et des articles qui décortiquent un chiffre.",
  },
  {
    q: "D'où viennent les données de Visualize ?",
    r: "Elles viennent de sources publiques : la Banque mondiale (World Development Indicators), le FMI et les Nations Unies (World Population Prospects 2024), complétées pour la France par l'INSEE, la Banque de France et l'Agence France Trésor. Chaque donnée garde sa source et sa date.",
  },
  {
    q: "De quelle période disposez-vous ?",
    r: "Le PIB, le PIB par habitant, la balance commerciale, l'inflation et la population remontent à 1960. Certains indicateurs, comme la dette publique ou le chômage, ne sont publiés que pour des années plus récentes : l'année disponible est toujours indiquée, et une valeur absente reste absente.",
  },
  {
    q: "Comment comparer deux pays ?",
    r: "Ouvrez le comparateur, choisissez jusqu'à quatre pays et un indicateur : les barres montrent l'année choisie, la courbe l'évolution depuis 1960. Chaque paire de pays a aussi sa page, par exemple France ou Allemagne, avec la population, le PIB, la superficie et l'évolution.",
  },
  {
    q: "Que veut dire « en temps réel » pour le PIB mondial ?",
    r: "Aucune institution ne publie un PIB à la seconde. Le compteur prend la dernière valeur annuelle publiée et la ramène à la seconde, cumulée depuis le 1er janvier : c'est une projection, pas une mesure instantanée. Le même principe s'applique aux dépenses mondiales et à la population.",
  },
  {
    q: "Comment sont construits les classements ?",
    r: "Chaque classement trie les pays selon la dernière valeur publiée de l'indicateur (PIB, PIB par habitant, dette publique rapportée au PIB, population…). Un pays dont la source ne publie pas la valeur n'est pas classé : il n'est pas considéré comme dernier.",
  },
  {
    q: "Visualize est-il gratuit ?",
    r: "La consultation des données, des globes et des comparaisons est libre et gratuite. Un compte n'est nécessaire que pour participer au forum.",
  },
];

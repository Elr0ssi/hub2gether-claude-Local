import { classement, complet, court, flagLibelle, indexer, totalMonde } from "./calc";
import { nomZone } from "./noms";
import type { JeuRessource } from "./types";

/* ═══════════════════════════════════════════════════════════════════════════
   LA FAQ D'UNE RESSOURCE

   Les réponses sont CALCULÉES à partir du fichier importé : jamais un chiffre écrit à la main. Elles décrivent ce que la page montre, et
   le balisage FAQPage reprend exactement ces textes. Si une donnée manque, la question n'est pas posée.
   ═══════════════════════════════════════════════════════════════════════════ */

export function faqRessource(J: JeuRessource, nomFr: string): { question: string; answer: string }[] {
  const an = J.annees[1];
  const ix = indexer(J);
  const nom = (id: string) => nomZone(ix.parM49.get(id)!);
  const art = /^[aeiouyhéèêâîô]/i.test(nomFr) ? "d’" : "de ";
  const out: { question: string; answer: string }[] = [];

  const prod = classement(J, "production", an);
  const total = totalMonde(J, "production", an);
  if (prod.length >= 3) {
    out.push({
      question: `Quel pays produit le plus ${art}${nomFr.toLowerCase()} en ${an} ?`,
      answer: `${nom(prod[0].m49)}, avec ${complet(prod[0].valeur)} tonnes en ${an} selon FAOSTAT, devant ${nom(prod[1].m49)} (${complet(prod[1].valeur)} t) et ${nom(prod[2].m49)} (${complet(prod[2].valeur)} t). Statut de la valeur chez FAOSTAT : ${flagLibelle(prod[0].flag).toLowerCase()} (le statut de chaque valeur est indiqué sur la page).`,
    });
  }
  if (total) {
    out.push({
      question: `Quelle est la production mondiale ${art}${nomFr.toLowerCase()} en ${an} ?`,
      answer: `Environ ${court(total.valeur)} de tonnes, en additionnant ${total.entites} pays et entités publiés dans le fichier FAOSTAT. C’est un total recalculé par Visualize, pas un total officiel de la FAO : il ne contient que les pays présents dans l’export.`,
    });
  }
  const rend = classement(J, "rendement", an);
  if (rend.length >= 3) {
    out.push({
      question: `Quel pays a le meilleur rendement ${art}${nomFr.toLowerCase()} ?`,
      answer: `En ${an}, ${nom(rend[0].m49)} avec ${complet(rend[0].valeur)} kg par hectare, devant ${nom(rend[1].m49)} (${complet(rend[1].valeur)}). Le rendement est la production rapportée à la surface récoltée : un petit producteur peut avoir un excellent rendement.`,
    });
  }
  out.push({
    question: "Quelle différence entre production, surface récoltée et rendement ?",
    answer: "La production est la quantité récoltée, en tonnes. La surface récoltée est l’aire effectivement moissonnée, en hectares. Le rendement est la production par hectare, en kilogrammes. Les trois sont publiés séparément par FAOSTAT et la page ne les mélange jamais : choisir l’un recolore tout le globe.",
  });
  out.push({
    question: "D’où viennent ces données ?",
    answer: `De FAOSTAT, la base statistique de l’Organisation des Nations unies pour l’alimentation et l’agriculture (domaine « ${J.ressource.domaine_nom} », produit « ${J.ressource.nom_fao} »), de ${J.annees[0]} à ${an}. Chaque valeur garde son statut d’origine : officielle, estimée, imputée ou venue d’une organisation externe.`,
  });
  out.push({
    question: `Pourquoi n’y a-t-il pas de données pour 2025 ou 2026 ?`,
    answer: `Parce que le fichier importé s’arrête à ${an}, dernière année publiée par FAOSTAT pour ce produit. La date d’export du fichier n’est pas l’année des observations, et Visualize n’invente aucune valeur pour les années absentes.`,
  });
  const hist = J.zones.filter((z) => z.type === "historique");
  if (hist.length) {
    out.push({
      question: "Pourquoi l’URSS ou la Yougoslavie apparaissent-elles dans le classement mais pas sur le globe ?",
      answer: `Ces entités n’existent plus : leurs séries (${hist.map((z) => `${nomZone(z)} ${z.debut}–${z.fin}`).join(", ")}) sont conservées dans les classements et les graphiques sur leurs années, mais ne sont rattachées à aucune frontière actuelle, pour ne pas leur prêter des territoires qu’elles n’ont plus.`,
    });
  }
  out.push({
    question: "Que signifient « estimée », « imputée » et « source externe » ?",
    answer: "« Officielle » : valeur transmise par le pays. « Estimée » : calculée par la FAO. « Imputée » : complétée par un organisme destinataire. « Source externe » : fournie par une autre organisation. Une valeur manquante n’est jamais affichée comme zéro.",
  });
  return out;
}

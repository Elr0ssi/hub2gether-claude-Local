import { avec, cap, deNom, nf } from "@/data/seo/francais";
import type { Dossier } from "./dossiers";
import type { Fmt, QR } from "./textes";

/* ═══════════════════════════════════════════════════════════════════════════
   LES ANALYSES DE LA DETTE : des articles qui comparent les pays

   Chaque analyse est écrite à partir de la base de dette et d'elle seule :
   dette en 2000, 2014 et 2024 (milliards d'euros), poids dans le PIB,
   inflation. Les chiffres sont calculés ici ; les phrases de lecture, elles,
   ne contiennent aucun chiffre qui ne vienne pas de la base. Quand la base
   sera remplacée ou complétée, les articles se réécriront d'eux-mêmes.

   Le module est pur : le serveur l'exécute en euros pour le référencement,
   le navigateur le rejoue dans la monnaie du lecteur.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Ligne {
  slug: string;
  flag: string;
  fr: string;
  cellules: string[];
}

export interface Tableau {
  titre: string;
  entetes: string[];
  lignes: Ligne[];
  note?: string;
}

export interface Chiffre {
  label: string;
  valeur: string;
  note: string;
}

export interface Contenu {
  intro: string;
  chiffres: Chiffre[];
  tableaux: Tableau[];
  lecture: { titre: string; texte: string[] }[];
  faq: QR[];
}

export interface Analyse {
  slug: string;
  /** Titre de la page (balise title, sans la marque). */
  titre: string;
  /** Titre affiché : une partie claire, une partie en dégradé. */
  h1: [string, string];
  accroche: string;
  famille: "classement" | "region";
  contenu: (d: Dossier[], f: Fmt) => Contenu;
  description: (d: Dossier[], f: Fmt) => string;
}

/* ── Petits outils ─────────────────────────────────────────────────────── */

const pct = (v: number) => `${nf(v, 1)} %`;
const pts = (v: number) => `${v >= 0 ? "+" : "−"}${nf(Math.abs(v), 1)} pts`;
const mediane = (v: number[]) => {
  const s = [...v].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const montant = (f: Fmt, d: Dossier) => f.m(d.d2024, 2024);
const ligne = (d: Dossier, cellules: string[]): Ligne => ({ slug: d.slug, flag: d.flag, fr: d.fr, cellules });
const parHabitant = (d: Dossier) => (d.pop2024 ? (d.d2024 * 1e9) / d.pop2024 : null);
const evo = (d: Dossier) => d.p2024 - d.p2000;
const liste = (noms: string[]) => (noms.length <= 1 ? noms.join("") : `${noms.slice(0, -1).join(", ")} et ${noms[noms.length - 1]}`);
const le = (d: Dossier) => avec(d.fr);
const Le = (d: Dossier) => cap(avec(d.fr));
const rang = (n: number) => (n === 1 ? "premier" : `${n}e`);

/** Les phrases de lecture communes : ce que le ratio dit, et ce qu'il ne dit pas. */
const PRUDENCE =
  "Le poids de la dette dans le PIB est un repère, pas un verdict. Il ne dit ni dans quelle monnaie la dette est libellée, ni qui la détient, ni à quel taux elle est renouvelée, ni à quelle vitesse l'économie croît : quatre éléments qui décident, bien plus que le chiffre seul, de la facilité à la porter.";
const NOTE_BASE =
  "Les chiffres viennent de la base de dette de Visualize (2000, 2014 et 2024, en milliards d'euros) ; ils sont arrondis et peuvent différer des publications nationales, qui n'utilisent pas toutes le même périmètre d'administrations publiques.";

/* ── Les classements ───────────────────────────────────────────────────── */

const plusEndettes: Analyse = {
  slug: "pays-les-plus-endettes",
  titre: "Les pays les plus endettés du monde : classement de la dette publique en % du PIB",
  h1: ["Les pays les plus endettés", "du monde"],
  accroche: "Le classement de la dette publique rapportée à la richesse produite, 2024.",
  famille: "classement",
  description: (d) => {
    const t = [...d].sort((a, b) => b.p2024 - a.p2024);
    return `Quels pays sont les plus endettés ? ${t[0].fr} (${pct(t[0].p2024)} du PIB), ${t[1].fr} (${pct(t[1].p2024)}), ${t[2].fr} (${pct(t[2].p2024)})… Classement de ${d.length} pays en 2024, avec l'évolution depuis 2000.`;
  },
  contenu: (d, f) => {
    const t = [...d].sort((a, b) => b.p2024 - a.p2024);
    const tete = t.slice(0, 15);
    const sup100 = d.filter((x) => x.p2024 >= 100);
    const med = mediane(d.map((x) => x.p2024));
    const sous60 = d.filter((x) => x.p2024 < 60).length;
    return {
      intro: `Sur les ${d.length} pays de notre base, ${sup100.length} portent en 2024 une dette publique supérieure à la richesse qu'ils produisent en un an. ${Le(t[0])} arrive en tête avec ${pct(t[0].p2024)} du PIB, devant ${le(t[1])} (${pct(t[1].p2024)}) et ${le(t[2])} (${pct(t[2].p2024)}). La médiane des ${d.length} pays se situe à ${pct(med)}.`,
      chiffres: [
        { label: "En tête", valeur: pct(t[0].p2024), note: `${t[0].flag} ${t[0].fr}` },
        { label: "Au-dessus de 100 % du PIB", valeur: `${sup100.length} pays`, note: `sur ${d.length}` },
        { label: "Médiane des pays", valeur: pct(med), note: "dette / PIB en 2024" },
        { label: "Sous le seuil de 60 %", valeur: `${sous60} pays`, note: "le repère de Maastricht" },
      ],
      tableaux: [
        {
          titre: "Les quinze pays les plus endettés (en % du PIB)",
          entetes: ["Pays", "Dette / PIB 2024", "Montant 2024", "Depuis 2000"],
          lignes: tete.map((x) => ligne(x, [pct(x.p2024), montant(f, x), pts(evo(x))])),
          note: "L'évolution est la différence, en points de PIB, entre le ratio de 2024 et celui de 2000.",
        },
      ],
      lecture: [
        {
          titre: "Un ratio élevé n'est pas toujours un danger immédiat",
          texte: [
            PRUDENCE,
            "Le Japon en est l'exemple le plus connu : l'un des ratios les plus élevés au monde, mais une dette libellée dans sa propre monnaie et détenue pour l'essentiel par des résidents. À l'inverse, un ratio plus modeste peut être fragile pour un pays qui emprunte en devises étrangères.",
          ],
        },
        {
          titre: "Le rôle de l'inflation",
          texte: [
            "Dans les économies où les prix s'envolent, le ratio dette/PIB peut sembler s'alléger : le PIB nominal gonfle avec les prix, alors que la dette, elle, garde sa valeur faciale. C'est une réduction subie, qui renchérit en retour le coût des nouveaux emprunts. Notre analyse sur la dette et l'inflation détaille ce mécanisme pays par pays.",
          ],
        },
      ],
      faq: [
        { q: "Quel est le pays le plus endetté du monde ?", r: `Dans notre base, c'est ${le(t[0])}, avec une dette publique de ${pct(t[0].p2024)} du PIB en 2024. En montant absolu, ce ne sont pas les mêmes pays : voir le classement par montant.` },
        { q: "Quels sont les cinq pays les plus endettés ?", r: `En 2024 : ${liste(t.slice(0, 5).map((x) => `${le(x)} (${pct(x.p2024)})`))}.` },
        { q: "Combien de pays dépassent 100 % du PIB ?", r: `${sup100.length} des ${d.length} pays de notre base : ${liste(sup100.map(le))}.` },
        { q: "Où se situe la France dans ce classement ?", r: `La France est au ${rang(t.findIndex((x) => x.nom === "France") + 1)} rang sur ${d.length}, avec ${pct(d.find((x) => x.nom === "France")!.p2024)} du PIB.` },
      ],
    };
  },
};

const plusGrosses: Analyse = {
  slug: "plus-grosses-dettes-du-monde",
  titre: "Les plus grosses dettes publiques du monde : classement en montant",
  h1: ["Les plus grosses dettes", "en montant"],
  accroche: "Qui doit le plus, en valeur absolue ? Un classement qui suit la taille des économies.",
  famille: "classement",
  description: (d, f) => {
    const t = [...d].sort((a, b) => b.d2024 - a.d2024);
    return `Les plus grosses dettes publiques du monde en 2024 : ${t[0].fr} (${montant(f, t[0])}), ${t[1].fr} (${montant(f, t[1])}), ${t[2].fr} (${montant(f, t[2])})… Classement en montant de ${d.length} pays.`;
  },
  contenu: (d, f) => {
    const t = [...d].sort((a, b) => b.d2024 - a.d2024);
    const total = d.reduce((s, x) => s + x.d2024, 0);
    const top3 = t.slice(0, 3).reduce((s, x) => s + x.d2024, 0);
    const top10 = t.slice(0, 10).reduce((s, x) => s + x.d2024, 0);
    return {
      intro: `Additionnées, les dettes publiques des ${d.length} pays de notre base atteignent ${f.m(total, 2024)} en 2024. Trois pays en portent à eux seuls ${nf((top3 / total) * 100, 0)} % : ${liste(t.slice(0, 3).map(le))}. Un montant brut suit d'abord la taille de l'économie : c'est pourquoi on le complète toujours par le poids dans le PIB.`,
      chiffres: [
        { label: "Dette cumulée", valeur: f.m(total, 2024), note: `${d.length} pays de la base` },
        { label: "Les trois premiers", valeur: `${nf((top3 / total) * 100, 0)} %`, note: "du total cumulé" },
        { label: "Les dix premiers", valeur: `${nf((top10 / total) * 100, 0)} %`, note: "du total cumulé" },
        { label: "Plus grosse dette", valeur: montant(f, t[0]), note: `${t[0].flag} ${t[0].fr}` },
      ],
      tableaux: [
        {
          titre: "Les quinze plus grosses dettes (2024)",
          entetes: ["Pays", "Montant 2024", "Dette / PIB 2024", "Part du total"],
          lignes: t.slice(0, 15).map((x) => ligne(x, [montant(f, x), pct(x.p2024), `${nf((x.d2024 / total) * 100, 1)} %`])),
        },
      ],
      lecture: [
        {
          titre: "Pourquoi le montant seul trompe",
          texte: [
            "Les plus gros montants reviennent aux plus grandes économies, qui ont aussi les marchés financiers les plus profonds. Une dette de plusieurs milliers de milliards se porte différemment selon qu'elle représente 60 % ou 260 % de la richesse annuelle : lisez ce classement avec celui des pays les plus endettés en proportion du PIB.",
            "Les montants sont écrits dans la monnaie de votre choix, au taux moyen de l'année de chaque valeur : changer de monnaie ne modifie ni l'ordre ni les proportions du classement, seulement l'unité.",
          ],
        },
      ],
      faq: [
        { q: "Quel pays a la plus grosse dette publique ?", r: `Dans notre base, ${le(t[0])}, avec environ ${montant(f, t[0])} en 2024 (${pct(t[0].p2024)} du PIB).` },
        { q: "Quelle est la dette cumulée des pays de la base ?", r: `${f.m(total, 2024)} en 2024, pour ${d.length} pays.` },
        { q: "Pourquoi les États-Unis et la Chine dominent-ils ce classement ?", r: "Parce que le montant d'une dette suit la taille de l'économie et la profondeur des marchés où l'État peut emprunter. Le poids dans le PIB reste le bon indicateur pour comparer des pays de tailles différentes." },
      ],
    };
  },
};

const parTete: Analyse = {
  slug: "dette-par-habitant",
  titre: "Dette publique par habitant : classement des pays",
  h1: ["La dette publique", "par habitant"],
  accroche: "Ce que représente la dette de l'État, rapportée à chaque habitant du pays.",
  famille: "classement",
  description: (d, f) => {
    const t = d.filter((x) => parHabitant(x) !== null).sort((a, b) => parHabitant(b)! - parHabitant(a)!);
    return `Dette publique par habitant en 2024 : ${t[0].fr} (${f.u(parHabitant(t[0])!, 2024)}), ${t[1].fr} (${f.u(parHabitant(t[1])!, 2024)})… Classement de ${t.length} pays.`;
  },
  contenu: (d, f) => {
    const t = d.filter((x) => parHabitant(x) !== null).sort((a, b) => parHabitant(b)! - parHabitant(a)!);
    const fr = t.find((x) => x.nom === "France");
    const med = mediane(t.map((x) => parHabitant(x)!));
    const bas = t[t.length - 1];
    return {
      intro: `Rapportée au nombre d'habitants, la dette publique ${deNom(t[0].fr)} atteint ${f.u(parHabitant(t[0])!, 2024)} par personne en 2024, la plus élevée de notre base. ${fr ? `Celle de la France s'établit à ${f.u(parHabitant(fr)!, 2024)}, au ${rang(t.indexOf(fr) + 1)} rang sur ${t.length}. ` : ""}La médiane des ${t.length} pays est de ${f.u(med, 2024)}.`,
      chiffres: [
        { label: "Le plus élevé", valeur: f.u(parHabitant(t[0])!, 2024), note: `${t[0].flag} ${t[0].fr}` },
        { label: "Médiane", valeur: f.u(med, 2024), note: `${t.length} pays` },
        { label: "Le plus faible", valeur: f.u(parHabitant(bas)!, 2024), note: `${bas.flag} ${bas.fr}` },
        ...(fr ? [{ label: "France", valeur: f.u(parHabitant(fr)!, 2024), note: `${rang(t.indexOf(fr) + 1)} sur ${t.length}` }] : []),
      ],
      tableaux: [
        {
          titre: "Les quinze pays où la dette par habitant est la plus haute",
          entetes: ["Pays", "Dette par habitant", "Dette / PIB 2024", "Habitants"],
          lignes: t.slice(0, 15).map((x) => ligne(x, [f.u(parHabitant(x)!, 2024), pct(x.p2024), `${nf(x.pop2024! / 1e6, x.pop2024! >= 1e7 ? 0 : 1)} M`])),
        },
      ],
      lecture: [
        {
          titre: "Ce que mesure — et ne mesure pas — la dette par habitant",
          texte: [
            "Diviser la dette par la population donne une image parlante, mais trompeuse : la dette n'est pas due par chaque habitant, elle est due par l'État, qui dispose de recettes. Un pays riche supporte une dette par tête bien plus élevée qu'un pays pauvre, simplement parce que ses habitants produisent davantage.",
            "Pour comparer la charge réelle, il faut la rapporter au revenu : c'est le rôle du ratio dette/PIB. La dette par habitant reste utile pour ordonner de grandeur et pour parler concrètement d'un montant autrement abstrait.",
          ],
        },
      ],
      faq: [
        { q: "Quelle est la dette publique par habitant en France ?", r: fr ? `Environ ${f.u(parHabitant(fr)!, 2024)} par habitant en 2024, soit ${pct(fr.p2024)} du PIB.` : "La base ne publie pas la population de la France pour cette année." },
        { q: "Quel pays a la dette par habitant la plus élevée ?", r: `${Le(t[0])}, avec ${f.u(parHabitant(t[0])!, 2024)} par habitant en 2024.` },
        { q: "Chaque habitant doit-il vraiment cette somme ?", r: "Non : la dette est celle de l'État, remboursée grâce aux recettes publiques. La dette par habitant est un moyen de rendre un montant concret, pas une facture individuelle." },
      ],
    };
  },
};

const depuis2000: Analyse = {
  slug: "dette-publique-depuis-2000",
  titre: "Dette publique depuis 2000 : les pays qui se sont endettés, ceux qui se sont désendettés",
  h1: ["La dette depuis 2000 :", "qui s'est endetté, qui s'est désendetté"],
  accroche: "Vingt-quatre ans d'évolution du ratio dette/PIB, pays par pays.",
  famille: "classement",
  description: (d) => {
    const t = [...d].sort((a, b) => evo(b) - evo(a));
    const b = [...d].sort((a, c) => evo(a) - evo(c));
    return `Dette publique depuis 2000 : ${t[0].fr} (${pts(evo(t[0]))}) et ${t[1].fr} (${pts(evo(t[1]))}) en tête des hausses ; ${b[0].fr} (${pts(evo(b[0]))}) en tête des baisses. ${d.length} pays comparés.`;
  },
  contenu: (d, f) => {
    const hausse = [...d].sort((a, b) => evo(b) - evo(a));
    const baisse = [...d].sort((a, b) => evo(a) - evo(b));
    const plus = d.filter((x) => evo(x) > 3).length;
    const moins = d.filter((x) => evo(x) < -3).length;
    const stable = d.length - plus - moins;
    const gros = d.map((x) => x.d2024 / x.d2000).sort((a, b) => b - a);
    return {
      intro: `Entre 2000 et 2024, la dette rapportée au PIB a augmenté de plus de trois points dans ${plus} des ${d.length} pays de notre base, reculé de plus de trois points dans ${moins}, et peu bougé dans les ${stable} autres. Les plus fortes hausses : ${liste(hausse.slice(0, 3).map((x) => `${le(x)} (${pts(evo(x))})`))}. Les plus fortes baisses : ${liste(baisse.slice(0, 3).map((x) => `${le(x)} (${pts(evo(x))})`))}.`,
      chiffres: [
        { label: "Ratio en hausse", valeur: `${plus} pays`, note: "de plus de 3 points depuis 2000" },
        { label: "Ratio en baisse", valeur: `${moins} pays`, note: "de plus de 3 points depuis 2000" },
        { label: "Plus forte hausse", valeur: pts(evo(hausse[0])), note: `${hausse[0].flag} ${hausse[0].fr}` },
        { label: "Plus forte baisse", valeur: pts(evo(baisse[0])), note: `${baisse[0].flag} ${baisse[0].fr}` },
      ],
      tableaux: [
        {
          titre: "Les dix plus fortes hausses du ratio dette/PIB",
          entetes: ["Pays", "Ratio 2000", "Ratio 2024", "Variation"],
          lignes: hausse.slice(0, 10).map((x) => ligne(x, [pct(x.p2000), pct(x.p2024), pts(evo(x))])),
        },
        {
          titre: "Les dix plus fortes baisses",
          entetes: ["Pays", "Ratio 2000", "Ratio 2024", "Variation"],
          lignes: baisse.slice(0, 10).map((x) => ligne(x, [pct(x.p2000), pct(x.p2024), pts(evo(x))])),
          note: "Une baisse du ratio ne signifie pas toujours que la dette a diminué en montant : elle peut venir d'une économie qui a crû plus vite que sa dette, ou d'un effacement de créances.",
        },
      ],
      lecture: [
        {
          titre: "Trois chocs, un même sens",
          texte: [
            "Beaucoup de pays ont vu leur ratio grimper par à-coups plutôt que par une pente régulière : la crise financière de 2008 et ses plans de soutien, puis la pandémie de 2020 et ses dépenses d'urgence, ont fait monter les dettes presque partout. Les ratios qui ont reculé tiennent souvent à une croissance forte du PIB, à des restructurations ou à des périodes d'excédents.",
            `Les comparaisons de ratios entre deux dates dépendent du point de départ : un pays très endetté en 2000 a plus de marge pour baisser qu'un pays qui partait de bas. Les montants, eux, ont été multipliés dans presque tous les pays (jusqu'à ×${nf(gros[0], 0)} pour le plus marqué), en partie sous l'effet des prix.`,
          ],
        },
        { titre: "Lire avec prudence", texte: [NOTE_BASE] },
      ],
      faq: [
        { q: "Quel pays s'est le plus endetté depuis 2000 ?", r: `En points de PIB, ${le(hausse[0])} : son ratio est passé de ${pct(hausse[0].p2000)} en 2000 à ${pct(hausse[0].p2024)} en 2024 (${pts(evo(hausse[0]))}).` },
        { q: "Quel pays s'est le plus désendetté ?", r: `${Le(baisse[0])} : de ${pct(baisse[0].p2000)} à ${pct(baisse[0].p2024)} du PIB (${pts(evo(baisse[0]))}).` },
        { q: "Combien de pays ont réduit leur dette rapportée au PIB ?", r: `${moins} pays ont vu leur ratio reculer de plus de trois points entre 2000 et 2024, contre ${plus} pour lesquels il a augmenté d'autant.` },
      ],
    };
  },
};

const inflation: Analyse = {
  slug: "dette-et-inflation",
  titre: "Dette publique et inflation : les pays où les prix érodent la dette",
  h1: ["Dette et inflation :", "quand les prix rongent la dette"],
  accroche: "L'inflation allège la dette libellée en monnaie locale, mais le prix à payer est élevé.",
  famille: "classement",
  description: (d) => {
    const t = [...d].filter((x) => x.inflation2024 < 1e4).sort((a, b) => b.inflation2024 - a.inflation2024);
    return `Dette publique et inflation en 2024 : ${t[0].fr} (${pct(t[0].inflation2024)} d'inflation), ${t[1].fr} (${pct(t[1].inflation2024)})… Le lien entre prix et poids de la dette dans ${d.length} pays.`;
  },
  contenu: (d) => {
    const t = [...d].sort((a, b) => b.inflation2024 - a.inflation2024);
    const forte = d.filter((x) => x.inflation2024 >= 10);
    const med = mediane(d.map((x) => x.inflation2024));
    const calme = d.filter((x) => x.inflation2024 < 3).length;
    return {
      intro: `En 2024, ${forte.length} des ${d.length} pays de notre base connaissent une inflation d'au moins 10 % sur un an, alors que la médiane est de ${pct(med)}. ${Le(t[0])} atteint ${pct(t[0].inflation2024)}. Pour un État endetté en monnaie nationale, c'est une arme à double tranchant : la dette pèse moins lourd, mais emprunter coûte plus cher.`,
      chiffres: [
        { label: "Inflation la plus haute", valeur: pct(t[0].inflation2024), note: `${t[0].flag} ${t[0].fr}` },
        { label: "Inflation ≥ 10 %", valeur: `${forte.length} pays`, note: "sur un an, en 2024" },
        { label: "Médiane", valeur: pct(med), note: `${d.length} pays` },
        { label: "Inflation < 3 %", valeur: `${calme} pays`, note: "prix quasi stables" },
      ],
      tableaux: [
        {
          titre: "Les quinze pays où les prix montent le plus vite",
          entetes: ["Pays", "Inflation 2024", "Dette / PIB 2024", "Pic observé"],
          lignes: t.slice(0, 15).map((x) =>
            ligne(x, [pct(x.inflation2024), pct(x.p2024), `${x.inflationPic >= 1e6 ? `${nf(x.inflationPic / 1e6, 1)} M %` : pct(x.inflationPic)} (${x.inflationPicDate})`]),
          ),
          note: "Le pic est la plus haute inflation annuelle relevée dans la base ; il peut dater d'avant 2024.",
        },
      ],
      lecture: [
        {
          titre: "Comment l'inflation allège une dette",
          texte: [
            "Une dette est un chiffre fixé à l'avance. Si les prix et les revenus nominaux montent, ce chiffre pèse proportionnellement moins : c'est ce qui fait baisser le ratio dette/PIB dans les pays à forte inflation. Les épargnants qui détiennent cette dette, eux, voient la valeur réelle de leurs titres fondre.",
          ],
        },
        {
          titre: "Pourquoi ce n'est pas une bonne nouvelle",
          texte: [
            "Les créanciers anticipent l'inflation et la font payer par des taux plus élevés : un État qui renouvelle sa dette dans un pays où les prix s'envolent paie cher ses nouveaux emprunts. Quand la dette est libellée en devises étrangères, l'inflation ne l'allège pas du tout ; la dépréciation de la monnaie l'alourdit au contraire.",
            "Les pics d'inflation de 2022 ont aussi montré, dans des économies avancées, la même mécanique à plus petite échelle : le ratio de dette recule un peu, mais les taux remontent.",
          ],
        },
        { titre: "Lire avec prudence", texte: [NOTE_BASE] },
      ],
      faq: [
        { q: "L'inflation réduit-elle la dette publique ?", r: "Elle réduit sa valeur réelle quand elle est libellée en monnaie locale à taux fixe, et donc le ratio dette/PIB. Mais elle renchérit le coût des nouveaux emprunts, et n'a aucun effet allégeant sur une dette en devises étrangères." },
        { q: "Quel pays a la plus forte inflation en 2024 ?", r: `${Le(t[0])}, avec ${pct(t[0].inflation2024)} sur un an, d'après notre base.` },
        { q: "Pourquoi un pic d'inflation ne se retrouve-t-il pas dans le ratio de dette ?", r: "Parce que le ratio est un instantané annuel : il réagit à la fois au PIB nominal, qui monte avec les prix, et aux déficits, qui peuvent se creuser pendant la crise. Les deux effets se compensent en partie." },
      ],
    };
  },
};

/* ── Les analyses par ensemble de pays ─────────────────────────────────── */

interface Groupe {
  slug: string;
  nom: string;
  /** « la dette publique en Afrique » */
  sujet: string;
  titre: string;
  h1: [string, string];
  accroche: string;
  codes: string[];
  lecture: { titre: string; texte: string[] }[];
}

const GROUPES: Groupe[] = [
  {
    slug: "dette-publique-zone-euro",
    nom: "de la zone euro",
    sujet: "la dette publique dans la zone euro",
    titre: "Dette publique dans la zone euro : classement des pays en % du PIB",
    h1: ["La dette publique", "dans la zone euro"],
    accroche: "Dix-sept pays, une monnaie, des situations très différentes face au repère des 60 %.",
    codes: ["DE", "FR", "IT", "ES", "NL", "BE", "AT", "PT", "GR", "FI", "IE", "SK", "HR", "LT", "LV", "EE", "BG"],
    lecture: [
      {
        titre: "Le repère de Maastricht",
        texte: [
          "Le traité de Maastricht fixe deux repères aux États qui partagent la monnaie unique : un déficit public inférieur à 3 % du PIB et une dette inférieure à 60 % du PIB. Ces seuils ont été conçus avant l'euro et n'ont jamais été respectés par tous ; ils servent aujourd'hui de référence aux règles budgétaires européennes.",
        ],
      },
      {
        titre: "Une monnaie commune, des dettes nationales",
        texte: [
          "Dans la zone euro, chaque État emprunte pour son compte, dans une monnaie qu'il ne contrôle plus : il ne peut ni la dévaluer ni la créer. Les marchés comparent donc les pays entre eux, et l'écart de taux entre les plus et les moins endettés (la « prime de risque ») devient un thermomètre de confiance. La Banque centrale européenne en est l'arbitre : ses décisions pèsent sur tous les pays à la fois.",
        ],
      },
    ],
  },
  {
    slug: "dette-publique-afrique",
    nom: "de l'Afrique",
    sujet: "la dette publique en Afrique",
    titre: "Dette publique en Afrique : classement des pays en % du PIB",
    h1: ["La dette publique", "en Afrique"],
    accroche: "Vingt pays africains : poids de la dette, évolution depuis 2000 et inflation.",
    codes: ["DZ", "AO", "CM", "CI", "EG", "ET", "GH", "KE", "LY", "MA", "MZ", "NG", "TZ", "TN", "ZM", "ZW", "ZA", "SD", "UG", "RW"],
    lecture: [
      {
        titre: "Emprunter en devises : le nœud du sujet",
        texte: [
          "Une part importante de la dette de nombreux pays africains est libellée en dollars ou en euros. Quand la monnaie nationale se déprécie, la dette en devises pèse plus lourd en monnaie locale, sans que l'État ait emprunté un centime de plus. C'est l'une des raisons pour lesquelles le ratio dette/PIB, à lui seul, décrit mal la vulnérabilité d'un pays.",
        ],
      },
      {
        titre: "Des créanciers variés",
        texte: [
          "Les créanciers vont des marchés privés aux institutions multilatérales (FMI, Banque mondiale) et aux prêteurs bilatéraux, dont la Chine. Plusieurs pays du continent ont dû restructurer leur dette ces dernières années. Le dossier de chaque pays présente la répartition des créanciers telle que la publie notre base.",
        ],
      },
    ],
  },
  {
    slug: "dette-publique-amerique-latine",
    nom: "de l'Amérique latine",
    sujet: "la dette publique en Amérique latine",
    titre: "Dette publique en Amérique latine : classement des pays en % du PIB",
    h1: ["La dette publique", "en Amérique latine"],
    accroche: "Du Mexique à l'Argentine : des dettes qui portent la mémoire des crises de change.",
    codes: ["MX", "BR", "AR", "CL", "CO", "VE", "PE", "EC", "BO", "UY", "DO", "GT", "PA"],
    lecture: [
      {
        titre: "Une région marquée par les crises de la dette",
        texte: [
          "L'Amérique latine a connu plusieurs épisodes de défaut ou de restructuration, de la crise des années 1980 aux défauts argentins du début des années 2000 et de 2020. Cette histoire explique la vigilance des marchés et la place qu'y tiennent l'inflation et le taux de change dans le jugement porté sur la soutenabilité des dettes.",
        ],
      },
    ],
  },
  {
    slug: "dette-publique-asie-pacifique",
    nom: "de l'Asie-Pacifique",
    sujet: "la dette publique en Asie-Pacifique",
    titre: "Dette publique en Asie et dans le Pacifique : classement des pays en % du PIB",
    h1: ["La dette publique", "en Asie-Pacifique"],
    accroche: "Du Japon, champion mondial du ratio, à l'Asie du Sud-Est et à l'Océanie.",
    codes: ["CN", "IN", "JP", "KR", "ID", "PK", "VN", "MY", "TH", "PH", "BD", "SG", "AU", "NZ", "KZ", "UZ"],
    lecture: [
      {
        titre: "Des profils que tout oppose",
        texte: [
          "La région rassemble les situations les plus contrastées : le Japon, dont la dette est l'une des plus lourdes du monde et en grande partie détenue par ses résidents ; des économies émergentes qui empruntent surtout sur leur marché intérieur ; des pays à ratio modeste et à forte croissance. Le ratio brut ne suffit pas à les ranger sur une même échelle de risque.",
        ],
      },
    ],
  },
  {
    slug: "dette-publique-moyen-orient",
    nom: "du Moyen-Orient et de la Turquie",
    sujet: "la dette publique au Moyen-Orient et en Turquie",
    titre: "Dette publique au Moyen-Orient : classement des pays en % du PIB",
    h1: ["La dette publique", "au Moyen-Orient"],
    accroche: "Pays pétroliers, économies d'importation et Turquie : des dettes aux logiques opposées.",
    codes: ["SA", "AE", "QA", "JO", "IQ", "IR", "IL", "TR"],
    lecture: [
      {
        titre: "Le pétrole, ou son absence",
        texte: [
          "Dans les pays exportateurs d'hydrocarbures, les recettes de l'État suivent le prix du pétrole : la dette peut rester basse quand les cours sont élevés et grimper vite quand ils s'effondrent. Les pays qui n'ont pas cette ressource, eux, dépendent davantage des financements extérieurs et de l'aide.",
        ],
      },
    ],
  },
  {
    slug: "dette-publique-europe-hors-zone-euro",
    nom: "de l'Europe hors zone euro",
    sujet: "la dette publique en Europe hors zone euro",
    titre: "Dette publique en Europe hors zone euro : classement des pays en % du PIB",
    h1: ["La dette publique", "en Europe hors zone euro"],
    accroche: "Pays nordiques, Europe centrale, Balkans et Europe de l'Est : une mosaïque de situations.",
    codes: ["PL", "SE", "DK", "CZ", "HU", "RO", "RS", "BY", "UA", "CH", "NO"],
    lecture: [
      {
        titre: "Garder sa monnaie, garder une marge",
        texte: [
          "Les pays qui ont conservé leur monnaie nationale disposent d'un levier que les membres de la zone euro n'ont plus : un taux de change qui s'ajuste. Les pays nordiques et la Suisse affichent des dettes faibles, fruit de règles budgétaires strictes ; en Europe centrale et orientale, la dette est plus souvent libellée en devises, ce qui la rend sensible au taux de change.",
        ],
      },
    ],
  },
];

function groupe(g: Groupe): Analyse {
  const membres = (d: Dossier[]) => g.codes.map((c) => d.find((x) => x.iso2 === c)).filter((x): x is Dossier => Boolean(x));
  return {
    slug: g.slug,
    titre: g.titre,
    h1: g.h1,
    accroche: g.accroche,
    famille: "region",
    description: (d) => {
      const m = membres(d).sort((a, b) => b.p2024 - a.p2024);
      return `${cap(g.sujet)} en 2024 : ${m[0].fr} (${pct(m[0].p2024)} du PIB) en tête, ${m[m.length - 1].fr} (${pct(m[m.length - 1].p2024)}) en queue. ${m.length} pays, évolution depuis 2000 et montants.`;
    },
    contenu: (d, f) => {
      const m = membres(d).sort((a, b) => b.p2024 - a.p2024);
      const total = m.reduce((s, x) => s + x.d2024, 0);
      const med = mediane(m.map((x) => x.p2024));
      const sup100 = m.filter((x) => x.p2024 >= 100).length;
      const sup60 = m.filter((x) => x.p2024 >= 60).length;
      const haut = m[0];
      const bas = m[m.length - 1];
      const hausse = [...m].sort((a, b) => evo(b) - evo(a))[0];
      return {
        intro: `Les ${m.length} pays ${g.nom} présents dans notre base cumulent ${f.m(total, 2024)} de dette publique en 2024. Le ratio médian est de ${pct(med)} du PIB : ${le(haut)} est le pays le plus endetté (${pct(haut.p2024)}), ${le(bas)} le moins (${pct(bas.p2024)}). ${sup60} pays sur ${m.length} dépassent 60 % du PIB.`,
        chiffres: [
          { label: "Pays comparés", valeur: `${m.length}`, note: "dans notre base" },
          { label: "Dette cumulée", valeur: f.m(total, 2024), note: "en 2024" },
          { label: "Ratio médian", valeur: pct(med), note: "dette / PIB" },
          { label: "Plus de 100 % du PIB", valeur: `${sup100} pays`, note: `et ${sup60} au-dessus de 60 %` },
        ],
        tableaux: [
          {
            titre: `Tous les pays ${g.nom}, du plus au moins endetté`,
            entetes: ["Pays", "Dette / PIB 2024", "Montant 2024", "Depuis 2000"],
            lignes: m.map((x) => ligne(x, [pct(x.p2024), montant(f, x), pts(evo(x))])),
            note: `La plus forte hausse depuis 2000 : ${le(hausse)} (${pts(evo(hausse))}).`,
          },
        ],
        lecture: [...g.lecture, { titre: "Lire avec prudence", texte: [PRUDENCE, NOTE_BASE] }],
        faq: [
          { q: `Quel pays ${g.nom} est le plus endetté ?`, r: `D'après notre base, ${le(haut)} : ${pct(haut.p2024)} du PIB en 2024.` },
          { q: `Quel pays ${g.nom} est le moins endetté ?`, r: `${Le(bas)}, avec ${pct(bas.p2024)} du PIB en 2024.` },
          { q: `Quelle est la dette cumulée ${g.nom} ?`, r: `Environ ${f.m(total, 2024)} en 2024 pour les ${m.length} pays de la base.` },
          { q: `Combien de pays ${g.nom} dépassent 100 % du PIB ?`, r: sup100 === 0 ? "Aucun, d'après notre base." : `${sup100} sur ${m.length}.` },
        ],
      };
    },
  };
}

export const ANALYSES: Analyse[] = [plusEndettes, plusGrosses, parTete, depuis2000, inflation, ...GROUPES.map(groupe)];

export const analyseParSlug = (slug: string) => ANALYSES.find((a) => a.slug === slug);

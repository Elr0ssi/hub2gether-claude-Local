"use client";

import {
  deficit2025,
  detteDerniere,
  dureeVieMoyenne,
  eurosysteme,
  FAQ,
  nonResidents,
  ratioDernier,
  variationTrimestre,
} from "@/data/articles/detteFrancaise";
import { Compteur, Leve, Precision, Progression, Source } from "./pieces";
import {
  Administrations,
  Balance,
  Cascade,
  Comparaison,
  Consolidation,
  Courbe,
  Detenteurs,
  Echeances,
  Quiz,
  Tuyaux,
} from "./scenes";
import "./dette.css";

/* ═══════════════════════════════════════════════════════════════════════════
   DETTE PUBLIQUE FRANÇAISE — LE MODE LECTURE

   Deux lectures dans une seule page. Le premier écran suffit à repartir avec
   l'essentiel ; le reste explique le mécanisme, section par section, en
   alternant texte, chiffre, graphique et interaction.

   Chaque section s'ouvre par une réponse courte et factuelle — valeur, unité,
   période, périmètre, source — puis développe. C'est ce qui la rend citable
   sans avoir à interpréter un graphique.

   Tout le texte est présent dans le HTML rendu côté serveur : les composants
   ci-dessous ajoutent du mouvement, jamais de l'information.
   ═══════════════════════════════════════════════════════════════════════════ */

const nb = (v: number, d = 0) =>
  v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

export function DettePage() {
  const euros = Math.round(detteDerniere.valeur * 1e9);

  return (
    <div className="dp">
      <Progression />

      {/* Une barre minimale, propre à l'article : le nom ramène au prototype.
          On ne reprend pas l'en-tête du concept ici — il tient ses couleurs
          d'un conteneur que cette page n'a pas, et l'importer pour un lien
          coûterait une feuille de styles entière. */}
      <div className="dp-barre-h">
        <a href="/concept-globe" className="dp-retour">
          <span className="dp-retour-m" aria-hidden="true" />
          Visualize
        </a>
        <span className="dp-barre-h-r">Mode Lecture</span>
      </div>

      {/* ── Ouverture ───────────────────────────────────────────────────── */}
      <header className="dp-ouv">
        <div className="dp-wrap">
          <p className="dp-label">Économie · France</p>
          <h1 className="dp-h1">
            Dette publique française : comprendre les {nb(detteDerniere.valeur, 1)}{" "}milliards d&apos;euros de dette
          </h1>
          <p className="dp-accroche">
            La France doit {nb(detteDerniere.valeur, 1)}{" "}milliards d&apos;euros. Mais
            qu&apos;est-ce que cela veut vraiment dire ?
          </p>
          <p className="dp-chapo">
            La dette publique française représente aujourd&apos;hui {nb(ratioDernier.valeur, 1)} %
            du PIB. Derrière ce chiffre se cachent des déficits accumulés, des millions de titres
            financiers, des investisseurs français et étrangers et des dizaines de milliards
            d&apos;euros d&apos;intérêts. En cinq minutes, on démonte tout le mécanisme.
          </p>
          <Source c={detteDerniere} className="dp-src-ouv" />
          <a className="dp-vers" href="#trente-secondes">
            Comprendre en 30 secondes
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </header>

      {/* ── 01 · Trente secondes ────────────────────────────────────────── */}
      <section id="trente-secondes" className="dp-sect dp-sect-vide">
        <div className="dp-wrap">
          <p className="dp-num">01 — La dette française en 30 secondes</p>

          <Leve className="dp-geant">
            <p className="dp-geant-v">
              <Compteur valeur={euros} /> €
            </p>
            <p className="dp-geant-s">
              soit <b>{nb(detteDerniere.valeur, 1)} Md€</b>
            </p>
          </Leve>

          <Leve tag="p" className="dp-phrase" delai={120}>
            C&apos;est la dette publique française à la fin du premier trimestre 2026.
          </Leve>

          <Leve className="dp-ratio" delai={180}>
            <p className="dp-ratio-v">{nb(ratioDernier.valeur, 1)} % du PIB</p>
            <p className="dp-ratio-t">
              Autrement dit, la dette publique représente environ {nb(ratioDernier.valeur / 100, 2)}{" "}
              fois la richesse produite en France en une année.
            </p>
            <p className="dp-garde">
              Ce n&apos;est pas « une année de PIB à rembourser » : le PIB est un flux annuel de
              production, pas une somme disponible.
            </p>
          </Leve>

          <div className="dp-cartes">
            {[
              {
                v: `${nb(detteDerniere.valeur, 1)} Md€`,
                l: "de dette publique",
                t: "C'est le stock de dette accumulé par l'ensemble des administrations publiques.",
                c: detteDerniere,
              },
              {
                v: `${nb(ratioDernier.valeur, 1)} %`,
                l: "du PIB",
                t: "C'est le ratio utilisé pour comparer la taille de la dette à celle de l'économie.",
                c: ratioDernier,
              },
              {
                v: `+${nb(variationTrimestre.valeur, 1)} Md€`,
                l: "en trois mois",
                t: `Entre fin 2025 et la fin du premier trimestre 2026, la dette publique a augmenté de ${nb(variationTrimestre.valeur, 1)} milliards d'euros.`,
                c: variationTrimestre,
              },
              {
                v: `${nb(deficit2025.valeur, 1)} %`,
                l: "de déficit public en 2025",
                t: "En 2025, les administrations publiques françaises ont encore dépensé davantage qu'elles n'ont reçu de recettes.",
                c: deficit2025,
              },
            ].map((k, i) => (
              <Leve key={k.l} tag="figure" className="dp-carte" delai={i * 80}>
                <p className="dp-carte-v">{k.v}</p>
                <p className="dp-carte-l">{k.l}</p>
                <p className="dp-carte-t">{k.t}</p>
                <Source c={k.c} />
              </Leve>
            ))}
          </div>

          <Leve className="dp-cle">
            <p>
              La dette est le <b>stock</b>.
              <br />
              Le déficit est ce qui l&apos;<b>alimente</b>.
            </p>
          </Leve>

          <p className="dp-vers-t">↓ Maintenant, décortiquons ces {nb(detteDerniere.valeur, 1)}{" "}milliards.</p>
        </div>
      </section>

      {/* ── 02 · Origine ────────────────────────────────────────────────── */}
      <section id="origine" className="dp-sect">
        <div className="dp-wrap">
          <p className="dp-num">02 — Comment a-t-on créé {nb(detteDerniere.valeur, 1)}{" "}milliards de dette ?</p>
          <h2 className="dp-h2">Tout commence par une différence.</h2>
          <p className="dp-reponse">
            Lorsqu&apos;au cours d&apos;une année les administrations publiques dépensent davantage
            qu&apos;elles ne perçoivent de recettes, elles enregistrent un déficit. Ce déficit crée
            un besoin de financement, et des déficits répétés contribuent à accumuler de la dette.
          </p>

          <Balance />

          <div className="dp-duo">
            <div className="dp-duo-t">
              <h3>Un exemple volontairement simple</h3>
              <p>
                Recettes : 100. Dépenses : 105. Déficit : 5. Les cinq manquants doivent être
                financés — et c&apos;est ce financement qui devient de la dette.
              </p>
              <p className="dp-note">Exemple pédagogique simplifié.</p>
            </div>
            <Cascade />
          </div>

          <Courbe />

          <Leve tag="p" className="dp-texte">
            La dette française n&apos;est donc pas apparue soudainement. Elle est le résultat
            d&apos;une accumulation dans le temps. Les crises économiques peuvent accélérer
            brutalement cette trajectoire : les recettes ralentissent alors que certaines dépenses
            augmentent. Mais l&apos;évolution de long terme dépend également des déficits
            récurrents, de la croissance de l&apos;économie, de l&apos;inflation, des taux
            d&apos;intérêt et de différentes opérations financières.
          </Leve>

          <div className="dp-duo">
            <div className="dp-duo-t">
              <h3>Pourquoi regarder les deux unités ?</h3>
              <p>
                Parce que {nb(detteDerniere.valeur, 0)}{" "}milliards d&apos;euros de dette ne
                signifient pas la même chose pour une économie produisant 1 000 milliards ou 3 000
                milliards par an. Le ratio dette/PIB rapporte la dette à la taille de
                l&apos;économie : il permet de comparer différentes périodes et différents pays.
              </p>
            </div>
            <div className="dp-ratios">
              <div className="dp-ratios-c">
                <p>
                  <span>Dette</span> <b>+</b>
                </p>
                <p>
                  <span>PIB</span> <b className="dp-plus">+++</b>
                </p>
                <p className="dp-ratios-r">→ le ratio peut baisser</p>
              </div>
              <div className="dp-ratios-c">
                <p>
                  <span>Dette</span> <b className="dp-plus">+++</b>
                </p>
                <p>
                  <span>PIB</span> <b>+</b>
                </p>
                <p className="dp-ratios-r dp-ratios-h">→ le ratio peut augmenter</p>
              </div>
            </div>
          </div>

          <Leve tag="p" className="dp-texte dp-texte-fort">
            C&apos;est un point essentiel : la dette peut augmenter en euros tout en diminuant en
            pourcentage du PIB si l&apos;économie nominale progresse plus rapidement.
          </Leve>

          <p className="dp-vers-t">
            ↓ Mais quand on dit « la France est endettée », qui est réellement endetté ?
          </p>
        </div>
      </section>

      {/* ── 03 · Qui doit ───────────────────────────────────────────────── */}
      <section id="qui-doit" className="dp-sect">
        <div className="dp-wrap">
          <p className="dp-num">03 — Qui doit les {nb(detteDerniere.valeur, 1)}{" "}milliards ?</p>
          <h2 className="dp-h2">Ce n&apos;est pas seulement la dette du gouvernement.</h2>
          <p className="dp-reponse">
            Le chiffre de {nb(detteDerniere.valeur, 1)}{" "}milliards correspond à la dette publique au
            sens de Maastricht : celle de l&apos;ensemble des administrations publiques françaises,
            après consolidation des dettes qu&apos;elles peuvent avoir entre elles.
          </p>
          <Administrations />

          <div className="dp-duo">
            <div className="dp-duo-t">
              <h3>La consolidation, en une image</h3>
              <p>
                Lorsqu&apos;une administration publique détient la dette d&apos;une autre
                administration publique, cette dette interne est neutralisée dans le calcul de
                Maastricht.
              </p>
            </div>
            <Consolidation />
          </div>

          <p className="dp-vers-t">↓ D&apos;accord. Mais à qui doivent-ils cet argent ?</p>
        </div>
      </section>

      {/* ── 04 · Détenteurs ─────────────────────────────────────────────── */}
      <section id="detenteurs" className="dp-sect dp-sect-nuit">
        <div className="dp-wrap">
          <p className="dp-num">04 — Qui possède la dette française ?</p>
          <h2 className="dp-h2">
            Qui a réellement prêté {nb(detteDerniere.valeur, 1)}{" "}milliards à la France ?
          </h2>
          <ul className="dp-mots">
            {["Banques", "Assurances", "Épargnants", "Fonds", "Banque centrale", "Investisseurs étrangers"].map(
              (m, i) => (
                <li key={m} style={{ "--i": i } as React.CSSProperties}>
                  {m} ?
                </li>
              ),
            )}
          </ul>
          <p className="dp-cle-p">Un peu de tout cela.</p>

          <p className="dp-reponse">
            Pour financer ses besoins, l&apos;État français émet principalement des titres
            financiers. Les plus connus sont les OAT — obligations assimilables du Trésor — pour le
            moyen et le long terme, et les BTF pour le court terme.
          </p>

          <div className="dp-duo">
            <div className="dp-duo-t">
              <h3>Imaginez une obligation de 1 000 €</h3>
              <p>
                Un investisseur prête 1 000 € à l&apos;État en achetant une obligation. En échange,
                l&apos;État s&apos;engage à verser les intérêts prévus par le titre puis à
                rembourser le capital à l&apos;échéance.
              </p>
              <p className="dp-note">Exemple pédagogique simplifié.</p>
            </div>
            <ol className="dp-flux">
              {[
                ["État français", "émet une obligation"],
                ["Investisseur", "verse 1 000 €"],
                ["État français", "verse les intérêts"],
                ["À l'échéance", "rembourse le capital"],
              ].map(([a, b], i) => (
                <li key={a + b} style={{ "--i": i } as React.CSSProperties}>
                  <b>{a}</b>
                  <span>{b}</span>
                </li>
              ))}
            </ol>
          </div>

          <Leve className="dp-geant dp-geant-p">
            <p className="dp-geant-v">
              <Compteur valeur={nonResidents.valeur} decimales={1} duree={1200} /> %
            </p>
            <p className="dp-geant-s">
              Au 31 mars 2026, les non-résidents détenaient {nb(nonResidents.valeur, 1)} % des
              titres de dette de long terme émis par les administrations publiques françaises.
            </p>
          </Leve>
          <Precision c={nonResidents} />

          <p className="dp-garde">
            Les statistiques disponibles ne permettent pas de dire simplement que « X % des{" "}
            {nb(detteDerniere.valeur, 1)}{" "}milliards appartiennent à l&apos;étranger » : les sources
            mesurent différents périmètres de titres et de dette. Ce pourcentage ne doit pas être
            appliqué mécaniquement à la dette de Maastricht.
          </p>

          <Detenteurs />

          <Leve className="dp-encart">
            <p>
              Les portefeuilles de dette publique détenus par la Banque de France dans le cadre des
              programmes APP et PEPP représentaient encore {eurosysteme.actuel.valeur}{" "}milliards
              d&apos;euros en coût amorti {eurosysteme.actuel.periode}, contre{" "}
              {eurosysteme.precedent.valeur}{" "}milliards {eurosysteme.precedent.periode}. Cette baisse
              provient de titres arrivant à échéance, les réinvestissements de ces programmes ayant
              cessé.
            </p>
            <Source c={eurosysteme.actuel} />
          </Leve>

          <div className="dp-duo">
            <div className="dp-duo-t">
              <h3>Pourquoi des investisseurs continuent-ils de prêter à la France ?</h3>
              <p>
                Parce qu&apos;une obligation d&apos;État est aussi un actif financier.
                L&apos;investisseur ne voit pas seulement « la dette de la France » : il voit un
                titre qui possède une échéance, un rendement, une liquidité et un risque.
              </p>
            </div>
          </div>

          <p className="dp-vers-t">↓ Et ce prêt n&apos;est évidemment pas gratuit.</p>
        </div>
      </section>

      {/* ── 05 · Coût ───────────────────────────────────────────────────── */}
      <section id="cout" className="dp-sect">
        <div className="dp-wrap">
          <p className="dp-num">05 — Combien la dette coûte-t-elle ?</p>
          <Leve className="dp-egal">
            <p className="dp-egal-a">
              Dette
              <b>{nb(detteDerniere.valeur, 1)} Md€</b>
            </p>
            <p className="dp-egal-s" aria-hidden="true">
              ≠
            </p>
            <p className="dp-egal-a">
              Coût annuel
              <b>ce n&apos;est pas la même chose</b>
            </p>
          </Leve>
          <p className="dp-reponse">
            Le stock de dette et son coût annuel sont deux choses différentes. Ce qui pèse chaque
            année sur le budget, ce sont notamment les intérêts associés aux titres en circulation.
          </p>

          <div className="dp-duo">
            <div className="dp-duo-t">
              <h3>Pourquoi les taux mettent du temps à se voir</h3>
              <p>
                Une hausse des taux ne renchérit pas instantanément les {nb(detteDerniere.valeur, 1)}{" "}milliards d&apos;euros. Les titres existants conservent leurs conditions.
                L&apos;effet se diffuse progressivement lorsque de nouveaux titres sont émis et
                lorsque d&apos;anciens titres arrivant à échéance doivent être refinancés.
              </p>
            </div>
            <ol className="dp-flux dp-flux-taux">
              <li style={{ "--i": 0 } as React.CSSProperties}>
                <b>Ancienne obligation</b>
                <span>1 %</span>
              </li>
              <li style={{ "--i": 1 } as React.CSSProperties}>
                <b>Arrive à échéance</b>
                <span>elle est remboursée</span>
              </li>
              <li style={{ "--i": 2 } as React.CSSProperties}>
                <b>Nouvelle obligation</b>
                <span>3 %</span>
              </li>
              <li style={{ "--i": 3 } as React.CSSProperties} className="dp-flux-f">
                <b>Coût de financement supérieur</b>
                <span>sur cette part seulement</span>
              </li>
            </ol>
          </div>

          <Leve className="dp-encart">
            <p className="dp-encart-v">{dureeVieMoyenne.ordre}</p>
            <p>
              C&apos;est l&apos;ordre de grandeur de la {dureeVieMoyenne.perimetre} en{" "}
              {dureeVieMoyenne.periode}. Plus des taux élevés persistent, plus ils peuvent
              progressivement se diffuser dans le coût moyen de financement : chaque année, une
              partie seulement du stock est refinancée.
            </p>
            <p className="dp-note">{dureeVieMoyenne.reserve}</p>
            <Source c={dureeVieMoyenne} />
          </Leve>

          <div className="dp-split">
            <div className="dp-split-c">
              <h3>L&apos;inflation peut réduire le ratio dette/PIB</h3>
              <p>
                Une hausse des prix contribue à augmenter le PIB nominal. Toutes choses égales par
                ailleurs, cela peut réduire le poids d&apos;une dette donnée relativement au PIB.
              </p>
            </div>
            <div className="dp-split-c">
              <h3>Mais elle peut aussi augmenter certains coûts</h3>
              <p>
                Une partie de la dette de l&apos;État est constituée d&apos;obligations indexées sur
                l&apos;inflation. Lorsque l&apos;inflation augmente, leur coût peut donc augmenter.
              </p>
            </div>
          </div>

          <p className="dp-manque">
            La série de la charge de la dette de l&apos;État n&apos;est pas encore dans notre base :
            elle n&apos;est donc pas représentée ici plutôt que d&apos;être approchée. Elle se lit
            dans les documents budgétaires et chez l&apos;Agence France Trésor.
          </p>

          <p className="dp-vers-t">
            ↓ Alors comment rembourse-t-on {nb(detteDerniere.valeur, 1)}{" "}milliards ?
          </p>
        </div>
      </section>

      {/* ── 06 · Remboursement ──────────────────────────────────────────── */}
      <section id="remboursement" className="dp-sect dp-sect-nuit">
        <div className="dp-wrap">
          <p className="dp-num">06 — La France va-t-elle devoir rembourser {nb(detteDerniere.valeur, 1)}{" "}milliards ?</p>
          <h2 className="dp-h2">Non. Pas en une seule fois.</h2>
          <p className="dp-reponse">
            La dette publique n&apos;est pas un prêt géant possédant une date unique de
            remboursement. Lorsqu&apos;une obligation arrive à échéance, son capital doit être
            remboursé ; mais l&apos;État émet régulièrement de nouveaux titres pour couvrir ses
            besoins de financement, qui comprennent notamment le déficit et le refinancement de
            titres arrivant à échéance.
          </p>

          <div className="dp-duo dp-duo-large">
            <div className="dp-duo-t">
              <h3>Chaque obligation a sa propre échéance</h3>
              <p>
                Une partie de la dette est remboursée cette année, une autre dans dix ans, une
                autre dans vingt-cinq. Le stock ne disparaît pas d&apos;un coup : il se renouvelle.
              </p>
            </div>
            <Echeances />
          </div>

          <Leve className="dp-cle">
            <p>
              Emprunter 300 milliards ne signifie pas créer 300 milliards de dette supplémentaire.
            </p>
          </Leve>
          <p className="dp-texte">
            Une partie importante des émissions annuelles sert à remplacer des titres arrivant à
            échéance. Il faut donc distinguer les émissions brutes, les remboursements et
            l&apos;augmentation nette de la dette.
          </p>

          <Tuyaux />

          <p className="dp-vers-t">
            ↓ Si la dette peut être refinancée, pourquoi son niveau est-il important ?
          </p>
        </div>
      </section>

      {/* ── 07 · Avenir ─────────────────────────────────────────────────── */}
      <section id="avenir" className="dp-sect">
        <div className="dp-wrap">
          <p className="dp-num">07 — Ce que {nb(detteDerniere.valeur, 1)}{" "}milliards changent réellement</p>
          <h2 className="dp-h2">
            Une dette publique n&apos;est ni gratuite, ni automatiquement catastrophique.
          </h2>
          <p className="dp-reponse">
            Le chiffre brut ne suffit pas à déterminer si une dette est soutenable. Ce qui compte
            est la capacité d&apos;un État à continuer de financer ses dépenses, payer ses intérêts
            et refinancer sa dette dans la durée.
          </p>

          <ol className="dp-quatre">
            {[
              ["Le niveau de dette", "Plus le stock est important relativement à l'économie, plus les variations du coût de financement peuvent avoir des conséquences budgétaires importantes."],
              ["Le coût", "Une dette importante financée à des taux faibles n'a pas le même coût qu'une dette identique financée à des taux beaucoup plus élevés."],
              ["La croissance", "La taille future de l'économie compte. Une économie qui progresse augmente la base de revenus et de production à laquelle la dette est comparée."],
              ["Le solde public", "Des déficits persistants nécessitent de nouveaux financements et peuvent continuer à augmenter le stock de dette."],
            ].map(([t, d], i) => (
              <Leve key={t} tag="li" delai={i * 70}>
                <span className="dp-quatre-n">0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </Leve>
            ))}
          </ol>

          <div className="dp-duo">
            <div className="dp-duo-t">
              <h3>Est-ce une dette laissée aux générations futures ?</h3>
              <p>
                Oui, mais cette phrase est incomplète. Les générations futures héritent d&apos;un
                stock de dette et des engagements financiers qui l&apos;accompagnent. Une charge
                d&apos;intérêt élevée peut réduire la marge disponible pour d&apos;autres dépenses
                ou nécessiter davantage de recettes.
              </p>
              <p>
                Mais elles héritent également de l&apos;économie, des infrastructures et des actifs
                publics qui existent à ce moment-là. Deux dettes de même montant peuvent donc avoir
                des implications très différentes selon ce qui a été financé, l&apos;état de
                l&apos;économie, le niveau des taux et les finances publiques futures.
              </p>
            </div>
          </div>

          <Leve className="dp-cle">
            <p>
              La vraie question n&apos;est donc pas « quand remboursera-t-on{" "}
              {nb(detteDerniere.valeur, 1)}{" "}milliards ? », mais « la France pourra-t-elle continuer
              à financer durablement cette dette ? ». C&apos;est ce que l&apos;on appelle la
              soutenabilité de la dette.
            </p>
          </Leve>

          <ul className="dp-indics">
            {["Dette / PIB", "Déficit / PIB", "Charge d'intérêts", "Croissance et coût de financement"].map(
              (t, i) => (
                <li key={t} style={{ "--i": i } as React.CSSProperties}>
                  {t}
                </li>
              ),
            )}
          </ul>
          <p className="dp-note dp-note-c">
            Cet article ne dit pas si ce niveau est tenable ou non : il donne les éléments qui
            permettent de suivre le débat.
          </p>
        </div>
      </section>

      {/* ── Comparaison européenne ──────────────────────────────────────── */}
      <section className="dp-sect dp-sect-nuit">
        <div className="dp-wrap">
          <h2 className="dp-h2">{nb(ratioDernier.valeur, 1)} %. Est-ce beaucoup ?</h2>
          <p className="dp-reponse">
            Un ratio n&apos;a de sens que lorsqu&apos;on possède un point de comparaison. Fin 2025,
            la France faisait partie des cinq pays de l&apos;Union européenne dont la dette publique
            dépassait 100 % du PIB.
          </p>
          <p className="dp-garde">
            La comparaison porte sur une même période pour tout le monde — fin 2025 — afin de ne pas
            mêler le premier trimestre 2026 français aux données 2025 des autres pays.
          </p>
          <Comparaison />
          <p className="dp-texte">
            Cette comparaison ne suffit pas à elle seule à mesurer la situation financière d&apos;un
            pays. La croissance, les taux d&apos;intérêt, les échéances de dette, les recettes
            publiques et la confiance des investisseurs comptent également.
          </p>
        </div>
      </section>

      {/* ── Conclusion ──────────────────────────────────────────────────── */}
      <section className="dp-sect dp-fin">
        <div className="dp-wrap">
          <ol className="dp-chaine">
            {[
              [`${nb(detteDerniere.valeur, 1)} Md€`, "C'est le stock de dette publique."],
              [`${nb(ratioDernier.valeur, 1)} % du PIB`, "C'est sa taille relativement à l'économie."],
              ["Déficits", "Ils contribuent à créer de nouveaux besoins de financement."],
              ["Obligations", "Elles permettent notamment à l'État d'emprunter."],
              ["Investisseurs", "Français et étrangers achètent ces titres."],
              ["Intérêts", "Emprunter a un coût."],
              ["Échéances", "Les obligations sont remboursées progressivement."],
              ["Refinancement", "De nouveaux titres peuvent remplacer ceux qui arrivent à échéance."],
              ["Soutenabilité", "La question centrale est la capacité à continuer de financer la dette dans le temps."],
            ].map(([t, d], i) => (
              <Leve key={t} tag="li" delai={i * 50}>
                <b>{t}</b>
                <span>{d}</span>
              </Leve>
            ))}
          </ol>
          <Leve className="dp-final">
            <p className="dp-final-t">
              Vous venez de décortiquer {nb(detteDerniere.valeur, 1)}{" "}milliards d&apos;euros.
            </p>
            <p className="dp-final-s">Dette publique française · Visualize</p>
          </Leve>
        </div>
      </section>

      {/* ── Est-ce que j'ai compris ? ───────────────────────────────────── */}
      <section className="dp-sect">
        <div className="dp-wrap">
          <h2 className="dp-h2">Est-ce que j&apos;ai compris ?</h2>
          <Quiz />
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section id="questions" className="dp-sect dp-sect-nuit">
        <div className="dp-wrap">
          <h2 className="dp-h2">Questions fréquentes</h2>
          <dl className="dp-faq">
            {FAQ.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.r}</dd>
              </div>
            ))}
          </dl>
          <p className="dp-note">
            Sources : INSEE (dette trimestrielle de Maastricht, comptes nationaux), Banque de France
            (émission et détention de titres français), Agence France Trésor (dette négociable),
            Eurostat (comparaison européenne).
          </p>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   « EN VOIR PLUS SUR LE SUJET »

   À la place d'un menu général, chaque article propose, dans sa colonne de
   droite, le globe qui prolonge son thème et les fils du forum qui en
   débattent. Ce n'est pas automatique : on le règle article par article, ici,
   en ajoutant une entrée à `SUJETS`.

   - `globe`  : la page-globe qui prolonge l'article (économie, démographie).
   - `forum`  : un ou plusieurs fils. L'adresse est `/forum#<id du fil>`, où
                l'id est celui de `src/data/community/fils.ts` — la page du
                forum ouvre alors directement ce fil.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Sujet {
  globe: { label: string; href: string; theme: "economie" | "demographie" };
  forum: { titre: string; fil: string }[];
}

export const SUJETS: Record<string, Sujet> = {
  "dette-publique-france": {
    globe: { label: "Globe économie", href: "/economie", theme: "economie" },
    forum: [
      { titre: "La dette française à 113 % du PIB : on fait quoi ?", fil: "dette-france" },
      { titre: "Chine et États-Unis : la rivalité se joue-t-elle encore sur le PIB ?", fil: "chine-usa" },
    ],
  },
};

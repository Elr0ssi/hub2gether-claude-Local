/** L'adresse publique du site. À l'achat du nom de domaine, il suffit de
    renseigner NEXT_PUBLIC_SITE_URL : toutes les adresses canoniques, les
    cartes de partage et le plan du site la reprennent. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com").replace(/\/$/, "");
export const NOM_SITE = "Visualize";
export const urlAbs = (chemin: string) => `${SITE_URL}${chemin.startsWith("/") ? chemin : `/${chemin}`}`;

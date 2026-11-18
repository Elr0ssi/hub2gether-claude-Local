"use server";

import { revalidatePath } from "next/cache";
import { clientServeur } from "@/lib/supabase/serveur";
import type { ElementCarnet } from "@/lib/carnet";

/* Le carnet d'apprentissage, côté compte. Chaque action dit si l'élément est bien dans le compte ; sinon il reste dans le
   navigateur (pas de compte, pas connecté, ou table pas encore créée), et rien n'est perdu. */

export interface RetourCarnet {
  ok: boolean;
  raison?: "hors-connexion" | "indisponible";
}

const propre = (s: string | null | undefined, max: number) => (s ? String(s).slice(0, max) : null);

export async function envoyerAuCarnet(e: ElementCarnet): Promise<RetourCarnet> {
  const sb = await clientServeur();
  if (!sb) return { ok: false, raison: "indisponible" };
  const { data: compte } = await sb.auth.getUser();
  if (!compte.user) return { ok: false, raison: "hors-connexion" };
  if (e.type !== "traduction" && e.type !== "passage") return { ok: false, raison: "indisponible" };
  const { error } = await sb.from("carnet").upsert({
    id: e.id,
    profil_id: compte.user.id,
    type: e.type,
    texte: propre(e.texte, 2000),
    traduction: propre(e.traduction, 2000),
    langue: propre(e.langue, 8) ?? "en",
    source_titre: propre(e.source_titre, 300),
    source_url: propre(e.source_url, 500),
    niveau: Math.max(0, Math.min(6, Math.round(e.niveau))),
    prochaine_revision: e.prochaine_revision,
    cree_le: e.cree_le,
  });
  if (error) return { ok: false, raison: "indisponible" };
  revalidatePath("/compte");
  return { ok: true };
}

export async function retirerDuCarnet(id: string): Promise<RetourCarnet> {
  const sb = await clientServeur();
  if (!sb) return { ok: false, raison: "indisponible" };
  const { data: compte } = await sb.auth.getUser();
  if (!compte.user) return { ok: false, raison: "hors-connexion" };
  const { error } = await sb.from("carnet").delete().eq("id", id).eq("profil_id", compte.user.id);
  if (error) return { ok: false, raison: "indisponible" };
  revalidatePath("/compte");
  return { ok: true };
}

/** Le carnet du compte connecté ; vide si pas de compte ou si la table n'existe pas encore. */
export async function lireCarnetCompte(): Promise<ElementCarnet[]> {
  const sb = await clientServeur();
  if (!sb) return [];
  const { data: compte } = await sb.auth.getUser();
  if (!compte.user) return [];
  const { data, error } = await sb
    .from("carnet")
    .select("id, type, texte, traduction, langue, source_titre, source_url, niveau, prochaine_revision, cree_le")
    .eq("profil_id", compte.user.id)
    .order("cree_le", { ascending: false })
    .limit(1000);
  if (error || !data) return [];
  return data as ElementCarnet[];
}

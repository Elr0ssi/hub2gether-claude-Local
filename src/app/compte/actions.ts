"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { clientServeur } from "@/lib/supabase/serveur";
import { WIDGETS_POSSIBLES } from "@/data/concept/tempsReel";

/* ═══════════════════════════════════════════════════════════════════════════
   LES ACTIONS DE COMPTE

   Tout passe par le serveur : le mot de passe ne traverse jamais de code
   client, et la session repart en cookie « httpOnly », hors de portée du
   JavaScript de la page.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Retour {
  erreur?: string;
  message?: string;
}

const PSEUDO_OK = /^[a-zA-Z0-9_-]{3,24}$/;

function lisible(brut: string): string {
  const m = brut.toLowerCase();
  if (m.includes("invalid login credentials")) return "Adresse ou mot de passe incorrect.";
  if (m.includes("user already registered")) return "Un compte existe déjà avec cette adresse.";
  if (m.includes("password should be")) return "Le mot de passe doit faire au moins 8 caractères.";
  if (m.includes("email rate limit") || m.includes("rate limit")) {
    return "Trop de tentatives. Réessayez dans quelques minutes.";
  }
  if (m.includes("email not confirmed")) {
    return "Cette adresse n'est pas encore confirmée. Regardez vos courriels.";
  }
  return brut;
}

export async function inscrire(_precedent: Retour, donnees: FormData): Promise<Retour> {
  const sb = await clientServeur();
  if (!sb) return { erreur: "Les comptes ne sont pas encore branchés sur ce site." };

  const email = String(donnees.get("email") ?? "").trim();
  const motDePasse = String(donnees.get("motDePasse") ?? "");
  const pseudo = String(donnees.get("pseudo") ?? "").trim();

  if (!PSEUDO_OK.test(pseudo)) {
    return { erreur: "Le pseudo fait de 3 à 24 caractères : lettres, chiffres, tiret, souligné." };
  }
  if (motDePasse.length < 8) return { erreur: "Le mot de passe doit faire au moins 8 caractères." };

  /* On regarde si le pseudo est libre avant de créer le compte : sinon la
     base en attribuerait un numéroté, ce que personne n'a demandé. */
  const { data: pris } = await sb.from("profils").select("id").ilike("pseudo", pseudo).maybeSingle();
  if (pris) return { erreur: "Ce pseudo est déjà pris." };

  const { data, error } = await sb.auth.signUp({
    email,
    password: motDePasse,
    options: { data: { pseudo } },
  });
  if (error) return { erreur: lisible(error.message) };

  /* Session absente : le projet demande une confirmation par courriel. On
     tente quand même la connexion, car un projet qui ne la demande pas
     renvoie parfois l'inscription sans session ; si elle est refusée, on dit
     laquelle des deux raisons s'applique plutôt que d'inviter à une
     connexion qui échouera. */
  if (!data.session) {
    const { error: souci } = await sb.auth.signInWithPassword({ email, password: motDePasse });
    if (souci) return { message: lisible(souci.message) };
  }
  redirect("/compte");
}

export async function connecter(_precedent: Retour, donnees: FormData): Promise<Retour> {
  const sb = await clientServeur();
  if (!sb) return { erreur: "Les comptes ne sont pas encore branchés sur ce site." };

  const { error } = await sb.auth.signInWithPassword({
    email: String(donnees.get("email") ?? "").trim(),
    password: String(donnees.get("motDePasse") ?? ""),
  });
  if (error) return { erreur: lisible(error.message) };
  redirect("/compte");
}

export async function deconnecter() {
  const sb = await clientServeur();
  if (sb) await sb.auth.signOut();
  redirect("/compte/connexion");
}

export async function majProfil(_precedent: Retour, donnees: FormData): Promise<Retour> {
  const sb = await clientServeur();
  if (!sb) return { erreur: "Les comptes ne sont pas encore branchés sur ce site." };

  const { data: compte } = await sb.auth.getUser();
  if (!compte.user) return { erreur: "Vous n'êtes plus connecté." };

  const pseudo = String(donnees.get("pseudo") ?? "").trim();
  const bio = String(donnees.get("bio") ?? "").trim();
  if (!PSEUDO_OK.test(pseudo)) {
    return { erreur: "Le pseudo fait de 3 à 24 caractères : lettres, chiffres, tiret, souligné." };
  }
  if (bio.length > 280) return { erreur: "La présentation dépasse 280 caractères." };

  const { error } = await sb
    .from("profils")
    .update({ pseudo, bio: bio || null })
    .eq("id", compte.user.id);

  if (error) {
    if (error.code === "23505") return { erreur: "Ce pseudo est déjà pris." };
    return { erreur: error.message };
  }
  revalidatePath("/compte");
  return { message: "Profil enregistré." };
}

/* ═══════════════════════════════════════════════════════════════════════════
   LES ARTICLES ENREGISTRÉS ET LE TABLEAU DE BORD
   ═══════════════════════════════════════════════════════════════════════════ */

const MAX_WIDGETS = 4;

/** Enregistre un article, ou le retire s'il l'était déjà. */
export async function basculerFavori(slug: string): Promise<Retour> {
  const sb = await clientServeur();
  if (!sb) return { erreur: "Les comptes ne sont pas encore branchés sur ce site." };

  const { data: compte } = await sb.auth.getUser();
  if (!compte.user) return { erreur: "Connectez-vous pour enregistrer un article." };

  const { data: existe } = await sb
    .from("favoris")
    .select("id")
    .eq("profil_id", compte.user.id)
    .eq("article", slug)
    .maybeSingle();

  if (existe) {
    const { error } = await sb.from("favoris").delete().eq("id", existe.id);
    if (error) return { erreur: error.message };
  } else {
    const { error } = await sb.from("favoris").insert({ profil_id: compte.user.id, article: slug });
    if (error) return { erreur: error.message };
  }
  revalidatePath("/compte");
  revalidatePath(`/lecture/${slug}`);
  return {};
}

/** Remplace la liste des compteurs affichés dans le tableau de bord. */
export async function majWidgets(_precedent: Retour, donnees: FormData): Promise<Retour> {
  const sb = await clientServeur();
  if (!sb) return { erreur: "Les comptes ne sont pas encore branchés sur ce site." };

  const { data: compte } = await sb.auth.getUser();
  if (!compte.user) return { erreur: "Vous n'êtes plus connecté." };

  const choisis = donnees
    .getAll("widget")
    .map(String)
    .filter((id): id is string => (WIDGETS_POSSIBLES as readonly string[]).includes(id))
    .slice(0, MAX_WIDGETS);

  const { error } = await sb.from("profils").update({ widgets: choisis }).eq("id", compte.user.id);
  if (error) return { erreur: error.message };
  revalidatePath("/compte");
  return { message: "Tableau de bord enregistré." };
}

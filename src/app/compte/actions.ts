"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { clientServeur } from "@/lib/supabase/serveur";
import { adresseDe, IDENTIFIANT_OK } from "@/lib/supabase/identifiant";

/* ═══════════════════════════════════════════════════════════════════════════
   LES ACTIONS DE COMPTE

   Tout passe par le serveur : le mot de passe ne traverse jamais de code
   client, et la session repart en cookie « httpOnly », hors de portée du
   JavaScript de la page.

   On s'inscrit et on se connecte avec un identifiant. L'adresse que Supabase
   exige est fabriquée à partir de lui, toujours de la même façon — voir
   lib/supabase/identifiant.ts. Aucune adresse réelle n'est demandée.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Retour {
  erreur?: string;
  message?: string;
}

const PSEUDO_OK = /^[a-zA-Z0-9_-]{3,24}$/;

const MAUVAIS_IDENTIFIANT =
  "L'identifiant fait de 3 à 24 caractères : lettres, chiffres, tiret, souligné.";

/* Le projet demande encore une confirmation par courriel. Comme les adresses
   sont fabriquées et ne reçoivent rien, le message ne partira nulle part :
   c'est un réglage à couper, pas une manœuvre de l'utilisateur. On le dit
   donc tel quel plutôt que d'envoyer quelqu'un fouiller une boîte mail. */
const CONFIRMATION_A_COUPER =
  "Le compte est créé mais la connexion est bloquée : le réglage « Confirm email » " +
  "est encore actif dans Supabase (Authentication, Sign In / Providers, Email). " +
  "Une fois coupé, connectez-vous normalement.";

function lisible(brut: string): string {
  const m = brut.toLowerCase();
  if (m.includes("invalid login credentials")) return "Identifiant ou mot de passe incorrect.";
  if (m.includes("user already registered") || m.includes("already been registered")) {
    return "Cet identifiant est déjà pris.";
  }
  if (m.includes("password should be")) return "Le mot de passe doit faire au moins 8 caractères.";
  if (m.includes("email rate limit") || m.includes("rate limit")) {
    return "Trop de tentatives. Réessayez dans quelques minutes.";
  }
  if (m.includes("email not confirmed")) return CONFIRMATION_A_COUPER;
  /* Un domaine fabriqué que le projet refuse : c'est une configuration, pas
     une faute de l'utilisateur, et il faut pouvoir la reconnaître. */
  if (m.includes("email address") && m.includes("invalid")) {
    return "Le domaine des identifiants est refusé par le projet. Réglez NEXT_PUBLIC_DOMAINE_COMPTES.";
  }
  /* La base injoignable ne renvoie pas une erreur d'authentification mais un
     échec de transport, souvent une page d'erreur au lieu de JSON. Afficher
     ce brut-là à un lecteur ne lui apprend rien. */
  if (
    m.includes("fetch") ||
    m.includes("network") ||
    m.includes("not valid json") ||
    m.includes("timeout")
  ) {
    return "La base n'a pas répondu. Réessayez dans un instant.";
  }
  return brut;
}

export async function inscrire(_precedent: Retour, donnees: FormData): Promise<Retour> {
  const sb = await clientServeur();
  if (!sb) return { erreur: "Les comptes ne sont pas encore branchés sur ce site." };

  const identifiant = String(donnees.get("identifiant") ?? "").trim();
  const motDePasse = String(donnees.get("motDePasse") ?? "");

  if (!IDENTIFIANT_OK.test(identifiant)) return { erreur: MAUVAIS_IDENTIFIANT };
  if (motDePasse.length < 8) return { erreur: "Le mot de passe doit faire au moins 8 caractères." };

  /* On regarde si l'identifiant est libre avant de créer le compte : sinon la
     base attribuerait un pseudo numéroté, ce que personne n'a demandé. La
     vérification n'est pas une garantie — deux inscriptions simultanées
     passeraient toutes deux — mais l'unicité de l'adresse fabriquée, elle, en
     est une : la seconde sera refusée par Supabase, et le message le dit. */
  const { data: pris } = await sb
    .from("profils")
    .select("id")
    .ilike("pseudo", identifiant)
    .maybeSingle();
  if (pris) return { erreur: "Cet identifiant est déjà pris." };

  const email = adresseDe(identifiant);
  const { data, error } = await sb.auth.signUp({
    email,
    password: motDePasse,
    options: { data: { pseudo: identifiant } },
  });
  if (error) return { erreur: lisible(error.message) };

  /* Session absente : le projet demande une confirmation par courriel. On
     tente quand même la connexion, car un projet qui ne la demande pas
     renvoie parfois l'inscription sans session ; si elle est refusée, c'est
     que le réglage est encore actif, et personne ne recevra ce courriel. */
  if (!data.session) {
    const { error: souci } = await sb.auth.signInWithPassword({ email, password: motDePasse });
    if (souci) return { erreur: lisible(souci.message) };
  }
  redirect("/compte");
}

export async function connecter(_precedent: Retour, donnees: FormData): Promise<Retour> {
  const sb = await clientServeur();
  if (!sb) return { erreur: "Les comptes ne sont pas encore branchés sur ce site." };

  const identifiant = String(donnees.get("identifiant") ?? "").trim();
  if (!IDENTIFIANT_OK.test(identifiant)) return { erreur: MAUVAIS_IDENTIFIANT };

  const { error } = await sb.auth.signInWithPassword({
    email: adresseDe(identifiant),
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

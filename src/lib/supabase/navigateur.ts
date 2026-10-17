"use client";

import { createBrowserClient } from "@supabase/ssr";
import { CLE_SUPABASE, COMPTES_ACTIFS, URL_SUPABASE } from "./config";

/* Un seul client par onglet : deux instances se disputeraient le
   rafraîchissement du jeton et se déconnecteraient mutuellement. */
let unique: ReturnType<typeof createBrowserClient> | null = null;

export function clientNavigateur() {
  if (!COMPTES_ACTIFS) return null;
  if (!unique) unique = createBrowserClient(URL_SUPABASE, CLE_SUPABASE);
  return unique;
}

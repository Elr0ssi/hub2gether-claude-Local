import { socleEco } from "@/data/concept/conceptEconomie";

/* Le socle économique complet, servi à part : la page s'affiche avec sa
   dernière année, puis charge ce fichier — statique, compressé, en cache. */
export const dynamic = "force-static";

export function GET() {
  return Response.json(socleEco());
}

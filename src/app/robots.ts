import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* L'espace personnel, les routes techniques et l'aperçu n'ont rien à faire dans un moteur. */
      disallow: ["/compte", "/api/", "/v2-eco"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

import { permanentRedirect } from "next/navigation";

/* L'ancienne adresse du prototype. La page est devenue la page de tête du
   sujet économique : elle vit sous /economie, et tout ce qui pointait ici
   y est conduit. Une redirection permanente, pour que le peu d'autorité
   accumulée suive. */
export default function Page() {
  permanentRedirect("/economie");
}

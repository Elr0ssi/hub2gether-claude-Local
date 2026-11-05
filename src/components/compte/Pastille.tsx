/* ═══════════════════════════════════════════════════════════════════════════
   L'AVATAR

   Pas de photo : deux lettres sur une couleur tirée du pseudo. C'est stable
   (le même pseudo donne toujours la même teinte), ça ne demande aucun
   téléversement, et il n'y a donc ni image à modérer ni visage à héberger.
   ═══════════════════════════════════════════════════════════════════════════ */

export function Pastille({ pseudo, taille = 40 }: { pseudo: string; taille?: number }) {
  let somme = 0;
  for (let i = 0; i < pseudo.length; i++) somme = (somme * 31 + pseudo.charCodeAt(i)) % 360;
  const lettres = pseudo.slice(0, 2).toUpperCase();
  return (
    <span
      aria-hidden="true"
      style={{
        width: taille,
        height: taille,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        fontSize: taille * 0.38,
        fontWeight: 800,
        letterSpacing: "0.02em",
        color: `hsl(${somme} 62% 28%)`,
        background: `hsl(${somme} 62% 90%)`,
        border: `1px solid hsl(${somme} 46% 78%)`,
      }}
    >
      {lettres}
    </span>
  );
}

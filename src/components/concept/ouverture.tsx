"use client";

import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   L'OUVERTURE DES PAGES DE SUJET

   Ce que partagent Économie, Démographie, Forum — et les pages de sujet à
   venir : le titre qui se lève mot par mot, la progression de l'ouverture
   au défilement, l'apparition d'une bande, et le signal « prêt » qui lance
   les tuiles. Un module à part, pour qu'une page n'embarque pas le code et
   les données d'une autre en important trois petites fonctions.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Vrai dès la première image après l'hydratation.

    Les tuiles, le sceau et l'arc attendaient l'événement « load » : celui-ci
    ne part qu'une fois la page entière reçue, images et données comprises,
    et les icônes apparaissaient avec une ou deux secondes de retard. Deux
    images d'animation suffisent à laisser le premier rendu se poser. */
export function usePret() {
  const [pret, setPret] = useState(false);
  useEffect(() => {
    let b = 0;
    const a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => setPret(true));
    });
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
    };
  }, []);
  return pret;
}

/** Vrai une fois le fil principal vraiment libre, pas seulement une image
    plus tard.

    Le globe construit sa sphère — près de trois cent mille sommets — de
    façon synchrone, et ce calcul bloque le fil principal une bonne
    fraction de seconde. Le monter au même instant que `usePret` — deux
    images, environ trente millisecondes — le faisait démarrer pile pendant
    que le titre se levait lettre par lettre et que les tuiles se posaient :
    les deux se disputaient le même fil, et aucune des deux animations
    n'avait la place de tourner. Ici, on attend que le navigateur se
    déclare inactif, avec un plafond pour ne pas non plus attendre
    indéfiniment sur un appareil qui ne l'est jamais. */
export function usePretGlobe() {
  const [pret, setPret] = useState(false);
  useEffect(() => {
    let annule: (() => void) | undefined;
    const ric = window.requestIdleCallback;
    if (ric) {
      const id = ric(() => setPret(true), { timeout: 900 });
      annule = () => window.cancelIdleCallback?.(id);
    } else {
      const id = window.setTimeout(() => setPret(true), 550);
      annule = () => window.clearTimeout(id);
    }
    return () => annule?.();
  }, []);
  return pret;
}

/* L'ouverture de la bande au défilement.

   whileInView de framer n'a jamais répondu ici, et un IntersectionObserver
   posé au montage restait muet alors qu'un observateur créé après coup sur le
   même nœud, lui, se déclenchait. Plutôt que de dépendre d'un mécanisme qui
   se comporte différemment selon le moment où on l'installe, on lit la
   position réelle à chaque défilement : c'est une lecture par image, sur un
   seul nœud, et la mesure est relue à chaque fois donc jamais périmée. Une
   fois la bande vue, on décroche tout et on n'y revient pas. */
export function useVu(marge = 120) {
  const ref = useRef<HTMLElement | null>(null);
  const [vu, setVu] = useState(false);
  useEffect(() => {
    let vivant = true;
    const regarde = () => {
      const n = ref.current;
      if (!n) return;
      const r = n.getBoundingClientRect();
      const h = window.innerHeight || 0;
      /* Le rectangle doit réapparaître à chaque fois qu'on revient dessus,
         pas seulement la première : on suit l'état au lieu de le figer. */
      setVu(r.top < h - marge && r.bottom > marge);
    };
    /* On mesure dans l'écouteur, pas dans une image d'animation. Attendre
       requestAnimationFrame liait l'ouverture au rythme de rendu : sur une
       page où le globe tire la cadence vers le bas, la bande s'ouvrait avec
       un défilement de retard. Lire la position d'un seul élément ne coûte
       rien, et le résultat est juste au moment où on le lit. */
    const planifie = () => {
      if (!vivant) return;
      regarde();
    };
    const decroche = () => {
      vivant = false;
      window.removeEventListener("scroll", planifie);
      window.removeEventListener("resize", planifie);
    };
    window.addEventListener("scroll", planifie, { passive: true });
    window.addEventListener("resize", planifie);
    planifie();
    return decroche;
  }, [marge]);
  return { ref, vu };
}


/**
 * La progression de l'ouverture : zéro quand elle tient l'écran, un quand
 * elle l'a quitté par le haut.
 *
 * Elle s'écrit directement dans le style de la section, sans passer par un
 * rendu React : le navigateur interpole tout le reste en CSS, à partir de
 * cette seule variable. Descendre et remonter sont donc le même mouvement,
 * joué dans un sens puis dans l'autre, et rien ne se rejoue d'un coup en
 * arrivant par le bas.
 *
 * La mesure se fait dans l'écouteur, comme pour `useVu` et pour la même
 * raison : une image d'animation de retard se voit sur cette page.
 */
export function useProgression() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    let vivant = true;
    const regarde = () => {
      const n = ref.current;
      if (!n || !vivant) return;
      const r = n.getBoundingClientRect();
      /* La course : la hauteur de l'ouverture. Une course plus courte
         faisait disparaître les tuiles alors que l'ouverture tenait encore
         l'écran — le mouvement prenait de l'avance sur la lecture. */
      const course = Math.max(1, r.height);
      const p = Math.min(1, Math.max(0, -r.top / course));
      n.style.setProperty("--p", p.toFixed(3));
    };
    window.addEventListener("scroll", regarde, { passive: true });
    window.addEventListener("resize", regarde);
    regarde();
    return () => {
      vivant = false;
      window.removeEventListener("scroll", regarde);
      window.removeEventListener("resize", regarde);
    };
  }, []);
  return ref;
}


/* Un titre qui se lève, lettre par lettre, derrière un masque. Chaque
   lettre porte son rang : c'est le CSS qui décale les départs, rien ne
   tourne en JavaScript.

   Le titre des pages de sujet tient en un seul mot — « Économie »,
   « Démographie », « Forum » — un décalage par mot ne levait donc rien
   qu'un seul bloc, d'un coup. Décalé lettre par lettre, il se déroule
   vraiment. */
export function Titre({ texte }: { texte: string }) {
  const lettres = Array.from(texte);
  return (
    <>
      {lettres.map((l, i) => (
        <span key={`${l}-${i}`} className="cg-mot" style={{ "--i": i } as React.CSSProperties}>
          <span>{l === " " ? " " : l}</span>
        </span>
      ))}
    </>
  );
}


/** Le socle complet, chargé après l'affichage.

    La page arrive avec la seule dernière année publiée — de quoi dessiner le
    globe, la fiche et le classement du moment. Les autres années, qui ne
    servent qu'à la frise et à la courbe, suivent par une requête à part : un
    fichier statique, compressé et mis en cache, plutôt qu'un mégaoctet
    recopié deux fois dans le HTML de chaque visite.

    La requête part au repos du navigateur, pas au montage : posée tout de
    suite, elle arrivait pendant que la page finissait de s'installer, et le
    calcul qui range soixante-sept années de plus — le tri du classement, la
    palette du globe — retombait sur la même image que l'hydratation. Sur un
    appareil modeste, les deux ensemble se voyaient comme un blocage. */
export function useSocleComplet<T>(leger: T, url: string): T {
  const [socle, setSocle] = useState(leger);
  useEffect(() => {
    let vivant = true;
    let annule: (() => void) | undefined;

    const charge = () => {
      fetch(url)
        .then((r) => (r.ok ? r.json() : null))
        .then((complet: T | null) => {
          if (vivant && complet) setSocle(complet);
        })
        .catch(() => {
          /* Sans le reste des années, la page reste utilisable sur la dernière. */
        });
    };

    const ric = window.requestIdleCallback;
    if (ric) {
      const id = ric(charge, { timeout: 2000 });
      annule = () => window.cancelIdleCallback?.(id);
    } else {
      const id = window.setTimeout(charge, 300);
      annule = () => window.clearTimeout(id);
    }

    return () => {
      vivant = false;
      annule?.();
    };
  }, [url]);
  return socle;
}

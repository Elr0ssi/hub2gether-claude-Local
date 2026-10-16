# Demande à ChatGPT : le détail des impôts et leurs taux (France, puis autres pays)

À copier-coller. Le but : alimenter les camemberts « Impôts » des articles de dette (une taxe = un montant + son taux), avec des chiffres sourcés, sans rien inventer.

---

Je construis un site de données publiques (Visualize). Pour l'article « dette publique » de **<PAYS>**, je dois remplir le détail des **impôts perçus en 2025** : pour chaque impôt, son **montant**, son **taux ou barème**, et la source.

## Ce que j'ai déjà (ne le refais pas)
Pour la France (Insee, publication du 28 août 2026, comptabilité nationale, base 2020, milliards d'euros) :
TVA 208,8 · droits et impôts sur les importations 3,6 · autres impôts sur les produits 128,1 (dont accises énergétiques 30,5 ; accises sur les tabacs 13,6) · impôts sur salaires et main-d'œuvre 60,1 (dont taxe sur les salaires 17,6) · autres impôts sur la production 72,7 (dont taxe foncière 44,2 ; CFE 8,1 ; CVAE 3,7 ; CSSS 5,3) · impôts courants sur le revenu 383,3 (dont CSG 156,6 ; CRDS 9,3 ; IRPP 103,6 avant crédits d'impôt ; IS 69,5 avant crédits d'impôt) · autres impôts courants 6,6 (dont taxe d'habitation 2,9 ; IFI 2,7) · impôts en capital 21,7 (dont droits de mutation à titre gratuit 21,1).

## Ce qu'il me manque pour la France
Les parties que je ne sais pas encore détailler (le « reste » de chaque famille) :
- **Autres impôts sur les produits** : 128,1 − (30,5 + 13,6) = **84,0 Md€** non détaillés (taxes sur les assurances, sur l'alcool, sur les véhicules, sur les billets d'avion, TICPE vs autres accises, droits de timbre, etc.).
- **Impôts sur salaires et main-d'œuvre** : 60,1 − 17,6 = **42,5 Md€** non détaillés.
- **Impôts courants sur le revenu** : 383,3 − (156,6 + 9,3 + 103,6 + 69,5) = **44,3 Md€** non détaillés (prélèvements sociaux sur les revenus du capital, retenues à la source, etc.).
- **Autres impôts sur la production** : 72,7 − (44,2 + 8,1 + 3,7 + 5,3) = **11,4 Md€** non détaillés.
- **Impôts en capital** : 21,7 − 21,1 = 0,6 ; **autres impôts courants** : 6,6 − (2,9 + 2,7) = 1,0.

## Format de réponse attendu (un tableau, une ligne par impôt)

| Famille | Impôt | Montant 2025 (Md€) | Dont / inclus dans | Taux ou barème en vigueur en 2025 | Source (page exacte) |
|---|---|---|---|---|---|

Exemples de ce que je veux dans « Taux ou barème » : « 20 % (taux normal), 10 %, 5,5 %, 2,1 % » pour la TVA ; « barème progressif de 0 % à 45 % » pour l'impôt sur le revenu ; « X €/hl » pour une accise. Si l'impôt a plusieurs taux, donne-les tous, et dis à qui ils s'appliquent.

## Règles (non négociables)
1. **Aucun chiffre inventé ni estimé.** Chaque montant et chaque taux vient d'une source officielle (Insee, ministère de l'Économie et des Finances, DGFiP, DGDDI, Légifrance, service-public.fr, Eurostat, OCDE…), avec **l'adresse exacte de la page** et la période.
2. Si un montant ou un taux n'est pas publié, écris « non publié » : n'estime pas, ne déduis pas.
3. **Un « dont » est inclus dans son parent** : indique clairement lequel, pour que rien ne soit compté deux fois.
4. **Une seule édition statistique** par tableau (pas de mélange d'une publication de mai et d'une publication d'août). Précise laquelle.
5. Distingue ce qui est **avant crédits d'impôt** de ce qui est net, et le **brut** du **net**.
6. Les montants en **milliards d'euros**, avec la décimale de la source.
7. Termine par la liste des chiffres que tu n'as pas pu vérifier.

## Pour un autre pays
Même chose, avec les tableaux de recettes fiscales de l'institut statistique du pays (ex. Allemagne : Destatis GENESIS 71211-0001 ; pour les taux : le ministère des Finances fédéral). Pour l'Allemagne, j'ai déjà les montants (taxe sur l'énergie 37,563 ; taxe sur les assurances 19,611 ; taxe sur le tabac 17,632 ; contribution de solidarité 12,878 ; taxe sur les véhicules 9,598 ; taxe sur l'électricité 5,856 ; impôt sur les salaires 262,688 ; TVA intérieure 236,267 ; etc.) : il me manque **le taux ou le barème de chacun** (ex. taxe sur l'énergie : tarif par litre ou par kWh selon le produit ; taxe sur les assurances : taux ; tabac : part proportionnelle et part spécifique ; contribution de solidarité : taux et seuils ; impôt sur les sociétés : taux fédéral ; etc.).

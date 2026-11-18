# Démographie

Déjà en base : `population/nombre-habitants` — 99 pays, 7 millésimes repères
(2000, 2005, 2010, 2015, 2020, 2023, 2025), source ONU · Banque mondiale.

La suite suivra la même forme, dossier par dossier, à mesure que les jeux
arrivent :

```
demographie/
├── population/   nombre-habitants ✓ · croissance-demographique · densite-population
├── mortalite/    mortalite-totale · esperance-vie · mortalite-infantile
│   └── causes-deces/  maladies-cardiovasculaires · cancers · maladies-respiratoires · accidents
├── natalite/     taux-natalite · nombre-naissances · fecondite
└── migrations/
```

Une réserve sur les causes de décès : `src/data/mortality/mortality.ts`
contient déjà tabac, cancer, obésité et accidents de la route par pays, mais
**sans aucune année**. Les migrer demanderait de leur en attribuer une, ce qui
reviendrait à inventer une date. Elles attendent que leur millésime soit
précisé.

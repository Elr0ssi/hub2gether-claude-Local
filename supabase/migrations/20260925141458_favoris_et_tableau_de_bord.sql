-- Les articles enregistrés par un compte, et ce qu'il affiche dans son
-- tableau de bord. Deux additions distinctes : une table pour la relation
-- compte/article (plusieurs lignes par compte), une colonne pour la
-- préférence de tableau de bord (une seule valeur par compte).

create table if not exists public.favoris (
  id uuid primary key default gen_random_uuid(),
  profil_id uuid not null references public.profils(id) on delete cascade,
  article text not null,
  cree_le timestamptz not null default now(),
  unique (profil_id, article)
);

alter table public.favoris enable row level security;

-- Chacun lit, ajoute et retire ses propres lignes ; personne ne voit ni ne
-- modifie celles d'un autre compte. Contrairement aux messages du forum,
-- une liste d'articles enregistrés n'a rien de public.
create policy "favoris_lecture_soi" on public.favoris
  for select using (auth.uid() = profil_id);
create policy "favoris_ecriture_soi" on public.favoris
  for insert with check (auth.uid() = profil_id);
create policy "favoris_suppression_soi" on public.favoris
  for delete using (auth.uid() = profil_id);

create index if not exists favoris_profil_idx on public.favoris (profil_id, cree_le desc);

-- Les identifiants des compteurs choisis pour le tableau de bord personnel
-- ("pib", "population", "foret"...). Un tableau de texte, pas une table à
-- part : c'est une préférence d'affichage, pas une donnée relationnelle.
alter table public.profils add column if not exists widgets text[] not null default '{}';

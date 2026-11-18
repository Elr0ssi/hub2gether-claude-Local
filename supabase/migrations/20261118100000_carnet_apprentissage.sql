-- Le carnet d'apprentissage : les traductions et les passages qu'un compte garde pour s'entraîner.
-- Une ligne par élément ; l'identifiant est créé dans le navigateur, pour qu'un élément gardé hors connexion
-- garde le même identifiant une fois envoyé au compte (pas de doublon).
create table if not exists public.carnet (
  id uuid primary key,
  profil_id uuid not null references public.profils(id) on delete cascade,
  type text not null check (type in ('traduction', 'passage')),
  texte text not null check (char_length(texte) between 1 and 2000),
  traduction text check (traduction is null or char_length(traduction) <= 2000),
  langue text not null default 'en',
  source_titre text,
  source_url text,
  niveau smallint not null default 0 check (niveau between 0 and 6),
  prochaine_revision timestamptz not null default now(),
  cree_le timestamptz not null default now()
);

alter table public.carnet enable row level security;

-- Comme les favoris : chacun ne voit et ne modifie que son propre carnet.
create policy "carnet_lecture_soi" on public.carnet for select using (auth.uid() = profil_id);
create policy "carnet_ajout_soi" on public.carnet for insert with check (auth.uid() = profil_id);
create policy "carnet_maj_soi" on public.carnet for update using (auth.uid() = profil_id) with check (auth.uid() = profil_id);
create policy "carnet_suppression_soi" on public.carnet for delete using (auth.uid() = profil_id);

create index if not exists carnet_profil_idx on public.carnet (profil_id, cree_le desc);

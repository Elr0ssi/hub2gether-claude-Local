create table public.profils (
  id uuid primary key references auth.users (id) on delete cascade,
  pseudo text not null check (char_length(pseudo) between 3 and 30),
  bio text check (char_length(bio) <= 280),
  role text not null default 'lecteur' check (role in ('lecteur', 'moderateur', 'admin')),
  cree_le timestamptz not null default now()
);
create unique index profils_pseudo_unique on public.profils (lower(pseudo));

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  cible_type text not null check (cible_type in ('fil', 'article')),
  cible_id text not null check (char_length(cible_id) between 1 and 120),
  parent_id uuid references public.messages (id) on delete cascade,
  auteur uuid not null references public.profils (id) on delete cascade,
  texte text not null check (char_length(texte) between 1 and 4000),
  source_url text check (source_url is null or source_url ~ '^https?://'),
  cree_le timestamptz not null default now(),
  modifie_le timestamptz
);
create index messages_cible on public.messages (cible_type, cible_id, cree_le);
create index messages_auteur on public.messages (auteur, cree_le desc);
create index messages_parent on public.messages (parent_id);

create table public.votes (
  cible text not null check (char_length(cible) between 3 and 160),
  auteur uuid not null references public.profils (id) on delete cascade,
  sens smallint not null check (sens in (-1, 1)),
  cree_le timestamptz not null default now(),
  primary key (cible, auteur)
);

create table public.scores (
  cible text primary key,
  score integer not null default 0
);

create table public.signalements (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages (id) on delete cascade,
  auteur uuid references public.profils (id) on delete set null,
  motif text not null check (motif in ('illicite', 'haine', 'spam', 'faux', 'autre')),
  detail text check (char_length(detail) <= 500),
  etat text not null default 'ouvert' check (etat in ('ouvert', 'traite', 'rejete')),
  cree_le timestamptz not null default now(),
  unique (message_id, auteur)
);
create index signalements_ouverts on public.signalements (etat, cree_le desc);

create or replace function public.est_moderateur() returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profils
    where id = (select auth.uid()) and role in ('moderateur', 'admin')
  );
$$;

create or replace function public.creer_profil() returns trigger
  language plpgsql security definer set search_path = public as $$
declare
  socle text;
  essai text;
  n integer := 0;
begin
  socle := regexp_replace(
    lower(coalesce(new.raw_user_meta_data ->> 'pseudo', split_part(new.email, '@', 1), '')),
    '[^a-z0-9_-]', '', 'g'
  );
  socle := left(nullif(socle, ''), 24);
  if socle is null or char_length(socle) < 3 then socle := 'membre'; end if;
  essai := socle;
  while exists (select 1 from public.profils where lower(pseudo) = essai) loop
    n := n + 1;
    essai := left(socle, 24) || n::text;
  end loop;
  insert into public.profils (id, pseudo) values (new.id, essai);
  return new;
end $$;

create trigger creer_profil_a_l_inscription
  after insert on auth.users
  for each row execute function public.creer_profil();

create or replace function public.maj_score() returns trigger
  language plpgsql security definer set search_path = public as $$
declare c text;
begin
  c := coalesce(new.cible, old.cible);
  insert into public.scores (cible, score)
  select c, coalesce(sum(sens), 0) from public.votes where cible = c
  on conflict (cible) do update set score = excluded.score;
  return null;
end $$;

create trigger votes_maj_score
  after insert or update or delete on public.votes
  for each row execute function public.maj_score();

create or replace function public.limite_debit() returns trigger
  language plpgsql set search_path = public as $$
declare n integer;
begin
  select count(*) into n from public.messages
  where auteur = new.auteur and cree_le > now() - interval '1 minute';
  if n >= 5 then
    raise exception 'Trop de messages en peu de temps. Reessayez dans une minute.';
  end if;
  select count(*) into n from public.messages
  where auteur = new.auteur and cree_le > now() - interval '1 hour';
  if n >= 60 then
    raise exception 'Limite horaire atteinte. Reessayez plus tard.';
  end if;
  return new;
end $$;

create trigger messages_limite_debit
  before insert on public.messages
  for each row execute function public.limite_debit();

create or replace function public.parent_meme_cible() returns trigger
  language plpgsql set search_path = public as $$
declare pt text; pi text;
begin
  if new.parent_id is null then return new; end if;
  select cible_type, cible_id into pt, pi from public.messages where id = new.parent_id;
  if pt is distinct from new.cible_type or pi is distinct from new.cible_id then
    raise exception 'La reponse ne vise pas la meme discussion que le message parent.';
  end if;
  return new;
end $$;

create trigger messages_parent_meme_cible
  before insert on public.messages
  for each row execute function public.parent_meme_cible();

alter table public.profils enable row level security;
alter table public.messages enable row level security;
alter table public.votes enable row level security;
alter table public.scores enable row level security;
alter table public.signalements enable row level security;

create policy "profils lisibles par tous" on public.profils
  for select to anon, authenticated using (true);
create policy "profil modifiable par son titulaire" on public.profils
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "messages lisibles par tous" on public.messages
  for select to anon, authenticated using (true);
create policy "message ecrit en son nom" on public.messages
  for insert to authenticated with check (auteur = (select auth.uid()));
create policy "message corrige par son auteur" on public.messages
  for update to authenticated using (auteur = (select auth.uid())) with check (auteur = (select auth.uid()));
create policy "message retire par son auteur ou la moderation" on public.messages
  for delete to authenticated using (auteur = (select auth.uid()) or public.est_moderateur());

create policy "ses propres voix" on public.votes
  for select to authenticated using (auteur = (select auth.uid()));
create policy "voter en son nom" on public.votes
  for insert to authenticated with check (auteur = (select auth.uid()));
create policy "changer sa voix" on public.votes
  for update to authenticated using (auteur = (select auth.uid())) with check (auteur = (select auth.uid()));
create policy "retirer sa voix" on public.votes
  for delete to authenticated using (auteur = (select auth.uid()));

create policy "totaux lisibles par tous" on public.scores
  for select to anon, authenticated using (true);

create policy "signaler en son nom" on public.signalements
  for insert to authenticated with check (auteur = (select auth.uid()));
create policy "ses signalements et ceux de la moderation" on public.signalements
  for select to authenticated using (auteur = (select auth.uid()) or public.est_moderateur());
create policy "la moderation traite les signalements" on public.signalements
  for update to authenticated using (public.est_moderateur()) with check (public.est_moderateur());

alter publication supabase_realtime add table public.messages;

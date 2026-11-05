-- Les fonctions internes sortent de l'API.
--
-- Tout ce qui vit dans `public` est appelable depuis le navigateur, par
-- /rest/v1/rpc. Les deux fonctions de declenchement n'ont aucune raison de
-- l'etre, et le test de role non plus : il sert aux regles d'acces, pas aux
-- visiteurs. On les met dans un schema que PostgREST n'expose pas.

create schema if not exists prive;
grant usage on schema prive to authenticated;

-- Les declencheurs ne verifient le droit d'execution qu'a leur creation :
-- leur retirer maintenant ne les empeche pas de tourner.
revoke all on function public.creer_profil() from anon, authenticated, public;
revoke all on function public.maj_score() from anon, authenticated, public;

create or replace function prive.est_moderateur() returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profils
    where id = (select auth.uid()) and role in ('moderateur', 'admin')
  );
$$;
revoke all on function prive.est_moderateur() from public;
grant execute on function prive.est_moderateur() to authenticated;

drop policy "message retire par son auteur ou la moderation" on public.messages;
create policy "message retire par son auteur ou la moderation" on public.messages
  for delete to authenticated using (auteur = (select auth.uid()) or prive.est_moderateur());

drop policy "ses signalements et ceux de la moderation" on public.signalements;
create policy "ses signalements et ceux de la moderation" on public.signalements
  for select to authenticated using (auteur = (select auth.uid()) or prive.est_moderateur());

drop policy "la moderation traite les signalements" on public.signalements;
create policy "la moderation traite les signalements" on public.signalements
  for update to authenticated using (prive.est_moderateur()) with check (prive.est_moderateur());

drop function public.est_moderateur();

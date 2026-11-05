-- Le pseudo choisi est repris tel quel, majuscules comprises. La version
-- derivee de l'adresse ne sert que de secours.
create or replace function public.creer_profil() returns trigger
  language plpgsql security definer set search_path = public as $$
declare
  choisi text;
  socle text;
  essai text;
  n integer := 0;
begin
  choisi := coalesce(new.raw_user_meta_data ->> 'pseudo', '');
  if choisi ~ '^[A-Za-z0-9_-]{3,24}$' then
    socle := choisi;
  else
    socle := regexp_replace(lower(coalesce(split_part(new.email, '@', 1), '')), '[^a-z0-9_-]', '', 'g');
    socle := left(nullif(socle, ''), 24);
    if socle is null or char_length(socle) < 3 then socle := 'membre'; end if;
  end if;

  essai := socle;
  while exists (select 1 from public.profils where lower(pseudo) = lower(essai)) loop
    n := n + 1;
    essai := left(socle, 24 - char_length(n::text)) || n::text;
  end loop;

  insert into public.profils (id, pseudo) values (new.id, essai);
  return new;
end $$;

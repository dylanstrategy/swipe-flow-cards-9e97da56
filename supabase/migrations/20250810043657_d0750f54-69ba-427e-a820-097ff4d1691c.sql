-- Fix function search_path for newly added functions only
set search_path = public;

create or replace function public.ensure_events_update_trigger()
returns void
language plpgsql
set search_path = public
as $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'update_events_updated_at'
  ) then
    create trigger update_events_updated_at
    before update on public.events
    for each row execute function public.update_updated_at_column();
  end if;
end;$$;

create or replace function public.set_actor_id_from_auth()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.actor_id is null then
    new.actor_id := auth.uid();
  end if;
  return new;
end $$;

create or replace function public.set_analytics_user()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;
  return new;
end $$;
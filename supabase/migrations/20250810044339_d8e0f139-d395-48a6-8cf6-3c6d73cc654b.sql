-- Applaud – Option A Safe Migration (single file)
-- Purpose: Create events, assignments, analytics_events with tight RLS
-- Safe: No schema-wide revokes, no enum changes, uses existing helper functions:
--   public.is_admin_or_operator(uuid), public.is_maintenance_staff(uuid) [if present]
-- Notes: Includes fixes so Maintenance/Assignees can update events and clients
--        aren’t forced to pass actor_id/user_id (filled from auth.uid()).

-- =====================================================================
-- 0) Safety defaults
-- =====================================================================
set search_path = public;

-- =====================================================================
-- 1) Tables (idempotent)
-- =====================================================================
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in (
    'work_order','inspection','move_in_step','move_out_step','message_followup','payment_followup','note'
  )),
  subject_id uuid,
  property_id uuid,
  unit_id uuid,
  actor_id uuid,
  status text not null default 'open' check (status in ('open','scheduled','in_progress','blocked','done','canceled','snoozed')),
  priority text default 'normal' check (priority in ('low','normal','high','urgent')),
  due_at timestamptz,
  scheduled_for timestamptz,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assignments (
  event_id uuid not null references public.events(id) on delete cascade,
  assignee_id uuid not null,
  strategy text not null default 'direct' check (strategy in ('direct','first_available','role_queue')),
  created_at timestamptz not null default now(),
  primary key (event_id, assignee_id)
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  props jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- 2) Triggers (idempotent)
-- =====================================================================
-- 2a) updated_at touch for events (re-uses your existing function)
create or replace function public.ensure_events_update_trigger()
returns void language plpgsql as $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'update_events_updated_at'
  ) then
    create trigger update_events_updated_at
    before update on public.events
    for each row execute function public.update_updated_at_column();
  end if;
end;$$;
select public.ensure_events_update_trigger();

-- 2b) Fill actor_id from auth if client omitted it
create or replace function public.set_actor_id_from_auth()
returns trigger language plpgsql as $$
begin
  if new.actor_id is null then
    new.actor_id := auth.uid();
  end if;
  return new;
end $$;

drop trigger if exists trg_events_set_actor on public.events;
create trigger trg_events_set_actor
before insert on public.events
for each row execute function public.set_actor_id_from_auth();

-- 2c) Fill analytics.user_id from auth if client omitted it
create or replace function public.set_analytics_user()
returns trigger language plpgsql as $$
begin
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;
  return new;
end $$;

drop trigger if exists trg_analytics_user on public.analytics_events;
create trigger trg_analytics_user
before insert on public.analytics_events
for each row execute function public.set_analytics_user();

-- =====================================================================
-- 3) Enable RLS (only on newly created tables)
-- =====================================================================
alter table public.events enable row level security;
alter table public.assignments enable row level security;
alter table public.analytics_events enable row level security;

-- =====================================================================
-- 4) Policies (drop/recreate)
-- =====================================================================
-- EVENTS
drop policy if exists "events_select" on public.events;
drop policy if exists "events_insert" on public.events;
drop policy if exists "events_update" on public.events;
drop policy if exists "events_delete" on public.events;

create policy "events_select" on public.events
for select using (
  public.is_admin_or_operator(auth.uid())
  or auth.uid() = actor_id
  or exists (
    select 1 from public.assignments a
    where a.event_id = public.events.id
      and a.assignee_id = auth.uid()
  )
);

create policy "events_insert" on public.events
for insert with check (
  public.is_admin_or_operator(auth.uid())
  or auth.uid() = actor_id -- filled by trigger if omitted
);

-- Allow updates by admins/operators, assigned user, or original actor
create policy "events_update" on public.events
for update using (
  public.is_admin_or_operator(auth.uid())
  or exists (
    select 1 from public.assignments a
    where a.event_id = public.events.id
      and a.assignee_id = auth.uid()
  )
  or auth.uid() = actor_id
);

create policy "events_delete" on public.events
for delete using (
  public.is_admin_or_operator(auth.uid())
);

-- ASSIGNMENTS
drop policy if exists "assignments_select" on public.assignments;
drop policy if exists "assignments_mutate_admin" on public.assignments;

create policy "assignments_select" on public.assignments
for select using (
  public.is_admin_or_operator(auth.uid())
  or assignee_id = auth.uid()
);

-- Allow admin/operator (and optionally maintenance) to write
create policy "assignments_mutate_admin" on public.assignments
for all using (
  public.is_admin_or_operator(auth.uid())
  or coalesce(public.is_maintenance_staff(auth.uid()), false)
) with check (
  public.is_admin_or_operator(auth.uid())
  or coalesce(public.is_maintenance_staff(auth.uid()), false)
);

-- ANALYTICS EVENTS
drop policy if exists "analytics_insert_own" on public.analytics_events;
drop policy if exists "analytics_read_admin" on public.analytics_events;

create policy "analytics_insert_own" on public.analytics_events
for insert with check (
  auth.uid() = user_id -- filled by trigger if omitted
);

create policy "analytics_read_admin" on public.analytics_events
for select using (
  public.is_admin_or_operator(auth.uid())
);

-- =====================================================================
-- 5) Helpful indexes (idempotent)
-- =====================================================================
create index if not exists idx_events_property_status on public.events(property_id, status);
create index if not exists idx_events_type_due on public.events(type, due_at);
create index if not exists idx_assignments_event on public.assignments(event_id);
create index if not exists idx_assignments_assignee on public.assignments(assignee_id);

-- =====================================================================
-- 6) Optional: RPC used by edge function (perform_event_action)
-- =====================================================================
create or replace function public.perform_event_action(event_id uuid, action text, data jsonb, idempotency_key text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare e record; begin
  select * into e from public.events where id = event_id;
  if not found then raise exception 'event_not_found'; end if;

  if action = 'primary' then
    update public.events set status = case
      when status in ('open','blocked','snoozed') then 'in_progress'
      when status in ('in_progress','scheduled') then 'done'
      else status end
    where id = event_id;

  elsif action = 'assign' then
    insert into public.assignments(event_id, assignee_id, strategy)
      values (event_id, (data->>'assigneeId')::uuid, coalesce(data->>'strategy','direct'))
    on conflict (event_id, assignee_id) do nothing;

  elsif action = 'snooze' then
    update public.events set status = 'snoozed',
      due_at = (now() + coalesce(((data->>'minutes')::int * interval '1 minute'), interval '30 minutes'))
    where id = event_id;

  elsif action = 'cancel' then
    update public.events set status='canceled' where id = event_id;

  elsif action = 'done' then
    update public.events set status='done' where id = event_id;

  elsif action = 'quick-reply' then
    perform pg_sleep(0); -- placeholder; wire messages later

  else
    raise exception 'unknown_action';
  end if;

  return jsonb_build_object('eventId', event_id, 'action', action, 'ok', true);
end $$;

-- =====================================================================
-- Function hardening patch (search_path) — safe batch
-- =====================================================================
-- Purpose: Set search_path=public on all functions in schema public that are missing it.
-- Safe: Does not modify function bodies. Skips gracefully if you lack ownership on a function.

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT
      n.nspname  AS schema_name,
      p.proname  AS func_name,
      pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND (
        p.proconfig IS NULL
        OR NOT EXISTS (
          SELECT 1 FROM unnest(p.proconfig) AS c(cfg)
          WHERE cfg LIKE 'search_path=%'
        )
      )
  LOOP
    BEGIN
      EXECUTE format(
        'ALTER FUNCTION %I.%I(%s) SET search_path = public;',
        r.schema_name, r.func_name, r.args
      );
      RAISE NOTICE 'Set search_path=public on %.%(%).', r.schema_name, r.func_name, r.args;
    EXCEPTION
      WHEN insufficient_privilege THEN
        RAISE NOTICE 'Skipped %.%(%): insufficient privilege.', r.schema_name, r.func_name, r.args;
      WHEN others THEN
        RAISE NOTICE 'Skipped %.%(%): %', r.schema_name, r.func_name, r.args, SQLERRM;
    END;
  END LOOP;
END $$;

-- Verify: all public functions and their config (should include search_path=public now)
SELECT
  n.nspname AS schema,
  p.proname AS function,
  pg_get_function_identity_arguments(p.oid) AS args,
  COALESCE(array_to_string(p.proconfig, ', '), '') AS config
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
ORDER BY 1,2;
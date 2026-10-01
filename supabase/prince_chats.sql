-- ============================================================
--  Prince AI — chat history (anonymous, device-scoped)
--  Run this in the Supabase SQL editor for the portfolio project.
--
--  There is no login on the portfolio, so chats are scoped by a
--  random UUID (`device_id`) generated per browser and kept in
--  localStorage. That UUID acts as an unguessable capability token.
--
--  PRIVACY NOTE: with only the anon key and no auth, RLS cannot
--  verify the device server-side, so the policies below are
--  permissive (any anon client can read/write rows). Rows are only
--  discoverable by knowing the random device_id. If you later add
--  real Supabase Auth, replace these policies with
--  `auth.uid() = user_id` checks for true per-user isolation.
-- ============================================================

create table if not exists public.prince_chats (
  id          uuid primary key default gen_random_uuid(),
  device_id   text        not null,
  title       text        not null default 'New chat',
  messages    jsonb       not null default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists prince_chats_device_idx
  on public.prince_chats (device_id, updated_at desc);

alter table public.prince_chats enable row level security;

-- Permissive anon access (device_id UUID is the capability token).
drop policy if exists "prince_chats anon select" on public.prince_chats;
create policy "prince_chats anon select"
  on public.prince_chats for select
  using (true);

drop policy if exists "prince_chats anon insert" on public.prince_chats;
create policy "prince_chats anon insert"
  on public.prince_chats for insert
  with check (true);

drop policy if exists "prince_chats anon update" on public.prince_chats;
create policy "prince_chats anon update"
  on public.prince_chats for update
  using (true)
  with check (true);

drop policy if exists "prince_chats anon delete" on public.prince_chats;
create policy "prince_chats anon delete"
  on public.prince_chats for delete
  using (true);

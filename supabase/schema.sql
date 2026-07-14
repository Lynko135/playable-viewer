-- ============================================================
-- Playable Viewer — Supabase schema
-- Выполнить в Supabase Dashboard → SQL Editor.
-- Публичная регистрация в Auth должна быть отключена
-- (Authentication → Providers → Email → Disable "Allow new users to sign up"),
-- тогда "authenticated" = только твой админ-аккаунт.
-- ============================================================

-- 1. Таблица метаданных плейблов
create table if not exists public.playables (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  storage_path text not null,
  file_size    int8 not null default 0,
  created_at   timestamptz not null default now()
);

alter table public.playables enable row level security;

-- Публичное чтение
drop policy if exists "playables_public_read" on public.playables;
create policy "playables_public_read"
  on public.playables for select
  using (true);

-- Запись только аутентифицированному админу
drop policy if exists "playables_auth_insert" on public.playables;
create policy "playables_auth_insert"
  on public.playables for insert
  to authenticated
  with check (true);

drop policy if exists "playables_auth_delete" on public.playables;
create policy "playables_auth_delete"
  on public.playables for delete
  to authenticated
  using (true);

-- 2. Бакет Storage (публичный на чтение)
insert into storage.buckets (id, name, public)
values ('playables', 'playables', true)
on conflict (id) do update set public = true;

-- Публичное чтение файлов
drop policy if exists "playable_files_public_read" on storage.objects;
create policy "playable_files_public_read"
  on storage.objects for select
  using (bucket_id = 'playables');

-- Загрузка/удаление только аутентифицированному админу
drop policy if exists "playable_files_auth_insert" on storage.objects;
create policy "playable_files_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'playables');

drop policy if exists "playable_files_auth_delete" on storage.objects;
create policy "playable_files_auth_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'playables');

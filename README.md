# Playable Viewer

Веб-приложение для хранения и онлайн-просмотра playable-креативов (self-contained HTML).
Просмотр публичный по ссылке, добавление/удаление — только для админа.

Стек: Vue 3 + TypeScript + Vite + Pinia + Vue Router, бэкенд — Supabase (Auth + Postgres + Storage).
ТЗ — в [SPEC.md](SPEC.md).

## Локальный запуск

```bash
npm install
cp .env.example .env.local   # подставь значения из Supabase
npm run dev
```

## Настройка Supabase

1. Создай проект на [supabase.com](https://supabase.com).
2. **SQL Editor** → выполни [`supabase/schema.sql`](supabase/schema.sql) (создаст таблицу, бакет и RLS-политики).
3. **Authentication → Providers → Email** → отключи «Allow new users to sign up» (публичной регистрации быть не должно).
4. **Authentication → Users → Add user** → заведи свой админ-аккаунт (email + пароль).
5. **Project Settings → API** → скопируй `Project URL` и `anon public key` в `.env.local`:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```

> `anon key` публичный по дизайну — он попадает в собранный фронтенд. Защиту записи обеспечивает RLS.

## Деплой на Vercel

1. Запушь репозиторий на GitHub.
2. На [vercel.com](https://vercel.com) → New Project → импортируй репозиторий (framework определится как Vite).
3. В **Environment Variables** добавь `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`.
4. Deploy. Ссылкой на выданный домен делишься для просмотра.

SPA-роутинг настроен в [`vercel.json`](vercel.json) (все пути → `index.html`).

## Скрипты

| Команда | Действие |
|---|---|
| `npm run dev` | дев-сервер |
| `npm run build` | типизация + прод-сборка |
| `npm run preview` | предпросмотр сборки |
| `npm run typecheck` | только проверка типов |

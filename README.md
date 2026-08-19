# Playable Viewer

Статический сайт для просмотра playable-креативов (self-contained HTML).
Одна страница: список с иконками слева, превью в рамке телефона справа.
Бэкенда нет — контент добавляется правкой `playables.json` и файлами в `public/playables/`.

## Запуск

```bash
npm install
npm run dev
```

Открой http://localhost:5173

## Как добавить плейбл

1. Положи в `public/playables/`:
   - html-файл, напр. `my-game.html` (должен быть **self-contained** — все ассеты внутри);
   - иконку — `.png`, `.jpg`, `.svg` или `.webp` (рекомендуется 256×256).
2. Добавь запись в `playables.json` (в корне проекта):
   ```json
   {
     "id": 10,
     "name": "My Game",
     "html": "/playables/my-game.html",
     "icon": "/playables/my-game.svg"
   }
   ```
   - `id` — уникальное число; чем больше, тем выше плейбл в гриде (сортировка по убыванию).
   - Пути — это URL от корня сайта (то, что лежит в `public/`, отдаётся из корня).
3. В dev-режиме изменения подхватятся автоматически; для прода — закоммить и запушь.

## Сборка

```bash
npm run build      # проверка типов + сборка в dist/
npm run preview    # локальный просмотр собранной версии
```

## Деплой

Любой статик-хостинг. Сборка — `npm run build`, каталог — `dist`.

- **Vercel / Netlify:** подключить GitHub-репозиторий, framework = Vite, build = `npm run build`, output = `dist`. Автодеплой на push.
- **GitHub Pages:** собрать и опубликовать `dist` (напр. через GitHub Actions). Если сайт живёт не в корне домена (`user.github.io/repo/`), задать `base` в `vite.config.ts`.

Ссылкой на выданный адрес делишься — сторонние пользователи смотрят плейблы,
добавлять можешь только ты (через коммиты в репозиторий).

## Настройки

- Размер иконок в списке — переменная `--icon-size` в `src/components/PlayableList.vue`.
- Пресеты устройств — `src/data/devices.ts`.

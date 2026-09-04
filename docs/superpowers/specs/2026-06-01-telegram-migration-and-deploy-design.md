# Дизайн: миграция «MAX Добро» на Telegram + прод-деплой

Дата: 2026-06-01
Статус: на ревью

## Контекст и цель

Проект «MAX Добро» (волонтёрская платформа) построен под мессенджер **MAX**: backend (NestJS + Prisma + Supabase Postgres), frontend (React + Vite, Mini App), боты `bot-max` и `bot-telegram`. Цель — **сделать рабочим вход и деплой под Telegram**, оставив код MAX нетронутым («спящим»), и развернуть проект в прод на собственном VPS.

Ключевой факт: MAX скопировал Telegram Mini App API — алгоритм проверки `initData` (HMAC с ключом `WebAppData`) в `backend/src/auth/auth.service.ts` (`isValidMaxHash`) **идентичен** телеграмовскому. Поэтому миграция в основном механическая.

## Согласованные решения

1. **Платформа:** Telegram сейчас; код MAX (`bot-max/`, `loginWithMax`, MAX-скрипт в `index.html`) НЕ трогаем — остаётся в репозитории, но не используется.
2. **Логин:** только через Telegram, **автоматически из `initData`** при загрузке Mini App, без формы. Email/пароль и демо-организатор остаются в коде, но вне основного потока.
3. **Деплой:** собственный VPS `2.26.100.135` (Ubuntu 24.04, SSH `root`, ключ `~/.ssh/tgdeploy`). НЕ Vercel/Render.
4. **Домен:** `dobroclub.online` → A → `2.26.100.135`. На момент написания **NXDOMAIN** (DNS не распространился). `buymytag.online` уже на этом IP — это чужой проект, не трогаем.
5. **Ветка:** работаем и деплоим с `dev`. Авто-деплой триггерится на push в `dev`.
6. **Порядок:** сейчас делаем только код (Фаза 1) и артефакты деплоя (Фаза 2). Сервер (Фаза 3) и прод-запуск (Фаза 4) — позже, когда будут доступы.

## Состояние сервера (recon, read-only)

- Ubuntu 24.04.4, Docker 29.4.0, Docker Compose v5.1.3, nginx 1.24.0 (host-level, active), certbot 2.9.0 — всё установлено.
- Запущены чужие контейнеры: `tgtransfernick-postgres` (5432, localhost), `tgtransfernick-redis` (6379, localhost), `cli-proxy-api`. **Не трогаем.**
- host-nginx владеет портами **80/443**, обслуживает `buymytag.online` и `admin.buymytag.online` (с SSL). Порт **3000 занят**.
- RAM **2 ГБ, свободно ~1 ГБ** → сборка Docker-образов рискует упасть по памяти; нужен swap (Фаза 3).

## Целевая архитектура (прод)

```
Telegram ─▶ host-nginx (80/443, общий с buymytag)
              server_name dobroclub.online:
                location /      → статика /var/www/dobroclub/dist (Vite build)
                location /api/  → proxy_pass http://127.0.0.1:3001/  (срезает /api)

docker compose (наши новые контейнеры):
   backend (NestJS) → 127.0.0.1:3001
   bot     (Telegraf, long-polling) → публичный порт не нужен
БД: Supabase (внешняя). Свои postgres/redis НЕ поднимаем.
```

- Маршрутизация **path-based**: `nginx location /api/ { proxy_pass http://127.0.0.1:3001/; }` — trailing slash срезает префикс `/api`, бэкенд получает запросы в корень (`/auth/...`). **Backend-код под роутинг не меняем.** Доп. поддомен и доп. DNS-запись не нужны.
- Frontend — статика, отдаётся host-nginx напрямую (без своего контейнера) — экономит RAM.
- `VITE_API_BASE_URL = https://dobroclub.online/api`.

## Фаза 1 — Код: миграция на Telegram (делаем сейчас)

### 1.1 Prisma (`backend/prisma/schema.prisma`)
- В модель `User` добавить: `telegramUserId String? @unique @map("telegram_user_id")` (рядом с `maxUserId`).
- Миграция `add_telegram_user_id`. На прод применяется через `prisma migrate deploy` (Фаза 4).

### 1.2 Backend (`backend/src/auth/`)
- Выделить общую функцию проверки `verifyWebAppInitData(initData: string, botToken: string): boolean` (тот же алгоритм, что в `isValidMaxHash`). `loginWithMax` рефакторится на её использование **без изменения поведения** (тот же результат для MAX).
- Новый метод `loginWithTelegram(dto)`: проверка по `TELEGRAM_BOT_TOKEN`, парсинг `user`, **upsert `User` по `telegramUserId`** (email-плейсхолдер `${id}@telegram.placeholder`), роль `volunteer`, выдача того же внутреннего JWT (7д).
- Новый эндпоинт `POST /auth/telegram-login` в `auth.controller.ts` + `TelegramAuthDto` (Swagger), по аналогии с `max-login`.
- Env: добавить `TELEGRAM_BOT_TOKEN`.

### 1.3 Backend CORS (`backend/src/main.ts`)
- В `origin` добавить `https://dobroclub.online`. Существующие записи оставить.

### 1.4 Frontend
- Новый `frontend/src/lib/telegram-sdk.ts`: `getTelegramInitData()` из `window.Telegram?.WebApp?.initData`; вызвать `window.Telegram.WebApp.ready()` и `expand()` при старте.
- `frontend/src/app/auth/page.tsx` (или точка входа): при загрузке, если есть Telegram `initData` → сразу `POST /auth/telegram-login`, сохранить JWT, перейти в приложение, **без показа формы**. Если `initData` нет (открыто вне Telegram) → экран «Откройте приложение в Telegram». Логика MAX/email остаётся в коде, но не в основном UI-потоке.
- `index.html` уже грузит `telegram-web-app.js` — менять не нужно.

## Фаза 2 — Env-плейсхолдеры + артефакты деплоя (делаем сейчас)

### 2.1 Env-шаблоны (gitignored реальные `.env`, в репо — `*.env.example`/комментированные плейсхолдеры)
- `backend/.env`: `PORT=3001`, `TELEGRAM_BOT_TOKEN`, `MINI_APP_URL=https://dobroclub.online`, `JWT_INTERNAL_SECRET`, `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_WEBHOOK_SECRET`.
- `frontend/.env`: `VITE_API_BASE_URL=https://dobroclub.online/api`, `VITE_API_MODE=real`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- `bot-telegram/.env`: `TG_BOT_TOKEN`, `MINI_APP_URL=https://dobroclub.online`, `PORT=10000`.

### 2.2 Артефакты деплоя (файлы в репо, без выполнения на сервере)
- `docker-compose.prod.yml`: сервисы `backend` (порт `127.0.0.1:3001:3001`, env_file, restart) и `bot` (env_file, restart). Без своих postgres/redis.
- `deploy/nginx/dobroclub.online.conf`: server-блок (location `/` → статика, `/api/` → 127.0.0.1:3001) — готов под certbot.
- `deploy/setup-swap.sh`: создание 4 ГБ swapfile (идемпотентно).
- `deploy/deploy.sh`: на сервере — `git pull`, `npm ci && npm run build` фронта → копирование `dist` в `/var/www/dobroclub/dist`, `docker compose -f docker-compose.prod.yml up -d --build`, `prisma migrate deploy`.
- `.github/workflows/deploy.yml`: на push в `dev` → SSH на сервер → `deploy/deploy.sh`. Секреты GH: `SSH_HOST`, `SSH_USER`, `SSH_KEY`.
- `DEPLOY.md`: пошаговый runbook (см. Фаза 4).

## Фаза 3 — Подготовка сервера (позже, требует только SSH)
- Swapfile 4 ГБ; `git clone` репо в `/opt/dobroclub`; nginx HTTP server-блок для `dobroclub.online` (готов под cert); `buymytag` не трогаем.

## Фаза 4 — Прод-запуск (БЛОКИРОВАНО доступами)
Требуется от пользователя: `TG_BOT_TOKEN` (@BotFather), Supabase `DATABASE_URL`/`DIRECT_URL` + URL/anon key, и чтобы `dobroclub.online` резолвился.
Шаги runbook:
1. Заполнить `.env` на сервере реальными значениями.
2. `bash deploy/setup-swap.sh`.
3. `prisma migrate deploy` + (опц.) `npm run seed` — через Supabase MCP (после OAuth) или по connection string.
4. `docker compose -f docker-compose.prod.yml up -d --build`; собрать фронт → `/var/www/dobroclub/dist`.
5. Включить nginx server-блок, `certbot --nginx -d dobroclub.online` (после резолва DNS).
6. В @BotFather: Mini App URL = `https://dobroclub.online`, кнопка меню.

## Вне scope
- `bot-max/`, `loginWithMax` (поведение), MAX-скрипт в `index.html` — не меняем.
- Чужие контейнеры/сайты на сервере (`tgtransfernick`, `buymytag`) — не трогаем.
- Своя БД/redis на сервере — не поднимаем.

## Риски и заметки
- **DNS:** `dobroclub.online` пока NXDOMAIN — SSL и финальная проверка Mini App невозможны до резолва.
- **RAM 2 ГБ:** сборка может OOM — обязателен swap; альтернатива на будущее — сборка образов в CI и pull на сервере.
- **Старый Supabase в коде:** в `main.ts` CORS и где-то в env зашит старый проект `mvqcvuhuhngolsewmlob.supabase.co` — при подключении новой базы проверить и обновить все ссылки на новый проект.
- **Порт:** `app.listen(PORT ?? 3000)` — обязательно задать `PORT=3001` в `backend/.env`, т.к. 3000 на сервере занят.

## Проверка (по фазам)
- Фаза 1: `cd backend && npm run build && npm run test`; `cd frontend && npm run build` — проходят.
- Фаза 4: открыть бота в Telegram → Mini App грузится по HTTPS → авто-логин создаёт `User` с `telegramUserId` → данные из Supabase отображаются.

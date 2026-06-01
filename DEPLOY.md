# Деплой «Добро» (Telegram edition) — dobroclub.online

**Статус: РАЗВЁРНУТО и работает.** https://dobroclub.online (HTTPS), бот [@dobro_club_bot](https://t.me/dobro_club_bot).

## Инфраструктура

- Сервер: `2.26.100.135` (Ubuntu 24.04), SSH `root`, ключ `~/.ssh/tgdeploy`.
- host-nginx обслуживает `dobroclub.online` рядом с чужим `buymytag.online` (не трогаем).
- Наши контейнеры (docker compose, `/opt/dobroclub`): `dobro-backend` (NestJS, 127.0.0.1:3001), `dobro-bot` (Telegram).
- Фронт — статика в `/var/www/dobroclub/dist`, отдаёт host-nginx. Маршрут `/api/` → бэкенд (срезает префикс).
- БД — Supabase проект `dobro` (`pykfcxpfpdrtuxdnyjll`), eu-west-1. Схема применена + засеяна.
- SSL — Let's Encrypt (certbot, авто-продление).
- Бот: кнопка меню Mini App = `https://dobroclub.online`.

## Обновление (CI)

Авто-деплой `.github/workflows/deploy.yml` — на push в `dev`: фронт собирается на раннере GitHub,
код+статика едут на сервер по SSH (rsync), на сервере `docker compose up --build` + `prisma db push` + reload nginx.

**Чтобы включить — добавь в GitHub секреты** (Settings → Secrets and variables → Actions):
- `SSH_HOST` = `2.26.100.135`
- `SSH_USER` = `root`
- `SSH_KEY` = всё содержимое приватного ключа `~/.ssh/tgdeploy`
- `SUPABASE_ANON_KEY` = anon key проекта Supabase

`.env`-файлы на сервере rsync не трогает (`--exclude .env`).

## Обновление (вручную по SSH)

Код/статику доставить можно так же, как при первом деплое:
```bash
# код (только закоммиченное)
git archive --format=tar dev | ssh -i ~/.ssh/tgdeploy root@2.26.100.135 "tar -x -C /opt/dobroclub"
# фронт: собрать локально и отправить
cd frontend && npm run build && tar -C dist -cf - . | \
  ssh -i ~/.ssh/tgdeploy root@2.26.100.135 "rm -rf /var/www/dobroclub/dist && mkdir -p /var/www/dobroclub/dist && tar -C /var/www/dobroclub/dist -xf -"
# пересборка/перезапуск на сервере
ssh -i ~/.ssh/tgdeploy root@2.26.100.135 "bash /opt/dobroclub/deploy/deploy.sh"
```

## Секреты/конфиг на сервере

- `/opt/dobroclub/backend/.env` — `TELEGRAM_BOT_TOKEN`, `DATABASE_URL`/`DIRECT_URL` (пароль БД), `JWT_INTERNAL_SECRET`, Supabase.
- `/opt/dobroclub/bot-telegram/.env` — `TG_BOT_TOKEN`, `MINI_APP_URL`.
- Пароль БД в connection string URL-кодирован (`$`→`%24`, `?`→`%3F`).

## Полезные команды (сервер)

```bash
ssh -i ~/.ssh/tgdeploy root@2.26.100.135
cd /opt/dobroclub
docker compose -f docker-compose.prod.yml logs -f backend   # логи бэка
docker compose -f docker-compose.prod.yml logs -f bot        # логи бота
docker compose -f docker-compose.prod.yml restart backend
```

## Сиды (демо-данные)

Уже залиты (6 пользователей вкл. демо-организатора, 5 организаций, 25 событий, 4 курса, 15 ачивок).
Повторно при необходимости (локально с заполненным backend/.env):
```bash
cd backend && export DATABASE_URL=... DIRECT_URL=... && node_modules/.bin/ts-node prisma/seed.ts
```

## Проверка работоспособности

- `https://dobroclub.online` — открывается (200, HTTPS).
- `https://dobroclub.online/api/api/docs` — Swagger.
- Бот → кнопка «Открыть Добро» → Mini App грузится → авто-логин по initData (в таблице `users` появляется `telegram_user_id`).

## Заметка по безопасности

На таблицах Supabase отключён RLS (доступ к данным идёт через backend/Prisma, не напрямую anon-ключом).
Для «только для себя» это приемлемо. Включить deny-all RLS можно командой из advisor (см. Supabase → Advisors).

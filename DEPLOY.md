# Деплой «Добро» (Telegram edition) на dobroclub.online

Прод-сервер: `2.26.100.135` (Ubuntu 24.04), SSH `root`, ключ `~/.ssh/tgdeploy`.
host-nginx уже обслуживает `buymytag.online` — мы добавляемся рядом, его не трогаем.
БД — Supabase проект `dobro` (ref `pykfcxpfpdrtuxdnyjll`), схема уже применена.

## Что нужно от тебя (секреты)

1. **Пароль БД Supabase** — Supabase → проект `dobro` → Project Settings → Database → Database password.
   Подставить вместо `[YOUR-DB-PASSWORD]` в `backend/.env` (две строки: `DATABASE_URL`, `DIRECT_URL`).
2. **Токен Telegram-бота** — от [@BotFather](https://t.me/BotFather) (`/newbot`). Подставить в
   `backend/.env` (`TELEGRAM_BOT_TOKEN`) и `bot-telegram/.env` (`TG_BOT_TOKEN`).
3. **DNS** — `dobroclub.online` должен резолвиться в `2.26.100.135` (A-запись). Проверка: `nslookup dobroclub.online`.

## Разовая настройка сервера

```bash
ssh -i ~/.ssh/tgdeploy root@2.26.100.135

# 1. Swap (для сборки на 2 ГБ RAM)
git clone https://github.com/seaG7/MAX-Dobro.git /opt/dobroclub || (cd /opt/dobroclub && git fetch && git checkout dev)
cd /opt/dobroclub && git checkout dev
bash deploy/setup-swap.sh

# 2. .env файлы на сервере (они в .gitignore, поэтому создаём вручную)
#    Скопируй локальные .env на сервер ИЛИ создай заново:
#    - /opt/dobroclub/backend/.env       (с реальным паролем БД и токеном бота)
#    - /opt/dobroclub/frontend/.env       (VITE_API_BASE_URL=https://dobroclub.online/api, VITE_API_MODE=real, supabase)
#    - /opt/dobroclub/bot-telegram/.env   (TG_BOT_TOKEN, MINI_APP_URL=https://dobroclub.online)
#    Пример копирования с локальной машины:
#      scp -i ~/.ssh/tgdeploy backend/.env      root@2.26.100.135:/opt/dobroclub/backend/.env
#      scp -i ~/.ssh/tgdeploy frontend/.env     root@2.26.100.135:/opt/dobroclub/frontend/.env
#      scp -i ~/.ssh/tgdeploy bot-telegram/.env root@2.26.100.135:/opt/dobroclub/bot-telegram/.env

# 3. nginx server-блок
cp deploy/nginx/dobroclub.online.conf /etc/nginx/sites-available/dobroclub.online
ln -sf /etc/nginx/sites-available/dobroclub.online /etc/nginx/sites-enabled/dobroclub.online
mkdir -p /var/www/dobroclub/dist
nginx -t && systemctl reload nginx
```

## Деплой (и каждое обновление)

```bash
ssh -i ~/.ssh/tgdeploy root@2.26.100.135
cd /opt/dobroclub
bash deploy/deploy.sh
```

`deploy.sh`: git pull (dev) → сборка фронта в `/var/www/dobroclub/dist` → backend+bot в Docker → `prisma db push` (синхронизация схемы) → reload nginx.

## SSL (после того как DNS зарезолвится)

```bash
certbot --nginx -d dobroclub.online
```
certbot сам добавит блок 443 и редирект с 80.

## Сиды (демо-данные: организатор, события, курсы)

После того как `backend/.env` с паролем БД готов:
```bash
cd /opt/dobroclub
docker compose -f docker-compose.prod.yml exec -T backend npx prisma db seed
```
Либо локально: `cd backend && npm run seed` (с заполненным `DATABASE_URL`).

## Telegram (@BotFather)

1. `/newbot` → получить токен (см. секреты выше).
2. `/setmenubutton` или Bot Settings → Menu Button → URL = `https://dobroclub.online`.
3. (Опц.) `/setdomain` для Login Widget — не требуется для Mini App.
4. Открыть бота → кнопка запускает Mini App → авто-логин по initData.

## Авто-деплой (GitHub Actions)

Workflow `.github/workflows/deploy.yml` деплоит на push в `dev`.
Добавь секреты в GitHub (Settings → Secrets and variables → Actions):
- `SSH_HOST` = `2.26.100.135`
- `SSH_USER` = `root`
- `SSH_KEY` = содержимое приватного ключа `~/.ssh/tgdeploy`

## Проверка работоспособности

- `https://dobroclub.online` открывается (HTTPS, без ошибок сертификата).
- `https://dobroclub.online/api/api/docs` — Swagger бэкенда.
- Открыть бота в Telegram → Mini App грузится → автоматически логинит (в БД появляется `users` с `telegram_user_id`).
- `docker compose -f docker-compose.prod.yml logs -f backend` — нет ошибок подключения к БД.

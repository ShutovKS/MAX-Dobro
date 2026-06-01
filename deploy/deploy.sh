#!/usr/bin/env bash
# Деплой dobroclub.online на сервере. Запускать из /opt/dobroclub.
# Требует заранее созданных .env: backend/.env, frontend/.env, bot-telegram/.env
set -euo pipefail

REPO_DIR=/opt/dobroclub
WEB_ROOT=/var/www/dobroclub

cd "$REPO_DIR"

echo "==> git pull (dev)"
git fetch origin dev
git reset --hard origin/dev

echo "==> Сборка фронтенда"
cd "$REPO_DIR/frontend"
if [ -f package-lock.json ]; then npm ci; else npm install; fi
npm run build
mkdir -p "$WEB_ROOT"
rm -rf "$WEB_ROOT/dist"
cp -r dist "$WEB_ROOT/dist"

echo "==> Backend + bot (docker compose)"
cd "$REPO_DIR"
docker compose -f docker-compose.prod.yml up -d --build

echo "==> Синхронизация схемы БД (prisma db push)"
# db push безопасно-идемпотентен; миграционная история не нужна.
docker compose -f docker-compose.prod.yml exec -T backend npx prisma db push --skip-generate || \
  echo "ВНИМАНИЕ: db push не выполнен (проверь DATABASE_URL в backend/.env)"

echo "==> Перезагрузка nginx"
nginx -t && systemctl reload nginx

echo "==> Готово. Контейнеры:"
docker compose -f docker-compose.prod.yml ps

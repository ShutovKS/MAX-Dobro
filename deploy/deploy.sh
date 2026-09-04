#!/usr/bin/env bash
# Серверный помощник: пересобрать и перезапустить из текущего /opt/dobroclub.
# Код и статику на сервер доставляет GitHub Actions (rsync). Этот скрипт —
# для ручного перезапуска по SSH. .env-файлы должны уже лежать на сервере.
set -euo pipefail

cd /opt/dobroclub

echo "==> Backend + bot (docker compose)"
docker compose -f docker-compose.prod.yml up -d --build

# Схема БД управляется отдельно (прод-образ backend не содержит prisma CLI/схему).
# При изменении schema.prisma синхронизируй вручную с локали:
#   cd backend && DATABASE_URL=... DIRECT_URL=... npx prisma db push
# (или через Supabase). На обычный деплой схему не трогаем.

echo "==> Перезагрузка nginx"
nginx -t && systemctl reload nginx

echo "==> Контейнеры:"
docker compose -f docker-compose.prod.yml ps

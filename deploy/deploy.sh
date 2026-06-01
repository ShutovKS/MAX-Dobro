#!/usr/bin/env bash
# Серверный помощник: пересобрать и перезапустить из текущего /opt/dobroclub.
# Код и статику на сервер доставляет GitHub Actions (rsync). Этот скрипт —
# для ручного перезапуска по SSH. .env-файлы должны уже лежать на сервере.
set -euo pipefail

cd /opt/dobroclub

echo "==> Backend + bot (docker compose)"
docker compose -f docker-compose.prod.yml up -d --build

echo "==> Синхронизация схемы БД (prisma db push)"
docker compose -f docker-compose.prod.yml exec -T backend npx prisma db push --skip-generate || \
  echo "ВНИМАНИЕ: db push не выполнен (проверь DATABASE_URL в backend/.env)"

echo "==> Перезагрузка nginx"
nginx -t && systemctl reload nginx

echo "==> Контейнеры:"
docker compose -f docker-compose.prod.yml ps

#!/usr/bin/env bash
# Создаёт 4 ГБ swap (нужно для сборки на сервере с 2 ГБ RAM). Идемпотентно.
set -euo pipefail

SWAPFILE=/swapfile
SIZE=4G

if swapon --show | grep -q "$SWAPFILE"; then
  echo "Swap уже активен:"
  swapon --show
  exit 0
fi

if [ ! -f "$SWAPFILE" ]; then
  echo "Создаю $SWAPFILE ($SIZE)..."
  fallocate -l "$SIZE" "$SWAPFILE" || dd if=/dev/zero of="$SWAPFILE" bs=1M count=4096
  chmod 600 "$SWAPFILE"
  mkswap "$SWAPFILE"
fi

swapon "$SWAPFILE"

if ! grep -q "$SWAPFILE" /etc/fstab; then
  echo "$SWAPFILE none swap sw 0 0" >> /etc/fstab
fi

echo "Готово:"
swapon --show
free -h

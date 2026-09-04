# Work Summary

Дата: 2026-05-10

## Что выполнено

- Составлена матрица регрессии по текущим frontend routes, backend modules, backend endpoints и frontend API adapters.
- Добавлен `AGENTS.md` с картой проекта, командами запуска, QA-стратегией, commit policy и правилами семантической разметки.
- `.sisyphus/` добавлен в root `.gitignore` и оставлен вне коммитов по проектному guardrail.
- Добавлена семантическая разметка на ключевые boundary-файлы backend/frontend без изменения runtime-логики.
- Исправлены backend unit spec wiring blockers для нескольких controller/service specs; backend build и unit tests проходят.
- Проверен frontend mock-mode baseline; frontend build проходит.
- Зафиксирован local startup contract: env keys, команды запуска, mock/real mode, Docker/Chrome boundaries.
- Проверены auth/profile/persona flows на уровне source/build/HTTP fallback.
- Исправлена интеграция участия в событии: frontend теперь вызывает `POST/DELETE /events/:id/participate` через общий API adapter.
- Исправлена покупка наград: frontend теперь вызывает `POST /rewards/:id/purchase` перед локальным обновлением UI.
- Исправлен real-mode mapping profile stat IDs для корректной навигации profile stats.
- Начата и исправлена content/chat regression surface: stories, reviews, event chats, assistant chat adapters/routes приведены ближе к backend contracts.

## Проверки

- `cd backend && npm run build` — проходит.
- `cd backend && npm run test -- --runInBand` — проходит, 13 suites / 15 tests.
- `cd frontend && npm run build` — проходит, остаются существующие Vite warnings по `/index.css` и размеру chunk.

## Известные ограничения окружения

- `npm run test:e2e` backend заблокирован, потому что Docker daemon недоступен на `unix:///Users/Kirill/.docker/run/docker.sock`.
- Playwright/Chrome screenshots заблокированы локальной проблемой Chrome/Comet Framework.
- `typescript-language-server` не установлен, поэтому LSP diagnostics недоступны; проверка выполнялась через build/test.

## Коммиты

- Коммиты сделаны без `Co-authored-by` и AI trailers.
- `.sisyphus/` не коммитился, так как проектный guardrail требует держать его ignored и вне git history.

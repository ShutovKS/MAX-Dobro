# Issues

## 2026-05-10 Task: planning
- No blocking issue yet.
- External Supabase/MAX bot credentials may be unavailable; classify as boundary instead of blocking local regression.

## 2026-05-10 Task 1 regression matrix
- `frontend/src/lib/api.ts:9-15` bypasses real backend implementations for organizer and stories functions even when `VITE_API_MODE=real`; classified as implemented/broken pending Task 8/9/10/11 verification.
- Assistant chat frontend route exists, but current discovered frontend API functions do not call `/assistant-chat/messages`; classified as partial/WIP for Task 8.

## 2026-05-10 Task 14 repository hygiene
- Patch tooling in this session was sensitive to decorated file reads, so edits should stay tightly scoped to exact raw file contexts when repeating this task pattern.

## 2026-05-10 Task 14 fix note
- Stable `context:` tags replaced the earlier generic markers, and evidence now records the actual `.gitignore`, `AGENTS.md`, grep, status, and build results.

## 2026-05-10 Task 2 backend baseline
- `npm run test:e2e` is currently an environment boundary in this workstation: Jest global setup fails before tests because Docker daemon is not running at `unix:///Users/Kirill/.docker/run/docker.sock`.
- TypeScript LSP diagnostics could not run because `typescript-language-server` is not installed; use `npm run build` as the available TypeScript verification until LSP tooling is installed.

## 2026-05-10 Task 3 frontend baseline
- Playwright browser QA is currently blocked on this workstation because the MCP expects a local Google Chrome binary at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`; `npx playwright install chrome` failed due to sudo requirements, so screenshots and browser console capture could not be produced.
- TypeScript LSP diagnostics remain unavailable because `typescript-language-server` is not installed; frontend verification fell back to `npm run build` plus live HTTP reachability checks.

## 2026-05-10 Task 4 local startup contract
- `npm run test:e2e` remains blocked on this workstation because Docker daemon is unavailable at `unix:///Users/Kirill/.docker/run/docker.sock`; e2e global setup requires Docker Compose.
- Playwright/Chrome browser QA remains blocked from Task 3 until a compatible local Chrome/Chromium runtime is installed.

## 2026-05-10 Task 5 auth/profile regression
- Playwright/Chrome remains blocked: the MCP can launch `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`, but Chrome exits because `Comet Framework.framework/Versions/145.1.7632.3201/Comet Framework` is missing, so browser screenshots and rendered redirect assertions could not be captured.
- TypeScript LSP diagnostics remain unavailable because `typescript-language-server` is not installed; verification used frontend/backend builds and backend unit tests instead.
- `rg` is not installed in this shell (`zsh: command not found: rg`), so content searches used the available grep/read tooling for this task.

## 2026-05-10 Task 6 volunteer discovery
- `lsp_diagnostics` remains unavailable because `typescript-language-server` is not installed, so TypeScript verification still relies on `npm run build`.
- Playwright/Chrome screenshot capture remains blocked by the known local Chrome runtime failure, so this task used source-contract checks plus mock-mode HTTP route probes instead.

## 2026-05-10 Task 7 learning rewards achievements challenges
- `typescript-language-server` is still unavailable, so `lsp_diagnostics` could only confirm the known tooling boundary; frontend verification continued with `npm run build`.
- Playwright/Chrome remained blocked for these routes as well, so route coverage used mock-mode HTTP probes instead of rendered browser flows.

## 2026-05-10 Task 8 content/chat regression
- Playwright/Chrome remains blocked by the missing local Chrome `Comet Framework.framework`, so browser screenshots and rendered click-through QA could not be generated for content/chat routes.
- TypeScript LSP diagnostics remain unavailable because `typescript-language-server` is not installed; frontend/backend builds were used as the TypeScript verification fallback.

# Decisions

## 2026-05-10 Task: planning
- Use mock-mode frontend regression before real-mode frontend/backend integration.
- Keep `.sisyphus/` ignored and uncommitted.
- Commits should be periodic and clean: no Co-authored-by, no AI trailers, no explanatory commit body comments.

## 2026-05-10 Task 14 repository hygiene
- Use stable, terse markers in root docs and boundary files so later work can grep for context without scanning the whole tree.

## 2026-05-10 Task 4 local startup contract
- Keep Task 4 as documentation/evidence only: no production defaults or startup scripts were changed because current commands are sufficient when explicit local env values are supplied.
- Treat Prisma seed as disposable-database-only because it truncates application tables with cascading resets.

## 2026-05-10 Task 7 learning rewards achievements challenges
- Fix real-mode regressions at the frontend adapter boundary when the backend contract already exists, instead of changing backend controllers or adding duplicate UI-side fallbacks.

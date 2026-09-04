<repo_map>

- `backend/` holds the NestJS API, Prisma schema, seed data, and e2e tests.
- `frontend/` holds the React app, route composition, and mock or real API adapters.
- `.sisyphus/` holds plans, evidence, and notepads. It must stay ignored and out of commits.

<execution_commands>

- Backend build: `cd backend && npm run build`
- Frontend build: `cd frontend && npm run build`
- Backend tests: `cd backend && npm run test` or `cd backend && npm run test:e2e`
- Prisma seed: `cd backend && npm run seed`

<qa_strategy>

- Use `VITE_API_MODE=mock` first to verify route and UI shape without live backend dependency.
- Use `VITE_API_MODE=real` for local integration checks when the backend and database are available.
- Keep verification focused on existing flows already represented by routes, modules, and API adapters.

<commit_policy>

- Make periodic clean commits during long work, but keep them free of `Co-authored-by` lines and AI trailers.
- Keep commits small and reviewable.
- Never commit `.sisyphus/` artifacts.

<semantic_markup>

- Add short, stable context markers at high-leverage boundaries only.
- Use HTML comments in Markdown or TSX where they belong in the file format.
- Use block comments in TypeScript and TSX when the marker needs to live near executable code.
- Use triple-slash comments in Prisma schema files.
- Keep markers concise so future grep searches can find the right boundary quickly.

<context_index>

- Backend startup and module wiring: `backend/src/main.ts`, `backend/src/app.module.ts`
- API and auth boundaries: `frontend/src/lib/api.ts`, `frontend/src/lib/auth.ts`
- Route assembly and auth entry: `frontend/src/app/page.tsx`, `frontend/src/app/auth/page.tsx`
- Schema and seed boundaries: `backend/prisma/schema.prisma`, `backend/prisma/seed.ts`

<guardrails>

- Do not change runtime behavior when adding context markers.
- Do not annotate every file, only the highest-leverage boundary points.
- Do not add dependencies, secrets, generated output, or lockfile noise.
- Do not add `Co-authored-by` lines or AI-generated trailers to any commit.

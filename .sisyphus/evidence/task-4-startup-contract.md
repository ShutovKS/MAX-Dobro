# Task 4 Local Environment and Startup Contract

Date: 2026-05-10
Scope: backend and frontend local startup, verification commands, environment keys, and workstation boundaries for later regression tasks.

## Workstation Baseline

- Repository root: `/Volumes/T7 Shield/Projects/MAX-Dobro`.
- Node.js observed locally: `v22.18.0`.
- npm observed locally: `10.9.3`.
- Docker CLI is installed, but Docker daemon is unavailable at `unix:///Users/Kirill/.docker/run/docker.sock`; this currently blocks backend e2e global setup.
- `.sisyphus/` is ignored by `.gitignore` and must stay uncommitted.

## Backend Environment Keys

From `backend/.env.example`:

| Key | Example/default shape | Local startup note |
| --- | --- | --- |
| `PORT` | `3001` | Set this explicitly for the backend. `backend/src/main.ts` falls back to `3000` if unset, but the documented local API port is `3001`. |
| `MAX_BOT_TOKEN` | placeholder bot token | Required for MAX login validation in real auth paths; use only a real secret in local `.env`, never in evidence. |
| `MINI_APP_URL` | placeholder mini-app URL | Required for registered MAX mini-app URL in real auth paths. |
| `JWT_INTERNAL_SECRET` | generated secret placeholder | Generate locally with `openssl rand -base64 32`; do not commit the generated value. |
| `DATABASE_URL` | `postgresql://testuser:testpassword@db:5432/testdb?schema=public` | Prisma datasource URL. For host-local commands, point it at the reachable local/test database. |
| `DIRECT_URL` | `postgresql://testuser:testpassword@localhost:5432/testdb?schema=public` | Prisma direct URL for migrations. Required by Prisma config even during install/generate. |
| `SUPABASE_URL` | Supabase project URL placeholder | Required for real Supabase-backed flows. |
| `SUPABASE_ANON_KEY` | Supabase anon key placeholder | Public anon key for Supabase client setup. |
| `SUPABASE_WEBHOOK_SECRET` | webhook secret placeholder | Required for webhook validation paths. |

## Frontend Environment Keys

From `frontend/.env.example`:

| Key | Example/default shape | Local startup note |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:3001` | Real-mode frontend API target. |
| `VITE_API_MODE` | `mock` | Use `mock` first for route/UI baseline; use `real` only after backend and DB are available. |
| `VITE_SUPABASE_URL` | Supabase project URL placeholder | Required by real auth/Supabase client paths. |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key placeholder | Required by real auth/Supabase client paths. |

## Backend Commands

Run from repository root unless a command says otherwise.

1. Install dependencies:

   ```bash
   cd backend
   DATABASE_URL="postgresql://testuser:testpassword@localhost:5432/testdb?schema=public" DIRECT_URL="postgresql://testuser:testpassword@localhost:5432/testdb?schema=public" npm ci
   ```

   Gotcha: `npm ci` runs the `postinstall` script `prisma generate`. `backend/prisma.config.ts` loads both `DATABASE_URL` and `DIRECT_URL`, so install/generate needs syntactically valid placeholder Postgres URLs even if no database connection is attempted.

2. Generate Prisma client explicitly when needed:

   ```bash
   cd backend
   DATABASE_URL="postgresql://testuser:testpassword@localhost:5432/testdb?schema=public" DIRECT_URL="postgresql://testuser:testpassword@localhost:5432/testdb?schema=public" npm run prisma:generate
   ```

3. Build:

   ```bash
   cd backend
   npm run build
   ```

4. Unit tests:

   ```bash
   cd backend
   npm run test -- --runInBand
   ```

5. Development server:

   ```bash
   cd backend
   PORT=3001 npm run start:dev
   ```

6. Production-style local server after build:

   ```bash
   cd backend
   PORT=3001 npm run start:prod
   ```

7. Database migration for a safe local/test database only:

   ```bash
   cd backend
   DATABASE_URL="postgresql://testuser:testpassword@localhost:5432/testdb?schema=public" DIRECT_URL="postgresql://testuser:testpassword@localhost:5432/testdb?schema=public" npm run migrate:dev
   ```

8. Seed only against a disposable local/test database:

   ```bash
   cd backend
   DATABASE_URL="postgresql://testuser:testpassword@localhost:5432/testdb?schema=public" DIRECT_URL="postgresql://testuser:testpassword@localhost:5432/testdb?schema=public" npm run seed
   ```

   Boundary: `backend/prisma/seed.ts` truncates many application tables with `TRUNCATE ... RESTART IDENTITY CASCADE`; do not run it against a non-test database.

9. E2E tests, when Docker daemon is available:

   ```bash
   cd backend
   npm run test:e2e
   ```

   Boundary: current workstation cannot run this because e2e `global-setup.ts` shells out to `docker-compose -f test/docker-compose.yml down --volumes` and `up -d`, then runs `npx prisma migrate deploy`. `docker info` currently reports it cannot connect to the Docker daemon at `unix:///Users/Kirill/.docker/run/docker.sock`.

## Frontend Commands

1. Install dependencies:

   ```bash
   cd frontend
   npm ci
   ```

2. Build:

   ```bash
   cd frontend
   npm run build
   ```

3. Mock-mode development server:

   ```bash
   cd frontend
   VITE_API_MODE=mock VITE_API_BASE_URL=http://localhost:3001 npm run dev -- --host 127.0.0.1 --port 4174
   ```

4. Real-mode development server:

   ```bash
   cd frontend
   VITE_API_MODE=real VITE_API_BASE_URL=http://localhost:3001 npm run dev -- --host 127.0.0.1 --port 4174
   ```

5. Preview a built frontend when needed:

   ```bash
   cd frontend
   npm run build
   npm run preview -- --host 127.0.0.1 --port 4174
   ```

## Suggested Mock-Mode Verification Sequence

Use this first because it avoids live backend, database, MAX, and Supabase dependencies.

1. `cd frontend && npm ci`
2. `cd frontend && npm run build`
3. `cd frontend && VITE_API_MODE=mock VITE_API_BASE_URL=http://localhost:3001 npm run dev -- --host 127.0.0.1 --port 4174`
4. Probe representative routes over HTTP while the Vite server is running, for example `/auth`, `/onboarding`, and `/app/home`.

Known result inherited from Task 3: frontend build passes; mock-mode Vite startup served key route entry URLs successfully via HTTP probes. Playwright screenshot/browser-console QA remains blocked because the Playwright MCP expects Google Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`, and `npx playwright install chrome` needed sudo.

## Suggested Real-Mode Verification Sequence

Use this only with safe local/test credentials and a disposable database.

1. Ensure Docker Desktop or another Postgres instance is running. If using the e2e compose file manually, note it maps host `5433` to container `5432`; set URLs accordingly for host-local Prisma commands.
2. Create `backend/.env` from `backend/.env.example` with local/test-only values. Do not commit it.
3. `cd backend && DATABASE_URL="postgresql://testuser:testpassword@localhost:5433/testdb?schema=public" DIRECT_URL="postgresql://testuser:testpassword@localhost:5433/testdb?schema=public" npm ci`
4. `cd backend && DATABASE_URL="postgresql://testuser:testpassword@localhost:5433/testdb?schema=public" DIRECT_URL="postgresql://testuser:testpassword@localhost:5433/testdb?schema=public" npm run migrate:dev`
5. Optional, only on disposable DB: `cd backend && DATABASE_URL="postgresql://testuser:testpassword@localhost:5433/testdb?schema=public" DIRECT_URL="postgresql://testuser:testpassword@localhost:5433/testdb?schema=public" npm run seed`
6. `cd backend && PORT=3001 npm run start:dev`
7. `cd frontend && npm ci && VITE_API_MODE=real VITE_API_BASE_URL=http://localhost:3001 npm run dev -- --host 127.0.0.1 --port 4174`
8. Verify real-mode routes and API calls against `http://localhost:3001`; use mock-mode first if diagnosing UI-only issues.

## Build/Test State Inherited For Later Tasks

- Backend build and unit tests passed in Task 2 after minimal spec wiring fixes: `npm run build` and `npm run test -- --runInBand`.
- Backend e2e remains an external workstation boundary until Docker daemon is running.
- Frontend build passed in Task 3 with `cd frontend && npm run build`.
- Frontend mock-mode HTTP probes passed in Task 3 for `/auth`, `/onboarding`, and `/app/home`.
- TypeScript LSP diagnostics are unavailable on this workstation because `typescript-language-server` is not installed; builds are the current TypeScript verification fallback.

## Source/Config Change Decision

No source or config files were changed for Task 4. This task produced evidence and append-only notepad updates only.

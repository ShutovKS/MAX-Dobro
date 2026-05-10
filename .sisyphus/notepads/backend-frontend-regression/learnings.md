# Learnings

## 2026-05-10 Task: planning
- Feature source: current frontend routes + backend modules.
- QA depth: full regression.
- Include fixes for bugs discovered in existing flows.
- Semantic markup should be distributed across high-leverage project files, not only AGENTS.md.

## 2026-05-10 Task 1 regression matrix
- Frontend feature inventory is anchored in `frontend/src/app/page.tsx:233-281` plus `frontend/src/lib/constants.ts:43-85`; all 32 ROUTES constants currently have matching route rows.
- Backend AppModule imports 21 modules in `backend/src/app.module.ts:27-48`; controller discovery found 47 HTTP endpoints across 17 controller files.
- Real frontend API inventory in `frontend/src/lib/api.real.ts:187-293` exposes 24 functions; public `api.ts` adds mode-selection and several mock-only overrides that later regression tasks must verify.

## 2026-05-10 Task 14 repository hygiene
- Root `AGENTS.md` now captures repo map, execution commands, QA strategy, commit policy, semantic markup rules, and guardrails in one place.
- Distributed markers were placed only on boundary files, not leaf components, to keep grep-friendly context without changing runtime behavior.

## 2026-05-10 Task 2 backend baseline
- Backend dependency install needs Prisma env values even for local client generation because `prisma.config.ts` uses `env("DATABASE_URL")` and `env('DIRECT_URL')`; local placeholder Postgres URLs are enough for `npm ci`/`prisma generate`.
- Defined-only Nest specs for guarded controllers need guard overrides plus provider stubs for constructor services; service specs that inject Prisma need a `PrismaService` provider stub even when the test only asserts definition.
- Backend build and unit tests now pass locally after minimal spec wiring fixes: 13 suites and 15 tests passed with `npm test -- --runInBand`.

## 2026-05-10 Task 3 frontend baseline
- Frontend baseline build succeeds after installing declared dependencies with `cd frontend && npm ci`; no source changes were needed for mock-mode startup.
- Mock-mode Vite server runs locally with `cd frontend && npm run dev -- --host 127.0.0.1 --port 4174`, and key route entry URLs `/auth`, `/onboarding`, and `/app/home` all return HTML successfully.

## 2026-05-10 Task 4 local startup contract
- Local startup contract evidence created at `.sisyphus/evidence/task-4-startup-contract.md` with backend/frontend env keys, install/build/start/test commands, mock-mode and real-mode sequences, and workstation boundaries.
- Backend install requires placeholder `DATABASE_URL` and `DIRECT_URL` because `npm ci` runs Prisma generate and `backend/prisma.config.ts` reads both values.
- Backend e2e remains blocked until Docker daemon is available; frontend mock-mode build/start has prior passing evidence from Task 3.

## 2026-05-10 Task 5 auth/profile regression
- Auth/profile routing is centralized in `frontend/src/app/page.tsx`: authenticated route definitions only exist when `isAuthenticated && userData`, while unauthenticated non-auth/onboarding paths navigate to `/auth` after initialization.
- Mock persona coverage is local-only and deterministic: `organizer@test.com` yields the organization persona, while valid volunteer-style emails yield the volunteer persona; onboarding completion is stored under `onboardingComplete`.
- Real API token behavior in `frontend/src/lib/api.real.ts` prefers `internal_jwt`, falls back to Supabase `access_token`, and only adds `Authorization: Bearer ...` when a token exists.
- Backend profile endpoints live under `backend/src/auth/profile.controller.ts`, not `backend/src/profile/`, and are guarded together by `AuthGuard`.

## 2026-05-10 Task 6 volunteer discovery
- Volunteer discovery routes are mounted at `/app/home`, `/app/events/:id`, `/app/organizations`, and `/app/organizations/:id`; mock-mode curl probes on port 4175 returned `HTTP/1.1 200 OK` for each route.
- Home discovery consumes shared `fetchAllEvents()` plus `fetchMapMarkers()`, and volunteer event detail also consumes `fetchFriends()` and `fetchOrganizationById()` from the same adapter surface.
- Real volunteer event participation was previously disconnected from the backend even though `POST`/`DELETE /events/:id/participate` already existed; wiring that contract through `frontend/src/lib/api.ts` is required for later real-mode regression.

## 2026-05-10 Task 7 learning rewards achievements challenges
- The rewards detail route was wired as a UI-only purchase flow in `frontend/src/app/page.tsx`; adding a shared `purchaseReward` adapter restored the intended backend `POST /rewards/:id/purchase` contract while keeping mock mode aligned.
- Real-mode profile navigation depends on semantic stat IDs like `hours` and `karma`, so `frontend/src/lib/auth.real.ts` needs to normalize backend profile stat IDs before the profile screen can route correctly from backend-loaded data.
- For this surface, successful mock-mode route probes plus passing frontend production build were the available verification fallback because browser QA and TypeScript LSP remain environment-bound on this workstation.

## 2026-05-10 Task 8 content/chat regression
- Story API exports in `frontend/src/lib/api.ts` must stay mode-selected; hardwiring story reads to `api.mock.ts` breaks real-mode integration even when backend `/stories` exists.
- Event chat UI now depends on a persisted send contract: `POST /events/:eventId/messages` maps messages through the same backend shape as `GET /events/:eventId/messages`.
- Assistant chat has an existing local backend contract at `/assistant-chat/messages`; the frontend can call it safely while retaining the local responder as a UI fallback when auth/backend config is unavailable.

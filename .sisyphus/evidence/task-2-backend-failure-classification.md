# Task 2 Backend Failure Classification

## Summary

Backend dependencies were initially absent. A lockfile-based install was safe because `backend/package-lock.json` exists, but Prisma postinstall requires `DATABASE_URL` and `DIRECT_URL` to load `prisma.config.ts`. Re-running `npm ci` with local placeholder database URLs completed dependency installation and Prisma Client generation without requiring external Supabase or MAX credentials.

`npm run build` passes. `npm test -- --runInBand` initially failed because several generated defined-only specs did not provide constructor dependencies or guard overrides for the controllers/services under test. Those were local test configuration blockers, fixed minimally by adding provider stubs and guard overrides while preserving the existing assertions.

`npm run test:e2e` remains blocked by environment setup before any e2e test body runs. `backend/test/jest-e2e.json` invokes `global-setup.ts`, which runs `docker-compose -f test/docker-compose.yml down --volumes` and `up -d` for the Postgres test database. The command fails because the Docker daemon is not running at `unix:///Users/Kirill/.docker/run/docker.sock`.

## Classification

- Build: pass, exit 0.
- Unit tests: pass after minimal backend spec fixes, exit 0.
- E2E tests: environment boundary, exit 1. Docker daemon is unavailable before application code or test assertions execute.
- LSP diagnostics: environment/tooling unavailable. `typescript-language-server` is not installed, so diagnostics could not run; `npm run build` provided the TypeScript compilation check instead.

## Backend Files Changed

- `backend/src/challenges/challenges.controller.spec.ts`: added `ChallengesService` provider stub and `AuthGuard` override for controller construction.
- `backend/src/challenges/challenges.service.spec.ts`: added `PrismaService` provider stub for service construction.
- `backend/src/event-chats/event-chats.controller.spec.ts`: added `EventChatsService` provider stub and `AuthGuard` override for controller construction.
- `backend/src/event-chats/event-chats.service.spec.ts`: added `PrismaService` provider stub for service construction.
- `backend/src/friends/friends.controller.spec.ts`: added `FriendsService` provider stub and `AuthGuard` override for controller construction.
- `backend/src/friends/friends.service.spec.ts`: added `PrismaService` provider stub for service construction.
- `backend/src/leaderboard/leaderboard.controller.spec.ts`: added `LeaderboardService` provider stub and `AuthGuard` override for controller construction.
- `backend/src/leaderboard/leaderboard.service.spec.ts`: added `PrismaService` provider stub for service construction.
- `backend/src/organizations/organizations.controller.spec.ts`: added `OrganizationsService`, `ReviewsService`, and `EventsService` provider stubs plus `AuthGuard` and `OptionalAuthGuard` overrides for controller construction.
- `backend/src/organizations/organizations.service.spec.ts`: added `PrismaService` provider stub for service construction.

## Remaining Requirement To Unblock E2E

Start Docker locally so `docker-compose -f test/docker-compose.yml` can create the `postgres:15` test database on host port `5433`, then rerun `cd backend && npm run test:e2e`.

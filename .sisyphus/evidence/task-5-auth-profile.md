# Task 5 Auth/Profile Regression Evidence

## Scope
- Plan item: Task 5 Auth, Profile, Users, and Persona Regression.
- Source inspection covered frontend auth adapter, mock/real auth implementations, route shell, auth page, profile subroutes, real API token handling, backend auth/profile controllers, auth guard, and profile e2e coverage.
- No backend or frontend source changes were made because no local auth/profile blocker was discovered within the available environment.

## Browser Boundary
- Playwright was attempted against `http://127.0.0.1:4175/auth`.
- Result: blocked before page load by the workstation Chrome install. MCP launched `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`, then Chrome failed to load `Comet Framework.framework/Versions/145.1.7632.3201/Comet Framework`.
- Screenshot artifacts were not created: `.sisyphus/evidence/task-5-volunteer-profile.png` and `.sisyphus/evidence/task-5-unauth-redirect.png` remain unavailable for this environment reason.

## Frontend Auth And Persona Coverage
- Auth mode switch: `frontend/src/lib/auth.ts` selects `auth.real` only when `VITE_API_MODE === 'real'`, otherwise mock auth.
- Mock volunteer login: `frontend/src/lib/auth.mock.ts` returns `defaultUserData` and `mock-volunteer-token` for valid non-organizer email/password, including `volunteer@test.com` from MAX-login mock fallback.
- Mock organizer login: `frontend/src/lib/auth.mock.ts` returns `organizationUserData` and `mock-organizer-token` for `organizer@test.com` with a password.
- Onboarding state: mock auth stores `onboardingComplete` in localStorage and logout clears it.
- Anonymous protection: `frontend/src/app/page.tsx` only builds authenticated route tables when `isAuthenticated && userData`; after initialization it navigates unauthenticated non-auth/onboarding paths to `/auth`.
- Role redirect: `frontend/src/app/page.tsx` sends organization users to `/organization/dashboard` and volunteers to `/app/home` after authenticated initialization/onboarding completion.

## Profile Route Coverage
- Static/Vite HTTP fallback ran with `VITE_API_MODE=mock npm run dev -- --host 127.0.0.1 --port 4176`.
- All probed route entry URLs returned HTTP 200 with the Vite app root and module entry: `/auth`, `/onboarding`, `/app/profile`, `/app/profile/settings`, `/app/profile/editProfile`, `/app/profile/activityHistory`, `/app/profile/allAchievements`, `/app/profile/calendar`, `/app/profile/leaderboards`, `/app/profile/myCertificates`, `/app/profile/myChats`, `/app/profile/rewardsStore`, `/organization/dashboard`.
- Component availability was inspected for auth, onboarding, profile tab, settings, edit, history, achievements, calendar, leaderboard, certificates, chats, and rewards pages.
- Browser-only assertions such as actual client-side redirect location, rendered volunteer profile screenshots, and rendered organizer onboarding/dashboard behavior remain classified as browser-environment-bound due to the Chrome failure above.

## Token/Header Behavior
- `frontend/src/lib/api.real.ts` `getAuthToken` prefers `localStorage.internal_jwt`; if absent it reads the Supabase session access token; if neither exists no Authorization header is sent.
- `apiFetch` attaches `Authorization: Bearer <token>` when a token exists, always sends `Content-Type: application/json`, and allows caller headers to override defaults.
- `frontend/src/lib/auth.real.ts` login/register/getCurrentSession call `/profile/me` with `Authorization: Bearer <Supabase or internal token>`; logout clears `internal_jwt` and onboarding state.

## Backend Auth/Profile Coverage
- `backend/src/auth/auth.controller.ts` exposes `POST /auth/max-login` and `POST /auth/demo-organizer-login`.
- `backend/src/auth/profile.controller.ts` is protected by `AuthGuard` and exposes `GET /profile/me`, `/profile/me/events`, `/profile/me/certificates`, `/profile/me/rewards`, `/profile/me/achievements`, and `/profile/me/courses`.
- `backend/src/auth/guards/auth.guard.ts` accepts internal JWTs with `type: internal` and Supabase session tokens; both paths populate `request.user` or return unauthorized.
- `backend/test/profile.e2e-spec.ts` covers `/profile/me` with an overridden auth guard. Full e2e remains Docker-bound per prior task evidence.

## Commands And Results
- `npm run build` in `frontend`: passed. Vite emitted the existing chunk-size warning for a 690.13 kB bundle.
- `npm run build` in `backend`: passed.
- `npm run test -- --runInBand` in `backend`: passed, 13 suites and 15 tests.
- `lsp_diagnostics` attempted on `frontend/src/lib/api.real.ts`, `frontend/src/lib/auth.ts`, `backend/src/auth/auth.controller.ts`, and `backend/src/auth/profile.controller.ts`: unavailable because `typescript-language-server` is not installed.
- Source contract probe passed for anonymous guard, authenticated route gate, mock volunteer/organizer personas, onboarding flag, auth adapter switch, real API token/header behavior, backend auth endpoints, backend profile guard, and profile endpoint decorators.

## Readiness
- Auth/profile/persona flows are ready for later integration tasks at the static/build/local-contract level.
- Remaining verification is environment-bound: working Chrome/Chromium is needed for browser screenshots and actual rendered redirect/profile assertions; Supabase/MAX credentials and a live backend/database are needed for real login success beyond local source/build contract verification.

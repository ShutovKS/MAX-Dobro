# Backend/Frontend Regression and Bug-Fix Plan

## TL;DR
> **Summary**: Verify MAX-Dobro backend health, frontend/backend integration, and all intended features represented by current frontend routes plus backend modules. Fix only bugs discovered in those existing flows, then rerun full regression.
> **Deliverables**:
> - Route/module regression matrix
> - Passing backend unit/e2e/build checks
> - Passing frontend build and mock-mode UI regression
> - Passing real-mode frontend/backend integration regression for locally verifiable flows
> - Bug fixes for discovered existing-flow failures
> - Repository execution guidance: `.sisyphus` ignored, root `AGENTS.md`, distributed semantic context markup
> - QA evidence under `.sisyphus/evidence/`
> **Effort**: Large
> **Parallel**: YES - 5 waves
> **Critical Path**: Tasks 1 & 14 → Tasks 2-4 → Tasks 5-9 → Tasks 10-13 → Final Verification Wave

## Context
### Original Request
- “Проверить работоспособность бэкенда.”
- “Проверить, что бэкенд работает в связке с фронтендом.”
- “Проверить, что все задуманные фичи корректно работают в связке бэкенда и фронтенда.”

### Interview Summary
- Source of intended features: current frontend routes and backend modules.
- Include bug fixes for failures found during verification.
- QA depth: full regression.
- Execution hygiene requested after plan creation: make periodic clean commits without comments/trailers/co-authors, keep `.sisyphus` in `.gitignore`, add root `AGENTS.md`, and add semantic context markup across the project where useful for future context collection.
- Out of scope: new feature development not represented by current route/module surface.

### Metis Review (gaps addressed)
- Environments clarified by plan default: local-only, CI-compatible commands where available, Dockerized backend test DB where existing e2e setup requires it.
- Intended feature rule defined: routes/modules are classified as implemented/testable, implemented/broken, partial/WIP, dead/unreachable, or unsupported/no counterpart.
- Auth/personas handled explicitly: mock volunteer/organizer personas first, then real backend auth only where locally satisfiable.
- Seed data strategy set: use backend Prisma migrations/seed and e2e-created data; reset DB between direct backend scenarios where tests already support it.
- Bug-fix authority bounded: fix defects blocking existing intended behavior; do not add new features or weaken tests.

### Oracle Review (strategy incorporated)
- Use two-lane regression: frontend `VITE_API_MODE=mock` as route/UI baseline, then `VITE_API_MODE=real` for backend-integrated flows.
- Treat Supabase/MAX bot as boundary dependencies unless live credentials are explicitly available.
- Verify direct backend API before involving frontend real-mode integration.
- Use `/auth/demo-organizer-login` for organizer JWT coverage where seeded data supports it.

## Work Objectives
### Core Objective
Prove that backend APIs, frontend routes, and frontend/backend integrations work for all current intended features discoverable from route and module surfaces; repair existing-flow defects found during verification.

### Deliverables
- `.sisyphus/evidence/task-1-regression-matrix.md`
- Backend command/test output evidence
- Frontend build/mock-regression evidence
- Real-mode integration evidence
- Bug-fix commits or documented no-fix-needed results per task
- Final consolidated verification summary

### Definition of Done (verifiable conditions with commands)
- `cd backend && npm run build` exits 0.
- `cd backend && npm test -- --runInBand` exits 0.
- `cd backend && npm run test:e2e` exits 0 or any external-dependency skips are documented with exact reason and boundary test evidence.
- `cd frontend && npm run build` exits 0.
- Frontend mock-mode route regression covers every route in `frontend/src/app/page.tsx:233-281` and `frontend/src/lib/constants.ts:43-85`.
- Real-mode integration covers every route with a corresponding backend endpoint in `frontend/src/lib/api.real.ts:187-288` and backend controllers listed in this plan.
- Every fixed bug has a reproducer before fix and passing verification after fix.
- Final Verification Wave F1-F4 all approve, and user explicitly approves completion.

### Must Have
- Use frontend routes in `frontend/src/app/page.tsx:233-281` and route constants in `frontend/src/lib/constants.ts:43-85` as UI coverage source.
- Use backend modules in `backend/src/app.module.ts:27-48` as backend coverage source.
- Use frontend API mode switch in `frontend/src/lib/api.ts:5-7` and auth mode switch in `frontend/src/lib/auth.ts:4-6`.
- Use real API base in `frontend/src/lib/api.real.ts:36`.
- Keep evidence files for each task.
- Ensure `.sisyphus/` is ignored before implementation evidence is generated.
- Add a root `AGENTS.md` with operational rules, repo map, commands, commit policy, and semantic context tag conventions.
- Add bounded distributed semantic markup to high-leverage source/docs/config files, not only `AGENTS.md`.

### Must NOT Have
- Do not add new product features.
- Do not treat placeholder/WIP/dead routes as bugs until classified as intended and reachable.
- Do not require live Supabase/MAX bot credentials for the main local regression pass.
- Do not weaken tests, remove assertions, or switch real-mode failures to mock-mode as a “fix”.
- Do not broadly refactor while fixing QA failures.
- Do not change API contracts without checking frontend consumers in `frontend/src/lib/api.real.ts` and route components.
- Do not add `Co-authored-by`, AI-agent trailers, or explanatory commit comments to commits.
- Do not commit `.sisyphus/` planning/evidence artifacts.

## Verification Strategy
> ZERO HUMAN INTERVENTION - all verification is agent-executed.
- Test decision: tests-after + existing backend Jest/e2e; frontend has build-only scripts, so browser QA is agent-executed through Playwright.
- QA policy: Every task has agent-executed scenarios.
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`
- Local default ports: backend `PORT` from `backend/.env.example`; frontend Vite dev server from `frontend/package.json`.
- API mode policy: run mock-mode first, then real-mode with `VITE_API_MODE=real` and `VITE_API_BASE_URL=http://localhost:3001` unless `.env.example` dictates another port.

## Execution Strategy
### Parallel Execution Waves
> Target: 5-8 tasks per wave. <3 per wave (except final) = under-splitting.
> Extract shared dependencies as Wave-1 tasks for max parallelism.

Wave 1: Tasks 1, 14 (foundation inventory + repo hygiene/context setup)
Wave 2: Tasks 2, 3, 4 (backend baseline, frontend baseline, env/startup readiness)
Wave 3: Tasks 5, 6, 7, 8, 9 (domain/API and UI route regression groups)
Wave 4: Tasks 10, 11, 12, 13 (real-mode integrations and bug fixes)
Wave 5: Final Verification Wave F1-F4

### Dependency Matrix (full, all tasks)
- Task 1: blocks all route/module verification tasks.
- Task 14: blocks all implementation tasks that generate `.sisyphus/evidence/` or depend on repo instructions.
- Tasks 2-4: blocked by Tasks 1 and 14; block Tasks 5-13.
- Tasks 5-9: blocked by Tasks 2-4; can run in parallel.
- Tasks 10-13: blocked by relevant Tasks 5-9 and all baseline checks; can run in parallel after test data/auth strategy is ready.
- F1-F4: blocked by Tasks 1-13.

### Agent Dispatch Summary (wave → task count → categories)
- Wave 1 → 2 tasks → `deep`, `writing`
- Wave 2 → 3 tasks → `unspecified-high`, `visual-engineering`
- Wave 3 → 5 tasks → `unspecified-high`, `visual-engineering`
- Wave 4 → 4 tasks → `unspecified-high`, `visual-engineering`
- Wave 5 → 4 review tasks → `oracle`, `unspecified-high`, `deep`

## TODOs
> Implementation + Test = ONE task. Never separate.
> EVERY task MUST have: Agent Profile + Parallelization + QA Scenarios.

- [x] 1. Build Route/Module Regression Matrix

  **What to do**: Inventory every frontend route, route constant, backend module, backend controller endpoint, and frontend API function. Produce `.sisyphus/evidence/task-1-regression-matrix.md` with classification: implemented/testable, implemented/broken, partial/WIP, dead/unreachable, unsupported/no counterpart, external-boundary. Use this matrix as the single source of truth for later tasks.
  **Must NOT do**: Do not fix code in this task. Do not infer features from product wishes outside current routes/modules.

  **Recommended Agent Profile**:
  - Category: `deep` - Reason: cross-cutting inventory across frontend/backend surfaces.
  - Skills: [] - No special skill required.
  - Omitted: [`frontend-ui-ux`] - This task is inventory, not visual design.

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: [2,3,4,5,6,7,8,9,10,11,12,13] | Blocked By: []

  **References**:
  - Pattern: `frontend/src/app/page.tsx:233-281` - React Router route tree.
  - Pattern: `frontend/src/lib/constants.ts:43-85` - named route constants.
  - Pattern: `backend/src/app.module.ts:27-48` - backend module surface.
  - API/Type: `frontend/src/lib/api.ts:5-36` - mock/real API export wiring.
  - API/Type: `frontend/src/lib/api.real.ts:187-288` - real backend API consumers.
  - API/Type: `backend/src/**/*.controller.ts` - controller endpoint surface.

  **Acceptance Criteria**:
  - [ ] `.sisyphus/evidence/task-1-regression-matrix.md` exists and lists every route from `frontend/src/app/page.tsx:233-281`.
  - [ ] Matrix lists every backend module from `backend/src/app.module.ts:27-48`.
  - [ ] Matrix maps frontend API functions from `frontend/src/lib/api.real.ts:187-288` to backend endpoints or marks no counterpart.
  - [ ] Every item has one of the required classifications and a planned verification owner task.

  **QA Scenarios**:
  ```
  Scenario: Matrix completeness
    Tool: Bash
    Steps: Compare route/API/module counts in the matrix against source files using non-mutating searches; fail if any source item is missing.
    Expected: Every discovered route/module/API function appears exactly once in the matrix.
    Evidence: .sisyphus/evidence/task-1-regression-matrix-check.txt

  Scenario: WIP/dead route classification
    Tool: Bash
    Steps: Inspect matrix rows classified as WIP/dead/no counterpart and verify each has a file reference plus reason.
    Expected: No unreasoned exclusions from regression.
    Evidence: .sisyphus/evidence/task-1-regression-matrix-exclusions.txt
  ```

  **Commit**: NO | Message: `n/a` | Files: [.sisyphus/evidence/task-1-regression-matrix.md]

- [x] 2. Backend Baseline Build and Automated Tests

  **What to do**: Install backend dependencies if needed, verify environment requirements from `backend/.env.example`, run backend build, unit tests, and e2e tests. Fix any source/test/config bug that prevents intended backend modules from building or passing. Preserve or strengthen assertions; never delete failing coverage.
  **Must NOT do**: Do not touch frontend code. Do not require live Supabase/MAX bot credentials for local e2e pass unless existing tests explicitly require them.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: backend test execution plus targeted bug fixes.
  - Skills: [] - No special skill required.
  - Omitted: [`playwright`] - Backend command/test task only.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [5,10,11,12,13] | Blocked By: [1]

  **References**:
  - Pattern: `backend/package.json:11-28` - scripts: build, test, test:e2e, migrate, seed.
  - Pattern: `backend/test/jest-e2e.json` - e2e Jest config.
  - Pattern: `backend/test/global-setup.ts` - test DB setup and migrations.
  - Pattern: `backend/test/global-teardown.ts` - test DB cleanup.
  - Test: `backend/test/auth.e2e-spec.ts` - auth e2e pattern.
  - Test: `backend/test/events.e2e-spec.ts` - events e2e pattern.
  - Test: `backend/test/organizations.e2e-spec.ts` - organizations e2e pattern.
  - Test: `backend/test/stories.e2e-spec.ts` - stories e2e pattern.

  **Acceptance Criteria**:
  - [ ] `cd backend && npm run build` exits 0.
  - [ ] `cd backend && npm test -- --runInBand` exits 0.
  - [ ] `cd backend && npm run test:e2e` exits 0, or external-boundary failures are classified with exact endpoint/dependency evidence.
  - [ ] Any backend bug fix includes a before/after command transcript.

  **QA Scenarios**:
  ```
  Scenario: Backend green path
    Tool: Bash
    Steps: Run npm run build, npm test -- --runInBand, npm run test:e2e from backend/.
    Expected: All commands exit 0 or only documented external-boundary skips remain.
    Evidence: .sisyphus/evidence/task-2-backend-tests.txt

  Scenario: Backend failure classification
    Tool: Bash
    Steps: For any failing test, capture command, failing suite, stack trace, affected module, and whether fixed or external-boundary.
    Expected: Zero unclassified backend failures.
    Evidence: .sisyphus/evidence/task-2-backend-failure-classification.md
  ```

  **Commit**: YES | Message: `fix(backend): restore baseline regression` | Files: [backend/src/**, backend/test/**, backend/prisma/** if needed]

- [x] 3. Frontend Baseline Build and Mock-Mode Runtime

  **What to do**: Verify frontend environment from `frontend/.env.example`, run frontend build, then run the app in mock mode and fix route/runtime crashes that block mock-mode navigation. Confirm mock/real switch remains controlled by `VITE_API_MODE`.
  **Must NOT do**: Do not replace real API calls with mock data as a fix. Do not add new frontend test framework unless build/runtime verification proves it is necessary and bounded.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: frontend build/runtime and browser route behavior.
  - Skills: [`playwright`] - Needed for browser QA.
  - Omitted: [] - UI verification is required.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [6,7,8,9,10,11,12,13] | Blocked By: [1]

  **References**:
  - Pattern: `frontend/package.json:6-10` - scripts: dev, build, preview.
  - Pattern: `frontend/src/lib/api.ts:5-7` - mock/real API switch.
  - Pattern: `frontend/src/lib/auth.ts:4-6` - mock/real auth switch.
  - Pattern: `frontend/src/app/page.tsx:80-118` - app initialization and auth redirect.
  - Pattern: `frontend/src/app/page.tsx:284-294` - splash/error render gates.

  **Acceptance Criteria**:
  - [ ] `cd frontend && npm run build` exits 0.
  - [ ] Mock-mode app starts with no console errors that block navigation.
  - [ ] `/auth` and `/onboarding` render in unauthenticated mock mode.
  - [ ] Authenticated mock user reaches `/app/home` after login/onboarding path.

  **QA Scenarios**:
  ```
  Scenario: Mock-mode app launches
    Tool: Playwright
    Steps: Start Vite with VITE_API_MODE=mock; open /auth; authenticate using mock credentials; navigate to /app/home.
    Expected: No blocking error page; home route renders; browser console has no uncaught route/runtime exceptions.
    Evidence: .sisyphus/evidence/task-3-frontend-mock-home.png

  Scenario: Mock-mode initialization failure handling
    Tool: Playwright
    Steps: Force an invalid startup state if feasible by clearing storage and opening /app/home unauthenticated.
    Expected: App redirects to /auth instead of blank screen or crash.
    Evidence: .sisyphus/evidence/task-3-frontend-auth-redirect.png
  ```

  **Commit**: YES | Message: `fix(frontend): restore mock-mode baseline` | Files: [frontend/src/**, frontend/package.json if needed]

- [x] 4. Local Environment and Startup Contract

  **What to do**: Verify documented local startup works for backend, frontend, database, Prisma migrations, and seed data. Create evidence documenting exact commands, required env keys, default ports, and any missing docs/config bugs; fix only broken config/scripts needed for local verification.
  **Must NOT do**: Do not commit secrets. Do not change production defaults to satisfy local tests.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: multi-process environment readiness.
  - Skills: [] - No special skill required.
  - Omitted: [`playwright`] - Browser flows are in later tasks.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [5,6,7,8,9,10,11,12,13] | Blocked By: [1]

  **References**:
  - Pattern: `backend/.env.example` - backend env contract.
  - Pattern: `frontend/.env.example` - frontend env contract.
  - Pattern: `backend/package.json:11-28` - backend startup/test scripts.
  - Pattern: `frontend/package.json:6-10` - frontend startup/build scripts.
  - Pattern: `backend/prisma/seed.ts` - local seed data source.

  **Acceptance Criteria**:
  - [ ] Evidence lists backend and frontend env keys required for local mock and real modes.
  - [ ] Evidence lists exact backend/frontend startup commands used by later tasks.
  - [ ] `npm run seed` strategy is documented or replaced by existing e2e setup where more reliable.
  - [ ] No secret values are written to evidence or committed files.

  **QA Scenarios**:
  ```
  Scenario: Startup contract validation
    Tool: Bash
    Steps: Compare env examples and package scripts; document runnable local command sequence without secrets.
    Expected: Later agents can start backend and frontend from the evidence without guessing.
    Evidence: .sisyphus/evidence/task-4-startup-contract.md

  Scenario: Secret safety
    Tool: Bash
    Steps: Inspect changed files and evidence for token-like values, passwords, and private URLs.
    Expected: No secrets are present; only placeholder values from .env.example appear.
    Evidence: .sisyphus/evidence/task-4-secret-scan.txt
  ```

  **Commit**: YES | Message: `fix(config): clarify local regression startup` | Files: [backend/package.json, frontend/package.json, README.md only if already in scope; otherwise no commit]

- [x] 14. Repository Hygiene and Distributed Semantic Context Setup

  **What to do**: Add repository execution guidance before regression work starts. Ensure root `.gitignore` contains `.sisyphus/` so planning/evidence artifacts are never committed. Create root `AGENTS.md` with concise instructions for future agents: project map, backend/frontend commands, testing strategy, commit policy, no co-authors/trailers, `.sisyphus` ignore rule, and semantic context marker conventions. Add distributed semantic markup across high-leverage files so future agents can orient by grepping stable tags.
  **Must NOT do**: Do not change runtime behavior. Do not annotate every file. Do not annotate JSON, `.env*`, lockfiles, generated files, build output, migrations, or simple leaf UI/icon components. Do not add secrets. Do not commit `.sisyphus/`. Do not add `Co-authored-by` or AI-generated trailers to any commit.

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: repo instruction and context documentation.
  - Skills: [] - No special skill required.
  - Omitted: [`playwright`] - No browser QA required.

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [2,3,4,5,6,7,8,9,10,11,12,13] | Blocked By: []

  **Safe marker formats**:
  - Markdown: HTML comments, e.g. `<!-- <context:repo_map> ... </context:repo_map> -->`.
  - TypeScript/TSX: block comments near file top, e.g. `/** <context:frontend_api_boundary> ... </context:frontend_api_boundary> */`.
  - Prisma: triple-slash comments, e.g. `/// <context:data_model_boundary> ... </context:data_model_boundary>`.
  - JSON/package files: do not comment; document their semantics in `AGENTS.md` instead.

  **Target files/categories**:
  - Root docs: `README.md`, `AGENTS.md`.
  - Backend boundaries: `backend/src/main.ts`, `backend/src/app.module.ts`, major `backend/src/**/*.controller.ts`, `backend/prisma/schema.prisma`, `backend/prisma/seed.ts`, `backend/test/global-setup.ts`, `backend/test/global-teardown.ts`.
  - Frontend boundaries: `frontend/src/app/page.tsx`, `frontend/src/lib/api.ts`, `frontend/src/lib/api.real.ts`, `frontend/src/lib/api.mock.ts`, `frontend/src/lib/auth.ts`, `frontend/src/lib/auth.real.ts`, `frontend/src/lib/auth.mock.ts`, `frontend/src/lib/constants.ts`, `frontend/src/lib/types.ts`.
  - Optional high-value feature entries only when needed: feature root components under `frontend/src/app/**/page.tsx` that own major flows.

  **References**:
  - Pattern: `.gitignore:1-6` - root ignore file currently ignores `.DS_Store`, `all_sources.md`, env files.
  - Pattern: `backend/package.json:11-28` - backend commands for AGENTS.md.
  - Pattern: `frontend/package.json:6-10` - frontend commands for AGENTS.md.
  - Pattern: `backend/src/app.module.ts:27-48` - backend module map for AGENTS.md.
  - Pattern: `frontend/src/app/page.tsx:233-281` - frontend route map for AGENTS.md.
  - Pattern: `frontend/src/lib/api.ts:5-7` - API mode policy for AGENTS.md and source marker.
  - Pattern: `backend/prisma/schema.prisma` - data model context marker.
  - Pattern: `backend/test/global-setup.ts` - test infrastructure context marker.

  **Acceptance Criteria**:
  - [ ] Root `.gitignore` contains `.sisyphus/` exactly once.
  - [ ] Root `AGENTS.md` exists.
  - [ ] `AGENTS.md` includes sections/tags: `<repo_map>`, `<execution_commands>`, `<qa_strategy>`, `<commit_policy>`, `<semantic_markup>`, `<context_index>`, `<guardrails>`.
  - [ ] `AGENTS.md` documents: no `Co-authored-by`, no AI trailers, periodic commits during execution, `.sisyphus/` ignored, backend/frontend commands, mock-vs-real API mode, and distributed marker conventions.
  - [ ] High-leverage boundary files include semantic comments using `context:` tags without changing runtime logic.
  - [ ] `npm run build` for backend and frontend still passes after semantic comments are added, or any unrelated pre-existing failure is documented without blaming markup.
  - [ ] `git status --short` shows `.sisyphus/` not staged/tracked after this task.

  **QA Scenarios**:
  ```
  Scenario: Ignore rule and context guide exist
    Tool: Bash
    Steps: Run git status --short; inspect .gitignore, AGENTS.md, and target source files for required entries/tags.
    Expected: .sisyphus/ is ignored; AGENTS.md contains all required semantic tags; boundary files have valid comment-based `context:` markers.
    Evidence: .sisyphus/evidence/task-14-repo-hygiene.txt

  Scenario: Commit hygiene validation
    Tool: Bash
    Steps: If a commit is created, inspect latest commit message body and trailers.
    Expected: Commit has no Co-authored-by trailer, no AI-agent trailer, and no explanatory comments beyond the concise message.
    Evidence: .sisyphus/evidence/task-14-commit-hygiene.txt
  ```

  **Commit**: YES | Message: `docs: add semantic context map` | Files: [.gitignore, AGENTS.md, README.md, backend/src/main.ts, backend/src/app.module.ts, backend/src/**/*.controller.ts, backend/prisma/schema.prisma, backend/prisma/seed.ts, backend/test/global-setup.ts, backend/test/global-teardown.ts, frontend/src/app/page.tsx, frontend/src/lib/api*.ts, frontend/src/lib/auth*.ts, frontend/src/lib/constants.ts, frontend/src/lib/types.ts]

- [x] 5. Auth, Profile, Users, and Persona Regression

  **What to do**: Verify auth and profile backend endpoints plus frontend auth/profile routes in mock and real modes. Cover anonymous redirect, volunteer user, organizer user, profile settings/edit/history/achievements/calendar/leaderboard/certificates/chats/rewards routes. Fix broken existing auth/profile behavior, token handling, redirects, or data shape mismatches.
  **Must NOT do**: Do not require live MAX login success. Do not add new roles beyond seeded/mock personas.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: auth crosses backend, frontend state, and routing.
  - Skills: [`playwright`] - Browser persona flows required.
  - Omitted: [] - Both command and browser checks are needed.

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: [10,12,13] | Blocked By: [2,3,4]

  **References**:
  - Pattern: `backend/src/auth/auth.controller.ts` - auth endpoints including demo organizer login.
  - Pattern: `backend/src/auth/profile.controller.ts` - profile data endpoints.
  - Pattern: `backend/src/users/users.module.ts` - users module registration.
  - Pattern: `frontend/src/lib/auth.ts:4-17` - auth mode switch.
  - Pattern: `frontend/src/app/page.tsx:80-138` - session, onboarding, logout, redirect logic.
  - Pattern: `frontend/src/lib/constants.ts:67-76` - profile route constants.

  **Acceptance Criteria**:
  - [ ] Anonymous user opening an authenticated route is redirected to `/auth`.
  - [ ] Mock volunteer and mock organizer can complete auth/onboarding routing without crash.
  - [ ] Real-mode locally supported auth path returns a JWT and loads profile-dependent pages.
  - [ ] Profile subroutes render or are classified WIP/dead with evidence.
  - [ ] Token storage/Authorization header behavior matches `frontend/src/lib/api.real.ts:74-102`.

  **QA Scenarios**:
  ```
  Scenario: Volunteer auth/profile happy path
    Tool: Playwright
    Steps: Start mock-mode frontend; login as volunteer@test.com; navigate profile, settings, edit profile, achievements, calendar, leaderboard, certificates, chats, rewards.
    Expected: Each route renders intended UI or a matrix-approved WIP classification; no redirect loop or blank screen.
    Evidence: .sisyphus/evidence/task-5-volunteer-profile.png

  Scenario: Unauthenticated access protection
    Tool: Playwright
    Steps: Clear storage; open /app/profile/settings and /organization/dashboard directly.
    Expected: App redirects to /auth; no protected data is shown.
    Evidence: .sisyphus/evidence/task-5-unauth-redirect.png
  ```

  **Commit**: YES | Message: `fix(auth): restore persona regression flows` | Files: [backend/src/auth/**, backend/src/users/**, frontend/src/lib/auth*, frontend/src/app/**]

- [x] 6. Volunteer Discovery Regression: Home, Events, Organizations, Map, Friends

  **What to do**: Verify volunteer discovery flows across home, events, event detail, event participation, organization list/detail/subscription, map markers, and friends. Run direct backend endpoint checks and frontend browser flows in mock mode first; prepare real-mode evidence for integration tasks.
  **Must NOT do**: Do not invent event/organization features not represented in routes or endpoints.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: user-facing route regression with backend endpoint checks.
  - Skills: [`playwright`] - Required for route and interaction QA.
  - Omitted: [] - Browser and API evidence both needed.

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: [10,11] | Blocked By: [2,3,4]

  **References**:
  - Pattern: `frontend/src/app/page.tsx:237-249` - home/events/organizations routes.
  - Pattern: `frontend/src/lib/api.real.ts:187-197` - event list/detail API calls.
  - Pattern: `frontend/src/lib/api.real.ts:221-232` - organization list/detail/subscription API calls.
  - Pattern: `frontend/src/lib/api.real.ts:282-284` - map/friends API calls.
  - API/Type: `backend/src/events/events.controller.ts` - events endpoints.
  - API/Type: `backend/src/organizations/organizations.controller.ts` - organizations endpoints.
  - API/Type: `backend/src/map/map.controller.ts` - map markers endpoint.
  - API/Type: `backend/src/friends/friends.controller.ts` - friends endpoint.

  **Acceptance Criteria**:
  - [ ] Event list and detail routes render with seeded/mock data.
  - [ ] Participate/cancel participation works or is classified with backend/frontend failure evidence.
  - [ ] Organization list/detail and subscription toggle work or are classified with evidence.
  - [ ] Map/friends consumers either render data or are classified no-route/API-only with evidence.
  - [ ] Direct API checks for events, organizations, map-markers, and friends return expected status/data shape.

  **QA Scenarios**:
  ```
  Scenario: Volunteer discovers and opens event
    Tool: Playwright
    Steps: Login as volunteer; open /app/home or /app/events equivalent; select an event; toggle participation if UI exposes it; return to list.
    Expected: Event detail loads, participation action gives success/error toast consistent with backend response, no uncaught errors.
    Evidence: .sisyphus/evidence/task-6-event-discovery.png

  Scenario: Missing/invalid event handling
    Tool: Playwright
    Steps: Open /app/events/999999 in mock or real mode depending on data availability.
    Expected: User sees graceful not-found/error state, not blank screen or crash.
    Evidence: .sisyphus/evidence/task-6-event-not-found.png
  ```

  **Commit**: YES | Message: `fix(discovery): restore volunteer discovery flows` | Files: [backend/src/events/**, backend/src/organizations/**, backend/src/map/**, backend/src/friends/**, frontend/src/app/**, frontend/src/lib/api*]

- [x] 7. Learning, Rewards, Achievements, and Challenges Regression

  **What to do**: Verify training/course list, course detail, lesson completion, certificate route, rewards store/detail/purchase, achievements, leaderboard, and weekly challenge API behavior. Fix data contract mismatches and existing broken completion/reward flows.
  **Must NOT do**: Do not add new course content, reward catalog items, achievements, or challenge types unless seed/test data is broken and minimal fixtures are required.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: frontend learning/rewards journeys plus backend checks.
  - Skills: [`playwright`] - Browser flows required.
  - Omitted: [] - UI and API both in scope.

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: [10,12] | Blocked By: [2,3,4]

  **References**:
  - Pattern: `frontend/src/app/page.tsx:242,250-252,256,258-266` - training, course, certificate, rewards, profile subroutes.
  - Pattern: `frontend/src/lib/api.real.ts:199-219` - courses and complete course.
  - Pattern: `frontend/src/lib/api.real.ts:251-269` - leaderboard/achievements.
  - Pattern: `frontend/src/lib/api.real.ts:281,288` - rewards and weekly challenge.
  - API/Type: `backend/src/learning/learning.controller.ts` - courses endpoints.
  - API/Type: `backend/src/rewards/rewards.controller.ts` - rewards endpoints.
  - API/Type: `backend/src/achievements/achievements.controller.ts` - achievements endpoint.
  - API/Type: `backend/src/leaderboard/leaderboard.controller.ts` - leaderboard endpoint.
  - API/Type: `backend/src/challenges/challenges.controller.ts` - weekly challenge endpoint.

  **Acceptance Criteria**:
  - [ ] Training list, course detail, lesson route, and certificate route render in mock mode.
  - [ ] Real backend course list/detail/complete endpoints return frontend-compatible shape.
  - [ ] Rewards list/detail/purchase either works or failure is classified and fixed if existing intended behavior.
  - [ ] Achievements, leaderboard, and weekly challenge endpoints/routes return/render without crash.

  **QA Scenarios**:
  ```
  Scenario: Course completion happy path
    Tool: Playwright
    Steps: Login as volunteer; open /app/training; select a course; open a lesson; complete/pass it; navigate to certificate route.
    Expected: Certificate route renders for completed course and course list refresh does not crash.
    Evidence: .sisyphus/evidence/task-7-course-completion.png

  Scenario: Reward purchase insufficient/invalid case
    Tool: Playwright
    Steps: Open rewards store; open reward detail; attempt purchase with unavailable/invalid reward or insufficient points if data supports it.
    Expected: Graceful error/toast from backend or UI; no point balance corruption or crash.
    Evidence: .sisyphus/evidence/task-7-reward-error.png
  ```

  **Commit**: YES | Message: `fix(learning): restore learning and rewards flows` | Files: [backend/src/learning/**, backend/src/rewards/**, backend/src/achievements/**, backend/src/leaderboard/**, backend/src/challenges/**, frontend/src/app/**, frontend/src/lib/api*]

- [x] 8. Stories, Reviews, Assistant Chat, and Event Chats Regression

  **What to do**: Verify stories list/detail/create/like, event reviews, assistant chat messages, event chat messages, and profile chat list. Fix existing broken messaging/story/review flows and data shape mismatches.
  **Must NOT do**: Do not integrate new AI provider behavior or live chat backend beyond existing controllers. Do not require external LLM success for assistant chat unless existing local config supports it.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: mixed backend message APIs and frontend flows.
  - Skills: [`playwright`] - Browser flows required.
  - Omitted: [] - Both API and browser checks needed.

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: [10,12,13] | Blocked By: [2,3,4]

  **References**:
  - Pattern: `frontend/src/app/page.tsx:244-255,257,265` - stories, chat, event chat, profile chats routes.
  - Pattern: `frontend/src/lib/api.real.ts:271-279,285-287` - chats/stories/event messages API calls.
  - API/Type: `backend/src/stories/stories.controller.ts` - stories endpoints.
  - API/Type: `backend/src/reviews/reviews.controller.ts` - event reviews endpoints.
  - API/Type: `backend/src/assistant-chat/assistant-chat.controller.ts` - assistant chat endpoints.
  - API/Type: `backend/src/event-chats/event-chats.controller.ts` - event chat/profile chat endpoints.

  **Acceptance Criteria**:
  - [ ] Stories list/detail routes render and match API shape.
  - [ ] Story create/like/unlike behavior works or is classified/fixed.
  - [ ] Event chat and profile chat list render without crash.
  - [ ] Assistant chat local behavior is verified as success or external-boundary skip with graceful UI handling.
  - [ ] Reviews endpoints are directly checked and mapped to any UI consumer or classified API-only.

  **QA Scenarios**:
  ```
  Scenario: Story read and engagement
    Tool: Playwright
    Steps: Login as volunteer; open /app/stories; open a story detail; like/unlike if UI exposes it; return to stories.
    Expected: Story detail renders; engagement action updates or reports a graceful backend error; no crash.
    Evidence: .sisyphus/evidence/task-8-story-engagement.png

  Scenario: Chat unavailable boundary
    Tool: Playwright
    Steps: Open /app/chat in local mode without external chat credentials if required.
    Expected: Assistant chat shows graceful unavailable/error state or local response, never blank screen.
    Evidence: .sisyphus/evidence/task-8-chat-boundary.png
  ```

  **Commit**: YES | Message: `fix(content): restore stories and chat flows` | Files: [backend/src/stories/**, backend/src/reviews/**, backend/src/assistant-chat/**, backend/src/event-chats/**, frontend/src/app/**, frontend/src/lib/api*]

- [ ] 9. Organizer Dashboard and Event Management Regression

  **What to do**: Verify organizer persona routes: dashboard, organization events list, event create/edit, participants, and organization settings. Cover backend organization and event management endpoints plus frontend forms/navigation. Fix existing organizer-only flow bugs.
  **Must NOT do**: Do not add new organizer features beyond current dashboard/events/settings routes.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: form-heavy organizer UI regression.
  - Skills: [`playwright`] - Browser form QA required.
  - Omitted: [] - UI interaction is central.

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: [11,12,13] | Blocked By: [2,3,4]

  **References**:
  - Pattern: `frontend/src/app/page.tsx:267-272` - organizer routes.
  - Pattern: `frontend/src/lib/constants.ts:78-84` - organization route constants.
  - Pattern: `frontend/src/lib/api.real.ts:234-242` - organization dashboard/events/participants/details API calls.
  - API/Type: `backend/src/organizations/organizations.controller.ts` - organization dashboard/events endpoints.
  - API/Type: `backend/src/events/events.controller.ts` - create/update/delete/participants endpoints.
  - API/Type: `backend/src/auth/auth.controller.ts` - demo organizer login endpoint.

  **Acceptance Criteria**:
  - [ ] Organizer mock persona reaches `/organization/dashboard`.
  - [ ] Dashboard stats/details/events render without crash.
  - [ ] Create event form validates required fields and can publish with valid data in supported mode.
  - [ ] Edit event and participants routes render or are classified/fixed.
  - [ ] Real-mode organizer auth via demo endpoint supports locally verifiable organizer API calls.

  **QA Scenarios**:
  ```
  Scenario: Organizer creates event
    Tool: Playwright
    Steps: Login as organizer; open /organization/events/create; submit empty form; then submit valid event data from seed-compatible values.
    Expected: Empty form shows validation; valid form shows success toast and navigates to organization events list.
    Evidence: .sisyphus/evidence/task-9-organizer-create-event.png

  Scenario: Organizer participants route invalid event
    Tool: Playwright
    Steps: Open /organization/events/participants/999999 as organizer.
    Expected: Graceful empty/not-found/error state; no crash or unauthorized data leak.
    Evidence: .sisyphus/evidence/task-9-participants-invalid.png
  ```

  **Commit**: YES | Message: `fix(organizer): restore event management flows` | Files: [backend/src/organizations/**, backend/src/events/**, frontend/src/app/organization/**, frontend/src/lib/api*]

- [ ] 10. Real-Mode Volunteer Frontend/Backend Integration

  **What to do**: Start backend with local migrated/seeded database and frontend with `VITE_API_MODE=real`. Verify volunteer-facing real API calls for app initialization, events, courses, organizations, stories, profile-derived data, rewards, leaderboard, map, friends, and challenge where auth/data permits. Fix real-mode integration bugs caused by endpoint paths, response shapes, CORS, auth headers, or missing graceful error handling.
  **Must NOT do**: Do not mask real-mode failures by switching affected exports back to mock. Do not require live Supabase/MAX auth if local JWT path is unavailable; classify that boundary and verify graceful behavior.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: end-to-end browser integration with backend.
  - Skills: [`playwright`] - Required for browser E2E.
  - Omitted: [] - Full-stack verification needed.

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: [F1,F2,F3,F4] | Blocked By: [5,6,7,8,2,3,4]

  **References**:
  - Pattern: `frontend/src/lib/api.ts:5-7` - real mode selection.
  - Pattern: `frontend/src/lib/api.real.ts:36,85-112` - API base URL and fetch wrapper.
  - Pattern: `backend/src/main.ts` - CORS, validation, Swagger, listen setup.
  - Pattern: `backend/src/app.module.ts:27-48` - backend module availability.
  - Test: `.sisyphus/evidence/task-1-regression-matrix.md` - integration coverage source.

  **Acceptance Criteria**:
  - [ ] Frontend real mode points to local backend and does not call mock API for intended real-mode flows.
  - [ ] Direct browser navigation through volunteer routes has no CORS/network/base URL failures.
  - [ ] Every real API failure is fixed, classified external-boundary, or classified WIP/dead per matrix.
  - [ ] At least one positive real backend response is observed for events, courses, organizations, stories, and rewards.

  **QA Scenarios**:
  ```
  Scenario: Real-mode volunteer data load
    Tool: Playwright
    Steps: Start backend and frontend real mode; authenticate through locally supported path or inject documented local JWT/session; open /app/home, /app/training, /app/organizations, /app/stories, /app/profile.
    Expected: Pages render backend data or approved graceful empty states; network panel shows localhost backend calls with 2xx/expected 4xx only.
    Evidence: .sisyphus/evidence/task-10-real-volunteer.png

  Scenario: Backend unavailable handling
    Tool: Playwright
    Steps: Stop backend or point VITE_API_BASE_URL to invalid local port; open app route that fetches data.
    Expected: App shows error/retry UI from `frontend/src/app/page.tsx:292-294` or page-level graceful state, not blank screen.
    Evidence: .sisyphus/evidence/task-10-backend-unavailable.png
  ```

  **Commit**: YES | Message: `fix(integration): restore real-mode volunteer flows` | Files: [backend/src/**, frontend/src/**]

- [ ] 11. Real-Mode Organizer Frontend/Backend Integration

  **What to do**: Verify organizer real-mode flows using seeded organizer data and `/auth/demo-organizer-login` where available. Cover dashboard stats/details, event list, create/edit event, participants, and settings. Fix real-mode organizer API/UI mismatches.
  **Must NOT do**: Do not broaden organizer permissions or bypass authorization to make tests pass.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: real-mode browser/form integration.
  - Skills: [`playwright`] - Required for organizer E2E.
  - Omitted: [] - Full-stack browser evidence required.

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: [F1,F2,F3,F4] | Blocked By: [6,9,2,3,4]

  **References**:
  - API/Type: `backend/src/auth/auth.controller.ts` - demo organizer login.
  - API/Type: `backend/src/organizations/organizations.controller.ts` - organizer dashboard/events endpoints.
  - API/Type: `backend/src/events/events.controller.ts` - create/edit/delete/participants endpoints.
  - Pattern: `frontend/src/app/page.tsx:267-272` - organizer route mapping.
  - Pattern: `frontend/src/lib/api.real.ts:234-242` - organizer data calls.

  **Acceptance Criteria**:
  - [ ] Real-mode organizer can obtain local auth or approved test token without live external auth.
  - [ ] Dashboard and event management pages call backend endpoints and render valid data/empty states.
  - [ ] Create/edit event requests match backend DTO validation and receive expected status.
  - [ ] Participants route handles valid and invalid event IDs gracefully.

  **QA Scenarios**:
  ```
  Scenario: Real-mode organizer dashboard and event list
    Tool: Playwright
    Steps: Authenticate via demo organizer path; open /organization/dashboard and /organization/events.
    Expected: Dashboard stats/details and events list render from backend; no unauthorized loop.
    Evidence: .sisyphus/evidence/task-11-real-organizer-dashboard.png

  Scenario: Real-mode event form validation
    Tool: Playwright
    Steps: Open /organization/events/create; submit invalid form; submit valid seed-compatible form.
    Expected: Invalid submission shows validation; valid submission reaches backend and produces success/navigation or documented 4xx with fixed UI messaging.
    Evidence: .sisyphus/evidence/task-11-real-event-form.png
  ```

  **Commit**: YES | Message: `fix(integration): restore real-mode organizer flows` | Files: [backend/src/auth/**, backend/src/organizations/**, backend/src/events/**, frontend/src/app/organization/**, frontend/src/lib/api*]

- [ ] 12. Bug Fix Consolidation and Regression Re-Run

  **What to do**: Consolidate all failures discovered in Tasks 2-11, apply minimal fixes, add or update backend tests where regressions are reproducible, then rerun backend build/tests/e2e, frontend build, mock-mode browser regression, and real-mode integration smoke for all affected areas.
  **Must NOT do**: Do not leave “known failing” items without classification. Do not combine unrelated refactors into bug fixes.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: multi-area regression closure.
  - Skills: [`playwright`] - Needed for rerun browser evidence.
  - Omitted: [] - Cross-stack closure required.

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: [F1,F2,F3,F4] | Blocked By: [5,6,7,8,9,10,11]

  **References**:
  - Evidence: `.sisyphus/evidence/task-*-*.md` and `.sisyphus/evidence/task-*-*.txt` - discovered failure records.
  - Pattern: `backend/package.json:11-28` - rerun backend commands.
  - Pattern: `frontend/package.json:6-10` - rerun frontend commands.
  - Test: backend e2e specs under `backend/test/*.e2e-spec.ts` - add/adjust regression coverage only for real bugs.

  **Acceptance Criteria**:
  - [ ] All open failure records from Tasks 2-11 are fixed or classified external/WIP/dead with evidence.
  - [ ] Backend build/unit/e2e pass after fixes.
  - [ ] Frontend build passes after fixes.
  - [ ] Mock-mode and real-mode browser reruns pass for changed areas.
  - [ ] No test assertion was weakened to hide a defect.

  **QA Scenarios**:
  ```
  Scenario: Full command regression after fixes
    Tool: Bash
    Steps: Run backend build, backend unit, backend e2e, and frontend build.
    Expected: All commands exit 0 or only approved external-boundary skips remain.
    Evidence: .sisyphus/evidence/task-12-full-command-regression.txt

  Scenario: Changed-flow browser rerun
    Tool: Playwright
    Steps: Rerun browser scenarios for every frontend/backend area changed during bug fixes.
    Expected: Previously failing scenario now passes with screenshot/network evidence.
    Evidence: .sisyphus/evidence/task-12-browser-rerun.png
  ```

  **Commit**: YES | Message: `fix(regression): close backend frontend defects` | Files: [backend/src/**, backend/test/**, frontend/src/**]

- [ ] 13. Final QA Report and External Boundary Documentation

  **What to do**: Produce final agent-executable QA report summarizing route/module coverage, commands run, scenarios run, bugs fixed, remaining external-boundary/WIP/dead classifications, and exact evidence paths. Ensure no unverified intended route/module remains.
  **Must NOT do**: Do not mark external dependencies as “passed” if they were not exercised with credentials. Do not hide partial coverage.

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: concise technical QA report.
  - Skills: [] - No special skill required.
  - Omitted: [`playwright`] - Report consumes existing evidence.

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: [F1,F2,F3,F4] | Blocked By: [10,11,12]

  **References**:
  - Evidence: `.sisyphus/evidence/task-1-regression-matrix.md` - coverage matrix.
  - Evidence: `.sisyphus/evidence/task-2-backend-tests.txt` - backend baseline.
  - Evidence: `.sisyphus/evidence/task-3-frontend-mock-home.png` - mock-mode baseline.
  - Evidence: `.sisyphus/evidence/task-10-real-volunteer.png` - real-mode volunteer evidence.
  - Evidence: `.sisyphus/evidence/task-11-real-organizer-dashboard.png` - real-mode organizer evidence.
  - Evidence: `.sisyphus/evidence/task-12-full-command-regression.txt` - final rerun.

  **Acceptance Criteria**:
  - [ ] Final report exists at `.sisyphus/evidence/task-13-final-qa-report.md`.
  - [ ] Report lists every route/module classification from Task 1.
  - [ ] Report lists every bug fixed with file paths and verification evidence.
  - [ ] Report lists remaining limitations only as external-boundary/WIP/dead/no-counterpart with evidence.
  - [ ] Report includes exact command results and browser evidence paths.

  **QA Scenarios**:
  ```
  Scenario: Report completeness
    Tool: Bash
    Steps: Compare final report coverage table against Task 1 matrix and Task 12 rerun evidence.
    Expected: No route/module missing; every limitation has a classification and evidence path.
    Evidence: .sisyphus/evidence/task-13-report-completeness.txt

  Scenario: No false pass claims
    Tool: Bash
    Steps: Inspect final report for Supabase/MAX/external assistant claims; verify each is either credential-tested or marked external-boundary.
    Expected: No untested external dependency is claimed as fully passed.
    Evidence: .sisyphus/evidence/task-13-boundary-claims.txt
  ```

  **Commit**: NO | Message: `n/a` | Files: [.sisyphus/evidence/task-13-final-qa-report.md]

## Final Verification Wave (MANDATORY — after ALL implementation tasks)
> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**
> **Never mark F1-F4 as checked before getting user's okay.** Rejection or user feedback -> fix -> re-run -> present again -> wait for okay.
- [ ] F1. Plan Compliance Audit — oracle
- [ ] F2. Code Quality Review — unspecified-high
- [ ] F3. Real Manual QA — unspecified-high (+ playwright if UI)
- [ ] F4. Scope Fidelity Check — deep

## Commit Strategy
- Commit after each task only if that task changes source/test/config files.
- Message format: `fix(scope): restore existing flow` or `test(scope): cover existing integration`.
- Do not commit `.env` files, credentials, generated build output, or `.sisyphus/evidence/` unless repository convention explicitly tracks evidence.

## Success Criteria
- All planned commands and browser scenarios pass or are documented as external-boundary skips.
- All discovered existing-flow bugs are fixed or explicitly classified as out of scope/WIP with evidence.
- Final verification agents approve and user gives explicit completion approval.

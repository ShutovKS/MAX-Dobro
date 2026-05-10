# Draft: Backend Frontend Verification

## Requirements (confirmed)
- Проверить работоспособность бэкенда.
- Проверить, что бэкенд работает в связке с фронтендом.
- Проверить, что все задуманные фичи корректно работают в связке бэкенда и фронтенда.
- Source of intended features: frontend routes + backend modules discovered in code.
- Include bug fixes for discovered failures in the execution plan.
- QA depth: full regression across discovered flows.
- User requested periodic commits without commit comments/trailers/co-authors during execution.
- User requested `.sisyphus` to be kept in `.gitignore`.
- User requested `AGENTS.md` plus semantic context markup for future context collection.
- User clarified semantic markup may be added throughout the project, not only in `AGENTS.md`, to maximize future orientation speed.

## Technical Decisions
- Verification-first plan: no implementation until failures are found and explicitly scoped.
- Test strategy: use existing backend Jest/e2e infrastructure and add frontend-backend full-regression QA scenarios around discovered routes/modules.
- Failure handling: each verification task includes fix scope for bugs found in that route/module integration.

## Research Findings
- Backend entry points found: `backend/src/main.ts`, `backend/src/app.module.ts`.
- Backend configuration/scripts found: `backend/package.json`, `backend/.env.example`.
- Backend e2e infrastructure exists: `backend/test/jest-e2e.json`, `backend/test/global-setup.ts`, `backend/test/global-teardown.ts`, `backend/test/docker-compose.yml`.
- Representative backend unit/integration tests found: `backend/src/app.controller.spec.ts`, `backend/src/prisma/prisma.service.spec.ts`.
- No dedicated health endpoint was reported by exploration; verification should include available root/API readiness checks or add a health-check recommendation if missing.

## Open Questions
- Pending exploration: safe target files and marker style for project-wide semantic markup.

## Scope Boundaries
- INCLUDE: backend health, frontend-backend API integration, end-to-end feature flows.
- INCLUDE: fixing bugs discovered during backend/frontend regression verification.
- INCLUDE: execution guidance for clean commits without co-authors/comments.
- INCLUDE: planning for `.sisyphus` ignore rule, root `AGENTS.md`, and semantic context map.
- INCLUDE: planning for bounded semantic markers across high-leverage source/config/docs files.
- EXCLUDE: new feature development not represented by current frontend routes or backend modules.

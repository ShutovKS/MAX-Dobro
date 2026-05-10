# Task 6 Volunteer Discovery Regression

Date: 2026-05-10

## Scope
- Frontend routes checked: `/app/home`, `/app/events/:id`, `/app/organizations`, `/app/organizations/:id`
- Frontend data consumers checked: home events/map, event detail, organization list/detail subscription, invite friends modal
- Real API contracts checked: `/events`, `/events/:id`, `/events/:id/participate` POST/DELETE, `/organizations`, `/organizations/:id`, `/organizations/:id/subscription`, `/map-markers`, `/friends`
- Backend controllers checked: `events.controller.ts`, `organizations.controller.ts`, `map.controller.ts`, `friends.controller.ts`

## Findings
- Home discovery route uses `fetchAllEvents()` and `fetchMapMarkers()` from the shared API layer and navigates to `/app/events/:id` from cards and map markers.
- Event detail route loads `fetchEventById()`, `fetchFriends()`, `fetchMapMarkers()`, and `fetchOrganizationById()`; backend source throws `NotFoundException` for missing events.
- Organization list route uses `fetchAllOrganizations()` and `updateOrganizationSubscription()`; organization detail route uses `fetchOrganizationById()`, filters `fetchAllEvents()` by `organizationId`, and reuses subscription updates.
- Friends endpoint is auth-guarded in backend and mapped in `frontend/src/lib/api.real.ts` as `fetchFriends()`.
- Map markers endpoint returns planned events with lat/lng via `/map-markers` and is consumed by home and event detail.
- Volunteer participation backend contract existed at `POST /events/:id/participate` and `DELETE /events/:id/participate`, but the volunteer event detail page previously only toggled local UI state. This task fixed that by wiring the shared API adapter and event detail page to call the contract in both mock and real modes.
- Invalid detail handling is partial: backend returns `404` for missing events/organizations, while frontend detail pages only render fallback text when the fetch resolves to empty; there is no explicit fetch error handling path yet.

## Verification
### Frontend build
- Command: `cd frontend && npm run build`
- Result: passed twice after the participation fix.
- Note: Vite still reports the existing large-chunk warning and `/index.css` runtime-resolution warning.

### Mock-mode route probes
- Dev server command: `cd frontend && npm run dev -- --host 127.0.0.1 --port 4175`
- `curl -I http://127.0.0.1:4175/app/home` -> `HTTP/1.1 200 OK`
- `curl -I http://127.0.0.1:4175/app/events/1` -> `HTTP/1.1 200 OK`
- `curl -I http://127.0.0.1:4175/app/organizations` -> `HTTP/1.1 200 OK`
- `curl -I http://127.0.0.1:4175/app/organizations/1` -> `HTTP/1.1 200 OK`
- `curl http://127.0.0.1:4175/app/home` returned the Vite HTML shell as expected for SPA routing.

### Diagnostics boundaries
- `lsp_diagnostics` could not run because `typescript-language-server` is not installed on this workstation.
- Browser screenshots were not produced because the known Chrome/Playwright runtime boundary still applies.

## Classification
- Home discovery: ready in mock mode; real-mode contract present for events and map.
- Event detail discovery: ready after participation API wiring; real-mode invalid-detail UX still needs explicit error-state handling.
- Organization discovery: ready for list/detail/subscription contract checks; invalid-detail UX has the same frontend error-state gap.
- Friends and map discovery data: backend and frontend contracts are present and consumed by volunteer surfaces.
- Later real-mode integration remains environment-bound by local backend/auth availability and Chrome runtime for browser QA.

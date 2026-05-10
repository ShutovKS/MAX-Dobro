# Task 8 Content/Chat Regression Evidence

Date: 2026-05-10

## Coverage Summary

- `/app/stories`: `StoriesPage` reads `fetchAllStories` from `frontend/src/lib/api.ts`; the adapter now selects real `api.real.ts` in `VITE_API_MODE=real` instead of hardwiring story reads to `api.mock.ts`.
- `/app/stories/:id`: `StoryDetailPage` reads `fetchStoryById`, renders normalized backend story shape, and like/unlike buttons call `likeStory` / `unlikeStory` with optimistic rollback.
- `/app/stories/create`: `CreateStoryPage` publishes through `createStory(selectedEvent.id, text, photos[0])`; backend now exposes authenticated `POST /stories` and maps the created story back to the shared frontend shape.
- `/app/events/:id/chat`: `EventChatPage` reads `fetchEventChatMessages` and now sends via `postEventChatMessage`; backend now exposes authenticated `POST /events/:eventId/messages` and creates the event chat if missing.
- `/app/chat`: `AssistantChatPage` now attempts `fetchAssistantChatMessages` on open and `postAssistantMessage` on send. If the backend/external assistant path is unavailable, the existing local responder remains a UI fallback. This is classified as integrated/local-fallback rather than external LLM verified; no new AI provider was added.
- `/app/profile/myChats`: `MyChatsPage` reads `fetchMyChats`; real adapter preserves the `icon` field expected by the existing UI instead of returning an unused `Icon` field.
- Event reviews: `ReviewModal` now passes rating/comment to `ActivityHistoryPage`, which calls `createEventReview` against backend `POST /events/:eventId/reviews`.

## Backend Controller/Service Coverage

- `backend/src/stories/stories.controller.ts`: verified `GET /stories`, `GET /stories/:id`, `POST /stories`, `POST /stories/:id/like`, and `DELETE /stories/:id/like` route contracts.
- `backend/src/stories/stories.service.ts`: verified shared story mapper returns `timestamp`, `event.name`, `likes`, `comments`, `commentsData`, and `isLiked`; added create path for existing story-create UI.
- `backend/src/reviews/reviews.controller.ts`: verified `GET /events/:eventId/reviews` and `POST /events/:eventId/reviews`; frontend now calls the existing create contract.
- `backend/src/assistant-chat/assistant-chat.controller.ts`: verified `GET /assistant-chat/messages` and `POST /assistant-chat/messages`; frontend now calls the existing contract but external LLM success is not required because the backend implementation is local heuristic/database-backed.
- `backend/src/event-chats/event-chats.controller.ts`: verified `GET /profile/chats`, `GET /events/:eventId/messages`, and added/verified `POST /events/:eventId/messages` for persisted sends.

## Source Contract Checks

- Grep confirmed no remaining `fetchAllStories = mockApi` or `fetchStoryById = mockApi` bypass in `frontend/src/lib/api.ts`.
- Grep confirmed route usage of `createStory`, `createEventReview`, `postEventChatMessage`, `fetchAssistantChatMessages`, and `postAssistantMessage` in the relevant route components.
- Grep confirmed no `TODO`, `FIXME`, or `HACK` markers in changed chat files or backend event-chat files.

## Commands

- `cd frontend && npm run build`
  - Result: PASS. Vite built 1898 modules and emitted `dist/`; warning only for `/index.css` runtime resolution and chunk size over 500 kB.
- `cd backend && npm run build`
  - Result: PASS. Nest build completed successfully.
- `cd backend && npm run test -- --runInBand`
  - Result: PASS. 13 test suites passed, 15 tests passed.
- `lsp_diagnostics` on changed frontend/backend files and source directories
  - Result: UNAVAILABLE. `typescript-language-server` is not installed (`Command not found: typescript-language-server`).
- Playwright `browser_navigate` attempt
  - Result: BLOCKED. Chrome launches from `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` then exits because `Comet Framework.framework/Versions/145.1.7632.3201/Comet Framework` is missing. No screenshots produced.

## Remaining Boundaries

- Browser-rendered QA remains environment-blocked by the local Chrome framework error.
- Assistant chat is wired to the existing backend assistant-chat API with local UI fallback; no external LLM provider was integrated or required.
- Real database/API runtime was not exercised because this task verification used build/unit/source-contract checks plus mock-compatible frontend build.

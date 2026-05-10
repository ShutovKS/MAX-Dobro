# Task 7 Learning, Rewards, Achievements, and Challenges Regression

## Scope covered

- Frontend routes reviewed: `/app/training`, `/app/courses/:id`, `/app/courses/:id/lesson/:subId`, `/app/courses/:id/certificate`, `/app/rewards/:id`, `/app/profile/rewardsStore`, `/app/profile/allAchievements`, `/app/profile/leaderboards`.
- Frontend API functions reviewed: `fetchAllCourses`, `fetchCourseById`, `completeCourse`, `fetchRewards`, `purchaseReward`, `fetchUserAchievements`, `fetchLeaderboardData`, `fetchWeeklyChallenge`.
- Backend controllers/services reviewed: `learning.controller.ts`, `learning.service.ts`, `rewards.controller.ts`, `rewards.service.ts`, `achievements.controller.ts`, `achievements.service.ts`, `leaderboard.controller.ts`, `leaderboard.service.ts`, `challenges.controller.ts`, `challenges.service.ts`, plus `auth.service.ts` and `profile.controller.ts` for profile/course/achievement contracts.

## Fixes made

### 1. Reward purchase flow now calls the API before mutating UI state

- Added `purchaseReward` to `frontend/src/lib/api.real.ts` and `frontend/src/lib/api.mock.ts`.
- Re-exported `purchaseReward` from `frontend/src/lib/api.ts`.
- Updated `frontend/src/app/page.tsx` so `/app/rewards/:id` awaits `purchaseReward(rewardId)` before marking the reward as purchased and redirecting.
- Updated `frontend/src/app/profile/rewards/detail/page.tsx` so `onPurchase` is asynchronous.

Reason: the previous wrapper only set `isPurchased` locally and never called `POST /rewards/:id/purchase`, so real-mode reward purchases could not persist or spend karma.

### 2. Real-mode profile stat IDs now match profile navigation expectations

- Added a small adapter map in `frontend/src/lib/auth.real.ts` converting backend profile stat IDs `1 -> hours` and `2 -> karma`.

Reason: `frontend/src/app/tabs/profile/page.tsx` routes by stat IDs like `hours` and `karma`, while `backend/src/auth/profile.controller.ts` returned numeric IDs as strings. Without the adapter, real-mode profile stat taps would not open activity history or rewards store correctly.

## Contract review notes

### Learning

- Real course list/detail frontend uses `GET /profile/me/courses` via `fetchAllCourses` and local filtering in `fetchCourseById`, not `GET /courses/:id`.
- Course completion frontend uses `POST /courses/:id/complete` via `completeCourse` from the lesson page final-test flow.
- Backend completion contract returns `{ isPassed, score, totalQuestions }`, which matches the lesson page expectation.
- Certificate route is UI-driven from refreshed course list state after completion.

### Rewards

- Rewards list/detail frontend uses `GET /rewards` and relies on `isPurchased` in returned items.
- Backend `RewardsService.findAll` does provide `isPurchased` for authenticated users.
- Purchase flow bug was fixed as described above.

### Achievements

- Achievements page uses `fetchUserAchievements()` from `/profile/me/achievements`.
- Backend `AuthService.getUserAchievements` returns a richer progress-oriented shape with `unlocked`, `unlockedDate`, `progress`, `target`, and `cta`, which matches the frontend achievements page better than `/achievements` alone.

### Leaderboard

- Leaderboard page uses `fetchLeaderboardData(period)` and consumes `topUsers`.
- Backend leaderboard controller/service returns `{ topUsers, currentUser }`, which matches the frontend adapter contract.

### Weekly challenge

- Profile page uses `fetchWeeklyChallenge()`.
- Backend challenges service returns `title`, `description`, `reward`, `progress`, `target`, `filterCategory`, `isCompleted`.
- Frontend type also expects `icon`; the real adapter already tolerates missing `icon` and maps a default icon, so this remains compatible.

## Verification

### Frontend build

Command:

```bash
cd frontend && npm run build
```

Result:

- Passed twice after the two frontend fixes.
- Vite warning persists about large chunks and `/index.css` runtime resolution, but the build exits successfully.

### LSP diagnostics

Attempted on all changed frontend files.

Result:

- Blocked by missing `typescript-language-server` in this workstation.
- Fallback verification used successful `npm run build`.

### Mock-mode route probes

Frontend dev server started with:

```bash
cd frontend && npm run dev -- --host 127.0.0.1 --port 4174
```

HTTP probe results:

- `/app/training` -> `200`
- `/app/courses/1` -> `200`
- `/app/courses/1/lesson/1` -> `200`
- `/app/courses/1/certificate` -> `200`
- `/app/rewards/1` -> `200`
- `/app/profile/rewardsStore` -> `200`
- `/app/profile/allAchievements` -> `200`
- `/app/profile/leaderboards` -> `200`

### Browser QA boundary

- Playwright/Chrome screenshots remain blocked by the known local Chrome runtime failure recorded in prior tasks.
- This task therefore used source-contract checks plus mock-mode HTTP route probes as the available fallback.

## Changed files

- `frontend/src/lib/api.real.ts`: added real `purchaseReward` API call.
- `frontend/src/lib/api.mock.ts`: added mock `purchaseReward` behavior.
- `frontend/src/lib/api.ts`: re-exported `purchaseReward`.
- `frontend/src/app/page.tsx`: reward detail wrapper now awaits purchase persistence before local UI update.
- `frontend/src/app/profile/rewards/detail/page.tsx`: purchase callback is asynchronous.
- `frontend/src/lib/auth.real.ts`: normalized backend profile stat IDs to the IDs expected by the profile UI.

## Remaining boundaries

- Real-mode end-to-end browser validation remains blocked by the local Chrome/Playwright runtime issue.
- Backend e2e remains blocked by the known Docker daemon dependency, but no backend source changes were required for this task.
- The frontend learning, rewards, achievements, leaderboard, and weekly challenge surfaces are ready for later real-mode integration checks at the adapter/contract level after the two fixed regressions above.

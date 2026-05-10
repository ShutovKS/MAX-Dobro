# Task 1 Route/Module Regression Matrix

Generated for plan `.sisyphus/plans/backend-frontend-regression.md`, Task 1. Application source was not modified.

## Counts
- Frontend routes: 37
- Route constants: 32
- Backend modules: 21
- Backend endpoints: 47
- Frontend API/auth functions and public wiring entries: 38
- Classification totals: dead/unreachable=4, external-boundary=12, implemented/broken=6, implemented/testable=122, partial/WIP=10, unsupported/no counterpart=21

## Verification Owner Rule
Every matrix row has an owner in Tasks 2-13. External services are assigned to Task 13 unless a local auth/profile flow must exercise their boundary earlier.

## Frontend Routes
| ID | Route pattern | Source | Surface | Classification | Owner |
| --- | --- | --- | --- | --- | --- |
| FR-01 | / | frontend/src/app/page.tsx:273 | Redirect root to role-appropriate authenticated route | implemented/testable | Task 3 |
| FR-02 | /organization | frontend/src/app/page.tsx:274 | Redirect organization base to organizer dashboard | implemented/testable | Task 9 |
| FR-03 | /auth | frontend/src/app/page.tsx:278; frontend/src/lib/constants.ts:52 | Authentication page | external-boundary | Task 5 |
| FR-04 | /onboarding | frontend/src/app/page.tsx:279; frontend/src/lib/constants.ts:53 | Onboarding page | implemented/testable | Task 5 |
| FR-05 | /app -> /app/home | frontend/src/app/page.tsx:237-241 | Authenticated app shell and default volunteer redirect | implemented/testable | Task 3 |
| FR-06 | /app/home | frontend/src/app/page.tsx:241; frontend/src/lib/constants.ts:45 | Volunteer home/events discovery tab | implemented/testable | Task 6 |
| FR-07 | /app/training | frontend/src/app/page.tsx:242; frontend/src/lib/constants.ts:46 | Course/training tab | implemented/testable | Task 7 |
| FR-08 | /app/organizations | frontend/src/app/page.tsx:243; frontend/src/lib/constants.ts:47 | Organizations discovery tab | implemented/testable | Task 6 |
| FR-09 | /app/stories | frontend/src/app/page.tsx:244; frontend/src/lib/constants.ts:48 | Stories tab | implemented/testable | Task 8 |
| FR-10 | /app/profile | frontend/src/app/page.tsx:245; frontend/src/lib/constants.ts:49 | Volunteer profile tab | implemented/testable | Task 5 |
| FR-11 | /app/events/:id/chat | frontend/src/app/page.tsx:248; frontend/src/lib/constants.ts:57 | Event chat detail | implemented/testable | Task 8 |
| FR-12 | /app/events/:id | frontend/src/app/page.tsx:249; frontend/src/lib/constants.ts:56 | Event detail | implemented/testable | Task 6 |
| FR-13 | /app/courses/:id/lesson/:subId | frontend/src/app/page.tsx:250; frontend/src/lib/constants.ts:59 | Course lesson | implemented/testable | Task 7 |
| FR-14 | /app/courses/:id/certificate | frontend/src/app/page.tsx:251; frontend/src/lib/constants.ts:60 | Course certificate | implemented/testable | Task 7 |
| FR-15 | /app/courses/:id | frontend/src/app/page.tsx:252; frontend/src/lib/constants.ts:58 | Course detail | implemented/testable | Task 7 |
| FR-16 | /app/organizations/:id | frontend/src/app/page.tsx:253; frontend/src/lib/constants.ts:61 | Organization detail | implemented/testable | Task 6 |
| FR-17 | /app/stories/create | frontend/src/app/page.tsx:254; frontend/src/lib/constants.ts:62 | Create story page | unsupported/no counterpart | Task 8 |
| FR-18 | /app/stories/:id | frontend/src/app/page.tsx:255; frontend/src/lib/constants.ts:63 | Story detail | implemented/testable | Task 8 |
| FR-19 | /app/rewards/:id | frontend/src/app/page.tsx:256; frontend/src/lib/constants.ts:64 | Reward detail | unsupported/no counterpart | Task 7 |
| FR-20 | /app/chat | frontend/src/app/page.tsx:257; frontend/src/lib/constants.ts:65 | Assistant chat page | partial/WIP | Task 8 |
| FR-21 | /app/profile/activityHistory | frontend/src/app/page.tsx:258; frontend/src/lib/constants.ts:68 | Profile activity history | implemented/testable | Task 5 |
| FR-22 | /app/profile/allAchievements | frontend/src/app/page.tsx:259; frontend/src/lib/constants.ts:69 | All achievements | implemented/testable | Task 7 |
| FR-23 | /app/profile/calendar | frontend/src/app/page.tsx:260; frontend/src/lib/constants.ts:70 | Profile calendar | implemented/testable | Task 5 |
| FR-24 | /app/profile/leaderboards | frontend/src/app/page.tsx:261; frontend/src/lib/constants.ts:71 | Leaderboard page | implemented/testable | Task 7 |
| FR-25 | /app/profile/settings | frontend/src/app/page.tsx:262; frontend/src/lib/constants.ts:72 | Profile settings | implemented/testable | Task 5 |
| FR-26 | /app/profile/editProfile | frontend/src/app/page.tsx:263; frontend/src/lib/constants.ts:73 | Edit profile | unsupported/no counterpart | Task 5 |
| FR-27 | /app/profile/myCertificates | frontend/src/app/page.tsx:264; frontend/src/lib/constants.ts:74 | My certificates | implemented/testable | Task 7 |
| FR-28 | /app/profile/myChats | frontend/src/app/page.tsx:265; frontend/src/lib/constants.ts:75 | My event chats | implemented/testable | Task 8 |
| FR-29 | /app/profile/rewardsStore | frontend/src/app/page.tsx:266; frontend/src/lib/constants.ts:76 | Rewards store | implemented/testable | Task 7 |
| FR-30 | /organization/dashboard | frontend/src/app/page.tsx:267; frontend/src/lib/constants.ts:79 | Organizer dashboard | implemented/testable | Task 9 |
| FR-31 | /organization/events | frontend/src/app/page.tsx:268; frontend/src/lib/constants.ts:80 | Organizer event management | implemented/testable | Task 9 |
| FR-32 | /organization/events/create | frontend/src/app/page.tsx:269; frontend/src/lib/constants.ts:81 | Create organizer event | implemented/testable | Task 9 |
| FR-33 | /organization/events/edit/:eventId | frontend/src/app/page.tsx:270; frontend/src/lib/constants.ts:82 | Edit organizer event | implemented/testable | Task 9 |
| FR-34 | /organization/events/participants/:eventId | frontend/src/app/page.tsx:271; frontend/src/lib/constants.ts:83 | Organizer event participants | implemented/testable | Task 9 |
| FR-35 | /organization/settings | frontend/src/app/page.tsx:272; frontend/src/lib/constants.ts:84 | Organization settings | unsupported/no counterpart | Task 9 |
| FR-36 | * authenticated | frontend/src/app/page.tsx:275 | Authenticated catch-all redirect | implemented/testable | Task 3 |
| FR-37 | * unauthenticated | frontend/src/app/page.tsx:280 | Unauthenticated catch-all redirect | implemented/testable | Task 3 |

## Route Constants
| ID | Constant | Value | Source | Route row | Owner | Classification |
| --- | --- | --- | --- | --- | --- | --- |
| RC-01 | HOME | /app/home | frontend/src/lib/constants.ts:45 | FR-06 | Task 6 | implemented/testable |
| RC-02 | TRAINING | /app/training | frontend/src/lib/constants.ts:46 | FR-07 | Task 7 | implemented/testable |
| RC-03 | ORGANIZATIONS | /app/organizations | frontend/src/lib/constants.ts:47 | FR-08 | Task 6 | implemented/testable |
| RC-04 | STORIES | /app/stories | frontend/src/lib/constants.ts:48 | FR-09 | Task 8 | implemented/testable |
| RC-05 | PROFILE | /app/profile | frontend/src/lib/constants.ts:49 | FR-10 | Task 5 | implemented/testable |
| RC-06 | AUTH | /auth | frontend/src/lib/constants.ts:52 | FR-03 | Task 5 | external-boundary |
| RC-07 | ONBOARDING | /onboarding | frontend/src/lib/constants.ts:53 | FR-04 | Task 5 | implemented/testable |
| RC-08 | EVENT_DETAIL | /app/events/${id} | frontend/src/lib/constants.ts:56 | FR-12 | Task 6 | implemented/testable |
| RC-09 | EVENT_CHAT | /app/events/${id}/chat | frontend/src/lib/constants.ts:57 | FR-11 | Task 8 | implemented/testable |
| RC-10 | COURSE_DETAIL | /app/courses/${id} | frontend/src/lib/constants.ts:58 | FR-15 | Task 7 | implemented/testable |
| RC-11 | COURSE_LESSON | /app/courses/${id}/lesson/${subId} | frontend/src/lib/constants.ts:59 | FR-13 | Task 7 | implemented/testable |
| RC-12 | COURSE_CERTIFICATE | /app/courses/${id}/certificate | frontend/src/lib/constants.ts:60 | FR-14 | Task 7 | implemented/testable |
| RC-13 | ORGANIZATION_DETAIL | /app/organizations/${id} | frontend/src/lib/constants.ts:61 | FR-16 | Task 6 | implemented/testable |
| RC-14 | STORY_CREATE | /app/stories/create | frontend/src/lib/constants.ts:62 | FR-17 | Task 8 | unsupported/no counterpart |
| RC-15 | STORY_DETAIL | /app/stories/${id} | frontend/src/lib/constants.ts:63 | FR-18 | Task 8 | implemented/testable |
| RC-16 | REWARD_DETAIL | /app/rewards/${id} | frontend/src/lib/constants.ts:64 | FR-19 | Task 7 | unsupported/no counterpart |
| RC-17 | CHAT | /app/chat | frontend/src/lib/constants.ts:65 | FR-20 | Task 8 | partial/WIP |
| RC-18 | PROFILE_ACTIVITY_HISTORY | /app/profile/activityHistory | frontend/src/lib/constants.ts:68 | FR-21 | Task 5 | implemented/testable |
| RC-19 | PROFILE_ACHIEVEMENTS | /app/profile/allAchievements | frontend/src/lib/constants.ts:69 | FR-22 | Task 7 | implemented/testable |
| RC-20 | PROFILE_CALENDAR | /app/profile/calendar | frontend/src/lib/constants.ts:70 | FR-23 | Task 5 | implemented/testable |
| RC-21 | PROFILE_LEADERBOARDS | /app/profile/leaderboards | frontend/src/lib/constants.ts:71 | FR-24 | Task 7 | implemented/testable |
| RC-22 | PROFILE_SETTINGS | /app/profile/settings | frontend/src/lib/constants.ts:72 | FR-25 | Task 5 | implemented/testable |
| RC-23 | PROFILE_EDIT | /app/profile/editProfile | frontend/src/lib/constants.ts:73 | FR-26 | Task 5 | unsupported/no counterpart |
| RC-24 | PROFILE_CERTIFICATES | /app/profile/myCertificates | frontend/src/lib/constants.ts:74 | FR-27 | Task 7 | implemented/testable |
| RC-25 | PROFILE_CHATS | /app/profile/myChats | frontend/src/lib/constants.ts:75 | FR-28 | Task 8 | implemented/testable |
| RC-26 | PROFILE_REWARDS | /app/profile/rewardsStore | frontend/src/lib/constants.ts:76 | FR-29 | Task 7 | implemented/testable |
| RC-27 | ORGANIZATION_DASHBOARD | /organization/dashboard | frontend/src/lib/constants.ts:79 | FR-30 | Task 9 | implemented/testable |
| RC-28 | ORGANIZATION_EVENTS | /organization/events | frontend/src/lib/constants.ts:80 | FR-31 | Task 9 | implemented/testable |
| RC-29 | ORGANIZATION_EVENTS_CREATE | /organization/events/create | frontend/src/lib/constants.ts:81 | FR-32 | Task 9 | implemented/testable |
| RC-30 | ORGANIZATION_EVENTS_EDIT | /organization/events/edit/${id} | frontend/src/lib/constants.ts:82 | FR-33 | Task 9 | implemented/testable |
| RC-31 | ORGANIZATION_EVENTS_PARTICIPANTS | /organization/events/participants/${id} | frontend/src/lib/constants.ts:83 | FR-34 | Task 9 | implemented/testable |
| RC-32 | ORGANIZATION_SETTINGS | /organization/settings | frontend/src/lib/constants.ts:84 | FR-35 | Task 9 | unsupported/no counterpart |

## Backend Modules
| ID | Module | Source | Surface | Classification | Owner |
| --- | --- | --- | --- | --- | --- |
| BM-01 | ConfigModule.forRoot({ isGlobal: true }) | backend/src/app.module.ts:28 | configuration boundary | external-boundary | Task 4 |
| BM-02 | ScheduleModule.forRoot() | backend/src/app.module.ts:29 | scheduler infrastructure | external-boundary | Task 2 |
| BM-03 | AuthModule | backend/src/app.module.ts:30 | auth/profile controllers and guards | implemented/testable | Task 5 |
| BM-04 | UsersModule | backend/src/app.module.ts:31 | user entities/services, no direct controller in app surface | implemented/testable | Task 5 |
| BM-05 | EventsModule | backend/src/app.module.ts:32 | events CRUD and participation | implemented/testable | Task 6 |
| BM-06 | PrismaModule | backend/src/app.module.ts:33 | database boundary | external-boundary | Task 4 |
| BM-07 | SupabaseModule | backend/src/app.module.ts:34 | Supabase integration boundary | external-boundary | Task 13 |
| BM-08 | WebhooksModule | backend/src/app.module.ts:35 | Supabase auth webhook | external-boundary | Task 13 |
| BM-09 | TasksModule | backend/src/app.module.ts:36 | background/task service module, no controller discovered | partial/WIP | Task 2 |
| BM-10 | AchievementsModule | backend/src/app.module.ts:37 | achievements endpoint | implemented/testable | Task 7 |
| BM-11 | LearningModule | backend/src/app.module.ts:38 | course endpoints | implemented/testable | Task 7 |
| BM-12 | OrganizationsModule | backend/src/app.module.ts:39 | organization and organizer endpoints | implemented/testable | Task 9 |
| BM-13 | RewardsModule | backend/src/app.module.ts:40 | rewards endpoints | implemented/testable | Task 7 |
| BM-14 | StoriesModule | backend/src/app.module.ts:41 | stories endpoints | partial/WIP | Task 8 |
| BM-15 | AssistantChatModule | backend/src/app.module.ts:42 | assistant-chat endpoints | partial/WIP | Task 8 |
| BM-16 | LeaderboardModule | backend/src/app.module.ts:43 | leaderboard endpoint | implemented/testable | Task 7 |
| BM-17 | EventChatsModule | backend/src/app.module.ts:44 | event chat endpoints | implemented/testable | Task 8 |
| BM-18 | FriendsModule | backend/src/app.module.ts:45 | friends endpoint | implemented/testable | Task 6 |
| BM-19 | ChallengesModule | backend/src/app.module.ts:46 | weekly challenge endpoint | implemented/testable | Task 7 |
| BM-20 | MapModule | backend/src/app.module.ts:47 | map markers endpoint | implemented/testable | Task 6 |
| BM-21 | ReviewsModule | backend/src/app.module.ts:48 | review endpoints | partial/WIP | Task 8 |

## Backend Controller Endpoints
| ID | Method | Path | Source | Surface | Classification | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| BE-01 | GET | / | backend/src/app.controller.ts:8 | health/root hello | implemented/testable | Task 2 |
| BE-02 | GET | /achievements | backend/src/achievements/achievements.controller.ts:11 | all achievements | implemented/testable | Task 7 |
| BE-03 | POST | /auth/max-login | backend/src/auth/auth.controller.ts:11 | MAX login/register | external-boundary | Task 13 |
| BE-04 | POST | /auth/demo-organizer-login | backend/src/auth/auth.controller.ts:20 | demo organizer login | implemented/testable | Task 5 |
| BE-05 | GET | /profile/me | backend/src/auth/profile.controller.ts:26 | current profile | implemented/testable | Task 5 |
| BE-06 | GET | /profile/me/events | backend/src/auth/profile.controller.ts:58 | current user events | implemented/testable | Task 5 |
| BE-07 | GET | /profile/me/certificates | backend/src/auth/profile.controller.ts:70 | current user certificates | implemented/testable | Task 7 |
| BE-08 | GET | /profile/me/rewards | backend/src/auth/profile.controller.ts:77 | current user rewards | implemented/testable | Task 7 |
| BE-09 | GET | /profile/me/achievements | backend/src/auth/profile.controller.ts:85 | current user achievements | implemented/testable | Task 7 |
| BE-10 | GET | /profile/me/courses | backend/src/auth/profile.controller.ts:93 | current user courses | implemented/testable | Task 7 |
| BE-11 | GET | /leaderboard | backend/src/leaderboard/leaderboard.controller.ts:22 | leaderboard by period | implemented/testable | Task 7 |
| BE-12 | GET | /rewards | backend/src/rewards/rewards.controller.ts:29 | all rewards | implemented/testable | Task 7 |
| BE-13 | POST | /rewards/:id/purchase | backend/src/rewards/rewards.controller.ts:42 | purchase reward | partial/WIP | Task 7 |
| BE-14 | GET | /organizations | backend/src/organizations/organizations.controller.ts:40 | organizations list | implemented/testable | Task 6 |
| BE-15 | GET | /organizations/:id | backend/src/organizations/organizations.controller.ts:52 | organization detail | implemented/testable | Task 6 |
| BE-16 | GET | /organizations/:id/reviews | backend/src/organizations/organizations.controller.ts:61 | organization reviews | unsupported/no counterpart | Task 8 |
| BE-17 | POST | /organizations/:id/subscription | backend/src/organizations/organizations.controller.ts:71 | subscribe/unsubscribe organization | implemented/testable | Task 6 |
| BE-18 | GET | /organization/dashboard/stats | backend/src/organizations/organizations.controller.ts:88 | organizer dashboard stats | implemented/testable | Task 9 |
| BE-19 | GET | /organization/events | backend/src/organizations/organizations.controller.ts:98 | organizer events | implemented/testable | Task 9 |
| BE-20 | GET | /organization/events/:eventId/participants | backend/src/organizations/organizations.controller.ts:107 | organizer event participants | implemented/testable | Task 9 |
| BE-21 | GET | /organization/details | backend/src/organizations/organizations.controller.ts:115 | organizer organization details | implemented/testable | Task 9 |
| BE-22 | POST | /webhooks/supabase-auth | backend/src/webhooks/webhooks.controller.ts:17 | Supabase auth webhook | external-boundary | Task 13 |
| BE-23 | GET | /events/:eventId/reviews | backend/src/reviews/reviews.controller.ts:32 | event reviews | unsupported/no counterpart | Task 8 |
| BE-24 | POST | /events/:eventId/reviews | backend/src/reviews/reviews.controller.ts:42 | create event review | unsupported/no counterpart | Task 8 |
| BE-25 | GET | /friends | backend/src/friends/friends.controller.ts:15 | current user friends | implemented/testable | Task 6 |
| BE-26 | GET | /map-markers | backend/src/map/map.controller.ts:10 | event map markers | implemented/testable | Task 6 |
| BE-27 | GET | /stories | backend/src/stories/stories.controller.ts:30 | stories list | implemented/testable | Task 8 |
| BE-28 | GET | /stories/:id | backend/src/stories/stories.controller.ts:39 | story detail | implemented/testable | Task 8 |
| BE-29 | POST | /stories/:id/like | backend/src/stories/stories.controller.ts:49 | like story | unsupported/no counterpart | Task 8 |
| BE-30 | DELETE | /stories/:id/like | backend/src/stories/stories.controller.ts:60 | unlike story | unsupported/no counterpart | Task 8 |
| BE-31 | GET | /courses | backend/src/learning/learning.controller.ts:28 | all courses | unsupported/no counterpart | Task 7 |
| BE-32 | GET | /courses/:id | backend/src/learning/learning.controller.ts:35 | course detail | unsupported/no counterpart | Task 7 |
| BE-33 | POST | /courses/:id/complete | backend/src/learning/learning.controller.ts:43 | complete course | implemented/testable | Task 7 |
| BE-34 | POST | /events | backend/src/events/events.controller.ts:38 | create event | partial/WIP | Task 9 |
| BE-35 | GET | /events | backend/src/events/events.controller.ts:51 | events list | implemented/testable | Task 6 |
| BE-36 | GET | /events/:id | backend/src/events/events.controller.ts:62 | event detail | implemented/testable | Task 6 |
| BE-37 | GET | /events/:id/participants | backend/src/events/events.controller.ts:77 | event participants | unsupported/no counterpart | Task 6 |
| BE-38 | PATCH | /events/:id | backend/src/events/events.controller.ts:89 | update event | partial/WIP | Task 9 |
| BE-39 | DELETE | /events/:id | backend/src/events/events.controller.ts:106 | delete event | unsupported/no counterpart | Task 9 |
| BE-40 | POST | /events/:id/participate | backend/src/events/events.controller.ts:120 | join event | unsupported/no counterpart | Task 10 |
| BE-41 | DELETE | /events/:id/participate | backend/src/events/events.controller.ts:142 | cancel event participation | unsupported/no counterpart | Task 10 |
| BE-42 | PATCH | /events/:eventId/participants/:userId | backend/src/events/events.controller.ts:160 | update participant status | partial/WIP | Task 9 |
| BE-43 | GET | /profile/chats | backend/src/event-chats/event-chats.controller.ts:30 | current user event chats | implemented/testable | Task 8 |
| BE-44 | GET | /events/:eventId/messages | backend/src/event-chats/event-chats.controller.ts:37 | event chat messages | implemented/testable | Task 8 |
| BE-45 | GET | /challenge/weekly | backend/src/challenges/challenges.controller.ts:15 | weekly challenge | implemented/testable | Task 7 |
| BE-46 | GET | /assistant-chat/messages | backend/src/assistant-chat/assistant-chat.controller.ts:30 | assistant message history | unsupported/no counterpart | Task 8 |
| BE-47 | POST | /assistant-chat/messages | backend/src/assistant-chat/assistant-chat.controller.ts:44 | send assistant message | unsupported/no counterpart | Task 8 |

## Frontend API Functions And Public Wiring
| ID | Function/wiring | Backend call or behavior | Source | Counterpart | Owner | Classification |
| --- | --- | --- | --- | --- | --- | --- |
| FA-01 | fetchAllEvents | GET /events | frontend/src/lib/api.real.ts:187-189 | BE-35 | Task 6 | implemented/testable |
| FA-02 | fetchEventById | GET /events/:id | frontend/src/lib/api.real.ts:192-196 | BE-36 | Task 6 | implemented/testable |
| FA-03 | fetchAllCourses | GET /profile/me/courses | frontend/src/lib/api.real.ts:199-201 | BE-10 | Task 7 | implemented/testable |
| FA-04 | fetchCourseById | composite: fetchAllCourses then local find | frontend/src/lib/api.real.ts:204-208 | FA-03 | Task 7 | implemented/testable |
| FA-05 | completeCourse | POST /courses/:courseId/complete | frontend/src/lib/api.real.ts:211-218 | BE-33 | Task 7 | implemented/testable |
| FA-06 | fetchAllOrganizations | GET /organizations | frontend/src/lib/api.real.ts:221-222 | BE-14 | Task 6 | implemented/testable |
| FA-07 | fetchOrganizationById | GET /organizations/:id | frontend/src/lib/api.real.ts:223-224 | BE-15 | Task 6 | implemented/testable |
| FA-08 | updateOrganizationSubscription | POST /organizations/:organizationId/subscription | frontend/src/lib/api.real.ts:225-232 | BE-17 | Task 6 | implemented/testable |
| FA-09 | fetchOrganizationEvents | GET /organization/events | frontend/src/lib/api.real.ts:234-235 | BE-19 | Task 9 | implemented/testable |
| FA-10 | fetchEventParticipants | GET /organization/events/:eventId/participants | frontend/src/lib/api.real.ts:236-239 | BE-20 | Task 9 | implemented/testable |
| FA-11 | fetchOrganizationDashboardStats | GET /organization/dashboard/stats | frontend/src/lib/api.real.ts:240-241 | BE-18 | Task 9 | implemented/testable |
| FA-12 | fetchOrganizationDetails | GET /organization/details | frontend/src/lib/api.real.ts:242-243 | BE-21 | Task 9 | implemented/testable |
| FA-13 | fetchActivityHistoryEvents | GET /profile/me/events | frontend/src/lib/api.real.ts:244-249 | BE-06 | Task 5 | implemented/testable |
| FA-14 | fetchLeaderboardData | GET /leaderboard?period=... | frontend/src/lib/api.real.ts:251-254 | BE-11 | Task 7 | implemented/testable |
| FA-15 | fetchAllAchievements | GET /achievements | frontend/src/lib/api.real.ts:255-259 | BE-02 | Task 7 | implemented/testable |
| FA-16 | fetchUserAchievements | GET /profile/me/achievements | frontend/src/lib/api.real.ts:261-269 | BE-09 | Task 7 | implemented/testable |
| FA-17 | fetchMyChats | GET /profile/chats | frontend/src/lib/api.real.ts:271-276 | BE-43 | Task 8 | implemented/testable |
| FA-18 | fetchAllStories | GET /stories | frontend/src/lib/api.real.ts:278 | BE-27 | Task 8 | implemented/testable |
| FA-19 | fetchStoryById | GET /stories/:id | frontend/src/lib/api.real.ts:279-280 | BE-28 | Task 8 | implemented/testable |
| FA-20 | fetchRewards | GET /rewards | frontend/src/lib/api.real.ts:281 | BE-12 | Task 7 | implemented/testable |
| FA-21 | fetchMapMarkers | GET /map-markers | frontend/src/lib/api.real.ts:282-283 | BE-26 | Task 6 | implemented/testable |
| FA-22 | fetchFriends | GET /friends | frontend/src/lib/api.real.ts:284 | BE-25 | Task 6 | implemented/testable |
| FA-23 | fetchEventChatMessages | GET /events/:eventId/messages | frontend/src/lib/api.real.ts:285-287 | BE-44 | Task 8 | implemented/testable |
| FA-24 | fetchWeeklyChallenge | GET /challenge/weekly | frontend/src/lib/api.real.ts:288-292 | BE-45 | Task 7 | implemented/testable |
| FA-25 | api.ts organizer dashboard override | mock-only in public api.ts, bypasses realApi | frontend/src/lib/api.ts:9 | FA-11 | Task 9 | implemented/broken |
| FA-26 | api.ts organization details override | mock-only in public api.ts, bypasses realApi | frontend/src/lib/api.ts:10 | FA-12 | Task 9 | implemented/broken |
| FA-27 | api.ts organization events override | mock-only in public api.ts, bypasses realApi | frontend/src/lib/api.ts:11 | FA-09 | Task 9 | implemented/broken |
| FA-28 | api.ts event participants override | mock-only in public api.ts, bypasses realApi | frontend/src/lib/api.ts:12 | FA-10 | Task 9 | implemented/broken |
| FA-29 | api.ts stories override | mock-only in public api.ts, bypasses realApi | frontend/src/lib/api.ts:14 | FA-18 | Task 8 | implemented/broken |
| FA-30 | api.ts story detail override | mock-only in public api.ts, bypasses realApi | frontend/src/lib/api.ts:15 | FA-19 | Task 8 | implemented/broken |
| FA-31 | api.ts mode-selected bundle | exports remaining real/mock functions by VITE_API_MODE | frontend/src/lib/api.ts:17-36 | FA-01..FA-24 | Task 10 | implemented/testable |
| FA-32 | api.organizer fetchOrganizationDashboardStats | demo-mode mock or realApi wrapper, not exported by api.ts | frontend/src/lib/api.organizer.ts:6-10 | FA-11 | Task 11 | dead/unreachable |
| FA-33 | api.organizer fetchOrganizationDetails | demo-mode mock or realApi wrapper, not exported by api.ts | frontend/src/lib/api.organizer.ts:12-16 | FA-12 | Task 11 | dead/unreachable |
| FA-34 | api.organizer fetchOrganizationEvents | demo-mode mock or realApi wrapper, not exported by api.ts | frontend/src/lib/api.organizer.ts:18-22 | FA-09 | Task 11 | dead/unreachable |
| FA-35 | api.organizer fetchEventParticipants | demo-mode mock or realApi wrapper, not exported by api.ts | frontend/src/lib/api.organizer.ts:24-28 | FA-10 | Task 11 | dead/unreachable |
| FA-36 | auth.real login | Supabase signInWithPassword + GET /profile/me | frontend/src/lib/auth.real.ts:80-108 | BE-05 | Task 5 | external-boundary |
| FA-37 | auth.real register | Supabase signUp + GET /profile/me after webhook delay | frontend/src/lib/auth.real.ts:111-149 | BE-05 + BE-22 | Task 5 | external-boundary |
| FA-38 | auth.real logout | localStorage cleanup + Supabase signOut | frontend/src/lib/auth.real.ts:151 | external | Task 5 | external-boundary |

## Ambiguity/WIP Notes
- `frontend/src/lib/api.ts:9-15` hard-wires organizer and story APIs to `mockApi`, so real backend counterparts exist but public real-mode wiring appears broken until Task 8/9/10/11 verification proves otherwise.
- `frontend/src/lib/api.organizer.ts:6-28` wraps real organizer APIs but is not imported by `frontend/src/lib/api.ts`; classified as dead/unreachable from current public API wiring.
- Assistant chat backend endpoints exist, but `frontend/src/app/chat/page.tsx` does not call `frontend/src/lib/api.real.ts` or `/assistant-chat/messages`; classified as partial/WIP/unsupported counterpart for regression ownership.
- Create story, reward detail, edit profile, and organization settings routes are visible frontend surfaces without matching local backend create/detail/update endpoints in the discovered API surface.

// FILE: frontend/src/lib/api.mock.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Serve delayed in-memory mock data matching the real API surface.
//   SCOPE: Simulated fetch/mutate helpers for events, courses, orgs, stories, rewards
//   DEPENDS: M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-API V-M-FRONTEND-API M-FRONTEND-TYPES
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
// START_MODULE_MAP
//   fetchAllEvents - mock event catalog
//   participateInEvent - in-memory join set
//   completeCourse - local quiz scoring
//   purchaseReward - mark a mock reward purchased
//   simulateRequest - delay and optional failure wrapper
// END_MODULE_MAP
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import {
  activityHistoryEvents,
  allAchievements,
  allCourses,
  allEvents,
  allOrganizationsData,
  allRewards,
  allStories,
  leaderboardsData,
  mockDashboardStats,
  mockEventChatMessages,
  mockFriends,
  mockMapMarkers,
  mockOrganizationDetails,
  mockOrganizationEvents,
  mockParticipants,
  mockWeeklyChallenge,
  myChatsData,
} from './mockData';
import type {
  Achievement,
  AppEvent,
  Comment,
  Course,
  CourseCompletionResult,
  LessonCompletionResult,
  EventCreatePayload,
  EventChatMessage,
  EventParticipant,
  Friend,
  HistoryEvent,
  LeaderboardUser,
  MapMarker,
  MyChatItem,
  Organization,
  OrganizationDetails,
  OrganizationEvent,
  OrganizationStat,
  RewardItem,
  Story,
  WeeklyChallenge,
} from './types';
import { CURRENT_USER_ID, COURSE_PASS_THRESHOLD } from './constants';

const SIMULATED_DELAY = 500;
const participatingEventIds = new Set<number>();

const deepCopy = (inObject: any) => {
  let outObject: any, value: any, key: any;

  if (typeof inObject !== 'object' || inObject === null) {
    return inObject;
  }

  outObject = Array.isArray(inObject) ? [] : {};

  for (key in inObject) {
    value = inObject[key];
    outObject[key] = deepCopy(value);
  }

  return outObject;
};

// START_BLOCK_SIMULATE_REQUEST
const simulateRequest = <T>(data: T, failRate = 0): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failRate) {
        reject(new Error('Simulated API Error'));
      } else {
        resolve(deepCopy(data));
      }
    }, SIMULATED_DELAY + Math.random() * 300);
  });
};
// END_BLOCK_SIMULATE_REQUEST

// START_BLOCK_MOCK_EVENTS
// START_CONTRACT: fetchAllEvents
//   PURPOSE: Return the mock event catalog
//   INPUTS: { none }
//   OUTPUTS: { Promise<AppEvent[]> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API export-fetchAllEvents
// END_CONTRACT: fetchAllEvents
export const fetchAllEvents = (): Promise<AppEvent[]> => {
  return simulateRequest(allEvents);
};

// START_CONTRACT: fetchEventById
//   PURPOSE: Find a mock catalog or history event by id
//   INPUTS: { id: number }
//   OUTPUTS: { Promise<AppEvent | HistoryEvent | undefined> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchEventById
export const fetchEventById = (
  id: number,
): Promise<AppEvent | HistoryEvent | undefined> => {
  const event = [...allEvents, ...activityHistoryEvents].find((e) => e.id === id);
  return simulateRequest(event);
};

// START_CONTRACT: participateInEvent
//   PURPOSE: Record mock participation for an event
//   INPUTS: { eventId: number }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: adds eventId to participatingEventIds
//   LINKS: M-FRONTEND-API export-participateInEvent
// END_CONTRACT: participateInEvent
export const participateInEvent = (eventId: number): Promise<void> => {
  const eventExists = allEvents.some((event) => event.id === eventId);
  if (!eventExists) {
    return Promise.reject(new Error('Event not found'));
  }

  if (participatingEventIds.has(eventId)) {
    return Promise.reject(new Error('You are already participating in this event'));
  }

  participatingEventIds.add(eventId);
  return simulateRequest(undefined);
};

// START_CONTRACT: cancelEventParticipation
//   PURPOSE: Remove mock participation for an event
//   INPUTS: { eventId: number }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: deletes eventId from participatingEventIds
//   LINKS: M-FRONTEND-API
// END_CONTRACT: cancelEventParticipation
export const cancelEventParticipation = (eventId: number): Promise<void> => {
  if (!participatingEventIds.has(eventId)) {
    return Promise.reject(new Error('Participation record not found for this user and event'));
  }

  participatingEventIds.delete(eventId);
  return simulateRequest(undefined);
};

// START_CONTRACT: createEvent
//   PURPOSE: Return a mock created event from a payload
//   INPUTS: { payload: EventCreatePayload }
//   OUTPUTS: { Promise<AppEvent> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: createEvent
export const createEvent = (payload: EventCreatePayload): Promise<AppEvent> => {
  return simulateRequest({
    id: Math.floor(Math.random() * 100000) + 1000,
    ...payload,
    participantCount: 0,
    organizationName: 'Моя организация',
  } as unknown as AppEvent);
};

// START_CONTRACT: updateEvent
//   PURPOSE: Return a mock updated event
//   INPUTS: { id: number; payload: Partial<EventCreatePayload> }
//   OUTPUTS: { Promise<AppEvent> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: updateEvent
export const updateEvent = (
  id: number,
  payload: Partial<EventCreatePayload>,
): Promise<AppEvent> => {
  return simulateRequest({ id, ...payload } as unknown as AppEvent);
};

// START_CONTRACT: createStoryComment
//   PURPOSE: Return a mock story comment authored by the current user
//   INPUTS: { _storyId: number; text: string }
//   OUTPUTS: { Promise<Comment> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: createStoryComment
export const createStoryComment = (
  _storyId: number,
  text: string,
): Promise<Comment> =>
  simulateRequest({
    id: Math.floor(Math.random() * 100000) + 1000,
    text,
    timestamp: 'только что',
    author: { name: 'Вы', avatarUrl: 'https://i.pravatar.cc/150?u=me' },
  });
// END_BLOCK_MOCK_EVENTS

// START_BLOCK_MOCK_COURSES
// START_CONTRACT: fetchAllCourses
//   PURPOSE: Return the mock course catalog
//   INPUTS: { none }
//   OUTPUTS: { Promise<Course[]> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchAllCourses
export const fetchAllCourses = (): Promise<Course[]> => {
  return simulateRequest(allCourses);
};

// START_CONTRACT: fetchCourseById
//   PURPOSE: Find a mock course by id
//   INPUTS: { id: number }
//   OUTPUTS: { Promise<Course | undefined> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchCourseById
export const fetchCourseById = (id: number): Promise<Course | undefined> => {
  const course = allCourses.find((c) => c.id === id);
  return simulateRequest(course);
};
// END_BLOCK_MOCK_COURSES

let cachedOrgs: Organization[] | null = null;

// START_BLOCK_MOCK_ORGANIZATIONS
// START_CONTRACT: fetchAllOrganizations
//   PURPOSE: Return mock organizations with a one-time random subscription flag
//   INPUTS: { none }
//   OUTPUTS: { Promise<Organization[]> }
//   SIDE_EFFECTS: initializes cachedOrgs on first call
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchAllOrganizations
export const fetchAllOrganizations = (): Promise<Organization[]> => {
  if (cachedOrgs) {
    return simulateRequest(cachedOrgs);
  }
  const orgsWithSubscription = allOrganizationsData.map((org) => ({
    ...org,
    isSubscribed: Math.random() > 0.7,
  }));
  cachedOrgs = orgsWithSubscription;
  return simulateRequest(orgsWithSubscription);
};

// START_CONTRACT: updateOrganizationSubscription
//   PURPOSE: Update the cached mock subscription flag
//   INPUTS: { organizationId: number; isSubscribed: boolean }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: mutates cachedOrgs
//   LINKS: M-FRONTEND-API
// END_CONTRACT: updateOrganizationSubscription
export const updateOrganizationSubscription = (
  organizationId: number,
  isSubscribed: boolean,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const updateCache = () => {
      if (!cachedOrgs) {
        reject(new Error('Organization cache is not initialized.'));
        return;
      }
      const orgIndex = cachedOrgs.findIndex((o) => o.id === organizationId);
      if (orgIndex > -1) {
        cachedOrgs[orgIndex].isSubscribed = isSubscribed;
        resolve();
      } else {
        reject(new Error('Organization not found.'));
      }
    };

    if (!cachedOrgs) {
      fetchAllOrganizations().then(updateCache).catch(reject);
    } else {
      setTimeout(() => updateCache(), SIMULATED_DELAY);
    }
  });
};

// START_CONTRACT: fetchOrganizationById
//   PURPOSE: Find a cached mock organization by id
//   INPUTS: { id: number }
//   OUTPUTS: { Promise<Organization | undefined> }
//   SIDE_EFFECTS: may initialize cachedOrgs
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchOrganizationById
export const fetchOrganizationById = async (
  id: number,
): Promise<Organization | undefined> => {
  if (!cachedOrgs) {
    await fetchAllOrganizations();
  }
  const org = cachedOrgs!.find((o) => o.id === id);
  return simulateRequest(org);
};

// START_CONTRACT: fetchOrganizationEvents
//   PURPOSE: Return mock organizer-owned events
//   INPUTS: { none }
//   OUTPUTS: { Promise<OrganizationEvent[]> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchOrganizationEvents
export const fetchOrganizationEvents = (): Promise<OrganizationEvent[]> => {
  return simulateRequest(mockOrganizationEvents);
};

// START_CONTRACT: fetchEventParticipants
//   PURPOSE: Return mock participants for an organizer event
//   INPUTS: { eventId: number }
//   OUTPUTS: { Promise<EventParticipant[]> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchEventParticipants
export const fetchEventParticipants = (
  eventId: number,
): Promise<EventParticipant[]> => {
  return simulateRequest(mockParticipants);
};
// END_BLOCK_MOCK_ORGANIZATIONS

// START_CONTRACT: fetchActivityHistoryEvents
//   PURPOSE: Return mock activity history events
//   INPUTS: { none }
//   OUTPUTS: { Promise<HistoryEvent[]> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchActivityHistoryEvents
export const fetchActivityHistoryEvents = (): Promise<HistoryEvent[]> => {
  return simulateRequest(activityHistoryEvents);
};

// START_CONTRACT: fetchLeaderboardData
//   PURPOSE: Return mock leaderboard rows and the current user
//   INPUTS: { period: 'week' | 'month' | 'allTime' }
//   OUTPUTS: { Promise<{ topUsers, currentUser }> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchLeaderboardData
export const fetchLeaderboardData = (
  period: 'week' | 'month' | 'allTime',
): Promise<{ topUsers: LeaderboardUser[]; currentUser: LeaderboardUser | null }> => {
  const data = leaderboardsData[period];
  const currentUser = data.find((u) => u.id === CURRENT_USER_ID) || null;
  return simulateRequest({ topUsers: data, currentUser });
};

// START_CONTRACT: updateProfile
//   PURPOSE: No-op mock profile update
//   INPUTS: { _data: { firstName?, lastName?, about?, avatarUrl? } }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: updateProfile
export const updateProfile = (_data: {
  firstName?: string;
  lastName?: string;
  about?: string;
  avatarUrl?: string;
}): Promise<void> => {
  return Promise.resolve();
};

// START_CONTRACT: fetchAllAchievements
//   PURPOSE: Return the mock achievement catalog
//   INPUTS: { none }
//   OUTPUTS: { Promise<Achievement[]> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchAllAchievements
export const fetchAllAchievements = (): Promise<Achievement[]> => {
  return simulateRequest(allAchievements);
};

// START_CONTRACT: fetchUserAchievements
//   PURPOSE: Return mock user achievements
//   INPUTS: { none }
//   OUTPUTS: { Promise<Achievement[]> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchUserAchievements
export const fetchUserAchievements = (): Promise<Achievement[]> => {
  return simulateRequest(allAchievements);
};

// START_CONTRACT: createEventReview
//   PURPOSE: No-op mock event review
//   INPUTS: { none }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: createEventReview
export const createEventReview = (): Promise<void> => {
  return simulateRequest(undefined);
};

// START_CONTRACT: fetchMyChats
//   PURPOSE: Return mock chat list items
//   INPUTS: { none }
//   OUTPUTS: { Promise<MyChatItem[]> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchMyChats
export const fetchMyChats = (): Promise<MyChatItem[]> => {
  return simulateRequest(myChatsData);
};

// START_BLOCK_MOCK_STORIES
// START_CONTRACT: fetchAllStories
//   PURPOSE: Return the mock stories feed
//   INPUTS: { none }
//   OUTPUTS: { Promise<Story[]> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchAllStories
export const fetchAllStories = (): Promise<Story[]> => {
  return simulateRequest(allStories);
};

// START_CONTRACT: fetchStoryById
//   PURPOSE: Find a mock story by id
//   INPUTS: { id: number }
//   OUTPUTS: { Promise<Story | undefined> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchStoryById
export const fetchStoryById = (id: number): Promise<Story | undefined> => {
  const story = allStories.find((s) => s.id === id);
  return simulateRequest(story);
};

// START_CONTRACT: createStory
//   PURPOSE: Prepend a mock story onto the in-memory feed
//   INPUTS: { eventId: number; text: string; imageUrl: string }
//   OUTPUTS: { Promise<Story> }
//   SIDE_EFFECTS: mutates allStories
//   LINKS: M-FRONTEND-API
// END_CONTRACT: createStory
export const createStory = (
  eventId: number,
  text: string,
  imageUrl: string,
): Promise<Story> => {
  const story: Story = {
    id: Date.now(),
    author: { name: 'Вы', avatarUrl: 'https://i.pravatar.cc/48?img=1' },
    timestamp: 'только что',
    event: { id: eventId, name: allEvents.find((event) => event.id === eventId)?.title ?? 'Событие' },
    text,
    imageUrl,
    likes: 0,
    comments: 0,
    commentsData: [],
    isLiked: false,
  };
  allStories.unshift(story);
  return simulateRequest(story);
};

// START_CONTRACT: likeStory
//   PURPOSE: Increment likes on a mock story
//   INPUTS: { storyId: number }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: mutates allStories likes/isLiked
//   LINKS: M-FRONTEND-API
// END_CONTRACT: likeStory
export const likeStory = (storyId: number): Promise<void> => {
  const story = allStories.find((item) => item.id === storyId);
  if (story && !story.isLiked) {
    story.likes += 1;
    story.isLiked = true;
  }
  return simulateRequest(undefined);
};

// START_CONTRACT: unlikeStory
//   PURPOSE: Decrement likes on a mock story
//   INPUTS: { storyId: number }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: mutates allStories likes/isLiked
//   LINKS: M-FRONTEND-API
// END_CONTRACT: unlikeStory
export const unlikeStory = (storyId: number): Promise<void> => {
  const story = allStories.find((item) => item.id === storyId);
  if (story?.isLiked) {
    story.likes = Math.max(0, story.likes - 1);
    story.isLiked = false;
  }
  return simulateRequest(undefined);
};
// END_BLOCK_MOCK_STORIES

// START_BLOCK_MOCK_REWARDS
// START_CONTRACT: fetchRewards
//   PURPOSE: Return mock karma store items
//   INPUTS: { none }
//   OUTPUTS: { Promise<RewardItem[]> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchRewards
export const fetchRewards = (): Promise<RewardItem[]> => {
  return simulateRequest(allRewards);
};

// START_CONTRACT: purchaseReward
//   PURPOSE: Mark a mock reward as purchased
//   INPUTS: { rewardId: number }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: mutates allRewards isPurchased
//   LINKS: M-FRONTEND-API export-purchaseReward
// END_CONTRACT: purchaseReward
export const purchaseReward = (rewardId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const reward = allRewards.find((item) => item.id === rewardId);

      if (!reward) {
        reject(new Error('Reward not found'));
        return;
      }

      if (reward.isPurchased) {
        resolve();
        return;
      }

      reward.isPurchased = true;
      resolve();
    }, SIMULATED_DELAY);
  });
};

// START_CONTRACT: fetchMapMarkers
//   PURPOSE: Return mock map markers
//   INPUTS: { none }
//   OUTPUTS: { Promise<MapMarker[]> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchMapMarkers
export const fetchMapMarkers = (): Promise<MapMarker[]> => {
  return simulateRequest(mockMapMarkers);
};

// START_CONTRACT: fetchFriends
//   PURPOSE: Return mock friends
//   INPUTS: { none }
//   OUTPUTS: { Promise<Friend[]> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchFriends
export const fetchFriends = (): Promise<Friend[]> => {
  return simulateRequest(mockFriends);
};

// START_CONTRACT: fetchEventChatMessages
//   PURPOSE: Return mock event chat messages
//   INPUTS: { eventId: number }
//   OUTPUTS: { Promise<EventChatMessage[]> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchEventChatMessages
export const fetchEventChatMessages = (
  eventId: number,
): Promise<EventChatMessage[]> => {
  return simulateRequest(mockEventChatMessages);
};

// START_CONTRACT: postEventChatMessage
//   PURPOSE: Append a mock event chat message
//   INPUTS: { eventId: number; text: string }
//   OUTPUTS: { Promise<EventChatMessage> }
//   SIDE_EFFECTS: mutates mockEventChatMessages
//   LINKS: M-FRONTEND-API
// END_CONTRACT: postEventChatMessage
export const postEventChatMessage = (
  eventId: number,
  text: string,
): Promise<EventChatMessage> => {
  const message: EventChatMessage = {
    id: Date.now(),
    author: { id: CURRENT_USER_ID, name: 'Вы', avatarUrl: 'https://i.pravatar.cc/48?img=1' },
    text,
    timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
  };
  mockEventChatMessages.push(message);
  return simulateRequest(message);
};

// START_CONTRACT: fetchAssistantChatMessages
//   PURPOSE: Return an empty mock assistant history
//   INPUTS: { none }
//   OUTPUTS: { Promise<[]> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchAssistantChatMessages
export const fetchAssistantChatMessages = (): Promise<[]> => {
  return simulateRequest([]);
};

// START_CONTRACT: postAssistantMessage
//   PURPOSE: Return a canned mock assistant reply
//   INPUTS: { text: string }
//   OUTPUTS: { Promise<assistant text message> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: postAssistantMessage
export const postAssistantMessage = (text: string) => {
  const processed = text.toLowerCase();
  const responseText = processed.includes('событи')
    ? 'Могу помочь подобрать событие. Откройте ленту событий и уточните интересующую категорию.'
    : processed.includes('курс')
      ? 'В разделе обучения есть курсы для новичков и тематические материалы.'
      : 'Я пока не понял запрос. Может, вас интересуют события или курсы?';
  return simulateRequest({
    id: Date.now(),
    sender: 'assistant' as const,
    type: 'text' as const,
    text: responseText,
    timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
  });
};

// START_CONTRACT: fetchOrganizationDashboardStats
//   PURPOSE: Return mock organizer dashboard stats
//   INPUTS: { none }
//   OUTPUTS: { Promise<OrganizationStat[]> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchOrganizationDashboardStats
export const fetchOrganizationDashboardStats = (): Promise<OrganizationStat[]> => {
  return simulateRequest(mockDashboardStats);
};

// START_CONTRACT: fetchOrganizationDetails
//   PURPOSE: Return mock organizer details
//   INPUTS: { none }
//   OUTPUTS: { Promise<OrganizationDetails> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchOrganizationDetails
export const fetchOrganizationDetails = (): Promise<OrganizationDetails> => {
  return simulateRequest(mockOrganizationDetails);
};

// START_CONTRACT: fetchWeeklyChallenge
//   PURPOSE: Return the mock weekly challenge
//   INPUTS: { none }
//   OUTPUTS: { Promise<WeeklyChallenge> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchWeeklyChallenge
export const fetchWeeklyChallenge = (): Promise<WeeklyChallenge> => {
  return simulateRequest(mockWeeklyChallenge);
};
// END_BLOCK_MOCK_REWARDS

// START_BLOCK_MOCK_COMPLETE_COURSE
// START_CONTRACT: completeCourse
//   PURPOSE: Score mock quiz answers against course.program
//   INPUTS: { courseId: number; answers: { questionId, answerId }[] }
//   OUTPUTS: { Promise<CourseCompletionResult> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API export-completeCourse
// END_CONTRACT: completeCourse
export const completeCourse = (
  courseId: number,
  answers: { questionId: number; answerId: number }[],
): Promise<CourseCompletionResult> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const course = allCourses.find((c) => c.id === courseId);
      if (!course || !course.program) {
        return reject(new Error('Course not found'));
      }

      const submittedQuestionIds = [
        ...new Set(answers.map((a) => a.questionId.toString())),
      ];
      const questionsInSubmission = course.program
        .flatMap((lesson) => lesson.quiz || [])
        .filter((q) => submittedQuestionIds.includes(q.id));

      const totalQuestions = questionsInSubmission.length;
      const correctAnswers: Record<string, number[]> = {};
      questionsInSubmission.forEach((q) => {
        correctAnswers[q.id] = q.answers
          .filter((a) => a.isCorrect)
          .map((a) => a.id);
      });

      if (totalQuestions === 0) {
        return resolve({ isPassed: true, score: 0, totalQuestions: 0, correctAnswers });
      }

      const userAnswersMap = new Map<string, Set<number>>();
      for (const answer of answers) {
        const qId = answer.questionId.toString();
        if (!userAnswersMap.has(qId)) {
          userAnswersMap.set(qId, new Set());
        }
        userAnswersMap.get(qId)!.add(answer.answerId);
      }

      let score = 0;
      for (const question of questionsInSubmission) {
        const correct = new Set<number>(correctAnswers[question.id]);
        const userAnswers = userAnswersMap.get(question.id) || new Set();
        if (
          correct.size > 0 &&
          correct.size === userAnswers.size &&
          [...correct].every((id) => userAnswers.has(id))
        ) {
          score++;
        }
      }

      const isPassed = score / totalQuestions >= 0.7;

      resolve({ isPassed, score, totalQuestions, correctAnswers });
    }, SIMULATED_DELAY);
  });
};

// START_CONTRACT: markLessonComplete
//   PURPOSE: Return mock lesson-progress after completing a lesson
//   INPUTS: { courseId: number; lessonId: number }
//   OUTPUTS: { Promise<LessonCompletionResult> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: markLessonComplete
export const markLessonComplete = (
  courseId: number,
  lessonId: number,
): Promise<LessonCompletionResult> => {
  const course = allCourses.find((c) => c.id === courseId);
  const totalLessons = course?.program?.length ?? 0;
  const lessonIndex =
    course?.program?.findIndex((l) => l.id === lessonId) ?? -1;
  const courseCompleted = totalLessons > 0 && lessonIndex === totalLessons - 1;
  const completedLessonIds = course?.program
    ? course.program.slice(0, lessonIndex + 1).map((l) => l.id)
    : [lessonId];
  return simulateRequest({ completedLessonIds, totalLessons, courseCompleted });
};
// END_BLOCK_MOCK_COMPLETE_COURSE

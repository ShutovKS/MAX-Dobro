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
  Course,
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

export const fetchAllEvents = (): Promise<AppEvent[]> => {
  return simulateRequest(allEvents);
};

export const fetchEventById = (
  id: number,
): Promise<AppEvent | HistoryEvent | undefined> => {
  const event = [...allEvents, ...activityHistoryEvents].find((e) => e.id === id);
  return simulateRequest(event);
};

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

export const cancelEventParticipation = (eventId: number): Promise<void> => {
  if (!participatingEventIds.has(eventId)) {
    return Promise.reject(new Error('Participation record not found for this user and event'));
  }

  participatingEventIds.delete(eventId);
  return simulateRequest(undefined);
};

export const fetchAllCourses = (): Promise<Course[]> => {
  return simulateRequest(allCourses);
};

export const fetchCourseById = (id: number): Promise<Course | undefined> => {
  const course = allCourses.find((c) => c.id === id);
  return simulateRequest(course);
};

let cachedOrgs: Organization[] | null = null;

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

export const fetchOrganizationById = async (
  id: number,
): Promise<Organization | undefined> => {
  if (!cachedOrgs) {
    await fetchAllOrganizations();
  }
  const org = cachedOrgs!.find((o) => o.id === id);
  return simulateRequest(org);
};

export const fetchOrganizationEvents = (): Promise<OrganizationEvent[]> => {
  return simulateRequest(mockOrganizationEvents);
};

export const fetchEventParticipants = (
  eventId: number,
): Promise<EventParticipant[]> => {
  return simulateRequest(mockParticipants);
};

export const fetchActivityHistoryEvents = (): Promise<HistoryEvent[]> => {
  return simulateRequest(activityHistoryEvents);
};

export const fetchLeaderboardData = (
  period: 'week' | 'month' | 'allTime',
): Promise<{ topUsers: LeaderboardUser[]; currentUser: LeaderboardUser | null }> => {
  const data = leaderboardsData[period];
  const currentUser = data.find((u) => u.id === CURRENT_USER_ID) || null;
  return simulateRequest({ topUsers: data, currentUser });
};

export const fetchAllAchievements = (): Promise<Achievement[]> => {
  return simulateRequest(allAchievements);
};

export const fetchUserAchievements = (): Promise<Achievement[]> => {
  return simulateRequest(allAchievements);
};

export const fetchMyChats = (): Promise<MyChatItem[]> => {
  return simulateRequest(myChatsData);
};

export const fetchAllStories = (): Promise<Story[]> => {
  return simulateRequest(allStories);
};

export const fetchStoryById = (id: number): Promise<Story | undefined> => {
  const story = allStories.find((s) => s.id === id);
  return simulateRequest(story);
};

export const fetchRewards = (): Promise<RewardItem[]> => {
  return simulateRequest(allRewards);
};

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

export const fetchMapMarkers = (): Promise<MapMarker[]> => {
  return simulateRequest(mockMapMarkers);
};

export const fetchFriends = (): Promise<Friend[]> => {
  return simulateRequest(mockFriends);
};

export const fetchEventChatMessages = (
  eventId: number,
): Promise<EventChatMessage[]> => {
  return simulateRequest(mockEventChatMessages);
};

export const fetchOrganizationDashboardStats = (): Promise<OrganizationStat[]> => {
  return simulateRequest(mockDashboardStats);
};

export const fetchOrganizationDetails = (): Promise<OrganizationDetails> => {
  return simulateRequest(mockOrganizationDetails);
};

export const fetchWeeklyChallenge = (): Promise<WeeklyChallenge> => {
  return simulateRequest(mockWeeklyChallenge);
};

export const completeCourse = (
  courseId: number,
  answers: { questionId: number; answerId: number }[],
): Promise<{ isPassed: boolean; score: number; totalQuestions: number }> => {
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

      if (totalQuestions === 0) {
        return resolve({ isPassed: true, score: 0, totalQuestions: 0 });
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
        const correctAnswers = new Set<number>();
        question.answers.forEach((ans) => {
          if (ans.isCorrect) {
            correctAnswers.add(ans.id);
          }
        });

        const userAnswers = userAnswersMap.get(question.id) || new Set();

        if (
          correctAnswers.size > 0 &&
          correctAnswers.size === userAnswers.size &&
          [...correctAnswers].every((id) => userAnswers.has(id))
        ) {
          score++;
        }
      }

      const isPassed = score >= totalQuestions;

      resolve({ isPassed, score, totalQuestions });
    }, SIMULATED_DELAY);
  });
};

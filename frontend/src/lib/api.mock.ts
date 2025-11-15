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
  WeeklyChallenge
} from './types';

const SIMULATED_DELAY = 500;

const deepCopy = (inObject: any) => {
  let outObject: any, value: any, key: any;

  if (typeof inObject !== "object" || inObject === null) {
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
        reject(new Error("Simulated API Error"));
      } else {
        resolve(deepCopy(data));
      }
    }, SIMULATED_DELAY + Math.random() * 300);
  });
};

export const fetchAllEvents = (): Promise<AppEvent[]> => {
  return simulateRequest(allEvents);
};

export const fetchEventById = (id: number): Promise<AppEvent | HistoryEvent | undefined> => {
  const event = [...allEvents, ...activityHistoryEvents].find(e => e.id === id);
  return simulateRequest(event);
};

export const fetchAllCourses = (): Promise<Course[]> => {
  return simulateRequest(allCourses);
};

export const fetchCourseById = (id: number): Promise<Course | undefined> => {
  const course = allCourses.find(c => c.id === id);
  return simulateRequest(course);
};

let cachedOrgs: Organization[] | null = null;

export const fetchAllOrganizations = (): Promise<Organization[]> => {
  if (cachedOrgs) {
    return simulateRequest(cachedOrgs);
  }
  const orgsWithSubscription = allOrganizationsData.map(org => ({
    ...org,
    isSubscribed: Math.random() > 0.7
  }));
  cachedOrgs = orgsWithSubscription;
  return simulateRequest(orgsWithSubscription);
};

export const updateOrganizationSubscription = (organizationId: number, isSubscribed: boolean): Promise<Organization | undefined> => {
  return new Promise((resolve, reject) => {
    const updateCache = () => {
      if (!cachedOrgs) {
        reject(new Error("Organization cache is not initialized."));
        return;
      }
      const orgIndex = cachedOrgs.findIndex(o => o.id === organizationId);
      if (orgIndex > -1) {
        cachedOrgs[orgIndex].isSubscribed = isSubscribed;
        resolve(deepCopy(cachedOrgs[orgIndex]));
      } else {
        reject(new Error("Organization not found."));
      }
    }

    if (!cachedOrgs) {
      fetchAllOrganizations().then(updateCache).catch(reject);
    } else {
      updateCache();
    }
  });
}


export const fetchOrganizationById = async (id: number): Promise<Organization | undefined> => {
  if (!cachedOrgs) {
    await fetchAllOrganizations();
  }
  const org = cachedOrgs!.find(o => o.id === id);
  return simulateRequest(org);
};

export const fetchOrganizationEvents = (): Promise<OrganizationEvent[]> => {
  return simulateRequest(mockOrganizationEvents);
};

export const fetchEventParticipants = (eventId: number): Promise<EventParticipant[]> => {
  return simulateRequest(mockParticipants);
};

export const fetchActivityHistoryEvents = (): Promise<HistoryEvent[]> => {
  return simulateRequest(activityHistoryEvents);
};

export const fetchLeaderboardData = (period: 'week' | 'month' | 'allTime'): Promise<LeaderboardUser[]> => {
  return simulateRequest(leaderboardsData[period]);
};

export const fetchAllAchievements = (): Promise<Achievement[]> => {
  return simulateRequest(allAchievements);
};

export const fetchMyChats = (): Promise<MyChatItem[]> => {
  return simulateRequest(myChatsData);
};

export const fetchAllStories = (): Promise<Story[]> => {
  return simulateRequest(allStories);
};

export const fetchStoryById = (id: number): Promise<Story | undefined> => {
  const story = allStories.find(s => s.id === id);
  return simulateRequest(story);
};

export const fetchRewards = (): Promise<RewardItem[]> => {
  return simulateRequest(allRewards);
};

export const fetchMapMarkers = (): Promise<MapMarker[]> => {
  return simulateRequest(mockMapMarkers);
};

export const fetchFriends = (): Promise<Friend[]> => {
  return simulateRequest(mockFriends);
};

export const fetchEventChatMessages = (eventId: number): Promise<EventChatMessage[]> => {
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

export const completeCourse = async (
  courseId: number,
  answers: { questionId: number; answerId: number }[]
): Promise<void> => {
  // Mock implementation - просто делаем задержку
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Mock: Course completed', { courseId, answers });
};


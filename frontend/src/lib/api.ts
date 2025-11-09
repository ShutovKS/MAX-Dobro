import {
  activityHistoryEvents,
  allAchievements,
  allCourses,
  allEvents,
  allOrganizationsData,
  allRewards,
  allStories,
  leaderboardsData,
  mockOrganizationEvents,
  mockParticipants,
  myChatsData
} from './mockData';
import type {
  Achievement,
  AppEvent,
  Course,
  EventParticipant,
  HistoryEvent,
  LeaderboardUser,
  MyChatItem,
  Organization,
  OrganizationEvent,
  RewardItem,
  Story
} from './types';

const SIMULATED_DELAY = 500; // ms

// --- Helper Functions ---

const deepCopy = (inObject: any) => {
  let outObject: any, value: any, key: any;

  if (typeof inObject !== "object" || inObject === null) {
    return inObject; // Return the value if inObject is not an object (this includes functions)
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {};

  for (key in inObject) {
    value = inObject[key];

    // Recursively deep copy nested objects and arrays
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
        resolve(deepCopy(data)); // Deep copy to prevent mutation, preserving functions
      }
    }, SIMULATED_DELAY + Math.random() * 300);
  });
};

// --- API Functions ---

// Events
export const fetchAllEvents = (): Promise<AppEvent[]> => {
  return simulateRequest(allEvents);
};

export const fetchEventById = (id: number): Promise<AppEvent | HistoryEvent | undefined> => {
  const event = [...allEvents, ...activityHistoryEvents].find(e => e.id === id);
  return simulateRequest(event);
};

// Courses
export const fetchAllCourses = (): Promise<Course[]> => {
  return simulateRequest(allCourses);
};

export const fetchCourseById = (id: number): Promise<Course | undefined> => {
  const course = allCourses.find(c => c.id === id);
  return simulateRequest(course);
};

// Organizations
let cachedOrgs: Organization[] | null = null;

export const fetchAllOrganizations = (): Promise<Organization[]> => {
  if (cachedOrgs) {
    return simulateRequest(cachedOrgs);
  }
  // Add a random subscription status for simulation only on the first load
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
      // This case should ideally not happen if fetchAllOrganizations is called first on app load.
      fetchAllOrganizations().then(updateCache).catch(reject);
    } else {
      updateCache();
    }
  });
}


export const fetchOrganizationById = async (id: number): Promise<Organization | undefined> => {
  if (!cachedOrgs) {
    // Ensure cache is populated before trying to find an org
    await fetchAllOrganizations();
  }
  // Non-null assertion is safe because we just populated it.
  const org = cachedOrgs!.find(o => o.id === id);
  return simulateRequest(org);
};

export const fetchOrganizationEvents = (): Promise<OrganizationEvent[]> => {
  return simulateRequest(mockOrganizationEvents);
};

export const fetchEventParticipants = (eventId: number): Promise<EventParticipant[]> => {
  // NOTE: eventId is not used, returning the same mock list for any event for now.
  return simulateRequest(mockParticipants);
};

// Profile data (excluding user, which is now in auth)
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

// Stories
export const fetchAllStories = (): Promise<Story[]> => {
  return simulateRequest(allStories);
};

export const fetchStoryById = (id: number): Promise<Story | undefined> => {
  const story = allStories.find(s => s.id === id);
  return simulateRequest(story);
};

// Rewards
export const fetchRewards = (): Promise<RewardItem[]> => {
  return simulateRequest(allRewards);
};
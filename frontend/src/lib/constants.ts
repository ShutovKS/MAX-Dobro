import {AnimalFriendIcon, ArtVolunteerIcon, ElderlyHelperIcon, NatureProtectorIcon} from '../components/ui/icons';
import type {FilterDate, FilterFormat, OrganizationFilters} from './types';

// App-wide constants
export const APP_VERSION = '1.0.0';
export const CURRENT_USER_ID = 1;
export const TOAST_DURATION = 5000;
export const MODAL_TRANSITION_DURATION = 300;

// Auth
export const PASSWORD_MIN_LENGTH = 6;

// Achievements
export const FIRST_STEP_ACHIEVEMENT_ID = 1;

// UI Defaults
export const AVATAR_DEFAULTS = {
  SIZE: 150,
  MAX_PRAVATAR_ID: 70
};
export const CERTIFICATE_DEFAULTS = {
  ID_PREFIX: 'CERT-',
  ID_PADDING: 4,
  ID_PAD_CHAR: '0'
};

// Logic
export const COURSE_PASS_THRESHOLD = 0.7;

// Calendar
export const MONTH_NAMES = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
export const DAY_NAMES = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
export const CATEGORY_COLORS: { [key: string]: string } = {
  'Спорт': 'bg-[#FF303C]',
  'Арт': 'bg-purple-500',
  'Экология': 'bg-[#1ABE43]',
  'Животные': 'bg-[#FF9315]',
  'Помощь старшим': 'bg-yellow-500',
  'Онлайн': 'bg-indigo-500',
  'default': 'bg-[#007AFF]'
};

export const ROUTES = {
  // Volunteer main tabs
  HOME: '/app/home',
  TRAINING: '/app/training',
  ORGANIZATIONS: '/app/organizations',
  STORIES: '/app/stories',
  PROFILE: '/app/profile',

  // Auth
  AUTH: '/auth',
  ONBOARDING: '/onboarding',

  // Volunteer sub-pages
  EVENT_DETAIL: (id: string | number) => `/app/events/${id}`,
  EVENT_CHAT: (id: string | number) => `/app/events/${id}/chat`,
  COURSE_DETAIL: (id: string | number) => `/app/courses/${id}`,
  COURSE_LESSON: (id: string | number, subId: string | number) => `/app/courses/${id}/lesson/${subId}`,
  COURSE_CERTIFICATE: (id: string | number) => `/app/courses/${id}/certificate`,
  ORGANIZATION_DETAIL: (id: string | number) => `/app/organizations/${id}`,
  STORY_CREATE: '/app/stories/create',
  STORY_DETAIL: (id: string | number) => `/app/stories/${id}`,
  REWARD_DETAIL: (id: string | number) => `/app/rewards/${id}`,
  CHAT: '/app/chat',

  // Profile sub-pages (volunteer)
  PROFILE_ACTIVITY_HISTORY: '/app/profile/activityHistory',
  PROFILE_ACHIEVEMENTS: '/app/profile/allAchievements',
  PROFILE_CALENDAR: '/app/profile/calendar',
  PROFILE_LEADERBOARDS: '/app/profile/leaderboards',
  PROFILE_SETTINGS: '/app/profile/settings',
  PROFILE_EDIT: '/app/profile/editProfile',
  PROFILE_CERTIFICATES: '/app/profile/myCertificates',
  PROFILE_CHATS: '/app/profile/myChats',
  PROFILE_REWARDS: '/app/profile/rewardsStore',

  // Organization pages
  ORGANIZATION_DASHBOARD: '/organization/dashboard',
  ORGANIZATION_EVENTS: '/organization/events',
  ORGANIZATION_EVENTS_CREATE: '/organization/events/create',
  ORGANIZATION_EVENTS_EDIT: (id: string | number) => `/organization/events/edit/${id}`,
  ORGANIZATION_EVENTS_PARTICIPANTS: (id: string | number) => `/organization/events/participants/${id}`,
};

export const MESSAGES = {
  TOASTS: {
    STORY_PUBLISHED: 'Ваша история опубликована!',
    REWARD_PURCHASED: 'Поздравляем с покупкой!',
    EVENT_PUBLISHED: 'Событие опубликовано!',
    EVENT_SAVED: 'Событие сохранено!',
    INVITES_SENT: 'Приглашения отправлены!',
    SIGNUP_CANCELLED: 'Ваша запись отменена',
    UNSUBSCRIBED: (name: string) => `Вы отписались от "${name}"`,
    SUBSCRIBED: (name: string) => `Вы подписались на "${name}"`,
    REVIEW_THANKS: 'Спасибо за ваш отзыв!',
  },
  AUTH: {
    LOGIN_ERROR: 'Неверный email или пароль. Попробуйте снова.',
    REGISTER_ERROR: 'Не удалось зарегистрироваться. Попробуйте позже.',
    EMAIL_REQUIRED: 'Пожалуйста, введите email',
    EMAIL_INVALID: 'Пожалуйста, введите корректный email',
    PASSWORD_REQUIRED: 'Пожалуйста, введите пароль',
    FIRST_NAME_REQUIRED: 'Введите имя',
    LAST_NAME_REQUIRED: 'Введите фамилию',
    PASSWORD_MIN_LENGTH: (len: number) => `Пароль должен быть не менее ${len} символов`,
    PASSWORDS_DONT_MATCH: 'Пароли не совпадают',
  },
  ASSISTANT: {
    API_ERROR: 'К сожалению, у меня возникла небольшая проблема. Попробуйте спросить что-нибудь еще чуть позже.',
    EVENT_NOT_FOUND: "Я нашел событие, но не смог загрузить детали."
  }
};

export const UI_TEXT = {
  ASSISTANT_NAME: 'Помощник',
};

export const LEADERBOARD_DEFAULTS = {
  USER_COUNT: 150,
  PERIOD_MULTIPLIERS: {week: 0.25, month: 0.7, allTime: 1.5},
};

export const ONBOARDING_INTERESTS = [
  {id: 'nature', title: 'Защитник природы', Icon: NatureProtectorIcon},
  {id: 'animals', title: 'Друг животных', Icon: AnimalFriendIcon},
  {id: 'seniors', title: 'Помощник старшим', Icon: ElderlyHelperIcon},
  {id: 'art', title: 'Арт-волонтер', Icon: ArtVolunteerIcon},
];

export const REVIEW_QUICK_TAGS = ["👍 Отличная организация", "🤝 Дружелюбная атмосфера", "😊 Было весело", "👎 Было скучно", "🤔 Непонятные задачи"];

// Categories & Filters
export const EVENT_CATEGORIES = ['Экология', 'Животные', 'Помощь старшим', 'Арт', 'Онлайн', 'Спорт', 'Культура', 'Дети'];
export const COURSE_CATEGORIES = ["Все", "Первая помощь", "Экология", "Для новичков", "Животные"];
export const ORGANIZATION_CATEGORIES = ['Дети', 'Экология', 'Помощь пожилым', 'Животные', 'Помощь людям'];
export const REWARD_CATEGORIES: ('Все' | 'Значки' | 'Темы оформления')[] = ['Все', 'Значки', 'Темы оформления'];

export const FILTER_DATE_OPTIONS: FilterDate[] = ['Любая', 'Сегодня', 'На неделе'];
export const FILTER_FORMAT_OPTIONS: FilterFormat[] = ['Все', 'Офлайн', 'Онлайн'];

export const DEFAULT_ORGANIZATION_FILTERS: OrganizationFilters = {
  city: 'Москва',
  categories: [],
  verifiedOnly: true,
};

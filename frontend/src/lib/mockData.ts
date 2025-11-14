import {
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Dog,
  Eye,
  GraduationCap,
  HandHeart,
  Leaf,
  List,
  MessageSquare,
  Palette,
  Star,
  TrendingUp,
  Trophy,
  User as UserIcon,
  Users
} from 'lucide-react';

import type {
  Achievement,
  AppEvent,
  Comment,
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
  User,
  WeeklyChallenge
} from './types';
import {CURRENT_USER_ID, LEADERBOARD_DEFAULTS} from './constants';

export const allEvents: AppEvent[] = [
  {
    id: 1,
    organizationId: 2,
    organizationName: "Гринпис России",
    title: 'Уборка парка "Сокольники"',
    category: 'Экология',
    date: '25 июля, 11:00',
    location: 'Москва, Парк Сокольники',
    Icon: Leaf,
    pos: {top: '30%', left: '25%'},
    requirements: ['Удобная одежда и обувь', 'Хорошее настроение', 'Возраст 18+'],
    participantCount: 30,
    rewards: {hours: 3, karma: 50}
  },
  {
    id: 2,
    organizationId: 4,
    organizationName: "Приют \"Верный друг\"",
    title: 'Помощь в приюте "Верный друг"',
    category: 'Животные',
    date: '26 июля, 13:00',
    location: 'Москва, ул. Лесная, 5',
    Icon: Dog,
    pos: {top: '45%', left: '60%'},
    requirements: ['Любовь к животным', 'Готовность к физической работе'],
    participantCount: 15,
    rewards: {hours: 4, karma: 75}
  },
  {
    id: 3,
    organizationId: 3,
    organizationName: "Фонд \"Старость в радость\"",
    title: 'Доставка продуктов пенсионерам',
    category: 'Помощь старшим',
    date: '28 июля, 09:00',
    location: 'Район "Марьино"',
    Icon: HandHeart,
    pos: {top: '65%', left: '35%'},
    requirements: ['Наличие автомобиля желательно', 'Стрессоустойчивость'],
    participantCount: 10,
    rewards: {hours: 2, karma: 40}
  },
  {
    id: 4,
    organizationId: 1,
    organizationName: "Фонд \"Подари жизнь\"",
    title: 'Организация арт-выставки',
    category: 'Арт',
    date: '30 июля, 18:00',
    location: 'Арт-пространство "Винзавод"',
    Icon: Palette,
    pos: {top: '55%', left: '15%'},
    requirements: ['Креативность', 'Опыт в организации мероприятий приветствуется'],
    participantCount: 20,
    rewards: {hours: 5, karma: 60}
  },
  {
    id: 5,
    organizationId: 7,
    organizationName: "ЛизаАлерт",
    title: 'Онлайн-урок по программированию',
    category: 'Онлайн',
    date: '1 августа, 15:00',
    location: 'Онлайн',
    Icon: BookOpen,
    pos: {top: '20%', left: '75%'},
    requirements: ['Базовые знания HTML/CSS', 'Стабильный интернет'],
    participantCount: 50,
    rewards: {hours: 2, karma: 30}
  },
  {
    id: 6,
    organizationId: 6,
    organizationName: "WWF России",
    title: 'Субботник на набережной',
    category: 'Экология',
    date: '3 августа, 10:00',
    location: 'Москва, Набережная',
    Icon: Leaf,
    pos: {top: '80%', left: '50%'},
    requirements: ['Перчатки и мешки для мусора (предоставляются)', 'Желание сделать город чище'],
    participantCount: 40,
    rewards: {hours: 3, karma: 50}
  },
];

export const activityHistoryEvents: HistoryEvent[] = [
  {
    id: 101,
    organizationId: 1,
    organizationName: "Организатор",
    title: 'Волонтер на марафоне',
    category: 'Спорт',
    date: '5 августа, 08:00',
    location: 'Лужники',
    status: 'upcoming',
    Icon: Trophy,
    pos: {top: '0%', left: '0%'},
    requirements: ['Спортивная форма', 'Бутылка воды'],
    role: 'Помощник на трассе',
    participantCount: 50,
    rewards: {hours: 6, karma: 100}
  },
  {
    id: 102,
    organizationId: 1,
    organizationName: "Организатор",
    title: 'Помощь в организации концерта',
    category: 'Арт',
    date: '12 августа, 16:00',
    location: 'Парк Горького',
    status: 'upcoming',
    Icon: Palette,
    pos: {top: '0%', left: '0%'},
    requirements: ['Ответственность', 'Коммуникабельность'],
    role: 'Координатор',
    participantCount: 10,
    rewards: {hours: 4, karma: 60}
  },
  {...allEvents[0], status: 'past', role: 'Волонтер по уборке'},
  {...allEvents[1], status: 'past', role: 'Помощник по уходу'},
  {...allEvents[2], status: 'past', role: 'Водитель-волонтер'},
];

export const allCourses: Course[] = [
  {
    id: 1, title: "Основы первой помощи", description: "Научитесь оказывать первую помощь в экстренных ситуациях.",
    duration: "60 минут", hasCertificate: true, category: "Первая помощь", Icon: HandHeart,
    status: 'completed', progress: 100, level: 'Для новичков',
    program: [
      {title: 'Введение в первую помощь', type: 'lesson', status: 'completed'},
      {title: 'Оценка состояния пострадавшего', type: 'lesson', status: 'completed'},
      {title: 'Тест: Базовые знания', type: 'test', status: 'completed'},
      {title: 'Сердечно-легочная реанимация', type: 'lesson', status: 'completed'},
      {title: 'Итоговый экзамен', type: 'test', status: 'completed'},
    ]
  },
  {
    id: 2, title: "Эко-волонтерство: С чего начать?", description: "Узнайте, как ваш вклад может помочь планете.",
    duration: "30 минут", hasCertificate: true, category: "Экология", Icon: Leaf,
    status: 'in-progress', progress: 45, level: 'Для новичков',
    program: [
      {title: 'Что такое эко-волонтерство?', type: 'lesson', status: 'completed'},
      {title: 'Виды помощи природе', type: 'lesson', status: 'completed'},
      {
        title: 'Практическое задание', type: 'test', status: 'current',
        contentTitle: 'Сортировка отходов',
        content: `Правильная сортировка отходов — один из самых простых и эффективных способов помочь планете. Вот основные правила:\n\n- **Пластик:** Ищите маркировку (цифры в треугольнике). Обычно принимают типы 1 (PET) и 2 (HDPE). Бутылки нужно сполоснуть и смять.\n- **Стекло:** Банки и бутылки. Мыть не обязательно, но желательно. Пробки и крышки нужно снять.\n- **Бумага:** Газеты, картон, журналы. Нельзя сдавать чеки, салфетки и ламинированную бумагу.\n\nЗапомнили? Теперь давайте проверим!`,
        quiz: [
          {
            id: 'q1',
            question: 'Какой тип пластика обычно принимают на переработку?',
            type: 'single',
            options: ['Тип 3 (PVC)', 'Тип 1 (PET)', 'Тип 6 (PS)'],
            correctAnswer: 'Тип 1 (PET)'
          },
          {
            id: 'q2',
            question: 'Что из перечисленного НЕЛЬЗЯ сдавать в макулатуру?',
            type: 'multiple',
            options: ['Старая газета', 'Картонная коробка', 'Бумажный чек из магазина', 'Салфетки'],
            correctAnswers: ['Бумажный чек из магазина', 'Салфетки']
          }
        ]
      },
      {title: 'Как организовать свою акцию', type: 'lesson', status: 'locked'},
    ]
  },
  {
    id: 3, title: "Работа с животными в приютах", description: "Базовые навыки для помощи бездомным животным.",
    duration: "45 минут", hasCertificate: false, category: "Животные", Icon: Dog,
    status: 'not-started', progress: 0, level: 'Средний',
    program: [
      {title: 'Психология бездомных животных', type: 'lesson', status: 'locked'},
      {title: 'Техника безопасности в приюте', type: 'lesson', status: 'locked'},
      {title: 'Основы ухода и кормления', type: 'lesson', status: 'locked'},
    ]
  },
  {
    id: 4,
    title: "Введение в социальное волонтерство",
    description: "Как эффективно помогать людям, оказавшимся в беде.",
    duration: "90 минут",
    hasCertificate: true,
    category: "Для новичков",
    Icon: HandHeart,
    status: 'completed',
    progress: 100,
    level: 'Для новичков',
    program: [
      {title: 'Кто такой социальный волонтер?', type: 'lesson', status: 'locked'},
      {title: 'Этика и границы в общении', type: 'lesson', status: 'locked'},
      {title: 'Практические кейсы', type: 'test', status: 'locked'},
    ]
  },
  {
    id: 5,
    title: "Организация мероприятий: от идеи до реализации",
    description: "Полный гид по созданию успешного волонтерского ивента.",
    duration: "120 минут",
    hasCertificate: true,
    category: "Для новичков",
    Icon: Palette,
    status: 'not-started',
    progress: 0,
    level: 'Продвинутый',
    program: [
      {title: 'Планирование и бюджет', type: 'lesson', status: 'locked'},
      {title: 'Работа с командой', type: 'lesson', status: 'locked'},
      {title: 'Привлечение участников', type: 'lesson', status: 'locked'},
      {title: 'Финальный проект', type: 'test', status: 'locked'},
    ]
  },
];

export const allOrganizationsData: (Omit<Organization, 'isSubscribed'>)[] = [
  {
    id: 1,
    name: 'Фонд "Подари жизнь"',
    description: 'Помощь детям с онко-заболеваниями',
    category: 'Дети',
    logoUrl: 'https://i.pravatar.cc/64?img=11',
    isVerified: true,
    coverImageUrl: `https://picsum.photos/seed/1/600/400`,
    rating: 4.9,
    reviewCount: 120,
    subscribers: 12500,
    websiteUrl: '#',
    fullDescription: '«Подари жизнь» — негосударственный благотворительный фонд, помогающий детям и молодым взрослым до 25 лет с онкологическими и тяжелыми гематологическими заболеваниями. Мы верим, что вместе можем сделать больше.',
    address: 'Москва, ул. Добрая, д. 1, офис 101'
  },
  {
    id: 2,
    name: 'Гринпис России',
    description: 'Защита природы и экологии',
    category: 'Экология',
    logoUrl: 'https://i.pravatar.cc/64?img=12',
    isVerified: true,
    coverImageUrl: `https://picsum.photos/seed/2/600/400`,
    rating: 4.8,
    reviewCount: 95,
    subscribers: 8400,
    websiteUrl: '#',
    fullDescription: 'Гринпис — это международная независимая неправительственная экологическая организация, созданная с целью сохранить природу и мир на планете. Мы существуем на пожертвования неравнодушных людей и не принимаем финансовую помощь от государственных и коммерческих структур.',
    address: 'Москва, ул. Лесная, д. 5, этаж 3'
  },
  {
    id: 3,
    name: 'Фонд "Старость в радость"',
    description: 'Помощь пожилым людям и инвалидам',
    category: 'Помощь пожилым',
    logoUrl: 'https://i.pravatar.cc/64?img=13',
    isVerified: true,
    coverImageUrl: `https://picsum.photos/seed/3/600/400`,
    rating: 5.0,
    reviewCount: 250,
    subscribers: 9800,
    websiteUrl: '#',
    fullDescription: 'Мы помогаем пожилым людям и инвалидам в домах престарелых и психоневрологических интернатах. Наша цель — дать им почувствовать, что они не одиноки, что о них помнят и заботятся.',
    address: 'Москва, ул. Садовая, д. 10'
  },
  {
    id: 4,
    name: 'Приют "Верный друг"',
    description: 'Помощь бездомным животным',
    category: 'Животные',
    logoUrl: 'https://i.pravatar.cc/64?img=14',
    isVerified: false,
    coverImageUrl: `https://picsum.photos/seed/4/600/400`,
    rating: 4.6,
    reviewCount: 50,
    subscribers: 3200,
    websiteUrl: '#',
    fullDescription: '«Верный друг» — это частный приют для бездомных собак и кошек. Мы лечим, стерилизуем и находим новый дом для наших подопечных. Приюту всегда нужна помощь волонтеров и финансовая поддержка.',
    address: 'Московская область, пос. Лесной, ул. Центральная, 1'
  },
  {
    id: 5,
    name: 'Ночлежка',
    description: 'Помощь бездомным людям',
    category: 'Помощь людям',
    logoUrl: 'https://i.pravatar.cc/64?img=15',
    isVerified: true,
    coverImageUrl: `https://picsum.photos/seed/5/600/400`,
    rating: 4.9,
    reviewCount: 180,
    subscribers: 6100,
    websiteUrl: '#',
    fullDescription: 'Старейшая благотворительная организация, помогающая бездомным людям в Санкт-Петербурге и Москве. Мы кормим, обогреваем, помогаем с документами, работой, лечением и возвращением домой.',
    address: 'Москва, ул. Социальная, д. 22'
  },
  {
    id: 6,
    name: 'WWF России',
    description: 'Всемирный фонд дикой природы',
    category: 'Экология',
    logoUrl: 'https://i.pravatar.cc/64?img=16',
    isVerified: true,
    coverImageUrl: `https://picsum.photos/seed/6/600/400`,
    rating: 4.8,
    reviewCount: 310,
    subscribers: 15300,
    websiteUrl: '#',
    fullDescription: 'Наша миссия — в сохранении биологического разнообразия Земли. Мы работаем в более чем 100 странах и поддерживаем около 1300 природоохранных проектов по всему миру.',
    address: 'Москва, ул. Природы, д. 8'
  },
  {
    id: 7,
    name: 'ЛизаАлерт',
    description: 'Поисково-спасательный отряд',
    category: 'Дети',
    logoUrl: 'https://i.pravatar.cc/64?img=17',
    isVerified: true,
    coverImageUrl: `https://picsum.photos/seed/7/600/400`,
    rating: 5.0,
    reviewCount: 450,
    subscribers: 25000,
    websiteUrl: '#',
    fullDescription: 'Добровольческий поисково-спасательный отряд, занимающийся поиском пропавших людей. Мы не принимаем денежную помощь, но всегда нуждаемся в волонтерах и оборудовании.',
    address: 'Москва, ул. Поисковая, д. 1'
  },
  {
    id: 8,
    name: 'Фонд Хабенского',
    description: 'Помощь детям с заболеваниями мозга',
    category: 'Дети',
    logoUrl: 'https://i.pravatar.cc/64?img=18',
    isVerified: true,
    coverImageUrl: `https://picsum.photos/seed/8/600/400`,
    rating: 4.9,
    reviewCount: 220,
    subscribers: 11200,
    websiteUrl: '#',
    fullDescription: 'Благотворительный Фонд Константина Хабенского с 2008 года помогает детям и молодым взрослым с опухолями головного и спинного мозга вовремя получать всю необходимую медицинскую помощь и возвращаться к полноценной жизни.',
    address: 'Москва, ул. Надежды, д. 4'
  },
];

export const allAchievements: Achievement[] = [
  {
    id: 1,
    name: 'Первый шаг',
    description: 'Выдается за завершение вашего первого волонтерского события.',
    Icon: HandHeart,
    unlocked: true,
    unlockedDate: '15.06.2024'
  },
  {
    id: 2,
    name: 'Друг животных',
    description: 'Выдается за участие в 3 событиях по помощи животным.',
    Icon: Dog,
    unlocked: true,
    unlockedDate: '28.06.2024'
  },
  {
    id: 3,
    name: 'Эко-воин',
    description: 'Выдается за участие в 5 экологических акциях.',
    Icon: Leaf,
    unlocked: true,
    unlockedDate: '12.07.2024'
  },
  {
    id: 4,
    name: 'Душа компании',
    description: 'Выдается за подписку на 5 организаций.',
    Icon: Users,
    unlocked: true,
    unlockedDate: '14.07.2024'
  },
  {
    id: 5,
    name: 'Мастер помощи',
    description: 'Выдается за 3-х кратную помощь пожилым людям.',
    Icon: HandHeart,
    unlocked: true,
    unlockedDate: '22.07.2024'
  },
  {
    id: 6,
    name: 'Марафонец добра',
    description: 'Выдается за накопление 20 часов волонтерства.',
    Icon: Trophy,
    unlocked: true,
    unlockedDate: '25.07.2024'
  },
  {
    id: 7,
    name: 'Всезнайка',
    description: 'Выдается за прохождение 3 обучающих курсов.',
    Icon: GraduationCap,
    unlocked: true,
    unlockedDate: '29.07.2024'
  },
  {
    id: 8,
    name: 'Лидер мнений',
    description: 'Выдается за приглашение 3 друзей в приложение.',
    Icon: Star,
    unlocked: true,
    unlockedDate: '01.08.2024'
  },
  {
    id: 9,
    name: 'Ветеран',
    description: 'Примите участие в 25 событиях, чтобы разблокировать.',
    Icon: Trophy,
    unlocked: false,
    progress: 18,
    target: 25,
    cta: 'Найти новое событие',
    filterCategory: 'Все'
  },
  {
    id: 10,
    name: 'Арт-эксперт',
    description: 'Помогите в организации 5 культурных мероприятий.',
    Icon: Palette,
    unlocked: false,
    progress: 2,
    target: 5,
    cta: 'Найти арт-событие',
    filterCategory: 'Арт'
  },
  {
    id: 11,
    name: 'Хранитель времени',
    description: 'Накопите 100 часов волонтерства.',
    Icon: Clock,
    unlocked: false,
    progress: 78,
    target: 100,
    cta: 'Продолжить помогать',
    filterCategory: 'Все'
  },
  {
    id: 12,
    name: 'Специалист',
    description: 'Пройдите курсы из 5 разных категорий.',
    Icon: GraduationCap,
    unlocked: false,
    progress: 3,
    target: 5,
    cta: 'Начать новый курс',
    filterCategory: 'Обучение'
  },
  {
    id: 13,
    name: 'Суперзвезда',
    description: 'Получите 5000 очков кармы.',
    Icon: Star,
    unlocked: false,
    progress: 3250,
    target: 5000,
    cta: 'Заработать карму',
    filterCategory: 'Все'
  },
  {
    id: 14,
    name: 'Организатор',
    description: 'Организуйте собственное событие.',
    Icon: List,
    unlocked: false,
    progress: 0,
    target: 1,
    cta: 'Создать событие',
    filterCategory: 'Организация'
  },
  {
    id: 15,
    name: 'Меценат',
    description: 'Поддержите 10 разных организаций.',
    Icon: HandHeart,
    unlocked: false,
    progress: 6,
    target: 10,
    cta: 'Найти организацию',
    filterCategory: 'Организации'
  },
];

export const mockDashboardStats: OrganizationStat[] = [
  {id: 'new_volunteers', label: 'Новых волонтеров', value: '12', Icon: UserIcon, change: '+5%'},
  {id: 'total_regs', label: 'Всего регистраций', value: '87', Icon: CheckCircle, change: '+12%'},
  {id: 'event_views', label: 'Просмотры событий', value: '1.2k', Icon: Eye, change: '-3%'},
  {id: 'response_rate', label: 'Коэффициент отклика', value: '23%', Icon: TrendingUp, change: '+1.5%'},
];

export const mockOrganizationDetails: OrganizationDetails = {
  id: 1,
  name: 'Фонд "Подари жизнь"'
};

export const mockOrganizationEvents: OrganizationEvent[] = [
  {
    id: 1,
    title: 'Субботник на набережной',
    date: '3 августа, 10:00',
    status: 'active',
    participantCount: 18,
    capacity: 25,
    newApplications: 3
  },
  {
    id: 2,
    title: 'Волонтер на марафоне',
    date: '5 августа, 08:00',
    status: 'active',
    participantCount: 45,
    capacity: 50,
    newApplications: 0
  },
  {
    id: 3,
    title: 'Помощь в организации концерта',
    date: '12 августа, 16:00',
    status: 'active',
    participantCount: 8,
    capacity: 10,
    newApplications: 1
  },
  {
    id: 4,
    title: 'Уборка парка "Сокольники"',
    date: '25 июля, 11:00',
    status: 'past',
    participantCount: 30,
    capacity: 30,
    newApplications: 0
  },
  {
    id: 5,
    title: 'Помощь в приюте "Верный друг"',
    date: '26 июля, 13:00',
    status: 'past',
    participantCount: 15,
    capacity: 15,
    newApplications: 0
  },
  {
    id: 6,
    title: 'Осенний фестиваль',
    date: 'Планируется',
    status: 'draft',
    participantCount: 0,
    capacity: 50,
    newApplications: 0
  },
];

export const mockParticipants: EventParticipant[] = [
  {id: 1, name: 'Александр Смирнов', avatarUrl: 'https://i.pravatar.cc/48?img=21', rating: 4.9, status: 'new'},
  {id: 2, name: 'Мария Иванова', avatarUrl: 'https://i.pravatar.cc/48?img=22', rating: 4.8, status: 'new'},
  {id: 3, name: 'Дмитрий Кузнецов', avatarUrl: 'https://i.pravatar.cc/48?img=23', rating: 4.7, status: 'new'},
  {id: 4, name: 'Анна Попова', avatarUrl: 'https://i.pravatar.cc/48?img=24', rating: 5.0, status: 'confirmed'},
  {id: 5, name: 'Сергей Васильев', avatarUrl: 'https://i.pravatar.cc/48?img=25', rating: 4.9, status: 'confirmed'},
  {id: 6, name: 'Екатерина Петрова', avatarUrl: 'https://i.pravatar.cc/48?img=26', rating: 4.9, status: 'confirmed'},
  {id: 7, name: 'Андрей Соколов', avatarUrl: 'https://i.pravatar.cc/48?img=27', rating: 4.8, status: 'confirmed'},
  {id: 8, name: 'Ольга Михайлова', avatarUrl: 'https://i.pravatar.cc/48?img=28', rating: 4.8, status: 'confirmed'},
  {id: 9, name: 'Алексей Новиков', avatarUrl: 'https://i.pravatar.cc/48?img=29', rating: 4.7, status: 'confirmed'},
  {id: 10, name: 'Наталья Фёдорова', avatarUrl: 'https://i.pravatar.cc/48?img=30', rating: 4.6, status: 'confirmed'},
  {id: 11, name: 'Иван Петров', avatarUrl: 'https://i.pravatar.cc/48?img=31', rating: 4.5, status: 'confirmed'},
  {id: 12, name: 'Олег Сидоров', avatarUrl: 'https://i.pravatar.cc/48?img=32', rating: 4.2, status: 'rejected'},
];

export const defaultUserData: User = {
  firstName: "Елена",
  lastName: "Иванова",
  avatarUrl: "https://i.pravatar.cc/150?img=1",
  about: "Люблю помогать животным и участвовать в экологических акциях. В свободное время занимаюсь фотографией.",
  level: "Герой-новичок",
  progress: 65,
  nextLevel: "Опытный помощник",
  stats: [
    {id: 'hours', value: '128', label: 'часов добра', Icon: Clock},
    {id: 'karma', value: '15,200', label: 'баллов кармы', Icon: Star},
    {id: 'events', value: '24', label: 'события', Icon: Calendar},
    {id: 'achievements', value: '8', label: 'ачивок', Icon: Trophy},
  ],
  achievements: [
    {id: 1, name: 'Первый шаг', Icon: HandHeart},
    {id: 2, name: 'Друг животных', Icon: Dog},
    {id: 3, name: 'Эко-воин', Icon: Leaf},
    {id: 4, name: 'Душа компании', Icon: Users},
    {id: 5, name: 'Мастер помощи', Icon: HandHeart},
  ],
  navigation: [
    {id: 'activityHistory', label: 'История активностей', Icon: List},
    {id: 'calendar', label: 'Мой календарь', Icon: Calendar},
    {id: 'myChats', label: 'Мои чаты', Icon: MessageSquare},
    {id: 'myCertificates', label: 'Мои сертификаты', Icon: GraduationCap},
    {id: 'leaderboards', label: 'Лидерборды', Icon: Trophy},
    {id: 'rewardsStore', label: 'Магазин наград', Icon: Star},
    {id: 'switchToOrganization', label: 'Режим организатора', Icon: Briefcase},
  ],
};

const firstNames = ["Александр", "Мария", "Дмитрий", "Анна", "Сергей", "Екатерина", "Андрей", "Ольга", "Алексей", "Наталья"];
const lastNames = ["Смирнов", "Иванова", "Кузнецов", "Попова", "Васильев", "Петрова", "Соколов", "Михайлова", "Новиков", "Фёдорова"];

const generateLeaderboard = (period: 'week' | 'month' | 'allTime'): LeaderboardUser[] => {
  const {USER_COUNT, PERIOD_MULTIPLIERS} = LEADERBOARD_DEFAULTS;
  const periodMultiplier = PERIOD_MULTIPLIERS[period];

  let users = Array.from({length: USER_COUNT}, (_, i) => {
    const id = i + 2;
    return {
      id: id,
      name: `${firstNames[id % firstNames.length]} ${lastNames[id % lastNames.length].slice(0, 1)}.`,
      avatarUrl: `https://i.pravatar.cc/48?img=${id + 20}`,
      karma: Math.floor(
        ((USER_COUNT - i) * 100 + Math.sin(id) * 500) * periodMultiplier
      ),
    };
  });

  const currentUser = {
    id: CURRENT_USER_ID,
    name: `${defaultUserData.firstName} ${defaultUserData.lastName}`,
    avatarUrl: defaultUserData.avatarUrl,
    karma: Math.floor(15200 * periodMultiplier * (period === 'week' ? 0.5 : 1)),
  };

  users.push(currentUser);

  return users
    .sort((a, b) => b.karma - a.karma)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
};

export const leaderboardsData = {
  week: generateLeaderboard('week'),
  month: generateLeaderboard('month'),
  allTime: generateLeaderboard('allTime'),
};

export const mockFriends: Friend[] = [
  {id: 1, name: 'Александр Смирнов', avatarUrl: 'https://i.pravatar.cc/48?img=21'},
  {id: 2, name: 'Мария Иванова', avatarUrl: 'https://i.pravatar.cc/48?img=22'},
  {id: 3, name: 'Дмитрий Кузнецов', avatarUrl: 'https://i.pravatar.cc/48?img=23'},
  {id: 4, name: 'Анна Попова', avatarUrl: 'https://i.pravatar.cc/48?img=24'},
  {id: 5, name: 'Сергей Васильев', avatarUrl: 'https://i.pravatar.cc/48?img=25'},
  {id: 6, name: 'Екатерина Петрова', avatarUrl: 'https://i.pravatar.cc/48?img=26'},
  {id: 7, name: 'Андрей Соколов', avatarUrl: 'https://i.pravatar.cc/48?img=27'},
  {id: 8, name: 'Ольга Михайлова', avatarUrl: 'https://i.pravatar.cc/48?img=28'},
  {id: 9, name: 'Алексей Новиков', avatarUrl: 'https://i.pravatar.cc/48?img=29'},
  {id: 10, name: 'Наталья Фёдорова', avatarUrl: 'https://i.pravatar.cc/48?img=30'},
  {id: 11, name: 'Иван Петров', avatarUrl: 'https://i.pravatar.cc/48?img=31'},
  {id: 12, name: 'Олег Сидоров', avatarUrl: 'https://i.pravatar.cc/48?img=32'},
];

const mockComments: Comment[] = [
  {
    id: 1,
    author: {name: 'Сергей Васильев', avatarUrl: 'https://i.pravatar.cc/48?img=25'},
    timestamp: '1 час назад',
    text: 'Отличная работа! Так держать! 💪'
  },
  {
    id: 2,
    author: {name: 'Анна Попова', avatarUrl: 'https://i.pravatar.cc/48?img=24'},
    timestamp: '45 минут назад',
    text: 'Какие вы молодцы! В следующий раз я с вами.'
  },
  {
    id: 3,
    author: {name: 'Елена Иванова', avatarUrl: 'https://i.pravatar.cc/150?img=1'},
    timestamp: '10 минут назад',
    text: 'Очень вдохновляет! Спасибо, что поделились.'
  },
];

export const allStories: Story[] = [
  {
    id: 1,
    author: {
      name: "Мария Петрова",
      avatarUrl: 'https://i.pravatar.cc/48?img=2'
    },
    timestamp: "2 часа назад",
    event: {
      id: 1,
      name: 'Уборка парка "Сокольники"'
    },
    text: "Отлично провели время на субботнике! Сделали парк чище и познакомились с замечательными людьми. Природа сказала нам спасибо! 🌳💚",
    imageUrl: "https://picsum.photos/seed/story1/600/400",
    likes: 124,
    comments: 3,
    commentsData: mockComments,
  },
  {
    id: 2,
    author: {
      name: "Алексей Новиков",
      avatarUrl: 'https://i.pravatar.cc/48?img=9'
    },
    timestamp: "Вчера в 18:30",
    event: {
      id: 2,
      name: 'Помощь в приюте "Верный друг"'
    },
    text: "Провели день с пушистыми друзьями в приюте. Эти глаза не могут врать, им очень нужна наша забота. Каждый может помочь! 🐾",
    imageUrl: "https://picsum.photos/seed/story2/600/600",
    likes: 256,
    comments: 2,
    commentsData: [
      {
        id: 4,
        author: {name: 'Дмитрий Кузнецов', avatarUrl: 'https://i.pravatar.cc/48?img=23'},
        timestamp: 'Вчера в 20:10',
        text: 'Какая прелесть! Обязательно посещу этот приют.'
      },
      {
        id: 5,
        author: {name: 'Ольга Михайлова', avatarUrl: 'https://i.pravatar.cc/48?img=28'},
        timestamp: 'Вчера в 19:00',
        text: 'Очень трогательно. Вы делаете большое дело!'
      },
    ],
  },
  {
    id: 3,
    author: {
      name: "Екатерина Васильева",
      avatarUrl: 'https://i.pravatar.cc/48?img=6'
    },
    timestamp: "25 июля",
    event: {
      id: 4,
      name: 'Организация арт-выставки'
    },
    text: "Помогли организовать выставку для фонда \"Подари жизнь\". Творчество и доброта - невероятная сила! Спасибо всем, кто пришел.",
    imageUrl: "https://picsum.photos/seed/story3/600/800",
    likes: 98,
    comments: 1,
    commentsData: [
      {
        id: 6,
        author: {name: 'Андрей Соколов', avatarUrl: 'https://i.pravatar.cc/48?img=27'},
        timestamp: '25 июля',
        text: 'Круто! Искусство и доброта спасут мир.'
      },
    ],
  }
];

export const myChatsData: MyChatItem[] = [
  {
    id: 1,
    eventId: 1,
    eventTitle: 'Уборка парка "Сокольники"',
    Icon: Leaf,
    lastMessage: 'Анна П.: Если кто-то поедет от метро Сокольники, можем встретиться!',
    timestamp: '14:31',
    unreadCount: 3,
    isArchived: false,
  },
  {
    id: 2,
    eventId: 101,
    eventTitle: 'Волонтер на марафоне',
    Icon: Trophy,
    lastMessage: 'Организатор: Не забудьте взять с собой воду и головные уборы.',
    timestamp: '09:15',
    unreadCount: 0,
    isArchived: false,
  },
  {
    id: 3,
    eventId: 2,
    eventTitle: 'Помощь в приюте "Верный друг"',
    Icon: Dog,
    lastMessage: 'Вы: Отличная идея!',
    timestamp: 'Вчера',
    unreadCount: 0,
    isArchived: true,
  },
  {
    id: 4,
    eventId: 4,
    eventTitle: 'Организация арт-выставки',
    Icon: Palette,
    lastMessage: 'Сергей В.: Все готово к открытию!',
    timestamp: '2 дн. назад',
    unreadCount: 0,
    isArchived: true,
  }
];

export const allRewards: RewardItem[] = [
  {
    id: 1,
    name: 'Значок "Эко-воин"',
    category: 'Значки',
    price: 500,
    imageUrl: 'https://picsum.photos/seed/badge1/200',
    isPurchased: true
  },
  {
    id: 2,
    name: 'Значок "Друг животных"',
    category: 'Значки',
    price: 500,
    imageUrl: 'https://picsum.photos/seed/badge2/200',
    isPurchased: false
  },
  {
    id: 3,
    name: 'Тема "Космос"',
    category: 'Темы оформления',
    price: 1500,
    imageUrl: 'https://picsum.photos/seed/theme1/200',
    isPurchased: false
  },
  {
    id: 4,
    name: 'Значок "Лидер"',
    category: 'Значки',
    price: 1000,
    imageUrl: 'https://picsum.photos/seed/badge3/200',
    isPurchased: true
  },
  {
    id: 5,
    name: 'Тема "Природа"',
    category: 'Темы оформления',
    price: 1500,
    imageUrl: 'https://picsum.photos/seed/theme2/200',
    isPurchased: true
  },
  {
    id: 6,
    name: 'Значок "Первооткрыватель"',
    category: 'Значки',
    price: 250,
    imageUrl: 'https://picsum.photos/seed/badge4/200',
    isPurchased: false
  },
];

export const mockMapMarkers: MapMarker[] = [
  {id: 1, position: [55.7963, 37.679], title: 'Уборка парка "Сокольники"', description: '25 июля, 11:00'},
  {id: 2, position: [55.7341, 37.642], title: 'Помощь в приюте "Верный друг"', description: '26 июля, 13:00'},
  {id: 3, position: [55.652, 37.741], title: 'Доставка продуктов пенсионерам', description: 'Район "Марьино"'},
  {id: 4, position: [55.759, 37.662], title: 'Организация арт-выставки', description: 'Арт-пространство "Винзавод"'},
];

export const mockEventChatMessages: EventChatMessage[] = [
  {
    id: 1,
    author: {id: 10, name: 'Организатор', avatarUrl: 'https://i.pravatar.cc/48?img=11'},
    text: 'Всем привет! Рад видеть всех, кто откликнулся. Встречаемся завтра в 10:00 у главного входа в парк.',
    timestamp: '14:20'
  },
  {
    id: 2,
    author: {id: 2, name: 'Александр С.', avatarUrl: 'https://i.pravatar.cc/48?img=21'},
    text: 'Отлично, буду на месте!',
    timestamp: '14:22'
  },
  {
    id: 3,
    author: {id: 3, name: 'Мария И.', avatarUrl: 'https://i.pravatar.cc/48?img=22'},
    text: 'А парковка там есть рядом?',
    timestamp: '14:25'
  },
  {
    id: 4,
    author: {id: 10, name: 'Организатор', avatarUrl: 'https://i.pravatar.cc/48?img=11'},
    text: 'Да, есть платная городская парковка вдоль улицы.',
    timestamp: '14:26'
  },
  {
    id: 5,
    author: {id: CURRENT_USER_ID, name: 'Елена Иванова', avatarUrl: 'https://i.pravatar.cc/150?img=1'},
    text: 'Поняла, спасибо! Постараюсь быть вовремя.',
    timestamp: '14:30'
  },
  {
    id: 6,
    author: {id: 4, name: 'Анна П.', avatarUrl: 'https://i.pravatar.cc/48?img=24'},
    text: 'Если кто-то поедет от метро Сокольники, можем встретиться и пойти вместе!',
    timestamp: '14:31'
  },
  {
    id: 7,
    author: {id: CURRENT_USER_ID, name: 'Елена Иванова', avatarUrl: 'https://i.pravatar.cc/150?img=1'},
    text: 'Отличная идея!',
    timestamp: '14:32'
  },
];

export const mockWeeklyChallenge: WeeklyChallenge = {
  title: "Челлендж недели",
  description: "Помогите животным 1 раз",
  reward: "Награда: +100 баллов кармы ✨",
  Icon: Dog,
  progress: 0,
  target: 1,
  filterCategory: "Животные",
  isCompleted: false,
};

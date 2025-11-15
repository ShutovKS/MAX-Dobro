// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- UUIDs для ключевых пользователей из mockData ---
const volunteerId = '3eec394c-a786-44f6-b29d-3b201d540502'; // Corresponds to defaultUserData
const friendId = '61df2213-3982-40dd-9fe4-27c1c89eed9b';
const organizerId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';

async function main() {
  console.log('--- Start seeding with mock data structure ---');

  // 1. Полная очистка
  const tableNames = [
    'reviews', 'story_likes', 'comments', 'stories', 'event_chat_messages', 'event_chats',
    'user_challenges', 'user_rewards', 'user_certificates', 'user_achievements',
    'event_participants', 'user_organization_subscriptions', 'karma_logs', 'chat_messages', // <-- ИСПРАВЛЕНО
    'friendships', 'events', 'lessons', 'quiz_answers', 'quiz_questions',
    'courses', 'organizations', 'users', 'achievements', 'challenges', 'rewards'
  ];
  for (const tableName of tableNames) {
    await prisma.$queryRawUnsafe(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`);
  }
  console.log('✅ Database cleared.');

  // 2. Пользователи
  const mainUser = await prisma.user.create({
    data: {
      email: 'volunteer@test.com',
      supabaseUserId: volunteerId,
      firstName: 'Елена',
      lastName: 'Иванова',
      about: 'Люблю помогать животным и участвовать в экологических акциях.',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      role: 'volunteer',
      totalHours: 128,
      karmaPoints: 15200,
    },
  });

  const friendUser = await prisma.user.create({
    data: {
      email: 'friend@test.com',
      supabaseUserId: friendId,
      firstName: 'Александр',
      lastName: 'Смирнов',
      avatarUrl: 'https://i.pravatar.cc/150?u=friend',
    },
  });
  
  const otherUsers = await prisma.user.createManyAndReturn({
    data: [
      { email: 'user2@test.com', supabaseUserId: 'user2-id', firstName: 'Мария', lastName: 'Петрова', avatarUrl: 'https://i.pravatar.cc/150?u=user2' },
      { email: 'user3@test.com', supabaseUserId: 'user3-id', firstName: 'Алексей', lastName: 'Новиков', avatarUrl: 'https://i.pravatar.cc/150?u=user3' },
      { email: 'user4@test.com', supabaseUserId: 'user4-id', firstName: 'Анна', lastName: 'Попова', avatarUrl: 'https://i.pravatar.cc/150?u=user4' },
    ]
  });

  await prisma.user.create({
    data: {
      email: 'organizer@test.com',
      supabaseUserId: organizerId,
      firstName: 'Иван',
      lastName: 'Организаторов',
      avatarUrl: 'https://i.pravatar.cc/150?u=organizer',
      role: 'organization',
    },
  });
  console.log('✅ Users created.');

  // 3. Организации (как в mockData)
  const [org1, org2, org3, org4, org5, org6, org7, org8] = await prisma.organization.createManyAndReturn({
    data: [
      { id: 1, name: 'Фонд "Подари жизнь"', description: 'Помощь детям с онко-заболеваниями', category: 'Дети', isVerified: true, websiteUrl: '#', address: 'Москва, ул. Добрая, д. 1' },
      { id: 2, name: 'Гринпис России', description: 'Защита природы и экологии', category: 'Экология', isVerified: true, websiteUrl: '#', address: 'Москва, ул. Лесная, д. 5' },
      { id: 3, name: 'Фонд "Старость в радость"', description: 'Помощь пожилым людям', category: 'Помощь пожилым', isVerified: true, websiteUrl: '#', address: 'Москва, ул. Садовая, д. 10' },
      { id: 4, name: 'Приют "Верный друг"', description: 'Помощь бездомным животным', category: 'Животные', isVerified: false, websiteUrl: '#', address: 'МО, пос. Лесной, ул. Центральная, 1' },
      { id: 5, name: 'Ночлежка', description: 'Помощь бездомным людям', category: 'Помощь людям', isVerified: true, websiteUrl: '#', address: 'Москва, ул. Социальная, д. 22' },
      { id: 6, name: 'WWF России', description: 'Всемирный фонд дикой природы', category: 'Экология', isVerified: true, websiteUrl: '#', address: 'Москва, ул. Природы, д. 8' },
      { id: 7, name: 'ЛизаАлерт', description: 'Поисково-спасательный отряд', category: 'Дети', isVerified: true, websiteUrl: '#', address: 'Москва, ул. Поисковая, д. 1' },
      { id: 8, name: 'Фонд Хабенского', description: 'Помощь детям с заболеваниями мозга', category: 'Дети', isVerified: true, websiteUrl: '#', address: 'Москва, ул. Надежды, д. 4' },
    ]
  });
  console.log('✅ Organizations created.');

  // 4. Курсы (как в mockData)
  const [course1, course2, course3, course4, course5] = await prisma.course.createManyAndReturn({
    data: [
      { id: 1, title: "Основы первой помощи", description: "Научитесь оказывать первую помощь.", duration: "60 минут", category: "Первая помощь", level: 'Для новичков', icon: 'first-aid' },
      { id: 2, title: "Эко-волонтерство: С чего начать?", description: "Узнайте, как ваш вклад может помочь планете.", duration: "30 минут", category: "Экология", level: 'Для новичков', icon: 'leaf' },
      { id: 3, title: "Работа с животными в приютах", description: "Базовые навыки для помощи бездомным.", duration: "45 минут", category: "Животные", level: 'Средний', icon: 'dog' },
      { id: 4, title: "Введение в социальное волонтерство", description: "Как эффективно помогать людям.", duration: "90 минут", category: "Для новичков", level: 'Для новичков', icon: 'hand-heart' },
      { id: 5, title: "Организация мероприятий", description: "Гид по созданию ивента.", duration: "120 минут", category: "Для новичков", level: 'Продвинутый', icon: 'palette' },
    ]
  });
  await prisma.userCertificate.createMany({ data: [{ userId: mainUser.id, courseId: course1.id }, { userId: mainUser.id, courseId: course4.id }] });
  console.log('✅ Courses and certificates created.');

  // 5. События (как в mockData, с динамическими датами)
  const now = new Date();
  const [event1, event2, event3, event4, event5, event6, event101, event102] = await prisma.event.createManyAndReturn({
    data: [
      { id: 1, organizationId: org2.id, title: 'Уборка парка "Сокольники"', description: 'Убираем мусор и высаживаем новые деревья.', category: 'Экология', date: new Date(now.getTime() - 10 * 24 * 3600 * 1000), status: 'COMPLETED', location: 'Москва, Парк Сокольники', latitude: 55.7963, longitude: 37.679, durationHours: 3, karmaPoints: 50 },
      { id: 2, organizationId: org4.id, title: 'Помощь в приюте "Верный друг"', description: 'Помогаем ухаживать за животными.', category: 'Животные', date: new Date(now.getTime() - 9 * 24 * 3600 * 1000), status: 'COMPLETED', location: 'Москва, ул. Лесная, 5', latitude: 55.7341, longitude: 37.642, durationHours: 4, karmaPoints: 75 },
      { id: 3, organizationId: org3.id, title: 'Доставка продуктов пенсионерам', description: 'Развозим продуктовые наборы.', category: 'Помощь старшим', date: new Date(now.getTime() - 7 * 24 * 3600 * 1000), status: 'COMPLETED', location: 'Район "Марьино"', latitude: 55.652, longitude: 37.741, durationHours: 2, karmaPoints: 40 },
      { id: 4, organizationId: org1.id, title: 'Организация арт-выставки', description: 'Помощь в монтаже и встрече гостей.', category: 'Арт', date: new Date(now.getTime() + 5 * 24 * 3600 * 1000), status: 'PLANNED', location: 'Арт-пространство "Винзавод"', latitude: 55.759, longitude: 37.662, durationHours: 5, karmaPoints: 60 },
      { id: 5, organizationId: org7.id, title: 'Онлайн-урок по программированию', description: 'Проводим урок для детей.', category: 'Онлайн', date: new Date(now.getTime() + 7 * 24 * 3600 * 1000), status: 'PLANNED', location: 'Онлайн', durationHours: 2, karmaPoints: 30 },
      { id: 6, organizationId: org6.id, title: 'Субботник на набережной', description: 'Очищаем береговую линию.', category: 'Экология', date: new Date(now.getTime() + 9 * 24 * 3600 * 1000), status: 'PLANNED', location: 'Москва, Набережная', latitude: 55.74, longitude: 37.6, durationHours: 3, karmaPoints: 50 },
      { id: 101, organizationId: org1.id, title: 'Волонтер на марафоне', description: 'Помощь на точках питания.', category: 'Спорт', date: new Date(now.getTime() + 11 * 24 * 3600 * 1000), status: 'PLANNED', location: 'Лужники', latitude: 55.7157, longitude: 37.5539, durationHours: 6, karmaPoints: 100 },
      { id: 102, organizationId: org1.id, title: 'Помощь в организации концерта', description: 'Координация зрителей.', category: 'Арт', date: new Date(now.getTime() + 18 * 24 * 3600 * 1000), status: 'PLANNED', location: 'Парк Горького', latitude: 55.7302, longitude: 37.6053, durationHours: 4, karmaPoints: 60 },
    ]
  });
  console.log('✅ Events created.');

  // 6. Участие в событиях
  await prisma.eventParticipant.createMany({
    data: [
      { userId: mainUser.id, eventId: event1.id, status: 'approved' },
      { userId: mainUser.id, eventId: event2.id, status: 'approved' },
      { userId: mainUser.id, eventId: event3.id, status: 'approved' },
      { userId: mainUser.id, eventId: event101.id, status: 'approved' },
      { userId: mainUser.id, eventId: event102.id, status: 'approved' },
    ]
  });
  console.log('✅ Event participations created.');

  // 7. Достижения
  const achievements = await prisma.achievement.createManyAndReturn({
    data: [
      { id: 1, name: 'Первый шаг', description: 'Завершить первое событие.', criteriaType: 'EVENT_COUNT', criteriaValue: 1 },
      { id: 2, name: 'Друг животных', description: '3 события по помощи животным.', criteriaType: 'EVENT_CATEGORY', criteriaValue: 3 },
      { id: 3, name: 'Эко-воин', description: '5 экологических акций.', criteriaType: 'EVENT_CATEGORY', criteriaValue: 5 },
      { id: 4, name: 'Душа компании', description: 'Подписка на 5 организаций.', criteriaType: 'SUBSCRIPTION_COUNT', criteriaValue: 5 },
      { id: 5, name: 'Мастер помощи', description: '3-х кратная помощь пожилым.', criteriaType: 'EVENT_CATEGORY', criteriaValue: 3 },
      { id: 6, name: 'Марафонец добра', description: '20 часов волонтерства.', criteriaType: 'TOTAL_HOURS', criteriaValue: 20 },
      { id: 7, name: 'Всезнайка', description: 'Пройти 3 курса.', criteriaType: 'COURSES_COUNT', criteriaValue: 3 },
    ]
  });
  await prisma.userAchievement.createMany({ data: achievements.map(ach => ({ userId: mainUser.id, achievementId: ach.id })) });
  console.log('✅ Achievements created.');

  // 8. Награды
  const rewards = await prisma.reward.createManyAndReturn({
    data: [
      { id: 1, name: 'Значок "Эко-воин"', description: 'Эксклюзивный значок для профиля.', category: 'Значки', price: 500 },
      { id: 2, name: 'Значок "Друг животных"', description: 'Эксклюзивный значок для профиля.', category: 'Значки', price: 500 },
      { id: 3, name: 'Тема "Космос"', description: 'Тема оформления для приложения.', category: 'Темы оформления', price: 1500 },
      { id: 4, name: 'Значок "Лидер"', description: 'Эксклюзивный значок для профиля.', category: 'Значки', price: 1000 },
    ]
  });
  await prisma.userReward.createMany({ data: [{ userId: mainUser.id, rewardId: rewards[0].id }, { userId: mainUser.id, rewardId: rewards[3].id }] });
  console.log('✅ Rewards created.');

  // 9. Истории
  const story1 = await prisma.story.create({ data: { id: 1, authorId: otherUsers[0].id, eventId: event1.id, text: "Отлично провели время на субботнике!", imageUrl: "https://picsum.photos/seed/story1/600/400" } });
  const story2 = await prisma.story.create({ data: { id: 2, authorId: otherUsers[1].id, eventId: event2.id, text: "Провели день с пушистыми друзьями.", imageUrl: "https://picsum.photos/seed/story2/600/600" } });
  await prisma.comment.createMany({
    data: [
      { storyId: story1.id, authorId: mainUser.id, text: 'Очень вдохновляет!' },
      { storyId: story1.id, authorId: otherUsers[2].id, text: 'Какие вы молодцы!' },
      { storyId: story2.id, authorId: friendUser.id, text: 'Какая прелесть!' },
    ]
  });
  await prisma.storyLike.create({ data: { storyId: story1.id, userId: friendUser.id } });
  console.log('✅ Stories created.');

  // 10. Челлендж
  const challenge = await prisma.challenge.create({ data: { title: "Челлендж недели", description: "Помогите животным 1 раз", reward: "Награда: +100 кармы ✨", criteriaType: "EVENT_CATEGORY", criteriaMeta: "Животные", criteriaValue: 1, period: "WEEKLY" } });
  await prisma.userChallenge.create({ data: { userId: mainUser.id, challengeId: challenge.id, progress: 1, completedAt: new Date() } });
  console.log('✅ Challenge created.');

  console.log('--- Seeding complete! ---');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
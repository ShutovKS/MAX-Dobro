// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEST_USER_SUPABASE_ID = '3eec394c-a786-44f6-b29d-3b201d540502';
const FRIEND_USER_SUPABASE_ID = '61df2213-3982-40dd-9fe4-27c1c89eed9b';
const STRANGER_USER_SUPABASE_ID = '7d618a10-6439-4d74-9a59-8c20540f45e0';
const ORGANIZER_USER_SUPABASE_ID = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';

async function main() {
  console.log('Start seeding...');

  // --- 1. Полная очистка базы данных ---
  await prisma.review.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.userChallenge.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.storyLike.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.userReward.deleteMany();
  await prisma.userCertificate.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.eventParticipant.deleteMany();
  await prisma.userOrganizationSubscription.deleteMany();
  await prisma.story.deleteMany();
  await prisma.karmaLog.deleteMany();
  await prisma.eventChatMessage.deleteMany();
  await prisma.eventChat.deleteMany();
  await prisma.assistantChatMessage.deleteMany();
  await prisma.event.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.quizAnswer.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();
  console.log('Database cleared.');

  // --- 2. Пользователи ---
  const user1 = await prisma.user.create({
    data: {
      email: 'test@example.com',
      supabaseUserId: TEST_USER_SUPABASE_ID,
      firstName: 'Реальный',
      lastName: 'Тестер',
      karmaPoints: 500,
      totalHours: 8,
      avatarUrl: 'https://i.pravatar.cc/150?u=test@example.com',
      role: 'volunteer',
    },
  });

  const friendUser = await prisma.user.create({
    data: {
      email: 'friend@example.com',
      supabaseUserId: FRIEND_USER_SUPABASE_ID,
      firstName: 'Друг',
      lastName: 'Тестера',
      avatarUrl: 'https://i.pravatar.cc/150?u=friend@example.com',
      role: 'volunteer',
    },
  });

  const strangerUser = await prisma.user.create({
    data: {
      email: 'stranger@example.com',
      supabaseUserId: STRANGER_USER_SUPABASE_ID,
      firstName: 'Посторонний',
      lastName: 'Участник',
      avatarUrl: 'https://i.pravatar.cc/150?u=stranger@example.com',
      role: 'volunteer',
    },
  });

  // Новый пользователь-организатор
  await prisma.user.create({
    data: {
      email: 'organizer@example.com',
      supabaseUserId: ORGANIZER_USER_SUPABASE_ID,
      firstName: 'Иван',
      lastName: 'Организатор',
      avatarUrl: 'https://i.pravatar.cc/150?u=organizer@example.com',
      role: 'organization', // Роль организатора
    },
  });
  console.log('Users created.');

  // --- 3. Дружба ---
  await prisma.friendship.create({
    data: { userId: user1.id, friendId: friendUser.id },
  });
  console.log('Friendship created.');

  // --- 4. Организации ---
  const org1 = await prisma.organization.create({
    data: {
      name: 'Фонд "Чистый Лес"',
      description: 'Мы занимаемся защитой и восстановлением лесов.',
      fullDescription:
        'Полное описание деятельности фонда "Чистый Лес", включая наши миссии, цели и историю. Мы проводим регулярные субботники, лекции и акции по сбору макулатуры.',
      category: 'Экология',
      isVerified: true,
    },
  });
  const org2 = await prisma.organization.create({
    data: {
      name: 'Приют "Лучший Друг"',
      description: 'Помогаем бездомным животным.',
      category: 'Животные',
    },
  });
  const org3 = await prisma.organization.create({
    data: {
      name: 'Центр "Благо-Арт"',
      description: 'Поддержка культурных и творческих инициатив.',
      category: 'Культура',
      isVerified: true,
    },
  });
  console.log('Organizations created.');

  // --- 4.1 Подписка пользователя на организацию ---
  await prisma.userOrganizationSubscription.create({
    data: {
      userId: user1.id,
      organizationId: org2.id,
    },
  });
  console.log('User subscription created.');

  // --- 5. Курсы ---
  const course1 = await prisma.course.create({
    data: {
      title: 'Основы Первой Помощи',
      description: 'Курс, который научит вас базовым действиям.',
      icon: 'first-aid',
      lessons: {
        create: {
          title: 'Урок 1: Оценка ситуации',
          content: 'Первое, что нужно сделать...',
          questions: {
            create: {
              question: 'Что является первым шагом?',
              answers: { create: [{ answer: 'Убедиться в безопасности', isCorrect: true }] },
            },
          },
        },
      },
    },
  });
  const course2 = await prisma.course.create({
    data: {
      title: 'Введение в волонтерство',
      description: 'Узнай все о том, как стать волонтером.',
    },
  });
  await prisma.userCertificate.create({ data: { userId: user1.id, courseId: course2.id } });
  console.log('Courses & certificates created.');

  // --- 6. События ---
  const futureEventDate = new Date();
  futureEventDate.setDate(futureEventDate.getDate() + 7);
  const pastEventDate = new Date();
  pastEventDate.setDate(pastEventDate.getDate() - 14);

  const futureEvent = await prisma.event.create({
    data: {
      title: 'Субботник в парке "Сокольники"',
      description: 'Убираем мусор и высаживаем новые деревья.',
      date: futureEventDate,
      organizationId: org1.id,
      status: 'PLANNED',
      category: 'Экология',
      location: 'Москва, парк "Сокольники", главный вход',
      latitude: 55.8023,
      longitude: 37.6769,
      recommendedCourseId: course1.id,
    },
  });
  const pastEvent = await prisma.event.create({
    data: {
      title: 'Сбор помощи для приюта',
      description: 'Это событие уже завершилось.',
      date: pastEventDate,
      organizationId: org2.id,
      status: 'COMPLETED',
      location: 'Москва, ул. Искры, 21',
      latitude: 55.8575,
      longitude: 37.6543,
    },
  });
  const eventForFriends = await prisma.event.create({
    data: {
      title: 'Событие с друзьями в Парке Горького',
      description: 'Тестируем фичу "Идем вместе!"',
      date: futureEventDate,
      organizationId: org1.id,
      status: 'PLANNED',
      category: 'Культура',
      location: 'Москва, Парк Горького, Крымский Вал, 9',
      latitude: 55.7302,
      longitude: 37.6053,
    },
  });
  await prisma.event.create({
    data: {
      title: 'Выгул собак в приюте',
      description: 'Подарим радость и движение собакам из приюта "Лучший Друг".',
      date: new Date(futureEventDate.getTime() + 2 * 24 * 60 * 60 * 1000), // +2 days
      organizationId: org2.id,
      status: 'PLANNED',
      category: 'Животные',
      location: 'Москва, ул. Искры, 21',
      latitude: 55.8575,
      longitude: 37.6543,
    },
  });
  await prisma.event.create({
    data: {
      title: 'Арт-вечер в "Винзаводе"',
      description: 'Помощь в организации выставки современного искусства.',
      date: new Date(futureEventDate.getTime() + 5 * 24 * 60 * 60 * 1000), // +5 days
      organizationId: org3.id,
      status: 'PLANNED',
      category: 'Арт',
      location: 'Москва, 4-й Сыромятнический пер., 1/8с6',
      latitude: 55.752,
      longitude: 37.6563,
    },
  });
  console.log('Events created.');

  // --- 7. Участники событий ---
  await prisma.eventParticipant.createMany({
    data: [
      { userId: user1.id, eventId: futureEvent.id, status: 'approved' },
      { userId: friendUser.id, eventId: futureEvent.id, status: 'pending' },
      { userId: user1.id, eventId: pastEvent.id, status: 'approved' },
      { userId: user1.id, eventId: eventForFriends.id, status: 'approved' },
      { userId: friendUser.id, eventId: eventForFriends.id, status: 'approved' },
      { userId: strangerUser.id, eventId: eventForFriends.id, status: 'approved' },
    ],
  });
  console.log('Event participants created.');

  // --- 8. Отзывы ---
  await prisma.review.create({
    data: {
      authorId: user1.id,
      eventId: pastEvent.id,
      organizationId: org2.id,
      rating: 4,
      text: 'Все было хорошо организовано!',
    },
  });
  console.log('Reviews created.');

  await prisma.organization.update({ where: { id: org2.id }, data: { rating: 4, reviewCount: 1 } });

  // --- 9. Достижения, Награды, Истории, Челленджи, Чаты ---
  const achievement = await prisma.achievement.create({ data: { name: 'Первый час', criteriaType: 'TOTAL_HOURS', criteriaValue: 1, description: 'Провести 1 час, помогая.' } });
  await prisma.userAchievement.create({ data: { userId: user1.id, achievementId: achievement.id } });
  const reward = await prisma.reward.create({ data: { name: 'Стикерпак', price: 100, description: 'Набор наклеек.' } });
  await prisma.userReward.create({ data: { userId: user1.id, rewardId: reward.id } });
  await prisma.story.create({
    data: {
      authorId: user1.id,
      eventId: pastEvent.id,
      text: 'Отличный был день!',
      imageUrl: 'https://placehold.co/600x400',
      comments: { create: { authorId: friendUser.id, text: 'Супер!' } },
      likes: { create: { userId: friendUser.id } },
    },
  });
  const challenge = await prisma.challenge.create({ data: { title: 'Эко-неделя', description: '2 эко-события', reward: '+150', criteriaType: 'EVENT_PARTICIPATION', criteriaValue: 2, period: 'WEEKLY' } });
  await prisma.userChallenge.create({ data: { userId: user1.id, challengeId: challenge.id, progress: 1 } });
  const eventChat = await prisma.eventChat.create({ data: { eventId: futureEvent.id } });
  await prisma.eventChatMessage.create({ data: { chatId: eventChat.id, authorId: user1.id, text: 'Всем привет!' } });
  await prisma.assistantChatMessage.create({ data: { authorId: user1.id, content: 'Привет, ассистент!', sender: 'USER' } });
  await prisma.karmaLog.create({ data: { userId: user1.id, points: 50, description: `Участие в событии: ${pastEvent.title}` } });

  console.log('Seeding of additional entities finished.');
  console.log('--- Seeding complete! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
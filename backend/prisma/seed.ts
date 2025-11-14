import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEST_USER_SUPABASE_ID = '3eec394c-a786-44f6-b29d-3b201d540502';
const FRIEND_USER_SUPABASE_ID = '0e24c3b5-2e3b-4b1a-9a0e-1e9d1e4e1e0a';

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

  // --- 2. Создание пользователей ---
  const user1 = await prisma.user.create({
    data: {
      email: 'test@example.com',
      supabaseUserId: TEST_USER_SUPABASE_ID,
      firstName: 'Реальный',
      lastName: 'Тестер',
      karmaPoints: 500,
      totalHours: 8,
      avatarUrl: 'https://i.pravatar.cc/150?u=test@example.com',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'friend@example.com',
      supabaseUserId: FRIEND_USER_SUPABASE_ID,
      firstName: 'Друг',
      lastName: 'Тестера',
      avatarUrl: 'https://i.pravatar.cc/150?u=friend@example.com',
    },
  });
  console.log('Users created.');

  await prisma.friendship.create({
    data: { userId: user1.id, friendId: user2.id },
  });
  console.log('Friendship created.');

  // --- 3. Ачивки ---
  const achievement1 = await prisma.achievement.create({
    data: {
      name: 'Новичок Добра',
      description: 'Провести 1 час, помогая другим.',
      criteriaType: 'TOTAL_HOURS',
      criteriaValue: 1,
    },
  });
  await prisma.userAchievement.create({
    data: { userId: user1.id, achievementId: achievement1.id },
  });
  console.log('Achievements created.');

  // --- 4. Организации ---
  const org = await prisma.organization.create({
    data: {
      name: 'Фонд "Чистый Лес"',
      description: 'Мы занимаемся защитой и восстановлением лесов.',
      category: 'Экология',
      isVerified: true,
    },
  });
  console.log('Organization created.');

  // --- 5. События ---
  const futureEventDate = new Date();
  futureEventDate.setDate(futureEventDate.getDate() + 7);
  const pastEventDate = new Date();
  pastEventDate.setDate(pastEventDate.getDate() - 14);

  // === События для общих тестов (истории, чаты и т.д.) ===
  const generalFutureEvent = await prisma.event.create({
    data: {
      title: 'Субботник в парке "Сокольники"',
      description: 'Убираем мусор и высаживаем новые деревья. Приносите перчатки!',
      date: futureEventDate,
      organizationId: org.id,
      durationHours: 2,
      karmaPoints: 50,
      status: 'PLANNED',
      category: 'Экология',
      location: 'Парк "Сокольники", главный вход',
      latitude: 55.8023,
      longitude: 37.6769,
      requirements: 'Нужна удобная одежда и обувь.',
    },
  });

  // === События специально для тестирования системы ОТЗЫВОВ ===
  const eventToReview = await prisma.event.create({
    data: {
      title: 'Событие для отзыва (успех)',
      description: 'Это событие завершилось, и вы в нем участвовали.',
      date: pastEventDate,
      organizationId: org.id,
      status: 'COMPLETED',
    },
  });
  const eventWithoutParticipation = await prisma.event.create({
    data: {
      title: 'Событие без участия (ошибка)',
      description: 'Вы не были участником.',
      date: pastEventDate,
      organizationId: org.id,
      status: 'COMPLETED',
    },
  });
  const eventAlreadyReviewed = await prisma.event.create({
    data: {
      title: 'Уже оцененное событие (ошибка)',
      description: 'Вы уже оставили отзыв.',
      date: pastEventDate,
      organizationId: org.id,
      status: 'COMPLETED',
    },
  });
  console.log('Events created.');

  // --- 6. Участники событий ---
  await prisma.eventParticipant.createMany({
    data: [
      { userId: user1.id, eventId: generalFutureEvent.id, status: 'approved' },
      { userId: user2.id, eventId: generalFutureEvent.id, status: 'pending' },
      // Участие для системы отзывов
      { userId: user1.id, eventId: eventToReview.id, status: 'approved' },
      { userId: user1.id, eventId: eventAlreadyReviewed.id, status: 'approved' },
    ],
  });
  console.log('Event participants created.');

  // --- 7. Отзывы (для теста на дубликат) ---
  await prisma.review.create({
    data: {
      authorId: user1.id,
      eventId: eventAlreadyReviewed.id,
      organizationId: org.id,
      rating: 5,
      text: 'Это мой старый отзыв.',
    },
  });
  console.log('Initial review created for testing duplicates.');
  
  // --- 8. Чаты, награды, курсы, истории и все остальное ---
  const eventChat = await prisma.eventChat.create({
    data: { eventId: generalFutureEvent.id },
  });
  await prisma.eventChatMessage.create({
    data: {
      chatId: eventChat.id,
      authorId: user1.id,
      text: 'Всем привет! Жду наше событие!',
    },
  });
  console.log('Event chat and messages created.');

  await prisma.reward.create({
    data: {
      name: 'Фирменный стикерпак',
      description: 'Набор наклеек для ноутбука.',
      price: 100,
      category: 'Значки',
    },
  });
  console.log('Rewards created.');

  const completedCourse = await prisma.course.create({
    data: {
      title: 'Введение в волонтерство',
      description: 'Узнайте все о том, как стать волонтером.',
      duration: '1 час',
    },
  });
  await prisma.userCertificate.create({
    data: { userId: user1.id, courseId: completedCourse.id },
  });
  console.log('Courses and certificates created.');

  await prisma.story.create({
    data: {
      authorId: user1.id,
      eventId: eventToReview.id,
      text: 'Это был потрясающий опыт! Спасибо всем!',
      imageUrl: 'https://placehold.co/600x400',
    },
  });
  console.log('Stories created.');

  const challenge = await prisma.challenge.create({
    data: {
      title: 'Эко-неделя',
      description: 'Примите участие в 2-х экологических событиях',
      reward: '+150 очков кармы',
      criteriaType: 'EVENT_PARTICIPATION',
      criteriaValue: 2,
      period: 'WEEKLY',
    },
  });
  await prisma.userChallenge.create({
    data: { userId: user1.id, challengeId: challenge.id, progress: 1 },
  });
  console.log('Weekly challenge created.');

  console.log('Seeding finished.');
  console.log('--- Test Data for Review System ---');
  console.log(`User for tests: ${user1.email} (ID: ${user1.id})`);
  console.log(`Event for SUCCESSFUL review (ID: ${eventToReview.id})`);
  console.log(`Event for FORBIDDEN review (future event) (ID: ${generalFutureEvent.id})`);
  console.log(`Event for FORBIDDEN review (no participation) (ID: ${eventWithoutParticipation.id})`);
  console.log(`Event for CONFLICT review (already reviewed) (ID: ${eventAlreadyReviewed.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
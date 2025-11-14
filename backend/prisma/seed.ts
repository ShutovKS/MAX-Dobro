import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEST_USER_SUPABASE_ID = '3eec394c-a786-44f6-b29d-3b201d540502';
const FRIEND_USER_SUPABASE_ID = '0e24c3b5-2e3b-4b1a-9a0e-1e9d1e4e1e0a';

async function main() {
  console.log('Start seeding...');

  // --- 1. Очистка базы данных ---
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
      description:
        'Мы занимаемся защитой и восстановлением лесов по всей стране.',
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

  const futureEvent = await prisma.event.create({
    data: {
      title: 'Субботник в парке "Сокольники"',
      description: 'Убираем мусор и высаживаем новые деревья. Приносите перчатки!',
      date: futureEventDate,
      organizationId: org.id,
      durationHours: 2,
      karmaPoints: 50,
      status: 'PLANNED',
      // Новые поля
      category: 'Экология',
      location: 'Парк "Сокольники", главный вход',
      latitude: 55.8023,
      longitude: 37.6769,
      requirements: 'Нужна удобная одежда и обувь. Перчатки выдадим на месте.',
    },
  });

  const pastEvent = await prisma.event.create({
    data: {
      title: 'Сбор помощи для приюта животных',
      description: 'Это событие уже завершилось',
      date: pastEventDate,
      organizationId: org.id,
      durationHours: 3,
      karmaPoints: 75,
      status: 'COMPLETED',
      category: 'Животные',
    },
  });
  console.log('Events created.');

  await prisma.eventParticipant.createMany({
    data: [
      { userId: user1.id, eventId: futureEvent.id, status: 'approved' },
      { userId: user2.id, eventId: futureEvent.id, status: 'pending' },
      { userId: user1.id, eventId: pastEvent.id, status: 'approved' },
    ],
  });
  console.log('Event participants created.');

  const eventChat = await prisma.eventChat.create({
    data: { eventId: futureEvent.id },
  });
  await prisma.eventChatMessage.create({
    data: {
      chatId: eventChat.id,
      authorId: user1.id,
      text: 'Всем привет! Жду наше событие!',
    },
  });
  console.log('Event chat and messages created.');

  // --- 6. Награды ---
  const reward1 = await prisma.reward.create({
    data: {
      name: 'Фирменный стикерпак',
      description: 'Набор наклеек для ноутбука.',
      price: 100,
      category: 'Значки',
      imageUrl: 'https://via.placeholder.com/150/FFC107/000000?Text=Sticker',
    },
  });
  await prisma.reward.create({
    data: {
      name: 'Брендированная футболка',
      description: 'Стильная футболка MAX Добро.',
      price: 1000,
      category: 'Темы оформления',
      imageUrl: 'https://via.placeholder.com/150/4CAF50/FFFFFF?Text=T-Shirt',
    },
  });
  await prisma.userReward.create({
    data: { userId: user1.id, rewardId: reward1.id },
  });
  console.log('Rewards created.');

  // --- 7. Курсы и Сертификаты ---
  await prisma.course.create({
    data: {
      title: 'Основы Первой Помощи',
      description: 'Курс, который научит вас базовым действиям.',
      duration: '3 часа',
      category: 'Медицина',
      level: 'Для новичков',
      icon: 'first-aid', // Новое поле
      lessons: {
        create: {
          title: 'Урок 1: Оценка ситуации',
          content: 'Первое, что нужно сделать...',
          questions: {
            create: {
              question: 'Что является первым шагом при оказании первой помощи?',
              answers: {
                create: [
                  { answer: 'Убедиться в безопасности', isCorrect: true },
                  { answer: 'Позвонить в скорую', isCorrect: false },
                ],
              },
            },
          },
        },
      },
    },
  });

  const completedCourse = await prisma.course.create({
    data: {
      title: 'Введение в волонтерство',
      description: 'Узнайте все о том, как стать волонтером.',
      duration: '1 час',
      category: 'Обучение',
      level: 'Для новичков',
    },
  });
  await prisma.userCertificate.create({
    data: { userId: user1.id, courseId: completedCourse.id },
  });
  console.log('Courses and certificates created.');

  // --- 8. Истории ---
  await prisma.story.create({
    data: {
      authorId: user1.id,
      eventId: pastEvent.id, // История относится к прошедшему событию
      text: 'Это был потрясающий опыт! Спасибо всем!',
      imageUrl: 'https://placehold.co/600x400',
      comments: {
        create: [{ authorId: user2.id, text: 'Вы большие молодцы!' }],
      },
      likes: {
        create: [{ userId: user1.id }, { userId: user2.id }],
      },
    },
  });
  console.log('Stories, comments and likes created.');

  // --- 9. Челленджи ---
  const challenge = await prisma.challenge.create({
    data: {
      title: 'Эко-неделя',
      description: 'Примите участие в 2-х экологических событиях',
      reward: '+150 очков кармы',
      criteriaType: 'EVENT_PARTICIPATION',
      criteriaValue: 2,
      criteriaMeta: 'Экология',
      period: 'WEEKLY',
      isActive: true,
    },
  });
  await prisma.userChallenge.create({
    data: {
      userId: user1.id,
      challengeId: challenge.id,
      progress: 1,
    },
  });
  console.log('Weekly challenge created.');
  
  // --- 10. Логи кармы ---
  await prisma.karmaLog.createMany({
    data: [
        {userId: user1.id, points: 75, description: `Участие в событии: ${pastEvent.title}`},
        {userId: user1.id, points: 10, description: `Завершение курса: ${completedCourse.title}`},
        {userId: user2.id, points: 20, description: 'Помощь в организации события'},
    ]
  })
  console.log('Karma logs created.');


  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
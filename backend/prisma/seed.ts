import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEST_USER_SUPABASE_ID = '3eec394c-a786-44f6-b29d-3b201d540502';
const OTHER_USER_SUPABASE_ID = '0e24c3b5-2e3b-4b1a-9a0e-1e9d1e4e1e0a';

async function main() {
  console.log('Start seeding...');

  // 1. Очистка
  await prisma.storyLike.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.story.deleteMany();
  await prisma.userReward.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.userCertificate.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.eventParticipant.deleteMany();
  await prisma.event.deleteMany();
  await prisma.userOrganizationSubscription.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.quizAnswer.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // 2. Создание пользователей
  const user1 = await prisma.user.create({
    data: {
      email: 'test@example.com',
      supabaseUserId: TEST_USER_SUPABASE_ID,
      name: 'Реальный Тестер',
      karmaPoints: 500,
    },
  });
  console.log('Test user 1 created.');

  const user2 = await prisma.user.create({
    data: {
      email: 'friend@example.com',
      supabaseUserId: OTHER_USER_SUPABASE_ID,
      name: 'Друг Тестера',
    },
  });
  console.log('Test user 2 created.');

  // 3. Создание достижений
  await prisma.achievement.createMany({
    data: [
      {
        name: 'Новичок Добра',
        description: 'Провести 1 час, помогая другим.',
        criteriaType: 'TOTAL_HOURS',
        criteriaValue: 1,
      },
      {
        name: 'Опытный Волонтер',
        description: 'Накопить 10 часов добрых дел.',
        criteriaType: 'TOTAL_HOURS',
        criteriaValue: 10,
      },
    ],
  });

  // 4. Создание организации и события
  const org = await prisma.organization.create({
    data: {
      name: 'Фонд "Чистый Лес"',
      description: 'Мы занимаемся защитой и восстановлением лесов по всей стране.',
      category: 'Экология',
      logoUrl: 'https://placehold.co/100x100/a7e9af/333?text=CL',
      isVerified: true,
      coverImageUrl: 'https://placehold.co/800x300/a7e9af/333?text=Forest',
      websiteUrl: 'https://clean-forest-fund.org',
      address: 'г. Москва, ул. Лесная, д. 5',
      rating: 4.8,
      reviewCount: 152,
    },
  });
  
  console.log('Organization created.');

  const futureEventDate = new Date();
  futureEventDate.setDate(futureEventDate.getDate() + 7);

  const event = await prisma.event.create({
    data: {
      title: 'Событие для Теста',
      description: 'Это событие используется в сидах',
      date: futureEventDate,
      organizationId: org.id,
      durationHours: 2,
      karmaPoints: 50,
      status: 'PLANNED',
    },
  });

  // 5. Регистрация пользователя на событие
  await prisma.eventParticipant.create({
    data: {
      userId: user1.id,
      eventId: event.id,
      status: 'approved',
    },
  });

  // 6. Создание наград
  await prisma.reward.createMany({
    data: [
      {
        title: 'Фирменный стикерпак',
        description: 'Набор наклеек для ноутбука.',
        cost: 100,
        icon: 'sticker-icon',
      },
      {
        title: 'Брендированная футболка',
        description: 'Стильная футболка MAX Добро.',
        cost: 1000,
        icon: 'tshirt-icon',
      },
    ],
  });
  console.log('Rewards created.');

  // 7. Создание курсов
  console.log('Creating courses...');
  await prisma.course.create({
    data: {
      title: 'Основы Первой Помощи',
      description:
        'Курс, который научит вас базовым действиям в экстренных ситуациях.',
      lessons: {
        create: [
          {
            title: 'Урок 1: Оценка ситуации',
            content:
              'Первое, что нужно сделать - убедиться в собственной безопасности...',
            questions: {
              create: [
                {
                  question:
                    'Что является первым шагом при оказании первой помощи?',
                  answers: {
                    create: [
                      {
                        answer: 'Начать сердечно-легочную реанимацию',
                        isCorrect: false,
                      },
                      {
                        answer: 'Убедиться в безопасности места происшествия',
                        isCorrect: true,
                      },
                      {
                        answer: 'Позвонить в скорую помощь',
                        isCorrect: false,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log('Courses created.');

  // 8. Создание историй, комментариев и лайков
  console.log('Creating stories, comments, and likes...');
  const story = await prisma.story.create({
    data: {
      authorId: user1.id,
      eventId: event.id,
      text: 'Это был потрясающий опыт! Спасибо всем, кто принял участие!',
      imageUrl: 'https://placehold.co/600x400/a7e9af/333?text=Our+Event',
      comments: {
        create: [
          {
            authorId: user2.id,
            text: 'Вы большие молодцы!',
          },
        ],
      },
      likes: {
        create: [
          {
            userId: user1.id, // Текущий пользователь лайкает свой пост
          },
          {
            userId: user2.id, // И другой пользователь тоже
          },
        ],
      },
    },
  });
  console.log('Stories, comments and likes created.');

  // 9. Создание чата и сообщений
  console.log('Creating chat messages for chatbot...');
  await prisma.chatMessage.createMany({
    data: [
      {
        authorId: user1.id,
        content: 'Это мое первое сообщение в истории чата.',
        sender: 'USER',
        type: 'text',
      },
      {
        authorId: user1.id,
        content: 'А это ответ ассистента с подсказками.',
        sender: 'ASSISTANT',
        type: 'suggestion-chips',
        payload: { suggestions: ['Расскажи о событиях', 'Какие есть курсы?'] },
      },
    ],
  });
  console.log('Chat messages created.');

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
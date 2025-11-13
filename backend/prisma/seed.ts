import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEST_USER_SUPABASE_ID = '3eec394c-a786-44f6-b29d-3b201d540502';
const OTHER_USER_SUPABASE_ID = '0e24c3b5-2e3b-4b1a-9a0e-1e9d1e4e1e0a';

async function main() {
  console.log('Start seeding...');

  // 1. Очистка (в порядке, обратном созданию, чтобы избежать ошибок внешних ключей)
  await prisma.chatMessage.deleteMany();
  await prisma.chatParticipant.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.story.deleteMany();
  await prisma.userReward.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.userCertificate.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.eventParticipant.deleteMany();
  await prisma.event.deleteMany();
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

  // 4. Создание организации и "просроченного" события
  const org = await prisma.organization.create({
    data: { name: 'Организация для Теста Кармы' },
  });

  const pastEventDate = new Date();
  pastEventDate.setHours(pastEventDate.getHours() - 4);

  const event = await prisma.event.create({
    data: {
      title: 'Событие для Теста Кармы',
      description: 'Это событие уже должно было завершиться',
      date: pastEventDate,
      organizationId: org.id,
      durationHours: 1,
      karmaPoints: 100,
      status: 'PLANNED',
    },
  });

  // 5. Регистрация пользователя на это событие
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

  // 8. Создание историй
  await prisma.story.createMany({
    data: [
      {
        title: 'Как мы сажали деревья в парке',
        coverImageUrl: 'https://placehold.co/600x400/a7e9af/333?text=Story+1',
        content:
          '<h1>День первый</h1><p>Это был замечательный солнечный день...</p>',
      },
      {
        title: 'Помощь приюту для животных',
        coverImageUrl: 'https://placehold.co/600x400/e9cfa7/333?text=Story+2',
        content:
          '<h1>Наши пушистые друзья</h1><p>В прошлые выходные мы посетили местный приют...</p>',
      },
    ],
  });
  console.log('Stories created.');

  // 9. Создание чата и сообщений
  await prisma.chat.create({
    data: {
      participants: {
        create: [{ userId: user1.id }, { userId: user2.id }],
      },
      messages: {
        create: [
          { authorId: user1.id, content: 'Привет! Как дела?' },
          { authorId: user2.id, content: 'Привет! Все отлично, спасибо!' },
        ],
      },
    },
  });
  console.log('Chat and messages created.');

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
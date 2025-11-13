import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEST_USER_SUPABASE_ID = '3eec394c-a786-44f6-b29d-3b201d540502';

async function main() {
  console.log('Start seeding...');

  // 1. Очистка
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


  // 2. Создание или обновление тестового пользователя
  const user = await prisma.user.upsert({
    where: { supabaseUserId: TEST_USER_SUPABASE_ID },
    update: {
      totalHours: 0,
      karmaPoints: 500, // Даем пользователю кармы для тестов
    },
    create: {
      email: 'test@example.com',
      supabaseUserId: TEST_USER_SUPABASE_ID,
      name: 'Реальный Тестер',
      karmaPoints: 500,
    },
  });
  console.log('Test user created/updated with 500 karma points.');

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
      userId: user.id,
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
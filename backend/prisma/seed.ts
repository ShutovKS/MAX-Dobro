import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEST_USER_SUPABASE_ID = '3eec394c-a786-44f6-b29d-3b201d540502';

async function main() {

  console.log('Start seeding...');

  // 1. Очистка
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.eventParticipant.deleteMany();
  await prisma.event.deleteMany();
  await prisma.organization.deleteMany();

  // 2. Создание или обновление тестового пользователя
  const user = await prisma.user.upsert({
    where: { supabaseUserId: TEST_USER_SUPABASE_ID },
    update: {
      totalHours: 0,
      karmaPoints: 0,
    },
    create: {
      email: 'test@example.com',
      supabaseUserId: TEST_USER_SUPABASE_ID,
      name: 'Реальный Тестер',
    },
  });

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

  console.log(
    'Seeding finished. A past event with karma has been created.',
  );

  // 6. Создание курсов
  console.log('Creating courses...');
  await prisma.course.create({
    data: {
      title: 'Основы Первой Помощи',
      description: 'Курс, который научит вас базовым действиям в экстренных ситуациях.',
      lessons: {
        create: [
          {
            title: 'Урок 1: Оценка ситуации',
            content: 'Первое, что нужно сделать - убедиться в собственной безопасности...',
            questions: {
              create: [
                {
                  question: 'Что является первым шагом при оказании первой помощи?',
                  answers: {
                    create: [
                      { answer: 'Начать сердечно-легочную реанимацию', isCorrect: false },
                      { answer: 'Убедиться в безопасности места происшествия', isCorrect: true },
                      { answer: 'Позвонить в скорую помощь', isCorrect: false },
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
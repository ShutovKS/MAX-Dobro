// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Очистка
  console.log('Deleting old data...');
  await prisma.eventParticipant.deleteMany();
  await prisma.event.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  // 2. Создание организации
  const org = await prisma.organization.create({
    data: { name: 'Тестовая Организация для Шедулера' },
  });

  // 3. Создание пользователя
  const user = await prisma.user.create({
    data: {
      email: 'scheduler-test@example.com',
      supabaseUserId: 'supabase-scheduler-test-id',
      name: 'Тестер Шедулера',
      totalHours: 0,
    },
  });

  // 4. Создание события, которое завершится через 15 секунд после старта приложения
  const eventDate = new Date();
  eventDate.setSeconds(eventDate.getSeconds() + 40);

  const eventToSchedule = await prisma.event.create({
    data: {
      title: 'Событие для теста шедулера',
      description: 'Должно завершиться через 15 секунд',
      date: eventDate,
      organizationId: org.id,
      durationHours: 0, // Завершится почти мгновенно после начала
      status: 'PLANNED',
    },
  });

  // 5. Регистрация пользователя на это событие
  await prisma.eventParticipant.create({
    data: {
      userId: user.id,
      eventId: eventToSchedule.id,
      status: 'approved',
    },
  });

  console.log(
    `Seeding finished. Event ${eventToSchedule.id} is set to start at ${eventDate.toISOString()}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
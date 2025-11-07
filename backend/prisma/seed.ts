import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Создаем организацию
  const org1 = await prisma.organization.create({
    data: {
      name: 'Чистый Город',
      description: 'Волонтерская организация по уборке городских парков.',
    },
  });
  console.log(`Created organization: ${org1.name}`);

  // 2. Создаем несколько событий от этой организации
  await prisma.event.createMany({
    data: [
      {
        title: 'Весенний субботник в Парке Победы',
        description: 'Убираем старую листву, сажаем цветы.',
        date: new Date('2026-04-22T10:00:00Z'),
        location: 'Парк Победы',
        organizationId: org1.id,
      },
      {
        title: 'Помощь в приюте для животных "Лапа"',
        description: 'Гуляем с собаками, помогаем с уборкой вольеров.',
        date: new Date('2026-05-01T12:00:00Z'),
        location: 'ул. Пушкина, д. 15',
        organizationId: org1.id,
      },
    ],
  });
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
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Очищаем старые данные
  console.log('Deleting old data...');
  await prisma.eventParticipant.deleteMany();
  await prisma.event.deleteMany();
  await prisma.organization.deleteMany();

  // 2. Создаем организации
  console.log('Creating organizations...');
  const organizationsData = [
    {
      name: 'Чистый Город',
      description: 'Волонтерская организация по уборке городских парков.',
    },
    {
      name: 'Фонд "Лапа Помощи"',
      description: 'Помощь бездомным животным, организация приютов.',
    },
    { name: 'IT Volunteers', description: 'Цифровое волонтерство и IT-проекты.' },
    { name: 'Красный Полумесяц', description: 'Медицинская и гуманитарная помощь.' },
    {
      name: 'Культурное Наследие',
      description: 'Сохранение памятников архитектуры и истории.',
    },
    { name: 'Лига Спорта', description: 'Организация спортивных мероприятий.' },
  ];

  await prisma.organization.createMany({ data: organizationsData });
  const organizations = await prisma.organization.findMany();
  console.log(`Created ${organizations.length} organizations.`);

  if (organizations.length === 0) {
    console.log('No organizations found, skipping event creation.');
    return;
  }

  // 3. Создаем события
  console.log('Creating events...');
  const eventsData: Prisma.EventCreateManyInput[] = [];
  const eventTitles = [
    'Эко-марафон "Зеленая Планета"',
    'День донора',
    'Хакатон для НКО',
    'Помощь ветеранам на дому',
    'Субботник в парке "Сокольники"',
    'Мастер-класс по программированию для детей',
    'Выгул собак из приюта',
    'Сбор гуманитарной помощи',
    'Реставрация старинной усадьбы',
    'Организация благотворительного забега',
    'Онлайн-лекция по кибербезопасности',
    'Сбор макулатуры и пластика',
    'Уход за лошадьми на конюшне',
    'Посадка деревьев в пригороде',
    'Проведение IT-аудита для фонда',
    'Вебинар по первой помощи',
    'Концерт в доме престарелых',
    'Помощь в сборе урожая на ферме',
    'Создание сайта для приюта',
    'Уборка берега озера',
  ];

  for (let i = 0; i < eventTitles.length; i++) {
    const randomOrg =
      organizations[Math.floor(Math.random() * organizations.length)];
    const isOnline = Math.random() > 0.7;
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 60) - 15);

    eventsData.push({
      title: eventTitles[i],
      description: `Подробное описание для события "${eventTitles[i]}". Требуются волонтеры для выполнения различных задач.`,
      date: eventDate,
      location: isOnline ? null : `г. Москва, ул. Примерная, д. ${i + 1}`,
      organizationId: randomOrg.id,
    });
  }

  await prisma.event.createMany({ data: eventsData });
  console.log(`Created ${eventsData.length} events.`);

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
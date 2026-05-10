/// <context:backend_seed> Seed data keeps local backend and frontend regression flows grounded. </context:backend_seed>

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/// <context:backend_seed_ids> Stable user IDs keep seeded auth and test flows predictable. </context:backend_seed_ids>
const volunteerId = '3eec394c-a786-44f6-b29d-3b201d540502';
const friendId = '61df2213-3982-40dd-9fe4-27c1c89eed9b';
const organizerId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';

async function main() {
  console.log('--- Start realistic data seeding ---');

  // 1. Полная очистка таблиц
  const tableNames = [
    'reviews', 'story_likes', 'comments', 'stories', 'event_chat_messages', 'event_chats',
    'user_challenges', 'user_rewards', 'user_certificates', 'user_achievements',
    'event_participants', 'user_organization_subscriptions', 'karma_logs', 'chat_messages',
    'friendships', 'events', 'quiz_answers', 'quiz_questions', 'lessons',
    'courses', 'organizations', 'users', 'achievements', 'challenges', 'rewards'
  ];
  for (const tableName of tableNames) {
    await prisma.$queryRawUnsafe(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`);
  }
  console.log('✅ Database cleared.');

  // 2. Пользователи
  const mainUser = await prisma.user.create({
    data: {
      email: 'volunteer@test.com',
      supabaseUserId: volunteerId,
      firstName: 'Елена',
      lastName: 'Волонтерова',
      about: 'Люблю помогать животным и участвовать в экологических акциях.',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      role: 'volunteer',
      totalHours: 128,
      karmaPoints: 15200,
    },
  });

  const friendUser = await prisma.user.create({
    data: {
      email: 'friend@test.com',
      supabaseUserId: friendId,
      firstName: 'Алексей',
      lastName: 'Дружбин',
      avatarUrl: 'https://i.pravatar.cc/150?u=friend',
    },
  });
  
  const otherUsers = await prisma.user.createManyAndReturn({
    data: [
      { email: 'user2@test.com', supabaseUserId: 'user2-id', firstName: 'Мария', lastName: 'Петрова', avatarUrl: 'https://i.pravatar.cc/150?u=user2' },
      { email: 'user3@test.com', supabaseUserId: 'user3-id', firstName: 'Алексей', lastName: 'Новиков', avatarUrl: 'https://i.pravatar.cc/150?u=user3' },
      { email: 'user4@test.com', supabaseUserId: 'user4-id', firstName: 'Анна', lastName: 'Попова', avatarUrl: 'https://i.pravatar.cc/150?u=user4' },
    ]
  });

  await prisma.user.create({
    data: {
      email: 'organizer@test.com',
      supabaseUserId: organizerId,
      firstName: 'Иван',
      lastName: 'Организаторов',
      avatarUrl: 'https://i.pravatar.cc/150?u=organizer',
      role: 'organization',
    },
  });
  console.log('✅ Users created.');

  // 3. Организации
  const [orgArt, orgEco, orgSeniors, orgAnimals, orgSport] = await prisma.organization.createManyAndReturn({
    data: [
      { name: 'Фонд "Подари жизнь"', description: 'Помощь детям с онко-заболеваниями', category: 'Дети', isVerified: true, websiteUrl: '#', address: 'Москва, ул. Добрая, д. 1' },
      { name: 'Гринпис России', description: 'Защита природы и экологии', category: 'Экология', isVerified: true, websiteUrl: '#', address: 'Москва, ул. Лесная, д. 5' },
      { name: 'Фонд "Старость в радость"', description: 'Помощь пожилым людям', category: 'Помощь пожилым', isVerified: true, websiteUrl: '#', address: 'Москва, ул. Садовая, д. 10' },
      { name: 'Приют "Верный друг"', description: 'Помощь бездомным животным', category: 'Животные', isVerified: false, websiteUrl: '#', address: 'МО, пос. Лесной, ул. Центральная, 1' },
      { name: 'МосМарафон', description: 'Организация спортивных мероприятий.', category: 'Спорт', isVerified: true },
    ]
  });
  console.log('✅ Organizations created.');

  // 4. Курсы, уроки и квизы
const course1 = await prisma.course.create({
  data: {
    id: 1,
    title: 'Основы первой помощи',
    description: 'Научитесь оказывать первую помощь в экстренных ситуациях.',
    icon: 'first-aid',
    category: 'Первая помощь',
    level: 'Для новичков',
    duration: '45 минут',
    lessons: {
      create: [
        {
          title: 'Урок 1: Оценка ситуации',
          content: 'Первый и самый важный шаг — убедиться в собственной безопасности перед тем, как оказывать помощь.',
        },
        {
          title: 'Тест: Кровотечения',
          content: 'Проверьте свои знания о разных видах кровотечений.',
          questions: {
            create: [
              {
                question: 'Какой вид кровотечения самый опасный?',
                answers: {
                  create: [
                    { answer: 'Артериальное', isCorrect: true },
                    { answer: 'Венозное', isCorrect: false },
                    { answer: 'Капиллярное', isCorrect: false },
                  ],
                },
              },
              {
                question: 'Что нужно сделать при венозном кровотечении?',
                answers: {
                  create: [
                    { answer: 'Наложить давящую повязку', isCorrect: true },
                    { answer: 'Наложить жгут выше раны', isCorrect: false },
                    { answer: 'Промыть рану водой', isCorrect: false },
                  ],
                },
              },
            ],
          },
        },
        {
          title: 'Итоговый тест',
          content: 'Итоговая проверка знаний по всему курсу.',
          questions: {
            create: [
              {
                question: 'Что является первым шагом при оказании помощи?',
                answers: {
                  create: [
                    { answer: 'Убедиться в собственной безопасности', isCorrect: true },
                    { answer: 'Позвонить в скорую', isCorrect: false },
                    { answer: 'Начать делать массаж сердца', isCorrect: false },
                  ],
                },
              },
              {
                question: 'Что делать при обмороке?',
                answers: {
                  create: [
                    { answer: 'Приподнять ноги пострадавшего', isCorrect: true },
                    { answer: 'Дать понюхать нашатырный спирт', isCorrect: false },
                    { answer: 'Посадить и дать сладкий чай', isCorrect: false },
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

const courseEco = await prisma.course.create({
  data: {
    id: 2,
    title: 'Основы эковолонтерства',
    description: 'Узнайте, как сделать мир чище.',
    icon: 'leaf',
    category: 'Экология',
    level: 'Для новичков',
    duration: '30 минут',
    lessons: {
      create: [
        {
          title: 'Тест: Сортировка отходов',
          content: 'Давайте проверим, как хорошо вы разбираетесь в сортировке.',
          questions: {
            create: [
              {
                question: 'Куда выбрасывать бумажные стаканчики из-под кофе?',
                answers: {
                  create: [
                    { answer: 'В макулатуру', isCorrect: false },
                    { answer: 'В общий мусор', isCorrect: true },
                    { answer: 'В пластик', isCorrect: false },
                  ],
                },
              },
              {
                question: 'Какой тип пластика (маркировка) чаще всего перерабатывают в России?',
                answers: {
                  create: [
                    { answer: '1 (PET)', isCorrect: true },
                    { answer: '3 (PVC)', isCorrect: false },
                    { answer: '7 (Other)', isCorrect: false },
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

const courseAnimals = await prisma.course.create({
  data: {
    id: 3,
    title: 'Уход за животными в приюте',
    description: 'Все, что нужно знать о помощи животным.',
    icon: 'pet',
    category: 'Животные',
    level: 'Средний',
    duration: '60 минут',
    lessons: {
      create: [
        {
          title: 'Урок: Язык тела собаки',
          content: 'Понимание языка тела собаки - ключ к безопасному и эффективному общению.',
        },
        {
          title: 'Тест: Безопасность в приюте',
          content: 'Проверка знаний по технике безопасности.',
          questions: {
            create: [
              {
                question: 'Можно ли кормить приютских животных своей едой?',
                answers: {
                  create: [
                    { answer: 'Нет, это может им навредить', isCorrect: true },
                    { answer: 'Да, если они очень просят', isCorrect: false },
                    { answer: 'Только с разрешения другого волонтера', isCorrect: false },
                  ],
                },
              },
              {
                question: 'Что делать, если собака рычит в вольере?',
                answers: {
                  create: [
                    { answer: 'Не входить и позвать сотрудника приюта', isCorrect: true },
                    { answer: 'Попытаться успокоить ее ласковым голосом', isCorrect: false },
                    { answer: 'Быстро зайти и сделать свою работу', isCorrect: false },
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

const course4 = await prisma.course.create({
  data: {
    id: 4,
    title: 'Эффективная коммуникация с подопечными',
    description: 'Как найти общий язык и оказать поддержку.',
    icon: 'chat',
    category: 'Для новичков',
    level: 'Для новичков',
    duration: '25 минут',
  },
});

await prisma.userCertificate.createMany({
  data: [
    { userId: mainUser.id, courseId: course1.id },
    { userId: mainUser.id, courseId: course4.id },
  ],
});

console.log('✅ Courses, lessons and certificates created.');


  // 5. События (как в mockData, с динамическими датами)
  const now = new Date();
  
  const events = await prisma.event.createManyAndReturn({
    data: [
      // --- Прошедшие события (10 шт) ---
      { title: 'Эко-субботник в Парке Горького', description: 'Очистим любимый парк от мусора после выходных.', date: new Date(now.getTime() - 28 * 24 * 3600 * 1000), status: 'COMPLETED', organizationId: orgEco.id, category: 'Экология', location: 'Москва, Парк Горького', latitude: 55.7302, longitude: 37.6053, durationHours: 4, karmaPoints: 60, maxParticipants: 50 },
      { title: 'Помощь в приюте "Некрасовка"', description: 'Выгул собак и помощь в уборке вольеров.', date: new Date(now.getTime() - 25 * 24 * 3600 * 1000), status: 'COMPLETED', organizationId: orgAnimals.id, category: 'Животные', location: 'Москва, ул. 2-я Вольская, вл2с1', latitude: 55.6963, longitude: 37.9304, durationHours: 5, karmaPoints: 80, maxParticipants: 20 },
      { title: 'Концерт для ветеранов', description: 'Организация и проведение небольшого концерта в доме престарелых.', date: new Date(now.getTime() - 22 * 24 * 3600 * 1000), status: 'COMPLETED', organizationId: orgSeniors.id, category: 'Помощь старшим', location: 'Москва, ул. Островитянова, 10', latitude: 55.644, longitude: 37.524, durationHours: 3, karmaPoints: 70, maxParticipants: 15 },
      { title: 'Роспись стен в детской больнице', description: 'Украсим стены отделения яркими и добрыми рисунками.', date: new Date(now.getTime() - 19 * 24 * 3600 * 1000), status: 'COMPLETED', organizationId: orgArt.id, category: 'Арт', location: 'Москва, Ленинский проспект, 117', latitude: 55.658, longitude: 37.514, durationHours: 6, karmaPoints: 90, maxParticipants: 10 },
      { title: 'Волонтер на "Забеге добрых дел"', description: 'Раздача воды и медалей участникам благотворительного забега.', date: new Date(now.getTime() - 16 * 24 * 3600 * 1000), status: 'COMPLETED', organizationId: orgSport.id, category: 'Спорт', location: 'Москва, ВДНХ', latitude: 55.8297, longitude: 37.6322, durationHours: 5, karmaPoints: 75, maxParticipants: 100 },
      { title: 'Сбор макулатуры у метро "Чистые пруды"', description: 'Акция по сбору и сдаче макулатуры в переработку.', date: new Date(now.getTime() - 13 * 24 * 3600 * 1000), status: 'COMPLETED', organizationId: orgEco.id, category: 'Экология', location: 'Москва, Чистопрудный бульвар', latitude: 55.764, longitude: 37.638, durationHours: 3, karmaPoints: 40, maxParticipants: 30 },
      { title: 'Поездка в дом престарелых "Ясенево"', description: 'Общение, настольные игры и помощь по хозяйству.', date: new Date(now.getTime() - 10 * 24 * 3600 * 1000), status: 'COMPLETED', organizationId: orgSeniors.id, category: 'Помощь старшим', location: 'Москва, ул. Айвазовского, 6 к2', latitude: 55.617, longitude: 37.523, durationHours: 4, karmaPoints: 80, maxParticipants: 20 },
      { title: 'Помощь в кошачьем приюте "Муркоша"', description: 'Кормление, уборка и игры с котиками.', date: new Date(now.getTime() - 7 * 24 * 3600 * 1000), status: 'COMPLETED', organizationId: orgAnimals.id, category: 'Животные', location: 'Москва, ул. Осташковская, 14 с1', latitude: 55.875, longitude: 37.67, durationHours: 3, karmaPoints: 60, maxParticipants: 15 },
      { title: 'Упаковка гуманитарной помощи', description: 'Сортировка и упаковка вещей для нуждающихся.', date: new Date(now.getTime() - 4 * 24 * 3600 * 1000), status: 'COMPLETED', organizationId: orgArt.id, category: 'Помощь людям', location: 'Москва, 2-й Донской проезд, 9', latitude: 55.707, longitude: 37.606, durationHours: 4, karmaPoints: 50, maxParticipants: 40 },
      { title: 'Очистка берега Яузы', description: 'Убираем пластик и другой мусор с береговой линии.', date: new Date(now.getTime() - 2 * 24 * 3600 * 1000), status: 'COMPLETED', organizationId: orgEco.id, category: 'Экология', location: 'Москва, набережная реки Яузы', latitude: 55.776, longitude: 37.67, durationHours: 3, karmaPoints: 50, maxParticipants: 35 },

      // --- Будущие события (15 шт) ---
      { title: 'Эко-лекция в Нескучном саду', description: 'Узнаем о раздельном сборе и переработке отходов.', date: new Date(now.getTime() + 2 * 24 * 3600 * 1000), status: 'PLANNED', organizationId: orgEco.id, category: 'Экология', location: 'Москва, Нескучный сад', latitude: 55.725, longitude: 37.59, durationHours: 2, karmaPoints: 20, maxParticipants: 50, recommendedCourseId: courseEco.id },
      { title: 'Волонтер на Московском Марафоне', description: 'Помощь в организации крупнейшего забега страны.', date: new Date(now.getTime() + 5 * 24 * 3600 * 1000), status: 'PLANNED', organizationId: orgSport.id, category: 'Спорт', location: 'Москва, Лужники', latitude: 55.7157, longitude: 37.5539, durationHours: 8, karmaPoints: 150, maxParticipants: 200 },
      { title: 'Арт-вечер в "Винзаводе"', description: 'Помощь в организации выставки современного искусства.', date: new Date(now.getTime() + 7 * 24 * 3600 * 1000), status: 'PLANNED', organizationId: orgArt.id, category: 'Арт', location: 'Москва, 4-й Сыромятнический пер., 1/8с6', latitude: 55.752, longitude: 37.6563, durationHours: 5, karmaPoints: 60, maxParticipants: 25 },
      { title: 'День открытых дверей в приюте', description: 'Помогаем найти дом для кошек и собак.', date: new Date(now.getTime() + 9 * 24 * 3600 * 1000), status: 'PLANNED', organizationId: orgAnimals.id, category: 'Животные', location: 'Москва, ул. Зорге, 21А', latitude: 55.783, longitude: 37.514, durationHours: 6, karmaPoints: 100, maxParticipants: 30 },
      { title: 'Посадка деревьев в Битцевском парке', description: 'Восстанавливаем лес после урагана.', date: new Date(now.getTime() + 11 * 24 * 3600 * 1000), status: 'PLANNED', organizationId: orgEco.id, category: 'Экология', location: 'Москва, Битцевский парк', latitude: 55.62, longitude: 37.55, durationHours: 4, karmaPoints: 70, maxParticipants: 60 },
      { title: 'Помощь на "Формуле Рукоделия"', description: 'Помощь в навигации гостей и на стендах.', date: new Date(now.getTime() + 13 * 24 * 3600 * 1000), status: 'PLANNED', organizationId: orgArt.id, category: 'Культура', location: 'Москва, КВЦ Сокольники', latitude: 55.805, longitude: 37.68, durationHours: 6, karmaPoints: 80, maxParticipants: 40 },
      { title: 'Велопробег "Спорт во благо"', description: 'Сопровождение участников и помощь на пит-стопах.', date: new Date(now.getTime() + 15 * 24 * 3600 * 1000), status: 'PLANNED', organizationId: orgSport.id, category: 'Спорт', location: 'Москва, Крылатское, Велотрек', latitude: 55.76, longitude: 37.44, durationHours: 5, karmaPoints: 90, maxParticipants: 50 },
      { title: 'Благотворительный аукцион', description: 'Помощь в регистрации гостей и работе с лотами.', date: new Date(now.getTime() + 17 * 24 * 3600 * 1000), status: 'PLANNED', organizationId: orgArt.id, category: 'Дети', location: 'Москва, ул. Волхонка, 12, ГМИИ им. Пушкина', latitude: 55.747, longitude: 37.605, durationHours: 4, karmaPoints: 100, maxParticipants: 20 },
      { title: 'Субботник в Измайловском парке', description: 'Убираем осеннюю листву и готовим парк к зиме.', date: new Date(now.getTime() + 19 * 24 * 3600 * 1000), status: 'PLANNED', organizationId: orgEco.id, category: 'Экология', location: 'Москва, Измайловский парк', latitude: 55.788, longitude: 37.755, durationHours: 3, karmaPoints: 50, maxParticipants: 80 },
      { title: '"Подари тепло": вязание для пожилых', description: 'Вяжем теплые вещи для подопечных фонда.', date: new Date(now.getTime() + 21 * 24 * 3600 * 1000), status: 'PLANNED', organizationId: orgSeniors.id, category: 'Помощь старшим', location: 'Москва, ул. Тверская, 7', latitude: 55.759, longitude: 37.61, durationHours: 3, karmaPoints: 40, maxParticipants: 30 },
      { title: 'Фотосессия для собак из приюта', description: 'Помогаем сделать красивые фото, чтобы найти им дом.', date: new Date(now.getTime() + 23 * 24 * 3600 * 1000), status: 'PLANNED', organizationId: orgAnimals.id, category: 'Животные', location: 'Москва, ул. Саперный проезд, 13', latitude: 55.67, longitude: 37.77, durationHours: 5, karmaPoints: 70, maxParticipants: 10 },
      { title: 'IT-субботник: помощь фондам', description: 'Помогаем некоммерческим организациям с их сайтами и IT-задачами.', date: new Date(now.getTime() + 25 * 24 * 3600 * 1000), status: 'PLANNED', organizationId: orgArt.id, category: 'Онлайн', location: 'Онлайн', durationHours: 6, karmaPoints: 120, maxParticipants: 50 },
      { title: 'Уборка в парке "Коломенское"', description: 'Приводим в порядок территорию музея-заповедника.', date: new Date(now.getTime() + 27 * 24 * 3600 * 1000), status: 'PLANNED', organizationId: orgEco.id, category: 'Культура', location: 'Москва, проспект Андропова, 39', latitude: 55.668, longitude: 37.666, durationHours: 4, karmaPoints: 60, maxParticipants: 40 },
      { title: 'Новогодний сбор подарков', description: 'Сортировка и упаковка подарков для детей из детских домов.', date: new Date(now.getTime() + 29 * 24 * 3600 * 1000), status: 'PLANNED', organizationId: orgArt.id, category: 'Дети', location: 'Москва, ул. Новый Арбат, 24', latitude: 55.753, longitude: 37.587, durationHours: 5, karmaPoints: 80, maxParticipants: 60 },
      { title: 'Донорская акция', description: 'Помощь в координации доноров в центре крови.', date: new Date(now.getTime() + 30 * 24 * 3600 * 1000), status: 'PLANNED', organizationId: orgSeniors.id, category: 'Помощь людям', location: 'Москва, ул. Щепкина, 61/2', latitude: 55.78, longitude: 37.62, durationHours: 4, karmaPoints: 90, maxParticipants: 20 },
    ]
  });
  console.log(`✅ Created ${events.length} events.`);

  const eventPast1 = events.find(e => e.id === 1)!;
  const eventPast2 = events.find(e => e.id === 2)!;
  const eventFuture1 = events.find(e => e.id === 11)!;

  // 6. Участие, Дружба, Подписки
  await prisma.eventParticipant.createMany({ data: [ { userId: mainUser.id, eventId: eventPast1.id, status: 'approved' }, { userId: mainUser.id, eventId: eventPast2.id, status: 'approved' }, { userId: mainUser.id, eventId: eventFuture1.id, status: 'approved' }, { userId: friendUser.id, eventId: eventFuture1.id, status: 'approved' } ] });
  await prisma.friendship.create({ data: { userId: mainUser.id, friendId: friendUser.id } });
  await prisma.userOrganizationSubscription.create({ data: { userId: mainUser.id, organizationId: orgAnimals.id } });
  console.log('✅ Relations created.');

  // 7. Отзывы и обновление рейтингов
  await prisma.review.create({ data: { authorId: mainUser.id, eventId: eventPast1.id, organizationId: orgEco.id, rating: 5, text: 'Отличная организация! Все было супер, много инвентаря и позитива.' } });
  for (const org of [orgArt, orgEco, orgSeniors, orgAnimals, orgSport]) {
    const agg = await prisma.review.aggregate({ where: { organizationId: org.id }, _avg: { rating: true }, _count: { id: true } });
    await prisma.organization.update({ where: { id: org.id }, data: { rating: agg._avg.rating, reviewCount: agg._count.id } });
  }
  console.log('✅ Reviews and ratings created.');
  
  // 8. Достижения
  const achievements = await prisma.achievement.createManyAndReturn({
    data: [
      { id: 1, name: 'Первый шаг', description: 'Завершить свое первое волонтерское событие.', criteriaType: 'EVENT_COUNT', criteriaValue: 1 },
      { id: 2, name: 'Новичок в деле', description: 'Накопить 10 часов волонтерства.', criteriaType: 'TOTAL_HOURS', criteriaValue: 10 },
      { id: 3, name: 'Первые знания', description: 'Пройти свой первый обучающий курс.', criteriaType: 'COURSES_COUNT', criteriaValue: 1 },
      { id: 4, name: 'Друг животных', description: 'Принять участие в 3 событиях по помощи животным.', criteriaType: 'EVENT_CATEGORY', criteriaValue: 3 },
      { id: 5, name: 'Эко-воин', description: 'Принять участие в 5 экологических акциях.', criteriaType: 'EVENT_CATEGORY', criteriaValue: 5 },
      { id: 6, name: 'Мастер помощи', description: 'Помочь пожилым людям 3 раза.', criteriaType: 'EVENT_CATEGORY', criteriaValue: 3 },
      { id: 7, name: 'Душа спорта', description: 'Принять участие в 3 спортивных мероприятиях.', criteriaType: 'EVENT_CATEGORY', criteriaValue: 3 },
      { id: 8, name: 'Марафонец Добра', description: 'Накопить 50 часов волонтерства.', criteriaType: 'TOTAL_HOURS', criteriaValue: 50 },
      { id: 9, name: 'Активист', description: 'Набрать 1000 очков кармы.', criteriaType: 'KARMA_POINTS', criteriaValue: 1000 },
      { id: 10, name: 'Ветеран', description: 'Принять участие в 10 событиях.', criteriaType: 'EVENT_COUNT', criteriaValue: 10 },
      { id: 11, name: 'Душа компании', description: 'Подписаться на 5 организаций.', criteriaType: 'SUBSCRIPTION_COUNT', criteriaValue: 5 },
      { id: 12, name: 'Всезнайка', description: 'Пройти 5 обучающих курсов.', criteriaType: 'COURSES_COUNT', criteriaValue: 5 },
      { id: 13, name: 'Лидер мнений', description: 'Написать свою первую историю.', criteriaType: 'STORY_COUNT', criteriaValue: 1 },
      { id: 14, name: 'Надежный друг', description: 'Пригласить друга на событие.', criteriaType: 'FRIEND_INVITE_COUNT', criteriaValue: 1 },
      { id: 15, name: 'Коллекционер', description: 'Купить первую награду в магазине.', criteriaType: 'REWARD_PURCHASE_COUNT', criteriaValue: 1 },
    ]
  });

  await prisma.userAchievement.createMany({
    data: [
      { userId: mainUser.id, achievementId: achievements.find(a => a.name === 'Первый шаг')!.id },
      { userId: mainUser.id, achievementId: achievements.find(a => a.name === 'Друг животных')!.id },
      { userId: mainUser.id, achievementId: achievements.find(a => a.name === 'Первые знания')!.id },
      { userId: mainUser.id, achievementId: achievements.find(a => a.name === 'Коллекционер')!.id },
    ]
  });
  console.log('✅ Achievements created and assigned.');

  // 9. Награды и Челленджи
  const rewards = await prisma.reward.createManyAndReturn({
    data: [ { name: 'Значок "Эко-воин"', description: 'Эксклюзивный значок для профиля.', category: 'Значки', price: 500 }, { name: 'Тема "Космос"', description: 'Тема оформления для приложения.', category: 'Темы оформления', price: 1500 } ]
  });
  await prisma.userReward.create({ data: { userId: mainUser.id, rewardId: rewards[0].id } });
  const challenge = await prisma.challenge.create({ data: { title: "Челлендж недели", description: "Помогите животным 1 раз", reward: "Награда: +100 кармы ✨", criteriaType: "EVENT_CATEGORY", criteriaMeta: "Животные", criteriaValue: 1, period: "WEEKLY" } });
  await prisma.userChallenge.create({ data: { userId: mainUser.id, challengeId: challenge.id, progress: 1, completedAt: new Date() } });
  console.log('✅ Gamification entities created.');

  // 10. Истории, Чаты, Логи
  const story = await prisma.story.create({ data: { authorId: mainUser.id, eventId: eventPast2.id, text: "Провели день с пушистыми друзьями в приюте. Эти глаза не могут врать, им очень нужна наша забота. 🐾", imageUrl: "https://picsum.photos/seed/story2/600/600" } });
  await prisma.storyLike.create({ data: { storyId: story.id, userId: friendUser.id } });
  await prisma.comment.create({ data: { storyId: story.id, authorId: otherUsers[2].id, text: 'Какие вы молодцы!' } });
  
  const eventChat = await prisma.eventChat.create({ data: { eventId: eventFuture1.id } });
  await prisma.eventChatMessage.create({ data: { chatId: eventChat.id, authorId: mainUser.id, text: 'Всем привет! Кто идет на выставку?' } });
  await prisma.assistantChatMessage.create({ data: { authorId: mainUser.id, content: 'Привет, ассистент!', sender: 'USER' } });
  await prisma.karmaLog.createMany({ data: [ { userId: mainUser.id, points: 50, description: `Участие: ${eventPast1.title}` }, { userId: mainUser.id, points: 75, description: `Участие: ${eventPast2.title}` }, { userId: mainUser.id, points: -500, description: `Покупка: ${rewards[0].name}` } ] });
  console.log('✅ Stories, chats and logs created.');

  console.log('--- Seeding complete! ---');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});

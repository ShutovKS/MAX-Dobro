import 'dotenv/config';
import http from 'http';
import { Bot, Keyboard, Context } from '@maxhub/max-bot-api';

const { BOT_TOKEN, BOT_NAME, PORT } = process.env;

if (!BOT_TOKEN || !BOT_NAME) {
  throw new Error('BOT_TOKEN and BOT_NAME must be provided as environment variables');
}

const bot = new Bot(BOT_TOKEN);
const miniAppUrl = `https://max.ru/${BOT_NAME}?startapp`;

const webAppButton = Keyboard.inlineKeyboard([
  [Keyboard.button.link('🚀 Запустить приложение', miniAppUrl)],
]);

const keywordResponses: Record<string, (ctx: Context) => void> = {
  события: (ctx) =>
    ctx.reply(
      'Я могу помочь найти события. Попробуйте написать категорию, например, "экология" или "спорт". Или откройте приложение, чтобы увидеть всё!',
      { attachments: [webAppButton] },
    ),
  экология: (ctx) =>
    ctx.reply('Нашел для вас события в категории "Экология". Открыть?', {
      attachments: [webAppButton],
    }),
  животные: (ctx) =>
    ctx.reply('Подбираю лучшие события для помощи животным. Показать?', {
      attachments: [webAppButton],
    }),
  спорт: (ctx) =>
    ctx.reply('Есть несколько спортивных мероприятий. Откройте приложение, чтобы записаться!', {
      attachments: [webAppButton],
    }),
  помощь: (ctx) =>
    ctx.reply(
      'Помощь нужна разная: пожилым, детям, людям в сложной ситуации. Все возможности — в приложении.',
      { attachments: [webAppButton] },
    ),
  курсы: (ctx) =>
    ctx.reply('У нас есть отличные курсы! Они помогут вам получить новые навыки. Открыть каталог?', {
      attachments: [webAppButton],
    }),
  профиль: (ctx) =>
    ctx.reply(
      'Ваш профиль, достижения и накопленные "часы добра" ждут вас в приложении. Загляните!',
      { attachments: [webAppButton] },
    ),
  рейтинг: (ctx) =>
    ctx.reply(
      'Хотите узнать свое место в рейтинге волонтеров? Откройте таблицу лидеров в приложении!',
      { attachments: [webAppButton] },
    ),
  челлендж: (ctx) =>
    ctx.reply('Еженедельный челлендж — отличный способ получить больше кармы! Проверить текущий?', {
      attachments: [webAppButton],
    }),
};

const allKeywords = Object.keys(keywordResponses);
const keywordRegex = new RegExp(`(${allKeywords.join('|')})`, 'i');

bot.on('bot_started', (ctx: Context) => {
  const userName = ctx.user?.name ?? 'пользователь';
  ctx.reply(
    `Привет, ${userName}! 👋\n\nЯ бот «МАХ Добро». Помогу вам найти интересные события и курсы. Нажмите на кнопку, чтобы начать!`,
    { attachments: [webAppButton] },
  );
});

bot.command('start', (ctx: Context) =>
  ctx.reply('Нажмите кнопку ниже, чтобы запустить приложение «МАХ Добро».', {
    attachments: [webAppButton],
  }),
);

bot.command('profile', keywordResponses['профиль']);
bot.command('courses', keywordResponses['курсы']);
bot.command('leaderboard', keywordResponses['рейтинг']);
bot.command('challenge', keywordResponses['челлендж']);

bot.hears(keywordRegex, (ctx, next) => {
  const keyword = ctx.match?.[1]?.toLowerCase();
  if (keyword && keywordResponses[keyword]) {
    return keywordResponses[keyword](ctx);
  }
  return next();
});

bot.on('message_created', (ctx) =>
  ctx.reply(
    'Я не совсем понял. Попробуйте спросить про "события", "курсы" или "профиль". Или просто откройте приложение.',
    { attachments: [webAppButton] },
  ),
);

bot.api.setMyCommands([
  { name: 'start', description: '🚀 Запустить приложение' },
  { name: 'profile', description: '📊 Мой профиль и статистика' },
  { name: 'courses', description: '🎓 Каталог курсов' },
  { name: 'leaderboard', description: '🏆 Таблица лидеров' },
  { name: 'challenge', description: '🎯 Еженедельный челлендж' },
]);

bot.start();

console.log('Bot started successfully with long-polling!');

const stopBot = () => bot.stop();
process.once('SIGINT', stopBot);
process.once('SIGTERM', stopBot);

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running');
});

const port = PORT || 10000;
server.listen(port, () => {
  console.log(`Dummy server started on port ${port} to keep Render happy.`);
});
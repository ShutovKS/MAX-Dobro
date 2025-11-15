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

const genericReplies = [
  'Все возможности для добрых дел находятся в нашем приложении. Нажмите на кнопку, чтобы начать!',
  'Моя главная задача — запустить для вас приложение «МАХ Добро». Давайте начнем?',
  'Я — просто бот. Вся магия происходит внутри приложения. Откройте его, чтобы найти события и курсы!',
  'Чтобы найти то, что вы ищете, пожалуйста, запустите наше приложение.',
  'Кажется, вы хотите сделать что-то хорошее! Наше приложение поможет вам в этом. Нажмите кнопку для запуска.',
];

const getRandomReply = () =>
  genericReplies[Math.floor(Math.random() * genericReplies.length)];

bot.on('bot_started', (ctx: Context) => {
  const userName = ctx.user?.name ?? 'пользователь';
  const welcomeMessage = `Привет, ${userName}! 👋

Я бот «МАХ Добро» — ваш помощник в мире волонтерства.

Здесь вы можете найти волонтерские события на любой вкус: от помощи животным в приютах и участия в экологических субботниках до организации спортивных мероприятий и поддержки пожилых людей.

А чтобы вы чувствовали себя увереннее, мы подготовили полезные микро-курсы, например, «Основы первой помощи» или «Экологические привычки».

Все это — в одном удобном приложении. Нажмите на кнопку ниже, чтобы начать свой путь героя!`;

  ctx.reply(welcomeMessage, { attachments: [webAppButton] });
});

bot.command('start', (ctx: Context) =>
  ctx.reply('Нажмите кнопку ниже, чтобы запустить приложение «МАХ Добро».', {
    attachments: [webAppButton],
  }),
);

bot.command('info', (ctx: Context) => {
  const infoText = `ℹ️ **О проекте «МАХ Добро»**

**Наша цель** — сделать волонтерство простым, удобным и геймифицированным.

**Что умеет бот?**
• Запускать мини-приложение.
• Отвечать на команду /start и /info.

**Что можно делать в приложении?**
• **Находить события:** ищите мероприятия по категориям, дате и геолокации.
• **Проходить курсы:** получайте новые знания и цифровые сертификаты.
• **Отслеживать прогресс:** ведите электронную волонтерскую книжку, зарабатывайте баллы "кармы" и получайте достижения.

Готовы начать?`;

  ctx.reply(infoText, { attachments: [webAppButton], format: 'markdown' });
});

bot.hears(/(привет|здравствуй|добрый день)/i, (ctx: Context) => {
  const userName = ctx.user?.name ?? 'незнакомец';
  ctx.reply(`Привет, ${userName}! Рад вас видеть. Начнем делать добрые дела?`, {
    attachments: [webAppButton],
  });
});

bot.on('message_created', (ctx: Context) =>
  ctx.reply(getRandomReply(), { attachments: [webAppButton] }),
);

bot.api.setMyCommands([
  { name: 'start', description: '🚀 Запустить приложение' },
  { name: 'info', description: 'ℹ️ Узнать больше о проекте' },
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
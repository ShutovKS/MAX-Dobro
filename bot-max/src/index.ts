import 'dotenv/config';
import http from 'http';
import {Bot, Context, Keyboard} from '@maxhub/max-bot-api';

const {MAX_BOT_TOKEN, MAX_BOT_NAME, PORT, MINI_APP_URL} = process.env;

if (!MAX_BOT_TOKEN || !MAX_BOT_NAME) {
  throw new Error('BOT_TOKEN and BOT_NAME must be provided');
}

const bot = new Bot(MAX_BOT_TOKEN);

const appLink = MINI_APP_URL || `https://max.ru/${MAX_BOT_NAME}?startapp`;

const mainKeyboard = Keyboard.inlineKeyboard([
  [Keyboard.button.link('🚀 Открыть MAX Добро', appLink)],
]);

const dailyDeeds = [
  '🌱 Идея на сегодня: Откажись от пластикового пакета в магазине.',
  '☕️ Идея на сегодня: Угости кофе коллегу или однокурсника.',
  '📞 Идея на сегодня: Позвони бабушке или дедушке просто так.',
  '🚶‍♂️ Идея на сегодня: Пройдись пешком вместо одной остановки транспорта.',
  '🐾 Идея на сегодня: Купи пачку корма и отнеси к магазину для бездомных животных.',
];

const helpMessage = `🆘 **Центр поддержки героев**

Я — навигатор в мире добрых дел. Вот что я умею (а лучше умеет приложение):

🗺 **Найти дело:** Субботники, приюты, фонды рядом с тобой.
🎓 **Научить:** Курсы первой помощи и эковолонтерства.
🏆 **Наградить:** Ведем учет часов, даем ачивки и баллы кармы.

Есть вопросы? Жми /info или запускай приложение!`;


bot.on('bot_started', (ctx: Context) => {
  const userName = ctx.user?.name || 'Герой';

  const welcomeText = `Привет, ${userName}! 🌍

Ты попал в **MAX Добро** — место, где маленькие действия меняют большой мир.

Здесь ты можешь:
• Найти волонтерские тусовки в твоем городе.
• Прокачать скиллы (и карму!).
• Найти новых друзей.

Твой путь начинается с нажатия кнопки 👇`;

  ctx.reply(welcomeText, {attachments: [mainKeyboard], format: 'markdown'});
});

bot.command('start', (ctx: Context) => {
  ctx.reply('Готов продолжить путь? Твоя карма ждет!', {attachments: [mainKeyboard]});
});

bot.command('help', (ctx: Context) => {
  ctx.reply(helpMessage, {attachments: [mainKeyboard], format: 'markdown'});
});

bot.command('info', (ctx: Context) => {
  ctx.reply(helpMessage, {attachments: [mainKeyboard], format: 'markdown'});
});

bot.command('idea', (ctx: Context) => {
  const randomDeed = dailyDeeds[Math.floor(Math.random() * dailyDeeds.length)];
  ctx.reply(randomDeed + '\n\nВыполнил? Заходи в приложение и ищи похожие события!', {
    attachments: [mainKeyboard]
  });
});

bot.hears(/(привет|хай|ку)/i, (ctx: Context) => {
  ctx.reply('Салют! 👋 Готов сделать мир лучше сегодня?', {attachments: [mainKeyboard]});
});

bot.hears(/(пока|до свид)/i, (ctx: Context) => {
  ctx.reply('До встречи! Не забывай: добро всегда возвращается. ✨');
});

bot.on('message_created', (ctx: Context) => {
  if (!ctx.message?.body.text?.startsWith('/')) {
    ctx.reply('Я всего лишь бот-проводник 🤖. Вся магия происходит внутри приложения!', {
      attachments: [mainKeyboard]
    });
  }
});

bot.api.setMyCommands([
  {name: 'start', description: '🚀 Главное меню'},
  {name: 'idea', description: '💡 Идея доброго дела'},
  {name: 'help', description: '❓ Что это такое?'},
]);

bot.start();
console.log('MAX Bot is running with upgraded texts...');

const stopBot = () => bot.stop();
process.once('SIGINT', stopBot);
process.once('SIGTERM', stopBot);

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('MAX Bot is alive');
});
server.listen(PORT || 10000);
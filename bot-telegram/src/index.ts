import {Markup, Telegraf} from 'telegraf';
import 'dotenv/config';
import http from 'http';

const token = process.env.TG_BOT_TOKEN;
const webAppUrl = process.env.MINI_APP_URL || 'https://max-dobro.vercel.app';
const PORT = process.env.PORT || 10000;

if (!token) throw new Error('TG_BOT_TOKEN is missing');

const bot = new Telegraf(token);

const dailyDeeds = [
  '🌱 Идея: Откажись от пластикового пакета сегодня.',
  '☕️ Идея: Угости кофе коллегу.',
  '📞 Идея: Позвони родителям.',
  '🚶‍♂️ Идея: Пройдись пешком лишние 10 минут.',
  '🐾 Идея: Погладь котика (если он не против).',
];

bot.start((ctx) => {
  const userName = ctx.from.first_name;
  ctx.reply(
    `Привет, ${userName}! 🌍\n\n` +
    `Добро пожаловать в **MAX Добро** (Telegram Edition).\n` +
    `Это экосистема добрых дел, волонтерства и саморазвития.\n\n` +
    `Жми кнопку ниже, чтобы войти в приложение 👇`,
    Markup.keyboard([
      [Markup.button.webApp('🚀 Запустить MAX Добро', webAppUrl)]
    ]).resize()
  );
});

bot.command('help', (ctx) => {
  ctx.reply(
    '🆘 **Помощь**\n\n' +
    'Я бот-проводник. Основной функционал находится в Мини-приложении.\n' +
    'Там ты найдешь карту событий, профиль волонтера и курсы.',
    Markup.inlineKeyboard([
      Markup.button.webApp('Открыть приложение', webAppUrl)
    ])
  );
});

bot.command('idea', (ctx) => {
  const randomDeed = dailyDeeds[Math.floor(Math.random() * dailyDeeds.length)];
  ctx.reply(randomDeed);
});

bot.on('message', (ctx: any) => {
  if (ctx.message.web_app_data) {
    ctx.reply(`Получены данные из приложения: ${ctx.message.web_app_data.data}`);
  } else if (ctx.message.text && !ctx.message.text.startsWith('/')) {
    ctx.reply('Открой приложение, чтобы начать делать добро!', Markup.inlineKeyboard([
      Markup.button.webApp('🚀 Вперед', webAppUrl)
    ]));
  }
});

bot.launch().then(() => {
  console.log('Telegram Bot started');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Telegram Bot is alive');
});

server.listen(PORT, () => {
  console.log(`Dummy server listening on port ${PORT}`);
});

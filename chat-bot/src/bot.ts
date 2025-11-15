import 'dotenv/config';
import { Bot, Keyboard } from '@maxhub/max-bot-api';

const BOT_TOKEN = process.env.MAX_BOT_TOKEN;
const MINI_APP_URL = process.env.MINI_APP_URL;

if (!BOT_TOKEN || !MINI_APP_URL) {
  throw new Error('MAX_BOT_TOKEN and MINI_APP_URL must be provided in .env file');
}

const bot = new Bot(BOT_TOKEN);

const webAppButton = Keyboard.inlineKeyboard([
  [Keyboard.button.link('💫 Открыть MAX Добро', MINI_APP_URL)],
]);

bot.on('bot_started', (ctx) =>
  ctx.reply(
    `Привет, ${ctx.user?.name}! 👋\n\nЯ бот MAX Добро. Помогу вам найти интересные волонтерские события, пройти обучение и стать частью нашего сообщества.\n\nНажмите кнопку ниже, чтобы начать!`,
    { attachments: [webAppButton] },
  ),
);

bot.command('start', (ctx) =>
  ctx.reply('Нажмите кнопку ниже, чтобы запустить приложение.', {
    attachments: [webAppButton],
  }),
);

bot.api.setMyCommands([{ name: 'start', description: 'Запустить MAX Добро' }]);

bot.start();

console.log('Bot started successfully with long-polling!');

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());
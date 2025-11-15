import 'dotenv/config';
import { Bot, Keyboard, Context } from '@maxhub/max-bot-api';

const { BOT_TOKEN, BOT_NAME } = process.env;

if (!BOT_TOKEN || !BOT_NAME) {
  throw new Error('BOT_TOKEN and BOT_NAME must be provided as environment variables');
}

const bot = new Bot(BOT_TOKEN);
const miniAppUrl = `https://max.ru/${BOT_NAME}?startapp`;

const webAppButton = Keyboard.inlineKeyboard([
  [Keyboard.button.link('🚀 Запустить', miniAppUrl)],
]);

const welcomeText = (name: string) =>
  `Привет, ${name}! 👋\n\nЯ бот MAX Добро. Помогу вам найти интересные волонтерские события, пройти обучение и стать частью нашего сообщества.\n\nНажмите кнопку ниже, чтобы начать!`;

bot.on('bot_started', (ctx: Context) => {
  const userName = ctx.user?.name ?? 'пользователь';
  ctx.reply(welcomeText(userName), {
    attachments: [webAppButton],
  });
});

bot.command('start', (ctx: Context) =>
  ctx.reply('Нажмите кнопку ниже, чтобы запустить приложение.', {
    attachments: [webAppButton],
  }),
);

bot.api.setMyCommands([{ name: 'start', description: 'Запустить MAX Добро' }]);

bot.start();

console.log('Bot started successfully with long-polling!');

const stopBot = () => bot.stop();
process.once('SIGINT', stopBot);
process.once('SIGTERM', stopBot);
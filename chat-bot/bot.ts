import 'dotenv/config';
import { Bot, Keyboard, Context } from '@maxhub/max-bot-api';

const { BOT_TOKEN, BOT_NAME } = process.env;

if (!BOT_TOKEN || !BOT_NAME) {
  throw new Error('BOT_TOKEN and BOT_NAME must be defined in the .env file');
}

const MINI_APP_URL = `https://max.ru/${BOT_NAME}?startapp`;

const bot = new Bot(BOT_TOKEN);

bot.api
  .setMyCommands([
    {
      name: 'start',
      description: 'Запустить приложение',
    },
  ])
  .catch((err) => console.error('Failed to set commands:', err));

bot.command('start', (ctx: Context) => {
  const text =
    'Добро пожаловать в «МАХ Добро»! ✨\n\nЭто платформа, которая поможет вам найти возможности для добрых дел, отслеживать свой вклад и развивать социальные компетенции.';

  const keyboard = Keyboard.inlineKeyboard([
    [Keyboard.button.link('🚀 Запустить', MINI_APP_URL)],
  ]);

  return ctx.reply(text, {
    attachments: [keyboard],
  });
});

bot.start();
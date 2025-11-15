import 'dotenv/config';
import type { IncomingMessage, ServerResponse } from 'http';
import { Bot, Context, Keyboard } from '@maxhub/max-bot-api';

const BOT_TOKEN = process.env.MAX_BOT_TOKEN;
const MINI_APP_URL = process.env.MINI_APP_URL;

if (!BOT_TOKEN || !MINI_APP_URL) {
  throw new Error('Missing environment variables: MAX_BOT_TOKEN or MINI_APP_URL');
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

const initializeBot = async () => {
  if (!bot.botInfo) {
    bot.botInfo = await bot.api.getMyInfo();
    await bot.api.setMyCommands([{ name: 'start', description: 'Запустить MAX Добро' }]);
  }
};

const processUpdate = async (update: any) => {
  await initializeBot();
  const ctx = new Context(update, bot.api, bot.botInfo);
  await bot.middleware()(ctx, async () => {});
};

const readJsonBody = (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end('Method Not Allowed');
  }

  try {
    const update = await readJsonBody(req);
    await processUpdate(update);
  } catch (error) {
    console.error('Error processing update:', error);
  }

  res.statusCode = 200;
  res.end('OK');
}
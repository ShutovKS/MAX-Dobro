import {Markup, Telegraf} from 'telegraf';
import 'dotenv/config';
import http from 'http';

const token = process.env.TG_BOT_TOKEN;
const webAppUrl = process.env.MINI_APP_URL || 'https://max-dobro.vercel.app';
const PORT = process.env.PORT || 10000;

if (!token) throw new Error('TG_BOT_TOKEN is missing');

const bot = new Telegraf(token);

// --- Тексты ---

const dailyDeeds = [
  '🌱 *Идея:* Откажись от пластикового пакета сегодня.',
  '☕️ *Идея:* Угости кофе коллегу.',
  '📞 *Идея:* Позвони родителям.',
  '🚶‍♂️ *Идея:* Пройдись пешком лишние 10 минут.',
  '🐾 *Идея:* Погладь котика (если он не против).',
];

const authorsText = `👨‍💻 *Команда MAX Добро*

Мы создали этот проект, чтобы технологии помогали делать добрые дела проще и интереснее.

🛠 *Backend (NestJS):*
• Михаил Данилов ([GitHub](https://github.com/seaG7))
• Кирилл Корнилов ([GitHub](https://github.com/krl76))

🎨 *Frontend (React):*
• Шутов Кирилл ([GitHub](https://github.com/ShutovKS))

Сделано с любовью к коду и людям ❤️`;

const helpText = '🆘 *Помощь*\n\n' +
  'Я бот-проводник. Основной функционал находится в Мини-приложении.\n' +
  'Там ты найдешь карту событий, профиль волонтера и курсы.';

// --- Клавиатура (Меню) ---
const getMainMenu = () => {
  return Markup.inlineKeyboard([
    // 1 ряд: Большая кнопка запуска
    [Markup.button.webApp('🚀 Запустить MAX Добро', webAppUrl)],
    // 2 ряд: Идея и Авторы
    [
      Markup.button.callback('💡 Идея дела', 'btn_idea'),
      Markup.button.callback('👨‍💻 Авторы', 'btn_authors')
    ],
    // 3 ряд: Справка
    [Markup.button.callback('❓ Справка', 'btn_help')]
  ]);
};

// --- Команды (через /) ---

bot.start((ctx) => {
  const userName = ctx.from.first_name;
  ctx.reply(
    `Привет, *${userName}*! 🌍\n\n` +
    `Добро пожаловать в *MAX Добро* (Telegram Edition).\n` +
    `Это экосистема добрых дел, волонтерства и саморазвития.\n\n` +
    `Жми кнопки ниже для навигации 👇`,
    {
      parse_mode: 'Markdown',
      ...getMainMenu()
    }
  );
});

bot.command('help', (ctx) => {
  ctx.reply(helpText, {
    parse_mode: 'Markdown',
    ...getMainMenu()
  });
});

bot.command('authors', (ctx) => {
  ctx.reply(authorsText, {
    parse_mode: 'Markdown',
    link_preview_options: {is_disabled: true},
    ...getMainMenu()
  });
});

bot.command('idea', (ctx) => {
  const randomDeed = dailyDeeds[Math.floor(Math.random() * dailyDeeds.length)];
  ctx.reply(randomDeed, {
    parse_mode: 'Markdown',
    ...getMainMenu()
  });
});

// --- Обработчики кнопок (Actions) ---

bot.action('btn_idea', async (ctx) => {
  const randomDeed = dailyDeeds[Math.floor(Math.random() * dailyDeeds.length)];
  await ctx.reply(randomDeed, {parse_mode: 'Markdown', ...getMainMenu()});
  await ctx.answerCbQuery();
});

bot.action('btn_authors', async (ctx) => {
  await ctx.reply(authorsText, {
    parse_mode: 'Markdown',
    link_preview_options: {is_disabled: true},
    ...getMainMenu()
  });
  await ctx.answerCbQuery();
});

bot.action('btn_help', async (ctx) => {
  await ctx.reply(helpText, {
    parse_mode: 'Markdown',
    ...getMainMenu()
  });
  await ctx.answerCbQuery();
});

// --- Системные обработчики ---

bot.on('message', (ctx: any) => {
  if (ctx.message.web_app_data) {
    ctx.reply(`Получены данные из приложения: ${ctx.message.web_app_data.data}`);
  } else if (ctx.message.text && !ctx.message.text.startsWith('/')) {
    ctx.reply('Используй меню для навигации 👇', getMainMenu());
  }
});

// --- Запуск ---

async function startBot() {
  try {
    await bot.telegram.setMyCommands([
      {command: 'start', description: '🚀 Главное меню'},
      {command: 'idea', description: '💡 Идея доброго дела'},
      {command: 'authors', description: '👨‍💻 О разработчиках'},
      {command: 'help', description: '❓ Справка'}
    ]);
    console.log('✅ Команды обновлены');

    await bot.launch();
    console.log('🤖 Telegram Bot started');
  } catch (e) {
    console.error('Ошибка запуска:', e);
  }
}

startBot();

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Server for Render
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Telegram Bot is alive');
});

server.listen(PORT, () => {
  console.log(`Dummy server listening on port ${PORT}`);
});
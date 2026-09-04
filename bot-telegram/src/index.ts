// FILE: bot-telegram/src/index.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Telegram bot that launches the MAX Добро web app.
//   SCOPE: Token check, private/group keyboards, start/help/idea/authors handlers, health server
//   DEPENDS: none
//   LINKS: M-BOT-TELEGRAM, V-M-BOT-TELEGRAM
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   bot - Telegram bot process with web_app launch keyboard
//   getPrivateMenuKeyboard - private-chat reply keyboard
//   getGroupKeyboard - group inline deep-link keyboard
//   getStartInlineButton - private web_app start button
//   replyWithMenu - reply with the chat-type menu
//   startBot - register commands and launch
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import {Context, Telegraf} from 'telegraf';
import 'dotenv/config';
import http from 'http';

const token = process.env.TG_BOT_TOKEN;
const rawUrl = process.env.MINI_APP_URL || 'https://dobroclub.online';
const webAppUrl = rawUrl.startsWith('https://') ? rawUrl : rawUrl.replace('http://', 'https://');
const PORT = process.env.PORT || 10000;

// START_BLOCK_CHECK_TOKEN
if (!token) throw new Error('TG_BOT_TOKEN is missing');
// END_BLOCK_CHECK_TOKEN

const bot = new Telegraf(token);

const dailyDeeds = [
  '🌱 *Идея:* Откажись от пластикового пакета сегодня.',
  '☕️ *Идея:* Угости кофе коллегу.',
  '📞 *Идея:* Позвони родителям.',
  '🚶‍♂️ *Идея:* Пройдись пешком лишние 10 минут.',
  '🐾 *Идея:* Погладь котика (если он не против).',
];

const authorsText = `👨‍💻 *Команда MAX Добро*

Мы создали этот проект, чтобы технологии помогали делать добрые дела проще и интереснее.

• Михаил Данилов ([GitHub](https://github.com/seaG7))
• Кирилл Корнилов ([GitHub](https://github.com/krl76))
• Шутов Кирилл ([GitHub](https://github.com/ShutovKS))

Сделано с любовью к коду и людям ❤️`;

const helpText = '🆘 *Помощь*\n\n' +
  'Я бот-проводник. Основной функционал находится в Мини-приложении.\n' +
  'Там ты найдешь карту событий, профиль волонтера и курсы.';

// START_BLOCK_SETUP_KEYBOARD
// START_CONTRACT: getPrivateMenuKeyboard
//   PURPOSE: Build the private-chat reply keyboard with web_app launch
//   INPUTS: { none }
//   OUTPUTS: { reply_markup - resize keyboard with launch, idea, authors, help }
//   SIDE_EFFECTS: none
//   LINKS: M-BOT-TELEGRAM, V-M-BOT-TELEGRAM
// END_CONTRACT: getPrivateMenuKeyboard
const getPrivateMenuKeyboard = () => {
  return {
    keyboard: [
      [
        {text: '🚀 Запустить MAX Добро', web_app: {url: webAppUrl}}
      ],
      [
        {text: '💡 Идея дела'},
        {text: '👨‍💻 Авторы'}
      ],
      [
        {text: '❓ Справка'}
      ]
    ],
    resize_keyboard: true,
    input_field_placeholder: 'Меню навигации 👇'
  };
};

// START_CONTRACT: getGroupKeyboard
//   PURPOSE: Build a group inline keyboard that deep-links to the bot
//   INPUTS: { botUsername: string - Telegram bot username }
//   OUTPUTS: { inline_keyboard - startapp URL button }
//   SIDE_EFFECTS: none
//   LINKS: M-BOT-TELEGRAM, V-M-BOT-TELEGRAM
// END_CONTRACT: getGroupKeyboard
const getGroupKeyboard = (botUsername: string) => {
  return {
    inline_keyboard: [
      [
        {text: '🚀 Запустить MAX Добро', url: `https://t.me/${botUsername}?startapp`}
      ]
    ]
  };
};

// START_CONTRACT: getStartInlineButton
//   PURPOSE: Build the private-chat web_app start button
//   INPUTS: { none }
//   OUTPUTS: { inline_keyboard - web_app launch button }
//   SIDE_EFFECTS: none
//   LINKS: M-BOT-TELEGRAM, V-M-BOT-TELEGRAM
// END_CONTRACT: getStartInlineButton
const getStartInlineButton = () => {
  return {
    inline_keyboard: [
      [
        {text: '🚀 Запустить MAX Добро', web_app: {url: webAppUrl}}
      ]
    ]
  };
};
// END_BLOCK_SETUP_KEYBOARD

// START_CONTRACT: replyWithMenu
//   PURPOSE: Reply with private or group menu markup
//   INPUTS: { ctx: Context; text: string; options?: object }
//   OUTPUTS: { Promise - Telegram reply }
//   SIDE_EFFECTS: sends a Telegram message
//   LINKS: M-BOT-TELEGRAM, V-M-BOT-TELEGRAM
// END_CONTRACT: replyWithMenu
const replyWithMenu = async (ctx: Context, text: string, options: any = {}) => {
  const isPrivate = ctx.chat?.type === 'private';

  if (isPrivate) {
    return ctx.reply(text, {
      parse_mode: 'Markdown',
      reply_markup: getPrivateMenuKeyboard(),
      ...options
    });
  }

  const botUsername = ctx.botInfo?.username || 'max_dobro_bot';

  return ctx.reply(text, {
    parse_mode: 'Markdown',
    reply_markup: getGroupKeyboard(botUsername),
    ...options
  });
};

// START_BLOCK_REGISTER_HANDLERS
bot.start(async (ctx) => {
  const userName = ctx.from?.first_name.replace(/[*_`\[\]]/g, '') || 'Герой';
  const isPrivate = ctx.chat?.type === 'private';

  await ctx.reply(
    `Привет, *${userName}*! 🌍\n\n` +
    `Добро пожаловать в *MAX Добро* (Telegram Edition).\n` +
    `Это экосистема добрых дел, волонтерства и саморазвития.`,
    {
      parse_mode: 'Markdown',
      reply_markup: isPrivate ? getStartInlineButton() : undefined
    }
  );

  if (isPrivate) {
    await ctx.reply('Жми кнопки ниже для навигации 👇', {
      reply_markup: getPrivateMenuKeyboard()
    });
  } else {
    const botUsername = ctx.botInfo?.username;
    await ctx.reply('Чтобы начать, нажмите кнопку ниже:', {
      reply_markup: getGroupKeyboard(botUsername)
    });
  }
});

bot.command('help', (ctx) => {
  replyWithMenu(ctx, helpText);
});

bot.command('authors', (ctx) => {
  replyWithMenu(ctx, authorsText, {link_preview_options: {is_disabled: true}});
});

bot.command('idea', (ctx) => {
  const randomDeed = dailyDeeds[Math.floor(Math.random() * dailyDeeds.length)];
  replyWithMenu(ctx, randomDeed);
});

bot.hears('💡 Идея дела', (ctx) => {
  const randomDeed = dailyDeeds[Math.floor(Math.random() * dailyDeeds.length)];
  replyWithMenu(ctx, randomDeed);
});

bot.hears('👨‍💻 Авторы', (ctx) => {
  replyWithMenu(ctx, authorsText, {link_preview_options: {is_disabled: true}});
});

bot.hears('❓ Справка', (ctx) => {
  replyWithMenu(ctx, helpText);
});

bot.on('message', (ctx: any) => {
  if (ctx.message.web_app_data) {
    ctx.reply(`Получены данные: ${ctx.message.web_app_data.data}`);
  }
});
// END_BLOCK_REGISTER_HANDLERS

// START_CONTRACT: startBot
//   PURPOSE: Register bot commands and launch the Telegram bot
//   INPUTS: { none }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: calls Telegram setMyCommands and bot.launch
//   LINKS: M-BOT-TELEGRAM, V-M-BOT-TELEGRAM
// END_CONTRACT: startBot
async function startBot() {
  try {
    // START_BLOCK_LAUNCH_WEBAPP
    await bot.telegram.setMyCommands([
      {command: 'start', description: '🔄 Перезапустить бота'},
      {command: 'idea', description: '💡 Идея доброго дела'},
      {command: 'authors', description: '👨‍💻 О разработчиках'},
      {command: 'help', description: '❓ Справка'}
    ]);
    console.log('✅ Команды обновлены');

    await bot.launch();
    console.log('🤖 Telegram Bot started');
    // END_BLOCK_LAUNCH_WEBAPP
  } catch (e) {
    console.error('Ошибка запуска:', e);
  }
}

startBot();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Telegram Bot is alive');
});

server.listen(PORT, () => {
  console.log(`Dummy server listening on port ${PORT}`);
});

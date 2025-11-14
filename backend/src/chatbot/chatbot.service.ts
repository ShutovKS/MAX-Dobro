import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot, Context, Keyboard } from '@maxhub/max-bot-api';

@Injectable()
export class ChatbotService implements OnModuleInit {
  private readonly logger = new Logger(ChatbotService.name);
  private readonly bot: Bot;
  private readonly miniAppUrl: string;

  constructor(private readonly configService: ConfigService) {
    const botToken = this.configService.getOrThrow<string>('MAX_BOT_TOKEN');
    this.miniAppUrl = this.configService.getOrThrow<string>('MINI_APP_URL');
    this.bot = new Bot(botToken);
  }

  onModuleInit() {
    this.registerHandlers();
    this.bot.start();
    this.logger.log('MAX Bot has started and is listening for updates.');
  }

  private registerHandlers(): void {
    this.bot.command('start', (ctx) => this.handleStartCommand(ctx));
  }

  private async handleStartCommand(ctx: Context): Promise<void> {
    const text =
      'Добро пожаловать в *«МАХ Добро»*! 👋\n\n' +
      'Это платформа для поиска волонтёрских возможностей, ' +
      'где каждый может найти доброе дело по душе.\n\n' +
      'Нажмите на кнопку ниже, чтобы начать.';

    const keyboard = Keyboard.inlineKeyboard([
      [Keyboard.button.link('🚀 Открыть приложение', this.miniAppUrl)],
    ]);

    try {
      await ctx.reply(text, {
        format: 'markdown',
        attachments: [keyboard],
      });
    } catch (error) {
      this.logger.error(
        `Failed to send start message to chat ${ctx.chat?.chat_id}`,
        error.message,
      );
    }
  }
}
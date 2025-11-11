import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { WebhookGuard } from '../auth/guards/webhook.guard';
import { SupabaseAuthPayloadDto } from './dto/supabase-payload.dto';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly authService: AuthService) {}

  @Post('supabase-auth')
  @UseGuards(WebhookGuard) // Защищаем эндпоинт нашим Guard'ом
  @HttpCode(200) // Отвечаем 200 OK, чтобы Supabase знал, что мы получили хук
  @ApiBearerAuth() // Указываем в Swagger, что нужен токен (наш секрет)
  @ApiOperation({ summary: 'Handles user creation webhook from Supabase' })
  async handleSupabaseAuthWebhook(
    @Body() payload: SupabaseAuthPayloadDto,
  ): Promise<{ received: boolean }> {
    // Мы реагируем только на событие создания нового пользователя
    if (payload.type === 'INSERT') {
      await this.authService.createLocalUserAfterSignUp(payload.record);
    }

    return { received: true };
  }
}
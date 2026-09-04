// src/webhooks/webhooks.controller.ts

import { Body, Controller, HttpCode, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { WebhookGuard } from '../auth/guards/webhook.guard';
// SupabaseAuthPayloadDto больше не нужен для валидации, но оставим для справки
// import { SupabaseAuthPayloadDto } from './dto/supabase-payload.dto';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  /** <context:backend_webhooks_controller> Webhook boundary for Supabase user provisioning events. </context:backend_webhooks_controller> */
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('supabase-auth')
  @UseGuards(WebhookGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Handles user creation webhook from Supabase' })
  async handleSupabaseAuthWebhook(
    @Body() payload: any, // <-- Изменяем DTO на any, чтобы пропустить валидацию
  ): Promise<{ received: boolean }> {
    this.logger.log('Received Supabase auth webhook payload:', JSON.stringify(payload, null, 2));

    // Мы реагируем только на событие создания нового пользователя
    if (payload.type === 'INSERT' && payload.table === 'users') {
      await this.authService.createLocalUserAfterSignUp(payload.record);
    } else {
      this.logger.log(`Webhook received but was not an INSERT on users table. Type: ${payload.type}, Table: ${payload.table}. Skipping.`);
    }

    return { received: true };
  }
}

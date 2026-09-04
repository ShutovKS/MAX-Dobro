// FILE: backend/src/webhooks/webhooks.controller.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: HTTP webhook boundary for Supabase user provisioning events.
//   SCOPE: POST /webhooks/supabase-auth guarded by WebhookGuard
//   DEPENDS: M-AUTH
//   LINKS: M-WEBHOOKS, V-M-WEBHOOKS, M-AUTH
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   WebhooksController - Supabase auth webhook receiver
//   handleSupabaseAuthWebhook - INSERT on users creates a local user
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Body, Controller, HttpCode, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { WebhookGuard } from '../auth/guards/webhook.guard';
// SupabaseAuthPayloadDto больше не нужен для валидации, но оставим для справки
// import { SupabaseAuthPayloadDto } from './dto/supabase-payload.dto';

// START_CONTRACT: WebhooksController
//   PURPOSE: Accept Supabase auth webhooks and provision local users on INSERT.
//   INPUTS: { authService: AuthService }
//   OUTPUTS: { POST supabase-auth -> { received: boolean } }
//   SIDE_EFFECTS: may create/update local User via AuthService
//   LINKS: M-WEBHOOKS, V-M-WEBHOOKS, M-AUTH
// END_CONTRACT: WebhooksController
@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly authService: AuthService) {}

  // START_BLOCK_HANDLE_SUPABASE_AUTH
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
  // END_BLOCK_HANDLE_SUPABASE_AUTH
}

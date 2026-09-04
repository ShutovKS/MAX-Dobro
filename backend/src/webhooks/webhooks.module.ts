// FILE: backend/src/webhooks/webhooks.module.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Nest module wiring the Supabase auth webhook controller and guard.
//   SCOPE: AuthModule import, WebhooksController, AuthService, WebhookGuard
//   DEPENDS: M-AUTH
//   LINKS: M-WEBHOOKS, V-M-WEBHOOKS, M-AUTH
//   ROLE: BARREL
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   WebhooksModule - webhook controller plus AuthService and WebhookGuard
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WebhookGuard } from '../auth/guards/webhook.guard';
import { AuthService } from '../auth/auth.service';
import { WebhooksController } from './webhooks.controller';

// START_CONTRACT: WebhooksModule
//   PURPOSE: Register webhook HTTP surface and its auth dependencies.
//   INPUTS: { none }
//   OUTPUTS: { Nest module metadata - imports, controllers, providers }
//   SIDE_EFFECTS: none
//   LINKS: M-WEBHOOKS, V-M-WEBHOOKS, M-AUTH
// END_CONTRACT: WebhooksModule
@Module({
  // START_BLOCK_WEBHOOK_PROVIDERS
  imports: [AuthModule],
  controllers: [WebhooksController],
  providers: [AuthService, WebhookGuard], // Регистрируем Guard и Service
  // END_BLOCK_WEBHOOK_PROVIDERS
})
export class WebhooksModule {}

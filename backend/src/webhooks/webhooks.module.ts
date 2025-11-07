import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WebhookGuard } from '../auth/guards/webhook.guard';
import { AuthService } from '../auth/auth.service';
import { WebhooksController } from './webhooks.controller';

@Module({
  imports: [AuthModule],
  controllers: [WebhooksController],
  providers: [AuthService, WebhookGuard], // Регистрируем Guard и Service
})
export class WebhooksModule {}
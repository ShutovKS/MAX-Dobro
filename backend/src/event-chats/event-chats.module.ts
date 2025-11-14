import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { EventChatsController } from './event-chats.controller';
import { EventChatsService } from './event-chats.service';

@Module({
  imports: [SupabaseModule],
  controllers: [EventChatsController],
  providers: [EventChatsService],
})
export class EventChatsModule {}
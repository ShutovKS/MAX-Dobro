import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { AssistantChatController } from './assistant-chat.controller';
import { AssistantChatService } from './assistant-chat.service';

@Module({
  imports: [SupabaseModule],
  controllers: [AssistantChatController],
  providers: [AssistantChatService],
})
export class AssistantChatModule {}
import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [SupabaseModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
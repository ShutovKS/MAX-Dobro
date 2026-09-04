// FILE: backend/src/assistant-chat/assistant-chat.module.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Nest barrel that wires assistant-chat HTTP and persistence providers.
//   SCOPE: Import SupabaseModule; register AssistantChatController and AssistantChatService
//   DEPENDS: M-PRISMA, M-AUTH, M-SUPABASE
//   LINKS: M-ASSISTANT-CHAT, V-M-ASSISTANT-CHAT
//   ROLE: BARREL
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   AssistantChatModule - registers assistant-chat controller and service
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

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

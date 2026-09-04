// FILE: backend/src/event-chats/event-chats.module.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Nest barrel that wires event-chat HTTP and persistence providers.
//   SCOPE: Import SupabaseModule; register EventChatsController and EventChatsService
//   DEPENDS: M-PRISMA, M-AUTH, M-SUPABASE
//   LINKS: M-EVENT-CHATS, V-M-EVENT-CHATS
//   ROLE: BARREL
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   EventChatsModule - registers event-chat controller and service
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

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

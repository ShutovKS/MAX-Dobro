// FILE: backend/src/events/events.module.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Nest barrel that wires EventsController and EventsService with auth, storage, and completion tasks.
//   SCOPE: module imports, controller/provider registration, EventsService export
//   DEPENDS: M-AUTH, M-SUPABASE, M-TASKS
//   LINKS: M-EVENTS, V-M-EVENTS
//   ROLE: BARREL
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   EventsModule - registers EventsController/EventsService and exports EventsService
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { TasksModule } from '../tasks/tasks.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [AuthModule, SupabaseModule, TasksModule],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
// START_CONTRACT: EventsModule
//   PURPOSE: Compose the events Nest module graph
//   INPUTS: { AuthModule, SupabaseModule, TasksModule, EventsController, EventsService }
//   OUTPUTS: { EventsModule - injectable EventsService for other domains }
//   SIDE_EFFECTS: none
//   LINKS: M-EVENTS, V-M-EVENTS, M-AUTH, M-TASKS
// END_CONTRACT: EventsModule
export class EventsModule {}

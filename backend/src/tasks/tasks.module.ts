// FILE: backend/src/tasks/tasks.module.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Nest module that registers scheduled event-completion tasks.
//   SCOPE: AchievementsModule import, TasksService provider and export
//   DEPENDS: M-TASKS
//   LINKS: M-TASKS, V-M-TASKS, M-PRISMA
//   ROLE: BARREL
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   TasksModule - TasksService plus AchievementsModule barrel
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Module } from '@nestjs/common';
import { AchievementsModule } from '../achievements/achievements.module';
import { TasksService } from './tasks.service';

// START_CONTRACT: TasksModule
//   PURPOSE: Wire TasksService for event completion scheduling.
//   INPUTS: { none }
//   OUTPUTS: { Nest module metadata - imports, providers, exports }
//   SIDE_EFFECTS: none
//   LINKS: M-TASKS, V-M-TASKS
// END_CONTRACT: TasksModule
@Module({
  // START_BLOCK_TASKS_PROVIDERS
  imports: [AchievementsModule],
  providers: [TasksService],
  exports: [TasksService],
  // END_BLOCK_TASKS_PROVIDERS
})
export class TasksModule {}

// FILE: backend/src/achievements/achievements.module.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Nest barrel that wires AchievementsController and AchievementsService.
//   SCOPE: controller/provider registration and AchievementsService export
//   DEPENDS: none
//   LINKS: M-ACHIEVEMENTS, V-M-ACHIEVEMENTS
//   ROLE: BARREL
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   AchievementsModule - registers AchievementsController/Service and exports AchievementsService
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Module } from '@nestjs/common';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';

@Module({
  controllers: [AchievementsController],
  providers: [AchievementsService],
  exports: [AchievementsService],
})
// START_CONTRACT: AchievementsModule
//   PURPOSE: Compose the achievements Nest module graph
//   INPUTS: { AchievementsController, AchievementsService }
//   OUTPUTS: { AchievementsModule - injectable AchievementsService }
//   SIDE_EFFECTS: none
//   LINKS: M-ACHIEVEMENTS, V-M-ACHIEVEMENTS
// END_CONTRACT: AchievementsModule
export class AchievementsModule {}

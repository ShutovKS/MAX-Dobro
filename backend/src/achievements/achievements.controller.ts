// FILE: backend/src/achievements/achievements.controller.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: REST /achievements catalog listing.
//   SCOPE: GET all achievements
//   DEPENDS: none
//   LINKS: M-ACHIEVEMENTS, V-M-ACHIEVEMENTS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   AchievementsController - REST /achievements
//   findAll - GET /achievements
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AchievementsService } from './achievements.service';
import { AchievementEntity } from './entities/achievement.entity';

@ApiTags('Achievements')
@Controller('achievements')
// START_CONTRACT: AchievementsController
//   PURPOSE: HTTP adapter for the achievement catalog
//   INPUTS: { AchievementsService }
//   OUTPUTS: { AchievementEntity[] }
//   SIDE_EFFECTS: none beyond AchievementsService.findAll
//   LINKS: M-ACHIEVEMENTS, V-M-ACHIEVEMENTS
// END_CONTRACT: AchievementsController
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  // START_BLOCK_LIST_ACHIEVEMENTS
  @Get()
  @ApiOperation({ summary: 'Get a list of all possible achievements' })
  @ApiResponse({
    status: 200,
    description: 'List of all achievements.',
    type: [AchievementEntity],
  })
  findAll() {
    return this.achievementsService.findAll();
  }
  // END_BLOCK_LIST_ACHIEVEMENTS
}

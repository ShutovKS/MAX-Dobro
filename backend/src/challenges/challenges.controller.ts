// FILE: backend/src/challenges/challenges.controller.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Authenticated HTTP API for the weekly volunteer challenge.
//   SCOPE: GET /challenge/weekly
//   DEPENDS: M-PRISMA, M-AUTH
//   LINKS: M-CHALLENGES, V-M-CHALLENGES, class-ChallengesService
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   ChallengesController - weekly challenge endpoint
//   getWeeklyChallenge - current user's weekly challenge payload
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ChallengesService } from './challenges.service';

// START_CONTRACT: ChallengesController
//   PURPOSE: Expose authenticated weekly-challenge HTTP route
//   INPUTS: { user: User }
//   OUTPUTS: { Challenge | null }
//   SIDE_EFFECTS: none at controller layer
//   LINKS: M-CHALLENGES, V-M-CHALLENGES, fn-getWeeklyChallenge
// END_CONTRACT: ChallengesController
@ApiTags('Challenges')
@Controller('challenge')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  // START_CONTRACT: getWeeklyChallenge
  //   PURPOSE: Return the active weekly challenge for the current user
  //   INPUTS: { user: User }
  //   OUTPUTS: { Promise<Challenge | null> }
  //   SIDE_EFFECTS: none
  //   LINKS: M-CHALLENGES, BLOCK_WEEKLY_CHALLENGE
  // END_CONTRACT: getWeeklyChallenge
  @Get('weekly')
  @ApiOperation({ summary: 'Get the weekly challenge' })
  getWeeklyChallenge(@CurrentUser() user: User) {
    return this.challengesService.findWeekly(user.id);
  }
}

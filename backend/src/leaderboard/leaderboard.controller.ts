// FILE: backend/src/leaderboard/leaderboard.controller.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Authenticated HTTP API for volunteer karma/hours ranking.
//   SCOPE: GET /leaderboard
//   DEPENDS: M-PRISMA, M-AUTH
//   LINKS: M-LEADERBOARD, V-M-LEADERBOARD, class-LeaderboardService
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   LeaderboardController - ranked volunteer list endpoint
//   getLeaderboard - query-period ranking for current user context
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { LeaderboardQueryDto } from './dto/leaderboard-query.dto';
import { LeaderboardResponseEntity } from './entities//leaderboard-response.entity';
import { LeaderboardService } from './leaderboard.service';

// START_CONTRACT: LeaderboardController
//   PURPOSE: Expose authenticated leaderboard HTTP route
//   INPUTS: { query: LeaderboardQueryDto, user: User }
//   OUTPUTS: { LeaderboardResponseEntity }
//   SIDE_EFFECTS: none at controller layer
//   LINKS: M-LEADERBOARD, V-M-LEADERBOARD, fn-getLeaderboard
// END_CONTRACT: LeaderboardController
@ApiTags('Leaderboard')
@Controller('leaderboard')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  // START_CONTRACT: getLeaderboard
  //   PURPOSE: Return top users and current user rank for a period
  //   INPUTS: { query: LeaderboardQueryDto, user: User }
  //   OUTPUTS: { Promise<LeaderboardResponseEntity> }
  //   SIDE_EFFECTS: none
  //   LINKS: M-LEADERBOARD, BLOCK_RANK_USERS
  // END_CONTRACT: getLeaderboard
  @Get()
  @ApiOperation({ summary: 'Get the user leaderboard' })
  @ApiResponse({
    status: 200,
    description: 'A list of top users and current user position.',
    type: LeaderboardResponseEntity,
  })
  getLeaderboard(
    @Query() query: LeaderboardQueryDto,
    @CurrentUser() user: User,
  ) {
    return this.leaderboardService.getLeaderboard(query, user);
  }
}

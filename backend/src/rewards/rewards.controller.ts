// FILE: backend/src/rewards/rewards.controller.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: REST /rewards catalog listing and karma purchases.
//   SCOPE: list rewards with optional isPurchased, purchase by id
//   DEPENDS: M-AUTH
//   LINKS: M-REWARDS, V-M-REWARDS, M-AUTH
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   RewardsController - REST /rewards
//   findAll - GET /rewards
//   purchase - POST /rewards/:id/purchase
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';
import { RewardEntity } from './entities/reward.entity';
import { RewardsService } from './rewards.service';

@ApiTags('Rewards')
@Controller('rewards')
// START_CONTRACT: RewardsController
//   PURPOSE: HTTP adapter for karma shop catalog and purchases
//   INPUTS: { RewardsService, User }
//   OUTPUTS: { RewardEntity[], UserReward }
//   SIDE_EFFECTS: none beyond RewardsService calls
//   LINKS: M-REWARDS, V-M-REWARDS, M-AUTH
// END_CONTRACT: RewardsController
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  // START_BLOCK_LIST_REWARDS
  @Get()
  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a list of all available rewards' })
  @ApiResponse({
    status: 200,
    description: 'A list of rewards.',
    type: [RewardEntity],
  })
  findAll(@CurrentUser() user?: User) {
    return this.rewardsService.findAll(user?.id);
  }
  // END_BLOCK_LIST_REWARDS

  // START_BLOCK_PURCHASE_REWARD
  @Post(':id/purchase')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Purchase a reward' })
  @ApiResponse({ status: 201, description: 'Reward purchased successfully.' })
  purchase(
    @Param('id', ParseIntPipe) rewardId: number,
    @CurrentUser() user: User,
  ) {
    return this.rewardsService.purchase(rewardId, user.id);
  }
  // END_BLOCK_PURCHASE_REWARD
}

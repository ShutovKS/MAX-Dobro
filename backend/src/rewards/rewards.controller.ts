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
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

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
}
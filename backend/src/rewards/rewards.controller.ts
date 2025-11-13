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
import { RewardEntity } from './dto/reward.entity';
import { RewardsService } from './rewards.service';

@ApiTags('Rewards')
@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of all available rewards' })
  @ApiResponse({
    status: 200,
    description: 'A list of rewards.',
    type: [RewardEntity],
  })
  findAll() {
    return this.rewardsService.findAll();
  }

  @Post(':id/purchase')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Purchase a reward' })
  @ApiResponse({ status: 201, description: 'Reward purchased successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Insufficient karma points.' })
  @ApiResponse({ status: 404, description: 'Reward not found.' })
  purchase(
    @Param('id', ParseIntPipe) rewardId: number,
    @CurrentUser() user: User,
  ) {
    return this.rewardsService.purchase(rewardId, user.id);
  }
}
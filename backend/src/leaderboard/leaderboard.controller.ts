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
import { LeaderboardResponseEntity } from './dto/leaderboard-response.entity';
import { LeaderboardService } from './leaderboard.service';

@ApiTags('Leaderboard')
@Controller('leaderboard')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

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
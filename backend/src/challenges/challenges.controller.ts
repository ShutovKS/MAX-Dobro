import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ChallengesService } from './challenges.service';

@ApiTags('Challenges')
@Controller('challenge')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get('weekly')
  @ApiOperation({ summary: 'Get the weekly challenge' })
  getWeeklyChallenge(@CurrentUser() user: User) {
    return this.challengesService.findWeekly(user.id);
  }
}
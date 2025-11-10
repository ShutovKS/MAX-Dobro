import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AchievementsService } from './achievements.service';
import { AchievementEntity } from './dto/achievement.entity';

@ApiTags('Achievements')
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

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
}
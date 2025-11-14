import { ApiProperty } from '@nestjs/swagger';
import { UserAchievement } from '@prisma/client';
import { AchievementEntity } from '../../achievements/dto/achievement.entity';

export class UserAchievementEntity implements UserAchievement {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  achievementId: number;

  @ApiProperty()
  unlockedAt: Date;

  @ApiProperty({ type: () => AchievementEntity })
  achievement: AchievementEntity;
}
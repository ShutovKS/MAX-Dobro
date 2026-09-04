// FILE: backend/src/auth/entities/user-achievement.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for a user's unlocked achievement join row.
//   SCOPE: userId, achievementId, unlockedAt, nested achievement
//   DEPENDS: none
//   LINKS: M-AUTH, V-M-AUTH
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   UserAchievementEntity - user-achievement join with nested AchievementEntity
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty } from '@nestjs/swagger';
import { UserAchievement } from '@prisma/client';
import { AchievementEntity } from '../../achievements/entities/achievement.entity';

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

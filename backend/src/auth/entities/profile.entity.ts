// FILE: backend/src/auth/entities/profile.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for the current-user profile response.
//   SCOPE: user fields minus messenger IDs, plus achievements, level, progress
//   DEPENDS: none
//   LINKS: M-AUTH, V-M-AUTH
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   ProfileEntity - profile DTO with stats and level
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserAchievementEntity } from './user-achievement.entity';

export class ProfileEntity
  implements
    Omit<
      User,
      | 'supabaseUserId'
      | 'maxUserId'
      | 'telegramUserId'
      | 'firstName'
      | 'lastName'
    >
{
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false, nullable: true })
  firstName: string | null;

  @ApiProperty({ required: false, nullable: true })
  lastName: string | null;
  
  @ApiProperty({ example: 'volunteer' })
  role: string;

  @ApiProperty({ required: false, nullable: true })
  avatarUrl: string | null;

  @ApiProperty({ required: false, nullable: true })
  about: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ default: 0 })
  totalHours: number;

  @ApiProperty({ default: 0 })
  karmaPoints: number;

  @ApiProperty({ required: false, nullable: true })
  organizationId: number | null;

  @ApiProperty({ type: [UserAchievementEntity] })
  achievements: UserAchievementEntity[];

  @ApiProperty({ example: 'Новичок' })
  level: string;

  @ApiProperty({ example: 0.25 })
  progress: number;

  @ApiProperty({ example: 'Активист', nullable: true })
  nextLevel: string | null;
}

// FILE: backend/src/achievements/entities/achievement.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for an achievement catalog row.
//   SCOPE: id, name, description, icon, criteriaType, criteriaValue, createdAt
//   DEPENDS: none
//   LINKS: M-ACHIEVEMENTS, V-M-ACHIEVEMENTS
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   AchievementEntity - Prisma Achievement shape for OpenAPI
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty } from '@nestjs/swagger';
import { Achievement } from '@prisma/client';

export class AchievementEntity implements Achievement {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ required: false, nullable: true })
  icon: string | null;

  @ApiProperty()
  criteriaType: string;

  @ApiProperty()
  criteriaValue: number;

  @ApiProperty()
  createdAt: Date;
}

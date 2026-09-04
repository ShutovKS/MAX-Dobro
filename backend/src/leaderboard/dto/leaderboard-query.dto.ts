// FILE: backend/src/leaderboard/dto/leaderboard-query.dto.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Validate leaderboard period and limit query params.
//   SCOPE: Optional LeaderboardPeriod enum and bounded limit
//   DEPENDS: M-LEADERBOARD
//   LINKS: M-LEADERBOARD, V-M-LEADERBOARD, type-LeaderboardQueryDto
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   LeaderboardPeriod - allTime | month | week ranking window
//   LeaderboardQueryDto - optional period and limit query
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum LeaderboardPeriod {
  ALL_TIME = 'allTime',
  MONTH = 'month',
  WEEK = 'week',
}

export class LeaderboardQueryDto {
  @ApiPropertyOptional({
    description: 'The time period for the leaderboard',
    enum: LeaderboardPeriod,
    default: LeaderboardPeriod.ALL_TIME,
  })
  @IsOptional()
  @IsEnum(LeaderboardPeriod)
  period?: LeaderboardPeriod = LeaderboardPeriod.ALL_TIME;

  @ApiPropertyOptional({
    description: 'Number of users to return',
    default: 50,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;
}

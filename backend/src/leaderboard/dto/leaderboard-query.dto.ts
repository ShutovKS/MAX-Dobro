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
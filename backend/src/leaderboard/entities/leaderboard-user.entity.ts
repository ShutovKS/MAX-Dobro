// FILE: backend/src/leaderboard/entities/leaderboard-user.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for one ranked volunteer row.
//   SCOPE: rank, id, name, avatarUrl, karma
//   DEPENDS: M-LEADERBOARD
//   LINKS: M-LEADERBOARD, V-M-LEADERBOARD, type-LeaderboardUserEntity
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   LeaderboardUserEntity - ranked volunteer display row
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardUserEntity {
  @ApiProperty({ description: "User's rank in the leaderboard" })
  rank: number;

  @ApiProperty({ description: "User's unique identifier" })
  id: number;

  @ApiProperty({ description: "User's name", required: false, nullable: true })
  name: string | null;

  @ApiProperty({
    description: "User's avatar URL",
    required: false,
    nullable: true,
  })
  avatarUrl: string | null;

  @ApiProperty({ description: "User's total karma points" })
  karma: number;
}

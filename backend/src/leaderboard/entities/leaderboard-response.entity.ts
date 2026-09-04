// FILE: backend/src/leaderboard/entities/leaderboard-response.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for ranked volunteer lists plus current-user rank.
//   SCOPE: topUsers array and nullable currentUser
//   DEPENDS: M-LEADERBOARD
//   LINKS: M-LEADERBOARD, V-M-LEADERBOARD, type-LeaderboardResponseEntity
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   LeaderboardResponseEntity - top users plus current user rank payload
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty } from '@nestjs/swagger';
import { LeaderboardUserEntity } from './leaderboard-user.entity';

export class LeaderboardResponseEntity {
  @ApiProperty({
    type: [LeaderboardUserEntity],
    description: 'List of top users.',
  })
  topUsers: LeaderboardUserEntity[];

  @ApiProperty({
    type: LeaderboardUserEntity,
    description: 'Current user position if they are in the leaderboard.',
    nullable: true,
  })
  currentUser: LeaderboardUserEntity | null;
}

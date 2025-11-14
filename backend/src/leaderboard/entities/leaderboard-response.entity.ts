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
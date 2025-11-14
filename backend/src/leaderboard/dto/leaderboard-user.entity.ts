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
  karmaPoints: number;
}
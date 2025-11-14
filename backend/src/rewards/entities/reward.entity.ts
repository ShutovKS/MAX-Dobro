import { ApiProperty } from '@nestjs/swagger';
import { Reward } from '@prisma/client';

export class RewardEntity implements Reward {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ required: false, nullable: true })
  icon: string | null;

  @ApiProperty({ description: 'Cost in karma points' })
  cost: number;
}
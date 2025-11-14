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
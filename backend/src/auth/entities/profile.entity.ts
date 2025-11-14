import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserAchievementEntity } from './user-achievement.entity';

export class ProfileEntity implements Omit<User, 'supabaseUserId'> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false, nullable: true })
  name: string | null;

  @ApiProperty({ required: false, nullable: true })
  avatarUrl: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ default: 0 })
  totalHours: number;

  @ApiProperty({ default: 0 })
  karmaPoints: number;

  @ApiProperty({ type: [UserAchievementEntity] })
  achievements: UserAchievementEntity[];

  @ApiProperty({ example: 'Новичок', description: 'User level name' })
  levelName: string;
}
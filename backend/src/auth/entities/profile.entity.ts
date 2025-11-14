// src/auth/entities/profile.entity.ts

import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserAchievementEntity } from './user-achievement.entity';

export class ProfileEntity
  implements Omit<User, 'supabaseUserId' | 'name' | 'about'>
{
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false, nullable: true })
  firstName: string | null;

  @ApiProperty({ required: false, nullable: true })
  lastName: string | null;
  
  @ApiProperty({ example: 'volunteer' })
  role: string;

  @ApiProperty({ required: false, nullable: true })
  avatarUrl: string | null;

  @ApiProperty({ required: false, nullable: true })
  about: string | null;

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

  @ApiProperty({ example: 'Новичок' })
  level: string;

  @ApiProperty({ example: 0.25 })
  progress: number;

  @ApiProperty({ example: 'Активист', nullable: true })
  nextLevel: string | null;
}
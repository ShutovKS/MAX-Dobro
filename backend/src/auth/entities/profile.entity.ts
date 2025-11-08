import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class ProfileEntity implements Omit<User, 'supabaseUserId'> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false, nullable: true })
  name: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ default: 0 })
  totalHours: number;

  @ApiProperty({ default: 0 })
  karmaPoints: number;
}
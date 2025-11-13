import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class PublicUserEntity implements Pick<User, 'id' | 'name'> {
  @ApiProperty()
  id: number;

  @ApiProperty({ required: false, nullable: true })
  name: string | null;
}
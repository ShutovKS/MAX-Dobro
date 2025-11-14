import { ApiProperty } from '@nestjs/swagger';

export class PublicUserEntity {
  @ApiProperty()
  id: number;

  @ApiProperty({ required: false, nullable: true })
  name: string | null;
}
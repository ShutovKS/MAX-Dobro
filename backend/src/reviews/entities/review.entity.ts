import { ApiProperty } from '@nestjs/swagger';
import { PublicUserEntity } from '../../users/entities/public-user.entity';

export class ReviewEntity {
  @ApiProperty()
  id: number;

  @ApiProperty({ minimum: 1, maximum: 5 })
  rating: number;

  @ApiProperty({ required: false, nullable: true })
  text: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => PublicUserEntity })
  author: PublicUserEntity;
}
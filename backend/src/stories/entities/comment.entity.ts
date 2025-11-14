import { ApiProperty } from '@nestjs/swagger';
import { PublicUserEntity } from '../../users/entities/public-user.entity';

export class CommentEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => PublicUserEntity })
  author: PublicUserEntity;
}
import { ApiProperty } from '@nestjs/swagger';
import { PublicUserEntity } from '../../users/entities/public-user.entity';

export class EventChatMessageEntity {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: () => PublicUserEntity })
  author: PublicUserEntity;

  @ApiProperty()
  text: string;

  @ApiProperty()
  timestamp: string;
}
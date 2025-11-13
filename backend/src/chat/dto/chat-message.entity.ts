import { ApiProperty } from '@nestjs/swagger';
import { ChatMessage } from '@prisma/client';
import { PublicUserEntity } from '../../users/entities/public-user.entity';

export class ChatMessageEntity implements ChatMessage {
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  content: string;
  
  @ApiProperty()
  createdAt: Date;
  
  @ApiProperty()
  chatId: number;
  
  @ApiProperty()
  authorId: number;
  
  @ApiProperty({ type: () => PublicUserEntity })
  author: PublicUserEntity;
}
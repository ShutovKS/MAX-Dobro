import { ApiProperty } from '@nestjs/swagger';
import { PublicUserEntity } from '../../users/entities/public-user.entity';
import { ChatMessagePreviewEntity } from './chat-message-preview.entity';

export class ChatListItemEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    description: 'The other participant in the chat',
    type: () => PublicUserEntity,
  })
  recipient: PublicUserEntity;

  @ApiProperty({
    description: 'The last message sent in the chat',
    type: () => ChatMessagePreviewEntity,
    nullable: true,
  })
  lastMessage: ChatMessagePreviewEntity | null;
}
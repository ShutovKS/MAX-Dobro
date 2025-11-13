import { ApiProperty } from '@nestjs/swagger';
import { ChatMessage } from '@prisma/client';

export class ChatMessagePreviewEntity implements Pick<ChatMessage, 'content' | 'createdAt'> {
  @ApiProperty()
  content: string;
  @ApiProperty()
  createdAt: Date;
}
import { ApiProperty } from '@nestjs/swagger';

export class EventChatEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  eventId: number;

  @ApiProperty()
  eventTitle: string;

  @ApiProperty()
  lastMessage: string;

  @ApiProperty()
  timestamp: string;

  @ApiProperty({ default: 0 })
  unreadCount: number;

  @ApiProperty({ default: false })
  isArchived: boolean;
}
// FILE: backend/src/event-chats/entities/event-chat.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for a volunteer's event chat list row.
//   SCOPE: Chat id, event title, last message, timestamp, unread, archive flag
//   DEPENDS: M-EVENT-CHATS
//   LINKS: M-EVENT-CHATS, V-M-EVENT-CHATS, type-EventChatEntity
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   EventChatEntity - event chat inbox row
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

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

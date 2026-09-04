// FILE: backend/src/event-chats/entities/event-chat-message.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for one event-scoped chat message.
//   SCOPE: Message id, author, text, timestamp
//   DEPENDS: M-EVENT-CHATS, M-USERS
//   LINKS: M-EVENT-CHATS, V-M-EVENT-CHATS, type-EventChatMessageEntity
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   EventChatMessageEntity - mapped event chat message with public author
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

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

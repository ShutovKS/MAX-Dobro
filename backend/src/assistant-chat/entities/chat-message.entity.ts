// FILE: backend/src/assistant-chat/entities/chat-message.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for assistant conversation messages.
//   SCOPE: Message identity, sender, type, optional event/course/suggestion payload
//   DEPENDS: M-ASSISTANT-CHAT, M-EVENTS, M-LEARNING
//   LINKS: M-ASSISTANT-CHAT, V-M-ASSISTANT-CHAT, type-ChatMessageEntity
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   ChatMessageEntity - mapped assistant or user chat message
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourseEntity } from '../../learning/entities/course.entity';
import { EventEntity } from '../../events/entities/event.entity';

export class ChatMessageEntity {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional({ description: 'The main text content of the message' })
  text?: string;

  @ApiProperty({ enum: ['user', 'assistant'] })
  sender: 'user' | 'assistant';

  @ApiProperty({
    enum: ['text', 'event-card', 'course-card', 'suggestion-chips', 'loading'],
  })
  type: string;

  @ApiPropertyOptional({
    description: 'Event data, if the message type is "event-card"',
    type: () => EventEntity,
  })
  event?: EventEntity;

  @ApiPropertyOptional({
    description: 'Course data, if the message type is "course-card"',
    type: () => CourseEntity,
  })
  course?: CourseEntity;

  @ApiPropertyOptional({
    description: 'A list of suggestions, if the message type is "suggestion-chips"',
    type: [String],
  })
  suggestions?: string[];
}

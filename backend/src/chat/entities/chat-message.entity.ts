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
// src/events/entities/event.entity.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Event } from '@prisma/client';

// Вспомогательный класс для Swagger
class EventCount {
  @ApiProperty()
  participants: number;
}

export class EventEntity implements Event {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  date: Date;

  @ApiProperty({ required: false, nullable: true })
  location: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Maximum number of participants. Null means unlimited.',
  })
  maxParticipants: number | null;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Duration of the event in hours.',
  })
  durationHours: number | null;

  @ApiProperty({
    description: 'Status of the event (e.g., PLANNED, COMPLETED)',
    example: 'PLANNED',
  })
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  organizationId: number;

  @ApiPropertyOptional({ type: EventCount })
  _count?: EventCount;
}
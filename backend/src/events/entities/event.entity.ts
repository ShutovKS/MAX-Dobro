import { ApiProperty } from '@nestjs/swagger';
import { Event } from '@prisma/client';

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
  maxParticipants: number | null; // <-- Добавь это поле

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  organizationId: number;
}
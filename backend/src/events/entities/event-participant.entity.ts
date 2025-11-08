import { ApiProperty } from '@nestjs/swagger';
import { EventParticipant } from '@prisma/client';

export class EventParticipantEntity implements EventParticipant {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  eventId: number;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty()
  createdAt: Date;
}
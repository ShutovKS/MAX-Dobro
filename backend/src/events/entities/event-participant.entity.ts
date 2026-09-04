// FILE: backend/src/events/entities/event-participant.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for an EventParticipant join row.
//   SCOPE: userId, eventId, status, createdAt
//   DEPENDS: none
//   LINKS: M-EVENTS, V-M-EVENTS
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   EventParticipantEntity - Prisma EventParticipant shape for OpenAPI
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

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

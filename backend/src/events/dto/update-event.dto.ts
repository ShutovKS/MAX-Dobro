// FILE: backend/src/events/dto/update-event.dto.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Partial create-event payload for PATCH /events/:id.
//   SCOPE: all CreateEventDto fields made optional via PartialType
//   DEPENDS: none
//   LINKS: M-EVENTS, V-M-EVENTS
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   UpdateEventDto - PartialType of CreateEventDto
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}

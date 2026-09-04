// FILE: backend/src/auth/entities/user-events.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for the current user's upcoming and past events.
//   SCOPE: upcoming and past EventEntity arrays
//   DEPENDS: none
//   LINKS: M-AUTH, V-M-AUTH
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   UserEventsEntity - upcoming and past event lists
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty } from '@nestjs/swagger';
import { EventEntity } from '../../events/entities/event.entity';

export class UserEventsEntity {
    
    @ApiProperty({ type: [EventEntity] })
    upcoming: EventEntity[];

    @ApiProperty({ type: [EventEntity] })
    past: EventEntity[];
}

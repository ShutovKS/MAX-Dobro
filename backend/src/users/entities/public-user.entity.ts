// FILE: backend/src/users/entities/public-user.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for a public, non-sensitive user projection.
//   SCOPE: id and optional name fields
//   DEPENDS: none
//   LINKS: M-USERS, V-M-USERS
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   PublicUserEntity - public id and name
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty } from '@nestjs/swagger';

export class PublicUserEntity {
  @ApiProperty()
  id: number;

  @ApiProperty({ required: false, nullable: true })
  name: string | null;
}

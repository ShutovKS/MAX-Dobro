// FILE: backend/src/organizations/entities/organization-stat.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for one organizer dashboard statistic tile.
//   SCOPE: id, label, value, change
//   DEPENDS: none
//   LINKS: M-ORGANIZATIONS, V-M-ORGANIZATIONS
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   OrganizationStatEntity - dashboard tile with label, formatted value, and change
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty } from '@nestjs/swagger';

export class OrganizationStatEntity {
  @ApiProperty({ example: 'total_participants' })
  id: string;

  @ApiProperty({ example: 'Всего участников' })
  label: string;

  @ApiProperty({ example: '1,234' })
  value: string;

  @ApiProperty({ example: '+15%' })
  change: string;
}

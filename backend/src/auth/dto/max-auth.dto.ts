// FILE: backend/src/auth/dto/max-auth.dto.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Validation DTO for MAX Mini App initData login.
//   SCOPE: required initData string
//   DEPENDS: none
//   LINKS: M-AUTH, V-M-AUTH
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   MaxAuthDto - MAX WebApp initData payload
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MaxAuthDto {
  @ApiProperty({
    description: 'The `initData` string from `window.WebApp.initData`',
    example: 'query_id=...&user=...&auth_date=...&hash=...',
  })
  @IsString()
  @IsNotEmpty()
  initData: string;
}

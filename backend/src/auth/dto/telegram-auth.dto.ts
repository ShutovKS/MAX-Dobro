// FILE: backend/src/auth/dto/telegram-auth.dto.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Validation DTO for Telegram Mini App initData login.
//   SCOPE: required initData string
//   DEPENDS: none
//   LINKS: M-AUTH, V-M-AUTH
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   TelegramAuthDto - Telegram WebApp initData payload
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TelegramAuthDto {
  @ApiProperty({
    description: 'The `initData` string from `window.Telegram.WebApp.initData`',
    example: 'query_id=...&user=...&auth_date=...&hash=...',
  })
  @IsString()
  @IsNotEmpty()
  initData: string;
}

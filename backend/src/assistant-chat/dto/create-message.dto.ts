// FILE: backend/src/assistant-chat/dto/create-message.dto.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Validate assistant-chat message create payloads.
//   SCOPE: Required non-empty text field
//   DEPENDS: M-ASSISTANT-CHAT
//   LINKS: M-ASSISTANT-CHAT, V-M-ASSISTANT-CHAT, type-CreateMessageDto
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   CreateMessageDto - inbound assistant message text
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'Расскажи о ближайших событиях' })
  @IsString()
  @IsNotEmpty()
  text: string;
}

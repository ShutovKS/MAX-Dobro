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

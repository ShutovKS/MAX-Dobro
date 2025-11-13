import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'Это мое новое сообщение!' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
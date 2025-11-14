import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'Расскажи о ближайших событиях' })
  @IsString()
  @IsNotEmpty()
  text: string;
}
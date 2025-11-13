import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    description: 'The ID of the user to start a chat with',
    example: 2,
  })
  @IsInt()
  @IsNotEmpty()
  recipientId: number;
}
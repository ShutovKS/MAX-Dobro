import { ApiProperty } from '@nestjs/swagger';

export class QuizAnswerEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  answer: string;
}
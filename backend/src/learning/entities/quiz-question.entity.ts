import { ApiProperty } from '@nestjs/swagger';
import { QuizAnswerEntity } from './quiz-answer.entity';

export class QuizQuestionEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  question: string;

  @ApiProperty({ type: [QuizAnswerEntity] })
  answers: QuizAnswerEntity[];
}
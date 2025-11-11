import { ApiProperty } from '@nestjs/swagger';
import { QuizQuestionEntity } from './quiz-question.entity';

export class LessonEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ type: [QuizQuestionEntity] })
  questions: QuizQuestionEntity[];
}
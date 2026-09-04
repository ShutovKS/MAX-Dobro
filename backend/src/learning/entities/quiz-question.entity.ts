// FILE: backend/src/learning/entities/quiz-question.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for a quiz question and its answer options.
//   SCOPE: id, question text, answers
//   DEPENDS: none
//   LINKS: M-LEARNING, V-M-LEARNING
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   QuizQuestionEntity - OpenAPI question with QuizAnswerEntity[]
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

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

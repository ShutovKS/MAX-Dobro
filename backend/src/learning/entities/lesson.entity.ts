// FILE: backend/src/learning/entities/lesson.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for a course lesson with quiz questions.
//   SCOPE: id, title, content, questions
//   DEPENDS: none
//   LINKS: M-LEARNING, V-M-LEARNING
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   LessonEntity - OpenAPI lesson with QuizQuestionEntity[]
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

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

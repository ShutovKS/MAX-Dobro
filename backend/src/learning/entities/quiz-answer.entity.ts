// FILE: backend/src/learning/entities/quiz-answer.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for a quiz answer option without isCorrect.
//   SCOPE: id, answer text
//   DEPENDS: none
//   LINKS: M-LEARNING, V-M-LEARNING
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   QuizAnswerEntity - public answer option; isCorrect is not exposed
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty } from '@nestjs/swagger';

export class QuizAnswerEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  answer: string;
}

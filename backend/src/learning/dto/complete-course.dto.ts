// FILE: backend/src/learning/dto/complete-course.dto.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Validated quiz-answer payload for course completion scoring.
//   SCOPE: answers array of questionId/answerId pairs
//   DEPENDS: none
//   LINKS: M-LEARNING, V-M-LEARNING
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   CompleteCourseDto - submitted quiz answers for POST /courses/:id/complete
//   UserAnswerDto - one questionId/answerId pair
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, ValidateNested } from 'class-validator';

class UserAnswerDto {
  @ApiProperty()
  @IsInt()
  questionId: number;

  @ApiProperty()
  @IsInt()
  answerId: number;
}

export class CompleteCourseDto {
  @ApiProperty({ type: [UserAnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserAnswerDto)
  answers: UserAnswerDto[];
}

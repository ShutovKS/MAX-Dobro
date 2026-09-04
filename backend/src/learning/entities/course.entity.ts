// FILE: backend/src/learning/entities/course.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for a course with nested lessons.
//   SCOPE: id, title, description, lessons
//   DEPENDS: none
//   LINKS: M-LEARNING, V-M-LEARNING
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   CourseEntity - OpenAPI course with LessonEntity[]
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty } from '@nestjs/swagger';
import { LessonEntity } from './lesson.entity';

export class CourseEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: [LessonEntity] })
  lessons: LessonEntity[];
}

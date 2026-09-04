// FILE: backend/src/auth/entities/user-course.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for a course with the current user's progress.
//   SCOPE: course fields plus hasCertificate, status, progress, lessons
//   DEPENDS: none
//   LINKS: M-AUTH, V-M-AUTH
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   UserCourseEntity - course projection with completion status
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty } from '@nestjs/swagger';
import { Course } from '@prisma/client';
import { LessonEntity } from '../../learning/entities/lesson.entity';

export class UserCourseEntity
  implements Omit<Course, 'createdAt' | 'updatedAt'>
{
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ required: false, nullable: true })
  duration: string | null;

  @ApiProperty({ required: false, nullable: true })
  category: string | null;

  @ApiProperty({ required: false, nullable: true })
  level: string | null;

  @ApiProperty({ required: false, nullable: true })
  icon: string | null;

  @ApiProperty({ example: true })
  hasCertificate: boolean;

  @ApiProperty({ enum: ['completed', 'in-progress', 'not-started'] })
  status: 'completed' | 'in-progress' | 'not-started';

  @ApiProperty({ example: 0.5, description: 'Course completion progress from 0 to 1' })
  progress: number;

  @ApiProperty({ type: () => [LessonEntity] })
  lessons: LessonEntity[];
}

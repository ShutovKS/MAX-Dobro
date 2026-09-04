// FILE: backend/src/auth/entities/user-certificate.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for a completed-course certificate join row.
//   SCOPE: userId, courseId, completedAt, nested course
//   DEPENDS: none
//   LINKS: M-AUTH, V-M-AUTH
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   UserCertificateEntity - user-course certificate with nested CourseEntity
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty } from '@nestjs/swagger';
import { CourseEntity } from '../../learning/entities/course.entity';

export class UserCertificateEntity {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  courseId: number;

  @ApiProperty()
  completedAt: Date;

  @ApiProperty({ type: () => CourseEntity })
  course: CourseEntity;
}

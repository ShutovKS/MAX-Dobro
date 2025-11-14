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
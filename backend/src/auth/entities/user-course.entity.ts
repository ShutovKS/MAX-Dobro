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
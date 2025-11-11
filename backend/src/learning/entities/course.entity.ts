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
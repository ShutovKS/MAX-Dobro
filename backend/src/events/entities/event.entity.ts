import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Course, Event } from '@prisma/client';

class EventCount {
  @ApiProperty()
  participants: number;
}

class RecommendedCourseInfo implements Pick<Course, 'id' | 'title'> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;
}

export class EventEntity implements Event {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  date: Date;

  @ApiProperty({ required: false, nullable: true })
  location: string | null;

  @ApiProperty({ required: false, nullable: true })
  category: string | null;

  @ApiProperty({ required: false, nullable: true })
  requirements: string | null;

  @ApiProperty({ required: false, nullable: true })
  latitude: number | null;

  @ApiProperty({ required: false, nullable: true })
  longitude: number | null;

  @ApiProperty({ required: false, nullable: true })
  maxParticipants: number | null;

  @ApiProperty({ required: false, nullable: true })
  durationHours: number | null;

  @ApiProperty()
  status: string;

  @ApiProperty()
  karmaPoints: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  organizationId: number;

  @ApiPropertyOptional({
    description: 'ID of the recommended course for this event',
    nullable: true,
  })
  recommendedCourseId: number | null;

  @ApiPropertyOptional({
    description: 'Brief info about the recommended course',
    type: RecommendedCourseInfo,
    nullable: true,
  })
  recommendedCourse?: RecommendedCourseInfo | null;

  @ApiPropertyOptional({ type: EventCount })
  _count?: EventCount;
}
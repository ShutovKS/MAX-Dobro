// FILE: backend/src/events/entities/event.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for an Event including optional friends and course hints.
//   SCOPE: Prisma Event fields plus _count, recommendedCourse, friendsParticipating
//   DEPENDS: none
//   LINKS: M-EVENTS, V-M-EVENTS
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   EventEntity - OpenAPI Event with optional participation extras
//   EventCount - nested participant count
//   RecommendedCourseInfo - nested id/title for recommended course
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Course, Event } from '@prisma/client';
import { PublicUserEntity } from '../../users/entities/public-user.entity';

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

  @ApiPropertyOptional({
    description: "A list of the current user's friends who are also participating in this event.",
    type: [PublicUserEntity],
  })
  friendsParticipating?: PublicUserEntity[];
}

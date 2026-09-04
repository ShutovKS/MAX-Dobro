// FILE: backend/src/reviews/entities/review.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for an event review with public author.
//   SCOPE: id, rating, text, createdAt, author
//   DEPENDS: M-REVIEWS, M-USERS
//   LINKS: M-REVIEWS, V-M-REVIEWS, type-ReviewEntity
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   ReviewEntity - mapped event review with public author
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty } from '@nestjs/swagger';
import { PublicUserEntity } from '../../users/entities/public-user.entity';

export class ReviewEntity {
  @ApiProperty()
  id: number;

  @ApiProperty({ minimum: 1, maximum: 5 })
  rating: number;

  @ApiProperty({ required: false, nullable: true })
  text: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => PublicUserEntity })
  author: PublicUserEntity;
}

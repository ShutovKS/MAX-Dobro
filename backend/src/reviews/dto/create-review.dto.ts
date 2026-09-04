// FILE: backend/src/reviews/dto/create-review.dto.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Validate event review create payloads.
//   SCOPE: Required 1-5 rating and optional non-empty text
//   DEPENDS: M-REVIEWS
//   LINKS: M-REVIEWS, V-M-REVIEWS, type-CreateReviewDto
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   CreateReviewDto - inbound rating and optional review text
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'Rating from 1 to 5', example: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ description: 'Review text', example: 'Great event!' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  text?: string;
}

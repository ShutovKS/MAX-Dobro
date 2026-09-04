// FILE: backend/src/reviews/reviews.controller.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Authenticated HTTP API for event reviews.
//   SCOPE: GET/POST /events/:eventId/reviews
//   DEPENDS: M-PRISMA, M-AUTH
//   LINKS: M-REVIEWS, V-M-REVIEWS, class-ReviewsService
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   ReviewsController - list and create event reviews
//   findAllForEvent - paginated reviews for one event
//   create - participant review for a completed event
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PaginationQueryDto } from '../events/dto/pagination-query.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewEntity } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

// START_CONTRACT: ReviewsController
//   PURPOSE: Expose authenticated event-review HTTP routes
//   INPUTS: { eventId: number, user: User, pagination: PaginationQueryDto, createReviewDto: CreateReviewDto }
//   OUTPUTS: { ReviewEntity[] | Review }
//   SIDE_EFFECTS: none at controller layer
//   LINKS: M-REVIEWS, V-M-REVIEWS
// END_CONTRACT: ReviewsController
@ApiTags('Events')
@Controller('events/:eventId/reviews')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // START_CONTRACT: findAllForEvent
  //   PURPOSE: List paginated reviews for one event
  //   INPUTS: { eventId: number, pagination: PaginationQueryDto }
  //   OUTPUTS: { Promise<ReviewEntity[]> }
  //   SIDE_EFFECTS: none
  //   LINKS: M-REVIEWS, fn-ReviewsService.findAllForEvent
  // END_CONTRACT: findAllForEvent
  @Get()
  @ApiOperation({ summary: 'Get reviews for a specific event' })
  @ApiResponse({ status: 200, type: [ReviewEntity] })
  findAllForEvent(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.reviewsService.findAllForEvent(eventId, pagination);
  }

  // START_CONTRACT: create
  //   PURPOSE: Create a participant review for a completed event
  //   INPUTS: { eventId: number, user: User, createReviewDto: CreateReviewDto }
  //   OUTPUTS: { Promise<Review> }
  //   SIDE_EFFECTS: persists review and updates organization rating via service
  //   LINKS: M-REVIEWS, V-M-REVIEWS, BLOCK_CREATE_REVIEW
  // END_CONTRACT: create
  @Post()
  @ApiOperation({ summary: 'Leave a review for a completed event' })
  create(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(eventId, user.id, createReviewDto);
  }
}

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

@ApiTags('Events')
@Controller('events/:eventId/reviews')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get reviews for a specific event' })
  @ApiResponse({ status: 200, type: [ReviewEntity] })
  findAllForEvent(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.reviewsService.findAllForEvent(eventId, pagination);
  }

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
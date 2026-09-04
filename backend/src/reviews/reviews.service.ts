// FILE: backend/src/reviews/reviews.service.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: List and create event reviews that feed organization ratings.
//   SCOPE: Event/org listing, participant-gated create, rating aggregate update
//   DEPENDS: M-PRISMA, M-AUTH
//   LINKS: M-REVIEWS, V-M-REVIEWS, class-ReviewsService
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   ReviewsService - event reviews
//   findAllForEvent - paginated reviews for one event
//   findAllForOrganization - paginated reviews for one organization
//   create - participant review plus organization rating update
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationQueryDto } from '../events/dto/pagination-query.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

// START_CONTRACT: ReviewsService
//   PURPOSE: Query reviews and create participant reviews with rating rollup
//   INPUTS: { eventId: number, organizationId: number, authorId: number, pagination: PaginationQueryDto, createReviewDto: CreateReviewDto }
//   OUTPUTS: { mapped Review[] | Review }
//   SIDE_EFFECTS: may create Review and update Organization rating
//   LINKS: M-REVIEWS, V-M-REVIEWS, M-PRISMA
// END_CONTRACT: ReviewsService
@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  // START_CONTRACT: findAllForEvent
  //   PURPOSE: Load paginated reviews for one event with public authors
  //   INPUTS: { eventId: number, pagination: PaginationQueryDto }
  //   OUTPUTS: { Promise<mapped Review[]> }
  //   SIDE_EFFECTS: none
  //   LINKS: M-REVIEWS, BLOCK_LIST_EVENT_REVIEWS
  // END_CONTRACT: findAllForEvent
  async findAllForEvent(eventId: number, pagination: PaginationQueryDto) {
    // START_BLOCK_LIST_EVENT_REVIEWS
    const { page = 1, limit = 5 } = pagination;
    const skip = (page - 1) * limit;

    const reviews = await this.prisma.review.findMany({
      where: { eventId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
      },
    });

    return reviews.map((review) => {
      const { author, ...rest } = review;
      return {
        ...rest,
        author: {
          id: author.id,
          name: `${author.firstName || ''} ${author.lastName || ''}`.trim(),
          avatarUrl: author.avatarUrl,
        },
      };
    });
    // END_BLOCK_LIST_EVENT_REVIEWS
  }

  // START_CONTRACT: findAllForOrganization
  //   PURPOSE: Load paginated reviews for one organization with public authors
  //   INPUTS: { organizationId: number, pagination: PaginationQueryDto }
  //   OUTPUTS: { Promise<mapped Review[]> }
  //   SIDE_EFFECTS: none
  //   LINKS: M-REVIEWS, BLOCK_LIST_ORG_REVIEWS
  // END_CONTRACT: findAllForOrganization
  async findAllForOrganization(
    organizationId: number,
    pagination: PaginationQueryDto,
  ) {
    // START_BLOCK_LIST_ORG_REVIEWS
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const reviews = await this.prisma.review.findMany({
      where: { organizationId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
      },
    });

    return reviews.map((review) => {
      const { author, ...rest } = review;
      return {
        ...rest,
        author: {
          id: author.id,
          name: `${author.firstName || ''} ${author.lastName || ''}`.trim(),
          avatarUrl: author.avatarUrl,
        },
      };
    });
    // END_BLOCK_LIST_ORG_REVIEWS
  }

  // START_CONTRACT: create
  //   PURPOSE: Create a participant review and roll up organization rating
  //   INPUTS: { eventId: number, authorId: number, createReviewDto: CreateReviewDto }
  //   OUTPUTS: { Promise<Review> }
  //   SIDE_EFFECTS: creates Review; updates Organization rating and reviewCount
  //   LINKS: M-REVIEWS, V-M-REVIEWS, BLOCK_CREATE_REVIEW
  // END_CONTRACT: create
  async create(
    eventId: number,
    authorId: number,
    createReviewDto: CreateReviewDto,
  ) {
    // START_BLOCK_CREATE_REVIEW
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found.`);
    }

    if (event.status !== 'COMPLETED') {
      throw new ForbiddenException('You can only review completed events.');
    }

    const participation = await this.prisma.eventParticipant.findUnique({
      where: {
        userId_eventId: { userId: authorId, eventId },
      },
    });

    if (!participation || participation.status !== 'approved') {
      throw new ForbiddenException(
        'You did not participate in this event or your participation was not approved.',
      );
    }

    const existingReview = await this.prisma.review.findUnique({
      where: {
        user_event_review_unique: { authorId, eventId },
      },
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this event.');
    }

    return this.prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          ...createReviewDto,
          authorId,
          eventId,
          organizationId: event.organizationId,
        },
      });

      const aggregate = await tx.review.aggregate({
        where: { organizationId: event.organizationId },
        _avg: { rating: true },
        _count: { id: true },
      });

      await tx.organization.update({
        where: { id: event.organizationId },
        data: {
          rating: aggregate._avg.rating,
          reviewCount: aggregate._count.id,
        },
      });

      return review;
    });
    // END_BLOCK_CREATE_REVIEW
  }
}

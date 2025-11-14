import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationQueryDto } from '../events/dto/pagination-query.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForEvent(eventId: number, pagination: PaginationQueryDto) {
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
  }

  async findAllForOrganization(
    organizationId: number,
    pagination: PaginationQueryDto,
  ) {
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
  }

  async create(
    eventId: number,
    authorId: number,
    createReviewDto: CreateReviewDto,
  ) {
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
  }
}
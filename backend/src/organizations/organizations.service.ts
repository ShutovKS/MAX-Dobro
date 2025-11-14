import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from '../events/dto/pagination-query.dto';
import { PrismaService } from '../prisma/prisma.service';
import { OrganizationEntity } from './entities/organization.entity';
import { OrganizationStatEntity } from './entities/organization-stat.entity';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  private getOrgInclude() {
    return {
      _count: {
        select: { subscribers: true },
      },
    };
  }

  private mapToEntity(
    org: Prisma.OrganizationGetPayload<{
      include: { _count: { select: { subscribers: true } } };
    }>,
    isSubscribed?: boolean,
  ): OrganizationEntity {
    const { _count, ...rest } = org;
    const entity: OrganizationEntity = {
      ...rest,
      rating: rest.rating,
      reviewCount: rest.reviewCount,
      subscribers: _count.subscribers,
    };

    if (isSubscribed !== undefined) {
      entity.isSubscribed = isSubscribed;
    }

    return entity;
  }

  async findAll(
    pagination: PaginationQueryDto,
    userId?: number,
  ): Promise<OrganizationEntity[]> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const organizations = await this.prisma.organization.findMany({
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      include: this.getOrgInclude(),
    });

    if (!userId) {
      return organizations.map((org) => this.mapToEntity(org));
    }

    const subscriptions =
      await this.prisma.userOrganizationSubscription.findMany({
        where: {
          userId,
          organizationId: { in: organizations.map((o) => o.id) },
        },
        select: { organizationId: true },
      });

    const subscribedIds = new Set(
      subscriptions.map((sub) => sub.organizationId),
    );

    return organizations.map((org) =>
      this.mapToEntity(org, subscribedIds.has(org.id)),
    );
  }

  async findOne(id: number, userId?: number): Promise<OrganizationEntity> {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: this.getOrgInclude(),
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found.`);
    }

    if (!userId) {
      return this.mapToEntity(organization);
    }

    const subscription =
      await this.prisma.userOrganizationSubscription.findUnique({
        where: { userId_organizationId: { userId, organizationId: id } },
      });

    return this.mapToEntity(organization, !!subscription);
  }

  async findEvents(organizationId: number, pagination: PaginationQueryDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });
    if (!organization) {
      throw new NotFoundException(
        `Organization with ID ${organizationId} not found.`,
      );
    }

    return this.prisma.event.findMany({
      skip,
      take: limit,
      where: { organizationId },
      include: {
        _count: {
          select: { participants: true },
        },
      },
      orderBy: { date: 'asc' },
    });
  }
  
  async findEventsForOrganizer(organizationId: number) {
    const events = await this.prisma.event.findMany({
      where: { organizationId },
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    const newApplicationsCounts = await this.prisma.eventParticipant.groupBy({
      by: ['eventId'],
      where: {
        eventId: { in: events.map(e => e.id) },
        status: 'pending',
      },
      _count: {
        userId: true,
      },
    });
    
    const newApplicationsMap = new Map(newApplicationsCounts.map(item => [item.eventId, item._count.userId]));

    const statusMapping = {
      PLANNED: 'active',
      COMPLETED: 'past',
    };

    return events.map(event => {
      const { _count, status, maxParticipants, ...rest } = event;
      return {
        ...rest,
        date: event.date.toISOString(),
        status: statusMapping[status as keyof typeof statusMapping] || 'draft',
        participantCount: _count.participants,
        capacity: maxParticipants ?? 0,
        newApplications: newApplicationsMap.get(event.id) || 0,
      };
    });
  }

  async getDashboardStats(organizationId: number): Promise<OrganizationStatEntity[]> {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        _count: {
          select: { subscribers: true, events: true },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException(
        `Organization with ID ${organizationId} not found.`,
      );
    }

    const stats: OrganizationStatEntity[] = [
      {
        id: 'subscribers',
        label: 'Подписчики',
        value: organization._count.subscribers.toLocaleString('ru-RU'),
        change: '+5',
      },
      {
        id: 'events_total',
        label: 'Всего событий',
        value: organization._count.events.toLocaleString('ru-RU'),
        change: '+1',
      },
      {
        id: 'rating',
        label: 'Рейтинг',
        value: organization.rating?.toFixed(1) ?? 'N/A',
        change: '-0.1',
      },
      {
        id: 'reviews',
        label: 'Отзывы',
        value: organization.reviewCount.toLocaleString('ru-RU'),
        change: '+12',
      },
    ];

    return stats;
  }
  
  async updateSubscription(
    organizationId: number,
    userId: number,
    isSubscribed: boolean,
  ) {
    if (isSubscribed) {
      try {
        await this.prisma.userOrganizationSubscription.create({
          data: { userId, organizationId },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          // Ignore if already subscribed
        } else {
          throw error;
        }
      }
    } else {
      await this.prisma.userOrganizationSubscription.deleteMany({
        where: { userId, organizationId },
      });
    }
    return { success: true };
  }
}
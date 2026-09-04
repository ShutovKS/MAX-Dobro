// FILE: backend/src/organizations/organizations.service.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Organization catalog, subscriptions, and organizer dashboard stats.
//   SCOPE: list/get orgs with subscription flags, org events, dashboard tiles, subscribe/unsubscribe
//   DEPENDS: M-PRISMA, M-AUTH
//   LINKS: M-ORGANIZATIONS, V-M-ORGANIZATIONS, M-PRISMA
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   OrganizationsService - org catalog and dashboard stats
//   findAll - paginated orgs with optional isSubscribed
//   findOne - org by id with optional isSubscribed
//   findEvents - paginated events for an organization
//   findEventsForOrganizer - organizer event list with pending counts
//   getDashboardStats - subscriber/event/rating/review tiles
//   updateSubscription - create or delete UserOrganizationSubscription
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

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
// START_CONTRACT: OrganizationsService
//   PURPOSE: Org catalog and dashboard stats
//   INPUTS: { PrismaService, PaginationQueryDto, organizationId, userId }
//   OUTPUTS: { OrganizationEntity, OrganizationStatEntity[], organizer event rows }
//   SIDE_EFFECTS: Prisma reads Organization/Event/subscriptions; writes UserOrganizationSubscription
//   LINKS: M-ORGANIZATIONS, V-M-ORGANIZATIONS, M-PRISMA
// END_CONTRACT: OrganizationsService
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  // START_BLOCK_MAP_ORG
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
  // END_BLOCK_MAP_ORG

  // START_BLOCK_QUERY_ORGS
  // START_CONTRACT: findAll
  //   PURPOSE: Paginated organization catalog with optional viewer subscription flags
  //   INPUTS: { pagination: PaginationQueryDto, userId?: number }
  //   OUTPUTS: { OrganizationEntity[] }
  //   SIDE_EFFECTS: Prisma Organization and UserOrganizationSubscription reads
  //   LINKS: M-ORGANIZATIONS, V-M-ORGANIZATIONS, M-PRISMA
  // END_CONTRACT: findAll
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

  // START_CONTRACT: findOne
  //   PURPOSE: Load one organization and optional viewer subscription
  //   INPUTS: { id: number, userId?: number }
  //   OUTPUTS: { OrganizationEntity }
  //   SIDE_EFFECTS: Prisma Organization and UserOrganizationSubscription reads
  //   LINKS: M-ORGANIZATIONS, V-M-ORGANIZATIONS, M-PRISMA
  // END_CONTRACT: findOne
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
  // END_BLOCK_QUERY_ORGS

  // START_BLOCK_QUERY_ORG_EVENTS
  // START_CONTRACT: findEvents
  //   PURPOSE: Paginated events belonging to an organization
  //   INPUTS: { organizationId: number, pagination: PaginationQueryDto }
  //   OUTPUTS: { Event[] with participant _count }
  //   SIDE_EFFECTS: Prisma Organization and Event reads
  //   LINKS: M-ORGANIZATIONS, V-M-ORGANIZATIONS, M-PRISMA
  // END_CONTRACT: findEvents
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
  
  // START_CONTRACT: findEventsForOrganizer
  //   PURPOSE: Organizer event list with mapped status, capacity, and pending applications
  //   INPUTS: { organizationId: number }
  //   OUTPUTS: { organizer event rows }
  //   SIDE_EFFECTS: Prisma Event and EventParticipant groupBy reads
  //   LINKS: M-ORGANIZATIONS, V-M-ORGANIZATIONS, M-PRISMA
  // END_CONTRACT: findEventsForOrganizer
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
  // END_BLOCK_QUERY_ORG_EVENTS

  // START_CONTRACT: getDashboardStats
  //   PURPOSE: Build organizer dashboard tiles from org aggregates
  //   INPUTS: { organizationId: number }
  //   OUTPUTS: { OrganizationStatEntity[] }
  //   SIDE_EFFECTS: Prisma Organization read with subscriber/event counts
  //   LINKS: M-ORGANIZATIONS, V-M-ORGANIZATIONS, BLOCK_DASHBOARD_STATS
  // END_CONTRACT: getDashboardStats
  // START_BLOCK_DASHBOARD_STATS
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
  // END_BLOCK_DASHBOARD_STATS
  
  // START_CONTRACT: updateSubscription
  //   PURPOSE: Subscribe or unsubscribe the current user to an organization
  //   INPUTS: { organizationId: number, userId: number, isSubscribed: boolean }
  //   OUTPUTS: { success: true }
  //   SIDE_EFFECTS: creates or deletes UserOrganizationSubscription; ignores P2002 duplicates
  //   LINKS: M-ORGANIZATIONS, V-M-ORGANIZATIONS, M-PRISMA
  // END_CONTRACT: updateSubscription
  // START_BLOCK_UPDATE_SUBSCRIPTION
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
  // END_BLOCK_UPDATE_SUBSCRIPTION
}

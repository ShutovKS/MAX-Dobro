import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from '../events/dto/pagination-query.dto';
import { EventEntity } from '../events/entities/event.entity';
import { PrismaService } from '../prisma/prisma.service';
import { OrganizationEntity } from './entities/organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

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
    });

    if (!userId) {
      return organizations;
    }

    const subscriptions =
      await this.prisma.userOrganizationSubscription.findMany({
        where: { userId },
        select: { organizationId: true },
      });

    const subscribedIds = new Set(
      subscriptions.map((sub) => sub.organizationId),
    );

    return organizations.map((org) => ({
      ...org,
      isSubscribed: subscribedIds.has(org.id),
    }));
  }

  async findOne(
    id: number,
    userId?: number,
  ): Promise<OrganizationEntity | null> {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found.`);
    }

    if (!userId) {
      return organization;
    }

    const subscription =
      await this.prisma.userOrganizationSubscription.findUnique({
        where: { userId_organizationId: { userId, organizationId: id } },
      });

    return { ...organization, isSubscribed: !!subscription };
  }

  async findEvents(
    organizationId: number,
    pagination: PaginationQueryDto,
  ): Promise<EventEntity[]> {
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

  async subscribe(organizationId: number, userId: number): Promise<void> {
    try {
      await this.prisma.userOrganizationSubscription.create({
        data: {
          userId,
          organizationId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('User is already subscribed.');
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new NotFoundException(
          `Organization with ID ${organizationId} not found.`,
        );
      }
      throw error;
    }
  }

  async unsubscribe(organizationId: number, userId: number): Promise<void> {
    try {
      await this.prisma.userOrganizationSubscription.delete({
        where: {
          userId_organizationId: {
            userId,
            organizationId,
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Subscription not found.');
      }
      throw error;
    }
  }
}
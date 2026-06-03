import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TasksService } from '../tasks/tasks.service';
import { PublicUserEntity } from '../users/entities/public-user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tasksService: TasksService,
  ) {}

  private readonly eventWithDetails = {
    include: {
      organization: {
        select: { name: true, category: true },
      },
      _count: {
        select: { participants: true },
      },
      recommendedCourse: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  };

  private mapEvent(
    event: Prisma.EventGetPayload<typeof this.eventWithDetails>,
  ) {
    const { organization, durationHours, karmaPoints, ...rest } = event;
    return {
      ...rest,
      location: rest.location ?? '',
      organizationName: organization.name,
      participantCount: event._count.participants,
      rewards: {
        hours: durationHours,
        karma: karmaPoints,
      },
    };
  }
  
  async findOne(id: number, currentUserId?: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      ...this.eventWithDetails,
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const mappedEvent = this.mapEvent(event);

    if (!currentUserId) {
      return mappedEvent;
    }

    const [friends, participants] = await Promise.all([
      this.prisma.friendship.findMany({
        where: { userId: currentUserId },
        select: { friendId: true },
      }),
      this.prisma.eventParticipant.findMany({
        where: { eventId: id, status: 'approved' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
      }),
    ]);

    const friendIds = new Set(friends.map((f) => f.friendId));
    
    const friendsParticipating = participants
      .filter((p) => friendIds.has(p.userId))
      .map((p) => {
        const { user } = p;
        return {
          id: user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          avatarUrl: user.avatarUrl,
        };
      });

    return { ...mappedEvent, friendsParticipating };
  }
  
  async create(createEventDto: CreateEventDto, organizationId: number) {
    if (!organizationId) {
      throw new ForbiddenException(
        'Organizer is not linked to an organization',
      );
    }
    const newEvent = await this.prisma.event.create({
      data: {
        ...createEventDto,
        organizationId,
        date: new Date(createEventDto.date),
        status: 'PLANNED',
      },
    });
    this.tasksService.scheduleEventCompletion(newEvent);
    return this.findOne(newEvent.id);
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const events = await this.prisma.event.findMany({
      where: {
        status: 'PLANNED',
      },
      skip,
      take: limit,
      orderBy: {
        date: 'asc',
      },
      ...this.eventWithDetails,
    });

    return events.map((event) => this.mapEvent(event));
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    try {
      const updatedEvent = await this.prisma.event.update({
        where: { id },
        data: {
          ...updateEventDto,
          date: updateEventDto.date ? new Date(updateEventDto.date) : undefined,
        },
        ...this.eventWithDetails,
      });
      return this.mapEvent(updatedEvent);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.event.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      throw error;
    }
  }

  async participate(eventId: number, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
        include: { _count: { select: { participants: true } } },
      });

      if (!event) {
        throw new NotFoundException(`Event with ID ${eventId} not found`);
      }

      if (
        event.maxParticipants !== null &&
        event._count.participants >= event.maxParticipants
      ) {
        throw new ForbiddenException('No available spots for this event');
      }

      const existingParticipation = await tx.eventParticipant.findUnique({
        where: { userId_eventId: { userId, eventId } },
      });

      if (existingParticipation) {
        throw new ConflictException(
          'You are already participating in this event',
        );
      }

      return tx.eventParticipant.create({
        data: {
          eventId,
          userId,
        },
      });
    });
  }

  async cancelParticipation(eventId: number, userId: number) {
    try {
      await this.prisma.eventParticipant.delete({
        where: { userId_eventId: { userId, eventId } },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Participation record not found for this user and event`,
        );
      }
      throw error;
    }
  }

  async updateParticipantStatus(
    eventId: number,
    userId: number,
    status: string,
  ) {
    try {
      return await this.prisma.eventParticipant.update({
        where: { userId_eventId: { userId, eventId } },
        data: { status },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Participation record not found for user ${userId} and event ${eventId}`,
        );
      }
      throw error;
    }
  }

  async getParticipants(eventId: number): Promise<PublicUserEntity[]> {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const participations = await this.prisma.eventParticipant.findMany({
      where: { eventId },
      select: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            karmaPoints: true,
          },
        },
        status: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const statusMapping: Record<string, 'new' | 'confirmed' | 'rejected'> = {
      pending: 'new',
      approved: 'confirmed',
      rejected: 'rejected',
    };

    return participations.map((p) => ({
      id: p.user.id,
      name: `${p.user.firstName || ''} ${p.user.lastName || ''}`.trim(),
      avatarUrl: p.user.avatarUrl,
      rating: p.user.karmaPoints,
      status: statusMapping[p.status] || p.status,
    }));
  }
}
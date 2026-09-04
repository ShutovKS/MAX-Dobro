// FILE: backend/src/events/events.service.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Event CRUD and participation lifecycle against Prisma.
//   SCOPE: map/query events, create/update/delete, instant-approve participate, cancel, status, participant list
//   DEPENDS: M-PRISMA, M-AUTH, M-TASKS
//   LINKS: M-EVENTS, V-M-EVENTS, M-PRISMA, M-TASKS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   EventsService - event queries and participation
//   findOne - event by id with optional friend participation
//   create - create event and schedule completion
//   findAll - paginated planned events
//   update - patch event fields
//   remove - delete event
//   participate - instant-approve signup
//   cancelParticipation - delete participation row
//   updateParticipantStatus - organizer status change
//   getParticipants - public participant list
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
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TasksService } from '../tasks/tasks.service';
import { PublicUserEntity } from '../users/entities/public-user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
// START_CONTRACT: EventsService
//   PURPOSE: Event queries and participation
//   INPUTS: { PrismaService, TasksService, CreateEventDto, UpdateEventDto, PaginationQueryDto }
//   OUTPUTS: { mapped Event, EventParticipant, PublicUserEntity[] }
//   SIDE_EFFECTS: reads/writes Event and EventParticipant; schedules completion via M-TASKS
//   LINKS: M-EVENTS, V-M-EVENTS, M-PRISMA, M-TASKS
// END_CONTRACT: EventsService
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tasksService: TasksService,
  ) {}

  // START_BLOCK_MAP_EVENT
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
  // END_BLOCK_MAP_EVENT
  
  // START_CONTRACT: findOne
  //   PURPOSE: Load one event and optionally hydrate friend participation for the current user
  //   INPUTS: { id: number, currentUserId?: number }
  //   OUTPUTS: { mapped event with optional friendsParticipating, isParticipating, participationStatus }
  //   SIDE_EFFECTS: Prisma reads Event, Friendship, EventParticipant
  //   LINKS: M-EVENTS, V-M-EVENTS, M-PRISMA
  // END_CONTRACT: findOne
  // START_BLOCK_QUERY_FIND_ONE
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

    const [friends, participants, myParticipation] = await Promise.all([
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
      this.prisma.eventParticipant.findUnique({
        where: { userId_eventId: { userId: currentUserId, eventId: id } },
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

    // Гидратация участия: фронт берёт isSignedUp с сервера, а не из локального
    // состояния (раньше при возврате из чата флаг сбрасывался — «вылет» из события).
    return {
      ...mappedEvent,
      friendsParticipating,
      isParticipating: !!myParticipation,
      participationStatus: myParticipation?.status ?? null,
    };
  }
  // END_BLOCK_QUERY_FIND_ONE
  
  // START_BLOCK_MUTATE_EVENTS
  // START_CONTRACT: create
  //   PURPOSE: Create a planned event for an organizer organization
  //   INPUTS: { createEventDto: CreateEventDto, organizationId: number }
  //   OUTPUTS: { mapped event from findOne }
  //   SIDE_EFFECTS: inserts Event; schedules completion via TasksService
  //   LINKS: M-EVENTS, V-M-EVENTS, M-PRISMA, M-TASKS
  // END_CONTRACT: create
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

  // START_CONTRACT: findAll
  //   PURPOSE: List planned events with pagination
  //   INPUTS: { paginationQuery: PaginationQueryDto }
  //   OUTPUTS: { mapped Event[] }
  //   SIDE_EFFECTS: Prisma Event findMany
  //   LINKS: M-EVENTS, V-M-EVENTS, M-PRISMA
  // END_CONTRACT: findAll
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

  // START_CONTRACT: update
  //   PURPOSE: Patch event fields, mapping P2025 to 404
  //   INPUTS: { id: number, updateEventDto: UpdateEventDto }
  //   OUTPUTS: { mapped Event }
  //   SIDE_EFFECTS: Prisma Event update
  //   LINKS: M-EVENTS, V-M-EVENTS, M-PRISMA
  // END_CONTRACT: update
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

  // START_CONTRACT: remove
  //   PURPOSE: Delete an event, mapping P2025 to 404
  //   INPUTS: { id: number }
  //   OUTPUTS: { void }
  //   SIDE_EFFECTS: Prisma Event delete
  //   LINKS: M-EVENTS, V-M-EVENTS, M-PRISMA
  // END_CONTRACT: remove
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
  // END_BLOCK_MUTATE_EVENTS

  // START_CONTRACT: participate
  //   PURPOSE: Instant-approve volunteer signup when spots remain
  //   INPUTS: { eventId: number, userId: number }
  //   OUTPUTS: { EventParticipant with status approved }
  //   SIDE_EFFECTS: transactional EventParticipant create; throws if missing, full, or duplicate
  //   LINKS: M-EVENTS, V-M-EVENTS, BLOCK_PARTICIPATE
  // END_CONTRACT: participate
  // START_BLOCK_PARTICIPATE
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

      // Самозапись = сразу подтверждённое участие (решение: instant approved):
      // чат и список участников доступны немедленно, без модерации.
      return tx.eventParticipant.create({
        data: {
          eventId,
          userId,
          status: 'approved',
        },
      });
    });
  }
  // END_BLOCK_PARTICIPATE

  // START_BLOCK_PARTICIPATION_STATUS
  // START_CONTRACT: cancelParticipation
  //   PURPOSE: Remove the current user's participation row
  //   INPUTS: { eventId: number, userId: number }
  //   OUTPUTS: { void }
  //   SIDE_EFFECTS: Prisma EventParticipant delete; P2025 -> 404
  //   LINKS: M-EVENTS, V-M-EVENTS, M-PRISMA
  // END_CONTRACT: cancelParticipation
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

  // START_CONTRACT: updateParticipantStatus
  //   PURPOSE: Organizer updates a participant status string
  //   INPUTS: { eventId: number, userId: number, status: string }
  //   OUTPUTS: { EventParticipant }
  //   SIDE_EFFECTS: Prisma EventParticipant update; P2025 -> 404
  //   LINKS: M-EVENTS, V-M-EVENTS, M-PRISMA
  // END_CONTRACT: updateParticipantStatus
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

  // START_CONTRACT: getParticipants
  //   PURPOSE: List participants with public user fields and mapped status
  //   INPUTS: { eventId: number }
  //   OUTPUTS: { PublicUserEntity[] }
  //   SIDE_EFFECTS: Prisma Event and EventParticipant reads
  //   LINKS: M-EVENTS, V-M-EVENTS, M-PRISMA
  // END_CONTRACT: getParticipants
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
  // END_BLOCK_PARTICIPATION_STATUS
}

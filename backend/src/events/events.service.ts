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

  private readonly eventWithParticipantCount = {
    include: {
      _count: {
        select: { participants: true },
      },
    },
  };

  async create(createEventDto: CreateEventDto) {
    const newEvent = await this.prisma.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date),
        status: 'PLANNED',
      },
    });
    this.tasksService.scheduleEventCompletion(newEvent);

    return newEvent;
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    return this.prisma.event.findMany({
      skip,
      take: limit,
      orderBy: {
        date: 'asc',
      },
      ...this.eventWithParticipantCount,
    });
  }

  async findOne(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      ...this.eventWithParticipantCount,
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    try {
      return await this.prisma.event.update({
        where: { id },
        data: updateEventDto,
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
    await this.findOne(eventId);

    const participations = await this.prisma.eventParticipant.findMany({
      where: { eventId },
      select: {
        user: {
          select: {
            id: true,
            name: true,
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

    return participations.map((p) => ({
      id: p.user.id,
      name: p.user.name,
      avatarUrl: p.user.avatarUrl,
      rating: p.user.karmaPoints,
      status: p.status,
    }));
  }
}
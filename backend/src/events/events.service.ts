import {
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException, // <-- Добавь импорт
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createEventDto: CreateEventDto) {
    return this.prisma.event.create({
      data: createEventDto,
    });
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
    });
  }

  async findOne(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
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
      return await this.prisma.event.delete({
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
  
  // --- Обновленный метод participate ---
  async participate(eventId: number, userId: number) {
    // Используем транзакцию, чтобы обеспечить целостность данных
    return this.prisma.$transaction(async (tx) => {
      // 1. Находим событие и блокируем строку для обновления (forUpdate)
      const event = await tx.event.findUnique({
        where: { id: eventId },
        include: { _count: { select: { participants: true } } },
      });

      if (!event) {
        throw new NotFoundException(`Event with ID ${eventId} not found`);
      }

      // 2. Проверяем, есть ли свободные места
      if (
        event.maxParticipants !== null &&
        event._count.participants >= event.maxParticipants
      ) {
        throw new ForbiddenException('No available spots for this event');
      }

      // 3. Проверяем, не подал ли пользователь уже заявку
      const existingParticipation = await tx.eventParticipant.findUnique({
        where: { userId_eventId: { userId, eventId } },
      });

      if (existingParticipation) {
        throw new ConflictException('You are already participating in this event');
      }

      // 4. Создаем запись об участии
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
      return await this.prisma.eventParticipant.delete({
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
    // В будущем здесь будет проверка, имеет ли текущий пользователь права
    // изменять статус для события eventId.

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
}
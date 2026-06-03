import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationQueryDto } from '../events/dto/pagination-query.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventChatsService {
  constructor(private readonly prisma: PrismaService) {}

  // Доступ к чату события — только участникам (читать и писать). Раньше любой
  // авторизованный мог читать/писать в любой чат (инверсия UI-гейта).
  private async assertParticipant(eventId: number, userId: number) {
    const participation = await this.prisma.eventParticipant.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (!participation) {
      throw new ForbiddenException(
        'You must join the event to access its chat',
      );
    }
  }

  private mapMessage(message: any) {
    const { firstName, lastName, ...authorRest } = message.author;
    return {
      id: message.id,
      author: {
        ...authorRest,
        name: `${firstName || ''} ${lastName || ''}`.trim(),
      },
      text: message.text,
      timestamp: message.createdAt.toISOString(),
    };
  }

  async findUserChats(userId: number) {
    const participations = await this.prisma.eventParticipant.findMany({
      where: { userId, status: 'approved' },
      include: {
        event: {
          include: {
            chat: {
              include: {
                messages: {
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    return participations
      .filter((p) => p.event.chat)
      .map((p) => {
        const chat = p.event.chat!;
        const lastMessage = chat.messages[0];
        return {
          id: chat.id,
          eventId: p.eventId,
          eventTitle: p.event.title,
          lastMessage: lastMessage?.text ?? 'Сообщений пока нет',
          timestamp: (
            lastMessage?.createdAt ?? p.event.createdAt
          ).toISOString(),
          unreadCount: 0,
          isArchived: false,
        };
      });
  }

  async findChatMessages(chatId: number, pagination: PaginationQueryDto) {
    const { page = 1, limit = 50 } = pagination;
    const skip = (page - 1) * limit;

    const chatExists = await this.prisma.eventChat.count({
      where: { id: chatId },
    });
    if (!chatExists) {
      throw new NotFoundException(`Chat with ID ${chatId} not found.`);
    }

    const messages = await this.prisma.eventChatMessage.findMany({
      where: { chatId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
      },
    });

    return messages.map((message) => this.mapMessage(message));
  }

  async findChatMessagesByEventId(
    eventId: number,
    userId: number,
    pagination: PaginationQueryDto,
  ) {
    await this.assertParticipant(eventId, userId);
    const chat = await this.prisma.eventChat.findUnique({
      where: { eventId },
    });

    if (!chat) {
      // Чат ещё не создан (нет сообщений) — для участника это пустой чат.
      return [];
    }
    return this.findChatMessages(chat.id, pagination);
  }

  async createMessageByEventId(eventId: number, authorId: number, text: string) {
    const eventExists = await this.prisma.event.count({ where: { id: eventId } });
    if (!eventExists) {
      throw new NotFoundException(`Event with ID ${eventId} not found.`);
    }
    await this.assertParticipant(eventId, authorId);

    const chat = await this.prisma.eventChat.upsert({
      where: { eventId },
      update: {},
      create: { eventId },
    });

    const message = await this.prisma.eventChatMessage.create({
      data: { chatId: chat.id, authorId, text },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
      },
    });

    return this.mapMessage(message);
  }
}

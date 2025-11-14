import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from '../events/dto/pagination-query.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventChatsService {
  constructor(private readonly prisma: PrismaService) {}

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

    return messages.map((m) => {
      const { firstName, lastName, ...authorRest } = m.author;
      return {
        id: m.id,
        author: {
          ...authorRest,
          name: `${firstName || ''} ${lastName || ''}`.trim(),
        },
        text: m.text,
        timestamp: m.createdAt.toISOString(),
      };
    });
  }

  async findChatMessagesByEventId(eventId: number, pagination: PaginationQueryDto) {
    const chat = await this.prisma.eventChat.findUnique({
      where: { eventId },
    });

    if (!chat) {
      throw new NotFoundException(`Chat for event with ID ${eventId} not found.`);
    }
    return this.findChatMessages(chat.id, pagination);
  }
}
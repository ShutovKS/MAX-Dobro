// FILE: backend/src/event-chats/event-chats.service.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: List a volunteer's event chats and exchange event-scoped messages.
//   SCOPE: Participant gate, inbox listing, paginated messages, upsert chat and post
//   DEPENDS: M-PRISMA, M-AUTH
//   LINKS: M-EVENT-CHATS, V-M-EVENT-CHATS, class-EventChatsService
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   EventChatsService - event chat rooms and messages
//   findUserChats - inbox rows for approved event participations
//   findChatMessages - paginated messages by chat id
//   findChatMessagesByEventId - participant-gated messages by event
//   createMessageByEventId - upsert chat and persist a message
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationQueryDto } from '../events/dto/pagination-query.dto';
import { PrismaService } from '../prisma/prisma.service';

// START_CONTRACT: EventChatsService
//   PURPOSE: Enforce participant access and persist event chat messages
//   INPUTS: { eventId: number, userId: number, pagination: PaginationQueryDto, text: string }
//   OUTPUTS: { EventChatEntity[] | EventChatMessageEntity[] | EventChatMessageEntity }
//   SIDE_EFFECTS: may upsert EventChat and create EventChatMessage
//   LINKS: M-EVENT-CHATS, V-M-EVENT-CHATS, M-PRISMA
// END_CONTRACT: EventChatsService
@Injectable()
export class EventChatsService {
  constructor(private readonly prisma: PrismaService) {}

  // Доступ к чату события — только участникам (читать и писать). Раньше любой
  // авторизованный мог читать/писать в любой чат (инверсия UI-гейта).
  private async assertParticipant(eventId: number, userId: number) {
    // START_BLOCK_ASSERT_PARTICIPANT
    const participation = await this.prisma.eventParticipant.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (!participation) {
      throw new ForbiddenException(
        'You must join the event to access its chat',
      );
    }
    // END_BLOCK_ASSERT_PARTICIPANT
  }

  private mapMessage(message: any) {
    // START_BLOCK_MAP_EVENT_MESSAGE
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
    // END_BLOCK_MAP_EVENT_MESSAGE
  }

  // START_CONTRACT: findUserChats
  //   PURPOSE: List event chats for approved participations
  //   INPUTS: { userId: number }
  //   OUTPUTS: { Promise<EventChatEntity[]> }
  //   SIDE_EFFECTS: none
  //   LINKS: M-EVENT-CHATS, BLOCK_FIND_USER_CHATS
  // END_CONTRACT: findUserChats
  async findUserChats(userId: number) {
    // START_BLOCK_FIND_USER_CHATS
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
    // END_BLOCK_FIND_USER_CHATS
  }

  // START_CONTRACT: findChatMessages
  //   PURPOSE: Load paginated messages for a known chat id
  //   INPUTS: { chatId: number, pagination: PaginationQueryDto }
  //   OUTPUTS: { Promise<EventChatMessageEntity[]> }
  //   SIDE_EFFECTS: throws NotFoundException when chat is missing
  //   LINKS: M-EVENT-CHATS, BLOCK_FIND_CHAT_MESSAGES
  // END_CONTRACT: findChatMessages
  async findChatMessages(chatId: number, pagination: PaginationQueryDto) {
    // START_BLOCK_FIND_CHAT_MESSAGES
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
    // END_BLOCK_FIND_CHAT_MESSAGES
  }

  // START_CONTRACT: findChatMessagesByEventId
  //   PURPOSE: Participant-gated message list for an event chat
  //   INPUTS: { eventId: number, userId: number, pagination: PaginationQueryDto }
  //   OUTPUTS: { Promise<EventChatMessageEntity[]> }
  //   SIDE_EFFECTS: none besides participant ForbiddenException
  //   LINKS: M-EVENT-CHATS, BLOCK_FIND_MESSAGES_BY_EVENT
  // END_CONTRACT: findChatMessagesByEventId
  async findChatMessagesByEventId(
    eventId: number,
    userId: number,
    pagination: PaginationQueryDto,
  ) {
    // START_BLOCK_FIND_MESSAGES_BY_EVENT
    await this.assertParticipant(eventId, userId);
    const chat = await this.prisma.eventChat.findUnique({
      where: { eventId },
    });

    if (!chat) {
      // Чат ещё не создан (нет сообщений) — для участника это пустой чат.
      return [];
    }
    return this.findChatMessages(chat.id, pagination);
    // END_BLOCK_FIND_MESSAGES_BY_EVENT
  }

  // START_CONTRACT: createMessageByEventId
  //   PURPOSE: Upsert the event chat and persist a participant message
  //   INPUTS: { eventId: number, authorId: number, text: string }
  //   OUTPUTS: { Promise<EventChatMessageEntity> }
  //   SIDE_EFFECTS: upserts EventChat, creates EventChatMessage
  //   LINKS: M-EVENT-CHATS, V-M-EVENT-CHATS, BLOCK_POST_EVENT_MESSAGE
  // END_CONTRACT: createMessageByEventId
  async createMessageByEventId(eventId: number, authorId: number, text: string) {
    // START_BLOCK_POST_EVENT_MESSAGE
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
    // END_BLOCK_POST_EVENT_MESSAGE
  }
}

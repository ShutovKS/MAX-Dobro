// FILE: backend/src/assistant-chat/assistant-chat.service.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Store volunteer assistant messages and return conversation history.
//   SCOPE: Map stored rows, list paginated history, persist user text and assistant replies
//   DEPENDS: M-PRISMA, M-AUTH
//   LINKS: M-ASSISTANT-CHAT, V-M-ASSISTANT-CHAT, class-AssistantChatService
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   AssistantChatService - assistant history and keyword replies
//   findUserMessages - paginated mapped history for one author
//   postMessage - store user message and create assistant reply
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from '../events/dto/pagination-query.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

// START_CONTRACT: AssistantChatService
//   PURPOSE: Persist assistant conversation rows and map them for HTTP
//   INPUTS: { userId: number, pagination: PaginationQueryDto, dto: CreateMessageDto }
//   OUTPUTS: { mapped ChatMessageEntity values }
//   SIDE_EFFECTS: writes AssistantChatMessage rows
//   LINKS: M-ASSISTANT-CHAT, V-M-ASSISTANT-CHAT, M-PRISMA
// END_CONTRACT: AssistantChatService
@Injectable()
export class AssistantChatService {
  constructor(private readonly prisma: PrismaService) {}

  private async mapMessage(
    message: Prisma.AssistantChatMessageGetPayload<{}>,
  ): Promise<any> {
    // START_BLOCK_MAP_MESSAGE
    const { payload, content, sender, type, ...rest } = message;

    const mappedMessage: any = {
      ...rest,
      text: content,
      sender: sender.toLowerCase(),
      type: type,
    };

    if (type === 'event-card' && payload && (payload as any).eventId) {
      mappedMessage.event = await this.prisma.event.findUnique({
        where: { id: (payload as any).eventId },
        include: { _count: { select: { participants: true } } },
      });
    }

    if (type === 'course-card' && payload && (payload as any).courseId) {
      mappedMessage.course = await this.prisma.course.findUnique({
        where: { id: (payload as any).courseId },
      });
    }

    if (
      type === 'suggestion-chips' &&
      payload &&
      (payload as any).suggestions
    ) {
      mappedMessage.suggestions = (payload as any).suggestions;
    }

    return mappedMessage;
    // END_BLOCK_MAP_MESSAGE
  }

  // START_CONTRACT: findUserMessages
  //   PURPOSE: Load paginated assistant history for one author
  //   INPUTS: { userId: number, pagination: PaginationQueryDto }
  //   OUTPUTS: { Promise<mapped ChatMessageEntity[]> }
  //   SIDE_EFFECTS: none
  //   LINKS: M-ASSISTANT-CHAT, M-PRISMA, BLOCK_FIND_USER_MESSAGES
  // END_CONTRACT: findUserMessages
  async findUserMessages(userId: number, pagination: PaginationQueryDto) {
    // START_BLOCK_FIND_USER_MESSAGES
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;

    const messages = await this.prisma.assistantChatMessage.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return Promise.all(messages.map((msg) => this.mapMessage(msg)));
    // END_BLOCK_FIND_USER_MESSAGES
  }

  // START_CONTRACT: postMessage
  //   PURPOSE: Store user text and create a keyword-based assistant reply
  //   INPUTS: { authorId: number, dto: CreateMessageDto }
  //   OUTPUTS: { Promise<mapped ChatMessageEntity> }
  //   SIDE_EFFECTS: creates user and assistant AssistantChatMessage rows
  //   LINKS: M-ASSISTANT-CHAT, V-M-ASSISTANT-CHAT, BLOCK_POST_MESSAGE
  // END_CONTRACT: postMessage
  async postMessage(authorId: number, dto: CreateMessageDto) {
    // START_BLOCK_POST_MESSAGE
    await this.prisma.assistantChatMessage.create({
      data: {
        authorId,
        content: dto.text,
        sender: 'USER',
        type: 'text',
      },
    });

    const userText = dto.text.toLowerCase();
    let assistantResponse;

    if (userText.includes('событи')) {
      const firstEvent = await this.prisma.event.findFirst({
        where: { date: { gte: new Date() } },
        orderBy: { date: 'asc' },
      });

      if (firstEvent) {
        assistantResponse = await this.prisma.assistantChatMessage.create({
          data: {
            authorId,
            sender: 'ASSISTANT',
            content: `Нашел для вас ближайшее событие: "${firstEvent.title}". Интересно?`,
            type: 'event-card',
            payload: { eventId: firstEvent.id },
          },
        });
      }
    } else if (userText.includes('курс')) {
      const firstCourse = await this.prisma.course.findFirst({
        orderBy: { createdAt: 'desc' },
      });

      if (firstCourse) {
        assistantResponse = await this.prisma.assistantChatMessage.create({
          data: {
            authorId,
            sender: 'ASSISTANT',
            content: `Могу предложить вам курс: "${firstCourse.title}". Хотите узнать подробнее?`,
            type: 'course-card',
            payload: { courseId: firstCourse.id },
          },
        });
      }
    }

    if (!assistantResponse) {
      assistantResponse = await this.prisma.assistantChatMessage.create({
        data: {
          authorId,
          sender: 'ASSISTANT',
          content: 'Я пока не понял ваш запрос. Может, вас интересуют события или курсы?',
          type: 'suggestion-chips',
          payload: { suggestions: ['Ближайшие события', 'Доступные курсы'] },
        },
      });
    }

    return this.mapMessage(assistantResponse);
    // END_BLOCK_POST_MESSAGE
  }
}

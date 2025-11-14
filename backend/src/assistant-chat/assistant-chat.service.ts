import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from '../events/dto/pagination-query.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class AssistantChatService {
  constructor(private readonly prisma: PrismaService) {}

  private async mapMessage(
    message: Prisma.AssistantChatMessageGetPayload<{}>,
  ): Promise<any> {
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
  }

  async findUserMessages(userId: number, pagination: PaginationQueryDto) {
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;

    const messages = await this.prisma.assistantChatMessage.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return Promise.all(messages.map((msg) => this.mapMessage(msg)));
  }

  async postMessage(authorId: number, dto: CreateMessageDto) {
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
  }
}
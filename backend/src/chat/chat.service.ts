import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationQueryDto } from '../events/dto/pagination-query.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ChatListItemEntity } from './dto/chat-list-item.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async startChat(initiatorId: number, dto: CreateChatDto) {
    const { recipientId } = dto;

    if (initiatorId === recipientId) {
      throw new BadRequestException('You cannot start a chat with yourself.');
    }

    const existingChat = await this.prisma.chat.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: initiatorId } } },
          { participants: { some: { userId: recipientId } } },
        ],
      },
    });

    if (existingChat) {
      return existingChat;
    }

    return this.prisma.chat.create({
      data: {
        participants: {
          create: [{ userId: initiatorId }, { userId: recipientId }],
        },
      },
    });
  }

  async createMessage(
    chatId: number,
    authorId: number,
    dto: CreateMessageDto,
  ) {
    const isParticipant = await this.prisma.chatParticipant.findUnique({
      where: {
        userId_chatId: {
          userId: authorId,
          chatId,
        },
      },
    });

    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant of this chat.');
    }

    return this.prisma.$transaction(async (tx) => {
      const message = await tx.chatMessage.create({
        data: {
          chatId,
          authorId,
          content: dto.content,
        },
      });

      await tx.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
      });

      return message;
    });
  }

  async findUserChats(userId: number): Promise<ChatListItemEntity[]> {
    const chats = await this.prisma.chat.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return chats
      .map((chat) => {
        const recipient = chat.participants.find((p) => p.userId !== userId)
          ?.user;
        const lastMessage = chat.messages[0] ?? null;

        if (!recipient) {
          return null;
        }

        return {
          id: chat.id,
          updatedAt: chat.updatedAt,
          recipient: recipient,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
              }
            : null,
        };
      })
      .filter((chat): chat is ChatListItemEntity => chat !== null);
  }

  async findMessages(
    chatId: number,
    userId: number,
    pagination: PaginationQueryDto,
  ) {
    const isParticipant = await this.prisma.chatParticipant.findUnique({
      where: {
        userId_chatId: {
          userId,
          chatId,
        },
      },
    });

    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant of this chat.');
    }

    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;

    return this.prisma.chatMessage.findMany({
      where: { chatId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });
  }
}
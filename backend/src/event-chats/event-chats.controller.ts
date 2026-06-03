import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PaginationQueryDto } from '../events/dto/pagination-query.dto';
import { EventChatMessageEntity } from './entities/event-chat-message.entity';
import { EventChatEntity } from './entities/event-chat.entity';
import { EventChatsService } from './event-chats.service';

@ApiTags('Chats')
@Controller()
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class EventChatsController {
  constructor(private readonly eventChatsService: EventChatsService) {}

  @Get('profile/chats')
  @ApiOperation({ summary: 'Get a list of my event chats' })
  @ApiResponse({ status: 200, type: [EventChatEntity] })
  getMyChats(@CurrentUser() user: User) {
    return this.eventChatsService.findUserChats(user.id);
  }

  @Get('events/:eventId/messages')
  @ApiOperation({ summary: 'Get messages for a specific event chat' })
  @ApiResponse({ status: 200, type: [EventChatMessageEntity] })
  getChatMessages(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.eventChatsService.findChatMessagesByEventId(
      eventId,
      user.id,
      pagination,
    );
  }

  @Post('events/:eventId/messages')
  @ApiOperation({ summary: 'Post a message to a specific event chat' })
  @ApiResponse({ status: 201, type: EventChatMessageEntity })
  postChatMessage(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
    @Body() dto: { text: string },
  ) {
    return this.eventChatsService.createMessageByEventId(eventId, user.id, dto.text);
  }
}

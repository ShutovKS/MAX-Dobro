// FILE: backend/src/event-chats/event-chats.controller.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Authenticated HTTP API for event-scoped chat rooms and messages.
//   SCOPE: GET profile/chats, GET/POST events/:eventId/messages
//   DEPENDS: M-PRISMA, M-AUTH
//   LINKS: M-EVENT-CHATS, V-M-EVENT-CHATS, class-EventChatsService
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   EventChatsController - event chat listing and posting
//   getMyChats - current user's event chat inbox
//   getChatMessages - paginated messages for an event
//   postChatMessage - post a message to an event chat
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

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

// START_CONTRACT: EventChatsController
//   PURPOSE: Expose authenticated event-chat HTTP routes
//   INPUTS: { user: User, eventId: number, pagination: PaginationQueryDto, dto: { text: string } }
//   OUTPUTS: { EventChatEntity[] | EventChatMessageEntity[] | EventChatMessageEntity }
//   SIDE_EFFECTS: none at controller layer
//   LINKS: M-EVENT-CHATS, V-M-EVENT-CHATS
// END_CONTRACT: EventChatsController
@ApiTags('Chats')
@Controller()
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class EventChatsController {
  constructor(private readonly eventChatsService: EventChatsService) {}

  // START_CONTRACT: getMyChats
  //   PURPOSE: List event chats for the current volunteer
  //   INPUTS: { user: User }
  //   OUTPUTS: { Promise<EventChatEntity[]> }
  //   SIDE_EFFECTS: none
  //   LINKS: M-EVENT-CHATS, fn-EventChatsService.findUserChats
  // END_CONTRACT: getMyChats
  @Get('profile/chats')
  @ApiOperation({ summary: 'Get a list of my event chats' })
  @ApiResponse({ status: 200, type: [EventChatEntity] })
  getMyChats(@CurrentUser() user: User) {
    return this.eventChatsService.findUserChats(user.id);
  }

  // START_CONTRACT: getChatMessages
  //   PURPOSE: List paginated messages for one event chat
  //   INPUTS: { eventId: number, user: User, pagination: PaginationQueryDto }
  //   OUTPUTS: { Promise<EventChatMessageEntity[]> }
  //   SIDE_EFFECTS: none
  //   LINKS: M-EVENT-CHATS, fn-EventChatsService.findChatMessagesByEventId
  // END_CONTRACT: getChatMessages
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

  // START_CONTRACT: postChatMessage
  //   PURPOSE: Post a message to an event chat as the current user
  //   INPUTS: { eventId: number, user: User, dto: { text: string } }
  //   OUTPUTS: { Promise<EventChatMessageEntity> }
  //   SIDE_EFFECTS: persists event chat message via service
  //   LINKS: M-EVENT-CHATS, V-M-EVENT-CHATS, BLOCK_POST_EVENT_MESSAGE
  // END_CONTRACT: postChatMessage
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

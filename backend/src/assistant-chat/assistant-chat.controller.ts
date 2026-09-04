// FILE: backend/src/assistant-chat/assistant-chat.controller.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Authenticated HTTP API for volunteer assistant conversation history.
//   SCOPE: GET/POST /assistant-chat/messages
//   DEPENDS: M-PRISMA, M-AUTH
//   LINKS: M-ASSISTANT-CHAT, V-M-ASSISTANT-CHAT, class-AssistantChatService
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   AssistantChatController - list and post assistant messages
//   findUserMessages - paginated history for the current user
//   postMessage - store user text and return assistant reply
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import {
  Body,
  Controller,
  Get,
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
import { AssistantChatService } from './assistant-chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatMessageEntity } from './entities/chat-message.entity';

// START_CONTRACT: AssistantChatController
//   PURPOSE: Expose authenticated assistant-chat HTTP routes
//   INPUTS: { user: User, pagination: PaginationQueryDto, dto: CreateMessageDto }
//   OUTPUTS: { ChatMessageEntity[] | ChatMessageEntity }
//   SIDE_EFFECTS: none at controller layer
//   LINKS: M-ASSISTANT-CHAT, V-M-ASSISTANT-CHAT, fn-findUserMessages, fn-postMessage
// END_CONTRACT: AssistantChatController
@ApiTags('Chat')
@Controller('assistant-chat')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class AssistantChatController {
  constructor(private readonly chatService: AssistantChatService) {}

  // START_CONTRACT: findUserMessages
  //   PURPOSE: Return paginated assistant history for the current user
  //   INPUTS: { user: User, pagination: PaginationQueryDto }
  //   OUTPUTS: { Promise<ChatMessageEntity[]> }
  //   SIDE_EFFECTS: none
  //   LINKS: M-ASSISTANT-CHAT, fn-AssistantChatService.findUserMessages
  // END_CONTRACT: findUserMessages
  @Get('messages')
  @ApiOperation({ summary: 'Get message history for the current user' })
  @ApiResponse({
    status: 200,
    description: 'A paginated list of messages.',
    type: [ChatMessageEntity],
  })
  findUserMessages(
    @CurrentUser() user: User,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.chatService.findUserMessages(user.id, pagination);
  }

  // START_CONTRACT: postMessage
  //   PURPOSE: Send a volunteer message and return the assistant reply
  //   INPUTS: { user: User, dto: CreateMessageDto }
  //   OUTPUTS: { Promise<ChatMessageEntity> }
  //   SIDE_EFFECTS: persists user and assistant rows via service
  //   LINKS: M-ASSISTANT-CHAT, V-M-ASSISTANT-CHAT, BLOCK_POST_MESSAGE
  // END_CONTRACT: postMessage
  @Post('messages')
  @ApiOperation({ summary: 'Send a message to the assistant' })
  @ApiResponse({
    status: 201,
    description: 'Message sent and assistant response received.',
    type: ChatMessageEntity,
  })
  postMessage(@CurrentUser() user: User, @Body() dto: CreateMessageDto) {
    return this.chatService.postMessage(user.id, dto);
  }
}

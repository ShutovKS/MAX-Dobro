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
import { ChatService } from './chat.service';
import { ChatListItemEntity } from './dto/chat-list-item.entity';
import { ChatMessageEntity } from './dto/chat-message.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiTags('Chat')
@Controller('chats')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Start a new chat with a user' })
  @ApiResponse({
    status: 201,
    description: 'Chat created successfully.',
  })
  @ApiResponse({
    status: 200,
    description: 'Chat with this user already exists, returns existing chat.',
  })
  async startChat(@CurrentUser() user: User, @Body() dto: CreateChatDto) {
    return this.chatService.startChat(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: "Get current user's chat list" })
  @ApiResponse({
    status: 200,
    description: "A list of the user's chats.",
    type: [ChatListItemEntity],
  })
  findUserChats(@CurrentUser() user: User) {
    return this.chatService.findUserChats(user.id);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get messages from a specific chat' })
  @ApiResponse({
    status: 200,
    description: 'A paginated list of messages.',
    type: [ChatMessageEntity],
  })
  @ApiResponse({ status: 403, description: 'User is not a participant.' })
  findMessages(
    @Param('id', ParseIntPipe) chatId: number,
    @CurrentUser() user: User,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.chatService.findMessages(chatId, user.id, pagination);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Send a message to a chat' })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully.',
    type: ChatMessageEntity,
  })
  @ApiResponse({ status: 403, description: 'User is not a participant.' })
  createMessage(
    @Param('id', ParseIntPipe) chatId: number,
    @CurrentUser() user: User,
    @Body() dto: CreateMessageDto,
  ) {
    return this.chatService.createMessage(chatId, user.id, dto);
  }
}
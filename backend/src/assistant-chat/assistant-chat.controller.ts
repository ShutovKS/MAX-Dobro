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

@ApiTags('Chat')
@Controller('assistant-chat')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class AssistantChatController {
  constructor(private readonly chatService: AssistantChatService) {}

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
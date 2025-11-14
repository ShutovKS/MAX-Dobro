import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
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
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';
import { StoryEntity } from './dto/story.entity';
import { StoriesService } from './stories.service';

@ApiTags('Stories')
@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a list of all stories' })
  @ApiResponse({ status: 200, type: [StoryEntity] })
  findAll(@CurrentUser() user?: User) {
    return this.storiesService.findAll(user?.id);
  }

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single story by its ID' })
  @ApiResponse({ status: 200, type: StoryEntity })
  @ApiResponse({ status: 404, description: 'Story not found.' })
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user?: User) {
    return this.storiesService.findOne(id, user?.id);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Like a story' })
  @ApiResponse({ status: 204, description: 'Story liked successfully.' })
  @ApiResponse({ status: 409, description: 'Story already liked.' })
  likeStory(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.storiesService.likeStory(id, user.id);
  }

  @Delete(':id/like')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unlike a story' })
  @ApiResponse({ status: 204, description: 'Story unliked successfully.' })
  @ApiResponse({ status: 404, description: 'Like not found.' })
  unlikeStory(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.storiesService.unlikeStory(id, user.id);
  }
}
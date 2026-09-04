// FILE: backend/src/stories/stories.controller.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: REST /stories feed, create, comments, and likes.
//   SCOPE: list/get stories, create story, add comment, like, unlike
//   DEPENDS: M-AUTH
//   LINKS: M-STORIES, V-M-STORIES, M-AUTH
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   StoriesController - REST /stories
//   findAll - GET /stories
//   findOne - GET /stories/:id
//   create - POST /stories
//   addComment - POST /stories/:id/comments
//   likeStory - POST /stories/:id/like
//   unlikeStory - DELETE /stories/:id/like
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import {
  Body,
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
import { StoryEntity } from './entities/story.entity';
import { StoriesService } from './stories.service';

@ApiTags('Stories')
@Controller('stories')
// START_CONTRACT: StoriesController
//   PURPOSE: HTTP adapter for story feed, comments, and likes
//   INPUTS: { StoriesService, User, eventId/text/imageUrl, comment text }
//   OUTPUTS: { StoryEntity, comment, void for like/unlike }
//   SIDE_EFFECTS: none beyond StoriesService calls
//   LINKS: M-STORIES, V-M-STORIES, M-AUTH
// END_CONTRACT: StoriesController
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  // START_BLOCK_QUERY_STORIES
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
  // END_BLOCK_QUERY_STORIES

  // START_BLOCK_CREATE_STORY
  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a story for a completed event' })
  @ApiResponse({ status: 201, type: StoryEntity })
  create(
    @CurrentUser() user: User,
    @Body() dto: { eventId: number; text: string; imageUrl: string },
  ) {
    return this.storiesService.create(user.id, dto);
  }
  // END_BLOCK_CREATE_STORY

  // START_BLOCK_STORY_SOCIAL
  @Post(':id/comments')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a comment to a story' })
  @ApiResponse({ status: 201, description: 'Comment created.' })
  @ApiResponse({ status: 404, description: 'Story not found.' })
  addComment(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() dto: { text: string },
  ) {
    return this.storiesService.addComment(id, user.id, dto.text);
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
  unlikeStory(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.storiesService.unlikeStory(id, user.id);
  }
  // END_BLOCK_STORY_SOCIAL
}

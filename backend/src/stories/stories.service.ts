// FILE: backend/src/stories/stories.service.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Publish stories, comments, and likes for the social feed.
//   SCOPE: map/query stories, create story, add comment, like, unlike
//   DEPENDS: M-PRISMA, M-AUTH
//   LINKS: M-STORIES, V-M-STORIES, M-PRISMA
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   StoriesService - feed, comments, likes
//   findAll - mapped story feed
//   findOne - story with commentsData
//   addComment - create comment and return public author shape
//   create - insert story for an event
//   likeStory - insert StoryLike; P2002 conflict, P2003 not found
//   unlikeStory - delete StoryLike; P2025 not found
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
// START_CONTRACT: StoriesService
//   PURPOSE: Story CRUD and social actions
//   INPUTS: { PrismaService, currentUserId?, storyId, authorId, dto }
//   OUTPUTS: { mapped Story, comment, void for like/unlike }
//   SIDE_EFFECTS: Prisma Story/Comment/StoryLike reads and writes
//   LINKS: M-STORIES, V-M-STORIES, M-PRISMA
// END_CONTRACT: StoriesService
export class StoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // START_BLOCK_MAP_STORY
  private getStoryInclude(currentUserId?: number) {
    return {
      author: {
        select: { id: true, firstName: true, lastName: true, avatarUrl: true },
      },
      event: { select: { id: true, title: true } },
      _count: {
        select: { comments: true, likes: true },
      },
      ...(currentUserId && {
        likes: { where: { userId: currentUserId } },
      }),
    };
  }

  private mapStory(story: any, currentUserId?: number) {
    const { _count, author, event, createdAt, ...rest } = story;
    const result: any = {
      ...rest,
      author: {
        id: author.id,
        name: `${author.firstName || ''} ${author.lastName || ''}`.trim(),
        avatarUrl: author.avatarUrl,
      },
      event: {
        id: event.id,
        name: event.title,
      },
      timestamp: createdAt.toISOString(),
      likes: _count.likes,
      comments: _count.comments,
    };

    if (currentUserId) {
      result.isLiked = story.likes.length > 0;
    }

    return result;
  }
  // END_BLOCK_MAP_STORY

  // START_BLOCK_QUERY_STORIES
  // START_CONTRACT: findAll
  //   PURPOSE: List stories newest-first with optional viewer like flag
  //   INPUTS: { currentUserId?: number }
  //   OUTPUTS: { mapped Story[] }
  //   SIDE_EFFECTS: Prisma Story findMany
  //   LINKS: M-STORIES, V-M-STORIES, M-PRISMA
  // END_CONTRACT: findAll
  async findAll(currentUserId?: number) {
    const stories = await this.prisma.story.findMany({
      include: this.getStoryInclude(currentUserId),
      orderBy: { createdAt: 'desc' },
    });
    return stories.map((story) => this.mapStory(story, currentUserId));
  }

  // START_CONTRACT: findOne
  //   PURPOSE: Load one story and nested comments as commentsData
  //   INPUTS: { id: number, currentUserId?: number }
  //   OUTPUTS: { mapped Story with commentsData }
  //   SIDE_EFFECTS: Prisma Story findUnique
  //   LINKS: M-STORIES, V-M-STORIES, M-PRISMA
  // END_CONTRACT: findOne
  async findOne(id: number, currentUserId?: number) {
    const story = await this.prisma.story.findUnique({
      where: { id },
      include: {
        ...this.getStoryInclude(currentUserId),
        comments: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!story) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }

    const mappedStory = this.mapStory(story, currentUserId);

    mappedStory.commentsData = story.comments.map((comment: any) => {
      const { firstName, lastName, avatarUrl } = comment.author;
      return {
        id: comment.id,
        text: comment.text,
        timestamp: comment.createdAt.toISOString(),
        author: {
          name: `${firstName || ''} ${lastName || ''}`.trim(),
          avatarUrl: avatarUrl,
        },
      };
    });

    delete mappedStory.comments;

    return mappedStory;
  }
  // END_BLOCK_QUERY_STORIES

  // START_CONTRACT: addComment
  //   PURPOSE: Add a comment to an existing story
  //   INPUTS: { storyId: number, authorId: number, text: string }
  //   OUTPUTS: { id, text, timestamp, author }
  //   SIDE_EFFECTS: Prisma Comment create
  //   LINKS: M-STORIES, V-M-STORIES, M-PRISMA
  // END_CONTRACT: addComment
  // START_BLOCK_ADD_COMMENT
  async addComment(storyId: number, authorId: number, text: string) {
    const story = await this.prisma.story.findUnique({ where: { id: storyId } });
    if (!story) {
      throw new NotFoundException(`Story with ID ${storyId} not found`);
    }
    const comment = await this.prisma.comment.create({
      data: { storyId, authorId, text },
      include: {
        author: { select: { firstName: true, lastName: true, avatarUrl: true } },
      },
    });
    const { firstName, lastName, avatarUrl } = comment.author;
    return {
      id: comment.id,
      text: comment.text,
      timestamp: comment.createdAt.toISOString(),
      author: {
        name: `${firstName || ''} ${lastName || ''}`.trim(),
        avatarUrl,
      },
    };
  }
  // END_BLOCK_ADD_COMMENT

  // START_CONTRACT: create
  //   PURPOSE: Publish a story attached to an existing event
  //   INPUTS: { authorId: number, dto: { eventId, text, imageUrl } }
  //   OUTPUTS: { mapped Story }
  //   SIDE_EFFECTS: Prisma Event read and Story create
  //   LINKS: M-STORIES, V-M-STORIES, BLOCK_CREATE_STORY
  // END_CONTRACT: create
  // START_BLOCK_CREATE_STORY
  async create(
    authorId: number,
    dto: { eventId: number; text: string; imageUrl: string },
  ) {
    const event = await this.prisma.event.findUnique({ where: { id: dto.eventId } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${dto.eventId} not found`);
    }

    const story = await this.prisma.story.create({
      data: {
        authorId,
        eventId: dto.eventId,
        text: dto.text,
        imageUrl: dto.imageUrl,
      },
      include: this.getStoryInclude(authorId),
    });

    return this.mapStory(story, authorId);
  }
  // END_BLOCK_CREATE_STORY

  // START_BLOCK_LIKE_STORY
  // START_CONTRACT: likeStory
  //   PURPOSE: Insert a StoryLike; map unique and FK errors
  //   INPUTS: { storyId: number, userId: number }
  //   OUTPUTS: { void }
  //   SIDE_EFFECTS: Prisma StoryLike create; P2002 -> 409, P2003 -> 404
  //   LINKS: M-STORIES, V-M-STORIES, M-PRISMA
  // END_CONTRACT: likeStory
  async likeStory(storyId: number, userId: number): Promise<void> {
    try {
      await this.prisma.storyLike.create({
        data: {
          storyId,
          userId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('You have already liked this story.');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException(`Story with ID ${storyId} not found.`);
        }
      }
      throw error;
    }
  }

  // START_CONTRACT: unlikeStory
  //   PURPOSE: Delete a StoryLike; map missing row to 404
  //   INPUTS: { storyId: number, userId: number }
  //   OUTPUTS: { void }
  //   SIDE_EFFECTS: Prisma StoryLike delete; P2025 -> 404
  //   LINKS: M-STORIES, V-M-STORIES, M-PRISMA
  // END_CONTRACT: unlikeStory
  async unlikeStory(storyId: number, userId: number): Promise<void> {
    try {
      await this.prisma.storyLike.delete({
        where: {
          userId_storyId: {
            userId,
            storyId,
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('You have not liked this story.');
      }
      throw error;
    }
  }
  // END_BLOCK_LIKE_STORY
}

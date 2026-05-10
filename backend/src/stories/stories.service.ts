import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoriesService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findAll(currentUserId?: number) {
    const stories = await this.prisma.story.findMany({
      include: this.getStoryInclude(currentUserId),
      orderBy: { createdAt: 'desc' },
    });
    return stories.map((story) => this.mapStory(story, currentUserId));
  }

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
}

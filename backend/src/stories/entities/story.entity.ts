// FILE: backend/src/stories/entities/story.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for a story feed item with author, event, comments, and like state.
//   SCOPE: media, text, author, event, comments, like/comment counts, isLiked
//   DEPENDS: none
//   LINKS: M-STORIES, V-M-STORIES
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   StoryEntity - OpenAPI story with nested author, event, comments, counts
//   StoryEventInfo - nested event id/title
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PublicUserEntity } from '../../users/entities/public-user.entity';
import { CommentEntity } from './comment.entity';

class StoryEventInfo {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
}

export class StoryEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => PublicUserEntity })
  author: PublicUserEntity;

  @ApiProperty({ type: () => StoryEventInfo })
  event: StoryEventInfo;

  @ApiProperty({ type: [CommentEntity] })
  comments: CommentEntity[];

  @ApiProperty({ description: 'Number of likes' })
  likesCount: number;

  @ApiProperty({ description: 'Number of comments' })
  commentsCount: number;

  @ApiPropertyOptional({
    description: 'Indicates if the current user has liked this story',
  })
  isLiked?: boolean;
}

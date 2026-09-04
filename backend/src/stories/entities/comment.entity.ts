// FILE: backend/src/stories/entities/comment.entity.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Swagger entity for a story comment with author.
//   SCOPE: id, text, createdAt, author
//   DEPENDS: none
//   LINKS: M-STORIES, V-M-STORIES
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   CommentEntity - OpenAPI comment with PublicUserEntity author
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { ApiProperty } from '@nestjs/swagger';
import { PublicUserEntity } from '../../users/entities/public-user.entity';

export class CommentEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => PublicUserEntity })
  author: PublicUserEntity;
}
